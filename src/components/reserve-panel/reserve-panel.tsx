import React, { Component, useState,useContext,useEffect } from "react";
import RVD, { I_RVD_node } from '../../npm/react-virtual-dom/index.tsx';
import AIOInput from "../../npm/aio-input/aio-input.js";
import AppContext from "../../app-context.js";
import './reserve-panel.css';
import imgalt from './../../images/imgalt.png';
import { Icon } from '@mdi/react';
import { mdiAlert, mdiCheckCircle, mdiChevronDown, mdiChevronLeft, mdiDelete, mdiPlusThick } from "@mdi/js";
import { I_image, I_reserveItem, I_state } from "../../typs.tsx";

export default function ReservePanel() {
    let {APIS}:I_state = useContext(AppContext)
    let [openId,setOpenId] = useState<string>();
    let [restoranId,setRestoranId] = useState<string>('')
    let [reserveItems,setReserveItems] = useState<I_reserveItem[]>([])
    function getResrveItems(){
        APIS.getRestoranReserveItems({ restoranId },{
            onSuccess: (items:I_reserveItem[]) => {
                let reserveItems:I_reserveItem[] = items.map((o:I_reserveItem)=>{
                    let item:I_reserveItem = {...o,data:{...o.data,isSubmited:true,added:true}}
                    return item
                })
                setReserveItems(reserveItems)
            }
        })
    }
    useEffect(()=>{getResrveItems()},[])
    function addItem() {
        let addItem:I_reserveItem = {
            id: Math.round(Math.random() * 100000), images: [], name: '', description: '',
            data:{ type:'reserve',hasError: true,isSubmited: false,added: false,minCount: 0,maxCount: 1000,countType: false,countUnit: 'عدد',returnAmount: false,timeType: 'hour', price: 0,preOrderTime: 0,  }, 
        }
        setReserveItems(reserveItems.concat(addItem))
    }
    function removeItem(id) {
        APIS.removeRestoranReserveItem({ restoranId, itemId: id },{
            onSuccess: () => {
                let newItems:I_reserveItem[] = reserveItems.filter((o:I_reserveItem) => o.id !== id)
                setReserveItems(newItems)
            }
        })
    }
    //آیتمی که اد شده آی دی فیک داره که بعد از اعلام به سرور با آی دی واقعی ویرایشش می کنیم . پس در ادد برای پیدا کردنش آی دی فیک را ارسال می کنیم 
    function changeItem(newItem:I_reserveItem) {
        let id = newItem.id
        let newItems:I_reserveItem[] = reserveItems.map((o:I_reserveItem, i:number) => o.id === id ? { ...newItem } : o);
        setReserveItems(newItems);
    }
    function submit(item:I_reserveItem) {
        let type:'add'|'edit' = item.data.added === false ? 'add' : 'edit'
        let newItem:I_reserveItem = { ...item }
        APIS.addOrEditRestoranReserveItem({ restoranId, item: newItem, type },{
            onSuccess: async (p:{id:any}) => {
                newItem = { ...newItem, data:{...newItem.data,added: true, isSubmited: true} }
                changeItem({...newItem,id:p.id});
            }
        })
    }
    function header_layout():I_RVD_node {
        return {
            className: 'p-12 p-b-0',
            html: (
                <AIOInput
                    before={<Icon path={mdiPlusThick} size={1} />}
                    attrs={{ style: { background: 'orange', color: '#fff' }, className: 'fs-12 bold', onClick: () => addItem() }}
                    type='button' text='افزودن خدمت قابل رزرو'
                />
            )
        }
    }

    function items_layout():I_RVD_node {
        return { flex: 1, className: 'ofy-auto', column: reserveItems.map((o:I_reserveItem, i) => item_form_layout(o, i)) }
    }
    function item_form_layout(item:I_reserveItem, index):I_RVD_node {
        let open = openId === item.id;
        return {
            className: 'm-3',
            style: { border: '1px solid orange' },
            column: [
                form_header(item, open, index),
                {show: !!open,html: <ReserveForm item={item} onChange={changeItem} />}
            ]
        }
    }
    function form_header(item:I_reserveItem, open:boolean, index:number):I_RVD_node {
        let { id, name, data } = item;
        return {
            style: { background: 'orange', color: '#fff', height: 36 },
            row: [
                { html: index + 1, align: "vh", size: 30, style: { background: '#fff', color: 'orange', margin: 3 } },
                {
                    html: <Icon path={open ? mdiChevronDown : mdiChevronLeft} size={1} />, size: 36, align: 'vh',
                    onClick: () => setOpenId(open ? '' : id)
                },
                { html: name, flex: 1, align: 'v' },
                {
                    show: !data.hasError,
                    html: (
                        <AIOInput
                            type='button' text={data.isSubmited ? 'ثبت شده' : 'ثبت'}
                            before={<Icon path={mdiCheckCircle} size={1} />}
                            attrs={{
                                style: { color: data.isSubmited ? 'green' : 'red', fontWeight: 'bold' },
                                onClick: data.isSubmited ? undefined : () => submit(item)
                            }}
                        />
                    ),
                    align: 'v'
                },
                {
                    show: !!data.hasError, html: (
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
                    onClick: () => removeItem(item.id)
                }
            ]
        }
    }
    return (<RVD layout={{className: 'reserve-panel fs-12',column: [header_layout(),items_layout()]}}/>)
}
type I_ReserveForm = {item:I_reserveItem,onChange:(newItem:I_reserveItem)=>void}
function ReserveForm(props:I_ReserveForm) {
    let {APIS}:I_state = useContext(AppContext);
    let {item,onChange} = props;
    let [timeTypes] = useState<{text:string,value:string}[]>([
        { text: 'بدون در نظر گرفتن زمان', value: '' },
        { text: 'ساعتی', value: 'hour' },
        { text: 'روزانه', value: 'day' },
    ])
    function getAfter(text:React.ReactNode):React.ReactNode {return <div style={{ padding: '0 12px', background: 'orange', color: '#fff' }}>{text}</div>}
    function getPriceLabel(item:I_reserveItem):string {
        let { data } = item;
        let timeLabel = '';
        if (data.timeType === 'hour') { timeLabel = ' هر ساعت' }
        else if (data.timeType === 'day') { timeLabel = ' هر روز' }
        let countLabel = ''
        if (data.countType) { countLabel = ` هر ${data.countUnit}` }
        return timeLabel || countLabel ? `قیمت بر اساس${timeLabel}${countLabel}` : 'قیمت';
    }
    async function changeImage(imageFile:any,imageId?:string | number){
        let type = imageId === undefined?'add':'edit';
        APIS.addOrEditImage({imageFile,imageId},{
            onSuccess:(p:I_image)=>{
                let {url,id} = p;
                let newImages:I_image[];
                if(type === 'add'){newImages = item.images.concat({url,id});}
                else {newImages = item.images.map((o)=>o.id === id?{id,url}:o);}
                onChange({ ...item, images: newImages,data:{...item.data,isSubmited: false} })
            }
        })
    }
    async function removeImage(id:string | number){
        APIS.removeImage({imageId:id},{
            description:`حذف تصویر آیتم رزرو`,
            onSuccess:()=>{
                let newImages:I_image[] = item.images.filter((o)=>o.id !== id);
                let newItem:I_reserveItem = {...item,images:newImages,data:{...item.data,isSubmited:false}}
                onChange(newItem)
            }
        })
    }
    let images = [...item.images]
    while(images.length < 3){images.push({url:imgalt} as I_image)}
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
                                    let {id} = o;
                                    return {
                                        html: (
                                            <AIOInput
                                                type='image' attrs={{ className: 'reserve-panel-image' }} value={o} placeholder='انتخاب تصویر' width={96}
                                                onChange={(obj)=>{
                                                    if(!obj){removeImage(id)}
                                                    else {changeImage(obj.file,id)}
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
                        show: !!item.data.countType,
                        row: [
                            { input: { type: 'text' }, label: 'واحد تعداد', field: 'value.countUnit', validations: [['required']] },
                            { input: { type: 'number' }, label: 'حداقل تعداد', field: 'value.minCount', validations: [['required'], ['>', 0]] },
                            { input: { type: 'number' }, label: 'حداکثر تعداد', field: 'value.maxCount', validations: [['required'], ['>', 0]] }
                        ]
                    },
                    { input: { type: 'radio', options: timeTypes }, label: 'محاسبه بر اساس زمان', field: 'value.timeType' },
                    { input: { type: 'number', after: getAfter('تومان') }, field: 'value.price', label: getPriceLabel(item), validations: [['required']] },
                    { input: { type: 'checkbox', text: 'بازگشت مبلغ روی فاکتور' }, field: 'value.returnAmount' },
                    { size: 120, input: { type: 'number' }, field: 'value.preOrderTime', validations: [['required']], label: 'مدت زمان آماده سازی سفارش' },
                ]
            }}
        />
    )
}
