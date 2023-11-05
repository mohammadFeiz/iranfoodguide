import React,{Component} from "react";
import RVD from './../../npm/react-virtual-dom';
import SplitNumber from "../../npm/aio-functions/split-number";
import PopupHeader from './../../components/popup-header';
import AppContext from "../../app-context";
import {Icon} from '@mdi/react';
import { mdiArrowDown,mdiArrowUp } from "@mdi/js";
export default class Kife_pool extends Component{
    static contextType = AppContext;
    state = {tarikhche:[]}
    componentDidMount(){
        let {apis} = this.context;
        apis.request({
            api:'tarikhcheye_kife_pool',
            onSuccess:(tarikhche)=>this.setState({tarikhche})
        })
    }
    render(){
        let {mojoodiye_kife_pool} = this.context;
        let {tarikhche} = this.state;
        return (
            <RVD
                style={{background:'#fff',height:'100%'}}
                layout={{
                    column:[
                        {html:<PopupHeader title='کیف پول'/>},
                        {html:<MojoodiCard value={mojoodiye_kife_pool}/>},
                        {
                            size:48,className:'p-h-12',
                            row:[
                                {html:'تراکنش های کیف پول',align:'v',className:'fs-14 bold'},
                                {flex:1},
                                {html:'مشاهده همه',className:'theme-link',align:'v'}
                            ]
                        },
                        {
                            flex:1,gap:6,className:'ofy-auto',
                            column:tarikhche.map((o)=>{
                                return {html:<TarikhcheCard {...o}/>}
                            })
                        }
                    ]
                }}
            
            />
        )
    }
}

class MojoodiCard extends Component{
    render(){
        let {value} = this.props;
        return (
            <RVD
                layout={{
                    className:'p-12 m-12',
                    style:{background:'#fff'},
                    column:[
                        {html:`${SplitNumber(value)} ریال`,align:'h',className:'fs-14 bold'},
                        {html:'موجودی کیف پول شما',align:'h',className:'fs-12'}
                    ]
                }}
            />
        )
    }
}
class TarikhcheCard extends Component{
    render(){
        let {type,date,time,amount} = this.props;
        return (
            <RVD
                layout={{
                    className:'fs-12 p-6 m-h-12',
                    style:{border:'1px solid #ddd',background:'#fff'},
                    row:[
                        {size:48,html:<Icon path={type === 'in'?mdiArrowDown:mdiArrowUp} size={1.5}/>,align:'vh'},
                        {
                            flex:1,
                            column:[
                                {
                                    row:[
                                        {html:type === 'in'?'واریز وجه':'برداشت وجه',className:'fs-14 bold'},
                                        {flex:1},
                                        {html:date}
                                    ]
                                },
                                {
                                    row:[
                                        {html:`مبلغ ${SplitNumber(amount)} ریال`},
                                        {flex:1},
                                        {html:time}
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