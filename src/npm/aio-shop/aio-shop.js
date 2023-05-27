import React, { Component } from 'react';
import RVD from '../react-virtual-dom/react-virtual-dom';
import AIOButton from './../../npm/aio-button/aio-button';
import SplitNumber from '../aio-functions/split-number';
import { Icon } from '@mdi/react';
import { mdiPlus, mdiMinus, mdiTrashCanOutline, mdiCart } from '@mdi/js';
import './cart-button.css';
import AIOStorage from './../aio-storage/aio-storage';
export default function AIOShop(obj = {}) {
    let { id, setState, cartCache, productFields, checkDiscountCode, getDiscounts = () => { return [] }, getShippingPrice = () => 0, getShippingOptions = () => [] } = obj
    if (!id) { return }
    let $$ = {
        factor: {},
        getShippingOptions,
        checkDiscountCode: checkDiscountCode ? async (discountCode) => {
            return await checkDiscountCode(discountCode, $$.factor);
        } : undefined,
        storage: AIOStorage('aioshop' + id),
        cart: {},
        shipping: {},
        getProductProp(product, prop, def) {
            let field = productFields[prop];
            let value = typeof field === 'function' ? field(product) : product[field];
            if (value === undefined && def) { return def }
            return value;
        },
        getCart_object() {
            return JSON.parse(JSON.stringify($$.cart))
        },
        getCart_list() {
            return Object.keys($$.cart).map((o) => $$.cart[o]);
        },
        changeProductCount(product, count) {
            let id = $$.getProductProp(product, 'id');
            let cart = $$.cart;
            let newCart = {};
            if (count === 0) { for (let prop in cart) { if (prop !== id) { newCart[prop] = cart[prop] } } }
            else { newCart = { ...cart, [id]: { count, product } } }
            $$.cart = newCart;
            if (cartCache) { $$.storage.save({ name: 'cart', value: newCart }) }
            $$.updateFactor();
            setState()
        },
        updateShipping(shipping) {
            $$.shipping = shipping;
        },
        async updateFactor() {
            let cart = $$.cart;
            let discount = 0;
            let total = 0;
            let amount = 0;
            let factors = Object.keys(cart).map((id) => {
                let { count = 1, product } = cart[id];
                let price = $$.getProductProp(product, 'price', 0);
                let discountPercent = $$.getProductProp(product, 'discountPercent', 0);
                let itemTotal = count * price;
                total += itemTotal;
                let itemDiscount = itemTotal * discountPercent / 100;
                discount += itemDiscount;
                let itemAmount = itemTotal - itemDiscount;
                amount += itemAmount;
                return { id, discountPercent, total: itemTotal, discount: itemDiscount, amount: itemAmount }
            })
            let discountItems = await getDiscounts({ factor: { discount, total, amount, factors }, shipping: $$.shipping });
            let discounts = [];
            for (let i = 0; i < discountItems.length; i++) {
                let { title, discountPercent, discount, maxDiscount } = discountItems[i];
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
            let shippingPrice = await getShippingPrice({ factor: { discount, discounts, total, amount, factors }, shipping: $$.shipping })
            amount += shippingPrice;
            let factor = { discount, discounts, total, amount, factors, shippingPrice };
            $$.factor = factor;
            return factor;
        },
        getProductCount(product) {
            let id = $$.getProductProp(product, 'id');
            return $$.cart[id] ? $$.cart[id].count : 0;
        },
        renderCartButton(product, obj = {}) {
            let { addCart, changeCart, className } = obj;
            let props = {
                key: $$.getProductProp(product, 'id'),
                product, addCart, className,
                count: $$.getProductCount(product),
                getProductProp: $$.getProductProp.bind($$),
                changeProductCount: changeCart ? $$.changeProductCount.bind($$) : undefined
            };
            return <CartButton {...props} />;
        },
        renderFactor() {
            return <AIOShopFactor Shop={$$} />
        },
        renderTotal() {
            return <AIOShopTotal Shop={$$} />
        },
        renderProductCard(product, { addCart, changeCart, className,html }) {
            return (
                <ProductCard
                    product={product}
                    html={html}
                    getProductProp={$$.getProductProp.bind($$)}
                    renderCartButton={() => (
                        $$.renderCartButton(product, { addCart, changeCart })
                    )}
                    className={className}
                />
            )
        },
        renderShipping() {
            return (
                <Shipping
                    Shop={$$}
                />
            )
        },
        renderCart(props = {}) {
            let {onSubmit = ()=>{}} = props;
            return (
                <Cart
                    Shop={$$}
                    onSubmit={onSubmit}
                />
            )
        }
    }
    $$.cart = cartCache ? $$.storage.load({ name: 'cart', def: {} }) : {};
    $$.updateFactor();
    return {
        getCart_object: $$.getCart_object.bind($$),
        getCart_list: $$.getCart_list.bind($$),
        changeProductCount: $$.changeProductCount.bind($$),
        getProductCount: $$.getProductCount.bind($$),
        renderCartButton: $$.renderCartButton.bind($$),
        renderFactor: $$.renderFactor.bind($$),
        renderProductCard: $$.renderProductCard.bind($$),
        renderTotal: $$.renderTotal.bind($$),
        renderShipping: $$.renderShipping.bind($$),
        renderCart: $$.renderCart.bind($$)
    }
}
class Cart extends Component {
    items_layout(cartItems, Shop) {
        if (!cartItems.length) { return { html: 'سبد خرید شما خالی است', align: 'vh' } }
        return {
            className: 'm-b-24 of-visible',
            column: [
                {
                    flex: 1, className: 'of-visible', gap: 12,
                    column: cartItems.map(({ product }) => {
                        return { className: 'p-h-12 of-visible', html: Shop.renderProductCard(product, { changeCart: true }) }
                    })
                }
            ]
        }
    }
    total_layout(cartItems, Shop) {
        if (!cartItems.length) { return false }
        return { html: Shop.renderTotal(), className: 'aio-shop-cart-total aio-shop-box' }
    }
    submit_layout(cartItems) {
        if (!cartItems.length) { return false }
        let { onSubmit } = this.props;
        return {
            className: 'aio-shop-submit-button-container', html: <button onClick={() => onSubmit()} className='button-5 w-100 h-36 bold'>تکمیل خرید</button>
        }
    }
    render() {
        let {Shop} = this.props;
        let cartItems = Shop.getCart_list();
        return (
            <RVD
                layout={{
                    className: 'aio-shop-cart',
                    column: [
                        {
                            flex: 1, className: 'ofy-auto',
                            column: [
                                this.items_layout(cartItems, Shop),

                            ]
                        },
                        {
                            column: [
                                this.total_layout(cartItems, Shop),
                                this.submit_layout(cartItems)
                            ]
                        }

                    ]
                }}
            />
        )
    }
}
class Shipping extends Component {
    constructor(props) {
        super(props);
        this.state = {
            discountCode: '',
            discountCodeAmount: 0,
            discountCodeError: '',
            shipping: {},
        }
    }
    getShippingOptions() {
        let { Shop } = this.props;
        let { getShippingOptions } = Shop;
        return getShippingOptions();
    }
    async componentDidMount() {
        let { Shop } = this.props;
        let shippingOptions = this.getShippingOptions();
        let shipping = {}
        for (let i = 0; i < shippingOptions.length; i++) {
            let shippingOption = shippingOptions[i];
            let option = typeof shippingOption === 'function' ? shippingOption() : shippingOption
            let { def, field } = option;
            if (!field) { continue }
            shipping[field] = def;
        }
        Shop.updateShipping(shipping);
        Shop.updateFactor()
        this.setState({ shipping })
    }
    options_layout(shippingOptions) {
        if (!shippingOptions.length) { return false }
        return {
            column: shippingOptions.map((o) => {
                let shippingOption = typeof o === 'function' ? o() : o
                if (!shippingOption) { return false }
                let { show } = shippingOption;
                show = typeof show === 'function' ? show({ ...this.state.shipping }) : show;
                if (show === false) { return false }
                if (shippingOption.type === 'html') { return this.html_layout(shippingOption) }
                return this.option_layout(shippingOption)
            })
        }
    }
    optionTitle_layout(title, subtitle) {
        return {
            row: [
                { html: title, className: 'aio-shop-shipping-option-title', align: 'v' },
                { show: !!subtitle, size: 6 },
                { show: !!subtitle, html: `( ${subtitle} )`, style: { fontSize: '75%' }, align: 'v' }
            ]
        }
    }
    html_layout(option) {
        let { title, subtitle, html } = option;
        return {
            className: 'aio-shop-shipping-option aio-shop-box',
            column: [
                this.optionTitle_layout(title, subtitle),
                { html }
            ]
        }
    }
    option_layout(shippingOption) {
        let { Shop } = this.props;
        let { shipping } = this.state;
        let { title, subtitle, options, field, multiple, onChange = () => { } } = shippingOption;
        options = typeof options === 'function' ? options({ factor: JSON.parse(JSON.stringify(Shop.factor)), shipping: JSON.parse(JSON.stringify(shipping)) }) : options;
        return {
            className: 'aio-shop-shipping-option aio-shop-box',
            column: [
                this.optionTitle_layout(title, subtitle),
                { show: options.length === 1, html: options[0].text, className: 'aio-shop-shipping-radio-option' },
                {
                    show: options.length > 1,
                    html: (
                        <AIOButton
                            type='radio'
                            multiple={multiple}
                            options={options.map((o) => { return { ...o, before: o.icon } })}
                            optionClassName='"aio-shop-shipping-radio-option"'
                            value={this.state.shipping[field]}
                            onChange={async (value) => {
                                onChange(value);
                                let { shipping } = this.state;
                                shipping[field] = value;
                                Shop.updateShipping(shipping);
                                await Shop.updateFactor();
                                this.setState({ shipping })
                            }}
                        />
                    )
                }
            ]
        }
    }
    discountCode_layout(Shop) {
        let { checkDiscountCode } = Shop;
        if (!checkDiscountCode) { return false }
        let { discountCode, discountCodeAmount } = this.state;
        return {
            className: 'aio-shop-discount-code aio-shop-box',
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
        }
    }
    discountCodeError_layout() {
        let { discountCodeError } = this.state;
        if (!discountCodeError) { return false }
        return {
            className: 'aio-shop-shipping-discount-code-error',
            html: discountCodeError
        }
    }
    factor_layout(cartItems, Shop) {
        if (!cartItems.length) { return false }
        let { discounts, shippingPrice } = this.props;
        return { html: Shop.renderFactor({ discounts, shippingPrice }) }
    }
    submit_layout(onSubmit, factor) {
        return {
            className:'aio-shop-submit-button-container',html: <button onClick={() => onSubmit()} className='aio-shop-submit-button'>{`پرداخت ${SplitNumber(factor.amount)} تومان`}</button>
        }
    }
    render() {
        let { Shop, onSubmit } = this.props;
        let { getShippingOptions, getCart_list, factor } = Shop;
        let shippingOptions = getShippingOptions();
        let cartItems = getCart_list();
        return (
            <RVD
                layout={{
                    style: { background: '#f4f4f4', height: '100%' },
                    column: [
                        {
                            flex: 1, className: 'ofy-auto',
                            column: [
                                this.options_layout(shippingOptions),
                                this.discountCode_layout(Shop),
                                this.discountCodeError_layout(),
                                this.factor_layout(cartItems, Shop),
                            ]
                        },
                        this.submit_layout(onSubmit, factor),
                    ]
                }}
            />
        )
    }
}
class AIOShopTotal extends Component {
    total_layout(total) {
        return {
            className: 'fs-14',
            row: [
                { html: 'جمع سبد خرید', className: 'bold' },
                { flex: 1 },
                { html: SplitNumber(total), align: 'v', className: 'bold' },
                { size: 3 },
                { html: 'تومان', className: 'fs-10', align: 'v' }
            ]
        }
    }
    render() {
        let { Shop } = this.props;
        let { total, discount } = Shop.factor;
        return (
            <RVD
                layout={{
                    gap: 12,
                    column: [
                        this.total_layout(total - discount)
                    ]
                }}
            />
        )
    }
}
class AIOShopFactor extends Component {
    total_layout(total) {
        return {
            className: 'fs-12',
            row: [
                { html: 'مجموع قیمت' },
                { flex: 1 },
                { html: SplitNumber(total), align: 'v' },
                { size: 3 },
                { html: 'تومان', className: 'fs-10', align: 'v' }
            ]
        }
    }
    discount_layout(discount) {
        if (!discount) { return false }
        return {
            className: 'fs-12',
            row: [
                { html: 'مجموع تخفیف' },
                { flex: 1 },
                { html: SplitNumber(discount), align: 'v' },
                { size: 3 },
                { html: 'تومان', className: 'fs-10', align: 'v' },
                { html: <Icon path={mdiMinus} size={0.7} />, align: 'vh', style: { color: 'red' } }
            ]
        }
    }
    discounts_layout(discounts) {
        if (!discounts.length) { return false }
        return {
            className: 'fs-12', gap: 12,
            column: discounts.map(({ title, discountPercent, discount }) => {
                return {
                    row: [
                        { html: title },
                        { flex: 1 },
                        { show: !!discountPercent, html: `(${discountPercent}%)`, className: 'm-h-3' },
                        { html: SplitNumber(discount), align: 'v' },
                        { size: 3 },
                        { html: 'تومان', className: 'fs-10', align: 'v' },
                        { html: <Icon path={mdiMinus} size={0.7} />, align: 'vh', style: { color: 'red' } }
                    ]
                }
            })
        }
    }
    shippingPrice_layout(shippingPrice) {
        if (!shippingPrice) { return false }
        return {
            className: 'fs-12',
            row: [
                { html: 'هزینه ارسال' },
                { flex: 1 },
                { html: SplitNumber(shippingPrice), align: 'v' },
                { size: 3 },
                { html: 'تومان', className: 'fs-10', align: 'v' },
                { html: <Icon path={mdiPlus} size={0.7} />, align: 'vh', style: { color: 'green' } }
            ]
        }
    }
    amount_layout(amount) {
        return {
            className: 'fs-14',
            row: [
                { html: 'قابل پرداخت', className: 'bold' },
                { flex: 1 },
                { html: SplitNumber(amount), align: 'v', className: 'bold' },
                { size: 3 },
                { html: 'تومان', className: 'fs-10', align: 'v' }
            ]
        }
    }
    render() {
        let { Shop } = this.props;
        let { total, discount, discounts = [], amount, shippingPrice } = Shop.factor;
        return (
            <RVD
                layout={{
                    className: 'aio-shop-box', gap: 12,
                    column: [
                        this.total_layout(total),
                        this.discount_layout(discount),
                        this.discounts_layout(discounts),
                        this.shippingPrice_layout(shippingPrice),
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
        this.state = { count: props.count || 0, prevCount: props.count || 0 }
    }
    validateCount(count) {
        let { product, getProductProp } = this.props;
        let max = getProductProp(product, 'max', Infinity);
        let min = getProductProp(product, 'min', 0);
        if (count > max) { count = max }
        if (count < min) { count = min }
        return count;
    }
    change(count) {
        count = +count;
        if (isNaN(count)) { count = 0 }
        let { changeProductCount, product } = this.props;
        this.setState({ count });
        clearTimeout(this.changeTimeout);
        this.changeTimeout = setTimeout(() => {
            count = this.validateCount(count);
            changeProductCount(product, count)
        }, 500)
    }
    handlePropsChanged() {
        let { prevCount } = this.state;
        let { count } = this.props;
        if (count !== prevCount) { setTimeout(() => this.setState({ count, prevCount: count }), 0) }
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
        let { addCart, className } = this.props;
        return { html: <button onClick={() => this.change(1)} className={'aio-shop-cart-button-add' + (className ? ' ' + className : '')}>{addCart}</button> }
    }
    dirButton_layout(dir) {
        let { count } = this.state, { product, getProductProp } = this.props;
        let max = getProductProp(product, 'max', Infinity);
        return {
            align: 'vh',
            html: (
                <button className='aio-shop-cart-button-step' onClick={() => this.change(count + dir)} disabled={dir === 1 && count >= max}>
                    <Icon path={dir === 1 ? mdiPlus : (count === 1 ? mdiTrashCanOutline : mdiMinus)} size={dir === 1 ? .9 : (count === 1 ? .8 : .9)} />
                </button>
            )
        }
    }
    changeButton_layout() {
        let { count } = this.state;
        if (!count) { return false }
        return {
            row: [
                this.dirButton_layout(1),
                { html: (<div className='aio-shop-cart-button-input' onClick={() => this.setState({ popup: true })}>{count}</div>) },
                this.dirButton_layout(-1)
            ]
        }
    }
    render() {
        this.handlePropsChanged()
        let { count } = this.state;
        let { addCart, changeProductCount } = this.props;
        let layout;
        if (count) {
            if (!changeProductCount) { layout = this.cartIcon_layout() }
            else { layout = this.changeButton_layout() }
        }
        else { if (addCart) { layout = this.addButton_layout() } }
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
    image_layout(image) {
        return <img src={image} width='100%' />
    }
    discount_layout(discountPercent) {
        if (!discountPercent) { return false }
        return (<div className='aio-shop-product-card-discount'>{`${discountPercent} %`}</div>)
    }
    name_layout(name) { return { html: name, className: 'aio-shop-product-card-name' } }
    description_layout(description) {
        if (!description) { return false }
        return { html: description, className: 'aio-shop-product-card-description' }
    }
    price_layout(price, discountPercent) {
        let finalPrice = price - price * discountPercent / 100;
        return {
            flex: 1, className: 'p-h-6',
            row: [
                { show: !!discountPercent, html: () => <del>{`${price} تومان`}</del>, className: 'aio-shop-product-card-price', align: 'v' },
                {
                    row: [
                        { html: finalPrice, className: 'aio-shop-product-card-final-price', align: 'v' },
                        { size: 3 },
                        { html: 'تومان', className: 'aio-shop-product-card-unit', align: 'v' }
                    ]
                }
            ]
        }
    }
    html_layout(html){
        if(!html){return null}
        return html
    }
    render() {
        let { width = '100%', imageSize = 72, product, renderCartButton, getProductProp, className,html } = this.props;
        let name = getProductProp(product, 'name', '');
        let image = getProductProp(product, 'image', '');
        let price = getProductProp(product, 'price', 0);
        let discountPercent = getProductProp(product, 'discountPercent', 0);
        let description = getProductProp(product, 'description', '');
        return (
            <RVD
                layout={{
                    className: 'aio-shop-product-card' + (className ? ' ' + className : ''),
                    style: { width, height: 120 },
                    row: [
                        {
                            className: 'aio-shop-product-card-image',
                            html: (
                                <>
                                    {this.image_layout(image)}
                                    {this.discount_layout(discountPercent)}
                                    {this.html_layout(html)}
                                </>
                            )
                        },
                        {
                            flex: 1,
                            column: [
                                {
                                    flex: 1,
                                    column: [
                                        { size: 6 },
                                        this.name_layout(name),
                                        this.description_layout(description),
                                        { flex: 1 },
                                        {
                                            row: [
                                                this.price_layout(price, discountPercent),
                                                { html: (renderCartButton()) },
                                                { size: 12 }
                                            ]
                                        },
                                        { size: 6 }
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