import React, { Component } from 'react';
import RVD from '../react-virtual-dom/react-virtual-dom';
import AIOSlider from './../aio-slider/aio-slider';
import { Icon } from '@mdi/react';
import { mdiStar,mdiStarOutline,mdiStarHalfFull, mdiCircleSmall } from '@mdi/js';
import './rate.css';

export class Rate extends Component{
    getIcon(index){
        let {rate} = this.props;
        let full = Math.floor(rate);
        let half = !!(rate - full);
        if(index < full){return mdiStar}
        else if(index === full && half){return mdiStarHalfFull}
        else {return mdiStarOutline} 
    }
    render(){
        let {rate,color,singleStar} = this.props;
        return (
            <RVD
                layout={{
                    align: 'v', style: { direction: 'ltr' },
                    className:'align-vh as-rate',
                    row:[
                        {
                            html:rate,className:'as-rate-text',
                        },
                        {size:3},
                        {
                            row: Array(singleStar?1:5).fill(0).map((o, i) => {
                                return {
                                    style:{color},className:'as-rate-icon',html: <Icon path={this.getIcon(i)} size={0.6} />
                                }
                            })
                        },
                        
                    ]
                }}
            />
        )
    }
}

export class RateItems extends Component{
    getRangeColor(value){
        if(value < 1){return 'red'}
        if(value < 2){return 'orange'}
        if(value < 3){return 'yellow'}
        if(value < 4){return 'green'}
        return 'lightgreen'
    }
    item_layout({text,value}){
        return {
            className:'as-rate-items',
            row:[
                {html:text,className:'as-fs-s as-fs-m w-96 no-wrap',align:'v'},
                {
                    align:'v',className:'as-rate-item-slider',flex:1,
                    html:(
                        <AIOSlider
                            start={0} end={5} step={0.1} points={[value]} direction='left'
                            fillStyle={(index)=>{
                                if(index === 0){
                                    return {
                                        background:'green'
                                    }
                                }
                            }}
                        />
                    )
                },
                {
                    align:'vh',html:value,className:'as-rate-item-value'
                }
            ]
        }
    }
    render(){
        let {rates} = this.props;
        return (
            <RVD
                layout={{
                    column:rates.map((o)=>this.item_layout(o))
                }}
            />
        )
    }
}


