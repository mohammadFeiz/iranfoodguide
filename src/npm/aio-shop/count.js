import React, { Component } from 'react';
import RVD from './../react-virtual-dom/react-virtual-dom';
import { Icon } from '@mdi/react';
import { mdiPlus, mdiMinus, mdiTrashCanOutline, mdiCart } from '@mdi/js';
import $ from 'jquery';
import './count.css';
//props
//cart {[productId]:{count:number,product:object},...}
//productIdField(string)(field)
//product(object)
//min(number)
//max(number)
//onChange(function) 
//addToCart(boolean)
//addText (false | string)
export class Count extends Component {
    constructor(props) {
        super(props);
        this.state = { count:0,prevCount:0}
    }
    getProductId(){
        let {product,productIdField = 'id'} = this.props;
        return product[productIdField];
    }
    getCartItem(){
        let {cart} = this.props;
        let id = this.getProductId();
        return cart[id];
    }
    getCountFromCart(){
        let cartItem = this.getCartItem();
        return cartItem?cartItem.count:0;
    }
    componentDidMount(){
        this.mounted = true;
        let count = this.getCountFromCart();
        this.setState({count,prevCount:count})
    }
    validateCount(count){
        let { max = Infinity,min = 0} = this.props; 
        if (count > max) { count = max }
        if (count < min) { count = min }
        return count;
    }
    change(count) {
        count = +count;
        if (isNaN(count)) { count = 0 }
        let { onChange} = this.props; 
        this.setState({ count });
        clearTimeout(this.changeTimeout);
        this.changeTimeout = setTimeout(() => {
            let {product} = this.props;
            count = this.validateCount(count);
            onChange({product,count})
        }, 500)

    }
    touchEnd() {
        $(window).unbind('touchend', this.touchEnd)
        $(window).unbind('mouseup', this.touchEnd)
        // clearTimeout(this.timeout)
        // clearInterval(this.interval) 
    }
    handlePropsChanged(){
        let {prevCount} = this.state;
        let count = this.getCountFromCart();
        if(count !== prevCount){setTimeout(()=>this.setState({count,prevCount:count}),0)}
    }
    cartIcon_layout(){
        let {count} = this.state;
        if(!count){return false}
        let {onChange} = this.props;
        return {
            show:!!count && renderIn === 'product-card',align:'vh',className:'p-h-6',
            row:[
                {html:<Icon path={mdiCart} size={0.8}/>,align:'vh'},
                {html:count,align:'v'}
            ]
        }
    }
    cartIcon(){
        return <Icon path={mdiCart} size={0.8} className='aio-shop-cart-icon'/>
    }
    addButton(){
        let {addText = 'افزودن به سبد خرید'} = this.props;
        let text = addText === false?this.cartIcon():addText;
        return <button onClick={()=>this.change(1)} className='aio-shop-add-button' style={{height:36}}>{text}</button>
    }
    dirButton_layout(dir){
        let {count} = this.state,{max=Infinity} = this.props;
        return {
            align:'vh',
            html:(
                <button className='product-count-button' onClick={()=>this.change(count + dir)} disabled={dir === 1 && count >= max}>
                    <Icon path={dir === 1?mdiPlus:(count === 1?mdiTrashCanOutline:mdiMinus)} size={0.8} />
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
                {html: (<div className='product-count-input' onClick={() => this.setState({popup:true})}>{count}</div>)},
                this.dirButton_layout(-1)
            ]
        }
    }
    render() {
        if(!this.mounted){return null}
        this.handlePropsChanged()
        let { count } = this.state;
        let { max = Infinity, style,renderIn,addToCart } = this.props;
        let touch = 'ontouchstart' in document.documentElement;
        if(!count && addToCart){return this.addButton()}
        return (
            <>
                <RVD
                    layout={{
                        childsProps: { align: "vh" },
                        className:'product-count',
                        style: { height: 36, ...style },
                        attrs: { onClick: (e) => e.stopPropagation() },
                        row: [
                            this.changeButton_layout(),
                            this.cartIcon_layout(),
                        ]
                    }}
                />
            </>
        )
    }
}

