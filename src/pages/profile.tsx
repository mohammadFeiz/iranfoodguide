import React, { Component, useContext, useEffect, useState } from "react";
import RVD from '../npm/react-virtual-dom';
import SplitNumber from "../npm/aio-functions/split-number";
import { Icon } from '@mdi/react';
import { mdiAccount, mdiAccountCircleOutline, mdiChevronRight, mdiLock, mdiMapMarker, mdiPlusCircle, mdiPlusThick } from '@mdi/js';
import AIOInput from "../npm/aio-input/aio-input";
import Timer from "../components/timer";
import AppContext from "../app-context";
import Card from "../card/card";
import PopupHeader from "../components/popup-header";
import Wallet from "./../components/wallet/wallet.tsx";
import { I_address, I_profile, I_state, I_takhfif } from "../typs";
type I_Profile_item = { icon: React.ReactNode, text: string, id: string,show?:()=>boolean }

export default function Profile() {
    let {rsa,apis,Login,wallet,profile}:I_state = useContext(AppContext);
    let [items,setItems] = useState<I_Profile_item[]>([])
    function getItems(){
        let {isRegistered} = Login.getUserInfo();
        let items:I_Profile_item[] = [
            { icon: <Icon path={mdiAccount} size={1} />, text: isRegistered?'ویرایش اطلاعات کاربری':'ثبت نام در ایران فود', id: 'ettelaate_shakhsi' },
            { icon: <Icon path={mdiLock} size={1} />, text: 'تنظیم یا ویرایش رمز عبور', id: 'password',show:()=>isRegistered },
            { icon: <Icon path={mdiAccount} size={1} />, text: 'آدرس ها', id: 'address_ha' },
            { icon: <Icon path={mdiAccount} size={1} />, text: 'تخفیف ها',id:'takhfif_ha' },
            { icon: <Icon path={mdiAccount} size={1} />, text: 'رستوران های محبوب',id:'restoran_haye_mahboob' },
            { icon: <Icon path={mdiAccount} size={1} />, text: 'لغو حساب کاربری',id:'removeAccount' },
            { icon: <Icon path={mdiAccount} size={1} />, text: 'خروج',id:'exit' }
        ]
        setItems(items)
    }
    useEffect(()=>{getItems()},[])
    function wallet_layout(){
        return {
            onClick:()=>{
                rsa.addModal({ header: false, body: {render:() => <Wallet />} })
            },
            column: [
                { flex: 1 },
                {
                    align: 'v', gap: 3,
                    style: { border: '1px solid' },
                    className: 'h-24 br-12 p-h-6',
                    row: [
                        { html: 'کیف پول', className: 'fs-10' },
                        { html: SplitNumber(wallet), className: 'fs-12 bold' },
                        { html: 'تومان', className: 'fs-10' },
                        { html: <Icon path={mdiPlusCircle} size={0.7} /> }
                    ]
                },
                { flex: 1 }
            ]
        }
    }
    function openModal(key) {
        if(key === 'removeAccount'){
            rsa.addModal({ 
                position:'center',
                header: {title:'لغو حساب کاربری'}, 
                body: {attrs:{className:'p-12'},render:() => 'آیا از لغو حساب کاربری خود اطمینان دارید؟' },
                footer:{
                    buttons:[
                        ['بله',{
                            onClick:()=>{
                                apis.request({api:'profile.removeAccount',onSuccess:()=>{Login.removeToken(); window.location.reload();}})
                            },
                            className:'secondary-button'
                        }],
                        ['خیر',{onClick:()=>rsa.removeModal(),className:'primary-button'}]
                    ]
                }
            })
        }
        else if(key === 'exit'){
            Login.logout();
        }
        else if (key === 'ettelaate_shakhsi') {
            rsa.addModal({ position:'fullscreen',header: false, body: {render:() => <Ettelaate_shakhsi /> }})
        }
        else if (key === 'password') {
            rsa.addModal({ position:'fullscreen',header: false, body: {render:() => <Passwrod /> }})
        }
        else if (key === 'address_ha') {
            rsa.addModal({ position:'fullscreen',header: false, body: {render:() => <Address_ha /> }})
        }
        else if (key === 'takhfif_ha') {
            rsa.addModal({ position:'fullscreen',header: false, body: {render:() => <Takhfif_ha /> }})
        }
        else if (key === 'restoran_haye_mahboob') {
            rsa.addModal({ position:'fullscreen',header: false, body: {render:() => <Restoran_haye_mahboob /> }})
        }
    }
    function header_layout() {
        if(!profile){return false}
        let mobile = Login.getUserId();
        return {
            className: 'p-6',
            row: [
                {
                    size: 60, align: 'vh',
                    html: <Icon path={mdiAccount} size={1.4} style={{ border: '1px solid', padding: 6, width: 36, height: 36, borderRadius: '100%' }} />
                },
                {
                    flex: 1,
                    column: [
                        { flex: 1 },
                        { html: profile.firstName && profile.lastName?`${profile.firstName} ${profile.lastName}`:'شما ثبت نام نشده اید', className: 'fs-14 bold' },
                        { html: mobile, className: 'fs-12' },
                        { flex: 1 }
                    ]
                },
                wallet_layout()
            ]
        }
    }
    function body_layout() {
        return {
            flex: 1, className: 'ofy-auto',
            column: items.filter(({show = ()=>true})=>show()).map((item:I_Profile_item) => {
                let { icon, text, id } = item;
                return {
                    size: 48,
                    onClick: () => this.openModal(id),
                    row: [
                        { size: 48, html: icon, align: 'vh' },
                        { flex: 1, html: text, align: 'v' }
                    ]
                }
            })
        }
    }
    return (<RVD layout={{column: [header_layout(),body_layout()]}}/>)
}

function Ettelaate_shakhsi() {
    let { Login,apis,changeStore,rsa,profile }:I_state = useContext(AppContext);
    function form_layout() {
        let mobile = Login.getUserId();
        let {isRegistered} = Login.getUserInfo();
        return {
            flex: 1, className: 'ofy-auto',
            column: [
                !profile?false:{
                    column: [
                        { html: <Icon path={mdiAccountCircleOutline} size={2.8} />, style: { color: '#888' }, align: 'vh' },
                        { html: `${profile.firstName} ${profile.lastName}`, align: 'vh', className: 'fs-14 bold' },
                        { html: mobile, align: 'vh', className: 'fs-12' }
                    ]
                },
                {
                    html: Login.render({
                        profile:{
                            fields:[
                                '*firstName_text_نام',
                                '*lastName_text_نام خانوادگی',
                                '*email_text_ایمیل',
                                '*sheba_text_شماره شبا'],
                            model:profile,
                            submitText:isRegistered?'ویرایش اطلاعات کاربری':'ثبت نام در ایران فود',
                            onSubmit:({profile})=>{
                                apis.request({
                                    api:'profile.setProfile',parameter:profile,
                                    onSuccess:()=>{changeStore('profile',profile,'<Ettelaate_shakhsi/> => footer_layout'); rsa.removeModal()},
                                    description:'ثبت اطلاعات پروفایل',
                                    message:{success:true}
                                })
                            }
                        }
                    })
                }
            ]
        }
    }
    return (
        <RVD
            layout={{
                className: 'app-popup',
                column: [
                    { html: <PopupHeader title='اطلاعات شخصی' /> },
                    form_layout(),
                ]
            }}
        />
    )
}
function Passwrod() {
    let {Login,apis,rsa}:I_state = useContext(AppContext);
    let [model,setModel] = useState<{password:string}>({password:''})
    function header_layout(){return { html: <PopupHeader title='تغییر رمز عبور' /> }}
    function form_layout() {
        let mobile = Login.getUserId();
        let inputs = [
            { input:{type:'text',disabled:true}, label:'شماره همراه', field: mobile },
            { input:{type:'password'}, label:'رمز عبور', field: `value.password` }
        ]
        return {
            flex: 1, className: 'ofy-auto',
            column: [
                {
                    html: (
                        <AIOInput
                            inputStyle={{height:36}}
                            type='form' lang='fa' value={model} onChange={(model) => setModel(model)}
                            inputs={{props:{gap:12},column:inputs}}
                        />
                    )
                }
            ]
        }
    }
    function footer_layout() {
        return {
            align: 'vh',
            className: 'p-24',
            html: (
                <button className= 'button-1 w-100 h-36' onClick={()=>{
                    apis.request({
                        api:'profile.setPassword',
                        parameter:model.password,
                        onSuccess:()=>rsa.removeModal(),
                        description:'ثبت رمز عبور',
                        message:{success:true}
                    })
                }}>ثبت تغییرات</button>
            )
        }
    }
    return (<RVD layout={{className: 'app-popup',column: [header_layout(),form_layout(),footer_layout()]}}/>)
}
function Address_ha() {
    let {changeStore,rsa,apis,addresses}:I_state = useContext(AppContext);
    async function onSubmit(address:I_address,type:'add'|'edit'){
        await apis.request({
            api:'profile.addressForm',
            parameter:{address,type},
            onSuccess:()=>{
                if(type === 'add'){addresses.push(address);}
                else{addresses = addresses.map((o)=>address.id === o.id?address:o)}
                changeStore('addresses',addresses,`<Address_ha/> => onSubmit`);
                rsa.removeModal()
            },
            description:`${type === 'add'?'افزودن':'ویرایش'} آدرس `,
            message:{success:true}
        })
    }
    function header_layout(){return { html: <PopupHeader title='آدرس ها' /> }}
    function add_layout() {
        return {
            size: 48, className: 'p-h-12',
            onClick:()=>{
                rsa.addModal({header: false,body: {render:() => <AddressForm type='add' onSubmit={(address:I_address) => onSubmit(address,'add')} />}})
            },
            row: [
                { size: 36, html: <Icon path={mdiPlusThick} size={1} />, align: 'vh' },
                { flex: 1, html: 'افزودن آدرس جدید', align: 'v', className: 'fs-14 bold' }
            ]
        }
    }
    function cards_layout() {
        return {
            flex: 1, className: 'ofy-auto',
            column: addresses.map((o) => {
                let { title, address } = o;
                return {
                    size: 72, className: 'm-12 m-t-0 br-12',
                    style: { border: '1px solid #aaa' },
                    onClick: () => {
                        rsa.addModal({
                            position:'fullscreen',header: false,
                            body: {render:() => <AddressForm type='edit' model={o} onSubmit={(address:I_address) => onSubmit(address,'edit')} />}
                        })
                    },
                    row: [
                        { size: 72, align: 'vh', html: <Icon path={mdiMapMarker} size={1.6} /> },
                        {flex: 1,align:'v',column: [{ html: title, className: 'fs-14 bold' },{ html: address, className: 'fs-12' }]}
                    ]
                }
            })
        }
    }
    return (<RVD layout={{className: 'app-popup',column: [header_layout(),add_layout(),cards_layout()]}}/>)
}
type I_AddressForm = {type:'add' | 'edit',model?:I_address,onSubmit:(address:I_address)=>void}
function AddressForm(props:I_AddressForm) {
    let {}:I_state = useContext(AppContext);
    let {type,onSubmit} = props;
    let [model,setModel] = useState<I_address>(props.model || ({} as I_address))
    function submit(){onSubmit(model)}
    function header_layout(){
        return { html: <PopupHeader title={type === 'add' ? 'افزودن آدرس جدید' : 'ویرایش آدرس'} /> }
    }
    function form_layout() {
        return {
            flex: 1,
            html: (
                <AIOInput
                    type='form' lang='fa' value={model} attrs={{style:{ height: '100%' }}}
                    inputs={{
                        props:{gap:6},
                        column:[
                            {
                                html: () => {
                                    return (
                                        <AIOInput
                                            type='map' value={{lat:model.latitude,lng:model.longitude}}
                                            onChangeAddress={(address:string)=>setModel({...model,address})}
                                            mapConfig={{draggable:false}}
                                            popup={{mapConfig:{title:'انتخاب موقعیت',search:true}}}
                                            onChange={({lat,lng}) => this.setState({ model:{...model,latitude:lat,longitude:lng} })}
                                        />
                                    )
                                }
                            },
                            { input:{type: 'text'}, label: 'عنوان آدرس', field: 'value.title',validations:[['required']] },
                            { input:{type: 'text'}, label: 'آدرس دقیق', field: 'value.address',validations:[['required']] },
                            { input:{type: 'text'}, label: 'پلاک', field: 'value.number',validations:[['required']] },
                            { input:{type: 'text'}, label: 'واحد', field: 'value.unit',validations:[['required']] },
                            { input:{type: 'text'}, label: 'تلفن ثابت', field: 'value.phone',validations:[['required']] },
                        ]
                    }}
                    onChange={(model) => setModel(model)}
                    onSubmit={() => submit()}
                    submitText={type === 'add' ? 'ثبت آدرس جدید' : 'ویرایش آدرس'}
                />
            )
        }
    }
    return (<RVD layout={{className:'app-popup',column: [header_layout(),form_layout()]}}/>)
}
function Takhfif_ha(){
    let {takhfif_ha}:I_state = useContext(AppContext);
    function header_layout(){return { html: <PopupHeader title='تخفیف ها' /> }}
    function cards_layout() {
        return {
            flex: 1, className: 'ofy-auto',
            column: takhfif_ha.map((o:I_takhfif) => {
                let { amounts,description,code,expirationDate,order } = o;
                return {
                    className: 'm-12 m-t-0 br-12 p-h-12',style: { border: '1px solid #aaa' },
                    column:[
                        {html:description,size:36,align:'v',className:'bold'},
                        {
                            column:amounts.map(({percent,amount},i)=>{
                                let row:{html:string,className?:string}[] = [{html:'تخفیف'}];
                                if(percent){
                                    row.push({html:`${percent}%`,className:'bold'})
                                }
                                if(amount){
                                    if(percent){
                                        row.push({html:'تا سقف'});
                                        row.push({html:`${amount} تومان`,className:'bold'});
                                    }
                                    else{row.push({html:`${amount} تومان`,className:'bold'})}
                                }
                                return {
                                    size:36,
                                    style:{opacity:i < order?0.3:1},
                                    row:[
                                        {flex:1,align:'v',gap:3,row,style:{borderBottom:'1px dotted #888'}},
                                        {html:`بار ${['اول','دوم','سوم','چهارم','پنجم'][i]}`,align:'v',className:'fs-10 bold'}
                                    ]
                                }
                            }) 
                        },
                        {size:36,align:'v',row:[{html:code,className:'bold'},{flex:1},{html:<Timer endDate={expirationDate}/>}]}
                    ]
                }
            })
        }
    }
    return (<RVD layout={{className: 'app-popup fs-12',column: [header_layout(),cards_layout()]}}/>)
}
function Restoran_haye_mahboob(){
    let {apis}:I_state = useContext(AppContext);
    let [items,setItems] = useState([])
    function getItems(){
        apis.request({
            api:'restoran_haye_mahboob',description:'دریافت لیست رستوران های محبوب',
            onSuccess:(items)=>setItems(items)
        })
    }
    return (
        <RVD
            layout={{
                style:{background:'#fff',height:'100%'},
                column:[
                    {html:<PopupHeader title='رستوران های محبوب'/>},
                    {
                        flex:1,gap:24,className:'ofy-auto',
                        column:items.map((o)=>{
                            return {className:'p-h-24',html:<Card type='restoran_card' {...o}/>}
                        })
                    }
                ]
            }}
        />          
    )
}

