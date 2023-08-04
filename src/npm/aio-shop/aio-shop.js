import React from 'react';
import Cart from './cart';
import ProductPage from './product-page';
import List from './list';
import ProductCard from './product-card';
import Shipping from './shipping';
import AIOVariant from './aio-variant';
import getDiscountPercent from './getDiscountPercent';
import CartCountButton from './cart-count-button';
import Factor from './factor';
import AIOStorage from './../aio-storage/aio-storage';
import AIOPopup from '../aio-popup/aio-popup';
import Slider from './slider';
import { Icon } from '@mdi/react';
import { mdiCart } from '@mdi/js';
import './aio-shop.css';
export default function AIOShop(obj = {}) {
    let { 
        id, update, cartCache,checkDiscountCode, getDiscounts = () => { return [] },
        getExtras = () => [], getShippingOptions = () => [],getIconByKey = ()=>'',unit,addText='افزودن به سبد خرید',getProductById,payment
    } = obj
    if (!id) { return }
    let $$ = {
        factor: {},
        changesOfCart:{},
        storage: AIOStorage('aioshop' + id),
        cart: {},
        shipping: {},
        getCartItem({productId,variantId}){
            let cartItem = $$.cart[productId];
            if(!cartItem){return false}
            if(variantId){return cartItem.variants[variantId];}
            return cartItem;
        },
        getCartItems(productId) {
            let productIds;
            if(productId){
                if(!$$.cart[productId]){return []}
                productIds = [productId]
            }
            else{
                productIds = Object.keys($$.cart);
            }
            let result = [];
            for(let i = 0; i < productIds.length; i++){
                let cartItem = $$.cart[productIds[i]];
                let variants = cartItem.variants;
                if(variants){
                    let variantIds = Object.keys(variants);
                    for(let j = 0; j < variantIds.length; j++){
                        let variantId = variantIds[j];
                        let variant = variants[variantId];
                        if(!variant){continue}
                        result.push(variant);
                    }
                }
                else{
                    result.push(cartItem)
                }
            }
            return result;
        },
        getSum(cartItems = $$.getCartItems()){let sum = 0;for(let i = 0; i < cartItems.length; i++){let {count = 0} = cartItems[i]; sum += count;}return sum;},
        getCartCount({productId,variantId}) {
            if(!productId){return this.getSum()}
            let cartItem = $$.getCartItem({productId,variantId});
            if(!cartItem){return 0}
            if(cartItem.variants && !variantId){
                return $$.getSum($$.getCartItems(productId))
            }
            return cartItem ? cartItem.count : 0;
        },
        removeCartItem({productId,variantId}){
            if(variantId){
                $$.removeCartVariant({productId,variantId});
                return;
            }
            let newCart = {};
            for (let pid in $$.cart) { 
                if(pid !== productId){newCart[pid] = $$.cart[pid];}
            }
            $$.cart = newCart;
        },
        removeCartVariant({productId,variantId}){
            let newCart = {};
            for (let pid in $$.cart) { 
                if(pid !== productId){
                    newCart[pid] = $$.cart[pid];
                    continue
                }
                let variants = $$.cart[pid].variants;
                let newVariants = {};
                let hasVariant = false;
                for(let vid in variants){
                    if(vid === variantId){continue}
                    hasVariant = true;
                    newVariants[vid] = variants[vid];
                }
                if(hasVariant){
                    newCart[pid] = {...$$.cart[pid],variants:newVariants}
                }
            }
            $$.cart = newCart;
        },
        setCartCount({count,product,variantId}) {
            if (count === 0) {$$.removeCartItem({productId:product.id,variantId});}
            else { 
                let newCart = {};
                if(variantId){
                    let cartItem = $$.cart[product.id] || {product,variants:{},type:'variant'};
                    cartItem.variants[variantId] = cartItem.variants[variantId] || {...AIOVariant(product).getProperties({variantId}),product};
                    cartItem.variants[variantId].count = count;
                    newCart = {...$$.cart,[product.id]: cartItem};
                }
                else{
                    newCart = { ...$$.cart, [product.id]: { count, product,type:'product',productId:product.id } };
                }
                $$.cart = newCart;
            }
            if (cartCache) { $$.storage.save({ name: 'cart', value: $$.cart }) }
            $$.updateFactor();
            update()
        },
        updateShipping(shipping) {
            $$.shipping = shipping;
        },
        async updateFactor() {
            let discount = 0;
            let total = 0;
            let amount = 0;
            let cartItems = $$.getCartItems();
            let factors = cartItems.map((cartItem) => {
                let { count = 1, product,productId,variantId } = cartItem;
                let {price,discountPercent} = product;
                let sum = getDiscountPercent(discountPercent);
                let itemTotal = count * price;
                total += itemTotal;
                let itemDiscount = itemTotal * sum / 100;
                discount += itemDiscount;
                let itemAmount = itemTotal - itemDiscount;
                amount += itemAmount;
                return { productId,variantId,product, discountPercent:sum, total: itemTotal, discount: itemDiscount, amount: itemAmount }
            })
            let discountItems = await getDiscounts({ factor: { discount, total, amount, factors }, shipping: $$.shipping });
            let discounts = [];
            for (let i = 0; i < discountItems.length; i++) {
                let { title, discountPercent = 0, discount, maxDiscount } = discountItems[i];
                if (discountPercent) {
                    let discount = amount * discountPercent / 100;
                    amount -= discount;
                    if (maxDiscount !== undefined && discount > maxDiscount) { discount = maxDiscount }
                    discounts.push({ discountPercent, maxDiscount, discount, title })
                }
                else if (discount) {
                    amount -= discount;
                    discounts.push({ discount, title })
                }
            }
            let extras = await getExtras({ factor: { discount, discounts, total, amount, factors }, shipping: $$.shipping }) || []
            for(let i = 0; i < extras.length; i++){
                let {amount:Amount} = extras[i];
                amount += Amount;
            }
            let factor = { discount, discounts, total, amount, factors, extras };
            $$.factor = factor;
            return factor;
        },
        openPopup({type,parameter,popupConfig}){
            popupConfig = {
                style:{maxWidth:772},
                ...popupConfig
            }
            if(type === 'cart'){
                $$.popup.addPopup({
                    type:'fullscreen',title:'سبد خرید',
                    body:()=>$$.renderCart(),
                    ...popupConfig
                })
            }
            if(type === 'shipping'){
                $$.popup.addPopup({
                    type:'fullscreen',title:'ثبت نهایی خرید',
                    body:()=>$$.renderShipping(),
                    ...popupConfig
                })
            }
            if(type === 'product'){
                $$.popup.addPopup({
                    type:'fullscreen',title:'ثبت نهایی خرید',
                    body:()=>{
                        return (
                            <div className='h-100'>{$$.renderProductPage(parameter)}</div>
                        )
                    },
                    ...popupConfig
                })
            }
            if(type === 'list'){
                $$.popup.addPopup({
                    type:'fullscreen',title:'لیست',
                    body:()=>{
                        return (
                            <div className='h-100'>{$$.renderList(parameter)}</div>
                        )
                    },
                    ...popupConfig
                })
            }
        },
        renderList({items,config = {}}){
            return <List items={items} config={config} renderProductCard={$$.renderProductCard.bind($$)}/>
        },
        renderPopups(){
            return (
                <AIOPopup
                    getActions={({addPopup,removePopup})=>{
                        $$.popup = {addPopup,removePopup}
                    }}
                />
            )
        },
        renderCartCountButton({product,variantId, config = {}}) {
            let count = $$.getCartCount({productId:product.id,variantId});
            if(config.msf){debugger}
            let {showCart = true} = config;
            if(!showCart){return null}
            let isChangable = $$.isChangable({product,variantId,config});
            let Props = {
                key: product.id + ' ' + variantId,
                product,variantId,
                addText,count,
                setCartCount: isChangable ? ({count})=>$$.setCartCount({count,product,variantId}) : undefined
            };
            return <CartCountButton {...Props} />;
        },
        renderFactor() {
            return <Factor getFactor={()=>$$.factor} unit={unit}/>
        },
        copy(value){
            return JSON.parse(JSON.stringify(value))
        },
        renderShipping() {
            return (
                <Shipping
                    unit={unit}
                    onSubmit={()=>{
                        payment({factor:$$.factor,shipping:$$.shipping,cart:$$.cart})
                    }}
                    getActions={({updateShippingByParent})=>{
                        $$.updateShippingByParent = updateShippingByParent;
                    }}
                    onChange={async (obj)=>{
                        $$.updateShipping({...$$.shipping,...obj});
                        await $$.updateFactor()
                    }}
                    renderProductCard={$$.renderProductCard.bind($$)}
                    renderFactor={$$.renderFactor.bind($$)}
                    getShippingOptions={()=>getShippingOptions({factor:$$.copy($$.factor),shipping:$$.copy($$.shipping)})}
                    checkDiscountCode={checkDiscountCode ? async (discountCode) => {
                        return await checkDiscountCode(discountCode, $$.copy($$.factor));
                    } : undefined}
                    cartItems={$$.getCartItems()}
                    getFactor={()=>$$.factor}
                />
            )
        },
        renderCart() {
            return (
                <Cart
                    unit={unit}
                    renderProductCard={$$.renderProductCard.bind($$)}
                    cartItems={$$.getCartItems()}
                    getFactor={()=>$$.factor}
                    onSubmit={()=>$$.openPopup({type:'shipping'})}
                    getIconByKey={getIconByKey}
                />
            )
        },
        renderProductSlider({items,config = {}}){
            return (
                <Slider
                    config={config}
                    items={items}
                    renderProductCard={$$.renderProductCard.bind($$)}
                />
            )
        },
        validation(key,value){
            if(key === 'renderCartButton render'){
                if(typeof value !== 'function'){console.error('aio shop error => renderCartButton(render). render is not a function'); return false}
            }
        },
        renderCartButton(obj = {}){
            let {render} = obj;
            let cartLength = $$.getCartItems().length
            let onClick = ()=>$$.openPopup({type:'cart'});
            if(render && $$.validation('renderCartButton render',render) !== false){return render({cartLength,onClick})} 
            return (
                <div onClick={onClick} className='as-cart-button'>
                    <Icon path={mdiCart} size={1}/>
                    {!!cartLength && <div className='as-badge-1'>{cartLength}</div>}
                </div>
            )
        },
        async changeShipping(obj){
            $$.updateShipping({...$$.shipping,...obj});
            await $$.updateFactor()
            if($$.updateShippingByParent){$$.updateShippingByParent($$.shipping);}
        },
        isChangable({product,variantId,config = {}}){
            let  { changeCart} = config;
            let {variants = []} = product;
            if(variantId && !variants.length){alert('error 0999545'); return false} 
            if(changeCart !== true){return false}
            if(variants.length && !variantId){return false}
            return true
        },
        renderProductCard({product, variantId,config = {}}) {
            let  { className,html,type = 'horizontal',imageSize } = config;
            let isChangable = $$.isChangable({product,variantId,config});
            return (
                <ProductCard
                    onClick={()=>{
                        $$.openPopup({
                            type:'product',
                            parameter:{product,variantId,config},
                            popupConfig:{title:product.name,id:product.id} 
                        })
                    }}
                    key={product.id + ' ' + variantId}
                    unit={unit}
                    config={{...config,changeCart:isChangable}}
                    getIconByKey={getIconByKey}
                    renderCartCountButton={$$.renderCartCountButton.bind($$)}
                    addText={addText}
                    variantId={variantId}
                    type={type}
                    product={product}
                    imageSize={imageSize}
                    html={html}
                    getCartCount={()=>$$.getCartCount({productId:product.id,variantId})}
                    className={className}
                />
            )
        },
        renderProductPage({product,variantId,config = {}}){
            let {className,addText,onShowComments,importHtml,collections} = config;
            return (
                <ProductPage
                    getIconByKey={getIconByKey}
                    unit={unit}
                    collections={collections}
                    renderCartCountButton={$$.renderCartCountButton.bind($$)}
                    renderProductSlider={$$.renderProductSlider.bind($$)}
                    onShowComments={onShowComments}
                    addText={addText}
                    product={product}
                    variantId={variantId}
                    importHtml={importHtml}
                    getCartCount={({variantId})=>$$.getCartCount({productId:product.id,variantId})}
                    className={className}
                />
            )
        },
        // validateCart(){
        //     if(!getProductById){return}
        //     let cartItems = $$.getCartItems();
        //     for(let i = 0; i < cartItems.length; i++){
        //         let cartItem = cartItems[i];
        //         let oldProduct = cartItem;
        //         debugger;
        //         let newProduct = getProductById(oldProduct.productId,oldProduct.variantId)
        //         let oldProperties = AIOVariant(cartItem.product).getProperties({variantkey:cartItem.variantKey});
        //         if(cartItem.count > )
        //     }
        // }
    }
    $$.cart = cartCache ? $$.storage.load({ name: 'cart', def: {} }) : {};
    //$$.validateCart();
    $$.updateFactor();
    return {
        getCartItems: $$.getCartItems.bind($$),
        setCartCount: $$.setCartCount.bind($$),
        getCartCount: $$.getCartCount.bind($$),
        renderCartCountButton: $$.renderCartCountButton.bind($$),
        renderFactor: $$.renderFactor.bind($$),
        renderProductCard: $$.renderProductCard.bind($$),
        renderShipping: $$.renderShipping.bind($$),
        renderProductSlider:$$.renderProductSlider.bind($$),
        renderCart: $$.renderCart.bind($$),
        renderCartButton:$$.renderCartButton.bind($$),
        changeShipping:$$.changeShipping.bind($$),
        renderProductPage:$$.renderProductPage.bind($$),
        renderPopups:$$.renderPopups.bind($$),
        openPopup:$$.openPopup.bind($$),
        removeCartItem:$$.removeCartItem.bind($$),
        renderList:$$.renderList.bind($$)
    }
}