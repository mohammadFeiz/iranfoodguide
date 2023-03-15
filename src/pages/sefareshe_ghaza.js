import React, { Component } from "react";
import RVD from './../npm/react-virtual-dom/react-virtual-dom';
import ACS from './../npm/aio-content-slider/aio-content-slider';
import AIOButton from "../npm/aio-button/aio-button";
import Card from './../card/card';
import Timer from "../components/timer";
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
import AppContext from "../app-context";
export default class Sefareshe_ghaza extends Component {
    static contextType = AppContext;
    state = { 
        data: data(),
        addressId:false,
        addresses:[],
        content:[]
    }
    contentValidation(res){
        if(!Array.isArray(res)){
            return 'خروجی باید یک آرایه باشد'
        }
        for(let i = 0; i < res.length; i++){
            let o = res[i];
            if(typeof o !== 'object'){
                return 'رکورد نا معتبر. رکورد ها باید آبجکت باشند' +  + ' ( ' + JSON.stringify(o) + ' )'
            }
            let {type} = o;
            if(type === 'categories'){
                let error = 'in each object of categories array';
                let {categories} = o;
                if(!Array.isArray(categories)){
                    error += ' categories property should be an array'
                    error += ` - ${categories}`    
                    return error
                }
                for(let j = 0; j < categories.length; j++){
                    let cat = categories[j];
                    error += ' in each category'
                    if(typeof cat.name !== 'string'){
                        error += ' name property should be an string';
                        error += ` - ${cat.name}`;
                        return error;    
                    }
                    if(typeof cat.src !== 'string'){
                        error += ' src property should be an string';
                        error += ` - ${cat.src}`;
                        return error;    
                    }
                    if(typeof cat.id !== 'string'){
                        error += ' id property should be an string';
                        error += ` - ${cat.id}`;
                        return error;    
                    }
                }
            }
            else if (type === 'billboard'){
                let error = 'in billboard type';
                let {srcs} = o;
                if(!Array.isArray(srcs)){
                    error += ' srcs property should be an array'
                    error += ` - ${srcs}`    
                    return error
                }
                for(let j = 0; j < srcs.length; j++){
                    let src = srcs[j];
                    if(typeof src !== 'string'){
                        error += ' each member of srcs array'
                        error += ' should be an string';
                        error += ` - ${src}`;
                        return error;    
                    }
                }
            }
            else if(type === 'slider'){
                let {name,items} = o;
                let error = 'in slider type';
                if(typeof name !== 'string'){
                    error += ' name property'
                    error += ' should be an string';
                    error += ` - ${name}`;
                    return error;    
                }
                if(!Array.isArray(items)){
                    error += ' items property'
                    error += ' should be an array';
                    error += ` - ${items}`;
                    return error;    
                }
                for(let j = 0; j < items.length; j++){
                    let item = items[j];
                    let {name,image,logo,rate,distance,time,tags} = item;
                    error += ' in each item' 
                    if(typeof name !== 'string'){
                        error += ' name property';
                        error += ' should be an string';
                        error += ` - ${name}`;
                        return error;    
                    }
                    if(typeof image !== 'string'){
                        error += ' image property';
                        error += ' should be an string';
                        error += ` - ${image}`;
                        return error;    
                    }
                    if(typeof logo !== 'string'){
                        error += ' logo property';
                        error += ' should be an string';
                        error += ` - ${logo}`;
                        return error;    
                    }
                    
                }
            }
            else {
                return 'تایپ نا معتبر' + ' ( ' + type + ' )'
            }
        }
    }
    async componentDidMount(){
        let { profile,apis } = this.context;
        let {addresses,addressId} = profile;
        let content = await apis({
            api:'safheye_sefaresh',
            errorMessage:'دریافت اطلاعات صفحه سفارش غذا با خطا روبرو شد',
            validation:(res)=>{
                
            }
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

