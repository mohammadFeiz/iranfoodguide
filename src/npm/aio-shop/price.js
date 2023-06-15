import React, { Component } from 'react';
import RVD from '../react-virtual-dom/react-virtual-dom';
import SplitNumber from '../aio-functions/split-number';
import getDiscountPercent from './getDiscountPercent';
export default class Price extends Component{
    price_layout(sum){
        if(!sum){return false}
        let {price} = this.props;
        return {show:!!sum,html:(<del>{SplitNumber(price)}</del>),align:'v',style:{fontSize:'80%'}}
    }
    finalPrice_layout(sum){
        let {price} = this.props;
        return {html:`${SplitNumber(price - (price * sum / 100))}`,align:'v',style:{fontWeight:'bold'}}
    }
    unit_layout(){
        let {unit} = this.props;
        return {html:unit,align:'v',style:{fontSize:'70%'}}
    }
    validateDiscountPercent(v = 0){v = +v; if(isNaN(v)){v = 0} return v}
    discountPercent_layout(sum){
        if(!sum){return false}
        let {discountPercent} = this.props;
        let list = !Array.isArray(discountPercent)?[{value:discountPercent}]:discountPercent.map((o)=>{
            return typeof o === 'object'?o:{value:o}
        })
        return {
            gap:3,style:{fontSize:'85%'},
            row:list.map(({value})=>{
                value = this.validateDiscountPercent(value);
                return {
                    show:!!value,html:value + '%',
                    className:'as-discount-box',align:'v'
                }
            })
        }
    }
    render(){
        let {discountPercent,type = 'v'} = this.props;
        let sum = getDiscountPercent(discountPercent)
        if(type === 'h'){
            return (
                <RVD
                    layout={{
                        className:'as-price-layout',
                        gap:3,
                        row:[
                            this.discountPercent_layout(sum),
                            this.price_layout(sum),
                            this.finalPrice_layout(sum),
                            this.unit_layout()
                        ]
                    }}
                />
            )
        }
        return (
            <RVD
                layout={{
                    className:'as-price-layout',
                    column:[
                        {flex:1},
                        {
                            gap:3,show:!!sum,
                            row:[
                                {flex:1},
                                this.price_layout(sum),
                                this.discountPercent_layout(sum)
                            ]
                        },
                        {
                            row:[
                                {flex:1},
                                this.finalPrice_layout(sum),
                                this.unit_layout()
                            ]
                        },
                        {flex:1}
                    ]
                }}
            />
        )
        
    }
}