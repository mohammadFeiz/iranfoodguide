import React, { Component } from 'react';
import RVD from '../react-virtual-dom/react-virtual-dom';
import { splitNumber } from '../react-super-app/react-super-app';
import { Icon } from '@mdi/react';
import { mdiPlus, mdiMinus, mdiTrashCanOutline, mdiCart } from '@mdi/js';
import './cart-button.css';
import AIOStorage from './../aio-storage/aio-storage';
export default function AIOShop(obj = {}){
    let {
        id,setState,cartCache,
        productFields
    } = obj
    if(!id){return}
    let $$ = {
        storage:AIOStorage('aioshop' + id),
        cart:{},
        getProductProp(product,prop,def){
            let field = productFields[prop];
            let value = typeof field === 'function'?field(product):product[field];
            if(value === undefined && def){return def}
            return value;
        },
        getCart_object(){
            return JSON.parse(JSON.stringify($$.cart))
        },
        getCart_list(){
            return Object.keys($$.cart).map((o)=>$$.cart[o]);
        },
        changeProductCount(product,count){
            let id = $$.getProductProp(product,'id');
            let cart = $$.cart;
            let newCart = {};
            if(count === 0){for(let prop in cart){if(prop !== id){newCart[prop] = cart[prop]}}}
            else {newCart = {...cart,[id]:{count,product}}}
            $$.cart = newCart;
            if(cartCache){$$.storage.save({name:'cart',value:newCart})}
            setState($$)
        },
        getCartFactor(discountItems = []){
            let cart = $$.cart;
            let discount = 0;
            let total = 0;
            let amount = 0;
            let factors = Object.keys(cart).map((id)=>{
                let {count = 1,product} = cart[id];
                let price = $$.getProductProp(product,'price',0);
                let discountPercent = $$.getProductProp(product,'discountPercent',0);
                let itemTotal = count * price;
                total += itemTotal;
                let itemDiscount = itemTotal * discountPercent / 100;
                discount += itemDiscount;
                let itemAmount = itemTotal - itemDiscount;
                amount += itemAmount;
                return {id,discountPercent,total:itemTotal,discount:itemDiscount,amount:itemAmount}
            })
            let discounts = [];
            for(let i = 0; i < discountItems.length; i++){
                let {title,discountPercent,discount,maxDiscount} = discountItems[i];
                if(discountPercent){
                    let discount = amount * discountPercent / 100;
                    amount -= discount;
                    if(maxDiscount !== undefined && discount > maxDiscount){discount = maxDiscount}
                    discounts.push({discountPercent,maxDiscount,discount,title})
                }
                else if(discount){
                    amount -= discount;
                    discounts.push({discount,title})
                }
            }
            return {discount,discounts,total,amount,factors}

        },
        getProductCount(product){
            let id = $$.getProductProp(product,'id');
            return $$.cart[id]?$$.cart[id].count:0; 
        },
        renderCartButton(product,obj = {}){
            let {addCart,changeCart,className} = obj;
            let props = {
                key:$$.getProductProp(product,'id'),
                product,addCart,className,
                count:$$.getProductCount(product),
                getProductProp:$$.getProductProp.bind($$),
                changeProductCount:changeCart?$$.changeProductCount.bind($$):undefined
            };
            return <CartButton {...props}/>;
        },
        renderFactor(discountItems = []){
            let factor = $$.getCartFactor(discountItems)
            return <AIOShopFactor factor={factor}/>
        },
        renderProductCard(product,{addCart,changeCart,className}){
            return (
                <ProductCard 
                    product={product}
                    getProductProp={$$.getProductProp.bind($$)}
                    renderCartButton={()=>(
                        $$.renderCartButton(product,{addCart,changeCart})
                    )}
                    className={className}
                />
            )

        }
    }
    $$.cart = cartCache?$$.storage.load({name:'cart',def:{}}):{};
    return {
        getCart_object:$$.getCart_object.bind($$),
        getCart_list:$$.getCart_list.bind($$),
        changeProductCount:$$.changeProductCount.bind($$),
        getProductCount:$$.getProductCount.bind($$),
        renderCartButton:$$.renderCartButton.bind($$),
        renderFactor:$$.renderFactor.bind($$),
        renderProductCard:$$.renderProductCard.bind($$)
    }
}
class AIOShopFactor extends Component{
    total_layout(total){
        return {
            className:'fs-12',
            row:[
                {html:'مجموع قیمت'},
                {flex:1},
                {html:splitNumber(total),align:'v'},
                {size:3},
                {html:'تومان',className:'fs-10',align:'v'}
            ]
        }
    }
    discount_layout(discount){
        if(!discount){return false}
        return {
            className:'fs-12',
            row:[
                {html:'مجموع تخفیف'},
                {flex:1},
                {html:splitNumber(discount),align:'v'},
                {size:3},
                {html:'تومان',className:'fs-10',align:'v'}
            ]
        }
    }
    discounts_layout(discounts){
        if(!discounts.length){return false}
        return {
            className:'fs-12',gap:12,
            column:discounts.map(({title,discountPercent,discount})=>{
                return {
                    row:[
                        {html:title},
                        {flex:1},
                        {show:!!discountPercent,html:`(${discountPercent}%)`,className:'m-h-3'},
                        {html:splitNumber(discount),align:'v'},
                        {size:3},
                        {html:'تومان',className:'fs-10',align:'v'}
                    ]
                }
            })
        }
    }
    amount_layout(amount){
        return {
            className:'fs-14',
            row:[
                {html:'قابل پرداخت',className:'bold'},
                {flex:1},
                {html:splitNumber(amount),align:'v',className:'bold'},
                {size:3},
                {html:'تومان',className:'fs-10',align:'v'}
            ]
        }
    }
    render(){
        let {factor} = this.props;
        let {total,discount,discounts,amount} = factor;
        return (
            <RVD
                layout={{
                    gap:12,
                    column:[
                        this.total_layout(total),
                        this.discount_layout(discount),
                        this.discounts_layout(discounts),
                        this.amount_layout(amount)
                    ]
                }}
            />
        )
    }
}

export class CartButton extends Component {
    constructor(props) {
        super(props);
        this.state = { count:props.count || 0,prevCount:props.count || 0}
    }
    validateCount(count){
        let { product,getProductProp } = this.props; 
        let max = getProductProp(product,'max',Infinity);
        let min = getProductProp(product,'min',0);
        if (count > max) { count = max }
        if (count < min) { count = min }
        return count;
    }
    change(count) {
        count = +count;
        if (isNaN(count)) { count = 0 }
        let { changeProductCount,product} = this.props; 
        this.setState({ count });
        clearTimeout(this.changeTimeout);
        this.changeTimeout = setTimeout(() => {
            count = this.validateCount(count);
            changeProductCount(product,count)
        }, 500)
    }
    handlePropsChanged(){
        let {prevCount} = this.state;
        let {count} = this.props;
        if(count !== prevCount){setTimeout(()=>this.setState({count,prevCount:count}),0)}
    }
    cartIcon(){
        return <Icon path={mdiCart} size={0.8}/>
    }
    cartIcon_layout(){
        let {onClick} = this.props;
        let {count} = this.state;
        return {
            align:'vh',className:'p-h-6',onClick,
            row:[
                {html:this.cartIcon(),align:'vh'},
                {html:count,align:'v'}
            ]
        }
    }
    addButton_layout(){
        let {addCart,className} = this.props;
        return {html:<button onClick={()=>this.change(1)} className={'aio-shop-cart-button-add' + (className?' ' + className:'')}>{addCart}</button>}
    }
    dirButton_layout(dir){
        let {count} = this.state,{product,getProductProp } = this.props; 
        let max = getProductProp(product,'max',Infinity);
        return {
            align:'vh',
            html:(
                <button className='aio-shop-cart-button-step' onClick={()=>this.change(count + dir)} disabled={dir === 1 && count >= max}>
                    <Icon path={dir === 1?mdiPlus:(count === 1?mdiTrashCanOutline:mdiMinus)} size={dir === 1?.9:(count === 1?.8:.9)} />
                </button>
            )
        }
    }
    changeButton_layout(){
        let {count} = this.state;
        if(!count){return false}
        return {
            row: [
                this.dirButton_layout(1),
                {html: (<div className='aio-shop-cart-button-input' onClick={() => this.setState({popup:true})}>{count}</div>)},
                this.dirButton_layout(-1)
            ]
        }
    }
    render() {
        this.handlePropsChanged()
        let { count } = this.state;
        let {addCart,changeProductCount} = this.props;
        let layout;
        if(count){
            if(!changeProductCount){layout = this.cartIcon_layout()}
            else {layout = this.changeButton_layout()}
        }
        else {if(addCart){layout = this.addButton_layout()}}
        return (
            <>
                <RVD
                    layout={layout}
                />
            </>
        )
    }
}

class ProductCard extends Component {
    image_layout(image){
        return <img src={image} width='100%' />
    }
    discount_layout(discountPercent){
        if(!discountPercent){return false}
        return (<div className='aio-shop-product-card-discount'>{`${discountPercent} %`}</div>)
    }
    name_layout(name){return { html:name, className: 'aio-shop-product-card-name'}}
    description_layout(description){
        if(!description){return false}
        return { html:description, className: 'aio-shop-product-card-description' }
    }
    price_layout(price,discountPercent){
        let finalPrice = price - price * discountPercent / 100;
        return {
            flex:1,className:'p-h-6',
            row:[
                {show:!!discountPercent,html:()=><del>{`${price} تومان`}</del>,className:'aio-shop-product-card-price',align:'v'},
                {
                    row:[
                        {html:finalPrice,className:'aio-shop-product-card-final-price',align:'v'},
                        {size:3},
                        {html:'تومان',className:'aio-shop-product-card-unit',align:'v'}
                    ]
                }
            ]
        }
    }
    render() {
        let { width = '100%',imageSize = 72,product,renderCartButton,getProductProp,className} = this.props;
        let name = getProductProp(product,'name','');
        let image = getProductProp(product,'image','');
        let price = getProductProp(product,'price',0);
        let discountPercent = getProductProp(product,'discountPercent',0);
        let description = getProductProp(product,'description','');
        return (
            <RVD
                layout={{
                    className: 'aio-shop-product-card' + (className?' ' + className:''),
                    style: { width,height:120},
                    row:[
                        { 
                            className:'aio-shop-product-card-image',
                            html: (
                                <>
                                    {this.image_layout(image)}
                                    {this.discount_layout(discountPercent)}
                                </>
                            ) 
                        },
                        {
                            flex:1,
                            column: [
                                {
                                    flex:1,
                                    column: [
                                        { size: 6 },
                                        this.name_layout(name),
                                        this.description_layout(description),
                                        { flex: 1 },
                                        {
                                            row:[
                                                this.price_layout(price,discountPercent),
                                                {html:(renderCartButton())},
                                                {size:12}                 
                                            ]
                                        },
                                        {size:6}
                                    ]
                                }
                            ]
                        }
                    ]
                    
                }}
            />
        )
    }
}