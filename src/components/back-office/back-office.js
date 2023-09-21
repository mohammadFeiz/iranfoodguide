import React, { Component } from "react";
import AIOInput from './../../npm/aio-input/aio-input';
import RVD from './../../npm/react-virtual-dom/react-virtual-dom';
import Restorans from "./restorans";
import BOContext from "./back-office-context";
import { Icon } from "@mdi/react";
import { mdiChevronLeft, mdiChevronDown, mdiArrowUpBold, mdiArrowDownBold, mdiDelete, mdiDotsHorizontal, mdiPlusThick, mdiClose, mdiMap, mdiMapMarker, mdiMapMarkerAlert, mdiMapMarkerCheck, mdiMagnify, mdiFormatListBulletedSquare, mdiCheck } from '@mdi/js';
import './back-office.css';
import AppContext from "../../app-context";
export default class BackOffice extends Component {
    static contextType = AppContext;
    constructor(props) {
        super(props);
        this.state = {
            tabs: [
                { text: 'رستوران ها', value: 'restorans' },
                { text: 'تگ های رستوران ها', value: 'restoranTags' },
                { text: 'تگ های غذا ها', value: 'foodTags' },
                { text: 'صفحه سفارش غذا', value: 'order-page' },
                { text: 'اسلایدر ها', value: 'sliders' }
            ],
            activeTabId: 'restorans',
            orderPageItems: [],
            sliders: [],
            restorans: [],
            scores: []
        }
    }
    tabs_layout() {
        let { activeTabId, tabs } = this.state;
        return {
            html: (
                <AIOInput
                    type='tabs'
                    options={tabs}
                    value={activeTabId}
                    onChange={(activeTabId) => this.setState({ activeTabId })}
                />
            )
        }
    }
    getBody() {
        let { activeTabId, orderPageItems, sliders } = this.state;
        if (activeTabId === 'restorans') {return (<Restorans/>)}
        if (activeTabId === 'restoranTags') {return (<Tags key='restoran' type='restoran' trans='رستوران'/>)}
        if (activeTabId === 'foodTags') {return (<Tags key='food' type='food' trans='غذا'/>)}
        if (activeTabId === 'order-page') {
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
                        this.setState({ sliders })
                    }}
                />
            )
        }
        
    }
    body_layout() {
        return {
            flex: 1,
            html: this.getBody()
        }
    }
    getContext() {
        let {apis} = this.context;
        return {
            apis,
            ...this.state
        }
    }
    render() {
        return (
            <BOContext.Provider value={this.getContext()}>
                <RVD
                    layout={{
                        style:{},
                        column: [
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
class Sliders extends Component {
    add() {
        let { items, onChange } = this.props;
        items.push({ text: '', value: '', id: 'slider ' + Math.random() })
        onChange(items);
    }
    header_layout() {
        return {
            size: 36, className: 'p-h-12 bold fs-14',
            row: [
                { html: 'افزودن', align: 'v', onClick: () => this.add() }
            ]
        }
    }
    change(id, field, value) {
        let { items, onChange } = this.props;
        onChange(items.map((o) => {
            if (o.id === id) { o[field] = value; }
            return o
        }))
    }
    body_layout() {
        let { items, onChange } = this.props;
        return {
            className: 'fs-12',
            style: { border: '1px solid #aaa' },
            column: [
                { size: 12 },
                {
                    row: [
                        { html: '#', size: 30, align: 'vh' },
                        { html: 'نام', flex: 1, align: 'vh' },
                        { html: 'کلید', flex: 1, align: 'vh' }
                    ]
                },
                {
                    className: 'fs-10',
                    column: items.map(({ text, value, id }, i) => {
                        return {
                            row: [
                                { size: 36, html: i + 1, className: 'fs-14 bold', align: 'vh' },
                                {
                                    flex: 1,
                                    html: (
                                        <input
                                            style={{ width: '100%', fontSize: 'inherit' }}
                                            type='text' value={text}
                                            onChange={(e) => this.change(id, 'text', e.target.value)}
                                        />
                                    )
                                },
                                {
                                    flex: 1,
                                    html: (
                                        <input
                                            style={{ width: '100%', fontSize: 'inherit' }}
                                            type='text' value={value}
                                            onChange={(e) => this.change(id, 'value', e.target.value)}
                                        />
                                    )
                                },
                                {
                                    size: 36, html: <Icon path={mdiDelete} size={0.6} />, align: 'vh',
                                    style: { color: 'red' },
                                    onClick: () => onChange(items.filter((o) => o.id !== id))
                                }
                            ]
                        }
                    })
                },
                { size: 12 }
            ]
        }
    }
    render() {
        return (
            <RVD
                layout={{
                    column: [
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
                <AIOInput
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
                        onChange(items.concat({ id, type, items: [], name: '', typeName, open: true, mode: false }))
                    }}
                />
            )
        }
    }
    card_layout(o, i) {
        let { type, id } = o;
        let { items, onChange, sliders } = this.props;
        let COMPONENT = {
            'billboard': OrderPageCard,
            'categories': OrderPageCard,
            'slider': SliderCard
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
            column: items.map((o, i) => this.card_layout(o, i))
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
            this.change('items', items);
        };
        fr.readAsDataURL(obj.file);
    }
    change(field, value) {
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
        this.change('items', items)
    }
    addImage(item, file) {
        item.file = file;
        this.getUrl(item);
    }
    remove(id) {
        let { item } = this.props;
        let { items } = item;
        this.change('items', items.filter((o) => o.id !== id))
    }
    getIndexById(id) {
        let { item } = this.props;
        let { items } = item;
        for (let i = 0; i < items.length; i++) {
            if (items[i].id === id) { return i }
        }
    }
    move(id, type) {
        let { item } = this.props;
        let { items } = item;
        let index1 = this.getIndexById(id);
        if (type === 'up' && index1 === 0) { return }
        if (type === 'down' && index1 === items.length - 1) { return }
        let index2 = index1 + (type === 'up' ? -1 : 1);
        this.change('items', items.map((o, i) => {
            if (i === index1) { return items[index2] }
            if (i === index2) { return items[index1] }
            return o
        }))
    }
    header_layout() {
        let { item } = this.props;
        let { items, typeName, open } = item;
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
                        <AIOInput
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
        let { item } = this.props;
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
                                this.change('item', items)
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
                <AIOInput
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
        let { item } = this.props;
        let { items, open } = item;
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
class SliderCard extends Component {
    header_layout() {
        let { item } = this.props;
        let { typeName, open } = item;
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
                        <AIOInput
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
    change(field, value) {
        let { item, onChange } = this.props;
        item[field] = value;
        onChange(item);
    }
    body_layout() {
        let { item, sliders } = this.props;
        let { mode, endDate, maxDiscount, open } = item;
        if (!open) { return false }
        return {
            className: 'fs-10 bold',
            column: [
                {
                    row: [
                        { html: 'نوع', size: 80, align: 'v' },
                        {
                            flex: 1,
                            html: (
                                <AIOInput
                                    type='select'
                                    value={mode}
                                    style={{ width: '100%', background: 'none', border: '1px solid #ddd' }}
                                    options={[
                                        { text: 'انتخاب نشده', value: false },
                                    ].concat(sliders)}
                                    onChange={(value) => this.change('mode', value)}
                                />
                            )
                        }
                    ]
                },
                { size: 6 },
                {
                    row: [
                        { html: 'زمان پایان', size: 80, align: 'v' },
                        {
                            flex: 1,
                            html: (
                                <AIOInput
                                    type='date' unit='hour' value={endDate}
                                    style={{ height: 24, width: '100%' }}
                                    onChange={(dateString) => this.change('endDate', dateString)}
                                />
                            )
                        }
                    ]
                },
                { size: 6 },
                {
                    row: [
                        { html: 'سقف تخفیف %', size: 80, align: 'v' },
                        {
                            flex: 1,
                            html: (
                                <input
                                    style={{ border: '1px solid #ddd', width: '100%' }}
                                    type='number'
                                    value={maxDiscount}
                                    onChange={(e) => this.change('maxDiscount', e.target.value)}
                                />
                            )
                        }
                    ]
                }
            ]
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
                        this.body_layout()
                    ]
                }}
            />
        )
    }
}
class Tags extends Component{
    static contextType = BOContext;
    constructor(props){
        super(props);
        this.state = {tags:[]}
    }
    async componentDidMount(){
        let {apis} = this.context;
        let {type,trans} = this.props;
        apis({
            api:`get_tags`,
            name:`دریافت لیست تگ های ${trans} ها`,
            parameter:{type},
            callback:(tags)=>this.setState({tags,error:this.getError(tags)})
        })
    }
    add(){
        let {apis} = this.context;
        let {type,trans} = this.props;
        let {input} = this.state;
        apis({
            api:`add_tag`,
            name:`ثبت تگ ${trans}`,
            parameter:{type,tagName:input},
            callback:({id})=>{
                let {tags,input} = this.state;
                tags.push({name:input,id});
                this.setState({tags,input:''})
            }
        })
    }
    remove(obj){
        let {apis} = this.context;
        let {type,trans} = this.props;
        let {input} = this.state;
        apis({
            api:`remove_tag`,
            name:`حذف تگ ${trans}`,
            parameter:{type,tagId:obj.id},
            callback:()=>{
                let {tags} = this.state;
                this.setState({tags:tags.filter((o)=>o.id !== obj.id),input:''})
            }
        })
    }
    getError(){
        let {tags,input} = this.state;
        for(let i = 0; i < tags.length; i++){
            let {name} = tags[i];
            if(name === input){return 'نام تکراری'}            
        }
        return '';
    }
    header(){
        let {input} = this.state;
        let error = this.getError();
        return (
            <RVD
                layout={{
                    row:[
                        {
                            html:(
                                <input
                                    type='text'
                                    value={input}
                                    onChange={(e)=>this.setState({input:e.target.value})}
                                />
                            )
                        },
                        {size:6},
                        {html:<button disabled={!input || !!error} className='bo-submit-button' onClick={()=>this.add()}>ثبت</button>,align:'v'},
                        {size:6},
                        {html:error,align:'v',className:'fs-10',style:{color:'red'}}
                    ]
                }}
            />
        )
    }
    table_layout(){
        let {tags} = this.state;
        return {
            html:(
                <AIOInput
                    type='table'
                    header={this.header()}
                    rows={tags}
                    remove={this.remove.bind(this)}
                    columns={[
                        {title:'نام',value:'row.name',type:'text',disabled:true},
                        {title:'آی دی',value:'row.id',type:'text',disabled:true},  
                    ]}
                />
            )
        }
    }
    render(){
        return (
            <RVD
                layout={{
                    column:[
                        this.table_layout()
                    ]
                }}
            />
        )
    }
}





