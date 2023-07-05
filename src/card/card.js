import React, { Component } from "react";
import RVD from '../npm/react-virtual-dom/react-virtual-dom';
import calculateDistance from "../npm/aio-functions/calculate-distance";
import { icons } from "../icons";
import './card.css';
import AppContext from "../app-context";
export default class Card extends Component {
    render() {
        let { type } = this.props;
        if (type === 'card1') { return <Card1 {...this.props} /> }
        if (type === 'restoran_card') { return <RestoranCard {...this.props} /> }
    }
}

class Card1 extends Component {
    render() {
        let { src, name } = this.props;
        return (
            <RVD
                layout={{
                    style: { height: 100, width: 82, border: '1px solid #eee', background: '#fff', borderRadius: 12 },
                    column: [
                        { flex: 1, html: <img src={src} height='100%' />, align: 'vh' },
                        { size: 24, html: name, align: 'vh', className: 'fs-12 bold', style: { color: '#2C3143' } }
                    ]
                }}
            />
        )
    }
}

class RestoranCard extends Component {
    static contextType = AppContext;
    image_layout(image,imageSize){return {size:imageSize,html: (<><img src={image} width='100%' /></>)}}
    name_layout(name){return { html: name, className: 'fs-14 bold' }}
    details_layout(details){
        if(!details || !details.length){return false}
        return {className:'p-h-6 m-b-6',row:details.map(({title,value})=>this.detail_layout(title,value))}
    }
    detail_layout(title,value){
        return {flex:1,column:[{html:value,className:'bold fs-12',align:'vh'},{html:title,className:'fs-10',align:'vh'}]}
    }
    logo_layout(logo){
        if(!logo){return false}
        return { html:<img src={logo} width='100%' style={{ width: 42, height: 42, border: '1px solid #eee', borderRadius: '100%' }} /> }
    }
    tags_layout(tags){
        if(!tags || !tags.length){return false}
        let {restoran_tags_dic} = this.context;
        return {
            gap: 3,flex:1,className:'ofx-auto rvd-hidden-scrollbar',
            row: tags.map((o,i) => {
                return {align: 'vh',html: <div key={i} className='card-tag'>{restoran_tags_dic[o]}</div>}
            })
        }
    }
    distance_layout(latitude,longitude){
        let {addresses} = this.context;
        let address = addresses[0];
        if(!address || !address.latitude || !address.longitude || !latitude || !longitude){return false}
        let distance = calculateDistance(address.latitude,address.longitude,latitude,longitude) 
        return {
            gap:3,row:[
                { html: icons('location', { color: '#292D32',width:10,height:12 }), align: 'vh' },
                { html:()=> `${distance.toFixed(1)} کیلومتر فاصله از شما`, className: 'fs-10 m-t-3', align: 'v' }
            ]
        }
    }
    deliveryTime_layout(deliveryTime){
        return {
            className: 'fs-12',gap:6,
            row: [{ html: icons('kasket'), align: 'vh' },{ html: `${deliveryTime} دقیقه`, align: 'v' }]
        }
    }
    render() {
        let { width = 290,imageSize = 96,image, logo, name, latitude,longitude, tags, deliveryTime,rate,details,price,discount,onClick} = this.props;
        return (
            <RVD
                layout={{
                    className: 'br-12 card-3',style: { width,height:220},onClick,
                    column: [
                        this.image_layout(image,imageSize),
                        {
                            flex:1,
                            style:{border:'1px solid #eee',borderRadius:'0 0 12px 12px'},
                            column: [
                                { size: 6 },
                                {
                                    className: 'p-h-6',gap:6,
                                    row: [
                                        this.logo_layout(logo),
                                        {column: [this.name_layout(name),this.distance_layout(latitude,longitude)]}
                                    ]
                                },
                                { flex: 1 },
                                this.details_layout(details),
                                {className: 'p-h-6',row: [this.tags_layout(tags),this.deliveryTime_layout(deliveryTime)]},
                                {size:6}
                            ]
                        }
                    ]
                }}
            />
        )
    }
}

