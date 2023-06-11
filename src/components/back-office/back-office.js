import React, { Component } from "react";
import AIOButton from "../../npm/aio-button/aio-button";
import Table from './../../npm/aio-table/aio-table';
import AIOPopup from "../../npm/aio-popup/aio-popup";
import AIOInput from './../../npm/aio-input/aio-input';
import AIOService from './../../npm/aio-service/aio-service';
import AIODatePicker from './../../npm/aio-datepicker/aio-datepicker';
import RVD from './../../npm/react-virtual-dom/react-virtual-dom';
import Form from './../../npm/aio-form-react/aio-form-react';
import Map from './../../npm/map/map';
import BOContext from "../../backoffice-context";
import { getResponse,getMock } from "./../../back-office-apis";
import { Icon } from "@mdi/react";
import Search from './../../npm/aio-functions/search';
import { mdiChevronLeft, mdiChevronDown, mdiArrowUpBold, mdiArrowDownBold, mdiDelete, mdiDotsHorizontal, mdiPlusThick, mdiClose, mdiMap, mdiMapMarker, mdiMapMarkerAlert, mdiMapMarkerCheck, mdiMagnify, mdiFormatListBulletedSquare, mdiCheck } from '@mdi/js';
import './back-office.css';
export default class BackOffice extends Component {
    constructor(props) {
        super(props);
        let {token} = props;
        this.state = {
            apis:AIOService({
                id:'ifbackoffice',token,getResponse,getMock
                
            }),
            tabs:[
                { text: 'رستوران ها', value: 'restorans' },
                { text: 'صفحه سفارش غذا', value: 'order-page' },
                { text: 'اسلایدر ها', value: 'sliders' }
            ],
            activeTabId: 'restorans',
            orderPageItems: [],
            sliders: [],
            restorans: [],
            scores:[]
        }
    }
    async componentDidMount(){
        let {apis} = this.state;
        let restorans = await apis({
            api:'get_restorans',
            name:'دریافت لیست رستوزان ها',
            def:[]
        });
        this.mounted = true;
        this.setState({restorans})

    }
    header_layout() {
        return {
            className: 'p-h-12 bold fs-14',
            html: 'پنل مدیریت محتوا',
            size: 48, align: 'v'
        }
    }
    tabs_layout() {
        let { activeTabId,tabs } = this.state;
        return {
            html: (
                <AIOButton
                    type='tabs'
                    options={tabs}
                    value={activeTabId}
                    onChange={(activeTabId) => this.setState({ activeTabId })}
                />
            )
        }
    }
    getBody(){
        let { activeTabId, orderPageItems,sliders,restorans } = this.state;
        if(activeTabId === 'order-page'){
            return (
                <OrderPage
                    sliders={sliders}
                    items={orderPageItems}
                    onChange={(orderPageItems) => {
                        this.setState({ orderPageItems })
                    }}
                />
            )
        }
        if (activeTabId === 'sliders') {
            return (
                <Sliders
                    items={sliders}
                    onChange={(sliders) => {
                        this.setState({ sliders})
                    }}
                />
            )    
        }
        if (activeTabId === 'restorans') {
            return (
                <Restorans
                    restorans={restorans}
                    onChange={(restorans) => {
                        this.setState({ restorans })
                    }}
                />
            )    
        }
    }
    body_layout() {
        return {
            flex: 1,
            html:this.getBody() 
        }
    }
    getContext(){
        return {
            ...this.state
        }
    }
    render() {
        if(!this.mounted){return null}
        return (
            <BOContext.Provider value={this.getContext()}>
                <RVD
                    layout={{
                        className: 'fullscreen',
                        column: [
                            this.header_layout(),
                            this.tabs_layout(),
                            { size: 12 },
                            this.body_layout()
                        ]
                    }}
                />
            </BOContext.Provider>
        )
    }
}
class Sliders extends Component{
    add(){
        let {items,onChange} = this.props;
        items.push({text:'',value:'',id:'slider ' + Math.random()})
        onChange(items);
    }
    header_layout(){
        return {
            size:36,className:'p-h-12 bold fs-14',
            row:[
                {html:'افزودن',align:'v',onClick:()=>this.add()}
            ]
        }
    }
    change(id,field,value){
        let {items,onChange} = this.props;
        onChange(items.map((o)=>{
            if(o.id === id){o[field] = value;}
            return o
        }))
    }
    body_layout(){
        let {items,onChange} = this.props;
        return {
            className:'fs-12',
            style:{border:'1px solid #aaa'},
            column:[
                {size:12},
                {
                    row:[
                        {html:'#',size:30,align:'vh'},
                        {html:'نام',flex:1,align:'vh'},
                        {html:'کلید',flex:1,align:'vh'}
                    ]
                },
                {
                    className:'fs-10',
                    column:items.map(({text,value,id},i)=>{
                        return {
                            row:[
                                {size:36,html:i + 1,className:'fs-14 bold',align:'vh'},
                                {
                                    flex:1,
                                    html:(
                                        <input
                                            style={{width:'100%',fontSize:'inherit'}}
                                            type='text' value={text}
                                            onChange={(e)=>this.change(id,'text',e.target.value)}
                                        />
                                    )
                                },
                                {
                                    flex:1,
                                    html:(
                                        <input
                                            style={{width:'100%',fontSize:'inherit'}}
                                            type='text' value={value}
                                            onChange={(e)=>this.change(id,'value',e.target.value)}
                                        />
                                    )
                                },
                                {
                                    size:36,html:<Icon path={mdiDelete} size={0.6}/>,align:'vh',
                                    style:{color:'red'},
                                    onClick:()=>onChange(items.filter((o)=>o.id !== id))
                                }
                            ]
                        }
                    })
                },
                {size:12}
            ]
        }
    }
    render(){
        return (
            <RVD
                layout={{
                    column:[
                        this.header_layout(),
                        this.body_layout()
                    ]
                }}
            />
        )
    }
}
class OrderPage extends Component {
    add_layout() {
        let { onChange } = this.props;
        return {
            size: 36, className: 'p-h-12',
            html: (
                <AIOButton
                    style={{ width: '100%' }}
                    type='select'
                    text='افزودن محتوی'
                    options={[
                        { text: 'بیلبورد', value: 'billboard' },
                        { text: 'دسته بندی', value: 'categories' },
                        { text: 'اسلایدر', value: 'slider' }
                    ]}
                    onChange={(type) => {
                        let { items } = this.props;
                        let id = 'order-page-' + type + '-' + Math.random();
                        let typeName = {
                            'billboard': 'بیلبورد',
                            'slider': 'اسلایدر',
                            'categories': 'دسته بندی',
                        }[type]
                        onChange(items.concat({ id, type, items: [], name: '', typeName,open:true,mode:false }))
                    }}
                />
            )
        }
    }
    card_layout(o,i){
        let { type, id } = o;
        let { items, onChange,sliders } = this.props;
        let COMPONENT = {
            'billboard':OrderPageCard,
            'categories':OrderPageCard,
            'slider':SliderCard
        }[type]
        return {
            html: (
                <COMPONENT
                    key={id} item={o} type={type} sliders={sliders}
                    isFirst={i === 0} isLast={i === items.length - 1}
                    onChange={(newItem) => {
                        let { items } = this.props;
                        onChange(items.map((item) => {
                            if (item.id === o.id) { return newItem }
                            return item
                        }))
                    }}
                    onMove={(type) => {
                        let { items } = this.props;
                        let index1 = i;
                        if (type === 'up' && index1 === 0) { return }
                        if (type === 'down' && index1 === items.length - 1) { return }
                        let index2 = index1 + (type === 'up' ? -1 : 1);
                        onChange(items.map((o, i) => {
                            if (i === index1) { return items[index2] }
                            if (i === index2) { return items[index1] }
                            return o
                        }))
                    }}
                    onRemove={() => {
                        let { items } = this.props;
                        onChange(items.filter((o) => o.id !== id))
                    }}
                    onToggle={() => {
                        let { items } = this.props;
                        onChange(items.map((item) => {
                            if (item.id === o.id) { return { ...item, open: !item.open } }
                            return item
                        }))
                    }}
                />
            )
        }
    }
    items_layout() {
        let { items } = this.props;
        return {
            flex: 1, className: 'ofy-auto', gap: 12,
            column: items.map((o, i) => this.card_layout(o,i))
        }
    }
    render() {
        return (
            <RVD
                layout={{
                    column: [
                        this.add_layout(),
                        { size: 12 },
                        this.items_layout()
                    ]
                }}
            />
        )
    }
}
class OrderPageCard extends Component {
    getUrl(obj) {
        var fr = new FileReader();
        fr.onload = () => {
            let { item } = this.props;
            let { items } = item;
            obj.file = fr.result;
            this.change('items',items);
        };
        fr.readAsDataURL(obj.file);
    }
    change(field,value) {
        let { onChange } = this.props;
        let { item } = this.props;
        item[field] = value;
        onChange(item);
    }
    add() {
        let { item } = this.props;
        let { items } = item;
        let id = 'billboard-item ' + Math.random();
        let newItem = { id };
        items.push(newItem);
        this.change('items',items)
    }
    addImage(item, file) {
        item.file = file;
        this.getUrl(item);
    }
    remove(id) {
        let {item} = this.props;
        let { items } = item;
        this.change('items',items.filter((o) => o.id !== id))
    }
    getIndexById(id) {
        let {item} = this.props;
        let { items } = item;
        for (let i = 0; i < items.length; i++) {
            if (items[i].id === id) { return i }
        }
    }
    move(id, type) {
        let {item} = this.props;
        let { items } = item;
        let index1 = this.getIndexById(id);
        if (type === 'up' && index1 === 0) { return }
        if (type === 'down' && index1 === items.length - 1) { return }
        let index2 = index1 + (type === 'up' ? -1 : 1);
        this.change('items',items.map((o, i) => {
            if (i === index1) { return items[index2] }
            if (i === index2) { return items[index1] }
            return o
        }))
    }
    header_layout() {
        let {item} = this.props;
        let {items,typeName,open} = item;
        let { onMove, onRemove, isFirst, isLast, onToggle } = this.props;
        return {
            className: 'fs-12',
            row: [
                {
                    size: 24, align: 'vh',
                    html: <Icon path={open ? mdiChevronDown : mdiChevronLeft} size={1} />,
                    onClick: () => onToggle()
                },
                { html: typeName, align: 'v', className: 'bold' },
                { size: 6 },
                { html: `(${items.length} مورد)`, align: 'v' },
                { flex: 1 },
                {
                    html: (
                        <AIOButton
                            type='select' caret={false}
                            style={{ background: 'none' }}
                            text={<Icon path={mdiDotsHorizontal} size={0.9} />}
                            options={[
                                { text: 'افزودن آیتم', before: <Icon path={mdiPlusThick} size={0.9} />, value: 'add' },
                                { show: !isFirst, text: 'انتقال به بالا', before: <Icon path={mdiArrowUpBold} size={0.9} />, value: 'moveup' },
                                { show: !isLast, text: 'انتقال به پایین', before: <Icon path={mdiArrowDownBold} size={0.9} />, value: 'movedown' },
                                { text: 'حذف', before: <Icon path={mdiDelete} size={0.9} />, value: 'remove' }
                            ]}
                            onChange={(value) => {
                                if (value === 'add') { this.add() }
                                else if (value === 'moveup') { onMove('up') }
                                else if (value === 'movedown') { onMove('down') }
                                else if (value === 'remove') { onRemove() }
                            }}
                        />
                    ), className: 'bold fs-12', style: { color: 'royalblue' }
                }
            ]
        }
    }
    item_toolbar_layout(obj, index) {
        let {item} = this.props;
        let { id, name } = obj;
        let { items } = item;
        let { type } = this.props;
        return {
            flex: 1, className: 'p-12', childsProps: { className: 'fs-12 bold', align: 'v' }, align: 'vh',
            gap: 12,
            column: [
                {
                    show: type === 'categories',
                    html: (
                        <input
                            type='text' value={name}
                            placeholder='نام را وارد کنید'
                            onChange={(e) => {
                                obj.name = e.target.value;
                                this.change('item',items)
                            }}
                        />
                    )
                },
                {
                    align: 'vh', gap: 6,
                    childsProps: {
                        size: 30, className: 'br-4 w-30 h-30',
                        style: { background: 'dodgerblue', color: '#fff' },
                        align: 'vh'
                    },
                    row: [
                        { show: index !== 0, onClick: () => this.move(id, 'up'), html: <Icon path={mdiArrowUpBold} size={1} /> },
                        { show: index !== items.length - 1, onClick: () => this.move(id, 'down'), html: <Icon path={mdiArrowDownBold} size={1} /> },
                        { onClick: () => this.move(id, 'down'), html: <Icon path={mdiDelete} size={1} />, style: { background: 'red', color: '#fff' } }
                    ]
                }
            ]
        }
    }
    item_image_layout(obj) {
        let { id, file } = obj;
        let { type } = this.props;
        return {
            size: type === 'billboard' ? 240 : 120, align: 'vh',
            style: { border: '1px solid #aaa' },
            html: (
                <AIOButton
                    type='file'
                    style={{ background: 'none' }}
                    text={
                        file ? (
                            <img
                                className='w-100 h-120'
                                src={file} height='120' width='100%'
                            />
                        ) : 'افزودن تصویر'
                    }
                    onChange={(o) => this.addImage(obj, o[0])}
                />
            )
        }
    }
    items_layout() {
        let {item} = this.props;
        let {items,open} = item;
        if (!items.length || !open) { return false }
        return {
            gap: 12,
            column: items.map((o, i) => {
                return {
                    size: 120, className: 'br-12',
                    style: { border: '1px solid #aaa' },
                    row: [
                        this.item_toolbar_layout(o, i),
                        this.item_image_layout(o, i)
                    ]
                }
            })
        }
    }
    render() {
        return (
            <RVD
                layout={{
                    className: 'p-12 m-h-12',
                    style: {
                        border: '1px solid #aaa',
                        borderRadius: 12,
                        background: '#fff'
                    },
                    gap: 12,
                    column: [
                        this.header_layout(),
                        this.items_layout()
                    ]
                }}
            />
        )
    }
}
class SliderCard extends Component{
    header_layout() {
        let {item} = this.props;
        let {typeName,open} = item;
        let { onMove, onRemove, isFirst, isLast, onToggle } = this.props;
        return {
            className: 'fs-12',
            row: [
                {
                    size: 24, align: 'vh',
                    html: <Icon path={open ? mdiChevronDown : mdiChevronLeft} size={1} />,
                    onClick: () => onToggle()
                },
                { html: typeName, align: 'v', className: 'bold' },
                { flex: 1 },
                {
                    html: (
                        <AIOButton
                            type='select' caret={false}
                            style={{ background: 'none' }}
                            text={<Icon path={mdiDotsHorizontal} size={0.9} />}
                            options={[
                                { show: !isFirst, text: 'انتقال به بالا', before: <Icon path={mdiArrowUpBold} size={0.9} />, value: 'moveup' },
                                { show: !isLast, text: 'انتقال به پایین', before: <Icon path={mdiArrowDownBold} size={0.9} />, value: 'movedown' },
                                { text: 'حذف', before: <Icon path={mdiDelete} size={0.9} />, value: 'remove' }
                            ]}
                            onChange={(value) => {
                                if (value === 'add') { this.add() }
                                else if (value === 'moveup') { onMove('up') }
                                else if (value === 'movedown') { onMove('down') }
                                else if (value === 'remove') { onRemove() }
                            }}
                        />
                    ), className: 'bold fs-12', style: { color: 'royalblue' }
                }
            ]
        }
    }
    change(field,value){
        let {item,onChange} = this.props;
        item[field] = value;
        onChange(item);
    }
    body_layout(){
        let {item,sliders} = this.props;
        let {mode,endDate,maxDiscount,open} = item;
        if(!open){return false}
        return {
            className:'fs-10 bold',
            column:[
                {
                    row:[
                        {html:'نوع',size:80,align:'v'},
                        {
                            flex:1,
                            html:(
                                <AIOButton
                                    type='select'
                                    value={mode}
                                    style={{width:'100%',background:'none',border:'1px solid #ddd'}}
                                    options={[
                                        {text:'انتخاب نشده',value:false},
                                    ].concat(sliders)}
                                    onChange={(value)=>this.change('mode',value)}
                                />
                            )
                        }
                    ]
                },
                {size:6},
                {
                    row:[
                        {html:'زمان پایان',size:80,align:'v'},
                        {
                            flex:1,
                            html:(
                                <AIODatePicker
                                    style={{height:24,width:'100%'}}
                                    value={endDate}
                                    unit='hour'
                                    onChange={({dateString})=>this.change('endDate',dateString)}
                                />
                            )
                        }
                    ]
                },
                {size:6},
                {
                    row:[
                        {html:'سقف تخفیف %',size:80,align:'v'},
                        {
                            flex:1,
                            html:(
                                <input
                                    style={{border:'1px solid #ddd',width:'100%'}}
                                    type='number'
                                    value={maxDiscount}
                                    onChange={(e)=>this.change('maxDiscount',e.target.value)}
                                />
                            )
                        }
                    ]
                }
            ]
        }
    }
    render(){
        return (
            <RVD
                layout={{
                    className: 'p-12 m-h-12',
                    style: {
                        border: '1px solid #aaa',
                        borderRadius: 12,
                        background: '#fff'
                    },
                    gap: 12,
                    column:[
                        this.header_layout(),
                        this.body_layout()
                    ]
                }}
            />
        )
    }
}
class Restorans extends Component{
    static contextType = BOContext;
    constructor(props){
        super(props);
        let {restorans} = props;
        this.state = {restorans,popup:false,searchValue:''}
        this.columns = [
            {}
        ]
    }
    inline_add(){
        let newRestoran = {
            name:'',
            image:false,
            logo:false,
            latitude:35.699739,
            longitude:51.338097,
            address:'',
            ifRate:0,
            ifComment:'',
            tags:[],
            phone:'',
        }
        let {popup} = this.state;
        popup.addPopup({
            title:'افزودن رستوران',
            type:'fullscreen',
            body:()=>{
                return (
                    <RVD
                        layout={{
                            style:{height:'100%',background:'#fff'},
                            column:[
                                {
                                    html:(
                                        <RestoranCard
                                            restoran={newRestoran}
                                            onAdd={(model)=>this.add(model)}
                                        />
                                    )
                                }
                            ]
                        }}
                    />
                )
            }
        })
        
    }
    getRestoranById(id){
        let {restorans} = this.state;
        return restorans.find((o)=>o.id === id);
    }
    async add(model){
        debugger;
        let {apis} = this.context;
        apis({
            api:'add_restoran',
            parameter:model,
            callback:(newRestoran)=>{
                let {restorans,popup} = this.state;
                let {onChange} = this.props;
                let newRestorans = [newRestoran,...restorans]
                this.setState({restorans:newRestorans});
                onChange(newRestorans);
                popup.removePopup();
            }
        })
    }
    header_layout(){
        let {searchValue} = this.state;
        return {
            className:'p-h-6',
            row:[
                {size:48,align:'vh',html:<Icon path={mdiPlusThick} size={1}/>,onClick:()=>this.inline_add(),className:'fs-14 bold',style:{background:'dodgerblue',color:'#fff'}},
                {
                    flex:1,
                    html:(
                        <AIOInput
                            type='text'
                            style={{width:'100%'}}
                            value={searchValue}
                            after={<Icon path={mdiMagnify} size={.9} style={{margin:'0 6px'}}/>}
                            onChange={(searchValue)=>this.setState({searchValue})}
                        />
                    )
                }
            ]
        }
    }
    remove(id){
        let {restorans} = this.state;
        let {onChange} = this.props;
        let newRestorans = restorans.filter((o)=>o.id !== id)
        this.setState({restorans:newRestorans});
        onChange(newRestorans)
    }
    getRestoransBySearch(){
        let {restorans,searchValue} = this.state;
        return Search(restorans,searchValue,(o)=>`${o.name} ${o.address} ${o.phone}`)
    }
    body_layout(){
        return {
            flex:1,className:'ofy-auto',
            column:this.getRestoransBySearch().map((o)=>{
                return {
                    html:(
                        <RestoranCard
                            key={o.id}
                            restoran={o}
                            onEdit={()=>{

                            }}
                            onRemove={()=>{
                                let {apis} = this.context;
                                apis({api:'remove_restoran',parameter:o.id,callback:()=>this.remove(o.id)})
                            }}
                        />
                    )
                }
            })
        }
    }
    render(){
        return (
            <>
                <RVD
                    layout={{
                        column:[
                            this.header_layout(),
                            this.body_layout()
                        ]
                    }}
                />
                <AIOPopup
                    getActions={({addPopup,removePopup})=>this.setState({popup:{addPopup,removePopup}})}
                />
            </>
        ) 
    }
}

class RestoranCard extends Component{
    static contextType = BOContext;
    constructor(props){
        super(props);
        this.state = {
            model:{...props.restoran},
            popup:false
        }
    }
    menu_layout(){
        return (
            <div 
                style={{color:'orange',height:72,width:'100%',display:'flex',alignItems:'center',justifyContent:'center',border:'1px dashed #333'}}
                onClick={()=>this.openMenu()}
            ><Icon path={mdiFormatListBulletedSquare} size={2}/></div>
        )
    }
    map_layout(){
        let {model} = this.state;
        let style,path;
        if(model.latitude === 35.699739 || model.longitude === 51.338097){style = {color:'red'}; path = mdiMapMarkerAlert}
        else{style = {color:'green'}; path = mdiMapMarkerCheck}
        return (
            <div 
                style={{...style,height:72,width:'100%',display:'flex',alignItems:'center',justifyContent:'center',border:'1px dashed #333'}}
                onClick={()=>this.openMap()}
            ><Icon path={path} size={2}/></div>
        )
    }
    remove_layout(){
        let {onRemove} = this.props;
        return (
            <div 
                style={{color:'red',height:72,width:'100%',display:'flex',alignItems:'center',justifyContent:'center',border:'1px dashed #333'}}
                onClick={()=>onRemove()}
            ><Icon path={mdiClose} size={2}/></div>
        )
    }
    image_layout(image){
        let {model} = this.state;
        return (
            <AIOButton
                type='file'
                text={image?<img src={image} width={200}/>:'افزودن تصویر'}
                onChange={async (files)=>{
                    if (FileReader && files && files.length) {
                        let fr = new FileReader();
                        fr.onload = () => {
                            model.image = fr.result;
                            model.image_file = files[0];
                            this.setState({model})
                        }
                        fr.readAsDataURL(files[0]);
                    }
                }}
                style={{
                    width:200,
                    height:72,
                    border:'1px dashed #333'
                }}
            />
            
        )
    }
    logo_layout(image){
        let {model} = this.state;
        return (
            <AIOButton
                type='file'
                text={image?<img src={image} style={{width:72,height:72}} width='100%'/>:'افزودن لوگو'}
                onChange={async (files)=>{
                    if (FileReader && files && files.length) {
                        let fr = new FileReader();
                        fr.onload = () => {
                            model.logo = fr.result;
                            model.logo_file = files[0];
                            this.setState({model})
                        }
                        fr.readAsDataURL(files[0]);
                    }
                }}
                style={{
                    width:72,
                    height:72,
                    border:'1px dashed #333'
                }}
            />
            
        )
    }
    form_layout(){
        let {model} = this.state;
        let {onRemove} = this.props;
        return {
            html:(
                <Form
                    lang='fa'
                    theme={{
                        inlineLabel:true,
                        labelStyle:{width:70},
                        rowStyle:{marginBottom:0},
                        bodyStyle:{padding:6}
                    }}
                    reset={true}
                    showErrors={false}
                    model={model}
                    footer={(obj)=>this.formFooter_layout(obj)}
                    onChange={(model)=>this.setState({model})}
                    inputs={[
                        {type:'html',html:()=>this.image_layout(model.image),rowKey:'0'},
                        {type:'html',html:()=>this.logo_layout(model.logo),rowKey:'0'},
                        {type:'html',rowKey:'0'},
                        {type:'html',html:()=>this.menu_layout(),rowKey:'0'},
                        {type:'html',html:()=>this.map_layout(model.logo),rowKey:'0'},
                        {type:'html',html:()=>this.remove_layout(),rowKey:'0',show:!!onRemove,rowWidth:72},
                        {type:'text',field:'model.id',label:'آی دی',disabled:true,show:model.id !== undefined},
                        {type:'text',field:'model.name',label:'نام',validations:[['required']]},
                        {type:'textarea',autoHeight:true,field:'model.address',label:'آدرس',validations:[['required']]},
                        {type:'text',field:'model.phone',label:'تلفن ثابت',justNumber:true,validations:[['required']]}
                        
                    ]}
                />
            )
        }
    }
    getErrorMessage(errors,errorKeys){
        let {model} = this.state;
        if(model.latitude === 35.699739 || model.longitude === 51.338097){
            return 'ثبت موقعیت رستوران روی نقشه ضروری است'
        }
        let firstError = errorKeys[0]?errors[errorKeys[0]]:false;
        if(firstError){return firstError}
        if(!model.image){return 'ثبت تصویر رستوران ضروری است'}
        if(!model.logo){return 'ثبت لوگو رستوران ضروری است'}

    }
    formFooter_layout({errors,isModelChanged,onReset}){
        let {model} = this.state;
        let {onAdd,onEdit} = this.props;
        let errorKeys = Object.keys(errors);
        let showSubmit = !!onAdd;
        let showEdit = !!onEdit && isModelChanged;
        let errorMessage = this.getErrorMessage(errors,errorKeys);
        if(!showSubmit && !showEdit && !errorMessage){return false}
        return (
            <RVD
                layout={{
                    className:'h-36 p-h-12 p-v-6',
                    row:[
                        {
                            show:showSubmit,
                            html:(
                                <button 
                                    disabled={!!errorMessage}
                                    className='bo-submit-button'
                                    onClick={()=>onAdd(model)}
                                >ثبت</button>
                            )
                        },
                        {
                            show:showEdit,
                            html:(
                                <button 
                                    className='bo-edit-button'
                                    onClick={()=>onEdit(model)}
                                >ویرایش</button>
                            )
                        },
                        {
                            show:!!onReset,
                            html:(
                                <button 
                                    className='bo-reset-button'
                                    onClick={()=>onReset(model)}
                                >بازنشانی تغییرات</button>
                            )
                        },
                        {flex:1},
                        {show:!!errorMessage,html:()=>errorMessage,align:'v',style:{color:'red',fontSize:10}}
                    ]
                }}
            />
        )
    }
    openMap(){
        let {popup,model} = this.state;
        popup.addPopup({
            title:'انتخاب موقعیت',
            type:'fullscreen',
            animate:false,
            body:()=>{
                return (
                    <Map
                        apiKey='web.c6d5b589faf947e1b6143fa8977eb9b7'
                        style={{width:'100%',height:'100%'}}
                        latitude={model.latitude}
                        longitude={model.longitude}
                        onSubmit={(latitude,longitude,address)=>{
                            this.setState({model:{...model,latitude,longitude,address}});
                            popup.removePopup();
                        }}
                    />
                )
            }
        })
    }
    openMenu(){
        let {popup,model} = this.state;
        popup.addPopup({
            title:`منوی رستوران ${model.name}`,
            type:'fullscreen',
            animate:false,
            body:()=>{
                return (
                    <div style={{height:'100%',background:'#fff'}}>
                        <Menu restoranId={model.id} onClose={()=>popup.removePopup()}/>
                    </div>
                )
            }
        })
    }
    render(){
        return (
            <>
                <RVD
                    layout={{
                        column:[
                            this.form_layout()
                        ]
                    }}
                />
                <AIOPopup
                    getActions={({addPopup,removePopup})=>this.setState({popup:{addPopup,removePopup}})}
                />
            </>
        )
    }
}

class Menu extends Component{
    static contextType = BOContext;
    constructor(props){
        super(props);
        this.state = {foods:[],popup:false}
    }
    async getFoods(){
        let {apis} = this.context;
        let {restoranId} = this.props;
        await apis({
            api:'get_restoran_menu',
            name:'دریافت اطلاعات منوی رستوران',
            parameter:restoranId,
            callback:(foods)=>this.setState({foods})
        })
    }
    async componentDidMount(){
        await this.getFoods()
    }
    header_layout(){
        return {className:'p-h-6',row:[this.add_layout(),this.search_layout(),this.submit_layout()]}
    }
    add_layout(){
        return {
            size:48,align:'vh',className:'fs-14 bold',
            html:<Icon path={mdiPlusThick} size={1}/>,
            onClick:()=>this.openAddPopup(),
            style:{background:'dodgerblue',color:'#fff'}
        }
    }
    search_layout(){
        let {searchValue} = this.state;
        return {
            flex:1,
            html:(
                <AIOInput
                    type='text' style={{width:'100%'}} value={searchValue}
                    after={<Icon path={mdiMagnify} size={.9} style={{margin:'0 6px'}}/>}
                    onChange={(searchValue)=>this.setState({searchValue})}
                />
            )
        }
    }
    submit_layout(){
        let {apis} = this.context;
        let {restoranId} = this.props;
        return {
            size:48,align:'vh',className:'fs-14 bold',
            html:<Icon path={mdiCheck} size={1}/>,
            onClick:()=>{
                let {onClose} = this.props,{foods} = this.state;
                apis({api:'edit_restoran_menu',name:'ویرایش منوی رستوران',parameter:{restoranId,menu:foods},callback:()=>onClose()})
            },
            style:{background:'dodgerblue',color:'#fff'}
        }
    }
    getFoodsBySearch(){
        let {foods,searchValue} = this.state;
        return Search(foods,searchValue,(o)=>o.name)
    }
    body_layout(){
        return {
            flex:1,className:'ofy-auto',
            column:this.getFoodsBySearch().map((o)=>{
                return {
                    html:(
                        <FoodCard
                            key={o.id}
                            food={o}
                            onRemove={()=>{
                                let {foods} = this.state;
                                let newFoods = foods.filter((nf)=>nf.id !== o.id)
                                this.setState({foods:newFoods});
                            }}
                            onEdit={(newFood)=>{
                                let {foods} = this.state;
                                let newFoods = foods.map((food)=>food.id === newFood.id?newFood:food)
                                this.setState({foods:newFoods});
                            }}
                        />
                    )
                }
            })
        }
    }
    openAddPopup(){
        let {popup} = this.state;
        let newFood = {name:'',image:false,review:'',description:'',details:[],tags:[],price:0}
        popup.addPopup({
            title:'افزودن غذا',type:'fullscreen',
            body:()=>(
                <RVD 
                    layout={{
                        style:{height:'100%',background:'#fff'},
                        column:[
                            {
                                html:(
                                    <FoodCard 
                                        food={newFood} 
                                        onAdd={(newFood)=>{
                                            let {foods} = this.state;
                                            let newFoods = [newFood,...foods]
                                            this.setState({foods:newFoods});
                                            popup.removePopup();
                                        }}
                                    />
                                )
                            }
                        ]
                    }}
                />
            )
        })
    }
    render(){
        return (
            <>
                <RVD
                    layout={{
                        column:[
                            this.header_layout(),
                            this.body_layout()
                        ]
                    }}
                />
                <AIOPopup
                    getActions={({addPopup,removePopup})=>this.setState({popup:{addPopup,removePopup}})}
                />
            </>
        ) 
    }
}

class FoodCard extends Component{
    static contextType = BOContext;
    constructor(props){
        super(props);
        this.state = {
            model:{...props.food},
            popup:false
        }
    }
    remove_layout(){
        let {onRemove} = this.props;
        if(!onRemove){return false}
        return {
            html:(
                <div 
                    style={{color:'#fff',background:'red',height:36,width:'100%',display:'flex',alignItems:'center',justifyContent:'center',border:'1px dashed #333'}}
                    onClick={()=>onRemove()}
                >حذف غذا</div>
            )
        }
    }
    image_layout(image){
        let {model} = this.state;
        return (
            <AIOButton
                type='file'
                text={image?<img src={image} style={{width:72,height:72}} width='100%'/>:'افزودن تصویر'}
                onChange={async (files)=>{
                    if (FileReader && files && files.length) {
                        let fr = new FileReader();
                        fr.onload = () => {
                            model.image = fr.result;
                            model.image_file = files[0];
                            this.setState({model})
                        }
                        fr.readAsDataURL(files[0]);
                    }
                }}
                style={{
                    width:72,
                    height:72,
                    border:'1px dashed #333'
                }}
            />
            
        )
        
    }
    optionTypes_layout(){
        let {model} = this.state;
        let {optionTypes = []} = model;
        return (
            <AIOButton
                type='table'
                add={{text:'',value:''}}
                rows={optionTypes}
                onChange={(optionTypes)=>{
                    model.optionTypes = optionTypes;
                    this.setState({model})
                }}
                columns={[
                    {title:'نام',value:'row.text'},
                    {title:'آی دی',value:'row.value'},
                ]}
                
            />
            
        )
    }
    form_layout(){
        let {model} = this.state;
        let {onRemove} = this.props;
        return {
            flex:1,
            html:(
                <Form
                    lang='fa'
                    theme={{
                        inlineLabel:true,
                        labelStyle:{width:70},
                        rowStyle:{marginBottom:0},
                        bodyStyle:{padding:6}
                    }}
                    reset={true}
                    showErrors={false}
                    model={model}
                    footer={(obj)=>this.formFooter_layout(obj)}
                    onChange={(model)=>this.setState({model})}
                    inputs={[
                        {type:'text',field:'model.id',label:'آی دی',disabled:true,show:model.id !== undefined},
                        {type:'text',field:'model.name',label:'نام',validations:[['required']]},
                        {type:'textarea',autoHeight:true,field:'model.description',label:'توضیحات',validations:[['required']]},
                        {type:'textarea',autoHeight:true,field:'model.review',label:'شرح',validations:[['required']]},
                        {type:'number',field:'model.price',label:'قیمت',validations:[['required']]},
                        {type:'html',label:'آپشن ها',html:()=>this.optionTypes_layout()},
                        {type:'html',label:'تصویر',html:()=>this.image_layout()},
                        
                    ]}
                />
            )
        }
    }
    getErrorMessage(errors,errorKeys){
        let {model} = this.state;
        let firstError = errorKeys[0]?errors[errorKeys[0]]:false;
        if(firstError){return firstError}
        if(!model.image){return 'ثبت تصویر رستوران ضروری است'}
    }
    formFooter_layout({errors,isModelChanged,onReset}){
        let {model} = this.state;
        let {onAdd,onEdit} = this.props;
        let errorKeys = Object.keys(errors);
        let showSubmit = !!onAdd;
        let showEdit = !!onEdit && isModelChanged;
        let errorMessage = this.getErrorMessage(errors,errorKeys);
        if(!showSubmit && !showEdit && !errorMessage){return false}
        return (
            <RVD
                layout={{
                    className:'h-36 p-h-12 p-v-6',
                    row:[
                        {
                            show:showSubmit,
                            html:(
                                <button 
                                    disabled={!!errorMessage}
                                    className='bo-submit-button'
                                    onClick={()=>onAdd(model)}
                                >ثبت</button>
                            )
                        },
                        {
                            show:showEdit,
                            html:(
                                <button 
                                    className='bo-edit-button'
                                    onClick={()=>onEdit(model)}
                                >ویرایش</button>
                            )
                        },
                        {
                            show:!!onReset,
                            html:(
                                <button 
                                    className='bo-reset-button'
                                    onClick={()=>onReset(model)}
                                >بازنشانی تغییرات</button>
                            )
                        },
                        {flex:1},
                        {show:!!errorMessage,html:()=>errorMessage,align:'v',style:{color:'red',fontSize:10}}
                    ]
                }}
            />
        )
    }
    render(){
        return (
            <>
                <RVD
                    layout={{
                        row:[
                            this.form_layout(),
                            {
                                column:[
                                    this.remove_layout(),
                                    this.image_layout()
                                ]
                            }
                        ]
                    }}
                />
                <AIOPopup
                    getActions={({addPopup,removePopup})=>this.setState({popup:{addPopup,removePopup}})}
                />
            </>
        )
    }
}