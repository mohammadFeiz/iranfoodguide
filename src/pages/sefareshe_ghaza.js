import React, { Component } from "react";
import RVD from './../npm/react-virtual-dom/react-virtual-dom';
import ACS from './../npm/aio-content-slider/aio-content-slider';
import AIOButton from "../npm/aio-button/aio-button";
import Card from './../card/card';
import Timer from "../components/timer";

import { icons } from "../icons";
import AppContext from "../app-context";
export default class Sefareshe_ghaza extends Component {
    static contextType = AppContext;
    state = { 
        data: data(),
        addressId:false,
        addresses:[],
        content:[]
    }
    
    async componentDidMount(){
        let { profile,apis } = this.context;
        let {addresses,addressId} = profile;
        let content = await apis({
            api:'safheye_sefaresh',
            errorMessage:'دریافت اطلاعات صفحه سفارش غذا با خطا روبرو شد',
            validation:[
                (o)=>{
                    if(o.type === 'Categories'){
                        return {
                            items:[
                                {name:'string',src:'string',id:'string,number'}
                            ]
                        }
                    }
                    if(o.type === 'Billboard'){
                        return {items:[{src:'string'}]}
                    }
                    if(o.type === 'Slider'){
                        return {
                            name:'string',
                            items:[
                                {
                                    name:'string',
                                    image:'string',
                                    logo:'string,undefined',
                                    rate:'number',
                                    distance:'number,undefined',
                                    time:'number,undefined',
                                    tags:['string']
                                }
                            ]
                        }
                    }
                }
            ]
        })
        this.setState({addresses,addressId,content})
    }
    address_layout() {
        let {addresses,addressId} = this.state;
        let address = addresses.find(({id})=>id === addressId) || {address:''}
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
                            value={addressId}
                            options={addresses}
                            text={address.address.slice(0,54)}
                            style={{background:'none',width:'100%'}}
                            optionText='option.address.slice(0,54)'
                            optionValue='option.id'
                            caretAttrs={{ style: { color: '#FF5900' } }}
                            onChange={(value)=>this.setState({addressId:value})}
                        />
                    )
                }
            ]
        }
    }
    billboard_layout(items) {
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
    categories_layout(items) {
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
                if(o.type === 'Slider'){
                    return {html:this.slider_layout(o)}
                }
                if(o.type === 'Billboard'){
                    return {html:this.billboard_layout(o.items)}
                }
                if(o.type === 'Categories'){
                    return {html:this.categories_layout(o.items)}
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

