import React, { Component } from 'react';
import RVD from '../react-virtual-dom/react-virtual-dom';
import { Icon } from '@mdi/react';
import { mdiPlus, mdiMinus, mdiTrashCanOutline, mdiCart } from '@mdi/js';
import $ from 'jquery';
import './cart-button.css';
//props
//cart {[productId]:{count:number,product:object},...}
//productIdField(string)(field)
//product(object)
//min(number)
//max(number)
//onChange(function) 
//onAdd(function or boolean)
//onClick(function)
//addToCart(boolean)
//addText (false | string)
export class CartButton extends Component {
    constructor(props) {
        super(props);
        this.state = { count:props.count || 0,prevCount:props.count || 0}
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
            count = this.validateCount(count);
            onChange(count)
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
        let {addText = 'افزودن به سبد خرید',className} = this.props;
        let text = addText === false?this.cartIcon():addText;
        return {html:<button onClick={()=>this.change(1)} className={'aio-shop-add-button' + (className?' ' + className:'')}>{text}</button>}
    }
    dirButton_layout(dir){
        let {count} = this.state,{max=Infinity} = this.props;
        return {
            align:'vh',
            html:(
                <button className='cart-button-step' onClick={()=>this.change(count + dir)} disabled={dir === 1 && count >= max}>
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
                {html: (<div className='product-count-input' onClick={() => this.setState({popup:true})}>{count}</div>)},
                this.dirButton_layout(-1)
            ]
        }
    }
    render() {
        this.handlePropsChanged()
        let { count } = this.state;
        let {onAdd,onChange} = this.props;
        let layout;
        if(count){
            if(!onChange){layout = this.cartIcon_layout()}
            else {layout = this.changeButton_layout()}
        }
        else {if(onAdd){layout = this.addButton_layout()}}
        return (
            <>
                <RVD
                    layout={layout}
                />
            </>
        )
    }
}

