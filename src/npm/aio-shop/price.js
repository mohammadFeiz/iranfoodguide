import React, { Component } from 'react';
import RVD from '../react-virtual-dom/react-virtual-dom';
import SplitNumber from '../aio-functions/split-number';
import getDiscountPercent from './getDiscountPercent';
export default class Price extends Component{
    price_layout(sum,price,config){
        if(!sum){return false}
        return {show:!!sum,html:(<del>{SplitNumber(price)}</del>),align:'v',...config}
    }
    finalPrice_layout(sum,price,config){
        return {html:`${SplitNumber(price - (price * sum / 100))}`,align:'v',...config}
    }
    unit_layout(unit,config){
        return {html:unit,align:'v',...config}
    }
    validateDiscountPercent(v = 0){v = +v; if(isNaN(v)){v = 0} return v}
    discountPercent_layout(discountPercentNumber,showDiscountPercent){
        let {discountPercent,size = 'm'} = this.props;
        if(showDiscountPercent === false || !discountPercentNumber){return false}
        let list = !Array.isArray(discountPercent)?[{value:discountPercent}]:discountPercent.map((o)=>{
            return typeof o === 'object'?o:{value:o}
        })
        let sizeClassName = {
            's':'as-discount-box-small',
            'm':'as-discount-box-medium',
            'l':'as-discount-box-large'
        }[size]
        return {
            gap:3,
            row:list.map(({text,value,color})=>{
                value = this.validateDiscountPercent(value);
                return {
                    show:!!value,html:value + '%',style:{background:color},
                    className:'as-discount-box ' + sizeClassName,align:'v'
                }
            })
        }
    }
    render(){
        let {price,discountPercent,style,type,showDiscountPercent,showPrice,size = 'm',unit} = this.props;
        let discountPercentNumber = getDiscountPercent(discountPercent)
        if(type === 'h'){
            return (
                <RVD
                    layout={{
                        gap:3,style,
                        row:[
                            this.discountPercent_layout(discountPercentNumber,showDiscountPercent),
                            showPrice !== false?this.price_layout(discountPercentNumber,price,{className:'as-fs-m as-fc-m'}):false,
                            showPrice !== false?this.finalPrice_layout(discountPercentNumber,price,{className:'as-fs-m as-fc-d as-bold'}):false,
                            showPrice !== false?this.unit_layout(unit,{className:'as-fs-s as-fc-l'}):false,
                            
                        ]
                    }}
                />
            )
        }
        
        if(type === 'v'){
            return (
                <RVD
                    layout={{
                        style,
                        column:[
                            {flex:1},
                            {
                                gap:6,show:!!discountPercentNumber,
                                row:[
                                    {flex:1},
                                    this.price_layout(discountPercentNumber,price,{className:size === 'l'?'as-fs-m as-fc-l':(size==='m'?'as-fs-s as-fc-l':'as-fs-s as-fc-l')}),
                                    this.discountPercent_layout(discountPercentNumber,showDiscountPercent)
                                ]
                            },
                            {
                                row:[
                                    {flex:1},
                                    this.finalPrice_layout(discountPercentNumber,price,{className:size === 'l'?'as-fs-l as-fc-d as-bold':(size==='m'?'as-fs-m as-fc-d as-bold':'as-fs-s as-fc-d as-bold')}),
                                    this.unit_layout(unit,{className:size === 'l'?'as-fs-m as-fc-l as-bold':(size==='m'?'as-fs-s as-fc-l as-bold':'as-fs-s as-fc-l as-bold')})
                                ]
                            },
                            {flex:1}
                        ]
                    }}
                />
            )
        }

    }
}