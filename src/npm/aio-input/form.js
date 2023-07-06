import React, { Component } from "react";
import RVD from './../react-virtual-dom/react-virtual-dom';
import AIOValidation from "../aio-validation/aio-validation";
import AIOInput from "./aio-input";
import { Icon } from '@mdi/react';
import { mdiChevronRight, mdiClose } from "@mdi/js";
import './form.css';
export default class Form extends Component {
    constructor(props){
        super(props);
        let {value = {},onChange} = props;
        if(!onChange){
            this.state = {value}
        }
        this.errors = {}
    }
    getValue(){
        let {onChange} = this.props;
        if(onChange){
            let {value = {}} = this.props;
            return value;
        }
        else{
            let {value} = this.state;
            return value;
        }
    }
    setValue(v,field,obj){
        let { onChange } = this.props;
        let value = this.getValue();
        let newValue = this.setValueByField(value, field, v);
        let error = this.getError(obj,v)
        if(error){this.errors[field] = error}
        else {this.errors[field] = undefined}
        if(onChange){onChange(newValue,[...Object.keys(this.errors).filter((o)=>!!this.errors[o]).map((o)=>this.errors[o])])}
        else{this.setState({value:newValue})} 
        
    }
    header_layout() {
        let { header, title, subtitle, headerAttrs = {}, onClose, onBack } = this.props;
        if (!header && !title && !onClose && !onBack) { return false }
        return {
            className: 'aio-input-form-header' + (headerAttrs.className ? ' ' + headerAttrs.className : ''), style: headerAttrs.style,
            row: [
                { show: !!onBack, size: 36, html: <Icon path={mdiChevronRight} size={.8} />, align: 'vh', onClick: () => onBack() },
                {
                    show: !!title,
                    column: [
                        { flex: 1 },
                        { html: title, className: 'aio-input-form-title' },
                        { show: !!subtitle, html: subtitle, className: 'aio-input-form-subtitle' },
                        { flex: 1 }
                    ]
                },
                {flex:1,show:!!title},
                { show:!!header,flex: !!title ? undefined : 1, html: ()=>typeof header === 'function'?header():header,align:'vh' },
                { show: !!onClose, html: <Icon path={mdiClose} size={.8} />, onClick: () => onClose(),className:'aio-input-form-close-icon' }
            ]
        }
    }
    body_layout() {
        let { inputs } = this.props;
        if (Array.isArray(inputs)) {
            inputs = { column: inputs.map((o) => this.input_layout(o)) }
        }
        let res = {
            flex: 1, className: 'aio-input-form-body', ...inputs
        }
        return res
    }
    footer_layout() {
        let { footer, onSubmit, onClose, footerAttrs = {}, closeText = 'Close', submitText = 'submit' } = this.props;
        if (footer === false) { return false }
        if (!footer && !onSubmit && !onClose) { return false }
        let disabled = !!Object.keys(this.errors).length
        return {
            className: 'aio-input-form-footer' + (footerAttrs.className ? ' ' + footerAttrs.className : ''), style: footerAttrs.style,
            row: [
                { show: !!onClose, html: <button onClick={() => onClose()} className='aio-input-form-close-button aio-input-form-footer-button'>{closeText}</button> },
                { show: !!onSubmit, html: <button disabled={disabled} onClick={() => onSubmit()} className='aio-input-form-submit-button aio-input-form-footer-button'>{submitText}</button> },
            ]
        }
    }
    getDefault({ type, multiple }) {
        return {
            file: [],
            multiselect: [],
            radio: multiple ? [] : undefined,
        }[type]
    }
    getValueByField(field, def) {
        let props = this.props;
        let value = this.getValue();
        let a;
        if (typeof field === 'string') {
            if (field.indexOf('value.') !== -1 || field.indexOf('props.') !== -1) {
                try { eval(`a = ${field}`); }
                catch (err) { a = a; }
            }
            else { a = field }
        }
        else { a = typeof field === 'function' ? field() : field }
        if (a === undefined) { return def }
        return a
    }
    setValueByField(obj = {}, field, value) {
        field = field.replaceAll('[', '.');
        field = field.replaceAll(']', '');
        var fields = field.split('.');
        var node = obj;
        for (let i = 0; i < fields.length - 1; i++) {
            let f = fields[i];
            if (f === 'value') { continue }
            if (node[f] === undefined) {
                if (isNaN(parseFloat(fields[i + 1]))) { node[f] = {} }
                else { node[f] = []; }
                node = node[f];
            }
            else { node = node[f]; }
        }
        node[fields[fields.length - 1]] = value;
        return obj;
    }
    inlineLabel_layout(inlineLabel, props) {
        if (!inlineLabel) { return false }
        let { inlineLabelAttrs = {} } = props;
        let { className } = inlineLabelAttrs;
        return {
            html: inlineLabel, align: 'v', attrs: inlineLabelAttrs,
            className: 'aio-input-form-inline-label' + (className ? ' ' + className : '')
        }
    }
    label_layout(label, props) {
        if (!label) { return false }
        let { labelAttrs = {} } = props;
        let { className } = labelAttrs;
        return {
            html: label, attrs: labelAttrs,
            className: 'aio-input-form-label' + (className ? ' ' + className : '')
        }
    }
    error_layout(error,props){
        if(!error){return false}
        let { errorAttrs = {} } = this.props;
        let { className } = errorAttrs;
        return { 
            html: error,attrs:errorAttrs,
            className: 'aio-input-form-error' + (className ? ' ' + className : '')
        }
    }
    input_layout(obj) {
        let {rtl,inputAttrs} = this.props;
        let { label, footer, inlineLabel, input, flex, size, show, props = {},field } = obj;
        let value = this.getValueByField(field, this.getDefault(input));
        let error = this.getError(obj,value)
        if(error){this.errors[field] = error}
        else {this.errors[field] = undefined}
        return {
            flex, size,
            show: this.getValueByField(show, true),
            className: 'aio-input-form-item',
            column:[
                {
                    row: [
                        this.inlineLabel_layout(inlineLabel, props),
                        {
                            flex: 1,className:'of-visible',
                            column: [
                                this.label_layout(label, props),
                                { html: <AIOInput {...inputAttrs} {...input} rtl={rtl} value={value} onChange={(value) => this.setValue(value, field,obj)} /> },
                                { show: !!footer, html: footer },
                            ]
                        }
                    ]
                },
                this.error_layout(error,props)
            ]
        }
    }
    getError(o, value, options) {
        let { lang = 'en' } = this.props;
        let { validations = [], input } = o;
        let { type } = input;
        if (!validations.length || type === 'html') { return '' }
        let a = {
            value, title: o.label || o.inlineLabel, lang,
            validations: validations.map((a) => {
                let params = a[2] || {};
                let target = typeof a[1] === 'function' ? a[1] : this.getValueByField(a[1],'' );
                let operator = a[0];
                return [operator, target, params]
            })
        }
        let error = AIOValidation(a);
        return error;
    }
    render() {
        let {rtl,style} = this.props;
        return (
            <RVD
                getLayout={(obj, parent = {}) => {
                    if (obj.input) {
                        return this.input_layout({ ...obj,flex:parent.row && !obj.size && !obj.flex?1:undefined })
                    }
                    if(parent.input){
                        obj.className = 'of-visible'
                    }
                    return { ...obj }

                }}
                layout={{
                    style,
                    className: 'aio-input-form' + (rtl?' aio-input-form-rtl':''),
                    column: [
                        this.header_layout(),
                        this.body_layout(),
                        this.footer_layout()
                    ]
                }}
            />
        )
    }
}