import React, { Component } from 'react';
import RVD from '../react-virtual-dom/react-virtual-dom';
import AIOInput from '../aio-input/aio-input';
import SplitNumber from '../aio-functions/split-number';
import Box from './box';
import './shipping.css';

export default class Shipping extends Component {
    constructor(props) {
        super(props);
        this.state = {
            discountCode: '',
            discountCodeAmount: 0,
            discountCodeError: '',
            shipping: {},
        }
        props.getActions({
            updateShippingByParent:(shipping)=>this.setState({shipping})
        })
    }
    async componentDidMount(){
        let { getShippingOptions } = this.props;
        let shippingOptions = getShippingOptions();
        let shipping = {}
        for (let i = 0; i < shippingOptions.length; i++) {
            let shippingOption = shippingOptions[i];
            let option = typeof shippingOption === 'function' ? shippingOption() : shippingOption
            let { value, field } = option;
            if (!field) { continue }
            shipping[field] = value;
        }
        this.changeShipping(shipping)
    }
    items_layout(cartItems,renderProductCard) {
        let cartItems_layout = cartItems.map(({productId,variantId,type,product}) => {
            if(!productId){console.error('Cart error => missing productId props')}
            if(type === 'variant' && !variantId){console.error('Cart error => missing variantId props in cartItem by type = "variant"')}
            let html = renderProductCard({product,variantId,config:{type:'shipping'}})
            return {className: 'of-visible', html}
        })
        return {
            html:(
                <Box
                    layout={{
                        className: 'of-visible',
                        column: [
                            {
                                flex: 1, className: 'of-visible',
                                column:cartItems_layout
                            }
                        ]
                    }}
                />
            )
        }
    }
    options_layout(getShippingOptions) {
        let shippingOptions = getShippingOptions();
        if (!shippingOptions.length) { return false }
        return {
            column: shippingOptions.map((o,i) => {
                let shippingOption = typeof o === 'function' ? o() : o
                if (!shippingOption) { return false }
                let { show } = shippingOption;
                show = typeof show === 'function' ? show({ ...this.state.shipping }) : show;
                if (show === false) { return false }
                if (shippingOption.type === 'html') { return this.html_layout(shippingOption) }
                return this.option_layout(shippingOption,i === shippingOptions.length - 1)
            })
        }
    }
    optionTitle_layout(title, subtitle) {
        return {
            className: 'as-shipping-option-title',
            row: [
                { html: title, align: 'v' },
                { show: !!subtitle, size: 6 ,align:'v'},
                { show: !!subtitle, html: `( ${subtitle} )`, style: { fontSize: '75%',fontWeight:'normal' }, align: 'v' }
            ]
        }
    }
    html_layout(shippingOption) {
        let { title, subtitle, html } = shippingOption;
        html = typeof html === 'function'?html():html
        return {html:<Box title={title} subtitle={subtitle} content={html}/>}
    }
    async changeShipping(shipping){
        let { onChange } = this.props;
        await onChange(shipping);
        this.setState({ shipping })
    }
    option_layout(shippingOption,isLast) {
        let { shipping } = this.state;
        let { title, subtitle, options, field, multiple, onChange = () => { } } = shippingOption;
        return {
            html:(
                <Box
                    title={title} subtitle={subtitle}
                    content={(
                        <AIOInput
                            type='radio'
                            className='as-shipping-item'
                            multiple={multiple}
                            options={options.map((o) => { return { ...o, before: o.icon } })}
                            optionClassName="as-shipping-option"
                            value={this.state.shipping[field]}
                            onChange={(value)=>this.changeShipping({...shipping,[field]:value})}
                        />
                    )}
                />
            )
        }
    }
    discountCode_layout(checkDiscountCode) {
        if (!checkDiscountCode) { return false }
        let { discountCode, discountCodeAmount } = this.state;
        return {
            html:(
                <Box
                    layout={{
                        className: 'as-discount-code',
                        row: [
                            {
                                flex: 1,
                                html: (
                                    <input disabled={!!discountCodeAmount} placeholder='کد تخفیف' type='text' value={discountCode} onChange={(e) => this.setState({ discountCode: e.target.value, discountCodeError: '' })} />
                                )
                            },
                            {
                                html: (
                                    <button
                                        disabled={!!discountCodeAmount || !discountCode}
                                        onClick={async () => {
                                            let res = await checkDiscountCode(discountCode);
                                            if (typeof res === 'number') { this.setState({ discountCodeAmount: res }) }
                                            else if (typeof res === 'string') { this.setState({ discountCodeError: res }) }
                                        }}
                                    >ثبت کد تخفیف</button>
                                )
                            }
                        ]
                    }}
                />
            )
        }
    }
    discountCodeError_layout() {
        let { discountCodeError } = this.state;
        if (!discountCodeError) { return false }
        return {
            className: 'as-shipping-discount-code-error',
            html: discountCodeError
        }
    }
    factor_layout(cartItems,renderFactor) {
        if (!cartItems.length) { return false }
        return { html: <Box content={()=>renderFactor()}/> }
    }
    submit_layout(onSubmit,getFactor,unit) {
        let {amount} = getFactor();
        return {
            className:'as-submit-button-container',
            html: (
                <button 
                    onClick={() => onSubmit()} 
                    className='as-submit-button'
                >{`پرداخت ${SplitNumber(amount)} ${unit}`}</button>
            )
        }
    }
    render() {
        let { cartItems,getFactor, onSubmit,checkDiscountCode,getShippingOptions,renderFactor,renderProductCard,unit } = this.props;
        return (
            <RVD
                layout={{
                    style: { background: '#f4f4f4', height: '100%' },
                    className:'as-shipping',
                    column: [
                        {
                            flex: 1, className: 'ofy-auto',
                            column: [
                                this.items_layout(cartItems,renderProductCard),
                                this.options_layout(getShippingOptions),
                                this.discountCode_layout(checkDiscountCode),
                                this.discountCodeError_layout(),
                                this.factor_layout(cartItems,renderFactor),
                            ]
                        },
                        this.submit_layout(onSubmit, getFactor,unit),
                    ]
                }}
            />
        )
    }
}