import React,{Component} from "react";
import RVD from './../npm/react-virtual-dom/index.tsx';
import {Icon} from '@mdi/react';
import {mdiStar,mdiStarOutline,mdiStarHalfFull} from '@mdi/js';
import './rate.css';
export default class Rate extends Component{
    getIcon(index){
        let {rate} = this.props;
        let full = Math.floor(rate);
        let half = !!(rate - full);
        if(index < full){return mdiStar}
        else if(index === full && half){return mdiStarHalfFull}
        else {return mdiStarOutline} 
    }
    render(){
        let {rate,color} = this.props;
        return (
            <RVD
                layout={{
                    align: 'v', style: { direction: 'ltr' },
                    className:'align-vh',
                    row:[
                        {
                            html:rate,className:'rate-text',
                        },
                        {size:3},
                        {
                            row: Array(5).fill(0).map((o, i) => {
                                return {
                                    style:{color},className:'rate-icon',html: <Icon path={this.getIcon(i)} size={0.6} />
                                }
                            })
                        },
                        
                    ]
                }}
            />
        )
    }
}