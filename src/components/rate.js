import React,{Component} from "react";
import RVD from './../npm/react-virtual-dom/react-virtual-dom';
import {Icon} from '@mdi/react';
import {mdiStar,mdiStarOutline} from '@mdi/js';
export default class Rate extends Component{
    render(){
        let {rate} = this.props;
        return (
            <RVD
                layout={{
                    align: 'v', style: { direction: 'ltr' },
                    className:'align-vh',
                    row: Array(5).fill(0).map((o, i) => {
                        return {
                            html: <Icon path={i < rate ? mdiStar : mdiStarOutline} size={0.6} />, style: { color: '#FF7A00' }
                        }
                    })
                }}
            />
        )
    }
}