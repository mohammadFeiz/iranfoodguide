import React, { Component } from 'react';
import RVD from '../react-virtual-dom/react-virtual-dom';
import './slider.css';

export default class Slider extends Component{
    render(){
        let {items,renderProductCard,config = {}} = this.props;
        let {header,footer} = config;
        return (
            <RVD
                layout={{
                    className:'as-slider',gap:12,
                    row:[
                        {show:!!header,html:header,className:'as-slider-header'},
                        {
                            gap:12,className:'of-visible',
                            row:items.map(({product,variantId})=>{
                                return {
                                    className:'of-visible',html:renderProductCard({product,variantId,config:{...config,type:'vertical'}})
                                }
                            })
                        },
                        {show:!!footer,html:footer,className:'as-slider-footer'}
                    ]
                }}
            />
        )
    }
}