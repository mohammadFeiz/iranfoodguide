import React, { Component, createContext } from "react";
import AIOPopup from "../../npm/aio-popup/aio-popup";
import AIOInput from './../../npm/aio-input/aio-input';
import Form from './../../npm/aio-form-react/aio-form-react';
import RVD from './../../npm/react-virtual-dom/react-virtual-dom';
import Map from './../../npm/map/map';
import BOContext from "./back-office-context";
import ProductManager from './../../npm/aio-shop/product-manager';
import { Icon } from "@mdi/react";
import Search from './../../npm/aio-functions/search';
import { mdiPlusThick, mdiMagnify, mdiFormatListBulletedSquare, mdiMapMarkerAlert, mdiMapMarkerCheck, mdiClose } from '@mdi/js';
import './back-office.css';
let RestoranContext = createContext()
export default class Restorans extends Component {
    static contextType = BOContext;
    constructor(props) {
        super(props);
        this.state = { restorans: [], popup: false, searchValue: '', restoranTagsDictionary: {}, foodCategories: [] }
    }
    async get_restorans() { return await this.context.apis({ api: 'get_restorans', name: 'دریافت لیست رستوزان ها', def: [] }); }
    async add_restoran(newRestoran) {
        let { apis } = this.context;
        apis({
            api: 'add_restoran', parameter: newRestoran,
            callback: async ({ id }) => {
                await apis({
                    api: 'edit_restoran_image', name: 'ثبت تصویر رستوران',
                    parameter: { restoranId: newRestoran.id, imageFile: newRestoran.image_file, imageUrl: newRestoran.image }
                })
                await apis({
                    api: 'edit_restoran_logo', name: 'ثبت لوگوی رستوران',
                    parameter: { restoranId: newRestoran.id, imageFile: newRestoran.logo_file, imageUrl: newRestoran.logo }
                })
                let { restorans, popup } = this.state;
                let newRestorans = [{ ...newRestoran, id }, ...restorans]
                this.setState({ restorans: newRestorans });
                popup.removePopup();
            }
        })
    }
    async edit_restoran(newRestoran) {
        let { apis } = this.context;
        apis({
            api: 'edit_restoran', name: 'ویرایش اطلاعات رستوران', parameter: newRestoran,
            callback: async () => {
                await apis({
                    api: 'edit_restoran_image', name: 'ثبت تصویر رستوران',
                    parameter: { restoranId: newRestoran.id, imageFile: newRestoran.image_file, imageUrl: newRestoran.image }
                })
                await apis({
                    api: 'edit_restoran_logo', name: 'ثبت لوگوی رستوران',
                    parameter: { restoranId: newRestoran.id, imageFile: newRestoran.logo_file, imageUrl: newRestoran.logo }
                })
                let { restorans, popup } = this.state;
                let newRestorans = restorans.map((o) => o.id === newRestoran.id ? newRestoran : o)
                this.setState({ restorans: newRestorans });
                popup.removePopup();
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
                popup.removePopup();
            }
        })
    }
    async get_restoranTagsDictionary() {
        let { apis } = this.context;
        let tagOptions = await apis({ api: 'get_tags', parameter: { type: 'restoran' }, name: 'دریافت لیست تگ های رستوران ها', def: [] });
        let restoranTagsDictionary = {}
        for (let i = 0; i < tagOptions.length; i++) { let { id, name } = tagOptions[i]; restoranTagsDictionary[id] = name; }
        return restoranTagsDictionary
    }
    async getFoodCategories() {
        let { apis } = this.context;
        apis({
            api: 'get_tags',
            name: 'دریافت لیست تگ های غذا ها',
            parameter: { type: 'food' },
            callback: (foodCategories) => this.setState({ foodCategories })
        })
    }
    async componentDidMount() {
        let restorans = await this.get_restorans();
        let restoranTagsDictionary = await this.get_restoranTagsDictionary();
        let foodCategories = this.getFoodCategories();
        this.mounted = true;
        this.setState({ restorans, restoranTagsDictionary, foodCategories })
    }
    getRestoranById(id) {
        let { restorans } = this.state;
        return restorans.find((o) => o.id === id);
    }
    header_layout() {
        let { searchValue } = this.state;
        return {
            className: 'p-h-12 m-b-12',
            row: [
                { size: 48, align: 'vh', html: <Icon path={mdiPlusThick} size={1} />, onClick: () => this.openPopup('add'), className: 'fs-14 bold', style: { background: 'dodgerblue', color: '#fff' } },
                {
                    flex: 1,
                    html: (
                        <AIOInput
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
        return {
            flex: 1, className: 'ofy-auto', gap: 12,
            column: this.getRestoransBySearch().map((restoran) => this.restoranCard_layout(restoran))
        }
    }
    restoranCard_layout(restoran) {
        let { name, id, tags } = restoran;
        let { restoranTagsDictionary } = this.state;
        return {
            onClick: () => this.openPopup('edit', restoran), className: 'p-12 m-h-12 fs-12 br-12', style: { background: '#fff' },
            row: [
                {
                    flex: 1,
                    column: [
                        { row: [{ flex: 1, html: `نام رستوران : ${name}` }, { html: `کد : ${id}` }] },
                        { row: [{ flex: 1, html: tags.map((o) => o.name).join(' , '), className: 'fs-10' }] }
                    ]
                }
            ]
        }
    }
    openPopup(type, restoran) {
        let { popup } = this.state;
        if (type === 'add') {
            restoran = {
                name: '', image: false, logo: false, latitude: 35.699739, longitude: 51.338097, startTime: 0, endTime: 0,
                address: '', ifRate: 0, ifComment: '', tags: [], phone: '',
            }
        }
        popup.addPopup({
            title: type === 'add' ? 'افزودن رستوران' : 'ویرایش رستوران', type: 'fullscreen',
            body: () => <RestoranCard type={type} restoran={restoran} />
        })
    }
    getContext() {
        let { apis } = this.context;
        let { foodCategories } = this.state;
        return {
            apis, foodCategories,
            remove_restoran: this.remove_restoran.bind(this),
            add_restoran: this.add_restoran.bind(this),
            edit_restoran: this.edit_restoran.bind(this)
        }
    }
    render() {
        if (!this.mounted) { return false }
        return (
            <RestoranContext.Provider value={this.getContext()}>
                <RVD layout={{ column: [this.header_layout(), this.body_layout()] }} />
                <AIOPopup getActions={({ addPopup, removePopup }) => this.setState({ popup: { addPopup, removePopup } })} />
            </RestoranContext.Provider>
        )
    }
}
class RestoranCard extends Component {
    static contextType = RestoranContext;
    constructor(props) {
        super(props);
        this.timeOptions = this.getTimeOptions();
        this.state = { model: { ...props.restoran }, popup: false, foods: [], tagOptions: undefined }
    }
    getTimeOptions() {
        return new Array(24).fill(0).map((o, i) => {
            let hour = (i + 1).toString();
            hour = hour.length === 1 ? `0${hour}` : hour;
            return { text: <div style={{ direction: 'ltr' }}>{`${hour} : 00`}</div>, value: `${i + 1}:0` }
        })
    }

    componentDidMount() {
        let { apis } = this.context;
        apis({
            api: 'get_tags', name: 'دریافت لیست تگ های رستوران ها', parameter: { type: 'restoran' },
            callback: (tagOptions) => this.setState({ tagOptions })
        })
        this.updateFoods()
    }
    async updateFoods() {
        let { apis } = this.context, { type } = this.props, { model } = this.state;
        if (type === 'edit') {
            await apis({ api: 'get_restoran_foods', name: 'دریافت اطلاعات منوی رستوران', parameter: model.id, callback: (foods) => this.setState({ foods }) })
        }
    }
    foods_layout() {
        let { foods } = this.state;
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
        let style, path, status;
        if (model.latitude === 35.699739 || model.longitude === 51.338097) {
            style = { color: 'red' }; path = mdiMapMarkerAlert; status = 'ثبت نشده'
        }
        else { style = { color: 'green' }; path = mdiMapMarkerCheck; status = 'ثبت شده' }
        return {
            props:{gap:0},
            column: [
                { html: 'موقعیت رستوران', className: 'fs-12' },
                {
                    className: 'p-6',
                    style: { border: '1px dashed #333' },
                    html: (
                        <RVD
                            layout={{
                                onClick: () => this.openMap(), align: 'vh',
                                style: { fontSize: 12, width: 72, height: 72, ...style },
                                column: [
                                    { align: 'vh', html: <Icon path={path} size={1} /> },
                                    { html: status, align: 'vh', className: 'bold' }
                                ]
                            }}
                        />
                    )
                }
            ]
        }
    }
    remove_layout() {
        let { remove_restoran } = this.context;
        let { model } = this.state;
        return {
            props:{gap:0},
            column: [
                { html: 'حذف رستوران', className: 'fs-12' },
                {
                    style: { border: '1px dashed #333', padding: 6 },
                    html: <Icon path={mdiClose} style={{ height: 72, width: 72, color: 'red' }} />,
                    onClick: () => remove_restoran(model.id), align: 'vh'
                }
            ]
        }
    }
    image_layout() {
        let { model } = this.state;
        return {
            props:{gap:0},
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
                            style={{ width: 200, height: 72 }}
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
        let { model, tagOptions } = this.state;
        let { type } = this.props;
        return {
            className: 'admin-panel-restoran-card p-24',
            html: (
                <Form
                    lang='fa'
                    theme={{ inlineLabel: true, labelStyle: { width: 90 }, rowStyle: { marginBottom: 0 }, bodyStyle: { padding: 6 } }}
                    reset={true} showErrors={false} model={model}
                    footer={(obj) => this.formFooter_layout(obj)}
                    onChange={(model) => this.setState({ model })}
                    inputs={[
                        { type: 'html', html: () => this.image_layout(), rowKey: '0' },
                        { type: 'html', html: () => this.logo_layout(), rowKey: '0' },
                        { type: 'html', rowKey: '0' },
                        { show: type === 'edit', type: 'html', html: () => this.foods_layout(), rowKey: '0' },
                        { type: 'html', html: () => this.map_layout(), rowKey: '0', rowWidth: 90 },
                        { type: 'html', html: () => this.remove_layout(), rowKey: '0', show: type === 'edit', rowWidth: 72 },
                        { type: 'text', field: 'model.id', label: 'آی دی', disabled: true, show: model.id !== undefined },
                        { type: 'text', field: 'model.name', label: 'نام', validations: [['required']] },
                        { type: 'textarea', field: 'model.address', label: 'آدرس', validations: [['required']] },
                        { type: 'text', field: 'model.phone', label: 'تلفن ثابت', justNumber: true, validations: [['required']] },
                        { type: 'select', field: 'model.startTime', label: 'ساعت شروع', validations: [['required']], options: this.timeOptions },
                        { type: 'select', field: 'model.endTime', label: 'ساعت پایان', validations: [['required']], options: this.timeOptions },
                        { type: 'number', field: 'model.tax', label: 'درصد مالیات', validations: [['>=', 0], ['<=', 100]] },
                        { type: 'number', field: 'model.deliveryTime', label: 'زمان ارسال(دقیقه)' },
                        { type: 'multiselect', text: 'انتخاب تگ', field: 'model.tags', label: 'تگ ها', options: tagOptions, optionText: 'option.name', optionValue: 'option.id' },
                    ]}
                />
            )
        }
    }
    form_layout() {
        let { model, tagOptions } = this.state;
        return {
            className: 'admin-panel-restoran-card p-24',
            html: (
                <AIOInput
                    type='form' lang='fa'
                    reset={true} showErrors={false} value={model}
                    footer={(obj) => this.formFooter_layout(obj)}
                    onChange={(model) => {
                        debugger;
                        this.setState({ model })
                    }}
                    inputs={{
                        props:{gap:12,inlineLabelAttrs:{style:{width:90,fontSize:12,justifyContent:'end',padding:'0 12px'}}},
                        column: [
                            {
                                row: [
                                    this.image_layout(),
                                    this.logo_layout(),
                                    this.map_layout(),
                                    this.foods_layout(),
                                    { flex: 1 },
                                    this.remove_layout(),

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
                            { input: { type: 'multiselect', options: tagOptions, optionText: 'option.name', optionValue: 'option.id' }, text: 'انتخاب تگ', field: 'value.tags', inlineLabel: 'تگ ها' },
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
        let { edit_restoran, add_restoran } = this.context;
        let { model } = this.state;
        let { type } = this.props;
        let errorMessage = this.getErrorMessage(errors);
        return (
            <RVD
                layout={{
                    className: 'h-36 p-h-12 p-v-6',
                    row: [
                        { show: type === 'add', html: (<button disabled={!!errorMessage} className='bo-submit-button' onClick={() => add_restoran(model)}>ثبت</button>) },
                        { show: type === 'edit' && !errorMessage, html: (<button className='bo-edit-button' onClick={() => edit_restoran(model)}>ویرایش</button>) },
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
        popup.addPopup({
            title: 'انتخاب موقعیت', type: 'fullscreen',
            animate: false,
            body: () => {
                return (
                    <Map
                        apiKey='web.c6d5b589faf947e1b6143fa8977eb9b7'
                        style={{ width: '100%', height: '100%' }}
                        latitude={model.latitude}
                        longitude={model.longitude}
                        onSubmit={(latitude, longitude, address) => {
                            this.setState({ model: { ...model, latitude, longitude, address } });
                            popup.removePopup();
                        }}
                    />
                )
            }
        })
    }
    openFoods() {
        let { popup, model, foods } = this.state;
        popup.addPopup({
            title: `منوی رستوران ${model.name}`, type: 'fullscreen',
            animate: false,
            body: () => {
                return (
                    <div style={{ height: '100%', background: '#fff' }}>
                        <Foods foods={foods} onChange={() => this.updateFoods()} restoranId={model.id} onClose={() => popup.removePopup()} />
                    </div>
                )
            }
        })
    }
    render() {
        let { tagOptions } = this.state;
        if (!tagOptions) { return null }
        return (
            <>
                <RVD layout={this.form_layout()} />
                <AIOPopup
                    getActions={({ addPopup, removePopup }) => this.setState({ popup: { addPopup, removePopup } })}
                />
            </>
        )
    }
}


class Foods extends Component {
    static contextType = RestoranContext;
    async add_food(newFood) {
        let { apis } = this.context;
        let { restoranId } = this.props;
        let res = await apis({
            api: 'add_food',
            name: 'ثبت غذا در منوی رستوران',
            parameter: { restoranId, food: newFood }
        })
        if (typeof res === 'object') {
            await apis({
                api: 'edit_food_image',
                name: 'ثبت تصویر منوی رستوران',
                parameter: { restoranId, foodId: res.id, imageFile: newFood.image_file, imageUrl: newFood.image }
            })
            return res.id
        }
    }
    async edit_food(newFood) {
        let { apis } = this.context;
        let { restoranId } = this.props;
        let res = await apis({
            api: 'edit_food',
            name: 'ویرایش غذا در منوی رستوران',
            parameter: { restoranId, food: newFood }
        })

        if (res) {
            let foodId = newFood.id;
            await apis({
                api: 'edit_food_image',
                name: 'ثبت تصویر منوی رستوران',
                parameter: { restoranId, foodId, imageFile: newFood.image_file, imageUrl: newFood.image }
            })
            return true
        }
    }
    async remove_food(foodId) {
        let { apis } = this.context;
        let { restoranId } = this.props;
        let res = await apis({
            api: 'remove_food',
            name: 'حذف غذا از منوی رستوران',
            parameter: { restoranId, foodId }
        })
        if (res === true) { return true }
    }
    submit() {
        let { onClose, onChange } = this.props;
        onChange()
        onClose()
    }
    render() {
        let { foods } = this.props;
        let { foodCategories } = this.context;
        return (
            <ProductManager
                variantMode={false}
                subProductMode={true}
                extraOptions={[
                    { type: 'multiselect', field: 'model.categories', label: 'دسته بندی ها', options: foodCategories.map((o) => { return { text: o.name, value: o.id } }) },
                    { type: 'text', field: 'model.menuCategory', label: 'سر فصل منو' },
                    { type: 'select', label: 'زیر مجموعه ی', options: [{ name: 'انتخاب نشده' }].concat(foods).map((o) => { return { text: o.name, value: o.id } }), field: 'model.parentId' }
                ]}
                products={foods}
                onAdd={async (newFood) => await this.add_food(newFood)}
                onEdit={async (newFood) => await this.edit_food(newFood)}
                onRemove={async (foodId) => await this.remove_food(foodId)}
                onSubmit={(newFoods) => this.submit(newFoods)}
            />
        )
    }
}
