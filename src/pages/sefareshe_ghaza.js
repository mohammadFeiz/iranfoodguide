import React, { Component } from "react";
import RVD from './../npm/react-virtual-dom/react-virtual-dom';
import ACS from './../npm/aio-content-slider/aio-content-slider';
import AIOButton from "../npm/aio-button/aio-button";
import Card from './../card/card';
import AIODate from './../npm/aio-date/aio-date';
import frame210 from './../images/Frame 210.png';
import cat_irani_src from './../images/cat-irani.png';
import cat_sobhane_src from './../images/cat-sobhane.png';
import cat_ajil_src from './../images/cat-ajil.png';
import cat_abmive_src from './../images/cat-abmive.png';
import cat_saladbar_src from './../images/cat-saladbar.png';
import cat_fastfood_src from './../images/cat-fastfood.png';
import cat_kafe_src from './../images/cat-kafe.png';
import cat_shirini_src from './../images/cat-shirini.png';
import shandiz_logo from './../images/shandiz_logo.png';
import shandiz_image from './../images/shandiz_image.png';
import pasta_alferedo from './../images/pasta_alferedo.png';
import ghaem_image from './../images/ghaem_image.png';
import ghaem_logo from './../images/ghaem_logo.png';

import { icons } from "../icons";
export default class Sefareshe_ghaza extends Component {
    state = { 
        data: data(),
        content:[
            {
                type:'billboard',
                srcs:[frame210,frame210,frame210,frame210]
            },
            {
                type:'categories',
                categories:[
                    { name: 'فست فود', src: cat_fastfood_src, id: '0' },
                    { name: 'ایرانی', src: cat_irani_src, id: '1' },
                    { name: 'صبحانه', src: cat_sobhane_src, id: '2' },
                    { name: 'سالاد بار', src: cat_saladbar_src, id: '3' },
                    { name: 'شیرینی', src: cat_shirini_src, id: '4' },
                    { name: 'آجیل', src: cat_ajil_src, id: '5' },
                    { name: 'آبمیوه بستنی', src: cat_abmive_src, id: '6' },
                    { name: 'کافه', src: cat_kafe_src, id: '7' },
                ]
            },
            {
                type:'slider',
                name:'رستوران های تخفیف دار',
                items:[
                    {
                        name:'رستوران شاندیز گالریا',image:shandiz_image,logo:shandiz_logo,rate:3.4,distance:3,time:35,
                        tags:['ایرانی ','سنتی','فست فود','ملل']
                    },
                    {
                        name:'رستوران شاندیز گالریا',image:shandiz_image,logo:shandiz_logo,rate:3.4,distance:3,time:35,
                        tags:['ایرانی ','سنتی','فست فود','ملل']
                    },
                    {
                        name:'رستوران شاندیز گالریا',image:shandiz_image,logo:shandiz_logo,rate:3.4,distance:3,time:35,
                        tags:['ایرانی ','سنتی','فست فود','ملل']
                    }
                ]
            },
            {
                type:'slider',
                name:'نزدیک ترین ها به شما',
                items:[
                    {
                        name:'رستوران شاندیز گالریا',image:shandiz_image,logo:shandiz_logo,rate:3.4,distance:3,time:35,
                        tags:['ایرانی ','سنتی','فست فود','ملل']
                    },
                    {
                        name:'رستوران شاندیز گالریا',image:shandiz_image,logo:shandiz_logo,rate:3.4,distance:3,time:35,
                        tags:['ایرانی ','سنتی','فست فود','ملل']
                    },
                    {
                        name:'رستوران شاندیز گالریا',image:shandiz_image,logo:shandiz_logo,rate:3.4,distance:3,time:35,
                        tags:['ایرانی ','سنتی','فست فود','ملل']
                    }
                ]
            },
            {
                type:'slider',
                name:'غذا های تخفیف دار',
                cardSize:{width:160},
                header:{
                    maxDiscount:15,
                    endDate:new Date().getTime() + (6 * 60 * 60 * 1000)
                },
                items:[
                    {
                        name:'پاستا آلفردو ',shopName:'رستوران شاندیز گالریا',rate:3.4,
                        price:210000,discount:15,image:pasta_alferedo
                    },
                    {
                        name:' rtyrty rty rty rtyپاستا آلفردو ',shopName:'رستوران شاندیز گالریا',rate:3.4,
                        price:210000,discount:15,image:pasta_alferedo
                    },
                    {
                        name:'پاستا آلفردو ',shopName:'رستوران شاندیز گالریا',rate:3.4,
                        price:210000,discount:15,image:pasta_alferedo
                    },
                    {
                        name:'پاستا آلفردو ',shopName:'رستوران شاندیز گالریا',rate:3.4,
                        price:210000,discount:15,image:pasta_alferedo
                    }
                ]
            },
            {
                type:'slider',
                name:'جدید ترین رزروی ها',
                items:[
                    {
                        name:'رستوران قایم',distance:3,rate:3.4,logo:ghaem_logo,image:ghaem_image,
                        details:[
                            ['نوع میز','میز و آلاچیق'],['مدت زمان تاخیر','15 دقیقه'],['قابلیت مراسم','تولد و VIP']
                        ],
                        tags:['ایرانی','فست فود','ملل','قلیان','موسیقی زنده']
                    },
                    {
                        name:'رستوران قایم',distance:3,rate:3.4,logo:ghaem_logo,image:ghaem_image,
                        details:[
                            ['نوع میز','میز و آلاچیق'],['مدت زمان تاخیر','15 دقیقه'],['قابلیت مراسم','تولد و VIP']
                        ],
                        tags:['ایرانی','فست فود','ملل','قلیان','موسیقی زنده']
                    },
                    {
                        name:'رستوران قایم',distance:3,rate:3.4,logo:ghaem_logo,image:ghaem_image,
                        details:[
                            ['نوع میز','میز و آلاچیق'],['مدت زمان تاخیر','15 دقیقه'],['قابلیت مراسم','تولد و VIP']
                        ],
                        tags:['ایرانی','فست فود','ملل','قلیان','موسیقی زنده']
                    },
                    {
                        name:'رستوران قایم',distance:3,rate:3.4,logo:ghaem_logo,image:ghaem_image,
                        details:[
                            ['نوع میز','میز و آلاچیق'],['مدت زمان تاخیر','15 دقیقه'],['قابلیت مراسم','تولد و VIP']
                        ],
                        tags:['ایرانی','فست فود','ملل','قلیان','موسیقی زنده']
                    },
                    {
                        name:'رستوران قایم',distance:3,rate:3.4,logo:ghaem_logo,image:ghaem_image,
                        details:[
                            ['نوع میز','میز و آلاچیق'],['مدت زمان تاخیر','15 دقیقه'],['قابلیت مراسم','تولد و VIP']
                        ],
                        tags:['ایرانی','فست فود','ملل','قلیان','موسیقی زنده']
                    }
                ]
            }
        ],
    }
    address_layout() {
        let { address, addresses } = this.state.data;
        return {
            size:48,className:'p-h-12',
            row: [
                { html: icons('location'),align:'vh' },
                {
                    align:'v',
                    flex: 1,
                    html: (
                        <AIOButton
                            type='select'
                            value={address()}
                            options={addresses()}
                            style={{background:'none',width:'100%'}}
                            caretAttrs={{ style: { color: '#FF5900' } }}
                        />
                    )
                }
            ]
        }
    }
    billboard_layout(srcs) {
        return (
            <ACS
                items={srcs.map((src,i) => {
                    return (
                        <img key={i} src={src} width='100%' />
                    )
                })}
            />
        )
    }
    categories_layout(categories) {
        return (
            <div style={{ display: 'grid',gridGap:6,padding:'0 12px', gridTemplateColumns: 'auto auto auto auto' }}>
                {
                    categories.map(({name,src}) => {
                        return <Card type='card1' name={name} src={src}/>
                    })
                }
            </div>
        )
    }
    slider_layout(o){
        let {cardSize = {},header} = o;
        return (
            <RVD
                layout={{
                    className:'p-h-12 w-100',
                    column:[
                        {size:12},
                        TITR({text:o.name,onShowMore:()=>{}}),
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
                                            html:<Card type='card2' {...o} width={cardSize.width} height={cardSize.height}/> 
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
    content_layout(){
        let {content} = this.state;
        return {
            column:content.map((o)=>{
                if(o.type === 'slider'){
                    return {html:this.slider_layout(o)}
                }
                if(o.type === 'billboard'){
                    return {html:this.billboard_layout(o.srcs)}
                }
                if(o.type === 'categories'){
                    return {html:this.categories_layout(o.categories)}
                }
            })
        }
    }
    render() {
        return (
            <RVD
                layout={{
                    style:{background:'#fff'},
                    className:'ofy-auto',
                    column: [
                        this.address_layout(),
                        this.content_layout(),
                        {size:24}
                    ]
                }}
            />
        )
    }
}
class Timer extends Component{
    constructor(props){
        super(props);
        let {endDate} = props;
        let delta = AIODate().getDelta({date:endDate,pattern:'{hour}:{minute}:{second}'})
        this.state = {delta}
        setInterval(()=>{
            let delta = AIODate().getDelta({date:endDate,pattern:'{hour}:{minute}:{second}'})
            this.setState({delta})
        },1000)
    }
    render(){
        let {delta} = this.state;
        return (
            <RVD
                layout={{
                    className:'br-12 orange-bg',style:{height:256,width:96,color:'#fff',height:16},
                    row:[
                        {flex:1},
                        {
                            style:{background:'#fff',borderRadius:12,width:'fit-content',color:'#333'},
                            className:'fs-14 bold p-h-6',
                            row:[{html:delta,align:'v'},{size:6},{html:icons('time'),align:'vh'}]
                        },
                        {flex:1}
                    ]   
                }}
            />
        )
    }
}
class MaxDiscount extends Component{
    render(){
        let {maxDiscount} = this.props;
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
}
function TITR({text,onShowMore}){
    return {
        size:48,
        row:[
            {align:'v',html:text,className:'fs-16 bold',align:'v'},
            {flex:1},
            {html:'نمایش بیشتر',className:'fs-14 bold orange-color',align:'v',onClick:()=>onShowMore()}
        ]
    }
}
function data() {
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

