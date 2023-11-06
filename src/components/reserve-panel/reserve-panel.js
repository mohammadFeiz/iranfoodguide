import React, { Component, useState } from "react";
import RVD from './../../npm/react-virtual-dom';
import AIOInput from "../../npm/aio-input/aio-input";
import AppContext from "../../app-context";
import './reserve-panel.css';
import { Icon } from '@mdi/react';
import { mdiAlert, mdiCheck, mdiCheckCircle, mdiCheckCircleOutline, mdiChevronDown, mdiChevronLeft, mdiClose, mdiCloseCircle, mdiDelete, mdiPlusThick } from "@mdi/js";
export default class ReservePanel extends Component {
    static contextType = AppContext;
    constructor(props) {
        super(props);
        this.state = {
            openId: false,
            restoranId: '',
            reserveItems: []
        }
    }
    componentDidMount() {
        let { apis } = this.context;
        let { restoranId } = this.state;
        apis.request({
            api: 'reserve.get_restoran_reserve_items', parameter: { restoranId },
            description: 'دریافت خدمات رزرو رستوران در پنل ادمین', def: [],
            onSuccess: (reserveItems) => this.setState({ reserveItems:reserveItems.map((o)=>{return {...o,isSubmited:true,added:true}}) })
        })
    }
    addItem() {
        let addItem = {
            id: Math.round(Math.random() * 100000), images: [], isSubmited: false, added: false, name: '', description: '',
            countType: false, minCount: false, maxCount: false, countUnit: 'عدد', returnAmount: false, timeType: '', price: '', preOrderTime: 0, timeLimits: [[], [], [], [], [], [], []], hasError: true
        }
        let { reserveItems } = this.state;
        this.setState({ reserveItems: reserveItems.concat(addItem) })
    }
    removeItem(id) {
        let { apis } = this.context;
        let { restoranId } = this.state;
        apis.request({
            api: 'reserve.remove_restoran_reserve_item', parameter: { restoranId, itemId: id },
            description: 'حذف خدمت رزرو رستوران در پنل ادمین',
            onSuccess: () => {
                let { reserveItems } = this.state;
                let newItems = reserveItems.filter((o) => o.id !== id)
                this.setState({ reserveItems: newItems })
            }
        })
    }
    //آیتمی که اد شده آی دی فیک داره که بعد از اعلام به سرور با آی دی واقعی ویرایشش می کنیم . پس در ادد برای پیدا کردنش آی دی فیک را ارسال می کنیم 
    changeItem(newItem,fakeId) {
        let id = fakeId === undefined?newItem.id:fakeId
        let { reserveItems } = this.state;
        let newItems = reserveItems.map((o, i) => o.id === id ? { ...newItem } : o);
        this.setState({ reserveItems: newItems });
    }
    submit(item) {
        let { apis } = this.context;
        let { restoranId } = this.state;
        let type = item.added === false ? 'add' : 'edit'
        let fakeId = type === 'add'?item.id:undefined;
        let newItem = { ...item }
        apis.request({
            api: 'reserve.add_or_edit_restoran_reserve_item', parameter: { restoranId, item: newItem, type },
            description: `${type === 'add' ? 'ذخیره' : 'ویرایش'} خدمت رزرو رستوران در پنل ادمین`,
            onSuccess: async (p) => {
                newItem = { ...newItem, added: true, isSubmited: true }
                if (type === 'add') { 
                    this.changeItem({...newItem,id:p.id},fakeId);
                }
                else {
                    this.changeItem(newItem);
                }
            }
        })

    }
    header_layout() {
        return {
            className: 'p-12 p-b-0',
            html: (
                <AIOInput
                    before={<Icon path={mdiPlusThick} size={1} />}
                    attrs={{ style: { background: 'orange', color: '#fff' }, className: 'fs-12 bold', onClick: () => this.addItem() }}
                    type='button' text='افزودن خدمت قابل رزرو'
                />
            )
        }
    }

    items_layout() {
        let { reserveItems } = this.state;
        return { flex: 1, className: 'ofy-auto', column: reserveItems.map((o, i) => this.item_form_layout(o, i)) }
    }
    item_form_layout(item, index) {
        let { openId } = this.state;
        let open = openId === item.id;
        return {
            className: 'm-3',
            style: { border: '1px solid orange' },
            column: [
                this.form_header(item, open, index),
                {
                    show: !!open,
                    html: <ReserveForm item={item} onChange={this.changeItem.bind(this)} />
                }
            ]
        }
    }
    form_header(item, open, index) {
        let { id, name, hasError } = item;
        console.log(item)
        return {
            style: { background: 'orange', color: '#fff', height: 36 },
            row: [
                { html: index + 1, align: "vh", size: 30, style: { background: '#fff', color: 'orange', margin: 3 } },
                {
                    html: <Icon path={open ? mdiChevronDown : mdiChevronLeft} size={1} />, size: 36, align: 'vh',
                    onClick: () => this.setState({ openId: open ? false : id })
                },
                { html: name, flex: 1, align: 'v' },
                {
                    show: !hasError,
                    html: (
                        <AIOInput
                            type='button' text={item.isSubmited ? 'ثبت شده' : 'ثبت'}
                            before={<Icon path={mdiCheckCircle} size={1} />}
                            attrs={{
                                style: { color: item.isSubmited ? 'green' : 'red', fontWeight: 'bold' },
                                onClick: item.isSubmited ? undefined : () => this.submit(item)
                            }}
                        />
                    ),
                    align: 'v'
                },
                {
                    show: !!hasError, html: (
                        <AIOInput
                            type='button' text={'دارای خطا'}
                            before={<Icon path={mdiAlert} size={1} />}
                            attrs={{ style: { color: 'red', fontWeight: 'bold' } }}
                        />
                    ), align: 'v'
                },
                { size: 6 },
                {
                    size: 36, style: { color: '#fff' }, align: 'vh',
                    html: <Icon path={mdiDelete} size={1} />,
                    onClick: () => this.removeItem(item.id)
                }
            ]
        }
    }
    render() {
        return (
            <RVD
                layout={{
                    className: 'reserve-panel',
                    style: { fontSize: 12 },
                    column: [
                        this.header_layout(),
                        this.items_layout(),
                    ]
                }}
            />
        )
    }
}
class ReserveForm extends Component {
    static contextType = AppContext;
    constructor(props) {
        super(props);
        this.state = {
            timeTypes: [
                { text: 'بدون در نظر گرفتن زمان', value: '' },
                { text: 'ساعتی', value: 'hour' },
                { text: 'روزانه', value: 'day' },
            ]
        }
    }
    getAfter(text) {
        return <div style={{ padding: '0 12px', background: 'orange', color: '#fff' }}>{text}</div>
    }
    changeTimeLimitByHour(dayIndex, timeIndex, state) {
        let { item, onChange } = this.props;
        let {timeLimits = [[],[],[],[],[],[],[]]} = item;
        let newTimes;
        if (state) { newTimes = [...timeLimits[dayIndex], timeIndex] }
        else { newTimes = timeLimits[dayIndex].filter((o) => o !== timeIndex) }
        let newDay = timeLimits.map((o, i) => i === dayIndex ? newTimes : o)
        let newItem = { ...item, timeLimits: newDay, isSubmited: false };
        onChange(newItem)
    }
    changeTimeLimitByDay(dayIndex) {
        let { item, onChange } = this.props;
        let {timeLimits = [[],[],[],[],[],[],[]]} = item;
        let newTimes;
        if (timeLimits[dayIndex].length === 0) { newTimes = new Array(24).fill(0).map((o, i) => i); }
        else { newTimes = []; }
        let newDay = timeLimits.map((o, i) => i === dayIndex ? newTimes : o);
        let newItem = { ...item, timeLimits: newDay, isSubmited: false };
        onChange(newItem)
    }
    getPriceLabel(item) {
        let { countUnit } = item;
        let timeLabel = '';
        if (item.timeType === 'hour') { timeLabel = ' هر ساعت' }
        else if (item.timeType === 'day') { timeLabel = ' هر روز' }
        let countLabel = ''
        if (item.countType) { countLabel = ` هر ${countUnit}` }
        return timeLabel || countLabel ? `قیمت بر اساس${timeLabel}${countLabel}` : 'قیمت';
    }
    form_timeLimits(item) {
        if (!item.timeType) { return false }
        let {timeLimits = [[],[],[],[],[],[],[]]} = item;
        return {
            props: { gap: 1 },
            column: [
                { size: 12 },
                {
                    row: [
                        { html: 'محدودیت ساعات هفته' },
                        { size: 6 }, { size: 24, style: { background: 'red' } }, { size: 6 }, { html: 'غیر قابل رزرو' }, { size: 12 },
                        { size: 24, style: { background: 'green' } }, { size: 6 }, { html: 'قابل رزرو' },
                    ]
                },
                { size: 6 },
                {
                    row: [
                        { size: 40 },
                        { flex: 1, row: new Array(24).fill(0).map((o, i) => { return { html: i, flex: 1, align: 'vh', className: 'fs-10' } }) }
                    ]
                },
                { column: new Array(7).fill(0).map((o, i) => this.form_dayLimit(i, timeLimits[i])) }
            ]
        }
    }
    form_dayLimit(dayIndex, times) {
        let days = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه']
        return {
            size: 24, props: { gap: 1 },
            row: [
                { size: 40, html: days[dayIndex], onClick: () => this.changeTimeLimitByDay(dayIndex), className: 'fs-10' },
                {
                    flex: 1,
                    row: new Array(24).fill(0).map((o, i) => {
                        let active = times.indexOf(i) !== -1;
                        return {
                            flex: 1,
                            style: { background: !active ? 'green' : 'red' },
                            onClick: () => this.changeTimeLimitByHour(dayIndex, i, !active)
                        }
                    })
                }
            ]
        }
    }
    async changeImages(changedImageObject,id){
        let {apis} = this.context;
        let {item,onChange} = this.props;
        let type = id === false?'add':'edit';
        apis.request({
            api:'add_or_edit_image',
            parameter:{imageObject:changedImageObject,type},
            description:`${type === 'add'?'افزودن':'ویرایش'} تصویر آیتم رزرو`,
            onSuccess:({url,id})=>{
                let newImages;
                if(type === 'add'){newImages = item.images.concat({url,id});}
                else {newImages = item.images.map((o)=>o.id === id?{id,url}:o);}
                onChange({ ...item, images: newImages, isSubmited: false })
            }
        })
    }
    async removeImage(id){
        let {apis} = this.context;
        let {item,onChange} = this.props;
        apis.request({
            api:'remove_image',
            parameter:id,
            description:`حذف تصویر آیتم رزرو`,
            onSuccess:()=>{
                let newImages = item.images.filter((o)=>o.id !== id);
                let newItem = {...item,images:newImages,isSubmited:false}
                onChange(newItem)
            }
        })
    }
    render() {
        let { item, onChange } = this.props;
        let { timeTypes } = this.state;
        let images = [...item.images]
        while(images.length < 3){
            images.push(false)
        }
        return (
            <AIOInput
                type='form' lang='fa'
                value={item}
                onChange={(newItem, errors, isFirstChange) => {
                    //فرم پس از رندر یکبار چنج را صدا می زند برای اعلام خطا های اولیه
                    //پس استتوس تغییر این آیتم در اولین فراخوانی نباید تغییر کند
                    onChange({ ...newItem, isSubmited: isFirstChange ? newItem.isSubmited : false, hasError: !!errors.length })
                }}
                inputClassName='reserve-form-input'
                inputs={{
                    props: { gap: 12 },
                    column: [
                        {
                            column: [
                                { html: 'تصاویر' },
                                {
                                    row: images.map((o,i) => {
                                        let id = typeof o === false?false:o.id;
                                        return {
                                            html: (
                                                <AIOInput
                                                    type='image' attrs={{ className: 'reserve-panel-image' }} value={o} placeholder='انتخاب تصویر' width={96}
                                                    onChange={(changedImageObject)=>{

                                                        if(!changedImageObject){this.removeImage(id)}
                                                        else {this.changeImages(changedImageObject,id)}
                                                    }}
                                                />
                                            )
                                        }
                                    })
                                }
                            ]
                        },
                        { input: { type: 'text' }, label: 'عنوان', field: 'value.name', validations: [['required']] },
                        { input: { type: 'textarea' }, label: 'توضیحات', field: 'value.description', validations: [['required']] },
                        { input: { type: 'checkbox', text: 'محاسبه بر اساس تعداد' }, field: 'value.countType' },
                        {
                            show: !!item.countType,
                            row: [
                                { input: { type: 'text' }, label: 'واحد تعداد', field: 'value.countUnit', validations: [['required']] },
                                { input: { type: 'number' }, label: 'حداقل تعداد', field: 'value.minCount', validations: [['required'], ['>', 0]] },
                                { input: { type: 'number' }, label: 'حداکثر تعداد', field: 'value.maxCount', validations: [['required'], ['>', 0]] }
                            ]
                        },
                        { input: { type: 'radio', options: timeTypes }, label: 'محاسبه بر اساس زمان', field: 'value.timeType' },
                        { input: { type: 'number', after: this.getAfter('تومان') }, field: 'value.price', label: this.getPriceLabel(item), validations: [['required']] },
                        { input: { type: 'checkbox', text: 'بازگشت مبلغ روی فاکتور' }, field: 'value.returnAmount' },
                        { size: 120, input: { type: 'number' }, field: 'value.preOrderTime', validations: [['required']], label: 'مدت زمان آماده سازی سفارش' },
                        this.form_timeLimits(item)
                    ]
                }}
            />
        )
    }
}
