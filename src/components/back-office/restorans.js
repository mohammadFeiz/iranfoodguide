import React, { Component, createContext } from "react";
import AIOPopup from "../../npm/aio-popup/aio-popup";
import AIOInput from './../../npm/aio-input/aio-input';
import AIOSHOP from './../../npm/aio-shop/aio-shop';
import RVD from './../../npm/react-virtual-dom/react-virtual-dom';
import Map from './../../npm/map/map';
import BOContext from "./back-office-context";
import { Icon } from "@mdi/react";
import Search from './../../npm/aio-functions/search';
import { mdiMagnify, mdiFormatListBulletedSquare, mdiMapMarkerAlert, mdiMapMarkerCheck, mdiClose } from '@mdi/js';
import './back-office.css';
let RestoranContext = createContext()
export default class Restorans extends Component {
    static contextType = BOContext;
    constructor(props) {
        super(props);
        this.state = { restorans: [], popup: new AIOPopup(), searchValue: '',restoran_tags:[], restoran_tags_dic: {}, food_tags: [] }
    }
    async get_restorans() {
        let {apis} = this.context;
        apis({ 
            api: 'get_restorans', name: 'دریافت لیست رستوزان ها', def: [] ,
            callback:(restorans)=>this.setState({restorans})
        }); 
    }
    async add_or_edit_restoran(newRestoran,type) {
        let { apis } = this.context;
        apis({
            api: 'add_or_edit_restoran', parameter: {restoran:newRestoran,type},
            name: `${type === 'add'?'افزودن':'ویرایش'} رستوران`,
            callback: async (result) => {
                let id = type === 'add'?result.id:newRestoran.id;
                if(newRestoran.image_file){
                    await apis({
                        api: 'edit_restoran_image', name: 'ثبت تصویر رستوران',
                        parameter: { restoranId: id, imageFile: newRestoran.image_file }
                    })
                }
                if(newRestoran.logo_file){
                    await apis({
                        api: 'edit_restoran_logo', name: 'ثبت لوگوی رستوران',
                        parameter: { restoranId: id, imageFile: newRestoran.logo_file }
                    })
                }
                let { restorans, popup } = this.state;
                let newRestorans;
                if(type === 'add'){
                   newRestorans = [{ ...newRestoran, id }, ...restorans];
                }
                else {
                   newRestorans = restorans.map((o) => o.id === id ? newRestoran : o);
                }
                this.setState({ restorans: newRestorans });
                popup.removeModal();
            }
        })
    }
    async remove_restoran(id) {
        let { apis } = this.context;
        apis({
            api: 'remove_restoran', name: 'حذف رستوران', parameter: id,
            callback: () => {
                let { restorans, popup } = this.state;
                let newRestorans = restorans.filter((o) => o.id !== id)
                this.setState({ restorans: newRestorans });
                popup.removeModal();
            }
        })
    }
    async get_restoran_tags() {
        let { apis } = this.context;
        apis({ 
            api: 'get_tags', parameter: { type: 'restoran' }, 
            name: 'دریافت لیست تگ های رستوران ها', def: [],
            callback:(restoran_tags)=>{
                let restoran_tags_dic = {}
                for (let i = 0; i < restoran_tags.length; i++) { let { id, name } = restoran_tags[i]; restoran_tags_dic[id] = name; }
                this.setState({restoran_tags,restoran_tags_dic})
            }
        });
        
    }
    async get_food_tags() {
        let { apis } = this.context;
        apis({
            api: 'get_tags',def:[],
            name: 'دریافت لیست تگ های غذا ها',
            parameter: { type: 'food' },
            callback: (food_tags) => this.setState({ food_tags })
        })
    }
    async componentDidMount() {
        this.get_restorans();
        this.get_restoran_tags();
        this.get_food_tags();
    }
    getRestoranById(id) {
        let { restorans } = this.state;
        return restorans.find((o) => o.id === id);
    }
    header_layout() {
        let { searchValue } = this.state;
        return {
            className: 'p-h-12',
            gap:12,
            row: [
                { size: 96, align: 'vh', html: 'افزودن رستوران', onClick: () => this.openModal('add'), className: 'fs-12', style: { background: 'orange', color: '#fff'} },
                {
                    flex: 1,
                    html: (
                        <AIOInput
                            placeholder='جستجو'
                            type='text' style={{ width: '100%', background: '#fff' }} value={searchValue}
                            after={<Icon path={mdiMagnify} size={.9} />}
                            onChange={(searchValue) => this.setState({ searchValue })}
                        />
                    )
                }
            ]
        }
    }
    getRestoransBySearch() {
        let { restorans, searchValue } = this.state;
        return Search(restorans, searchValue, (o) => `${o.name} ${o.address} ${o.phone}`)
    }
    body_layout() {
        let list = this.getRestoransBySearch();
        return {
            flex: 1, className: 'ofy-auto p-12', gap: 6,
            column: list.map((restoran) => {
                let onClick = ()=>this.openModal('edit',restoran);
                let onRemove = ()=>this.remove_restoran(restoran.id);
                return {html:<RestoranCard key={restoran.id} onClick={onClick} onRemove={onRemove} restoran={restoran}/>}
            })
        }
    }
    openModal(type, restoran) {
        let { popup } = this.state;
        if (type === 'add') {
            restoran = {
                name: '', image: false, logo: false, latitude: 35.699739, longitude: 51.338097, startTime: '00:00', endTime: '00:00',
                address: '', ifRate: 0, ifComment: '', tags: [], phone: '',
            }
        }
        popup.addModal({
            header:{title: type === 'add' ? 'افزودن رستوران' : 'ویرایش رستوران'}, position: 'fullscreen',
            body: {render:() => <RestoranForm type={type} restoran={restoran} />}
        })
    }
    getContext() {
        let { apis } = this.context;
        let { food_tags,restoran_tags,restoran_tags_dic } = this.state;
        return {
            apis, food_tags,restoran_tags,restoran_tags_dic,
            openModal:this.openModal.bind(this),
            remove_restoran: this.remove_restoran.bind(this),
            add_or_edit_restoran: this.add_or_edit_restoran.bind(this)
        }
    }
    render() {
        let {popup} = this.state;
        return (
            <RestoranContext.Provider value={this.getContext()}>
                <RVD layout={{ column: [this.header_layout(), this.body_layout()] }} />
                {popup.render()}
            </RestoranContext.Provider>
        )
    }
}
class RestoranCard extends Component{
    static contextType = RestoranContext;
    image_layout(image){return {size:60,html:<img src={image} width='100%' alt=''/>}}
    body_layout(){
        let {restoran_tags_dic} = this.context;
        let {restoran,onRemove} = this.props;
        let {name,tags,id} = restoran;
        let tagsText = tags.map((tagId) => restoran_tags_dic[tagId]).join(' , ')
        let row1 = {row: [this.name_layout(name),this.remove_layout(onRemove)]};
        let row2 = { row: [this.tags_layout(tagsText), this.code_layout(id)] };
        return {flex: 1,column: [row1,row2],className:'p-6'}
    }
    name_layout(name){return { flex: 1, html: name }}
    remove_layout(onRemove){return {html:<Icon path={mdiClose} size={.9}/>,onClick:onRemove}}
    tags_layout(tagsText){return { flex: 1, html: tagsText, className: 'fs-10' }}
    code_layout(id){return { html: `کد : ${id}` }}
    render(){
        let {restoran,onClick} = this.props;
        return <RVD layout={{onClick, className: 'bo-restoran-card',row: [this.image_layout(restoran.image),this.body_layout(restoran)]}}/>;
    }
}
class RestoranForm extends Component {
    static contextType = RestoranContext;
    constructor(props) {
        super(props);
        this.timeOptions = this.getTimeOptions();
        this.state = { model: { ...props.restoran }, popup: new AIOPopup(), foods: [] }
    }
    getTimeOptions() {
        return new Array(24).fill(0).map((o, i) => {
            let hour = i.toString();
            hour = hour.length === 1 ? `0${hour}` : hour;
            return { text: <div style={{ direction: 'ltr' }}>{`${hour}:00`}</div>, value: `${hour}:00` }
        })
    }

    componentDidMount() {
        this.updateFoods()
    }
    async updateFoods() {
        let { apis } = this.context, { type } = this.props, { model } = this.state;
        if (type === 'edit') {
            await apis({ 
                api: 'get_restoran_foods', name: 'دریافت اطلاعات منوی رستوران', parameter: model.id,def:[],
                callback: (foods) => this.setState({ foods }) 
            })
        }
    }
    foods_layout() {
        let { foods } = this.state;
        let {type} = this.props;
        if(type !== 'edit'){return false}
        return {
            props:{gap:0},
            column: [
                { html: 'منوی رستوران', className: 'fs-12' },
                {
                    style: { border: '1px dashed #333', padding: 6 },
                    html: (
                        <RVD
                            layout={{
                                onClick: () => this.openFoods(),style:{width:72,height:72},align:'vh',
                                column: [
                                    { align: 'vh', html: <Icon path={mdiFormatListBulletedSquare} size={1} />, style: { color: 'orange' } },
                                    { html: `${foods.length} مورد`, align: 'vh' }
                                ]
                            }}
                        />
                    )
                }
            ]
        }
    }
    map_layout() {
        let { model } = this.state;
        let html;
        if (model.latitude === 35.699739 || model.longitude === 51.338097) {
            html = 'ثبت نشده'
        }
        else { 
            html = (
                <Map
                    apiKey='web.c6d5b589faf947e1b6143fa8977eb9b7'
                    style={{ width: '100%', height: '100%' }}
                    latitude={model.latitude}
                    longitude={model.longitude}
                />
            ) 
        }
        return {
            props:{gap:0},flex:1,
            column: [
                { html: 'موقعیت رستوران', className: 'fs-12' },
                {
                    style: { border: '1px dashed #333' },
                    html: (
                        <RVD
                            layout={{
                                onClick: () => this.openMap(), align: 'vh',
                                style: { fontSize: 12, width: '100%', height: 84, color:'red' },
                                html, align: 'vh', className: 'bold'
                            }}
                        />
                    )
                }
            ]
        }
    }
    image_layout() {
        let { model } = this.state;
        return {
            props:{gap:0},flex:1,
            column: [
                { html: 'تصویر رستوران', className: 'fs-12' },
                {
                    className: 'p-6',
                    style: { border: '1px dashed #333' },
                    html: (
                        <AIOInput
                            type='file' className='of-hidden'
                            text={model.image ? <img src={model.image} width={200} /> : 'افزودن تصویر'}
                            onChange={async (files) => {
                                if (FileReader && files && files.length) {
                                    let fr = new FileReader();
                                    fr.onload = () => {
                                        model.image = fr.result;
                                        model.image_file = files[0].file;
                                        this.setState({ model })
                                    }
                                    fr.readAsDataURL(files[0].file);
                                }
                            }}
                            style={{ width: '100%', height: 72 }}
                        />
                    )
                }
            ]
        }
    }
    logo_layout() {
        let { model } = this.state;
        return {
            props:{gap:0},
            column: [
                { html: 'لوگوی رستوران', className: 'fs-12' },
                {
                    className: 'p-6 of-hidden',
                    style: { border: '1px dashed #333' },
                    html: (
                        <AIOInput
                            type='file' className='of-hidden'
                            text={model.logo ? <img src={model.logo} style={{ width: 72, height: 72 }} width='100%' /> : 'افزودن لوگو'}
                            onChange={async (files) => {
                                if (FileReader && files && files.length) {
                                    let fr = new FileReader();
                                    fr.onload = () => {
                                        model.logo = fr.result; model.logo_file = files[0].file; this.setState({ model })
                                    }
                                    fr.readAsDataURL(files[0].file);
                                }
                            }}
                            style={{ width: 72, height: 72, fontSize: 12 }}
                        />
                    )
                }
            ]
        }
    }
    form_layout() {
        let {restoran_tags} = this.context;
        let { model } = this.state;
        return {
            className: 'admin-panel-restoran-card p-12 ofy-auto',flex:1,
            html: (
                <AIOInput
                    style={{height:'100%',fontSize:12}}
                    type='form' lang='fa' reset={true} showErrors={false} value={model}
                    footer={(obj) => this.formFooter_layout(obj)}
                    onChange={(model,errors) => this.setState({ model })}
                    inputs={{
                        props:{gap:12,inlineLabelAttrs:{style:{width:90,fontSize:12,justifyContent:'end',padding:'0 12px'}}},
                        column: [
                            {
                                row: [
                                    this.image_layout(),
                                    this.logo_layout()
                                ]
                            },
                            {
                                row: [
                                    this.map_layout(),
                                    this.foods_layout(),
                                ]
                            },
                            {
                                row:[
                                    { input: { type: 'text' }, field: 'value.name', inlineLabel: 'نام', validations: [['required']] },
                                    { input: { type: 'text', disabled: true }, field: 'value.id', show: model.id !== undefined,size:72 }
                                ]
                            },
                            { input: { type: 'textarea' }, field: 'value.address', inlineLabel: 'آدرس', validations: [['required']] },
                            { input: { type: 'text', justNumber: true }, field: 'value.phone', inlineLabel: 'تلفن ثابت', validations: [['required']] },
                            {
                                row:[
                                    { input: { type: 'select', options: this.timeOptions }, field: 'value.startTime', inlineLabel: 'ساعت شروع', validations: [['required']] },
                                    { input: { type: 'select', options: this.timeOptions }, field: 'value.endTime', inlineLabel: 'ساعت پایان', validations: [['required']]},
                                ]
                            },
                            {
                                row:[
                                    { input: { type: 'number' }, field: 'value.tax', inlineLabel: 'درصد مالیات', validations: [['>=', 0], ['<=', 100]] },
                                    { input: { type: 'number' }, field: 'value.deliveryTime', inlineLabel: 'زمان ارسال (دقیقه)' },
                            
                                ]
                            },
                            { input: { type: 'multiselect', options: restoran_tags, optionText: 'option.name', optionValue: 'option.id' }, text: 'انتخاب تگ', field: 'value.tags', inlineLabel: 'تگ ها' },
                        ]
                    }}
                />
            )
        }
    }
    getErrorMessage(errors) {
        let { model } = this.state;
        if (model.latitude === 35.699739 || model.longitude === 51.338097) {
            return 'ثبت موقعیت رستوران روی نقشه ضروری است'
        }
        if (!model.image) { return 'ثبت تصویر رستوران ضروری است' }
        if (!model.logo) { return 'ثبت لوگو رستوران ضروری است' }
        let firstError = errors[0] ? errors[0] : false;
        if (firstError) { return firstError }
        
    }
    formFooter_layout({ errors, onReset }) {
        let { add_or_edit_restoran } = this.context;
        let { model } = this.state;
        let { type } = this.props;
        let errorMessage = this.getErrorMessage(errors);
        return (
            <RVD
                layout={{
                    className: 'h-36 p-h-12 p-v-6',
                    row: [
                        { show: type === 'add', html: (<button disabled={!!errorMessage} className='bo-submit-button' onClick={() => add_or_edit_restoran(model,'add')}>ثبت</button>) },
                        { show: type === 'edit' && !errorMessage, html: (<button className='bo-edit-button' onClick={() => add_or_edit_restoran(model,'edit')}>ویرایش</button>) },
                        { show: !!onReset, html: (<button className='bo-reset-button' onClick={() => onReset(model)}>بازنشانی تغییرات</button>) },
                        { flex: 1 },
                        { show: !!errorMessage, html: () => errorMessage, align: 'v', style: { color: 'red', fontSize: 10 } }
                    ]
                }}
            />
        )
    }
    openMap() {
        let { popup, model } = this.state;
        popup.addModal({
            header:{title: 'انتخاب موقعیت'}, position: 'fullscreen',
            animate: false,
            body: {
                render:() => {
                    return (
                        <Map
                            apiKey='web.c6d5b589faf947e1b6143fa8977eb9b7'
                            style={{ width: '100%', height: '100%' }}
                            latitude={model.latitude}
                            longitude={model.longitude}
                            onSubmit={(latitude, longitude, address) => {
                                this.setState({ model: { ...model, latitude, longitude, address } });
                                popup.removeModal();
                            }}
                        />
                    )
                }
            }
        })
    }
    openFoods() {
        let { popup, model} = this.state;
        popup.addModal({
            header:{title: `منوی رستوران ${model.name}`}, position: 'fullscreen',
            animate: false,
            body: {
                render:() => {
                    let { model, foods } = this.state;
                    return (
                        <div style={{ height: '100%', background: '#fff' }}>
                            <Foods foods={foods} onChange={(newFoods) => {
                                this.setState({foods:newFoods})
                            }} restoranId={model.id} onClose={() => popup.removeModal()} />
                        </div>
                    )
                }
            }
        })
    }
    render() {
        let {popup} = this.state;
        return (
            <>
                <RVD layout={this.form_layout()} />
                {popup.render()}
            </>
        )
    }
}


class Foods extends Component {
    static contextType = RestoranContext;
    constructor(props){
        super(props);
        this.state = {
            Shop:new AIOSHOP({id:'ifgfoodsbackoffice'})
        }
    }
    async add_or_edit_food(newFood,action) {
        let { apis } = this.context;
        let { restoranId,foods,onChange } = this.props;
        let res = await apis({
            api: 'add_or_edit_food',
            name: `${action === 'add'?'ثبت':'ویرایش'} غذا در منوی رستوران`,
            parameter: { restoranId, food: newFood,action }
        })
        let success = false,newFoods,foodId;
        if(action === 'add' && typeof res === 'object'){
            success = true; foodId = res.id;
            newFoods = [{...newFood,id:foodId}, ...foods];
            
        }
        else if(action === 'edit' && res === true){
            success = true; foodId = newFood.id;
            newFoods = foods.map((food) => food.id === foodId ? newFood : food)
        }
        if(success){
            onChange(newFoods);
            await apis({
                api: 'edit_food_image',name: 'ثبت تصویر منوی رستوران',
                parameter: { restoranId, foodId, imageFile: newFood.image_file, imageUrl: newFood.image }
            })
            return true
        }
    }
    async remove_food(id) {
        let { apis } = this.context;
        let { restoranId,foods,onChange } = this.props;
        let res = await apis({api: 'remove_food',name: 'حذف غذا از منوی رستوران',parameter: { restoranId, foodId:id }})
        if (res === true) {onChange(foods.filter((nf) => nf.id !== id)); return true}
    }
    submit(newFoods) {
        let { onClose, onChange } = this.props;
        onChange(newFoods)
        onClose()
    }
    render() {
        let { food_tags } = this.context;
        let { foods } = this.props;
        let {Shop} = this.state;
        let SHOPBACKOFFICE = Shop.renderBackOffice({
            variantMode:false,
            product:{
                list:foods,
                onAdd:async (newFood) => await this.add_or_edit_food(newFood,'add'),
                onEdit:async (newFood) => await this.add_or_edit_food(newFood,'edit'),
                onRemove:async (foodId) => await this.remove_food(foodId),
                fields:[
                    { input:{type: 'multiselect', options: food_tags.map((o) => { return { text: o.name, value: o.id } }) }, field: 'value.tags', label: 'تگ ها'},
                    { input:{type: 'text'}, field: 'value.menuCategory', label: 'سر فصل منو' },
                    { input:{type: 'select', options: [{ name: 'انتخاب نشده' }].concat(foods).map((o) => { return { text: o.name, value: o.id } })}, label: 'زیر مجموعه ی', field: 'value.parentId' }
                ],
            }
        })
        return (
            <>
                {SHOPBACKOFFICE}
                {Shop.renderPopups()}
            </>
        )
    }
}
