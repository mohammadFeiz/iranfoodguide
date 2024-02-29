import React, { useEffect, useState } from 'react';
import RVD from 'react-virtual-dom';
import AIOStorage from 'aio-storage';
import AIOPopup from 'aio-popup';
import AIOInput from 'aio-input';
import ACS from 'aio-content-slider';
import {SplitNumber} from 'aio-utils';
import { makeAutoObservable,toJS } from "mobx"
import { observer } from "mobx-react-lite"
import {Icon} from '@mdi/react';
import { mdiArrowDown, mdiArrowUp, mdiCart, mdiCash, mdiCheckBold, mdiChevronDown, mdiChevronUp, mdiClose, mdiDelete, mdiInformation, mdiMinus, mdiPlus, mdiPlusMinus } from '@mdi/js';
import './index.css';
import { 
    I_Cart,I_CartButton,I_Checkout,I_DiscountPercent,I_Factor,I_Factor_details,I_FinalPrice,I_ProductCard,I_pr_detail,I_pr_optionType, 
    I_ProductCard_content,I_ProductPage,I_ProductPage_content,I_ProductSlider,I_AIOShop, I_changeCart, I_AIOShop_context, 
    I_getVariantIcon, I_AIOShop_props, I_VariantLabels, I_cart,I_cart_content, I_cart_product, I_cart_variant, I_checkDiscountCode, 
    I_checkout, I_checkout_content, I_checkout_html, I_checkout_item, I_checkout_radio, I_discount, I_discountPercent, I_extra, I_getCartLength, 
    I_getCartVariants, I_getCheckoutItems, I_getDiscounts, I_getExtras, I_getOptionTypes, I_getVariantByOptionValues, 
    I_openModal, I_pr, I_productCardImageContent, I_productPageImageContent, I_renderCart, I_renderCartButton, I_renderCheckout,
    I_renderProductCard, I_renderProductPage, I_renderProductSlider, I_setCheckout, I_trans, I_v, I_v_ov, I_v_label, I_pr_rate, 
    I_addProductToCart, I_addVariantToCart, I_getNewCartVariant, I_removeVariantFromCart, I_changeCartCount, I_Rates, I_renderRates, 
    I_onPayment, I_closeModal, I_getFinalPrice, I_cart_product_hasVariant, I_cart_product_hasNotVariant, I_getCartCount, I_cartInfo, I_getCartInfo 
} from './types';
import { I_RVD_node } from '../react-virtual-dom/types.js';
//////rvd
export default class AIOShop implements I_AIOShop{
    unit:string;
    popup:any;
    storage:any;
    cart:I_cart;
    shopId:any;
    trans:I_trans;
    checkout:I_checkout;
    setCheckout:I_setCheckout;
    getCheckoutItems:I_getCheckoutItems;
    checkDiscountCode:I_checkDiscountCode;
    getContext:()=>I_AIOShop_context;
    renderProductCard:I_renderProductCard;
    renderProductPage:I_renderProductPage;
    renderProductSlider:I_renderProductSlider;
    renderCart:I_renderCart;
    renderCheckout:I_renderCheckout;
    renderRates:I_renderRates;
    renderCartButton:I_renderCartButton;
    renderPopup:()=>React.ReactNode;
    getVariantIcon:I_getVariantIcon;
    getCartInfo:I_getCartInfo;
    changeCart:I_changeCart;
    setCart:(newCart:I_cart)=>void;
    addProductToCart:I_addProductToCart;
    addVariantToCart:I_addVariantToCart;
    getNewCartVariant:I_getNewCartVariant;
    removeVariantFromCart:I_removeVariantFromCart;
    changeCartCount:I_changeCartCount;
    getFinalPrice:I_getFinalPrice;
    getDiscountPercent:(discountPercent:I_discountPercent[])=>number;
    getCartCount:I_getCartCount;
    getCartVariants:I_getCartVariants;
    getCartLength:I_getCartLength;
    getOptionTypes:I_getOptionTypes;
    getVariantByOptionValues:I_getVariantByOptionValues;
    openModal:I_openModal;
    closeModal:I_closeModal;
    productPageImageContent:I_productPageImageContent;
    productCardImageContent:I_productCardImageContent;
    cartContent:I_cart_content;
    checkoutContent:I_checkout_content;
    getDiscounts:I_getDiscounts;
    getExtras:I_getExtras;
    productCardContent:I_ProductCard_content;
    productPageContent:I_ProductPage_content;
    onPayment:I_onPayment;
    constructor(props:I_AIOShop_props){
        for(let prop in props){this[prop] = props[prop]}
        this.setCheckout = (checkout:I_checkout)=>{this.checkout = checkout};
        this.popup = new AIOPopup();
        let storage = AIOStorage(`ShopClass_${this.shopId}`);
        let cart:I_cart;
        if(props.cart === 'cache'){cart = storage.load({name:'cart',def:[]})}
        else if(Array.isArray(props.cart)){cart = props.cart}
        else {cart = []}
        this.cart = cart;
        this.storage = storage;
        this.checkout = {};
        this.renderPopup = ()=>this.popup.render()
        this.getOptionTypes = (variants:I_v[]) => {
            let dic:{[key:string]:I_pr_optionType} = {}
            for(let i = 0; i < variants.length; i++){
                let {optionValues} = variants[i];
                for(let j = 0; j < optionValues.length; j++){
                    let optionValue:I_v_ov = optionValues[j];
                    let {typeId,typeName,valueId,valueName} = optionValue;
                    if(!dic[typeId.toString()]){dic[typeId.toString()] = {id:typeId,name:typeName,values:[]}} 
                    if(!dic[typeId.toString()].values.find((o)=>o.id === valueId)){
                        dic[typeId.toString()].values.push({id:valueId,name:valueName})
                    }
                }
            }
            return Object.keys(dic).map((key)=>dic[key]);
        }
        this.getContext = ()=>{
            let context:I_AIOShop_context = {
                unit:this.unit,cart:this.cart,
                changeCart:this.changeCart.bind(this),
                getCartCount:this.getCartCount.bind(this),
                getCartVariants:this.getCartVariants.bind(this),
                getVariantByOptionValues:this.getVariantByOptionValues.bind(this),
                getOptionTypes:this.getOptionTypes.bind(this),
                productPageImageContent:this.productPageImageContent,
                productCardImageContent:this.productCardImageContent,
                productCardContent:this.productCardContent,
                productPageContent:this.productPageContent,
                cartContent:this.cartContent,
                getCartInfo:this.getCartInfo.bind(this),
                checkoutContent:this.checkoutContent,
                getDiscounts:this.getDiscounts,
                getExtras:this.getExtras, 
                getFinalPrice:this.getFinalPrice.bind(this),
                openModal:this.openModal.bind(this),
                closeModal:this.closeModal.bind(this),
                checkout:this.checkout,
                getCheckoutItems:this.getCheckoutItems,
                setCheckout:this.setCheckout,
                checkDiscountCode:this.checkDiscountCode,  
                onPayment:this.onPayment,
                trans:this.trans,
            }
            return context;
        }
        this.getCartInfo = (product:I_pr,variantId?:any) => {
            if(!product.hasVariant){return product.cartInfo}
            let {defaultVariantId = product.variants[0].id} = product
            if(variantId === undefined){variantId = defaultVariantId}
            let variant:I_v = product.variants.find((o:I_v)=>o.id === variantId);
            return variant.cartInfo
        }
        this.getDiscountPercent = (discountPercent:I_discountPercent[])=>{
            let dp = 0;
            for(let i = 0; i < discountPercent.length; i++){dp += discountPercent[i].value;}
            return dp;
        }
        this.getFinalPrice = (cartInfo:I_cartInfo)=>cartInfo.price - (cartInfo.price * this.getDiscountPercent(cartInfo.discountPercent) / 100)
        this.getCartCount = (product:I_pr,variantId?:any)=>{
            if(product.hasVariant){
                if(!variantId){alert('aio-shop error : in calling getCartCount missing variantId parameter for product by hasVariant=true'); return 0}
                let cartVariants:I_cart_variant[] = this.getCartVariants(product.id);
                if(!cartVariants.length){return 0}
                let cartVariant:I_cart_variant = cartVariants.find((o:I_cart_variant)=>o.id === variantId)
                return !cartVariant?0:cartVariant.count
            }
            else {
                let cartProduct:I_cart_product_hasNotVariant = this.cart.find((o:I_cart_product)=>o.product.id === product.id) as I_cart_product_hasNotVariant;
                return !cartProduct?0:cartProduct.count;
            }
        }
        this.getCartVariants = (productId)=>{
            let cartProduct:I_cart_product_hasVariant = this.cart.find((o:I_cart_product)=>o.product.id === productId) as I_cart_product_hasVariant
            if(!cartProduct){return []}
            let cartVariants:I_cart_variant[] = cartProduct.variants;
            return cartVariants
        }
        this.getCartLength = ()=>{
            let res = 0;
            for(let i = 0; i < this.cart.length; i++){
                let cartProduct:I_cart_product = this.cart[i];
                if(cartProduct.product.hasVariant){
                    let {variants} = cartProduct as I_cart_product_hasVariant;
                    for(let j = 0; j < variants.length; j++){
                        let {count}:I_cart_variant = variants[j]
                        res += count;
                    }
                }
                else {
                    let {count} = cartProduct as I_cart_product_hasNotVariant;
                    res += count;
                }
            }
            return res;
        }
        this.getVariantByOptionValues = (product:I_pr,optionValues:I_v_ov[])=>{
            let dic = {}
            for(let i = 0; i < optionValues.length; i++){
                let {typeId,valueId} = optionValues[i];
                dic[typeId.toString()] = valueId;
            }
            let variant:I_v = product.variants.find((variant:I_v)=>{
                let {optionValues} = variant;
                for(let i = 0; i < optionValues.length; i++){
                    let {typeId,valueId} = optionValues[i];
                    if(dic[typeId.toString()] !== valueId){return false}
                }
                return true
            })
            return variant
        }
        this.setCart = (newCart:I_cart)=>this.cart = newCart;
        this.getNewCartVariant = (p)=>{
            let {product,variantId,count} = p;
            let variant = product.variants.find((v:I_v)=>v.id === variantId);
            let {id} = variant;
            let cartVariant:I_cart_variant = {id,count};
            return cartVariant; 
        }
        this.addProductToCart = (p)=>{
            let cart = toJS(this.cart);
            let newCartProduct:I_cart_product;
            if(p.product.hasVariant){
                let {product,count,variantId} = p;
                let newCartVariant:I_cart_variant = this.getNewCartVariant({product,count,variantId});
                newCartProduct = {product,variants:[newCartVariant]} as I_cart_product_hasVariant
            }
            else {
                let {product,count} = p;
                newCartProduct = {product,count} as I_cart_product_hasNotVariant
            }
            let newCart:I_cart = [...cart,newCartProduct] 
            return newCart;
        }
        this.addVariantToCart = (p)=>{
            let cart = toJS(this.cart);
            let {product} = p;
            let newCart:I_cart = cart.map((o:I_cart_product_hasVariant)=>{
                if(o.product.id !== product.id){return o}
                let newCartVariant:I_cart_variant = this.getNewCartVariant(p);
                let newCartProduct:I_cart_product_hasVariant = {...o,variants:[...o.variants,newCartVariant]}
                return newCartProduct;
            })
            return newCart;
        }
        this.removeVariantFromCart = (p)=>{
            let cart = toJS(this.cart);
            let {product,variantId} = p;
            let cartProduct:I_cart_product_hasVariant = cart.find((o:I_cart_product)=>o.product.id === product.id) as I_cart_product_hasVariant;
            let newCartVariants = cartProduct.variants.filter((o:I_cart_variant)=>o.id !== variantId);
            let newCart:I_cart;
            if(!newCartVariants.length){
                newCart = cart.filter((o:I_cart_product)=>o.product.id !== product.id);
            }
            else {
                let newCartProduct:I_cart_product = {...cartProduct,variants:newCartVariants}
                newCart = cart.map((o:I_cart_product)=>o.product.id === product.id?newCartProduct:o)
            }
            return newCart;
        }
        this.changeCartCount = (p):I_cart=>{
            let {cartProduct,cartVariant,count} = p;
            let cart = toJS(this.cart),{product} = cartProduct,newCartProduct:I_cart_product;
            if(cartVariant){
                let {variants:cvs} = cartProduct as I_cart_product_hasVariant;
                let {id:variantId} = cartVariant;
                let newCartVariants:I_cart_variant[] = cvs.map((o:I_cart_variant)=>{
                    if(o.id !== variantId){return o}
                    return this.getNewCartVariant({product,variantId,count})
                });
                newCartProduct = {...cartProduct,variants:newCartVariants} as I_cart_product_hasVariant;
            }
            else {newCartProduct = {...cartProduct,count} as I_cart_product_hasNotVariant;}
            return cart.map((o:I_cart_product)=>o.product.id !== product.id?o:newCartProduct);
        }
        this.changeCart = (p)=>{
            let {product,variantId,count} = p;
            let {hasVariant} = product;
            let newCart:I_cart;
            let cart = toJS(this.cart);
            if(count === 0){
                let p = {product,variantId,count};
                newCart = hasVariant ? this.removeVariantFromCart(p) : cart.filter((o:I_cart_product)=>o.product.id !== product.id)
            }
            else {
                let cartProduct:I_cart_product = cart.find((o:I_cart_product)=>o.product.id === product.id);
                if(!cartProduct){newCart = this.addProductToCart({product,variantId,count});}
                else if(hasVariant){
                    let cartVariant:I_cart_variant = (cartProduct as I_cart_product_hasVariant).variants.find((o:I_cart_variant)=>o.id === variantId);
                    newCart = !cartVariant ? this.addVariantToCart({product,variantId,count}) : this.changeCartCount({cartProduct,cartVariant,count});
                }
                else {newCart = this.changeCartCount({cartProduct,count})}
            }
            this.setCart(newCart);
        }
        this.renderProductCard = (p:I_ProductCard)=><ProductCard {...p} getContext={this.getContext}/>;
        this.renderCartButton = (p:I_CartButton)=><CartButton {...p} getContext={this.getContext}/>;
        this.renderProductPage = (p:I_ProductPage)=><ProductPage {...p} getContext={this.getContext}/>;
        this.renderProductSlider = (p:I_ProductSlider)=><ProductSlider {...p} getContext={this.getContext}/>;
        this.renderCart = ()=><Cart getContext={this.getContext}/>;
        this.renderRates = (p:I_Rates)=><Rates {...p} getContext={this.getContext}/>;
        this.renderCheckout = ()=><Checkout getContext={this.getContext}/>;
        this.openModal = (p)=>{
            let {title,render,position,backdrop,id} = p;
            let header = title?{title}:false;
            this.popup.addModal({id,position,header,body:{render,attrs:{style:{height:'100%'}}},backdrop})
        }
        this.closeModal = (id?:string)=>this.popup.removeModal(id);
        makeAutoObservable(this)
    }
}
const Checkout = observer((props: I_Checkout) => {
    let {getContext} = props,context = getContext();
    let {cart,getCheckoutItems = ()=>[],checkout,setCheckout,checkoutContent = ()=> false} = context;
    let checkoutItems:I_checkout_item[] = getCheckoutItems(context);
    let [content,setContent] = useState<React.ReactNode>();
    async function getContent(){
        let content:React.ReactNode | false = await checkoutContent(context);
        if(content){setContent(content)}
    }
    function change(changeObject: any) {
        let newCheckout:I_checkout = { ...checkout, ...changeObject }
        setCheckout(newCheckout);
    }
    useEffect(() => {
        let checkout:I_checkout = {};
        for (let i = 0; i < checkoutItems.length; i++) {
            let checkoutItem = checkoutItems[i];
            let { value, field } = checkoutItem;
            if (!field) { continue; }
            checkout[field] = value;
        }
        setCheckout(checkout);
        getContent();
    }, []);
    function cartProducts_layout():I_RVD_node {
        return {
            className:'aio-shop-checkout-products',
            column:cart.map((cartProduct:I_cart_product)=>{
                let {product} = cartProduct;
                let props:I_ProductCard = {product,cartButton:'readonly',type:'hs',getContext}
                let node:I_RVD_node = {className:'aio-shop-checkout-product',html:<ProductCard {...props}/>}
                return node
            })
        }
    }
    function items_layout():I_RVD_node {
        if (!checkoutItems.length) { return false }
        return {
            className:'aio-shop-checkout-items',
            column: checkoutItems.map((checkoutItem: I_checkout_item, i) => {
                let { show = ()=> true,type} = checkoutItem;
                if (show(context) === false) { return false }
                if (type === 'html') { return itemHtml_layout(checkoutItem as I_checkout_html) }
                else if(type === 'radio'){return itemRadio_layout(checkoutItem as I_checkout_radio)}
            })
        }
    }
    function itemHtml_layout(checkoutItem:I_checkout_html):I_RVD_node {
        let { title, subtitle, html,field } = checkoutItem;
        let content:React.ReactNode = html(checkout[field],(newValue)=>change({[field]:newValue}))
        let className = `aio-shop-checkout-item aio-shop-box`;
        return {
            className,
            column:[
                {
                    gap:3,align:'v',
                    row:[
                        {html:title,className:'aio-shop-box-title'},
                        {show:!!subtitle,html:()=>subtitle,className:'aio-shop-box-subtitle'}
                    ]
                },
                { html: content }
            ]
        }
    }
    function itemRadio_layout(checkoutItem:I_checkout_radio):I_RVD_node {
        let { title, subtitle } = checkoutItem;
        let className = `aio-shop-checkout-item aio-shop-checkout-item-radio aio-shop-box`;
        return {
            className,
            column:[
                {
                    gap:3,align:'v',
                    row:[
                        {html:title,className:'aio-shop-box-title'},
                        {show:!!subtitle,html:()=>subtitle,className:'aio-shop-box-subtitle'}
                    ]
                },
                radio_layout(checkoutItem)
            ]
        }
    }
    function radio_layout(checkoutItem:I_checkout_radio):I_RVD_node{
        let { options, field, multiple } = checkoutItem;
        return {
            html: (
                <AIOInput
                    type='radio' multiple={multiple}
                    options={options.map((o) => { return { ...o, before: o.icon } })}
                    optionAttrs={()=>{return {className:'aio-shop-checkout-item-radio-option'}}}
                    value={checkout[field]}
                    onChange={(value:any) => change({ [field]: value })}
                />
            )
        }
    }
    function content_layout():I_RVD_node{return !content?false:{className:`aio-shop-checkout-content aio-shop-box`,html:content}}
    function factor_layout():I_RVD_node {
        let props:I_Factor = {getContext,renderIn:'checkout',mode:'details'}
        return { html: <Factor {...props}/>,className:'aio-shop-checkout-factor' }
    }
    function footer_layout():I_RVD_node {
        let props:I_Factor = {getContext,renderIn:'checkout',mode:'payment'}
        return { html: <Factor {...props}/>,className:'checkout-footer' }
    }
    return (
        <RVD
            layout={{
                className:'aio-shop-checkout',
                column: [
                    {flex: 1, className: 'aio-shop-checkout-body',column: [cartProducts_layout(),items_layout(),content_layout(),factor_layout()]},
                    footer_layout(),
                ]
            }}
        />
    )
})
const Cart = observer((props:I_Cart) => {
    let { getContext } = props,context = getContext();
    let {cart} = context;    
    console.log(toJS(cart))
    let [content,setContent] = useState<React.ReactNode>();
    async function getContent(){
        if(typeof context.cartContent !== 'function'){return}
        let content:React.ReactNode = await context.cartContent(cart);
        setContent(content);
    }
    useEffect(()=>{getContent()},[cart])
    function body_layout():I_RVD_node{return {className:'aio-shop-cart-body',column:[cartProducts_layout(),content_layout(),factor_layout()]}}
    function cartProducts_layout() {return { className: 'aio-shop-cart-products', column: cart.map((o:I_cart_product) => cartProduct_layout(o)) }}
    function cartProduct_layout(cartProduct:I_cart_product) {
        let {product} = cartProduct;
        let props:I_ProductCard = {product,type:'hs',cartButton:true,getContext}
        let productCard = <ProductCard {...props}/>
        return { className: 'aio-shop-cart-product', html: productCard }
    }
    function content_layout():I_RVD_node{return !content?false:{className:`aio-shop-cart-content aio-shop-box`,html:content}}
    function factor_layout():I_RVD_node{
        let props:I_Factor = {renderIn:'cart',getContext,mode:'details'}
        return {className:'aio-shop-cart-factor',html:<Factor {...props}/>}
    }
    function footer_layout():I_RVD_node{
        let props:I_Factor = {renderIn:'cart',getContext,mode:'payment'}
        return {className:'aio-shop-cart-footer',html:<Factor {...props}/>}
    }
    if (!cart.length) {return (<RVD layout={{className: 'aio-shop-cart',html: 'سبد خرید شما خالی است', align: 'vh'}}/>)}
    return (<RVD layout={{className: 'aio-shop-cart',column: [body_layout(),footer_layout()]}}/>)
})
const Factor = observer((props:I_Factor) => {
    let {renderIn,getContext,mode} = props,context = getContext();
    let {cart,checkout,unit,checkDiscountCode,onPayment} = context;
    let [details,setDetails] = useState<I_Factor_details>({total:0,totalDiscount:0,payment:0,productsDiscount:0,discounts:[],extras:[]})
    let [discountCodeTemp, setDiscountCodeTemp] = useState<string>('');
    let [fetchedDiscountCode, setFetchedDiscountCode] = useState<I_discount | string>('');
    async function getDetails(){
        let {getDiscounts = ()=>[],getExtras = ()=>[]} = context;
        let Discounts:I_discount[] = await getDiscounts({renderIn,cart:toJS(cart),checkout:toJS(checkout)});
        if(!Array.isArray(Discounts)){Discounts = []}
        if(typeof fetchedDiscountCode === 'object' && fetchedDiscountCode.discountPercent && fetchedDiscountCode.maxDiscount){
            Discounts.push({...fetchedDiscountCode,title:'کد تخفیف'})
        }
        let Extras:I_extra[] = await getExtras({renderIn,cart:toJS(cart),checkout:toJS(checkout)});
        if(!Array.isArray(Extras)){Extras = []}
        let totalDiscount = 0,total = 0,payment = 0,productsDiscount = 0;
        for(let i = 0; i < cart.length; i++){
            let {product} = cart[i];
            let {hasVariant} = product;
            if(hasVariant){
                let {variants}:I_cart_product_hasVariant = cart[i] as I_cart_product_hasVariant;
                for(let j = 0; j < variants.length; j++){
                    let cv:I_cart_variant = variants[j];
                    let variant:I_v = product.variants.find((o:I_v)=>o.id === cv.id);
                    let finalPrice = context.getFinalPrice(variant.cartInfo);
                    total += variant.cartInfo.price * cv.count; payment += finalPrice * cv.count;
                }
            }
            else {
                let cartItem = toJS(cart[i]) as I_cart_product_hasNotVariant
                let {count}:I_cart_product_hasNotVariant = cartItem;
                let finalPrice = context.getFinalPrice(product.cartInfo);
                total += product.cartInfo.price * count; payment += finalPrice * count;
            }
            
        }
        productsDiscount = total - payment;
        totalDiscount += productsDiscount;
        let discounts = Discounts.map((discount:I_discount)=>{
            let {discountPercent,maxDiscount = Infinity} = discount;
            let amount = Math.min(maxDiscount,Math.round(payment * discountPercent / 100));
            totalDiscount += amount;
            payment -= amount;
            return {discount,amount}
        })
        let extras = Extras.map((extra:I_extra)=>{payment += extra.amount; return extra})
        let details:I_Factor_details = {total,payment,productsDiscount,discounts,extras,totalDiscount}
        console.log('Factor.getDetails')
        setDetails(details)
    }
    useEffect(()=>{getDetails()},[cart,checkout,fetchedDiscountCode])  
    function discountCode_layout():I_RVD_node {
        if (!checkDiscountCode || renderIn !== 'checkout') { return false }
        let inputClassName,buttonText,buttonClassName;
        let type = typeof fetchedDiscountCode;
        if(fetchedDiscountCode){
            if(type === 'object'){
                inputClassName = 'has-success'; 
                buttonText = <Icon path={mdiCheckBold} size={0.8}/>;
                buttonClassName = 'has-success';
            }
            else if(type === 'string'){
                inputClassName = 'has-error';  
                buttonText = <Icon path={mdiClose} size={0.8}/>;
                buttonClassName = 'has-error';
            }
        }
        else {
            buttonText = 'ثبت'
        }
        return {
            className: `aio-shop-box`,
            column:[
                {align:'v',row:[{html:'کد تخفیف',className:'aio-shop-box-title'}]},
                {
                    className:`aio-shop-factor-discount-code`,
                    row: [
                        {
                            flex: 1,
                            html: (
                                <input
                                    className={inputClassName}
                                    disabled={!!fetchedDiscountCode} placeholder='کد تخفیف را وارد کنید' type='text' value={discountCodeTemp}
                                    onChange={(e) => { setDiscountCodeTemp(e.target.value); setFetchedDiscountCode(undefined) }}
                                />
                            )
                        },
                        {
                            html: (
                                <button
                                    disabled={!fetchedDiscountCode && !discountCodeTemp} className={buttonClassName}
                                    onClick={async () => {
                                        if(fetchedDiscountCode){
                                            setFetchedDiscountCode('');
                                            setDiscountCodeTemp('');
                                            return;    
                                        }
                                        let discountCode:I_discount | string = await checkDiscountCode(discountCodeTemp, context);
                                        setFetchedDiscountCode(discountCode)
                                    }}
                                >{buttonText}</button>
                            )
                        }
                    ]
                },
                discountCodeError_layout()
            ]
        }
    }
    function discountCodeError_layout():I_RVD_node {
        if(!fetchedDiscountCode){return false}
        if (typeof fetchedDiscountCode === 'string') { return { className: 'aio-shop-factor-discount-code-error', html: fetchedDiscountCode } }
        if (typeof fetchedDiscountCode === 'object') { 
            let {maxDiscount,discountPercent} = fetchedDiscountCode;
            let html:string;
            if(maxDiscount){
                if(discountPercent === 100){html = `کد تخفیف ${maxDiscount} ${unit}`}
                else{html = `کد تخفیف ${discountPercent} درصدی تا سقف ${maxDiscount} تومان`}
            }
            else{html = `کد تخفیف ${discountPercent} درصدی`}
            return {className: 'aio-shop-factor-discount-code-success',html} 
        }
    }
    function total_layout(total:number):I_RVD_node{
        return {className:`aio-shop-factor-total aio-shop-factor-row`,align:'v',row:[icon_layout(mdiCash),key_layout('جمع سبد خرید'),amount_layout(total)]}
    }
    function products_discount_layout(amount):I_RVD_node{
        return {
            className:`aio-shop-factor-products-discount aio-shop-factor-row`,align:'v',
            row:[icon_layout(mdiMinus),key_layout('تخفیف کالا ها'),amount_layout(amount)]
        }
    }
    function discount_layout(o:{discount:I_discount,amount:number}):I_RVD_node{
        let {discount,amount} = o;
        return {
            column:[
                {
                    className:`aio-shop-factor-discount aio-shop-factor-row`,align:'v',
                    row:[
                        {
                            column:[
                                {gap:3,align:'v',row:[icon_layout(mdiMinus),key_layout(discount.title),dp_layout(discount)]},
                                {className:'aio-shop-factor-max-discount',show:!!discount.maxDiscount && discount.maxDiscount !== Infinity,html:()=>`تا سقف ${SplitNumber(discount.maxDiscount)} ${unit}`}
                            ]
                        },
                        {flex:1},
                        amount_layout(amount)
                    ]
                },
                
            ]
        }
    }
    function extra_layout(extra:I_extra):I_RVD_node{
        let {title,amount} = extra;
        return {className:`aio-shop-factor-extra aio-shop-factor-row`,align:'v',row:[icon_layout(mdiPlus),key_layout(title),amount_layout(amount)]}
    }
    function amount_layout(amount:number):I_RVD_node{
        return {align:'v',gap:3,row:[{className:'aio-shop-factor-value',html:`${SplitNumber(amount)}`},{className:'aio-shop-factor-unit',html:unit}]}
    }
    function dp_layout(discount:I_discount){return {className:'aio-shop-discount-percent',html:`${discount.discountPercent}%`}}
    function icon_layout(path:any){return {className:'aio-shop-factor-icon',html:<Icon path={path} size={0.6}/>}}
    function key_layout(text:string):I_RVD_node{return {className:'aio-shop-factor-key',html:text,flex:1}}
    async function onSubmit(){
        if(renderIn === 'cart'){
            const render = ()=>{
                let props:I_Checkout = {getContext}
                return <Checkout {...props}/>
            }
            context.openModal({title:'تکمیل خرید',render,id:'checkout'})
        }
        if(renderIn === 'checkout'){
            let res = await onPayment({factor:details,checkout:toJS(checkout)})
            if(res === true){context.closeModal('checkout')}
        }
    }
    function totalDiscount_layout():I_RVD_node{
        if(renderIn !== 'checkout'){return false}
        return {
            className:'aio-shop-factor-total-discount',align:'v',
            row:[icon_layout(mdiMinus),key_layout('مجموع تخفیف ها'),amount_layout(details.totalDiscount)]
        }
    }
    function button_layout():I_RVD_node{
        let text = renderIn === 'cart'?'تکمیل خرید':`پرداخت ${SplitNumber(details.payment)} ${unit}`
        return {className:'aio-shop-factor-continue',html:<button onClick={()=>onSubmit()}>{text}</button>,align:'vh'}
    }
    function payment_layout():I_RVD_node{
        return {
            align:'v',flex:1,
            column:[
                {row:[{flex:1},{html:'مبلغ قابل پرداخت',className:'aio-shop-factor-payment-text'}]},
                {gap:3,align:'v',row:[{flex:1},amount_layout(details.payment)]}
            ]
        }
    }
    if(mode === 'details'){
        let rows:I_RVD_node = false;
        rows = {
            className:`aio-shop-factor-rows aio-shop-box`,
            column:[
                total_layout(details.total),
                products_discount_layout(details.productsDiscount),
                !details.discounts.length?false:{column:details.discounts.map((o)=>discount_layout(o))},
                !details.extras.length?false:{column:details.extras.map((extra:I_extra)=>extra_layout(extra))},
                !details.totalDiscount?false:totalDiscount_layout(),
            ]
        }
        return (<RVD layout={{className:`aio-shop-factor`,column:[discountCode_layout(),rows]}}/>)
    }
    return (<RVD layout={{className:'aio-shop-factor aio-shop-factor-payment',row:[button_layout(),payment_layout()]}}/>)
})
function ProductSlider(props:I_ProductSlider){
    let {title = '',action,before = () => false,after = () => false,products,getContext,icon} = props,context = getContext();
    function header_layout():I_RVD_node{
        if(!title && !action){return false}
        let row:I_RVD_node[] = [
            
        ]
        if(icon){row.push({align:'vh',html:icon})}
        row.push({align:'v',flex:1,html:title,className:'aio-shop-product-slider-title'})
        if(action){row.push({html:action.text,className:'aio-shop-product-slider-action',onClick:action.onClick})}
        return {align:'v',className:'aio-shop-product-slider-header',row}
    }
    function body_layout():I_RVD_node{
        return {className:'aio-shop-product-slider-body',row:[before_layout(),products_layout(),after_layout()]}
    }
    function before_layout():I_RVD_node{
        let res = before(); if(!res){return false}
        return {className:'aio-shop-product-slider-before',html:res}
    }
    function products_layout():I_RVD_node{
        return {
            className:'aio-shop-product-slider-products',
            row:products.map((product:I_pr)=>{
                let cartButton = props.cartButton;
                if(product.hasVariant && cartButton){cartButton = false}
                let p:I_ProductCard = {type:'v',product,cartButton,getContext}
                return {className:'aio-shop-product-slider-product',html:<ProductCard {...p}/>}
            })
        }
    }
    function after_layout():I_RVD_node{
        let res = after(); if(!res){return false}
        return {className:'aio-shop-product-slider-after',html:res}
    }
    return (<RVD layout={{className:'aio-shop-product-slider',column:[header_layout(),body_layout()]}}/>)
}
const ProductPage = observer((props:I_ProductPage) => {
    let {product,variantIds = !product.hasVariant?[]:product.variants.map((o:I_v)=>o.id),getContext} = props,context = getContext();
    let {images,details = [],description,rates = [],hasVariant} = product;
    let [imageContent,setImageContent] = useState<React.ReactNode>()
    let [content,setContent] = useState<React.ReactNode>()
    let [showFull,setShowFull] = useState<{[key:string]:boolean}>({});
    async function getImageContent(){
        if(typeof context.productPageImageContent !== 'function'){return}
        setImageContent(await context.productPageImageContent(product,typeof variant === 'object'?variant.id:undefined))
    }
    async function getContent(){
        if(typeof context.productPageContent !== 'function'){return}
        setContent(await context.productPageContent(product,typeof variant === 'object'?variant.id:undefined))
    }
    useEffect(()=>{getImageContent(); getContent()},[])
    let {trans} = context;
    let [variants] = useState<I_v[]>(getVariants);
    function getVariants(){
        if(!hasVariant){return []}
        return product.variants.filter((o:I_v)=>variantIds.indexOf(o.id) !== -1 && !!o.cartInfo.inStock)
    }
    let [selectedOptionValues,setSelectedOptionValues] = useState<I_v_ov[]>(getInitialOptionValues(variants));
    let [optionTypes] = useState<I_pr_optionType[]>(hasVariant?context.getOptionTypes(variants):[]);
    let variant = hasVariant?context.getVariantByOptionValues(product,selectedOptionValues):false
    
    function changeVariant(optionType:I_pr_optionType,value:{name:string,id:any}){        
        let newOptionValues:I_v_ov[] = selectedOptionValues.map((o:I_v_ov)=>{
            return o.typeId === optionType.id?{typeId:optionType.id,typeName:optionType.name,valueId:value.id,valueName:value.name}:o
        })
        setSelectedOptionValues(newOptionValues); 
    }
    function getInitialOptionValues(variants:I_v[]){
        if(!hasVariant){return []}
        let {defaultVariantId = product.variants[0].id} = product;
        let variantId = props.variantId || defaultVariantId;
        let variant = variants.find((o:I_v)=>o.id === variantId) || variants[0];
        return JSON.parse(JSON.stringify(variant.optionValues))
    }
    function image_content(){return !imageContent?null:<div className='aio-shop-product-page-image-content'>{imageContent}</div>}
    function image_layout():I_RVD_node{return {className:'aio-shop-product-page-image-layout',html:(<>{imageSlider()}{image_content()}</>)}}
    function imageSlider(){
        return (
            <ACS
                autoSlide={false}
                items={images.map((image:string)=>{
                    return <img src={image} alt='' height='240px'/>
                })}
            />
        )
    }
    function name_layout():I_RVD_node{return {html:product.name,className:'aio-shop-product-page-name'}}
    function optionTypes_layout():I_RVD_node{
        if(!hasVariant){return false}
        return {className:`of-visible aio-shop-product-page-option-types aio-shop-box`,column:optionTypes.map((o:I_pr_optionType)=>optionType_layout(o))}
    }
    
    function optionType_layout(optionType:I_pr_optionType):I_RVD_node{
        let {id:optionTypeId,name:optionTypeName,values} = optionType;
        let selectedOptionValue:I_v_ov = selectedOptionValues.find((o:I_v_ov)=>o.typeId === optionTypeId)
        return {
            className:'aio-shop-product-page-option-type',
            column:[
                {className:'aio-shop-product-page-label',html:`${optionTypeName} : ${selectedOptionValue.valueName}`},
                {className:'aio-shop-product-page-option-value-buttons',row:values.map((value:{name:string,id:any})=>optionValueButton_layout(optionType,value,selectedOptionValue))}
            ]
        }
    }
    function optionValueButton_layout(optionType:I_pr_optionType,value:{name:string,id:any},selectedOptionValue:I_v_ov):I_RVD_node{
        let {name:optionValueName,id:optionValueId} = value;
        let active = selectedOptionValue.valueId === optionValueId
        let className = 'aio-shop-product-page-option-value-button' + (active?' active':'');
        let button = <button className={className} onClick={()=>changeVariant(optionType,value)}>{optionValueName}</button>
        return {html:button}
    }
    function label_layout(label:string,field?:string):I_RVD_node{
        return {
            align:'v',className:'aio-show-product-page-label-row',
            row:[
                {html:label,className:'aio-shop-product-page-label',flex:1},
                {
                    className:'aio-shopw-product-page-show-more',show:!!field,align:'v',
                    onClick:()=>setShowFull({...showFull,[field]:!showFull[field]}),
                    row:[
                        {html:<Icon path={showFull[field]?mdiChevronUp:mdiChevronDown} size={0.8}/>},
                        {html:()=>showFull[field]?'نمایش کمتر':'نمایش بیشتر'}
                    ]
                }
            ]
        }
    }
    function details_layout():I_RVD_node{
        if(!details.length){return false}
        let Details:I_pr_detail[] = showFull.details?details:details.slice(0,3);
        return {className:`aio-shop-product-page-details aio-shop-box`,column:[label_layout('مشخصات','details'),{column:Details.map((o:I_pr_detail)=>detail_layout(o))}]}
    }
    function detail_layout(detail:I_pr_detail):I_RVD_node{
        let [key,value] = detail;
        let KEY = {html:`${key}:`,className:'aio-shop-product-page-detail-key'}
        let VALUE = {html:value,className:'aio-shop-product-page-detail-value'}
        return {align:'v',className:'aio-shop-product-page-detail',row:[bullet_layout(),KEY,VALUE]}
    }
    function description_layout():I_RVD_node{
        if(!description){return false}
        let Description = showFull.description?description:description.slice(0,64) + ' ...';
        return {className:`aio-shop-product-page-description aio-shop-box`,column:[label_layout('توضیحات','description'),{className:'aio-shop-product-page-description-text',html:Description}]}
    }
    function bullet_layout():I_RVD_node{return {html:<div className='aio-shop-product-page-detail-bullet'></div>,align:'vh'}}
    function content_layout():I_RVD_node{return !content?false:{className:`aio-shop-product-page-content aio-shop-box`,html:content}}
    function rates_layout():I_RVD_node{
        if(!rates.length){return false}
        let props:I_Rates = {getContext,rates}
        return {className:`aio-shop-product-page-rates aio-shop-box`,column:[label_layout('امتیاز'),{html:<Rates {...props}/>}]}
    }
    function footer_layout():I_RVD_node{return {className:'aio-shop-product-page-footer',row:[cartButton_layout(),{flex:1},amounts_layout()]}}
    function amounts_layout():I_RVD_node{return !variant?false:{className:'aio-shop-product-page-amounts',column:[discount_layout(),finalPrice_layout()]}}
    function icon_layout(path:any,size:number){return {html:<Icon path={path} size={size}/>}}
    function cartButton_layout():I_RVD_node{
        if(hasVariant && !variant){return {className:'aio-shop-product-page-not-exist',align:'vh',row:[icon_layout(mdiInformation,0.9),{html:trans.notExist}]}}
        let props:I_CartButton = {product,variantId:hasVariant?(variant as I_v).id:undefined,readonly:false,getContext}
        return {className:'of-visible',align:'vh',html:<CartButton {...props}/>}
    }
    function discount_layout():I_RVD_node{let props:I_DiscountPercent = {product,getContext}; return {html:<DiscountPercent {...props}/>}}
    function finalPrice_layout():I_RVD_node{let props:I_FinalPrice = {getContext,product}; return {html:<FinalPrice {...props}/>}}
    function body_layout(){
        let column = [image_layout(),name_layout(),optionTypes_layout(),details_layout(),description_layout(),rates_layout(),content_layout()]
        return {flex:1,className:'aio-shop-product-page-body',column}
    }
    return (<RVD layout={{className:'aio-shop-product-page',column:[body_layout(),footer_layout()]}}/>)
})
function Rates(props:I_Rates){
    let {getContext,rates} = props,context = getContext();
    function item_layout(rate:I_pr_rate):I_RVD_node{
        let [key,value] = rate;
        let sliderProps = {direction:'left',className:'aio-shop-rate-item-slider',type:'slider',start:0,end:5,step:0.1,value}
        return {
            className:'aio-shop-rate-item',align:'v',
            row:[{html:key,className:'aio-shop-rate-item-text'},{flex:1,html:<AIOInput {...sliderProps}/>},{html:value,className:'aio-shop-rate-item-value',align:'vh'}]
        }
    }
    return <RVD layout={{className:'aio-shop-product-page-rate-items',column:rates.map((rate:I_pr_rate)=>item_layout(rate))}}/>
}
const CartButton = observer((props:I_CartButton) => {
    let {product,variantId,readonly,getContext} = props;
    let {hasVariant} = product;
    let {trans,changeCart,getCartCount} = getContext();
    let count:number = getCartCount(product,variantId);
    function notExist_layout():I_RVD_node{return {className:`aio-shop-cart-button`,html:<span className='aio-shop-cart-button-not-exist'>{trans.notExist}</span>}}
    function icon_layout():I_RVD_node{return {html:<Icon path={mdiCart} size={0.5}/>,className:'aio-shop-cart-button-icon'}}
    function count_layout(style?:any):I_RVD_node{return {html:count,align:'vh',className:'aio-shop-cart-button-count',style}}
    function changeStep(offset:number){
        let newCount = count + offset;
        if(newCount < min){newCount = min}
        if(newCount > max){newCount = max}
        changeCart({product,variantId,count:newCount})
    }
    function button_layout(dir:number,config?:any):I_RVD_node{
        let {disabled,del} = (config || {});
        let path:any,size:number;
        if(del){path = mdiDelete; size=0.6;} else {path = dir > 0?mdiPlus:mdiMinus; size=0.8;}
        let html:React.ReactNode = <Icon path={path} size={size}/>
        let className = `of-visible ${dir > 0?'aio-shop-cart-button-plus':'aio-shop-cart-button-minus'}`;
        if(disabled){className += ` aio-shop-cart-button-disabled`}
        return {html,align:'vh',className,onClick:(e)=>click(e,dir,del,disabled)}
    }
    function click(event:any,dir:number,del:boolean,disabled:boolean){
        event.stopPropagation();
        if(disabled){return}
        if(del){changeCart({product,variantId,count:0})}
        else{changeStep(dir)}
    }
    function body_layout():I_RVD_node{return {className:'aio-shop-cart-button-body',row:[button_layout(step,{disabled:count >= max}),count_layout(),button_layout(-step,{del:count === Math.max(min,1)})]}}
    function footer_layout():I_RVD_node{
        let showMin = min > 0,showMax = max !== Infinity,showStep = step > 1;
        if(!showMin && !showMax && !showStep){return false}
        return {
            className:'aio-shop-cart-button-footer',align:'v',
            row:[
                {align:'v',show:showMin,className:'aio-shop-cart-button-min',row:[{html:<Icon path={mdiArrowDown} size={0.5}/>},{html:min}]},
                {align:'v',show:showMax,className:'aio-shop-cart-button-max',row:[{html:<Icon path={mdiArrowUp} size={0.5}/>},{html:max}]},
                {align:'v',show:showStep,className:'aio-shop-cart-button-step',row:[{html:<Icon path={mdiPlusMinus} size={0.5}/>},{html:step}]}
            ]
        }
    }
    function getCartInfo(){
        let cartInfo:I_cartInfo = hasVariant?product.variants.find((o:I_v)=>o.id === variantId).cartInfo:product.cartInfo;
        let {min = 0,max = Infinity,step = 1,inStock} = cartInfo
        if(inStock === true){inStock = Infinity}
        else if(inStock === false){inStock = 0;}
        else if(!inStock){inStock = 0;}    
        if(min > inStock){min = inStock}
        if(max > inStock){max = inStock}
        return {min,max,step}
    }
    let {min,max,step} = getCartInfo();
    if(!max){return <RVD layout={notExist_layout()}/>}
    if(readonly){return !count?null:<RVD layout={{className:`aio-shop-cart-button aio-shop-cart-button-readonly`,align:'v',row:[icon_layout(),count_layout({width:'fit-content',padding:'0 1px'})]}}/>}
    if(!count){return <RVD layout={{className:`aio-shop-cart-button`,html:<button className='aio-shop-cart-button-add' onClick={(e)=>{e.stopPropagation(); changeStep(step)}}>{trans.addToCart}</button>}}/>}
    return (<RVD layout={{className:`aio-shop-cart-button`,column:[body_layout(),footer_layout()]}}/>)
})
const ProductCard = observer((props:I_ProductCard) => {
    let {product,type,title,variantId,getContext,cartButton = false} = props,context = getContext(),{unit} = context;
    let {name,images,hasVariant} = product;
    let [imageContent,setImageContent] = useState<React.ReactNode>()
    let [content,setContent] = useState<React.ReactNode>()
    async function getImageContent(){
        if(typeof context.productCardImageContent !== 'function'){return}
        setImageContent(await context.productCardImageContent(product,props.variantId))
    }
    async function getContent(){
        if(typeof context.productCardContent !== 'function'){return}
        setContent(await context.productCardContent(product,props.variantId))
    }
    useEffect(()=>{getImageContent(); getContent();},[])
    let image = images[0];
    let className = `aio-shop-product-card aio-shop-product-card-${type}`;
    function image_layout():I_RVD_node{
        let size = {v:84,h:72,hs:48}[type];
        let sizeKey = {v:'height',h:'width',hs:'width'}[type];
        if(!imageContent || imageContent === null){imageContent = false}
        return {
            size,align:'vh',className:'aio-shop-product-card-image',
            html:(<>
                <img src={image} alt='' {...{[sizeKey]:'100%'}}/>
                {imageContent === false?null:<div className='aio-shop-product-card-image-content'>{imageContent}</div>}
            </>)
        }
    }
    function title_layout():I_RVD_node{return typeof title !== 'string'?false:{html:title,className:'aio-shop-product-card-title',align:'v'}}
    function name_layout():I_RVD_node{return {html:name,className:'aio-shop-product-card-name'}}
    function description_layout():I_RVD_node{
        if(!hasVariant || !variantId){return false}
        let props:I_VariantLabels = {product,variantId,getContext,type:type === 'hs'?'h':'v'}
        return {html:<VariantLabels {...props}/>}
    }
    function content_layout():I_RVD_node{return !content || type === 'hs'?false:{html:content,className:'aio-shop-product-card-content'}}
    function discount_layout():I_RVD_node{
        let props:I_DiscountPercent = {product,variantId,getContext}
        return {className:'aio-shop-product-card-discount-layout',row:[{flex:1},{html:<DiscountPercent {...props}/>}]}
    }
    function finalPrice_layout():I_RVD_node{
        let props:I_FinalPrice = {product,variantId,getContext}
        return {className:'aio-shop-product-card-final-price_layout',row:[{flex:1},{html:<FinalPrice {...props}/>}]}
    }
    function variants_layout():I_RVD_node{
        if(!hasVariant || cartButton === false){return false}
        let cvs:I_cart_variant[] = context.getCartVariants(product.id)
        return !cvs.length?false:{className:'aio-shop-product-card-variants',column:cvs.map((cv:I_cart_variant)=>variant_layout(cv))} 
    }
    function variant_layout(cv:I_cart_variant):I_RVD_node{return {align:'v',className:'aio-shop-product-card-variant',row:[variantDetails_layout(cv),cartButton_layout(cv)]}}
    function variantDetails_layout(cv:I_cart_variant):I_RVD_node{
        let props:I_VariantLabels = {type:'h',product,variantId:cv.id,getContext};
        let fpProps:I_FinalPrice = {getContext,product,variantId:cv.id}
        let dpProps:I_DiscountPercent = {getContext,product,variantId:cv.id,showPrice:false}
        let variant = product.variants.find((o:I_v)=>o.id === cv.id);
        let finalPrice = context.getFinalPrice(variant.cartInfo);
        return {
            flex:1,
            column:[
                {flex:1,html:<VariantLabels {...props}/>},
                {
                    gap:6,style:{fontSize:10},align:'v',
                    row:[
                        {html:<DiscountPercent {...dpProps}/>},
                        {html:<FinalPrice {...fpProps}/>},
                        {html:`(جمع ${SplitNumber(cv.count * finalPrice)} ${unit})`,className:'fs-9'}
                    ]
                }
            ]
        }
    }
    function cartButton_layout(cv?:I_cart_variant):I_RVD_node{
        let props:I_CartButton = {product,variantId:cv?cv.id:undefined,readonly:cartButton === 'readonly' || type === 'hs',getContext}
        return {align:'vh',className:'w-fit',html:<CartButton {...props}/>}
    }
    function click(){
        const render = ()=>{
            let props:I_ProductPage = {getContext,product,variantId}
            return <ProductPage {...props}/>
        }
        context.openModal({title:'جزییات',render,id:'product-page'})
    }
    function v_layout():I_RVD_node{
        let column = [title_layout(),image_layout(),body_layout_v()]
        return {className,onClick:()=>click(),column}
    }
    function body_layout_v():I_RVD_node{
        return {className:'aio-shop-product-card-body',align:'v',flex:1,column:[name_layout(),description_layout(),content_layout(),{flex:1},productAmounts_layout()]}
    }
    function body_layout_h():I_RVD_node{
        return {className:'aio-shop-product-card-body',align:'v',flex:1,column:[name_layout(),description_layout(),content_layout(),{flex:1},productAmounts_layout()]}
    }
    function body_layout_hs():I_RVD_node{
        return {className:'aio-shop-product-card-body',align:'v',flex:1,column:[name_layout(),description_layout(),productAmounts_layout()]}
    }
    function productAmounts_layout():I_RVD_node{
        //در حالت واریانت دار چون قیمت ها در پایین کارت رندر میشه پس قیمت ها رو در بادی کارت نمایش نده
        if(hasVariant && cartButton === true){return false}
        let d = discount_layout(),f = finalPrice_layout(),c = hasVariant?false:cartButton_layout();
        if(type === 'v'){return {align:'v',gap:6,column:[{flex:1,column:[d,f]},c]}}
        if(type === 'h'){return {align:'v',row:[c,{flex:1,column:[d,f]}]}}
        if(type === 'hs'){return {gap:6,row:[c,f,{flex:1},d]}}
    }
    function h_layout():I_RVD_node{
        let body;
        if(type === 'h'){body = body_layout_h()}
        else if(type === 'hs'){body = body_layout_hs()}
        return {
            className,onClick:()=>click(),
            column:[
                {row:[image_layout(),{flex:1,column:[title_layout(),body]}]},
                variants_layout()
            ]
        }
    }
    return (<RVD layout={type === 'v'?v_layout():h_layout()}/>)
})
function DiscountPercent(props:I_DiscountPercent){
    let {product,getContext,showPrice} = props,context = getContext(),{getCartInfo} = context;
    function percents_layout():I_RVD_node{return {align:'v',row:items.map((item)=>percent_layout(item)),className:'aio-shop-discount-percents'}}
    function percent_layout(item:I_discountPercent):I_RVD_node{
        return {html:`${item.value}%`,className:'aio-shop-discount-percent',attrs:item.attrs,onClick:(e)=>{
            e.stopPropagation();
            context.openModal({
                id:'discount-percent',
                position:'center',backdrop:{attrs:{style:{backdropFilter:'blur(3px)'}}},
                render:()=><DiscountPercentModal item={item} context={context}/>
            })
        }}
    }
    function price_layout(price:number):I_RVD_node{return showPrice === false?false:{className:'aio-shop-price',html:SplitNumber(price)}}
    let {discountPercent = [],price} = getCartInfo(product,props.variantId);
    let items = discountPercent.filter((o:I_discountPercent)=>!!o.value);
    return !items.length?null:<RVD layout={{align:'v',className:'aio-shop-discount-row',row:[{flex:1},price_layout(price),percents_layout()]}}/>
}
type I_DiscountPercentModal = {context?:I_AIOShop_context,item:I_discountPercent}
function DiscountPercentModal(props:I_DiscountPercentModal){
    let {item,context} = props;
    return (
        <RVD
            layout={{
                className:'aio-shop-discount-percent-modal',align:'v',
                row:[
                    {html:item.text,className:'aio-shop-discount-percent-modal-text'},
                    {row:[{flex:1},{html:`${item.value}%`,className:'aio-shop-discount-percent',attrs:item.attrs}]}
                ]
            }}
        />
    )
}
function FinalPrice(props:I_FinalPrice){
    let {getContext,product} = props,context = getContext();
    let {unit,getCartInfo} = context
    function price_layout():I_RVD_node{
        let cartInfo:I_cartInfo = getCartInfo(product,props.variantId);
        let {price,discountPercent:dps = []} = cartInfo;
        let dp = 0;
        for(let i = 0; i < dps.length; i++){dp += dps[i].value}
        let finalPrice = Math.round(price - (price * dp / 100))
        return {html:SplitNumber(finalPrice),className:'aio-shop-final-price'}
    }
    function unit_layout():I_RVD_node{return {html:unit,className:'aio-shop-unit'}}
    return (<RVD layout={{className:'gap-3',align:'v',row:[price_layout(),unit_layout()]}}/>)
}
function VariantLabels(props:I_VariantLabels){
    let {product,variantId,getContext,type} = props,context = getContext();
    let {getVariantIcon = ()=>false,getOptionTypes} = context;
    let [items] = useState<I_v_label[]>(getItems())
    function getItems(){
        let variant = product.variants.find((o:I_v)=>o.id === variantId);
        let res:I_v_label[] = [];
        let optionTypes = getOptionTypes(product.variants);
        let {optionValues} = variant;
        for(let i = 0; i < optionValues.length; i++){
            let {typeId,valueId}:I_v_ov = optionValues[i];
            let {name:optionTypeName,values}:I_pr_optionType = optionTypes.find((o:I_pr_optionType)=>o.id === typeId);
            let {name:optionValueName} = values.find((o)=>o.id === valueId)
            let item:I_v_label = [optionTypeName,optionValueName]
            res.push(item)
        }
        return res
    }
    function row_layout(vl:I_v_label):I_RVD_node{
        return {
            className:'aio-shop-variant-label-row',row:[type === 'h'?false:bullet_layout(),icon_layout(vl),key_layout(vl),{html:':',align:'vh'},value_layout(vl)]
        }
    }
    function key_layout(vl:I_v_label):I_RVD_node{return {html:vl[0],className:'aio-shop-variant-label-row-key',align:'v'}}
    function value_layout(vl:I_v_label):I_RVD_node{return {html:vl[1],className:'aio-shop-variant-label-row-value',align:'v'}}
    function icon_layout(vl:I_v_label):I_RVD_node{
        let icon = getVariantIcon(vl);
        return !icon?false:{html:icon,align:'vh',className:'aio-shop-variant-label-icon'}
    }
    function bullet_layout():I_RVD_node{return {html:<div className='aio-shop-variant-label-row-bullet'></div>,align:'vh'}}
    function h_layout(){
        return {
            className:`aio-shop-variant-label-rows aio-shop-variant-label-rows-${type} p-0`,gap:3,
            row:[
                bullet_layout(),
                {align:'v',row:items.map((item:I_v_label)=>row_layout(item)),gap:8,gapHtml:()=>'-',gapAttrs:{className:'align-vh'}}
            ]
        }
    }
    function v_layout(){
        return {
            className:`aio-shop-variant-label-rows aio-shop-variant-label-rows${type}`,
            column:[items.map((item:I_v_label)=>row_layout(item))]
        }
    }
    return (<RVD layout={type === 'h'?h_layout():v_layout()}/>)
}