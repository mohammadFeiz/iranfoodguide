import React, { useState } from 'react';
import RVD from 'react-virtual-dom';
import AIOStorage from 'aio-storage';
import {SplitNumber} from 'aio-utils';
import {Icon} from '@mdi/react';
import { mdiCart, mdiMinus, mdiPlus } from '@mdi/js';
type I_product_optionType = {
    id:any,name:string,values:{name:string,id:any}[]
}
type I_variant_optionValue = {optionTypeId:any,optionValueId:any}
type I_discountPercent_item = {value:number,name:string,id:any};
type I_discountPercent = I_discountPercent_item[]
type I_cartInfo = {inStock:number,min:number,max:number,step:number}
type I_variant = {
    id:any,price:number,discountPercent:I_discountPercent,images:string[],
    cartInfo:I_cartInfo,description?:string,
    optionValues:I_variant_optionValue[]
}
type I_rates = {[id:string]:{name:string,value:number}}
type I_product = {
    props?:any,
    id:any,
    name:string,
    optionTypes:I_product_optionType[],
    description?:string,
    defaultVariantId:any,
    rate?:number,
    rates:I_rates,
    variants:I_variant[]
}
type I_ProductCard_type = 'h' | 'v' | 'hs'
type I_ProductCard = {
    product:I_product,
    variantId?:any,
    type:I_ProductCard_type,
    info:React.ReactNode,
    cartButton:boolean | 'readonly',
    attrs?:any,
    title?:string,
    imageContent?:(product:I_product)=>React.ReactNode,
    context?:I_ShopClass_context 
}
type I_CartButton = {
    product:I_product,variantId:any,context?:I_ShopClass_context,readonly:boolean
}
type I_trans = {addToCart:string,notExist:string};
type I_ShopClass_context = {
    unit:string,cart:I_cart,
    cls:{[key:string]:string},
    getVariantIcon?:I_ShopClass_getVariantIcon,
    changeCart:I_ShopClass_changeCart,
    getCartVariant:I_getCartVariant,
    renderCartButton:I_renderCartButton,
    trans:I_trans,
}
type I_ShopClass_getVariantIcon = (key:string,value:string)=>React.ReactNode;
type I_ShopClass_changeCart = (p:{product:I_product,variantId:any,count:number})=>void;
type I_getCartVariant = (p:{product:I_product,variantId:any})=>I_cart_variant | false;
type I_renderProductCard = (p:I_ProductCard)=>React.ReactNode;
type I_renderCartButton = (p:I_CartButton)=>React.ReactNode;
type I_ShopClass_props = {
    unit:string,shopId:any,
    getVariantIcon?:I_ShopClass_getVariantIcon,
    trans:I_trans
}

type I_ShopClass = {
    renderProductCard:I_renderProductCard
}
type I_cart_variant = {id:any,count:number,price:number,finalPrice:number,productId:any,max:number,min:number,step:number};
type I_cart_product = {product:I_product,cartVariants:I_cart_variant[]}
type I_cart = I_cart_product[];
class ShopClass implements I_ShopClass{
    unit:string;
    storage:any;
    cart:I_cart;
    shopId:any;
    trans:I_trans;
    cls:{[key:string]:string};
    getContext:()=>I_ShopClass_context;
    renderProductCard:I_renderProductCard;
    getVariantIcon:I_ShopClass_getVariantIcon;
    changeCart:I_ShopClass_changeCart;
    setCart:(newCart:I_cart)=>void;
    getFinalPrice:(variant:I_variant)=>number;
    getDiscountPercent:(discountPercent:I_discountPercent)=>number;
    getCartVariant:I_getCartVariant;
    renderCartButton:I_renderCartButton;
    constructor(props:I_ShopClass_props){
        let {unit,getVariantIcon,shopId,trans} = props;
        this.trans = trans;
        this.shopId = shopId;
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
            'pcimg':'as-product-card-image',//product card => product card image
            'pcimgcnt':'as-product-card-image-content',//product card => product card image => product card image content
            'pct':'as-product-card-title',//product card title
            'pcn':'as-product-card-name',//product card => product card name
            'final-price':'as-final-price',//final price
            'pc-desc':'as-product-card-description',//product card => description
            'variant-label-rows':'as-variant-label-rows',//variant label rows
            'variant-label-row':'as-variant-label-row',//variant label row
            'variant-label-row-bullet':'as-variant-label-row-bullet',//variant label row bullet
            'variant-label-row-key':'as-variant-label-row-key',//variant label row key',
            'variant-label-row-value':'as-variant-label-row-value',//variant label row value',
            'variant-label-icon':'as-variant-label-icon',//'variant label icon'
            'pcinfo':'as-product-card-info',//product card info
            'variant-label-rows-h':'as-variant-label-rows-h',//variant label rows horizontal
            'variant-label-rows-v':'as-variant-label-rows-v',//variant label rows vertical
            'cart-button':'as-cart-button',//
            'cart-button-readonly':'as-cart-button-readonly',//
            'cart-button-icon':'as-cart-button-icon',//
            'cart-button-count':'as-cart-button-count',//
            'cart-button-step':'as-cart-button-step',//
            'cart-button-add':'as-cart-button-add',//
            'cart-button-not-exist':'as-cart-button-not-exist',//
            'cart-button-step-disabled':'as-cart-button-step-disabled',//
            'cart-button-min':'as-cart-button-min',//
            'cart-button-max':'as-cart-button-max',//
            'cart-button-body':'as-cart-button-body',//
            'cart-button-footer':'as-cart-button-footer',//
            'pc-discount-layout':'as-product-card-discount-layout',//
            'pc-finalPrice_layout':'as-product-card-final-price_layout',//
        }
        this.getContext = ()=>{
            return {
                unit:this.unit,cart:this.cart,
                cls:this.cls,changeCart:this.changeCart.bind(this),
                getCartVariant:this.getCartVariant.bind(this),
                trans:this.trans,
                renderCartButton:this.renderCartButton.bind(this),
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
        this.getCartVariant = (p:{product,variantId})=>{
            let {product,variantId} = p;
            let cartProduct:I_cart_product = this.cart.find((o:I_cart_product)=>o.product.id === product.id)
            if(!cartProduct){return false}
            let cartVariant:I_cart_variant = cartProduct.cartVariants.find((o:I_cart_variant)=>o.id === variantId)
            if(!cartVariant){return false}
            return cartVariant
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
    }
}
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
                    className:`${cls['cart-button']}`,
                    html:<span className='cart-button-not-exist'>{trans.notExist}</span>
                }}
            />
        )
    }
    if(readonly){
        if(!count){return null}
        return (
            <RVD
                layout={{
                    className:`${cls['cart-button']} ${cls['cart-button-readonly']}`,
                    row:[
                        {html:<Icon path={mdiCart} size={0.8}/>,className:cls['cart-button-icon']},
                        {html:count,align:'vh',className:cls['cart-button-count']}
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
                    className:`${cls['cart-button']}`,
                    html:<button className='cart-button-add' onClick={()=>changeStep(step)}>{trans.addToCart}</button>
                }}
            />
        ) 
    }
    function button_layout(dir,disabled){
        let html:React.ReactNode;
        if(Math.abs(dir) === 1){html = <Icon path={dir > 0?mdiPlus:mdiMinus} size={0.8}/>}
        else {html = dir}
        return {html,align:'vh',className:cls['cart-button-step'] + (disabled?` ${cls['cart-button-step-disabled']}`:''),onClick:disabled?undefined:()=>changeStep(dir)}
    }
    function count_layout(){
        return {html:count,className:cls['cart-button-count'],align:'vh'}
    }
    function body_layout(){
        return {
            className:cls['cart-button-body'],
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
            className:cls['cart-button-footer'],
            row:[
                {show:showMin,html:min,className:'cart-button-min'},
                {show:showMax,html:min,className:'cart-button-max'}
            ]
        }
    }
    return (<RVD layout={{className:`${cls['cart-button']}`,column:[body_layout(),footer_layout()]}}/>)
}
function ProductCard(props:I_ProductCard){
    let {product,type,title,imageContent,variantId,context,info,cartButton} = props;
    let {cls} = context;
    let {defaultVariantId,variants,name,description = ''} = product;
    let defaultVariant = variants.find((o:I_variant)=>o.id === defaultVariantId);
    let {images,price,discountPercent = []} = defaultVariant;
    let image = images[0];
    let className = `${cls['pc']} ${cls[`pc-${type}`]}`;
    function image_layout(){
        let size = {v:84,h:72,vs:48}[type];
        let content = imageContent?imageContent(product):false;
        if(!content || content === null){content = false}
        return {
            size,align:'vh',className:cls['pcimg'],
            html:(<>
                <img src={image} alt='' width='100%'/>
                {content === false?null:<div className={cls['pcimgcnt']}>{content}</div>}
            </>)
        }
    }
    function title_layout(){return typeof title !== 'string'?false:{html:title,className:cls['pct'],align:'v'}}
    function name_layout(){return {html:name,className:cls['pcn']}}
    function description_layout(){
        if(!variantId){
            return {html:description,className:cls['pc-desc']}
        }
        let props:I_VariantLabels = {product,variantId,context,type:'v'}
        return {html:<VariantLabels {...props}/>}
    }
    function info_layout(){
        if(!info || type === 'hs'){return false}
        return {html:info,className:cls['pcinfo']}
    }
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
    function cartButton_layout(){
        if(cartButton === false){return false}
        
        let props:I_CartButton = {product,variantId}
        return {html:<CartButton/>} 
    }
    function v_layout(){
        return {
            className,
            column:[
                title_layout(),image_layout(),name_layout(),description_layout(),info_layout(),
                discount_layout(),finalPrice_layout(),cartButton_layout()
            ]
        }
    }
    function h_layout(){
        return {
            className,
            row:[
                image_layout(),
                {
                    column:[
                        title_layout(),name_layout(),description_layout(),info_layout(),discount_layout(),finalPrice_layout(),cartButton_layout() 
                    ]
                }
            ]
            column:[]
        }
    }
    let layout = type === 'v'?v_layout():h_layout();
    return (
        <RVD layout={layout}/>
    )
}
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