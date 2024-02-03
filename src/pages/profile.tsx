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
import { I_state } from "../typs";
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
                                apis.request({
                                    api:'profile.removeAccount',
                                    onSuccess:()=>{
                                        Login.removeToken();
                                        window.location.reload();
                                    }
                                })
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
            addModal({ position:'fullscreen',header: false, body: {render:() => <Ettelaate_shakhsi /> }})
        }
        else if (key === 'password') {
            addModal({ position:'fullscreen',header: false, body: {render:() => <Passwrod /> }})
        }
        else if (key === 'address_ha') {
            addModal({ position:'fullscreen',header: false, body: {render:() => <Address_ha /> }})
        }
        else if (key === 'takhfif_ha') {
            addModal({ position:'fullscreen',header: false, body: {render:() => <Takhfif_ha /> }})
        }
        else if (key === 'restoran_haye_mahboob') {
            addModal({ position:'fullscreen',header: false, body: {render:() => <Restoran_haye_mahboob /> }})
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

class Ettelaate_shakhsi extends Component {
    static contextType = AppContext;
    constructor(props) {
        super(props);
        this.state = { profile: {} }
    }
    componentDidMount() {
        let { profile } = this.context;
        debugger
        this.setState({ profile })
    }
    form_layout() {
        let { profile } = this.state;
        let { Login,apis,changeStore,rsa } = this.context;
        let mobile = Login.getUserId();
        let {isRegistered} = Login.getUserInfo();
        return {
            flex: 1, className: 'ofy-auto',
            column: [
                {
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
    render() {
        return (
            <RVD
                layout={{
                    className: 'app-popup',
                    column: [
                        { html: <PopupHeader title='اطلاعات شخصی' /> },
                        this.form_layout(),
                    ]
                }}
            />
        )
    }
}
class Passwrod extends Component {
    static contextType = AppContext;
    constructor(props) {
        super(props);
        this.state = { model:{password: ''} }
    }
    form_layout() {
        let { model } = this.state;
        let {Login} = this.context;
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
                            type='form' lang='fa' value={model} onChange={(model) => this.setState({ model })}
                            inputs={{props:{gap:12},column:inputs}}
                        />
                    )
                }
            ]
        }
    }
    footer_layout() {
        let {apis,rsa} = this.context;
        return {
            align: 'vh',
            className: 'p-24',
            html: (
                <button className= 'button-1 w-100 h-36' onClick={()=>{
                    let {model} = this.state;
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
    render() {
        return (
            <RVD
                layout={{
                    className: 'app-popup',
                    column: [
                        { html: <PopupHeader title='تغییر رمز عبور' /> },
                        this.form_layout(),
                        this.footer_layout()
                    ]
                }}
            />
        )
    }
}
class Address_ha extends Component {
    static contextType = AppContext;
    async onSubmit(address,type){
        let {changeStore,rsa,apis,addresses} = this.context;
        await apis.request({
            api:'profile.addressForm',
            parameter:{address,type},
            onSuccess:()=>{
                if(type === 'add'){addresses.push(address);}
                else{addresses = addresses.map((o)=>address.id === o.id?address:o)}
                changeStore({addresses},`<Address_ha/> => onSubmit`);
                rsa.removeModal()
            },
            description:()=>`${type === 'add'?'افزودن':'ویرایش'} آدرس `,
            message:{success:true}
        })
    }
    add_layout() {
        return {
            size: 48, className: 'p-h-12',
            onClick:()=>{
                let { rsa } = this.context;
                rsa.addModal({
                    header: false,
                    body: {render:() => <Address_form onSubmit={(address) => this.onSubmit(address,'add')} />}
                })
            },
            row: [
                { size: 36, html: <Icon path={mdiPlusThick} size={1} />, align: 'vh' },
                { flex: 1, html: 'افزودن آدرس جدید', align: 'v', className: 'fs-14 bold' }
            ]
        }
    }
    cards_layout() {
        let { addresses } = this.context;
        return {
            flex: 1, className: 'ofy-auto',
            column: addresses.map((o) => {
                let { title, address } = o;
                return {
                    size: 72, className: 'm-12 m-t-0 br-12',
                    style: { border: '1px solid #aaa' },
                    onClick: () => {
                        let { rsa } = this.context;
                        rsa.addModal({
                            position:'fullscreen',header: false,
                            body: {render:() => <Address_form model={o} onSubmit={(model) => this.onSubmit(model,'edit')} />}
                        })
                    },
                    row: [
                        { size: 72, align: 'vh', html: <Icon path={mdiMapMarker} size={1.6} /> },
                        {
                            flex: 1,
                            column: [
                                { flex: 1 },
                                { html: title, className: 'fs-14 bold' },
                                { html: address, className: 'fs-12' },
                                { flex: 1 }
                            ]
                        }
                    ]
                }
            })
        }
    }
    render() {
        return (
            <RVD
                layout={{
                    className: 'app-popup',
                    column: [
                        { html: <PopupHeader title='آدرس ها' /> },
                        this.add_layout(),
                        this.cards_layout(),

                    ]
                }}
            />
        )
    }
}
class Address_form extends Component {
    static contextType = AppContext;
    constructor(props) {
        super(props);
        let { model } = props;
        this.state = {
            error: true,
            model: model || {},
            type: !!model ? 'edit' : 'add'
        }
    }
    onSubmit(){
        let {onSubmit} = this.props;
        let {model} = this.state;
        onSubmit(model)
    }
    form_layout() {
        let {model,type} = this.state;
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
                                    let {model} = this.state;
                                    return (
                                        <AIOInput
                                            type='map' value={{lat:model.latitude,lng:model.longitude}}
                                            onChangeAddress={(address)=>this.setState({ model:{...this.state.model,address} })}
                                            mapConfig={{draggable:false}}
                                            popup={{mapConfig:{title:'انتخاب موقعیت',search:true}}}
                                            onChange={({lat,lng}) => this.setState({ model:{...this.state.model,latitude:lat,longitude:lng} })}
                                        />
                                    )
                                }
                            },
                            { input:{type: 'text'}, label: 'عنوان آدرس', field: 'value.title' },
                            { input:{type: 'text'}, label: 'آدرس دقیق', field: 'value.address' },
                            { input:{type: 'text'}, label: 'پلاک', field: 'value.number' },
                            { input:{type: 'text'}, label: 'واحد', field: 'value.unit' },
                            { input:{type: 'text'}, label: 'تلفن ثابت', field: 'value.phone' },
                        ]
                    }}
                    onChange={(model, error) => this.setState({ model, error })}
                    onSubmit={() => this.onSubmit()}
                    submitText={type === 'add' ? 'ثبت آدرس جدید' : 'ویرایش آدرس'}
                />
            )
        }
    }
    render() {
        let { type } = this.state;
        return (
            <RVD
                layout={{
                    className:'app-popup',
                    column: [
                        { html: <PopupHeader title={type === 'add' ? 'افزودن آدرس جدید' : 'ویرایش آدرس'} /> },
                        this.form_layout()
                    ]
                }}
            />
        )
    }
}
class Takhfif_ha extends Component{
    static contextType = AppContext;
    constructor(props) {
        super(props);
        this.state = { takhfif_ha: [] }
    }
    componentDidMount() {
        let { takhfif_ha } = this.context;
        this.setState({ takhfif_ha })
    }
    cards_layout() {
        let { takhfif_ha } = this.state;
        return {
            flex: 1, className: 'ofy-auto',
            column: takhfif_ha.map((o) => {
                let { amounts,description,code,expirationDate,order } = o;
                return {
                    className: 'm-12 m-t-0 br-12 p-h-12',
                    style: { border: '1px solid #aaa' },
                    column:[
                        {html:description,size:36,align:'v',className:'bold'},
                        {
                            column:amounts.map(({percent,amount},i)=>{
                                let row = [{html:'تخفیف'}];
                                if(percent){
                                    row.push({html:`${percent}%`,className:'bold'})
                                }
                                if(amount){
                                    if(percent){
                                        row.push({html:'تا سقف'});
                                        row.push({html:`${amount} تومان`,className:'bold'});
                                    }
                                    else{
                                        row.push({html:`${amount} تومان`,className:'bold'})
                                    }
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
                        {
                            size:36,align:'v',
                            row:[
                                {html:code,className:'bold'},
                                {flex:1},
                                {html:<Timer endDate={expirationDate}/>}
                            ]
                        }
                    ]
                }
            })
        }
    }
    render() {
        return (
            <RVD
                layout={{
                    className: 'app-popup fs-12',
                    column: [
                        { html: <PopupHeader title='تخفیف ها' /> },
                        this.cards_layout(),

                    ]
                }}
            />
        )
    }
}
class Restoran_haye_mahboob extends Component{
    static contextType = AppContext;
    state = {items:[]}
    async componentDidMount(){
        let {apis} = this.context;
        apis.request({
            api:'restoran_haye_mahboob',
            description:'دریافت لیست رستوران های محبوب',
            onSuccess:(items)=>this.setState({items})
        })
    }
    render(){
        let {items} = this.state;
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
}

