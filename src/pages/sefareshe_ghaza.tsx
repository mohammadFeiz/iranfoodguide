import React, { Component,useState,useContext,useEffect } from "react";
import RVD, { I_RVD_node } from '../npm/react-virtual-dom/index.tsx';
import ACS from '../npm/aio-content-slider/aio-content-slider.js';
import Card from '../card/card.js';
import Timer from "../components/timer.js";
import Search from './Search.tsx';
import AppContext from "../app-context.js";
import SearchBox from "../npm/search-box/search-box.js";
import { I_state } from "../typs.tsx";
export default function Sefareshe_ghaza() {
    let {APIS,rsa}:I_state = useContext(AppContext);
    let [data,setData] = useState(mockData())
    let [addresses,setAddresses] = useState([])
    let [content,setContent] = useState([])
    function getData(){
        APIS.safheye_sefaresh(undefined,{
            onSuccess:(content)=>setContent(content)
        })
    }
    useEffect(()=>{
        getData()
    },[])
    function billboard_layout(items):I_RVD_node {
        return (
            <ACS
                items={items.map(({src},i) => {
                    return (
                        <img key={i} src={src} width='100%' />
                    )
                })}
            />
        )
    }
    function categories_layout(items):I_RVD_node {
        return (
            <div style={{ display: 'grid',gridGap:6,padding:'0 12px', gridTemplateColumns: 'auto auto auto auto' }}>
                {
                    items.map(({name,src}) => {
                        return <Card type='card1' name={name} src={src}/>
                    })
                }
            </div>
        )
    }
    function titr_layout(text:string,onShowMore:Function):I_RVD_node{
        return {
            size:48,
            row:[
                {align:'v',html:text,className:'fs-16 bold'},
                {flex:1},
                {html:'نمایش بیشتر',className:'fs-14 bold orange-color',align:'v',onClick:()=>onShowMore()}
            ]
        }
    }
    function slider_layout(o){
        let {cardSize = {},header} = o;
        return (
            <RVD
                layout={{
                    className:'p-h-12 w-100',
                    column:[
                        {size:12},
                        titr_layout(o.name,()=>{}),
                        {
                            gap:12,className:'ofx-auto',
                            row:[
                                {
                                    show:!!header,className:'orange-bg br-12',
                                    column:[
                                        {flex:1,html:()=>header && header.endDate && <Timer endDate={header.endDate}/>,align:'vh'},
                                        {flex:1,html:()=>header && header.maxDiscount && <MaxDiscount maxDiscount={header.maxDiscount}/>}
                                    ]
                                },
                                {
                                    gap:12,
                                    row:o.items.map((o)=>{
                                        return {
                                            html:<Card type='restoran_card' {...o} width={cardSize.width} height={cardSize.height}/> 
                                        }
                                    })
                                }
                            ]
                        }
                    ]
                }}
            />
        )
    }
    function search_layout():I_RVD_node{
        return {
            className:'p-12',html:<SearchBox onClick={()=>rsa.addModal({position:'fullscreen',header:{title:'جستجو'},body:{render:()=><Search/>}})}/>
        }
    }
    function content_layout():I_RVD_node{
        return {
            flex:1,className:'ofy-auto',
            column:content.map((o)=>{
                if(o.type === 'Slider'){
                    return {html:slider_layout(o)}
                }
                if(o.type === 'Billboard'){
                    return {html:billboard_layout(o.items)}
                }
                if(o.type === 'Categories'){
                    return {align:'vh',html:categories_layout(o.items)}
                }
            })
        }
    }
    return (<RVD layout={{style:{background:'#fff'},column: [search_layout(),content_layout()]}}/>)
}
type I_MaxDiscount = {maxDiscount:number}
function MaxDiscount(props:I_MaxDiscount){
    let {maxDiscount} = props;
    return (
        <RVD
            layout={{
                style:{color:'#fff'},
                column:[
                    {html:`تا ${maxDiscount} درصد`,className:'bold',align:'h'},
                    {html:'تخفیف',className:'bold',align:'h'}
                ]
            }}
        />
    )
}
function mockData() {
    return {
        addresses: () => {
            return [
                {
                    value: '0',
                    text: 'پاسداران، چهاراه پاسداران خیابان مغان، خیابان جوانشیر'
                }
            ]
        },
        address: () => {
            return '0'
        }
    }
}

