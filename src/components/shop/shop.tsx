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
import classes from './classes';
import { 
    I_Cart,I_CartButton,I_Checkout,I_DiscountPercent,I_Factor,I_Factor_details,I_FinalPrice,I_ProductCard,I_pr_detail,I_pr_optionType, 
    I_ProductCard_content,I_ProductPage,I_ProductPage_content,I_ProductSlider,I_RVD_node,I_ShopClass, I_ShopClass_changeCart, I_ShopClass_context, 
    I_getVariantIcon, I_ShopClass_props, I_VariantLabels, I_cart,I_cart_content, I_cart_product, I_cart_variant, I_checkDiscountCode, 
    I_checkout, I_checkout_content, I_checkout_html, I_checkout_item, I_checkout_radio, I_discount, I_discountPercent, I_extra, I_getCartLength, 
    I_getCartVariant, I_getCartVariants, I_getCheckoutItems, I_getDiscounts, I_getExtras, I_getOptionTypes, I_getVariantByOptionValues, 
    I_openModal, I_pr, I_productCardImageContent, I_productPageImageContent, I_renderCart, I_renderCartButton, I_renderCheckout,
    I_renderProductCard, I_renderProductPage, I_renderProductSlider, I_setCheckout, I_trans, I_v, I_v_ov, I_v_label 
} from './types';
//////rvd
export default class AIOShop implements I_ShopClass{
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
    getVariantIcon:I_getVariantIcon;
    changeCart:I_ShopClass_changeCart;
    setCart:(newCart:I_cart)=>void;
    getFinalPrice:(variant:I_v)=>number;
    getDiscountPercent:(discountPercent:I_discountPercent[])=>number;
    getCartVariant:I_getCartVariant;
    getCartVariants:I_getCartVariants;
    getCartLength:I_getCartLength;
    getOptionTypes:I_getOptionTypes;
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
        for(let prop in props){this[prop] = props[prop]}
        this.setCheckout = (checkout:I_checkout)=>{this.checkout = checkout};
        this.popup = new AIOPopup();
        this.storage = AIOStorage(`ShopClass_${this.shopId}`);
        this.cart = this.storage.load({name:'cart',def:[]})
        this.cls = classes
        this.getOptionTypes = (variants:I_v[]) => {
            let dic:{[key:string]:I_pr_optionType} = {}
            for(let i = 0; i < variants.length; i++){
                let {optionValues} = variants[i];
                for(let j = 0; j < optionValues.length; j++){
                    let optionValue:I_v_ov = optionValues[j];
                    let {optionType:ot,optionValue:ov} = optionValue;
                    if(!dic[ot.id.toString()]){dic[ot.id.toString()] = {id:ot.id,name:ot.name,values:[]}} 
                    if(!dic[ot.id.toString()].values.find((o)=>o.id === ov.id)){
                        dic[ot.id.toString()].values.push({id:ov.id,name:ov.name})
                    }
                }
            }
            return Object.keys(dic).map((key)=>dic[key]);
        }
        this.getContext = ()=>{
            return {
                unit:this.unit,cart:this.cart,
                cls:this.cls,changeCart:this.changeCart.bind(this),
                getCartVariant:this.getCartVariant.bind(this),
                getCartVariants:this.getCartVariants.bind(this),
                getVariantByOptionValues:this.getVariantByOptionValues.bind(this),
                getOptionTypes:this.getOptionTypes.bind(this),
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
        this.getDiscountPercent = (discountPercent:I_discountPercent[])=>{
            let dp = 0;
            for(let i = 0; i < discountPercent.length; i++){dp += discountPercent[i].value;}
            return dp;
        }
        this.getFinalPrice = (variant)=>{
            let dp = this.getDiscountPercent(variant.discountPercent);
            return variant.price - (variant.price * dp / 100)
        }
        this.setCart = (newCart:I_cart)=>this.cart = newCart;
        this.getCartVariant = (p:{product:I_pr,variantId?:any})=>{
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
        this.getVariantByOptionValues = (product:I_pr,optionValues:I_v_ov[])=>{
            let dic = {}
            for(let i = 0; i < optionValues.length; i++){
                let {optionType:ot,optionValue:ov} = optionValues[i];
                dic[ot.id.toString()] = ov.id;
            }
            let variant:I_v = product.variants.find((variant:I_v)=>{
                let {optionValues} = variant;
                for(let i = 0; i < optionValues.length; i++){
                    let {optionType:ot,optionValue:ov} = optionValues[i];
                    if(dic[ot.id.toString] !== ov.id){return false}
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
                    let variant = product.variants.find((v:I_v)=>v.id === o.id);
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
        this.renderProductCard = (p:I_ProductCard)=><ProductCard {...p} context={this.getContext()}/>;
        this.renderCartButton = (p:I_CartButton)=><CartButton {...p} context={this.getContext()}/>;
        this.renderProductPage = (p:I_ProductPage)=><ProductPage {...p} context={this.getContext()}/>;
        this.renderProductSlider = (p:I_ProductSlider)=><ProductSlider {...p} context={this.getContext()}/>;
        this.renderCart = (p:I_Cart)=><Cart {...p} context={this.getContext()}/>;
        this.renderCheckout = (p:I_Checkout)=><Checkout {...p} context={this.getContext()}/>;
        this.openModal = (p)=>{
            let {title,render,position} = p;
            this.popup.addModal({position,header:{title},body:{render}})
        }
        makeAutoObservable(this)
    }
}
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
            row:products.map((product:I_pr)=>{
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
    let {product,variantIds = product.variants.map((o:I_v)=>o.id),context} = props;
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
    let [variants] = useState<I_v[]>(product.variants.filter((o:I_v)=>variantIds.indexOf(o.id) !== -1 && !!o.cartInfo.inStock));
    let [variant,setVariant] = useState<I_v>(getInitialVariant(variants));
    let [optionTypes] = useState<I_pr_optionType[]>(context.getOptionTypes(variants));
    function changeVariant(optionType:I_pr_optionType,value:{name:string,id:any}){        
        let newOptionValues:I_v_ov[] = variant.optionValues.map((o:I_v_ov)=>{
            let res:I_v_ov;
            if(o.optionType.id === optionType.id){
                res = {optionType:{id:optionType.id,name:optionType.name},optionValue:{id:value.id,name:value.name}}
            }
            else {res = o}
            return res
        })
        setVariant(context.getVariantByOptionValues(product,newOptionValues)); 
    }
    let [imageIndex,setImageIndex] = useState<number>(0)
    function getInitialVariant(variants:I_v[]){
        let variantId = props.variantId || product.defaultVariantId;
        let variant = variants.find((o:I_v)=>o.id === variantId);
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
    function optionTypes_layout(){return {className:cls['pp-optionTypes'],column:optionTypes.map((o:I_pr_optionType)=>optionType_layout(o))}}
    function optionType_layout(optionType:I_pr_optionType){
        let {id:optionTypeId,name:optionTypeName,values} = optionType;
        let variantOptionValues = variant.optionValues;
        let selectedOptionValue:I_v_ov = variantOptionValues.find((o:I_v_ov)=>o.optionType.id === optionTypeId)
        return {
            className:cls['pp-optionType'],
            column:[
                {className:cls['pp-label'],html:`${optionTypeName} : ${selectedOptionValue.optionValue.name}`},
                {row:values.map((value:{name:string,id:any})=>optionValueButton_layout(optionType,value,selectedOptionValue))}
            ]
        }
    }
    function optionValueButton_layout(optionType:I_pr_optionType,value:{name:string,id:any},selectedOptionValue:I_v_ov){
        let {name:optionValueName,id:optionValueId} = value;
        let active = selectedOptionValue.optionValue.id === optionValueId
        let className = cls['pp-optionValue-button'] + (active?' active':'');
        let button = <button className={className} onClick={()=>changeVariant(optionType,value)}>{optionValueName}</button>
        return {html:button}
    }
    function details_layout(){
        return {column:[{html:'مشخصات',className:cls['pp-label']},{className:cls['pp-details'],column:details.map((o:I_pr_detail)=>detail_layout(o))}]}
    }
    function detail_layout(detail:I_pr_detail){
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
    let [count,setCount] = useState<number>(!cartVariant?0:cartVariant.count)
    let timeout;
    function notExist_layout(){return {className:`${cls['cb']}`,html:<span className='cb-not-exist'>{trans.notExist}</span>}}
    function icon_layout(){return {html:<Icon path={mdiCart} size={0.8}/>,className:cls['cb-icon']}}
    function count_layout(){return {html:count,align:'vh',className:cls['cb-count']}}
    function changeStep(offset){
        let newCount = count + offset;
        if(newCount < min){newCount = min}
        if(newCount > max){newCount = max}
        setCount(newCount);
        clearTimeout(timeout);
        timeout = setTimeout(()=>changeCart({product,variantId,count:newCount}),1000)
    }
    function button_layout(dir,disabled){
        let html:React.ReactNode = Math.abs(dir) === 1?<Icon path={dir > 0?mdiPlus:mdiMinus} size={0.8}/>:dir;
        return {html,align:'vh',className:cls['cb-step'] + (disabled?` ${cls['cb-step-disabled']}`:''),onClick:disabled?undefined:()=>changeStep(dir)}
    }
    function body_layout(){return {className:cls['cb-body'],row:[button_layout(step,count >= max),count_layout(),button_layout(-step,count <= min)]}}
    function footer_layout(){
        let showMin = min > 0,showMax = max !== Infinity;
        if(!showMin && !showMax){return false}
        return {className:cls['cb-footer'],row:[{show:showMin,html:min,className:'cb-min'},{show:showMax,html:min,className:'cb-max'}]}
    }
    let [variant] = useState<I_v>(product.variants.find((o:I_v)=>o.id === variantId));
    let {min = 0,max = Infinity,step = 1,inStock} = variant.cartInfo;
    if(!inStock || !max){return <RVD layout={notExist_layout()}/>}
    if(readonly){return !count?null:<RVD layout={{className:`${cls['cb']} ${cls['cb-readonly']}`,row:[icon_layout(),count_layout()]}}/>}
    if(!count){return <RVD layout={{className:`${cls['cb']}`,html:<button className='cb-add' onClick={()=>changeStep(step)}>{trans.addToCart}</button>}}/>}
    return (<RVD layout={{className:`${cls['cb']}`,column:[body_layout(),footer_layout()]}}/>)
}
const ProductCard = observer((props:I_ProductCard) => {
    let {product,type,title,variantId,context,cartButton} = props,{cls} = context;
    let {name,description = '',images} = product;
    let [imageContent,setImageContent] = useState<React.ReactNode>()
    let [content,setContent] = useState<React.ReactNode>()
    async function getImageContent(){setImageContent(await context.productCardImageContent(product,props.variantId))}
    async function getContent(){setContent(await context.productCardContent(product,props.variantId))}
    useEffect(()=>{getImageContent(); getContent();},[])
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
        if(!variantId){return {html:description,className:cls['pc-desc']}}
        let props:I_VariantLabels = {product,variantId,context,type:'v'}
        return {html:<VariantLabels {...props}/>}
    }
    function content_layout(){return !content || type === 'hs'?false:{html:content,className:cls['pc-content']}}
    function discount_layout(){
        let props:I_DiscountPercent = {product,variantId,context}
        return {className:cls['pc-discount-layout'],row:[{flex:1},{html:<DiscountPercent {...props}/>}]}
    }
    function finalPrice_layout(){
        let props:I_FinalPrice = {product,variantId,context}
        return {className:cls['pc-finalPrice_layout'],row:[{flex:1},{html:<FinalPrice {...props}/>}]}
    }
    function variants_layout(){
        if(cartButton === false){return false}
        let cvs:I_cart_variant[] = context.getCartVariants(product.id)
        return !cvs.length?false:{column:cvs.map((cv:I_cart_variant)=>variant_layout(cv))} 
    }
    function variant_layout(cv:I_cart_variant){return {align:'v',className:cls['pc-variant'],row:[variantLabel_layout(cv),cartButton_layout(cv)]}}
    function variantLabel_layout(cv:I_cart_variant){return {flex:1,html:<VariantLabels type='h' product={product} variantId={cv.id} context={context}/>}}
    function cartButton_layout(cv:I_cart_variant){return {align:'vh',html:<CartButton product={product} variantId={cv.id} readonly={cartButton === 'readonly'}/>}}
    function click(){context.openModal({title:'جزییات',render:()=><ProductPage context={context} product={product} variantId={variantId}/>})}
    function v_layout(){
        let column = [title_layout(),image_layout(),name_layout(),description_layout(),content_layout(),discount_layout(),finalPrice_layout(),variants_layout()]
        return {className,onClick:()=>click(),column}
    }
    function h_layout(){
        let column = [title_layout(),name_layout(),description_layout(),content_layout(),discount_layout(),finalPrice_layout()]
        return {className,onClick:()=>click(),column:[{row:[image_layout(),{flex:1,column}]},variants_layout()]}
    }
    return (<RVD layout={type === 'v'?v_layout():h_layout()}/>)
})
function DiscountPercent(props:I_DiscountPercent){
    let {product,context} = props,{cls} = context;
    let [variant] = useState<I_v>(getVariant())
    let [items] = useState<I_discountPercent[]>(getItems(variant))
    function getVariant(){
        let variantId = props.variantId?props.variantId:product.defaultVariantId;
        return product.variants.find((o:I_v)=>o.id === variantId); 
    }
    function getItems(variant:I_v){return variant.discountPercent.filter((o:I_discountPercent)=>!!o.value)}
    function percents_layout(){return {row:items.map((item)=>percent_layout(item)),className:cls['dps']}}
    function percent_layout(item:I_discountPercent){
        return {html:`${item.value}%`,className:cls['dp'],attrs:item.attrs}
    }
    function price_layout(){return {row:[{html:SplitNumber(variant.price)},{html:context.unit,className:cls['unit']}]}}
    return !items.length?null:<RVD layout={{className:cls['dr'],row:[{flex:1},price_layout(),percents_layout()]}}/>
}
function FinalPrice(props){
    let {context,product} = props;
    let {cls} = context
    function price_layout(){
        let variantId = props.variantId || product.defaultVariantId;
        let variant = product.variants.find((o:I_v)=>o.id === variantId);
        let {price,discountPercent:dps} = variant;
        let dp = 0;
        for(let i = 0; i < dps.length; i++){dp += dps[i].value}
        let finalPrice = Math.round(price - (price * dp / 100))
        return {html:SplitNumber(finalPrice),className:cls['final-price']}
    }
    function unit_layout(){return {html:unit_layout,className:cls['unit']}}
    return (<RVD layout={{className:cls['fp'],row:[price_layout(),unit_layout()]}}/>)
}
function VariantLabels(props:I_VariantLabels){
    let {product,variantId,context,type} = props;
    let {cls,getVariantIcon = ()=>false,getOptionTypes} = context;
    let [items] = useState<I_v_label[]>(getItems())
    function getItems(){
        let variant = product.variants.find((o:I_v)=>o.id === variantId);
        let res:I_v_label[] = [];
        let optionTypes = getOptionTypes(product.variants);
        let {optionValues} = variant;
        for(let i = 0; i < optionValues.length; i++){
            let {optionType,optionValue}:I_v_ov = optionValues[i];
            let {name:optionTypeName,values}:I_pr_optionType = optionTypes.find((o:I_pr_optionType)=>o.id === optionType.id);
            let {name:optionValueName} = values.find((o)=>o.id === optionValue.id)
            let item:I_v_label = [optionTypeName,optionValueName]
            res.push(item)
        }
        return res
    }
    function row_layout(vl:I_v_label){return {className:cls['vl-row'],row:[bullet_layout(),icon_layout(vl),key_layout(vl),{html:':',align:'vh'},value_layout(vl)]}}
    function key_layout(vl:I_v_label){return {html:vl[0],className:cls['vl-row-key'],align:'v'}}
    function value_layout(vl:I_v_label){return {html:vl[1],className:cls['vl-row-value'],align:'v'}}
    function icon_layout(vl:I_v_label){
        let icon = getVariantIcon(vl);
        return !icon?false:{html:icon,align:'vh',className:cls['vl-icon']}
    }
    function bullet_layout(){return {html:<div className={cls['vl-bullet']}></div>,align:'vh'}}
    return (
        <RVD
            layout={{
                className:`${cls['vl-rows']} ${cls[`vl-rows-${type}`]}`,
                [type === 'h'?'row':'column']:items.map((item:I_v_label)=>row_layout(item))
            }}
        />
    )
}