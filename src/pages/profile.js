import React, { Component } from "react";
import RVD from './../npm/react-virtual-dom/react-virtual-dom';
import SplitNumber from "../npm/aio-functions/split-number";
import { Icon } from '@mdi/react';
import { mdiAccount, mdiAccountCircleOutline, mdiChevronRight, mdiLock, mdiMapMarker, mdiPlusCircle, mdiPlusThick } from '@mdi/js';
import AIOInput from "../npm/aio-input/aio-input";
import Map from './../npm/map/map';
import Timer from "../components/timer";
import AppContext from "../app-context";
import Card from "../card/card";
import PopupHeader from "../components/popup-header";
import Kife_pool from "../components/kife-pool/kife-pool";
export default class Profile extends Component {
    static contextType = AppContext;
    constructor(props) {
        super(props);
        this.state = {
            items: [
                { icon: <Icon path={mdiAccount} size={1} />, text: 'اطلاعات شخصی', id: 'ettelaate_shakhsi' },
                { icon: <Icon path={mdiLock} size={1} />, text: 'تنظیم یا ویرایش رمز عبور', id: 'password' },
                { icon: <Icon path={mdiAccount} size={1} />, text: 'آدرس ها', id: 'address_ha' },
                { icon: <Icon path={mdiAccount} size={1} />, text: 'تخفیف ها',id:'takhfif_ha' },
                { icon: <Icon path={mdiAccount} size={1} />, text: 'رستوران های محبوب',id:'restoran_haye_mahboob' },
                //{ icon: <Icon path={mdiAccount} size={1} />, text: 'نظرات من' },
                //{ icon: <Icon path={mdiAccount} size={1} />, text: 'شبکه اجتماعی غذا' },
                //{ icon: <Icon path={mdiAccount} size={1} />, text: 'دعوت از دوستان' },
                //{ icon: <Icon path={mdiAccount} size={1} />, text: 'تنظیمات' },
                //{ icon: <Icon path={mdiAccount} size={1} />, text: 'قوانین' },
                { icon: <Icon path={mdiAccount} size={1} />, text: 'خروج',id:'exit' }
            ]
        }
    }
    kife_pool_layout(){
        let { mojoodiye_kife_pool,rsa_actions } = this.context;
        return {
            onClick:()=>{
                rsa_actions.addPopup({ header: false, body: () => <Kife_pool /> })
            },
            column: [
                { flex: 1 },
                {
                    align: 'v', gap: 3,
                    style: { border: '1px solid' },
                    className: 'h-24 br-12 p-h-6',
                    row: [
                        { html: 'کیف پول', className: 'fs-10' },
                        { html: SplitNumber(mojoodiye_kife_pool), className: 'fs-12 bold' },
                        { html: 'تومان', className: 'fs-10' },
                        { html: <Icon path={mdiPlusCircle} size={0.7} /> }
                    ]
                },
                { flex: 1 }
            ]
        }
    }
    openPopup(key) {
        let { rsa_actions,logout } = this.context;
        let { addPopup } = rsa_actions;
        if(key === 'exit'){
            logout();
        }
        if (key === 'ettelaate_shakhsi') {
            addPopup({ type:'fullscreen',header: false, body: () => <Ettelaate_shakhsi /> })
        }
        if (key === 'password') {
            addPopup({ type:'fullscreen',header: false, body: () => <Passwrod /> })
        }
        if (key === 'address_ha') {
            addPopup({ type:'fullscreen',header: false, body: () => <Address_ha /> })
        }
        if (key === 'takhfif_ha') {
            addPopup({ type:'fullscreen',header: false, body: () => <Takhfif_ha /> })
        }
        if (key === 'restoran_haye_mahboob') {
            addPopup({ type:'fullscreen',header: false, body: () => <Restoran_haye_mahboob /> })
        }
    }
    header_layout() {
        let { profile,mobile } = this.context;
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
                        { html: `${profile.firstName} ${profile.lastName}`, className: 'fs-14 bold' },
                        { html: mobile, className: 'fs-12' },
                        { flex: 1 }
                    ]
                },
                this.kife_pool_layout()
            ]
        }
    }
    body_layout() {
        let { items } = this.state;
        return {
            flex: 1, className: 'ofy-auto',
            column: items.map(({ icon, text, id }) => {
                return {
                    size: 48,
                    onClick: () => this.openPopup(id),
                    row: [
                        { size: 48, html: icon, align: 'vh' },
                        { flex: 1, html: text, align: 'v' }
                    ]
                }
            })
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

class Ettelaate_shakhsi extends Component {
    static contextType = AppContext;
    constructor(props) {
        super(props);
        this.state = { profile: {} }
    }
    componentDidMount() {
        let { profile } = this.context;
        this.setState({ profile })
    }
    form_layout() {
        let { profile,mobile } = this.state;
        let { appSetting } = this.context;
        let inputs = appSetting.profileFields.filter(({editable})=>editable).map(({type,label,clientField})=>{
            return { input:{type}, label, field: `value.${clientField}` }
        })
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
                    html: (
                        <AIOInput
                            type='form' value={profile} onChange={(profile) => this.setState({ profile })}
                            inputs={{props:{gap:12},column:inputs}}
                        />
                    )
                }
            ]
        }
    }
    footer_layout() {
        let {apis,rsa_actions,changeStore,isRegistered} = this.context;
        return {
            align: 'vh',
            className: 'p-24',
            html: (
                <button className= 'button-1 w-100 h-36' onClick={()=>{
                    let {profile} = this.state;
                    apis({
                        api:'setProfile',
                        parameter:{profile,isRegistered},
                        callback:()=>{
                            changeStore({profile},'<Ettelaate_shakhsi/> => footer_layout')
                            rsa_actions.removePopup()
                        },
                        name:'ثبت اطلاعات پروفایل',
                        successMessage:true
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
                        { html: <PopupHeader title='اطلاعات شخصی' /> },
                        this.form_layout(),
                        this.footer_layout()
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
        let inputs = [
            { input:{type:'password'}, label:'رمز عبور', field: `value.password` }
        ]
        return {
            flex: 1, className: 'ofy-auto',
            column: [
                {
                    html: (
                        <AIOInput
                            type='form' value={model} onChange={(model) => this.setState({ model })}
                            inputs={{props:{gap:12},column:inputs}}
                        />
                    )
                }
            ]
        }
    }
    footer_layout() {
        let {apis,rsa_actions,changeStore,isRegistered,profile,mobile} = this.context;
        return {
            align: 'vh',
            className: 'p-24',
            html: (
                <button className= 'button-1 w-100 h-36' onClick={()=>{
                    let {model} = this.state;
                    apis({
                        api:'setPassword',
                        parameter:{mobile,password:model.password},
                        callback:()=>{
                            rsa_actions.removePopup()
                        },
                        name:'ثبت رمز عبور',
                        successMessage:true
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
        let {changeStore,rsa_actions,apis,addresses} = this.context;
        await apis({
            api:'addressForm',
            parameter:{address,type},
            callback:()=>{
                if(type === 'add'){addresses.push(address);}
                else{addresses = addresses.map((o)=>address.id === o.id?address:o)}
                changeStore({addresses},`<Address_ha/> => onSubmit`);
                rsa_actions.removePopup()
            },
            name:()=>`${type === 'add'?'افزودن':'ویرایش'} آدرس `,
            successMessage:true
        })
    }
    add_layout() {
        return {
            size: 48, className: 'p-h-12',
            onClick:()=>{
                let { rsa_actions } = this.context;
                rsa_actions.addPopup({
                    header: false,
                    body: () => <Address_form onSubmit={(address) => this.onSubmit(address,'add')} />
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
                        let { rsa_actions } = this.context;
                        rsa_actions.addPopup({
                            type:'fullscreen',header: false,
                            body: () => <Address_form model={o} onSubmit={(model) => this.onSubmit(model,'edit')} />
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
    onMapClick() {
        let {model} = this.state;
        let { rsa_actions } = this.context;
        let { addPopup } = rsa_actions;
        addPopup({
            header: false,
            type: 'fullscreen',
            body: () => (
                <Add_address_map 
                    onSubmit={(latitude, longitude, address) => {
                        let { model } = this.state;
                        model.latitude = latitude;
                        model.longitude = longitude;
                        model.address = address;
                        this.setState({ model })
                    }}
                    latitude={model.latitude}
                    longitude={model.longitude} 
                />
            )
        })
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
                    type='form' value={model} style={{ height: '100%' }}
                    inputs={{
                        props:{gap:6},
                        column:[
                            {
                                html: () => {
                                    let {model} = this.state;
                                    return (
                                        <Map
                                            msf={true}
                                            delay={320}
                                            latitude={model.latitude}
                                            longitude={model.longitude}
                                            style={{ height: 120, width: '100%' }}
                                            onClick={() => this.onMapClick()}
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
class Add_address_map extends Component {
    static contextType = AppContext;
    body_layout() {
        let { latitude, longitude } = this.props;
        let { onSubmit } = this.props;
        let { rsa_actions } = this.context;
        return {
            flex: 1,
            html: (
                <Map
                    delay={320}
                    latitude={latitude} longitude={longitude}
                    style={{ width: '100%', height: '100%', position: 'absolute' }}
                    onChange={(latitude, longitude, address) => {
                        onSubmit(latitude, longitude, address);
                        rsa_actions.removePopup()
                    }}
                    search={true}
                />
            )
        }
    }
    render() {
        return (
            <RVD
                layout={{
                    className:'app-popup',
                    column: [
                        { html: <PopupHeader title='افزودن آدرس از روی نقشه' /> },
                        this.body_layout(),

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
        apis({
            api:'restoran_haye_mahboob',
            name:'دریافت لیست رستوران های محبوب',
            callback:(items)=>this.setState({items})
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

