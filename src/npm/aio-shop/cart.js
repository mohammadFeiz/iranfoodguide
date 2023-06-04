import React, { Component } from 'react';
import RVD from '../react-virtual-dom/react-virtual-dom';
import SplitNumber from '../aio-functions/split-number';
import Box from './box';
import './cart.css';

export default class Cart extends Component {
    items_layout(cartItems,renderProductCard) {
        if (!cartItems.length) { return { html: 'سبد خرید شما خالی است', align: 'vh' } }
        return {
            className: 'of-visible p-h-12',
            column: [
                {
                    flex: 1, className: 'of-visible',
                    column: cartItems.map(({productId,variantId,type,product}) => {
                        if(!productId){console.error('Cart error => missing productId props')}
                        if(type === 'variant' && !variantId){console.error('Cart error => missing variantId props in cartItem by type = "variant"')}
                        return { 
                            className: 'of-visible', 
                            html: renderProductCard({product,variantId,config:{changeCart:true,type:'horizontal'}})
                        }
                    })
                }
            ]
        }
    }
    total_layout(cartItems, getFactor,unit) {
        if (!cartItems.length) { return false }
        let { total, discount } = getFactor();
        return {
            html:(
                <Box
                    layout={{
                        gap: 12,
                        column: [
                            {
                                className: 'as-fs-l as-fc-d',
                                row: [
                                    { html: 'جمع سبد خرید' },
                                    { flex: 1 },
                                    { html: SplitNumber(total - discount), align: 'v', className: 'bold' },
                                    { size: 3 },
                                    { html: unit, className: 'as-fs-s as-fc-l', align: 'v' }
                                ]
                            }
                        ]
                    }}
                />
            )
        }
    }
    submit_layout(cartItems) {
        if (!cartItems.length) { return false }
        let { onSubmit } = this.props;
        return {
            className: 'as-submit-button-container', 
            html: <button onClick={() => onSubmit()} className='as-submit-button'>تکمیل خرید</button>
        }
    }
    render() {
        let {cartItems,getFactor,renderProductCard,unit} = this.props;
        return (
            <RVD
                layout={{
                    className: 'as-cart',
                    column: [
                        {
                            flex: 1, className: 'ofy-auto',
                            column: [
                                this.items_layout(cartItems,renderProductCard),

                            ]
                        },
                        {
                            column: [
                                this.total_layout(cartItems, getFactor,unit),
                                this.submit_layout(cartItems)
                            ]
                        }

                    ]
                }}
            />
        )
    }
}