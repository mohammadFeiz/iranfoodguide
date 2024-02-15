import React, { useEffect, useState } from 'react';
import RVD from 'react-virtual-dom';
import AIOStorage from 'aio-storage';
import AIOPopup from 'aio-popup';
import AIOInput from 'aio-input';
import {SplitNumber} from 'aio-utils';
import { makeAutoObservable } from "mobx"
import { observer } from "mobx-react-lite"
import {Icon} from '@mdi/react';
import { mdiCart, mdiMinus, mdiPlus } from '@mdi/js';
type I_product_optionType = {
    id:any,name:string,values:{name:string,id:any}[]
}
type I_variant_optionValue = {optionTypeId:any,optionValueId:any,optionTypeName:string,optionValueName:string}
type I_discountPercent_item = {value:number,name:string,id:any};
type I_discountPercent = I_discountPercent_item[]
type I_cartInfo = {inStock:number,min:number,max:number,step:number}
type I_variant = {id:any,price:number,discountPercent:I_discountPercent,cartInfo:I_cartInfo,optionValues:I_variant_optionValue[]}
type I_product_rates = {[id:string]:{name:string,value:number}}
type I_product_detail = [key:string,value:string];
type I_product = {
    images:string[],
    props?:any,
    id:any,
    name:string,
    optionTypes:I_product_optionType[],
    details?:I_product_detail[],
    description?:string,
    defaultVariantId:any,
    rate?:number,
    rates:I_product_rates,
    variants:I_variant[]
}
type I_ProductCard_type = 'h' | 'v' | 'hs'
type I_ProductCard_cartButton = boolean | 'readonly';
type I_ProductCard = {
    product:I_product,
    variantId?:any,
    type:I_ProductCard_type,
    content?:(product:I_product,variantId?:any)=>React.ReactNode,
    cartButton:I_ProductCard_cartButton,
    attrs?:any,
    title?:string,
    context?:I_ShopClass_context 
}
type I_ProductSlider = {
    context?:I_ShopClass_context,
    before?:()=>React.ReactNode,
    after?:()=>React.ReactNode,
    title?:string,
    action?:I_action,
    products:I_product[],
    cartButton:I_ProductCard_cartButton
}
type I_ProductPage = {
    product:I_product,variantId?:any,variantIds?:any[],context?:I_ShopClass_context,
    content?:(product:I_product,variantId?:any)=>React.ReactNode
}
type I_Cart = {
    context:I_ShopClass_context
}
type I_action = {text:string,onClick:()=>void}
type I_CartButton = {
    product:I_product,variantId:any,context?:I_ShopClass_context,readonly:boolean
}
type I_discount = { discountPercent?: number; maxDiscount?: number; title: string; }
type I_extra = { title: string, amount: number }
type I_productPageImageContent = (product:I_product,variantId?:any)=>Promise<React.ReactNode>;
type I_productCardImageContent = (product:I_product,variantId?:any)=>Promise<React.ReactNode>;
type I_ProductCard_content = (product:I_product,variantId?:any)=>Promise<React.ReactNode>;
type I_ProductPage_content = (product:I_product,variantId?:any)=>Promise<React.ReactNode>;
type I_cart_content = (cart:I_cart)=>Promise<React.ReactNode>;
type I_checkout_content = (context:I_ShopClass_context)=>Promise<React.ReactNode>;
type I_getDiscounts = (renderIn:'cart' | 'checkout',context:I_ShopClass_context)=>Promise<I_discount[]>
type I_getExtras = (renderIn:'cart' | 'checkout',context:I_ShopClass_context)=>Promise<I_extra[]>
type I_trans = {addToCart:string,notExist:string};
type I_ShopClass_context = {
    unit:string,cart:I_cart,
    cls:{[key:string]:string},
    getVariantIcon?:I_ShopClass_getVariantIcon,
    changeCart:I_ShopClass_changeCart,
    getCartVariant:I_getCartVariant,
    getCartVariants:I_getCartVariants,
    getVariantByOptionValues:I_getVariantByOptionValues,
    productPageImageContent:I_productPageImageContent,
    productCardImageContent:I_productCardImageContent,
    productCardContent:I_ProductCard_content,
    productPageContent:I_ProductPage_content,
    cartContent:I_cart_content,
    checkoutContent:I_checkout_content,
    getDiscounts:I_getDiscounts,
    getExtras:I_getExtras,
    openModal:I_openModal,
    checkout:I_checkout,
    getCheckoutItems:I_getCheckoutItems,
    setCheckout:I_setCheckout,
    checkDiscountCode:I_checkDiscountCode,
    trans:I_trans,
}
type I_ShopClass_getVariantIcon = (key:string,value:string)=>React.ReactNode;
type I_ShopClass_changeCart = (p:{product:I_product,variantId:any,count:number})=>void;
type I_getCartVariant = (p:{product:I_product,variantId:any})=>I_cart_variant | false;
type I_getCartVariants = (productId:any)=>I_cart_variant[];
type I_getVariantByOptionValues = (product:I_product,optionValues:I_variant_optionValue[])=>I_variant;
type I_renderProductCard = (p:I_ProductCard)=>React.ReactNode;
type I_renderProductPage = (p:I_ProductPage)=>React.ReactNode;
type I_renderProductSlider = (p:I_ProductSlider)=>React.ReactNode;
type I_renderCart = (P:I_Cart)=>React.ReactNode;
type I_renderCheckout = (P:I_Checkout)=>React.ReactNode;
type I_openModal = (p:{position?:'fullscreen' | 'center' | 'left' | 'right' | 'top' | 'bottom',title:string,render:()=>React.ReactNode})=>void;
type I_renderCartButton = (p:I_CartButton)=>React.ReactNode;
type I_checkout_option = { text: string, value: any,icon?:React.ReactNode };
type I_checkout_item = I_checkout_radio | I_checkout_html;
type I_checkout_html = {
    type:'html',title: string,subtitle?: string,field: string,value: any,html:(value:any,change:(newValue:any)=>void) => React.ReactNode,
    show?:(context:I_ShopClass_context)=>boolean
}
type I_checkout_radio = {
    type:'radio',title: string,subtitle?: string,field: string,value: any,options?: I_checkout_option[],multiple?:boolean,
    show?:(context:I_ShopClass_context)=>boolean
}
type I_checkout = {[key:string]:any}
type I_getCheckoutItems = (context:I_ShopClass_context)=>I_checkout_item[];
type I_setCheckout = (checkout:I_checkout)=>void;
type I_checkDiscountCode = (discountCode:string,context:I_ShopClass_context)=>Promise<I_discount | string>
type I_ShopClass_props = {
    unit:string,shopId:any,
    getVariantIcon?:I_ShopClass_getVariantIcon,
    productPageImageContent?:I_productPageImageContent,
    productCardImageContent?:I_productCardImageContent,
    productCardContent?:I_ProductCard_content,
    productPageContent?:I_ProductPage_content,
    cartContent?:I_cart_content,
    checkoutContent?:I_checkout_content,
    getDiscounts?:I_getDiscounts,
    getExtras?:I_getExtras,
    getCheckoutItems?:I_getCheckoutItems,
    checkDiscountCode?:I_checkDiscountCode,
    trans:I_trans
}
type I_ShopClass = {
    renderProductCard:I_renderProductCard
}
type I_getCartLength = ()=>number;
type I_cart_variant = {id:any,count:number,price:number,finalPrice:number,productId:any,max:number,min:number,step:number};
type I_cart_product = {product:I_product,cartVariants:I_cart_variant[]}
type I_cart = I_cart_product[];
//////rvd
type I_RVD_node = {
    align?:'v' | 'h' | 'vh',
    gap?:number,
    size?:number,
    flex?:number,
    html?:React.ReactNode,
    row?:I_RVD_node[],
    column?:I_RVD_node[],
    attrs?:any,
    className?:string,
    style?:any,
    onClick?:()=>void,
}
//////rvd
class ShopClass implements I_ShopClass{
    unit:string;
    popup:any;
    storage:any;
    cart:I_cart;
    shopId:any;
    trans:I_trans;
    cls:{[key:string]:string};
    checkout:I_checkout;
    setCheckout:I_setCheckout;
    getCheckoutItems:I_getCheckoutItems;
    checkDiscountCode:I_checkDiscountCode;
    getContext:()=>I_ShopClass_context;
    renderProductCard:I_renderProductCard;
    renderProductPage:I_renderProductPage;
    renderProductSlider:I_renderProductSlider;
    renderCart:I_renderCart;
    renderCheckout:I_renderCheckout;
    getVariantIcon:I_ShopClass_getVariantIcon;
    changeCart:I_ShopClass_changeCart;
    setCart:(newCart:I_cart)=>void;
    getFinalPrice:(variant:I_variant)=>number;
    getDiscountPercent:(discountPercent:I_discountPercent)=>number;
    getCartVariant:I_getCartVariant;
    getCartVariants:I_getCartVariants;
    getCartLength:I_getCartLength;
    renderCartButton:I_renderCartButton;
    getVariantByOptionValues:I_getVariantByOptionValues;
    openModal:I_openModal;
    productPageImageContent:I_productPageImageContent;
    productCardImageContent:I_productCardImageContent;
    cartContent:I_cart_content;
    checkoutContent:I_checkout_content;
    getDiscounts:I_getDiscounts;
    getExtras:I_getExtras;
    productCardContent:I_ProductCard_content;
    productPageContent:I_ProductPage_content;
    constructor(props:I_ShopClass_props){
        let {
            unit,getVariantIcon,shopId,trans,
            productPageImageContent,productCardImageContent,productCardContent,productPageContent,cartContent,checkoutContent,
            getDiscounts,getExtras,getCheckoutItems,checkDiscountCode
        } = props;
        this.trans = trans;
        this.productPageImageContent = productPageImageContent;
        this.productCardImageContent = productCardImageContent;
        this.productCardContent = productCardContent;
        this.productPageContent = productPageContent;
        this.checkoutContent = checkoutContent;
        this.getDiscounts = getDiscounts;
        this.getExtras = getExtras;
        this.cartContent = cartContent;
        this.getCheckoutItems = getCheckoutItems;
        this.setCheckout = (checkout:I_checkout)=>{this.checkout = checkout};
        this.checkDiscountCode = checkDiscountCode;        
        this.shopId = shopId;
        this.popup = new AIOPopup();
        let storage = AIOStorage(`ShopClass_${shopId}`);
        this.cart = storage.load({name:'cart',def:[]})
        this.getVariantIcon = getVariantIcon;
        this.unit = unit;
        this.cls = {
            'dr':'as-discount-row',//discount percent row
            'dps':'as-discount-percents',//discount percent row => discount boxes
            'dp':`as-discount-percent`,//discount percent row => discount boxes => discount box
            'unit':'as-unit',//unit
            'pc':'as-product-card',//product card
            'pc-v':'as-product-card-v',//product card vertical
            'pc-h':'as-product-card-h',//product card horizontal
            'pc-hs':'as-product-card-hs',//product card horizontal small
            'pc-image':'as-product-card-image',//product card => product card image
            'pc-image-content':'as-product-card-image-content',//product card => product card image => product card image content
            'pc-title':'as-product-card-title',//product card title
            'pc-name':'as-product-card-name',//product card => product card name
            'pc-desc':'as-product-card-description',//product card => description
            'pc-discount-layout':'as-product-card-discount-layout',//
            'pc-finalPrice_layout':'as-product-card-final-price_layout',//
            'pc-variant':'as-product-card-variant',//
            'pc-content':'as-product-card-content',//product card info
            'final-price':'as-final-price',//final price
            'variant-label-rows':'as-variant-label-rows',//variant label rows
            'variant-label-row':'as-variant-label-row',//variant label row
            'variant-label-row-bullet':'as-variant-label-row-bullet',//variant label row bullet
            'variant-label-row-key':'as-variant-label-row-key',//variant label row key',
            'variant-label-row-value':'as-variant-label-row-value',//variant label row value',
            'variant-label-icon':'as-variant-label-icon',//'variant label icon'
            'variant-label-rows-h':'as-variant-label-rows-h',//variant label rows horizontal
            'variant-label-rows-v':'as-variant-label-rows-v',//variant label rows vertical
            'cb':'as-cart-button',//
            'cb-readonly':'as-cart-button-readonly',//
            'cb-icon':'as-cart-button-icon',//
            'cb-count':'as-cart-button-count',//
            'cb-step':'as-cart-button-step',//
            'cb-add':'as-cart-button-add',//
            'cb-not-exist':'as-cart-button-not-exist',//
            'cb-step-disabled':'as-cart-button-step-disabled',//
            'cb-min':'as-cart-button-min',//
            'cb-max':'as-cart-button-max',//
            'cb-body':'as-cart-button-body',//
            'cb-footer':'as-cart-button-footer',//
            'pp-image_layout':'as-product-page-image-layout',//
            'pp-image-arrow':'as-product-page-image-arrow',//
            'pp-image-arrow-up':'as-product-page-image-arrow-up',//
            'pp-image-arrow-down':'as-product-page-image-arrow-down',//
            'pp-image-content':'as-product-page-image-content',//
            'pp-name':'as-product-page-name',//
            'pp-optionTypes':'as-product-page-option-types',//
            'pp-optionType':'as-product-page-option-type',//
            'pp-optionValue-button':'as-product-page-option-value-button',//
            'pp-label':'as-product-page-label',//
            'pp-details':'as-product-page-details',//
            'pp-detail':'as-product-page-detail',//
            'pp-detail-key':'as-product-page-detail-key',//
            'pp-detail-value':'as-product-page-detail-value',//
            'pp-content':'as-product-page-content',//
            'ps':'as-product-slider',//
            'ps-body':'as-product-slider-body',//
            'ps-header':'as-product-slider-header',//
            'ps-products':'as-product-slider-products',//
            'ps-product':'as-product-slider-product',//
            'ps-before':'as-product-slider-before',//
            'ps-after':'as-product-slider-after',//
        }
        this.getContext = ()=>{
            return {
                unit:this.unit,cart:this.cart,
                cls:this.cls,changeCart:this.changeCart.bind(this),
                getCartVariant:this.getCartVariant.bind(this),
                getCartVariants:this.getCartVariants.bind(this),
                getVariantByOptionValues:this.getVariantByOptionValues.bind(this),
                productPageImageContent:this.productPageImageContent,
                productCardImageContent:this.productCardImageContent,
                productCardContent:this.productCardContent,
                productPageContent:this.productPageContent,
                cartContent:this.cartContent,
                checkoutContent:this.checkoutContent,
                getDiscounts:this.getDiscounts,
                getExtras:this.getExtras, 
                openModal:this.openModal.bind(this),
                checkout:this.checkout,
                getCheckoutItems:this.getCheckoutItems,
                setCheckout:this.setCheckout,
                checkDiscountCode:this.checkDiscountCode,  
                trans:this.trans,
            }
        }
        this.getDiscountPercent = (discountPercent:I_discountPercent)=>{
            let dp = 0;
            for(let i = 0; i < discountPercent.length; i++){dp += discountPercent[i].value;}
            return dp;
        }
        this.getFinalPrice = (variant)=>{
            let dp = this.getDiscountPercent(variant.discountPercent);
            return variant.price - (variant.price * dp / 100)
        }
        this.setCart = (newCart:I_cart)=>this.cart = newCart;
        this.getCartVariant = (p:{product:I_product,variantId?:any})=>{
            let {product,variantId} = p;
            let cartVariants:I_cart_variant[] = this.getCartVariants(product.id);
            if(!cartVariants.length){return false}
            let cartVariant:I_cart_variant = cartVariants.find((o:I_cart_variant)=>o.id === variantId)
            if(!cartVariant){return false}
            return cartVariant
        }
        this.getCartVariants = (productId)=>{
            let cartProduct:I_cart_product = this.cart.find((o:I_cart_product)=>o.product.id === productId)
            if(!cartProduct){return []}
            let cartVariants:I_cart_variant[] = cartProduct.cartVariants;
            return cartVariants
        }
        this.getCartLength = ()=>{
            let res = 0;
            for(let i = 0; i < this.cart.length; i++){
                let {cartVariants}:I_cart_product = this.cart[i];
                for(let j = 0; j < cartVariants.length; j++){
                    let {count}:I_cart_variant = cartVariants[j]
                    res += count;
                } 
            }
            return res;
        }
        this.getVariantByOptionValues = (product:I_product,optionValues:I_variant_optionValue[])=>{
            let dic = {}
            for(let i = 0; i < optionValues.length; i++){
                let {optionTypeId,optionValueId} = optionValues[i];
                dic[optionTypeId.toString()] = optionValueId;
            }
            let variant:I_variant = product.variants.find((variant:I_variant)=>{
                let {optionValues} = variant;
                for(let i = 0; i < optionValues.length; i++){
                    let {optionTypeId,optionValueId} = optionValues[i];
                    if(dic[optionTypeId.toString] !== optionValueId){return false}
                }
                return true
            })
            return variant
        }
        this.changeCart = (p)=>{
            let {product,variantId,count} = p;
            let cartProduct:I_cart_product = this.cart.find((o:I_cart_product)=>o.product.id === product.id);
            let cartVariants = cartProduct.cartVariants;
            let newCartVariants:I_cart_variant[];
            if(count === 0){
                newCartVariants = cartVariants.filter((o:I_cart_variant)=>o.id !== variantId);
            }
            else {
                newCartVariants = cartVariants.map((o:I_cart_variant)=>{
                    let variant = product.variants.find((v:I_variant)=>v.id === o.id);
                    let {price,cartInfo,id} = variant;
                    let {min,max,step} = cartInfo;
                    let finalPrice = this.getFinalPrice(variant);
                    return o.id === variantId?{id,count,price,finalPrice,min,max,step,productId:product.id}:o
                })
            }
            let newCart:I_cart = [];
            if(!newCartVariants.length){
                newCart = this.cart.filter((o:I_cart_product)=>o.product.id !== product.id)
            }
            else {
                let newCartProduct = {...cartProduct,cartVariants:newCartVariants,product}
                newCart = this.cart.map((o:I_cart_product)=>o.product.id === product.id?newCartProduct:o)
            }
            this.setCart(newCart)
        }
        this.renderProductCard = (p:I_ProductCard)=>{
            let props:I_ProductCard = {...p,context:this.getContext()}
            return <ProductCard {...props}/>
        }
        this.renderCartButton = (p:I_CartButton)=>{
            let props:I_CartButton = {...p,context:this.getContext()}
            return <CartButton {...props}/>
        }
        this.renderProductPage = (p:I_ProductPage)=>{
            let props:I_ProductPage = {...p,context:this.getContext()}
            return <ProductPage {...props}/>
        }
        this.renderProductSlider = (p:I_ProductSlider)=>{
            let props:I_ProductSlider = {...p,context:this.getContext()}
            return <ProductSlider {...props}/>
        }
        this.renderCart = (p:I_Cart)=>{
            let props:I_Cart = {...p,context:this.getContext()}
            return <Cart {...props}/>
        }
        this.renderCheckout = (p:I_Checkout)=>{
            let props:I_Checkout = {...p,context:this.getContext()}
            return <Checkout {...props}/>
        }
        this.openModal = (p)=>{
            let {title,render,position} = p;
            this.popup.addModal({position,header:{title},body:{render}})
        }
        makeAutoObservable(this)
    }
}
type I_Checkout = {context:I_ShopClass_context}
const Checkout = observer((props: I_Checkout) => {
    let {context} = props;
    let {cart,getCheckoutItems,checkout,setCheckout,cls,checkoutContent = ()=> false} = context;
    let checkoutItems:I_checkout_item[] = getCheckoutItems(context);
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
    }, []);
    function cartProducts_layout() {
        return {
            className:cls['checkout-products'],
            column:cart.map((cartProduct:I_cart_product)=>{
                let {product} = cartProduct;
                let props:I_ProductCard = {product,cartButton:'readonly',type:'hs',context}
                return {className:cls['checkout-product'],html:<ProductCard {...props}/>}
            })
        }
    }
    function items_layout() {
        if (!checkoutItems.length) { return false }
        return {
            column: checkoutItems.map((checkoutItem: I_checkout_item, i) => {
                let { show = ()=> true,type} = checkoutItem;
                if (show(context) === false) { return false }
                if (type === 'html') { return itemHtml_layout(checkoutItem as I_checkout_html) }
                else if(type === 'radio'){return itemRadio_layout(checkoutItem as I_checkout_radio)}
            })
        }
    }
    function label_layout(title:string,subtitle?:string){
        return {
            row:[
                {html:title,className:cls['checkout-title']},
                {show:!!subtitle,html:()=>`( ${subtitle} )`,className:cls['checkout-subtitle']}, 
            ]
        }
    }
    function itemHtml_layout(checkoutItem:I_checkout_html) {
        let { title, subtitle, html,field } = checkoutItem;
        let content:React.ReactNode = html(checkout[field],(newValue)=>change({[field]:newValue}))
        let className = `${cls['checkout-item']} ${cls['checkout-item-html']}`;
        return {column:[label_layout(title,subtitle),{ html: content,className }]}
    }
    function itemRadio_layout(checkoutItem:I_checkout_radio) {
        let { title, subtitle } = checkoutItem;
        return {column:[label_layout(title,subtitle),radio_layout(checkoutItem)]}
    }
    function radio_layout(checkoutItem:I_checkout_radio){
        let { options, field, multiple } = checkoutItem;
        let className = `${cls['checkout-item']} ${cls['checkout-item-radio']}`;
        return {
            className,
            html: (
                <AIOInput
                    type='radio'
                    multiple={multiple}
                    options={options.map((o) => { return { ...o, before: o.icon } })}
                    optionClassName="as-shipping-option"
                    value={checkout[field]}
                    onChange={(value:any) => change({ [field]: value })}
                />
            )
        }
    }
    function content_layout(){
        let content = checkoutContent(context);
        return !content?false:{className:cls['checkout-content'],html:content}
    }
    function factor_layout() {
        let props:I_Factor = {context,renderIn:'checkout',mode:'details'}
        return { html: <Factor {...props}/>,className:'checkout-factor' }
    }
    function footer_layout() {
        let props:I_Factor = {context,renderIn:'checkout',mode:'amount'}
        return { html: <Factor {...props}/>,className:'checkout-footer' }
    }
    return (
        <RVD
            layout={{
                className:cls['checkout'],
                column: [
                    {
                        flex: 1, className: 'checkout-body',
                        column: [
                            cartProducts_layout(),
                            items_layout(),
                            content_layout(),
                            factor_layout(),
                        ]
                    },
                    footer_layout(),
                ]
            }}
        />
    )
})
const Cart = observer((props:I_Cart) => {
    let { context } = props;
    let {cart,cls,unit} = context;    
    let [content,setContent] = useState<React.ReactNode>();
    async function getContent(){
        let content:React.ReactNode = await context.cartContent(cart);
        setContent(content);
    }
    useEffect(()=>{getContent()},[cart])
    function body_layout(){return {className:cls['cart-body'],column:[cartProducts_layout(),content_layout(),factor_layout()]}}
    function cartProducts_layout() {return { className: 'of-visible p-h-12', column: cart.map((o:I_cart_product) => cartProduct_layout(o)) }}
    function cartProduct_layout(cartProduct:I_cart_product) {
        let {product} = cartProduct;
        let props:I_ProductCard = {product,type:'hs',cartButton:true,context}
        let productCard = <ProductCard {...props}/>
        return { className: cls['c-product'], html: productCard }
    }
    function content_layout(){return !content?false:{className:'c-content',html:content}}
    function factor_layout(){
        let props:I_Factor = {renderIn:'cart',context,mode:'details'}
        return {className:'c-factor-details',html:<Factor {...props}/>}
    }
    function footer_layout(){
        let props:I_Factor = {renderIn:'cart',context,mode:'amount'}
        return {className:'c-factor-footer',html:<Factor {...props}/>}
    }
    if (!cart.length) {return (<RVD layout={{className: cls['cart'],html: 'سبد خرید شما خالی است', align: 'vh'}}/>)}
    return (<RVD layout={{className: cls['cart'],column: [body_layout(),footer_layout()]}}/>)
})
type I_Factor = {renderIn:'cart' | 'checkout',context:I_ShopClass_context,mode:'details' | 'amount'}
type I_Factor_details = {
    price:number,payment:number,productsDiscount:number,
    discounts:{discount:I_discount,amount:number}[],
    discountCode?:{discount:I_discount,amount:number},
    extras:I_extra[]
}
const Factor = observer((props:I_Factor) => {
    let {renderIn,context,mode} = props;
    let {cart,checkout,cls,unit,checkDiscountCode} = context;
    let [details,setDetails] = useState<I_Factor_details>({price:0,payment:0,productsDiscount:0,discounts:[],extras:[]})
    let [discountCodeTemp, setDiscountCodeTemp] = useState<string>('');
    let [fetchedDiscountCode, setFetchedDiscountCode] = useState<I_discount | string>();
    async function getDetails(){
        let {getDiscounts = ()=>[],getExtras = ()=>[]} = context;
        let Discounts:I_discount[] = await getDiscounts(renderIn,context);
        if(typeof fetchedDiscountCode === 'object' && fetchedDiscountCode.discountPercent && fetchedDiscountCode.maxDiscount){
            Discounts.push({...fetchedDiscountCode,title:'کد تخفیف'})
        }
        
        let Extras:I_extra[] = await getExtras(renderIn,context);
        let price = 0,payment = 0,productsDiscount = 0;
        for(let i = 0; i < cart.length; i++){
            let {cartVariants}:I_cart_product = cart[i];
            for(let j = 0; j < cartVariants.length; j++){
                let cv:I_cart_variant = cartVariants[j];
                price += cv.price; payment += cv.finalPrice;
            }
        }
        productsDiscount = price - payment;
        let discounts = Discounts.map((discount:I_discount)=>{
            let {discountPercent,maxDiscount = Infinity} = discount;
            let amount = Math.min(maxDiscount,Math.round(payment * discountPercent / 100));
            payment -= amount;
            return {discount,amount}
        })
        let extras = Extras.map((extra:I_extra)=>{payment += extra.amount; return extra})
        let details:I_Factor_details = {price,payment,productsDiscount,discounts,extras}
        setDetails(details)
    }
    useEffect(()=>{getDetails()},[cart,checkout,fetchedDiscountCode])  
    function discountCode_layout() {
        if (!checkDiscountCode) { return false }
        return {
            className: 'factor-discount-code',
            row: [
                {
                    flex: 1,
                    html: (
                        <input
                            disabled={typeof fetchedDiscountCode === 'object'} placeholder='کد تخفیف' type='text' value={discountCodeTemp}
                            onChange={(e) => { setDiscountCodeTemp(e.target.value); setFetchedDiscountCode(undefined) }}
                        />
                    )
                },
                {
                    html: (
                        <button
                            disabled={typeof fetchedDiscountCode === 'object' || !discountCodeTemp}
                            onClick={async () => {
                                let discountCode:I_discount | string = await checkDiscountCode(discountCodeTemp, context);
                                setFetchedDiscountCode(discountCode)
                            }}
                        >ثبت کد تخفیف</button>
                    )
                }
            ]
        }
    }
    function discountCodeError_layout() {
        if (typeof fetchedDiscountCode !== 'string') { return false }
        return { className: cls['checkout-discount-code-error'], html: fetchedDiscountCode }
    }
    
    function price_layout(price:number){
        return {
            className:cls['c-products-total'],align:'v',
            row:[
                {className:cls['factor-key'],html:'جمع سبد خرید',flex:1},
                {className:cls['factor-value'],html:SplitNumber(price)},
                {className:cls['factor-unit'],html:unit},
            ]
        }
    }
    function products_discount_layout(amount){
        return {
            className:cls['c-products-discount'],align:'v',
            row:[
                {className:cls['factor-key'],html:'تخفیف کالا',flex:1},
                {className:cls['factor-value'],html:SplitNumber(amount)},
                {className:cls['factor-unit'],html:unit},
            ]
        }
    }
    function discount_layout(o:{discount:I_discount,amount:number}){
        let {discount,amount} = o;
        return {
            column:[
                {
                    className:cls['factor-discount'],align:'v',
                    row:[
                        {className:cls['factor-key'],html:discount.title,flex:1},
                        {className:cls['factor-value'],html:`${SplitNumber(amount)} (${discount.discountPercent})%`},
                        {className:cls['factor-unit'],html:unit},
                        {className:cls['factor-minus'],html:<Icon path={mdiMinus} size={0.8}/>}
                    ]
                },
                {className:cls['factor-max-discount'],show:discount.maxDiscount !== Infinity,html:()=>`تا سقف ${SplitNumber(discount.maxDiscount)} ${unit}`}
            ]
        }
    }
    function extra_layout(extra:I_extra){
        let {title,amount} = extra;
        return {
            className:cls['factor-extra'],align:'v',  
            row:[
                {className:cls['factor-key'],html:title,flex:1},
                {className:cls['factor-value'],html:`${SplitNumber(amount)}`},
                {className:cls['factor-unit'],html:unit},
                {className:cls['factor-plus'],html:<Icon path={mdiPlus} size={0.8}/>},
            ]
        }
    }
    function onSubmit(){

    }
    function button_layout(){
        let text = renderIn === 'cart'?'تکمیل خرید':`پرداخت ${details.payment} ${unit}`
        return {className:cls['factor-continue-button'],html:<button onClick={()=>onSubmit()}>{text}</button>,align:'vh'}
    }
    function amount_layout(){
        return {
            className:cls['factor-amount'],align:'v',flex:1,
            column:[
                {
                    row:[
                        {flex:1},
                        {html:'مبلغ قابل پرداخت',clasName:cls['factor-amount-text']},
                    ]
                },
                {
                    gap:6,
                    row:[
                        {flex:1},
                        {html:SplitNumber(details.payment),clasName:cls['factor-amount-value']},
                        {html:SplitNumber(details.payment),clasName:cls['factor-amount-unit']},
                    ]
                }
            ]
        }
    }
    if(mode === 'details'){
        let DiscountCode = discountCode_layout()
        let DiscountCodeError = discountCodeError_layout()
        let Price = price_layout(details.price)
        let ProductsDiscount = products_discount_layout(details.productsDiscount);
        let Discounts = !details.discounts.length?false:{column:details.discounts.map((o)=>discount_layout(o))}
        let Extras = !details.extras.length?false:{column:details.extras.map((extra:I_extra)=>extra_layout(extra))}
        return (<RVD layout={{className:cls['factor'],column:[DiscountCode,DiscountCodeError,Price,ProductsDiscount,Discounts,Extras]}}/>)
    }
    else if(mode === 'amount'){
        return (<RVD layout={{className:cls['factor'],row:[button_layout(),amount_layout()]}}/>)
    }
})
function ProductSlider(props:I_ProductSlider){
    let {title = '',action,before = () => false,after = () => false,products,context,cartButton} = props;
    let {cls} = context;
    function header_layout(){
        if(!title && !action){return false}
        let row:I_RVD_node[] = [{align:'v',flex:1,html:title}]
        if(action){row.push({html:action.text})}
        return {className:'ps-header',row}
    }
    function body_layout(){
        return {className:cls['ps-body'],row:[before_layout(),products_layout(),after_layout()]}
    }
    function before_layout(){
        let res = before(); if(!res){return false}
        return {className:cls['ps-before'],html:res}
    }
    function products_layout(){
        return {
            className:cls['ps-products'],
            row:products.map((product:I_product)=>{
                let props:I_ProductCard = {type:'v',product,cartButton,context}
                return {className:cls['ps-product'],html:<ProductCard {...props}/>}
            })
        }
    }
    function after_layout(){
        let res = after(); if(!res){return false}
        return {className:cls['ps-after'],html:res}
    }
    return (<RVD layout={{className:cls['ps'],column:[header_layout(),body_layout()]}}/>)
}
const ProductPage = observer((props:I_ProductPage) => {
    let {product,variantIds = product.variants.map((o:I_variant)=>o.id),context} = props;
    let {images,details} = product;
    let [imageContent,setImageContent] = useState<React.ReactNode>()
    let [content,setContent] = useState<React.ReactNode>()
    async function getImageContent(){
        let imageContent = await context.productPageImageContent(product,props.variantId)
        setImageContent(imageContent)
    }
    async function getContent(){
        let content = await context.productPageContent(product,props.variantId)
        setContent(content)
    }
    useEffect(()=>{getImageContent(); getContent()},[])
    let {cls} = context;
    let [variants] = useState<I_variant[]>(product.variants.filter((o:I_variant)=>variantIds.indexOf(o.id) !== -1 && !!o.cartInfo.inStock));
    let [variant,setVariant] = useState<I_variant>(getInitialVariant(variants));
    function changeVariant(optionType:I_product_optionType,optionValue:{name:string,id:any}){        
        let newOptionValues:I_variant_optionValue[] = variant.optionValues.map((o:I_variant_optionValue)=>{
            let res:I_variant_optionValue;
            if(o.optionTypeId === optionType.id){
                res = {optionTypeId:optionType.id,optionValueId:optionValue.id,optionTypeName:optionType.name,optionValueName:optionValue.name}
            }
            else {res = o}
            return res
        })
        let newVariant:I_variant = context.getVariantByOptionValues(product,newOptionValues)
        setVariant(newVariant); 
    }
    let [imageIndex,setImageIndex] = useState<number>(0)
    function getInitialVariant(variants:I_variant[]){
        let variantId = props.variantId || product.defaultVariantId;
        let variant = variants.find((o:I_variant)=>o.id === variantId);
        if(variant){return variant}
        return variants[0]
    }
    function arrow(dir:number){
        return (
            <div 
                className={`${cls['pp-image-arrow']} ${cls[`pp-image-arrow-${dir > 0 ?'up':'down'}`]}`}
                onClick={()=>{
                    let newImageIndex = imageIndex + dir;
                    if(newImageIndex > images.length - 1){newImageIndex = 0}
                    if(newImageIndex < 0){newImageIndex = images.length - 1}
                    setImageIndex(newImageIndex)
                }}
            ></div>
        )
    }
    function image_content(){return !imageContent?null:<div className={cls['pp-image-content']}>{imageContent}</div>}
    function image_layout(){return {className:cls['pp-image_layout'],html:(<>{arrow(-1)}<img src={images[imageIndex]} alt=''/>{arrow(1)}{image_content()}</>)}}
    function name_layout(){return {html:product.name,className:cls['pp-name']}}
    function optionTypes_layout(){return {className:cls['pp-optionTypes'],column:product.optionTypes.map((o:I_product_optionType)=>optionType_layout(o))}}
    function optionType_layout(optionType:I_product_optionType){
        let {values,id:optionTypeId,name:optionTypeName} = optionType;
        let variantOptionValues = variant.optionValues;
        let selectedOptionValue:I_variant_optionValue = variantOptionValues.find((o:I_variant_optionValue)=>o.optionTypeId === optionTypeId)
        let selectedOptionValueName = selectedOptionValue.optionValueName
        return {
            className:cls['pp-optionType'],
            column:[
                {className:cls['pp-label'],html:`${optionTypeName} : ${selectedOptionValueName}`},
                {row:values.map((value:{name:string,id:any})=>optionValueButton_layout(optionType,value,selectedOptionValue))}
            ]
        }
    }
    function optionValueButton_layout(optionType:I_product_optionType,value:{name:string,id:any},selectedOptionValue:I_variant_optionValue){
        let {name:optionValueName,id:optionValueId} = value;
        let active = selectedOptionValue.optionValueId === optionValueId
        let className = cls['pp-optionValue-button'] + (active?' active':'');
        let button = <button className={className} onClick={()=>changeVariant(optionType,value)}>{optionValueName}</button>
        return {html:button}
    }
    function details_layout(){
        return {
            column:[
                {html:'مشخصات',className:cls['pp-label']},
                {className:cls['pp-details'],column:details.map((o:I_product_detail)=>detail_layout(o))}
            ]
        }
    }
    function detail_layout(detail:I_product_detail){
        let [key,value] = detail;
        let KEY = {html:`${key} : `,className:cls['pp-detail-key']}
        let VALUE = {html:value,className:cls['pp-detail-value']}
        return {align:'v',className:cls['pp-detail'],row:[bullet_layout(),KEY,VALUE]}
    }
    function bullet_layout(){return {html:<div className={cls['pp-detail-bullet']}></div>,align:'vh'}}
    function content_layout(){return !content?false:{className:cls['pp-content'],html:content}}
    return (<RVD layout={{column:[image_layout(),name_layout(),optionTypes_layout(),details_layout(),content_layout()]}}/>)
})
function CartButton(props:I_CartButton){
    let {product,variantId,readonly,context} = props;
    let {cls,trans,changeCart} = context;
    let [cartVariant] = useState<I_cart_variant | false>(context.getCartVariant({product,variantId}))
    let [count,setCount] = useState<number>(getCount(cartVariant))
    let timeout;
    function getCount(cartVariant){
        if(!cartVariant){return 0}
        return cartVariant.count
    }
    let [variant] = useState<I_variant>(product.variants.find((o:I_variant)=>o.id === variantId));
    let {min = 0,max = Infinity,step = 1,inStock} = variant.cartInfo;
    if(!inStock || !max){
        return (
            <RVD
                layout={{
                    className:`${cls['cb']}`,
                    html:<span className='cb-not-exist'>{trans.notExist}</span>
                }}
            />
        )
    }
    if(readonly){
        if(!count){return null}
        return (
            <RVD
                layout={{
                    className:`${cls['cb']} ${cls['cb-readonly']}`,
                    row:[
                        {html:<Icon path={mdiCart} size={0.8}/>,className:cls['cb-icon']},
                        {html:count,align:'vh',className:cls['cb-count']}
                    ]
                }}
            />
        )
    }
    function changeStep(offset){
        let newCount = count + offset;
        if(newCount < min){newCount = min}
        if(newCount > max){newCount = max}
        setCount(newCount);
        clearTimeout(timeout);
        timeout = setTimeout(()=>changeCart({product,variantId,count:newCount}),1000)
    }
    if(!count){
        return (
            <RVD
                layout={{
                    className:`${cls['cb']}`,
                    html:<button className='cb-add' onClick={()=>changeStep(step)}>{trans.addToCart}</button>
                }}
            />
        ) 
    }
    function button_layout(dir,disabled){
        let html:React.ReactNode;
        if(Math.abs(dir) === 1){html = <Icon path={dir > 0?mdiPlus:mdiMinus} size={0.8}/>}
        else {html = dir}
        return {html,align:'vh',className:cls['cb-step'] + (disabled?` ${cls['cb-step-disabled']}`:''),onClick:disabled?undefined:()=>changeStep(dir)}
    }
    function count_layout(){
        return {html:count,className:cls['cb-count'],align:'vh'}
    }
    function body_layout(){
        return {
            className:cls['cb-body'],
            row:[
                {html:button_layout(step,count >= max),align:'vh'},
                {html:count_layout(),align:'vh'},
                {html:button_layout(-step,count <= min),align:'vh'},
            ]
        }
    }
    function footer_layout(){
        let showMin = min > 0;
        let showMax = max !== Infinity;
        if(!showMin && !showMax){return false}
        return {
            className:cls['cb-footer'],
            row:[
                {show:showMin,html:min,className:'cb-min'},
                {show:showMax,html:min,className:'cb-max'}
            ]
        }
    }
    return (<RVD layout={{className:`${cls['cb']}`,column:[body_layout(),footer_layout()]}}/>)
}
const ProductCard = observer((props:I_ProductCard) => {
    let {product,type,title,variantId,context,cartButton} = props;
    let {cls} = context;
    let {name,description = '',images} = product;
    let [imageContent,setImageContent] = useState<React.ReactNode>()
    let [content,setContent] = useState<React.ReactNode>()
    async function getImageContent(){
        let imageContent = await context.productCardImageContent(product,props.variantId)
        setImageContent(imageContent)
    }
    async function getContent(){
        let content = await context.productCardContent(product,props.variantId)
        setContent(content)
    }
    let image = images[0];
    let className = `${cls['pc']} ${cls[`pc-${type}`]}`;
    function image_layout(){
        let size = {v:84,h:72,vs:48}[type];
        if(!imageContent || imageContent === null){imageContent = false}
        return {
            size,align:'vh',className:cls['pc-image'],
            html:(<>
                <img src={image} alt='' width='100%'/>
                {imageContent === false?null:<div className={cls['pc-image-content']}>{imageContent}</div>}
            </>)
        }
    }
    function title_layout(){return typeof title !== 'string'?false:{html:title,className:cls['pc-title'],align:'v'}}
    function name_layout(){return {html:name,className:cls['pc-name']}}
    function description_layout(){
        if(!variantId){
            return {html:description,className:cls['pc-desc']}
        }
        let props:I_VariantLabels = {product,variantId,context,type:'v'}
        return {html:<VariantLabels {...props}/>}
    }
    function content_layout(){return !content || type === 'hs'?false:{html:content,className:cls['pc-content']}}
    function discount_layout(){
        let props:I_DiscountPercent = {product,variantId,context}
        return {
            className:cls['pc-discount-layout'],
            row:[{flex:1},{html:<DiscountPercent {...props}/>}]
        }
    }
    function finalPrice_layout(){
        let props:I_FinalPrice = {product,variantId,context}
        return {
            className:cls['pc-finalPrice_layout'],
            row:[{flex:1},{html:<FinalPrice {...props}/>}]
        }
    }
    function variants_layout(){
        if(cartButton === false){return false}
        let {getCartVariants} = context;
        let cartVariants:I_cart_variant[] = getCartVariants(product.id)
        if(!cartVariants.length){return false}
        return {
            column:cartVariants.map((cartVariant:I_cart_variant)=>{
                return {
                    align:'v',className:cls['pc-variant'],
                    row:[
                        {flex:1,html:<VariantLabels type='h' product={product} variantId={cartVariant.id} context={context}/>},
                        {align:'vh',html:<CartButton product={product} variantId={cartVariant.id} readonly={cartButton === 'readonly'}/>}
                    ]
                }
            })
        } 
    }
    function click(){
        context.openModal({
            title:'جزییات',
            render:()=>{
                let props:I_ProductPage = {context,product,variantId}
                return <ProductPage {...props}/>
            }
        })
    }
    function v_layout(){
        return {
            className,onClick:()=>click(),
            column:[
                title_layout(),image_layout(),name_layout(),description_layout(),content_layout(),
                discount_layout(),finalPrice_layout(),variants_layout()
            ]
        }
    }
    function h_layout(){
        return {
            className,onClick:()=>click(),
            column:[
                {
                    row:[
                        image_layout(),
                        {flex:1,column:[title_layout(),name_layout(),description_layout(),content_layout(),discount_layout(),finalPrice_layout()]}
                    ]
                },
                variants_layout()
            ]
        }
    }
    let layout = type === 'v'?v_layout():h_layout();
    return (<RVD layout={layout}/>)
})
type I_DiscountPercent = {product:I_product,variantId?:any,context:I_ShopClass_context}
function DiscountPercent(props:I_DiscountPercent){
    let {product,context} = props;
    let {cls} = context;
    let [variant] = useState<I_variant>(getVariant())
    let [items] = useState<I_discountPercent_item[]>(getItems(variant))
    function getVariant(){
        let variantId = props.variantId?props.variantId:product.defaultVariantId;
        return product.variants.find((o:I_variant)=>o.id === variantId); 
    }
    function getItems(variant:I_variant){
        let {discountPercent} = variant;
        return discountPercent.filter((o:I_discountPercent_item)=>!!o.value)
    }
    function percents_layout(){
        return {row:items.map((item)=>percent_layout(item)),className:cls['dps']}
    }
    function percent_layout(item:I_discountPercent_item){
        return {html:`${item.value}%`,className:cls['dp'],attrs:{id:`as-discount-percent-${item.id}`}}
    }
    function price_layout(){return {row:[{html:SplitNumber(variant.price)},{html:context.unit,className:cls['unit']}]}}
    return !items.length?null:<RVD layout={{className:cls['dr'],row:[{flex:1},price_layout(),percents_layout()]}}/>
}
type I_FinalPrice = {product:I_product,variantId?:any,context:I_ShopClass_context}
function FinalPrice(props){
    let {context,product} = props;
    let {cls} = context
    function price_layout(){
        let variantId = props.variantId || product.defaultVariantId;
        let variant = product.variants.find((o:I_variant)=>o.id === variantId);
        let {price,discountPercent:dps} = variant;
        let dp = 0;
        for(let i = 0; i < dps.length; i++){dp += dps[i].value}
        let finalPrice = Math.round(price - (price * dp / 100))
        return {html:SplitNumber(finalPrice),className:cls['final-price']}
    }
    function unit_layout(){return {html:unit_layout,className:cls['unit']}}
    return (<RVD layout={{className:cls['fp'],row:[price_layout(),unit_layout()]}}/>)
}
type I_VariantLabels = {product:I_product,variantId,context:I_ShopClass_context,type:'h' | 'v'}
function VariantLabels(props:I_VariantLabels){
    let {product,variantId,context,type} = props;
    let {cls,getVariantIcon = ()=>false} = context;
    let [items] = useState<{key:string,value:string}[]>(getItems())
    function getItems(){
        let variant = product.variants.find((o:I_variant)=>o.id === variantId);
        let res = [];
        let {optionTypes} = product;
        let {optionValues} = variant;
        for(let i = 0; i < optionValues.length; i++){
            let {optionTypeId,optionValueId}:I_variant_optionValue = optionValues[i];
            let {name:optionTypeName,values}:I_product_optionType = optionTypes.find((o:I_product_optionType)=>o.id === optionTypeId);
            let {name:optionValueName} = values.find((o)=>o.id === optionValueId)
            res.push({key:optionTypeName,value:optionValueName})
        }
        return res
    }
    function row_layout({key,value}){
        return {
            className:cls['variant-label-row'],
            row:[bullet_layout(),icon_layout(key,value),key_layout(key),{html:':',align:'vh'},value_layout(value)]
        }
    }
    function key_layout(key:string){return {html:key,className:cls['variant-label-row-key'],align:'v'}}
    function value_layout(value:string){return {html:value,className:cls['variant-label-row-value'],align:'v'}}
    function icon_layout(key,value){
        let icon = getVariantIcon(key,value);
        if(!icon){return false}
        return {html:icon,align:'vh',className:cls['variant-label-icon']}
    }
    function bullet_layout(){return {html:<div className={cls['variant-label-row-bullet']}></div>,align:'vh'}}
    return (
        <RVD
            layout={{
                className:`${cls['variant-label-rows']} ${cls[`variant-label-rows-${type}`]}`,
                [type === 'h'?'row':'column']:items.map((item)=>row_layout(item))
            }}
        />
    )
}