import React, { Component } from 'react';
import RVD from './../react-virtual-dom/react-virtual-dom';
import AIOButton from './../aio-button/aio-button';
import AIOPopup from '../aio-popup/aio-popup';
import { Icon } from '@mdi/react';
import { mdiPlusThick, mdiMagnify, mdiCheck, mdiClose, } from '@mdi/js';
import Form from './../aio-form-react/aio-form-react';
import Search from './../aio-functions/search';
import './product-manager.css';
export default class ProductManager extends Component {
    constructor(props) {
        super(props);
        this.state = { products: props.products, popup: false }
    }
    header_layout() {
        return { className: 'p-6', row: [this.add_layout(), this.search_layout(), this.submit_layout()] }
    }
    add_layout() {
        return {
            size: 48, align: 'vh', className: 'fs-14 bold',
            html: <Icon path={mdiPlusThick} size={1} />,
            onClick: () => this.productFormPopup(),
            style: { color: 'dodgerblue' }
        }
    }
    search_layout() {
        let { searchValue } = this.state;
        return {
            flex: 1,
            html: (
                <AIOButton
                    type='text' style={{ width: '100%' }} value={searchValue}
                    after={<Icon path={mdiMagnify} size={.9} style={{ margin: '0 6px' }} />}
                    onChange={(searchValue) => this.setState({ searchValue })}
                />
            )
        }
    }
    submit_layout() {
        return {
            size: 48, align: 'vh', className: 'fs-14 bold',
            html: <Icon path={mdiCheck} size={1} />,
            onClick: () => {
                let { onSubmit } = this.props, { products } = this.state;
                onSubmit(products);
            },
            style: { color: 'dodgerblue' }
        }
    }
    getProductsBySearch() {
        let { products, searchValue } = this.state;
        return Search(products, searchValue, (o) => `${o.name} ${o.id}`)
    }
    changeState(newProducts){
        this.setState({ products: newProducts });
    }
    async add(newProduct){
        let {onAdd} = this.props;
        let id = await onAdd(newProduct)
        if(id !== undefined){
            let { products,popup } = this.state;
            newProduct.id = id;
            let newProducts = [newProduct, ...products]
            this.changeState(newProducts)
            popup.removePopup();
        }
    }
    async remove(id) {
        let {onRemove} = this.props;
        let res = await onRemove(id);
        if(res === true){
            let { products,popup } = this.state;
            let newProducts = products.filter((nf) => nf.id !== id)
            this.changeState(newProducts);
            popup.removePopup()
        }
    }
    async edit(newProduct) {
        let {onEdit} = this.props;
        let res = await onEdit(newProduct);
        if(res === true){
            let { products,popup } = this.state;
            let newProducts = products.map((product) => product.id === newProduct.id ? newProduct : product)
            this.changeState(newProducts);
            popup.removePopup()
        }
    }
    body_layout() {
        return {
            flex: 1, className: 'ofy-auto',
            column: this.getProductsBySearch().map((o) => {
                let { variants = [] } = o;
                return {
                    className: 'product-manager-product-card',
                    style: { border: '1px solid #ddd' }, align: 'v',
                    row: [
                        {
                            html: <img src={o.image} width={56} height={56} />, size: 60, align: 'vh', className: 'product-manager-product-card-image',
                            onClick: () => this.productFormPopup(o,'edit')
                        },
                        { html: variants.length, className: 'product-manager-product-card-variants-length', show: !!variants.length },
                        { size: 6 },
                        {
                            flex: 1,
                            column: [
                                { size: 6 },
                                { html: `کد ${o.id.indexOf('not-set') === 0?'ثبت نشده':o.id}` },
                                {size:3},
                                { html: o.name },
                                {size:3},
                                { html: o.description, className: 'fs-10', className: 'product-manager-product-card-description' },
                                { size: 6 }
                            ]
                        },
                        { size: 6 },
                        {
                            size: 36, html: <Icon path={mdiClose} size={.7} />, align: 'vh', style: { background: '#f8f8f8', height: '100%' },
                            onClick: () => this.remove(o.id)
                        },
                    ]
                }
            })
        }
    }
    productFormPopup(o) {
        let { popup } = this.state;
        let product = o || { name: '', image: false, review: '', description: '', details: [], tags: [], price: 0 }
        let type = !!o ? 'edit' : 'add';
        let title = !!o ? 'ویرایش محصول' : 'افزودن محصول'
        popup.addPopup({
            title, type: 'fullscreen', style: { maxWidth: 600 },
            body: () => (
                <RVD
                    layout={{
                        style: { height: '100%', background: '#fff', display: 'flex' },
                        column: [
                            {
                                flex: 1,
                                html: (
                                    <ProductCard
                                        product={product}
                                        onAdd={type === 'edit' ? undefined : (newProduct) => this.add(newProduct)}
                                        onEdit={type === 'add' ? undefined : (newProduct) => this.edit(newProduct)}
                                        onRemove={type === 'add' ? undefined : () => this.remove(o.id)}
                                    />
                                )
                            }
                        ]
                    }}
                />
            )
        })
    }
    render() {
        return (
            <>
                <RVD
                    layout={{
                        column: [
                            this.header_layout(),
                            this.body_layout()
                        ]
                    }}
                />
                <AIOPopup
                    getActions={({ addPopup, removePopup }) => this.setState({ popup: { addPopup, removePopup } })}
                />
            </>
        )
    }
}

class ProductCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            model: { ...props.product },
            popup: false,
        }
    }
    image_layout() {
        let { model } = this.state;
        let {image} = model;
        return (
            <AIOButton
                type='file'
                text={image ? <img src={image} style={{ width: 78, height: 78 }} width='100%' /> : 'افزودن تصویر'}
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
                style={{
                    width: 78,
                    height: 78,
                    border: '1px dashed #333'
                }}
            />

        )

    }
    optionTypes_layout() {
        let { model } = this.state;
        let { optionTypes = [] } = model;
        return (
            <AIOButton
                type='table'
                add={{ text: '', value: '' }}
                rows={optionTypes}
                onChange={(optionTypes) => {
                    model.optionTypes = optionTypes;
                    this.setState({ model })
                }}
                columns={[
                    { title: 'نام', value: 'row.name' },
                    { title: 'آی دی', value: 'row.id' },
                ]}

            />

        )
    }
    form() {
        let { model } = this.state;
        let { optionTypes = [] } = model;
        return (
            <Form
                lang='fa'
                style={{ background: 'none', height: '100%', width: '100%' }}
                theme={{
                    inlineLabel: true,
                    labelStyle: { width: 70 },
                    rowStyle: { marginBottom: 6 },
                    bodyStyle: { padding: 0 },
                }}
                reset={true}
                showErrors={false}
                model={model}
                footer={(obj) => this.formFooter_layout(obj)}
                onChange={(model) => this.setState({ model })}
                inputs={[
                    { type: 'text', field: 'model.id', label: 'آی دی', disabled: true, show: model.id !== undefined },
                    { type: 'text', field: 'model.name', label: 'نام', validations: [['required']] },
                    { type: 'textarea', field: 'model.description', label: 'توضیحات', validations: [['required']] },
                    { type: 'textarea', field: 'model.review', label: 'شرح', validations: [['required']], theme: { inputStyle: { height: 96 } } },
                    { type: 'html', label: 'آپشن ها', html: () => this.optionTypes_layout() },
                    {
                        type: 'group', inputs: optionTypes.map((o) => {
                            return {
                                type: 'html', label: `${o.name} ها`, html: () => this.optionValues_layout(o)
                            }
                        })
                    },
                    {
                        type: 'html', label: 'واریانت ها', html: () => this.variants_layout()
                    },
                    { type: 'html', label: 'تصویر', html: () => this.image_layout() },


                ]}
            />
        )
    }
    optionValues_layout(optionType) {
        let { model } = this.state;
        let { optionValues = [] } = optionType;
        return (
            <AIOButton
                type='table'
                add={{ name: '', id: '' }}
                remove={true}
                rows={optionValues}
                onChange={(optionValues) => {
                    optionType.optionValues = optionValues;
                    this.setState({ model })
                }}
                columns={[
                    { title: 'نام', value: 'row.name' },
                    { title: 'آی دی', value: 'row.id' },
                ]}

            />

        )
    }
    variants_layout() {
        let { model } = this.state;
        let { variants = [], optionTypes = [] } = model;
        return (
            <AIOButton
                type='table'
                add={{ id: 'nv' + Math.round(Math.random() * 10000000) }}
                remove={true}
                rows={variants}
                onChange={(variants) => {
                    model.variants = variants;
                    this.setState({ model })
                }}
                columns={optionTypes.map(({ name, id }, i) => {
                    return {
                        title: name, type: 'select', options: 'getOptionValues', value: `row.key.split("_")[${i}]`,
                        optionTypeId: id,
                        onChange: ({ row, value }) => {
                            let key = row.key;
                            if (!key) { key = optionTypes.map(() => 'notset').join('_') }
                            let keyList = key.split('_');
                            keyList[i] = value;
                            row.key = keyList.join('_');
                            this.setState({ model })
                        }
                    }
                })}
                getValue={{
                    getOptionValues: ({ column }) => {
                        let { model } = this.state;
                        let { optionTypes = [] } = model;
                        let optionType = optionTypes.find((o) => o.id === column.optionTypeId);
                        let { optionValues } = optionType;
                        let res = optionValues.map(({ name, id }) => { return { text: name, value: id } })
                        return res
                    }
                }}

            />

        )
    }
    getErrorMessage(errors, errorKeys) {
        let { model } = this.state;
        let firstError = errorKeys[0] ? errors[errorKeys[0]] : false;
        if (firstError) { return firstError }
        if (!model.image) { return 'ثبت تصویر رستوران ضروری است' }
    }
    formFooter_layout({ errors, isModelChanged, onReset }) {
        let { model } = this.state;
        let { onAdd, onEdit, onRemove } = this.props;
        let errorKeys = Object.keys(errors);
        let showSubmit = !!onAdd;
        let showEdit = !!onEdit && isModelChanged;
        let errorMessage = this.getErrorMessage(errors, errorKeys);
        if (!showSubmit && !showEdit && !errorMessage && !onRemove) { return false }
        return (
            <RVD
                layout={{
                    className: 'h-36 p-h-12 p-v-6',
                    row: [
                        {
                            show: showSubmit,
                            html: (<button disabled={!!errorMessage} className='bo-button bo-submit-button' onClick={() => onAdd(model)}>ثبت</button>)
                        },
                        {
                            show: showEdit,
                            html: (<button className='bo-button bo-edit-button' onClick={() => onEdit(model)}>ویرایش</button>)
                        },
                        {
                            show: !!onReset && !!isModelChanged,
                            html: (<button className='bo-button bo-reset-button' onClick={() => onReset(model)}>بازنشانی تغییرات</button>)
                        },
                        {
                            show: !!onRemove,
                            html: (<button className='bo-button bo-remove-button' onClick={() => onRemove()}>حذف</button>)
                        },
                        { flex: 1 },
                        { show: !!errorMessage, html: () => errorMessage, align: 'v', style: { color: 'red', fontSize: 10 } }
                    ]
                }}
            />
        )
    }
    render() {
        let { model } = this.state;
        let { optionTypes = [] } = model;
        return (
            <>
                <RVD
                    layout={{
                        className: 'p-12',
                        style: { background: '#eee' },
                        html: this.form()
                    }}
                />
                <AIOPopup
                    getActions={({ addPopup, removePopup }) => this.setState({ popup: { addPopup, removePopup } })}
                />
            </>
        )
    }
}