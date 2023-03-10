import React, { Component } from "react";
import RVD from '../npm/react-virtual-dom/react-virtual-dom';
import { icons } from "../icons";
export default class Card extends Component {
    render() {
        let { type } = this.props;
        if (type === 'card1') { return <Card1 {...this.props} /> }
        if (type === 'card2') { return <Card2 {...this.props} /> }
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

class Card2 extends Component {
    render() {
        let { width = 290,imageSize = 96,image, logo, name, distance, tags, time,rate,details,price,discount,shopName} = this.props;
        return (
            <RVD
                layout={{
                    className: 'br-12',
                    style: { width,height:220},
                    column: [
                        IMAGE({image,imageSize,discount}),
                        {
                            flex:1,
                            style:{border:'1px solid #eee',borderRadius:'0 0 12px 12px'},
                            column: [
                                { size: 6 },
                                LOGORATENAMEDISTANCESHOPNAME({logo,rate,name,distance,shopName}),
                                { flex: 1 },
                                DETAILS({details}),
                                {
                                    className: 'p-h-6',
                                    row: [
                                        TAGS({tags}),
                                        DELIVERYTIME({time})
                                    ]
                                },
                                PRICE({price,discount}),
                                {size:6}
                            ]
                        }
                    ]
                }}
            />
        )
    }
}
function IMAGE({imageSize,image,discount}){
    return { 
        size:imageSize,
        html: (
            <>
                <img src={image} width='100%' />
                {
                    !!discount &&
                    <div className={'orange-bg fs-12 p-h-6 br-4'} style={{
                        color:'#fff',
                        position:'absolute',
                        left:6,
                        top:6
                    }}>{`${discount} %`}</div>
                }
            </>
        ) 
    }
}
function LOGORATENAMEDISTANCESHOPNAME({logo,rate,name,distance,shopName}){
    return {
        className: 'p-h-6',
        row: [
            { show:!!logo,html:()=> <img src={logo} width='100%' style={{ width: 42, height: 42, border: '1px solid #eee', borderRadius: '100%' }} /> },
            { size: 6 },
            {
                column: [
                    { html: name, className: 'fs-14 bold' },
                    {
                        row: [
                            {
                                show:!!distance,
                                row:[
                                    { html: icons('location', { color: '#292D32',width:10,height:12 }), align: 'vh' },
                                    {size:3},
                                    { html:()=> `${distance} ?????????????? ?????????? ???? ??????`, className: 'fs-10 m-t-3', align: 'v' }
                                ]
                            },
                            { show:!!shopName,html:()=> shopName, className: 'fs-10 m-t-3', align: 'v' }
                        ]
                    }
                ]
            }
        ]
    }
}
function DETAILS({details}){
    if(details === undefined){return false}
    return {
        className:'p-h-6 m-b-6',
        row:details.map(([key,value])=>{
            return {
                flex:1,
                column:[
                    {html:value,className:'bold fs-12',align:'vh'},
                    {html:key,className:'fs-10',align:'vh'}
                ]
            }
        })
    }
}
function TAGS({tags}){
    if(!tags || !tags.length){return false}
    return {
        gap: 3,flex:1,className:'ofx-auto rvd-hidden-scrollbar',
        row: tags.map((o,i) => {
            return {
                align: 'vh',
                html: <div key={i} style={{
                    fontSize: 9,
                    background: 'rgba(109, 113, 123, 0.17)',
                    height: 16,
                    borderRadius: 12,
                    padding: '0 8px'
                }}>{o}</div>
            }
        })
    }
}

function DELIVERYTIME({time}){
    if(time === undefined){return false}
    return {
        className: 'fs-12',
        row: [
            { html: icons('kasket'), align: 'vh' },
            { size: 6 },
            { html: `${time} ??????????`, align: 'v' }
        ]
    }
}
function PRICE({price = 0,discount = 0}){
    let finalPrice = price - price * discount / 100;
    if(!finalPrice){return false}
    return {
        className:'p-h-6',
        row:[
            {show:!!discount,html:()=><del>{`${price} ??????????`}</del>,className:'fs-10',align:'v'},
            {flex:1},
            {html:finalPrice,className:'fs-12 bold',align:'v'},
            {size:3},
            {html:'??????????',className:'fs-10',align:'v'}
        ]
    }
}