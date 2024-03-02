import React,{Component, useContext, useEffect, useState} from "react";
import RVD from '../../npm/react-virtual-dom/index.tsx';
import SplitNumber from "../../npm/aio-functions/split-number";
import PopupHeader from '../popup-header';
import AppContext from "../../app-context";
import {Icon} from '@mdi/react';
import { mdiArrowDown,mdiArrowUp } from "@mdi/js";
import { I_state } from "../../typs";
type I_walletHistoryItem = {
    type:'in'|'out',date:string,time:string,amount:number
}
export default function Wallet(){
    let {apis,wallet}:I_state = useContext(AppContext);
    let [walletHistoryItems,setWalletHistoryItems] = useState<I_walletHistoryItem[]>([])
    function getHistory(){
        apis.request({
            api:'getWalletHistory',
            onSuccess:(walletHistoryItems:I_walletHistoryItem[])=>setWalletHistoryItems(walletHistoryItems)
        })
    }
    useEffect(()=>{getHistory()})
    return (
        <RVD
            style={{background:'#fff',height:'100%'}}
            layout={{
                column:[
                    {html:<PopupHeader title='کیف پول'/>},
                    {html:<MojoodiCard value={wallet}/>},
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
                        column:walletHistoryItems.map((o:I_walletHistoryItem)=>{
                            return {html:<WalletHistoryCard walletHistoryItem={o}/>}
                        })
                    }
                ]
            }}
        
        />
    )
}
type I_MojoodiCard = {value:number}
function MojoodiCard(props:I_MojoodiCard){
    let {value} = props;
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
type I_WalletHistoryCard = {walletHistoryItem:I_walletHistoryItem}
function WalletHistoryCard(props:I_WalletHistoryCard){
    let {walletHistoryItem} = props;
    let {type,date,time,amount} = walletHistoryItem;
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