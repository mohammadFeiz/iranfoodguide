import React, { Component } from 'react';
import RVD from '../react-virtual-dom/react-virtual-dom';
import { Icon } from '@mdi/react';
import { mdiPlus, mdiMinus, mdiTrashCanOutline, mdiCart } from '@mdi/js';
import AIOVariant from './aio-variant';
import './cart-count-button.css';

export default class CartCountButton extends Component {
    constructor(props) {
        super(props);
        let {count = 0,product,variantId} = props;
        let Variant = AIOVariant(product);
        let properties = Variant.getProperties({variantId})
        this.state = { count, prevCount: count,properties }
    }
    validateCount(count) {
        if(count === 0){return 0}
        let {properties} = this.state;
        let {max,min} = properties;
        if (count > max) { count = max }
        if (count < min) { count = min }
        return count;
    }
    change(count) {
        let { setCartCount,product,variantId } = this.props;
        count = +count;
        if (isNaN(count)) { count = 0 }
        count = this.validateCount(count);
        this.setState({ count });
        clearTimeout(this.changeTimeout);
        this.changeTimeout = setTimeout(() => {
            setCartCount({count,product,variantId})
        }, 500)
    }
    handlePropsChanged() {
        let { prevCount } = this.state;
        let { count } = this.props;
        if (count !== prevCount) { 
            setTimeout(() => {
                this.setState({ count, prevCount: count })
            }, 0) 
        }
    }
    cartIcon() {
        return <Icon path={mdiCart} size={0.8} />
    }
    cartIcon_layout() {
        let { onClick } = this.props;
        let { count } = this.state;
        return {
            align: 'vh', className: 'p-h-6', onClick,
            row: [
                { html: this.cartIcon(), align: 'vh' },
                { html: count, align: 'v' }
            ]
        }
    }
    addButton_layout() {
        let { addText = 'افزودن به سبد خرید', className } = this.props;
        return { html: <button onClick={() => this.change(1)} className={'as-cart-count-button-add' + (className ? ' ' + className : '')}>{addText}</button> }
    }
    getIcon(dir,count,min){
        let path;
        if(dir === 1){path = mdiPlus;}
        else{
            if(count - 1 < min || count === 1){path = mdiTrashCanOutline}
            else{path = mdiMinus}
        }
        return <Icon path={path} size={dir === 1 ? .9 : (count === 1 ? .8 : .9)} />
    }
    dirButton_layout(dir) {
        let { count,properties } = this.state;
        let { max,min,step,inStock } = properties;
        return {
            align: 'vh',
            html: (
                <button className='as-cart-count-button-step' onClick={() => this.change(count + (dir * step))} disabled={dir === 1 && (count >= max || count >= inStock)}>
                    {this.getIcon(dir,count,min,max)}
                </button>
            )
        }
    }
    changeButton_layout() {
        let { count,properties } = this.state;
        if (!count) { return false }
        let {step} = properties;
        return {
            className:'of-visible',
            row: [
                this.dirButton_layout(1),
                { align:'v',className:'of-visible',html: (<div data-step={step > 1?`${step}+`:undefined} className='as-cart-count-button-input as-fs-m as-fc-d' onClick={() => this.setState({ popup: true })}>{count}</div>) },
                this.dirButton_layout(-1)
            ]
        }
    }
    render() {
        this.handlePropsChanged()
        let { count } = this.state;
        let { setCartCount} = this.props;
        let layout;
        if (count) {
            if (!setCartCount) { layout = this.cartIcon_layout() }
            else { layout = this.changeButton_layout() }
        }
        else { if (setCartCount) { layout = this.addButton_layout() } }
        if(!layout){return null}
        return (<RVD layout={layout}/>)
    }
}