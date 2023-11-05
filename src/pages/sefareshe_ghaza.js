import React, { Component } from "react";
import RVD from './../npm/react-virtual-dom';
import ACS from './../npm/aio-content-slider/aio-content-slider';
import Card from './../card/card';
import Timer from "../components/timer";
import Search from './../pages/Search';
import AppContext from "../app-context";
import SearchBox from "./../npm/search-box/search-box";
export default class Sefareshe_ghaza extends Component {
    static contextType = AppContext;
    state = { 
        data: data(),
        addresses:[],
        content:[]
    }
    
    async componentDidMount(){
        let { apis } = this.context;
        let content = await apis.request({
            api:'safheye_sefaresh',
            description:'دریافت اطلاعات صفحه سفارش غذا',
            def:[]
        })
        this.setState({content})
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
    search_layout(){
        let {rsa} = this.context;
        return {
            className:'p-12',html:<SearchBox onClick={()=>rsa.addModal({position:'fullscreen',header:{title:'جستجو'},body:{render:()=><Search/>}})}/>
        }
    }
    content_layout(){
        let {content} = this.state;
        return {
            flex:1,className:'ofy-auto',
            column:content.map((o)=>{
                if(o.type === 'Slider'){
                    return {html:this.slider_layout(o)}
                }
                if(o.type === 'Billboard'){
                    return {html:this.billboard_layout(o.items)}
                }
                if(o.type === 'Categories'){
                    return {align:'vh',html:this.categories_layout(o.items)}
                }
            })
        }
    }
    render() {
        return (
            <RVD
                layout={{
                    style:{background:'#fff'},
                    column: [
                        this.search_layout(),
                        this.content_layout(),
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

