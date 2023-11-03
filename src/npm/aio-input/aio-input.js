import React, { Component, createRef, useContext, createContext, Fragment, useState, useEffect } from 'react';
import AIODate from 'aio-date';
import RVD from 'react-virtual-dom';
import Axios from 'axios';
import Search from '../aio-functions/search';
import ExportToExcel from '../aio-functions/export-to-excel';
import DownloadUrl from '../aio-functions/download-url';
import JSXToHTML from './../aio-functions/jsx-to-html';
import { Icon } from '@mdi/react';
import {
    mdiChevronDown, mdiLoading, mdiAttachment, mdiChevronRight, mdiClose, mdiCircleMedium, mdiArrowUp, mdiArrowDown,
    mdiSort, mdiFileExcel, mdiMagnify, mdiPlusThick, mdiChevronLeft, mdiImage, mdiEye, mdiEyeOff, mdiDownloadOutline,
    mdiCrosshairsGps
} from "@mdi/js";
import AIOSwip from '../aio-swip/aio-swip';
import AIOPopup from './../../npm/aio-popup/aio-popup';
import $ from 'jquery';
import './aio-input.css';

class Popover {
    constructor(getProp, id, toggle, getOptions, addToAttrs) {
        this.getProp = getProp;
        this.getOptions = getOptions;
        this.addToAttrs = addToAttrs;
        this.toggle = toggle;
        this.type = getProp('type');
        this.id = id;
        this.isActive = this.getIsActive();
        if (this.isActive) { this.rtl = getProp('rtl') }
    }
    getRender = (popover) => {
        if (this.type === 'button') { return ({ close }) => popover.render({ close }) }
        else if (this.type === 'datepicker') { return ({ close }) => <DatePicker onClose={close} /> }
        else {
            return ({ close }) => {
                let options = this.getOptions() || [];
                if (!options.length) { return null }
                if (popover.render) { return popover.render({ close, options }) }
                return <Options options={options} />
            }
        }
    }
    getIsActive = () => {
        let options = this.getProp('options');
        let popover = this.getProp('popover');
        if (this.type === 'button') { return !!popover }
        if (this.type === 'datepicker') { return true }
        else if (this.type === 'select') { return true }
        else if (this.type === 'multiselect') { return true }
        else if (this.type === 'text') { return !!options }
        else if (this.type === 'number') { return !!options }
        else if (this.type === 'textarea') { return !!options }
        return false
    }
    getBackdrop = (popover) => {
        let { backdrop = {} } = popover;
        return { ...backdrop, attrs: this.addToAttrs(backdrop.attrs, { className: 'aio-input-backdrop ' + this.id }) }
    }
    getBody = (popover, render) => {
        let { body = {} } = popover;
        return { ...body, render }
    }
    getPopover = (popover, dom) => {
        let { fixStyle, fitHorizontal = ['multiselect', 'text', 'number', 'textarea'].indexOf(this.type) !== -1 } = popover;
        return { fixStyle, fitHorizontal, pageSelector: '.aio-input-backdrop.' + this.id, getTarget: () => $(dom.current) }
    }
    getFn = () => {
        if (!this.isActive) { return }
        return (dom) => {
            let popover = { ...AIOInput.defaults.popover, ...this.getProp('popover', {}) }
            let render = this.getRender(popover);
            let body = this.getBody(popover, render)
            let { rtl, position = 'popover', header, attrs = {} } = popover;
            return {
                onClose: () => this.toggle(false),
                rtl, header, position, header,
                backdrop: this.getBackdrop(popover),
                body,
                popover: this.getPopover(popover, dom),
                attrs: this.addToAttrs(popover.attrs, { className: `aio-input-popover aio-input-popover-${this.rtl ? 'rtl' : 'ltr'}` })
            }
        }
    }
}
const AICTX = createContext();
export default class AIOInput extends Component {
    static defaults = { validate: false, mapApiKeys: {}, popover: {} };
    constructor(props) {
        super(props);
        this.type = props.type;
        this.isInput = ['text', 'number', 'textarea', 'password'].indexOf(props.type) !== -1;
        this.isDropdown = ['text', 'number', 'textarea', 'select', 'multiselect'].indexOf(props.type) !== -1;
        this.handleIsMultiple(props.type);
        this.dom = createRef();
        this.datauniqid = 'aiobutton' + (Math.round(Math.random() * 10000000));
        this.popup = new AIOPopup();
        this.getPopover = new Popover(this.getProp.bind(this), this.datauniqid, this.toggle.bind(this), this.getOptions.bind(this), this.addToAttrs.bind(this)).getFn();
        this.state = { open: this.getProp('open', false), showPassword: false }
    }
    handleIsMultiple(type) {
        if (type === 'multiselect' || type === 'table') { this.isMultiple = () => true }
        else if (type === 'radio' || type === 'slider' || type === 'file') { this.isMultiple = () => !!this.props.multiple }
        else { this.isMultiple = () => false };
    }
    dragStart(e) { this.dragIndex = parseInt($(e.target).attr('datarealindex')); }
    dragOver(e) { e.preventDefault(); }
    drop(e) {
        e.stopPropagation();
        let from = this.dragIndex, dom = $(e.target);
        if (!dom.hasClass('aio-input-option')) { dom = dom.parents('.aio-input-option'); };
        if (!dom.hasClass('aio-input-option')) { return };
        let to = parseInt(dom.attr('datarealindex'));
        if (from === to) { return }
        this.getProp('onSwap')(from, to, this.swap)
    }
    swap(arr, from, to) {
        if (to === from + 1) { let a = to; to = from; from = a; }
        let Arr = arr.map((o, i) => { o._testswapindex = i; return o })
        let fromIndex = Arr[from]._testswapindex
        Arr.splice(to, 0, { ...Arr[from], _testswapindex: false })
        return Arr.filter((o) => o._testswapindex !== fromIndex)
    }
    getSelectText() {
        let options = this.getProp('options', [])
        let value = this.getProp('value');
        let option = options.find((option) => value === undefined ? false : this.getOptionProp(option, 'value') === value);
        if (option === undefined) { return }
        return this.getOptionProp(option, 'text')
    }
    getDatepickerText() {
        let value = this.getProp('value');
        if (value) {
            let unit = this.getProp('unit', 'day');
            let Pattern = this.getProp('pattern');
            let list = AIODate().convertToArray({ date: value });
            let [year, month = 1, day = 1, hour = 0] = list;
            list = [year, month, day, hour];
            let pattern;
            let splitter = AIODate().getSplitter(value)
            if (Pattern) { pattern = Pattern }
            else if (unit === 'month') { pattern = `{year}${splitter}{month}` }
            else if (unit === 'day') { pattern = `{year}${splitter}{month}${splitter}{day}` }
            else if (unit === 'hour') { pattern = `{year}${splitter}{month}${splitter}{day} - {hour} : 00` }
            return <div style={{ direction: 'ltr' }}>{AIODate().getDateByPattern({ date: list, pattern })}</div>
        }
        let calendarType = this.getProp('calendarType', 'gregorian')
        return this.getProp('placeholder', calendarType === 'gregorian' ? 'Select Date' : 'انتخاب تاریخ')
    }
    addToAttrs(attrs = {}, { className, style, stylePriority = true }) {
        let classNames = [];
        if (attrs.className) { classNames.push(attrs.className) }
        if (className) { classNames.push(className) }
        let newClassName = classNames.length ? classNames.join(' ') : undefined
        let newStyle = stylePriority ? { ...attrs.style, ...style } : { ...style, ...attrs.style };
        return { ...attrs, className: newClassName, style: newStyle }
    }
    getProp(key, def) {
        let { type } = this.props;
        let propsResult = this.props[key] === 'function' ? this.props[key]() : this.props[key];
        if (key === 'value') {
            if (propsResult === null) { propsResult = undefined }
            if (type === 'map') {
                let { lat = 35.699739, lng = 51.338097 } = propsResult || {};
                return { lat, lng }
            }
            if (this.isMultiple()) {
                if (propsResult === undefined) { propsResult = [] }
                if (!Array.isArray(propsResult)) {
                    console.error(`aio-input error => in type="${type}" by multiple:true value should be an array but is ${propsResult}`)
                    return [propsResult]
                }
            }
            else {
                if (Array.isArray(propsResult)) {
                    console.error(`aio-input error => in type="${type}" by multiple:false|undefined value cannot be an array`)
                    return propsResult[0]
                }
            }
            return propsResult === undefined ? def : propsResult;
        }
        if (key === 'type') { return this.props.type }
        if (key === 'isDropdown') { return this.isDropdown }
        if (key === 'props') { return this.props }
        if (key === 'after') {
            if (type === 'password' && this.getProp('visible')) {
                let { showPassword } = this.state;
                return <div className='align-v' onClick={() => this.toggleShowPassword()}><Icon path={showPassword ? mdiEyeOff : mdiEye} size={.8} /></div>
            }
        }
        if (key === 'caret') {
            if (propsResult === false) { return false }
            if (type === 'button') { return !!this.getProp('popover') }
            if (type === 'select' || type === 'multiselect' || type === 'datepicker') { return propsResult || true }
            if (type === 'text' || type === 'number' || type === 'textarea') {
                let options = this.getProp('options');
                if (options) { return propsResult || true }
                else { return false }
            }
            return false;
        }
        if (key === 'text' && propsResult === undefined) {
            if (type === 'select') { return this.getSelectText() }
            if (type === 'datepicker') { return this.getDatepickerText() }
        }
        propsResult = propsResult === undefined ? def : propsResult;
        return propsResult;
    }
    getOptionProp(option, key, def, preventFunction) {
        let optionResult = typeof option[key] === 'function' && !preventFunction ? option[key](option, this.props) : option[key]
        if (optionResult !== undefined) { return optionResult }
        let prop = this.props['option' + key[0].toUpperCase() + key.slice(1, key.length)];
        if (typeof prop === 'string') {
            try {
                let props = this.props, value;
                eval('value = ' + prop);
                return value;
            }
            catch { prop = prop }
        }
        if (typeof prop === 'function' && !preventFunction) {
            let res = prop(option, this.props);
            return res === undefined ? def : res;
        }
        return prop !== undefined ? prop : def;
    }
    toggle(popover, e) {
        let open = !!this.popup.getModals().length
        let onToggle = this.getProp('onToggle');
        if (!!popover === !!open) { return }
        if (popover) {
            this.popup.addModal(popover);
            this.setState({ open: true })
        }
        else {
            this.popup.removeModal();
            this.setState({ open: false })
            setTimeout(() => $(this.dom.current).focus(), 0)
        }
        if (onToggle) { onToggle(!!popover) }
    }
    click(e, dom) {
        let type = this.type;
        let onChange = this.getProp('onChange', () => { });
        let attrs = this.getProp('attrs', {});
        if (type === 'checkbox') { onChange(!this.getProp('value')) }
        else if (this.getPopover) { this.toggle(this.getPopover(dom), e) }
        else if (attrs.onClick) { attrs.onClick(); }
    }
    optionClick(option) {
        let onChange = this.getProp('onChange', () => { });
        let type = this.type;
        let Value = this.getProp('value');
        let { value, attrs = {}, close, text } = option;
        if (attrs.onClick) { attrs.onClick(value, option); }
        else if (type && ['text', 'number', 'textarea', 'password'].indexOf(type) !== -1) { onChange(text, option) }
        else if (this.isMultiple()) {
            if (Value.indexOf(value) === -1) { onChange(Value.concat(value), value, 'add') }
            else { onChange(Value.filter((o) => o !== value), value, 'remove') }
        }
        else { onChange(value, option) }
        if (close) { this.toggle(false) }
    }
    toggleShowPassword() { this.setState({ showPassword: !this.state.showPassword }) }
    getOptions() {
        let getProp = this.getProp.bind(this);
        let getOptionProp = this.getOptionProp.bind(this);
        let type = this.type;
        let getDefaultOptionChecked = (value) => {
            if (type === 'multiselect' || type === 'radio') {
                let Value = getProp('value');
                return this.isMultiple() ? Value.indexOf(value) !== -1 : Value === value
            }
        }
        let options = getProp('options', []);
        let result = [];
        let renderIndex = 0;
        let Value = getProp('value')
        for (let i = 0; i < options.length; i++) {
            let option = options[i];
            let show = getOptionProp(option, 'show')
            if (show === false) { continue }
            let text = getOptionProp(option, 'text');
            if (this.isInput && Value && text.toString().indexOf(Value.toString()) !== 0) { continue }
            let value = getOptionProp(option, 'value')
            let attrs = getOptionProp(option, 'attrs', {});
            let obj = {
                text, value,
                checkIcon: getOptionProp(option, 'checkIcon', [], true),
                checked: getOptionProp(option, 'checked', getDefaultOptionChecked(value)),
                before: getOptionProp(option, 'before'),
                after: getOptionProp(option, 'after'),
                center: getOptionProp(option, 'center'),
                subtext: getOptionProp(option, 'subtext'),
                disabled: getOptionProp(option, 'disabled'),
                attrs,
                tagAttrs: getOptionProp(option, 'tagAttrs'),
                tagBefore: getOptionProp(option, 'tagBefore'),
                close: getOptionProp(option, 'close', type !== 'multiselect'),
                tagAfter: getOptionProp(option, 'tagAfter'),
                renderIndex, realIndex: i
            }
            if (value === Value) { obj.attrs = this.addToAttrs(obj.attrs, { className: 'active' }) }
            result.push(obj)
            renderIndex++;
        }
        return result;
    }
    getContext() {
        return {
            ...this.props,
            addToAttrs: this.addToAttrs.bind(this),
            mapApiKeys: AIOInput.defaults.mapApiKeys,
            isMultiple: this.isMultiple.bind(this),
            isInput: this.isInput,
            type: this.type,
            getOptions: this.getOptions.bind(this),
            open: this.state.open,
            toggleShowPassword: this.toggleShowPassword.bind(this),
            showPassword: this.state.showPassword,
            popup: this.popup,
            dragStart: this.dragStart.bind(this),
            dragOver: this.dragOver.bind(this),
            drop: this.drop.bind(this),
            click: this.click.bind(this),
            optionClick: this.optionClick.bind(this),
            datauniqid: this.datauniqid,
            getProp: this.getProp.bind(this),
            getOptionProp: this.getOptionProp.bind(this),
            parentDom: this.dom,
        }
    }
    D2S(n) { n = n.toString(); return n.length === 1 ? '0' + n : n }
    getTimeText(obj) {
        obj = { ...obj }
        for (let prop in obj) { obj[prop] = this.D2S(obj[prop]) }
        let text = [], dateArray = [];
        if (obj.year !== undefined) { dateArray.push(obj.year) }
        if (obj.month !== undefined) { dateArray.push(obj.month) }
        if (obj.day !== undefined) { dateArray.push(obj.day) }
        if (dateArray.length) { text.push(dateArray.join('/')) }
        let timeArray = []
        if (obj.hour !== undefined) { timeArray.push(obj.hour) }
        if (obj.minute !== undefined) { timeArray.push(obj.minute) }
        if (obj.second !== undefined) { timeArray.push(obj.second) }
        if (timeArray.length) { text.push(timeArray.join(':')) }
        return text.join(' ');
    }
    render_button() { return <Layout /> }
    render_list() {
        return <List getProp={this.getProp.bind(this)} getOptionProp={this.getOptionProp.bind(this)} />
    }
    render_time() {
        let getProps = () => {
            let calendarType = this.getProp('calendarType', 'gregorian');
            let today = AIODate().getToday({ calendarType });
            let todayObject = { year: today[0], month: today[1], day: today[2], hour: today[3], minute: today[4], second: today[5] }
            let value = this.getProp('value', {});
            for (let prop in value) { if (value[prop] === true) { value[prop] = todayObject[prop] } }
            let popover = this.getProp('popover', {});
            let onChange = this.getProp('onChange');
            return { text: this.getTimeText(value), attrs: this.addToAttrs(this.getProp('attrs'), { style: { direction: 'ltr' } }), popover, onChange, value }
        }
        let { text, attrs, popover = {}, onChange } = getProps()
        return (
            <AIOInput
                caret={false} text={text} {...this.props} attrs={attrs} type='button'
                popover={!onChange ? undefined : {
                    position: 'center', ...popover, attrs: this.addToAttrs(popover.attrs, { className: 'aio-input-time-popover' }),
                    render: ({ close }) => <TimePopover value={getProps().value} onChange={(obj) => onChange(obj)} onClose={() => close()} />
                }}
            />
        )
    }
    render_file() { return <File /> }
    render_select() { return <Layout /> }
    render_multiselect() { return <Multiselect /> }
    render_radio() { return <Layout text={<Options />} /> }
    render_tabs() { return <Layout text={<Options />} /> }
    render_checkbox() { return <Layout /> }
    render_datepicker() { return <Layout /> }
    render_image() { return <Layout text={<Image />} /> }
    render_map() { return <Layout text={<Map getProp={this.getProp.bind(this)} />} /> }
    render_table() { return <Table getProp={this.getProp.bind(this)} /> }
    render_text() { return <Layout text={<Input />} /> }
    render_password() { return <Layout text={<Input />} /> }
    render_textarea() { return <Layout text={<Input />} /> }
    render_number() { return <Layout text={<Input />} /> }
    render_color() { return <Layout text={<Input />} /> }
    render_slider() { return <Layout text={<InputSlider getProp={this.getProp.bind(this)} />} /> }
    render_form() { return <Form getProp={this.getProp.bind(this)} /> }
    render() {
        let type = this.type;
        if (AIOInput.defaults.validate) { new AIOInputValidate(this.props) }
        if (!type || !this['render_' + type]) { return null }
        return (
            <AICTX.Provider key={this.datauniqid} value={this.getContext()}>
                {this['render_' + type]()}
                {this.popup.render()}
            </AICTX.Provider>
        )
    }
}
function TimePopover(props) {
    let { lang = 'fa' } = props;
    let [startYear] = useState(props.value.year ? props.value.year - 10 : undefined);
    let [endYear] = useState(props.value.year ? props.value.year + 10 : undefined);
    let [value, setValue] = useState({ ...props.value })
    function change(obj) { setValue({ ...value, ...obj }) }
    function translate(key) {
        return lang === 'fa' ? { 'year': 'سال', 'month': 'ماه', 'day': 'روز', 'hour': 'ساعت', 'minute': 'دقیقه', 'second': 'ثانیه', 'Submit': 'ثبت' }[key] : key
    }
    function getOptions(type) {
        let { year, month, day } = value;
        if (type === 'year') { return new Array(endYear - startYear + 1).fill(0).map((o, i) => { return { text: i + startYear, value: i + startYear } }) }
        if (type === 'day') {
            let length = !year || !month ? 31 : AIODate().getMonthDaysLength({ date: [year, month] });
            if (day > length) { change({ day: 1 }) }
            return new Array(length).fill(0).map((o, i) => { return { text: i + 1, value: i + 1 } })
        }
        if (type === 'month') { return new Array(12).fill(0).map((o, i) => { return { text: i + 1, value: i + 1 } }) }
        return new Array(type === 'hour' ? 24 : 60).fill(0).map((o, i) => { return { text: i, value: i } })
    }
    function layout(type) {
        if (!value[type]) { return false }
        return {
            column: [
                { html: translate(type), align: 'vh', size: 36 },
                { html: (<AIOInput type='list' value={value[type]} options={getOptions(type)} size={48} width={72} onChange={(v) => change({ [type]: v })} />) }
            ]
        }
    }
    function submit() { props.onChange(value); props.onClose(); }
    return (
        <RVD
            layout={{
                style: { direction: 'ltr' },
                column: [
                    { align: 'h', className: 'm-b-12', row: [layout('year'), layout('month'), layout('day'), layout('hour'), layout('minute'), layout('second')] },
                    { html: <button className='ai-style-3' style={{ height: 36, fontSize: 12 }} onClick={submit}>{translate('Submit')}</button> }
                ]
            }}
        />
    )
}
function Image() {
    let { getProp } = useContext(AICTX);
    let [popup] = useState(new AIOPopup());
    let value = getProp('value', {});
    let [url, setUrl] = useState();
    let dom = createRef()
    let width = getProp('width');
    let height = getProp('height');
    let onChange = getProp('onChange');
    let disabled = getProp('disabled');
    let loading = getProp('loading');
    let placeholder = getProp('placeholder')
    let preview = getProp('preview')
    // if(typeof value === 'object'){
    //     let fr = new FileReader();
    //     fr.onload = function () {
    //         $(dom.current).attr('src',fr.result)
    //     }
    //     fr.readAsDataURL(value);
    // }
    useEffect(() => {
        if (value.file) {
            changeUrl(typeof value.file === 'object')
        }
        else if (typeof value.url === 'string') {
            if (url !== value.url) { setUrl(value.url) }
        }
        else if (value.url !== false) { setUrl(false) }//notice
    })
    function changeUrl(file, callback = () => { }) {
        try {
            let fr = new FileReader();
            fr.onload = function () {
                if (url !== fr.result) {
                    setUrl(fr.result);
                    callback(fr.result)
                }
            }
            fr.readAsDataURL(file);
        }
        catch { }
    }
    function openPopup() {
        popup.addModal({
            header: {
                title: '',
                onClose: (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    popup.removeModal();
                }
            },
            body: {
                render: () => {
                    let src = $(dom.current).attr('src')
                    return (<div className='aio-input-image-preview-popup'><img src={src} alt='' /></div>)
                }
            }
        })
    }
    let IMG = url ? (
        <>
            <img ref={dom} src={url} alt={''} style={{ objectFit: 'cover' }} width={width} height={height} />
            {typeof onChange === 'function' && <div onClick={(e) => { e.stopPropagation(); e.preventDefault(); onChange() }} className='aio-input-image-remove'><Icon path={mdiClose} size={1} /></div>}
            {preview && <div onClick={(e) => { e.stopPropagation(); e.preventDefault(); openPopup() }} className='aio-input-image-preview'><Icon path={mdiImage} size={1} /></div>}
            {popup.render()}
        </>
    ) : <span className='aio-input-image-placeholder'>{placeholder}</span>
    if (!onChange) {
        return IMG
    }
    return (
        <AIOInput
            disabled={disabled || loading}
            type='file' center={true} text={IMG} attrs={{ style: { width: '100%', height: '100%', padding: 0 } }}
            onChange={(file) => {
                changeUrl(file, (url) => {
                    onChange({ file, url })
                });
            }}
        />
    )
}
function InputSlider() {
    let { getProp, isMultiple } = useContext(AICTX)
    let onChange = getProp('onChange');
    function change(value) {
        if (isMultiple()) { onChange([...value]) }
        else { onChange(value[0]) }
    }
    let value = getProp('value'), rtl = getProp('rtl');
    if (!Array.isArray(value)) {
        if (typeof value !== 'number') { value = [] }
        else { value = [value] }
    }
    let attrs = getProp('attrs', {})
    let disabled = getProp('disabled') || getProp('loading');
    let props = {
        attrs, disabled,
        value, rtl, start: getProp('start'), end: getProp('end'), step: getProp('step'), min: getProp('min'), max: getProp('max'),
        direction: getProp('direction', rtl ? 'left' : 'right'), showValue: getProp('showValue'), onChange: !onChange ? undefined : change,
        pointStyle: getProp('pointStyle'), lineStyle: getProp('lineStyle'), fillStyle: getProp('fillStyle'), getPointHTML: getProp('getPointHTML'),
        labelStep: getProp('labelStep'), editLabel: getProp('editLabel'), editValue: getProp('editValue'), labelRotate: getProp('labelRotate'), labelStyle: getProp('labelStyle'),
        scaleStep: getProp('scaleStep'), scaleStyle: getProp('scaleStyle'), getScaleHTML: getProp('getScaleHTML'),
        valueStyle: getProp('valueStyle')
    }
    return (<Slider {...props} />)
}
function Multiselect() {
    let { getProp } = useContext(AICTX);
    let style = getProp('style', {})
    return (<div className={'aio-input-multiselect-container'} style={{ width: style.width }}><Layout /><Tags /></div>)
}
function Tags() {
    let { getProp, getOptionProp } = useContext(AICTX);
    let value = getProp('value'), rtl = getProp('rtl');
    if (!value.length || getProp('hideTags', false)) { return null }
    let options = getProp('options', [])
    return (
        <div className={`aio-input-tags${rtl ? ' rtl' : ''}`}>
            {
                value.map((o, i) => {
                    let option = options.find((option) => o === getOptionProp(option, 'value'))
                    if (option === undefined) { return null }
                    return <Tag key={i} value={o} option={option} />
                })
            }
        </div>
    )
}
function Tag({ option, value }) {
    let { getProp, getOptionProp } = useContext(AICTX);
    let onChange = getProp('onChange', () => { })
    let text = getOptionProp(option, 'text');
    let tagAttrs = getOptionProp(option, 'tagAttrs', {});
    let tagBefore = getOptionProp(option, 'tagBefore', <Icon path={mdiCircleMedium} size={0.7} />);
    let tagAfter = getOptionProp(option, 'tagAfter');
    let disabled = getOptionProp(option, 'disabled') || getProp('disabled');
    let onRemove = disabled ? undefined : () => { onChange(getProp('value').filter((o) => o !== value)) }
    return (
        <div {...tagAttrs} className={'aio-input-tag' + (tagAttrs.className ? ' ' + tagAttrs.className : '') + (disabled ? ' disabled' : '')} style={tagAttrs.style}>
            <div className='aio-input-tag-icon'>{tagBefore}</div>
            <div className='aio-input-tag-text'>{text}</div>
            {tagAfter !== undefined && <div className='aio-input-tag-icon'>{tagAfter}</div>}
            <div className='aio-input-tag-icon'><Icon path={mdiClose} size={0.7} onClick={onRemove} /></div>
        </div>
    )
}
class Input extends Component {
    static contextType = AICTX;
    constructor(props) {
        super(props);
        this.dom = createRef();
        this.container = createRef();
        this.datauniqid = `ac${Math.round(Math.random() * 100000)}`;
        this.state = { value: undefined, prevValue: undefined }
    }
    componentDidMount() {
        let { getProp, type } = this.context;
        let min = getProp('min'), max = getProp('max'), swip = getProp('swip'), value = getProp('value');
        this.setState({ value, prevValue: value })
        if (type === 'number' && swip) {
            AIOSwip({
                speedY: 0.2,
                dom: $(this.dom.current),
                start: () => this.so = this.state.value || 0,
                move: ({ dx, dy, dist }) => {
                    let newValue = -dy + this.so
                    if (min !== undefined && newValue < min) { return }
                    if (max !== undefined && newValue > max) { return }
                    this.change(newValue)
                }
            })
        }
    }
    componentDidUpdate() {
        let { getProp, type } = this.context;
        let autoHeight = getProp('autoHeight')
        if (type === 'textarea' && autoHeight) {
            let dom = this.dom.current;
            dom.style.height = 'fit-content';
            let scrollHeight = dom.scrollHeight + 'px'
            dom.style.height = scrollHeight;
            dom.style.overflow = 'hidden';
            dom.style.resize = 'none';
        }
        clearTimeout(this.rrt)
        let propsValue = getProp('value')
        if (this.state.prevValue !== propsValue) {
            this.rrt = setTimeout(() => this.setState({ value: propsValue, prevValue: propsValue }), 0)
        }
    }
    change(value, onChange) {
        let { getProp, type } = this.context;
        let blurChange = getProp('blurChange')
        let maxLength = getProp('maxLength', Infinity);
        let justNumber = getProp('justNumber');
        let delay = getProp('delay', 400);
        let filter = getProp('filter', []);
        if (type === 'number') { if (value) { value = +value; } }
        else if (type === 'text' || type === 'textarea' || type === 'password') {
            if (value) {
                if (justNumber) {
                    value = value.toString();
                    let lastChar = value[value.length - 1];
                    if (lastChar === ' ' || isNaN(+lastChar)) {
                        if (Array.isArray(justNumber)) {
                            if (justNumber.indexOf(lastChar) === -1) { value = value.slice(0, value.length - 1) }
                        }
                        else { value = value.slice(0, value.length - 1) }
                    }
                }
                if (filter.length) {
                    value = value.toString();
                    let lastChar = value[value.length - 1];
                    if (filter.indexOf(lastChar) !== -1) { value = value.slice(0, value.length - 1) }
                }
                if (value.toString().length > maxLength) {
                    value = value.toString().slice(0, maxLength);
                }
            }
        }
        this.setState({ value });
        if (!blurChange) {
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => onChange(value), delay);
        }
    }
    blur(onChange) {
        let { getProp } = this.context;
        let blurChange = getProp('blurChange')
        if (!blurChange) { return }
        onChange(this.state.value)
    }
    getInputAttrs() {
        let { getProp, showPassword, type, addToAttrs } = this.context;
        let { value = '' } = this.state;
        let disabled = getProp('disabled');
        let placeholder = getProp('placeholder');
        let onChange = getProp('onChange');
        let loading = getProp('loading');
        let inputAttrs = addToAttrs(getProp('inputAttrs'), {
            className: !getProp('spin', true) ? 'no-spin' : undefined,
            style: getProp('justify') ? { textAlign: 'center' } : undefined
        })
        let p = {
            ...inputAttrs, value, type, ref: this.dom, disabled: !!loading || disabled, placeholder,
            onChange: onChange ? (e) => this.change(e.target.value, onChange) : undefined,
            onBlur: () => this.blur(onChange)
        }
        if (type === 'color' && getProp('options')) { p = { ...p, list: this.datauniqid } }
        if (type === 'password' && showPassword) { p = { ...p, type: 'text', style: { ...p.style, textAlign: 'center' } } }
        return p;
    }
    render() {
        let { getProp, type } = this.context;
        let { value = '' } = this.state;
        let attrs = this.getInputAttrs()
        if (!attrs.onChange) { return value }
        else if (type === 'color') {
            let options = getProp('options');
            return (
                <label style={{ width: '100%', height: '100%', background: value }}>
                    <input {...attrs} style={{ opacity: 0 }} />
                    {options && <datalist id={this.datauniqid}>{options.map((o) => <option value={o} />)}</datalist>}
                </label>
            )
        }
        else if (type === 'textarea') { return <textarea {...attrs} /> }
        else { return (<input {...attrs} />) }
    }
}
class Form extends Component {
    static contextType = AICTX;
    constructor(props) {
        super(props);
        let { getProp } = props;
        this.getProp = getProp;
        let value = this.getProp('value', {})
        let onChange = this.getProp('onChange')
        this.state = { initialValue: JSON.stringify(value) }
        if (!onChange) { this.state.value = value; }
        this.errors = {}
    }
    getValue() { return this.getProp('onChange') ? this.getProp('value', {}) : this.state.value }
    getErrors() { return [...Object.keys(this.errors).filter((o) => !!this.errors[o]).map((o) => this.errors[o])] }
    removeError(field) {
        let newErrors = {}
        for (let prop in this.errors) { if (prop !== field) { newErrors[prop] = this.errors[prop] } }
        this.errors = newErrors
    }
    setValue(v, formItem) {
        let onChange = this.getProp('onChange');
        let { field } = formItem;
        let value = this.getValue();
        let newValue = this.setValueByField(value, field, v);
        let error = this.getError(formItem, v)
        if (error) { this.errors[field] = error }
        else { this.removeError(field) }
        if (onChange) { onChange(newValue, this.getErrors()) }
        else { this.setState({ value: newValue }) }
    }
    header_layout() {
        let header = this.getProp('header');
        let title = this.getProp('title');
        let subtitle = this.getProp('subtitle');
        let headerAttrs = this.getProp('headerAttrs', {});
        let onClose = this.getProp('onClose');
        let onBack = this.getProp('onBack');
        if (!header && !title && !onClose && !onBack) { return false }
        return {
            className: 'aio-input-form-header' + (headerAttrs.className ? ' ' + headerAttrs.className : ''), style: headerAttrs.style,
            row: [
                { show: !!onBack, size: 36, html: <Icon path={mdiChevronRight} size={.8} />, align: 'vh', onClick: () => onBack() },
                {
                    show: !!title, align: 'v',
                    column: [
                        { html: title, className: 'aio-input-form-title' },
                        { show: !!subtitle, html: subtitle, className: 'aio-input-form-subtitle' },
                    ]
                },
                { flex: 1, show: !!title },
                { show: !!header, flex: !!title ? undefined : 1, html: () => typeof header === 'function' ? header() : header, align: 'vh' },
                { show: !!onClose, html: <Icon path={mdiClose} size={.8} />, onClick: () => onClose(), className: 'aio-input-form-close-icon' }
            ]
        }
    }
    body_layout() {
        let inputs = this.getProp('inputs');
        if (Array.isArray(inputs)) { inputs = { column: inputs.map((o) => this.input_layout(o)) } }
        let res = { flex: 1, className: 'aio-input-form-body', ...inputs }
        return res
    }
    reset() {
        let onChange = this.getProp('onChange');
        let { initialValue } = this.state;
        if (onChange) { onChange(JSON.parse(initialValue)) }
        else { this.setState({ value: JSON.parse(initialValue) }) }
    }
    footer_layout() {
        let footer = this.getProp('footer');
        let onSubmit = this.getProp('onSubmit');
        let onClose = this.getProp('onClose');
        let footerAttrs = this.getProp('footerAttrs', {});
        let closeText = this.getProp('closeText', 'Close');
        let resetText = this.getProp('resetText', 'Reset');
        let submitText = this.getProp('submitText', 'Submit');
        let reset = this.getProp('reset');
        let { initialValue } = this.state;
        if (footer === false) { return false }
        if (!footer && !onSubmit && !onClose && !reset) { return false }
        let disabled = !!this.getErrors().length || initialValue === JSON.stringify(this.getValue())
        if (footer) {
            let html = typeof footer === 'function' ? footer({ onReset: () => this.reset(), disabled, errors: this.getErrors() }) : footer;
            let className = 'aio-input-form-footer' + (footerAttrs.className ? ' ' + footerAttrs.className : '');
            return { className, style: footerAttrs.style, html }
        }
        return {
            className: 'aio-input-form-footer' + (footerAttrs.className ? ' ' + footerAttrs.className : ''), style: footerAttrs.style,
            row: [
                { show: !!onClose, html: <button onClick={() => onClose()} className='aio-input-form-close-button aio-input-form-footer-button'>{closeText}</button> },
                { show: !!reset, html: <button onClick={() => this.reset()} className='aio-input-form-reset-button aio-input-form-footer-button'>{resetText}</button> },
                { show: !!onSubmit, html: <button disabled={disabled} onClick={() => onSubmit()} className='aio-input-form-submit-button aio-input-form-footer-button'>{submitText}</button> },
            ]
        }
    }
    getDefault({ type, multiple }) {
        return { file: [], multiselect: [], radio: multiple ? [] : undefined, slider: multiple ? [] : undefined }[type]
    }
    getValueByField(field, def) {
        let props = this.getProp('props'), value = this.getValue(), a;
        if (typeof field === 'string') {
            if (field.indexOf('value.') !== -1 /*|| field.indexOf('props.') !== -1*/) {
                try { eval(`a = ${field}`); }
                catch (err) { a = a; }
            }
            else { a = field }
        }
        else { a = field }
        return a === undefined ? def : a;
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
    inlineLabel_layout(inlineLabel, attrs) {
        if (!inlineLabel) { return false }
        let { className, style } = attrs;
        return { html: inlineLabel, align: 'v', attrs, style, className: 'aio-input-form-inline-label' + (className ? ' ' + className : '') }
    }
    label_layout(label, attrs) {
        if (!label) { return false }
        let { className, style } = attrs;
        return { html: label, attrs, style, className: 'aio-input-form-label' + (className ? ' ' + className : '') }
    }
    footer_layout(footer, attrs) {
        if (!footer) { return false }
        let { className, style } = attrs;
        return { html: footer, attrs, style, className: 'aio-input-form-item-footer' + (className ? ' ' + className : '') }
    }
    error_layout(error, attrs) {
        if (!error) { return false }
        let { className, style } = attrs;
        return { html: error, attrs, style, className: 'aio-input-form-error' + (className ? ' ' + className : '') }
    }
    componentDidMount() { this.reportErrors() }
    componentDidUpdate() { this.reportErrors() }
    reportErrors() {
        let getErrors = this.getProp('getErrors');
        if (!getErrors) { return }
        let errors = this.getErrors();
        if (JSON.stringify(errors) !== this.reportedErrors) {
            getErrors(errors);
            this.reportedErrors = JSON.stringify(errors)
        }
    }
    getAttrs(propsAttrs = {}, ownAttrs = {}) {
        let style = { ...propsAttrs.style, ...ownAttrs.style }
        return { ...propsAttrs, ...ownAttrs, style }
    }
    getInputProps(input, formItem) {
        let { addToAttrs } = this.context;
        let rtl = this.getProp('rtl');
        let disabled = this.getProp('disabled');
        let value = this.getValueByField(formItem.field, this.getDefault(input));
        let updateInput = this.getProp('updateInput', (o) => o)
        let inputStyle = this.getProp('inputStyle', {})
        let inputClassName = this.getProp('inputClassName')
        let props = { rtl, value, onChange: (value) => this.setValue(value, formItem) };
        for (let prop in input) { props[prop] = this.getValueByField(input[prop]) }
        props.value = value;
        if (input.type === 'slider' && props.showValue === undefined) { props.showValue = 'inline'; }
        let { attrs = {} } = input;
        props.attrs = {};
        for (let prop in attrs) { props.attrs[prop] = this.getValueByField(attrs[prop]) }
        props.attrs = addToAttrs(props.attrs, { style: inputStyle, stylePriority: false, className: inputClassName })
        if (disabled) { props.disabled = true; }
        if (['text', 'number', 'password', 'textarea'].indexOf(props.type) !== -1) {
            let { inputAttrs = {} } = input;
            props.inputAttrs = {};
            for (let prop in inputAttrs) { props.inputAttrs[prop] = this.getValueByField(inputAttrs[prop]) }
        }
        return updateInput(props);
    }
    input_layout(formItem) {
        let { label, footer, inlineLabel, input, flex, size, field } = formItem;
        if (label) { inlineLabel = undefined };
        let value = this.getValueByField(field, this.getDefault(input));
        let error = this.getError(formItem, value)
        if (error) { this.errors[field] = error }
        else { this.errors[field] = undefined }
        let labelAttrs = this.getAttrs(this.getProp('labelAttrs'), formItem.labelAttrs)
        let errorAttrs = this.getAttrs(this.getProp('errorAttrs'), formItem.errorAttrs)
        let footerAttrs = this.getAttrs(this.getProp('footerAttrs'), formItem.footerAttrs)
        let inputProps = this.getInputProps(input, formItem);
        return {
            flex, size, className: 'aio-input-form-item',
            column: [
                {
                    show: !!inlineLabel,
                    className: 'aio-input-form-item-body of-visible',
                    row: [
                        this.inlineLabel_layout(inlineLabel, labelAttrs),
                        { className: 'aio-input-form-item-input-container of-visible', html: <AIOInput {...inputProps} /> }
                    ]
                },
                {
                    flex: 1, className: 'aio-input-form-item-input-container of-visible',
                    column: [
                        this.label_layout(label, labelAttrs),
                        { className: 'aio-input-form-item-input-container of-visible', html: <AIOInput {...inputProps} /> },
                    ]
                },
                this.footer_layout(footer, footerAttrs),
                this.error_layout(error, errorAttrs)
            ]
        }
    }
    getError(o, value, options) {
        let lang = this.getProp('lang', 'en')
        let { validations = [], input } = o;
        let { type } = input;
        if (!validations.length || type === 'html') { return '' }
        let a = {
            value, title: o.label || o.inlineLabel, lang,
            validations: validations.map((a) => {
                let params = a[2] || {};
                let target = typeof a[1] === 'function' ? a[1] : this.getValueByField(a[1], '');
                let operator = a[0];
                return [operator, target, params]
            })
        }
        return AIOValidation(a);
    }
    render() {
        let rtl = this.getProp('rtl')
        let attrs = this.getProp('attrs', {})
        let { style, className } = attrs;
        return (
            <RVD
                getLayout={(obj, parent = {}) => {
                    let show = this.getValueByField(obj.show, true);
                    if (show === false) { return false }
                    if (obj.input) { return this.input_layout({ ...obj, flex: parent.row && !obj.size && !obj.flex ? 1 : undefined }) }
                    if (parent.input) { obj.className = 'of-visible' }
                    return { ...obj }
                }}
                layout={{
                    style, className: 'aio-input-form' + (rtl ? ' aio-input-form-rtl' : '') + (className ? ' ' + className : ''),
                    column: [this.header_layout(), this.body_layout(), this.footer_layout()]
                }}
            />
        )
    }
}
function Options(props) {
    let context = useContext(AICTX);
    let { getProp, getOptions, isInput } = context;
    let type = getProp('type');
    let [searchValue, setSearchValue] = useState('');
    function renderSearchBox(options) {
        let search = getProp('search');
        if (type === 'tabs' || isInput || search === false) { return null }
        if (type === 'radio' && !search) { return null }
        if (typeof search !== 'string') { search = 'Search' }
        if (searchValue === '' && options.length < 10) { return null }
        return (
            <div className='aio-input-search'>
                <input type='text' value={searchValue} placeholder={search} onChange={(e) => setSearchValue(e.target.value)} />
                <div className='aio-input-search-icon' onClick={() => { setSearchValue('') }}>
                    <Icon path={searchValue ? mdiClose : mdiMagnify} size={.8} />
                </div>
            </div>
        )
    }
    function getRenderOptions(options) {
        let renderIndex = 0;
        return options.map((option, i) => {
            if (searchValue) {
                if (option.text === undefined || option.text === '') { return null }
                if (option.text.indexOf(searchValue) === -1) { return null }
            }
            let p = { key: i, option, renderIndex, realIndex: i, searchValue }
            return <Layout {...p} />
        });
    }
    let options = props.options || getOptions();
    if (!options.length) { return null }
    let renderOptions = getRenderOptions(options);
    return (
        <>
            {renderSearchBox(options)}
            <div className={`aio-input-options aio-input-${type}-options`}>{renderOptions}</div>
        </>
    )
}
//column schema
//title,value,width,minWidth,justify,type,onChange,cellAttrs,subtext,before,after
const AITableContext = createContext();
class Table extends Component {
    static contextType = AICTX;
    constructor(p) {
        super(p);
        let { getProp } = p;
        this.getProp = getProp;
        this.dom = createRef();
        let Sort = new SortClass({ getProp, getState: () => this.state, setState: (obj) => this.setState(obj) })
        let columns = this.getProp('columns', []);
        let searchColumns = [];
        let updatedColumns = columns.map((o) => {
            let { id = 'aitc' + Math.round(Math.random() * 1000000), sort, search } = o;
            o._id = id;
            sort = sort === true ? {} : sort;
            let column = { ...o, sort };
            if (search) { searchColumns.push(column) }
            return column
        })
        this.state = {
            searchValue: '',
            columns: updatedColumns,
            searchColumns,
            sorts: [], Sort,
            getDynamics: ({ value, row, column, def, rowIndex }) => {
                let type = typeof value;
                if (type === 'string') {
                    let result = value;
                    let getValue = this.getProp('getValue', {});
                    if (getValue[value]) { result = getValue[value]({ row, column, rowIndex }) }
                    else if (value.indexOf('row.') !== -1) { try { eval(`result = ${value}`); } catch { result = '' } }
                    return result === undefined ? def : result;
                }
                if (type === 'undefined') { return def }
                if (type === 'function') { return value({ row, column, rowIndex }) }
                return value === undefined ? def : value
            },
            setCell: (row, column, value) => {
                if (column.input && column.input.onChange) { column.input.onChange({ value, row, column }) }
                else {
                    let rows = this.getProp('value');
                    row = JSON.parse(JSON.stringify(row));
                    eval(`${column.value} = value`);
                    this.getProp('onChange', () => { })(rows.map((o) => o._id !== row._id ? o : row))
                }
            }
        }
    }
    componentDidMount() {
        let { columns, Sort } = this.state;
        this.setState({ sorts: Sort.initiateSortsByColumns(columns) })
    }
    add() {
        let onAdd = this.getProp('onAdd'), rows = this.getProp('value');
        if (typeof onAdd === 'function') { onAdd(); }
        else if (typeof onAdd === 'object') { this.getProp('onChange', () => { })([onAdd, ...rows]) }
    }
    remove(row, index) {
        let rows = this.getProp('value'), onRemove = this.getProp('onRemove');
        if (typeof onRemove === 'function') { onRemove(row); }
        else if (onRemove === true) { this.getProp('onChange', () => { })(rows.filter((o, i) => o._id !== row._id)); }
    }
    exportToExcel() {
        let excel = this.getProp('excel'), list = [];
        let rows = this.getProp('value');
        let { getDynamics, columns } = this.state;
        for (let i = 0; i < rows.length; i++) {
            let row = rows[i], json = {};
            for (let j = 0; j < columns.length; j++) {
                let column = columns[j], { title, excel, value } = column;
                if (excel) { json[typeof excel === 'string' ? excel : title] = getDynamics({ value, row, column, rowIndex: i }) }
            }
            list.push(json)
        }
        ExportToExcel(list, { promptText: typeof excel === 'string' ? excel : 'Inter Excel File Name' })
    }
    dragStart(e, row) { this.start = row; }
    dragOver(e, row) { e.preventDefault(); }
    getIndexById(rows, id) { for (let i = 0; i < rows.length; i++) { if (rows[i]._id === id) { return i } } }
    drop(e, row) {
        if (this.start._id === undefined) { return }
        if (this.start._id === row._id) { return }
        let rows = this.getProp('value');
        let onSwap = this.getProp('onSwap');
        let newRows = rows.filter((o) => o._id !== this.start._id);
        let placeIndex = this.getIndexById(rows, row._id);
        newRows.splice(placeIndex, 0, this.start)
        if (typeof onSwap === 'function') { onSwap({ newRows, from: { ...this.start }, to: row }) }
        else { this.getProp('onChange', () => { })(newRows) }
    }
    getSearchedRows(rows) {
        let onSearch = this.getProp('onSearch');
        if (onSearch !== true) { return rows }
        let { searchColumns, searchValue, getDynamics } = this.state;
        if (!searchColumns.length || !searchValue) { return rows }
        return Search(rows, searchValue, (row, index) => {
            let str = '';
            for (let i = 0; i < searchColumns.length; i++) {
                let column = searchColumns[i];
                let value = getDynamics({ value: column.value, row, def: '', column, rowIndex: index });
                if (value) { str += value + ' ' }
            }
            return str
        })
    }
    getRows() {
        let { Sort } = this.state;
        let rows = this.getProp('value', []);
        let p = this.getProp('paging');
        let searchedRows = this.getSearchedRows(rows);
        let sortedRows = Sort.getSortedRows(searchedRows);
        let pagedRows = p && !p.serverSide ? sortedRows.slice((p.number - 1) * p.size, p.number * p.size) : sortedRows;
        return { rows, searchedRows, sortedRows, pagedRows }
    }
    //calculate style of cells and title cells
    getCellStyle({ row, rowIndex, column, type }) {
        let { getDynamics } = this.state;
        let width = getDynamics({ value: column.width });
        let minWidth = getDynamics({ value: column.minWidth });
        let style = { width: width ? width : undefined, flex: width ? undefined : 1, minWidth }
        if (type === 'cell') {
            let cellAttrs = getDynamics({ value: column.cellAttrs, column, row, rowIndex, def: {} });
            return { ...style, ...cellAttrs.style }
        }
        else if (type === 'title') {
            let titleAttrs = getDynamics({ value: column.titleAttrs, column, def: {} });
            return { ...style, ...titleAttrs.style }
        }
    }
    getTitleAttrs(column) {
        let { getDynamics } = this.state;
        let titleAttrs = getDynamics({ value: column.titleAttrs, column, def: {} });
        let justify = getDynamics({ value: column.justify, def: false });
        let className = 'aio-input-table-title' + (justify ? ' aio-input-table-title-justify' : '') + (titleAttrs.className ? ' ' + titleAttrs.className : '')
        let style = this.getCellStyle({ column, type: 'title' })
        let title = getDynamics({ value: column.title, def: '' })
        return { ...titleAttrs, style, className, title }
    }
    getCellAttrs({ row, rowIndex, column }) {
        let { getDynamics } = this.state;
        let cellAttrs = getDynamics({ value: column.cellAttrs, column, row, rowIndex, def: {} });
        let justify = getDynamics({ value: column.justify, row, rowIndex, def: false });
        let className = 'aio-input-table-cell' + (justify ? ' aio-input-table-cell-justify' : '') + (cellAttrs.className ? ' ' + cellAttrs.className : '')
        let style = this.getCellStyle({ row, rowIndex, column, type: 'cell' })
        return { ...cellAttrs, style, className }
    }
    getRowAttrs(row, rowIndex) {
        let { addToAttrs } = this.context;
        let onSwap = this.getProp('onSwap');
        let obj = addToAttrs(this.getProp('rowAttrs', () => { return {} })({ row, rowIndex }), { className: 'aio-input-table-row' })
        if (!!onSwap) { obj = { ...obj, draggable: true, onDragStart: (e) => this.dragStart(e, row), onDragOver: (e) => this.dragOver(e, row), onDrop: (e) => this.drop(e, row) } }
        return obj;
    }
    getCellContent({ row, rowIndex, column }) {
        let { getDynamics, setCell } = this.state;
        let template = getDynamics({ value: column.template, row, rowIndex, column });
        if (template !== undefined) { return template }
        let input = getDynamics({ value: column.input, row, rowIndex, column });
        if (!input) { input = { type: 'text' } }
        for (let prop in input) { input[prop] = getDynamics({ value: input[prop], row, rowIndex, column }) }
        return (
            <AIOInput
                {...input}
                value={getDynamics({ value: column.value, row, rowIndex, column })}
                onChange={column.input ? (value) => setCell(row, column, value) : undefined}
            />
        )
    }
    search(searchValue) {
        let onSearch = this.getProp('onSearch');
        if (onSearch === true) { this.setState({ searchValue }) }
        else { onSearch(searchValue) }
    }
    getContext(ROWS) {
        let rowGap = this.getProp('rowGap');
        let columnGap = this.getProp('columnGap');
        let context = {
            ROWS,
            getProp: this.getProp,
            state: { ...this.state },
            parentDom: this.dom,
            SetState: (obj) => this.setState(obj),
            getTitleAttrs: this.getTitleAttrs.bind(this),
            getCellAttrs: this.getCellAttrs.bind(this),
            getRowAttes: this.getRowAttrs.bind(this),
            getCellContent: this.getCellContent.bind(this),
            add: this.add.bind(this),
            remove: this.remove.bind(this),
            search: this.search.bind(this),
            exportToExcel: this.exportToExcel.bind(this),
            RowGap: <div className='aio-input-table-border-h' style={{ height: rowGap }}></div>,
            ColumnGap: <div className='aio-input-table-border-v' style={{ width: columnGap }}></div>,
        }
        return context
    }
    render() {
        let paging = this.getProp('paging');
        let attrs = this.getProp('attrs', {});
        let ROWS = this.getRows();
        return (
            <AITableContext.Provider value={this.getContext(ROWS)}>
                <div {...attrs} ref={this.dom} className={'aio-input-table' + (attrs.className ? ' ' + attrs.className : '')}>
                    <TableToolbar />
                    <div className='aio-input-table-unit'><TableHeader /><TableRows /></div>
                    {paging ? <TablePaging /> : ''}
                </div>
            </AITableContext.Provider>
        )
    }
}
function TablePaging() {
    let { ROWS, getProp } = useContext(AITableContext)
    function fix(paging) {
        let { number, size = 20, length = 0, sizes = [1, 5, 10, 15, 20, 30, 50, 70, 100], serverSide } = paging
        if (!serverSide) { length = ROWS.sortedRows.length }
        if (sizes.indexOf(size) === -1) { size = sizes[0] }
        let pages = Math.ceil(length / size);
        number = number > pages ? pages : number;
        number = number < 1 ? 1 : number;
        let start = number - 3;
        let end = number + 3;
        return { ...paging, length, pages, number, size, sizes, start, end }
    }
    let paging = fix(getProp('paging'))
    function changePaging(obj) { paging.onChange({ ...paging, ...obj }) }
    let { rtl, pages, number, size, sizes, start, end } = paging;
    let buttons = [];
    for (let i = start; i <= end; i++) {
        if (i < 1 || i > pages) {
            buttons.push(<button key={i} className={'aio-input-table-paging-button aio-input-table-paging-button-hidden'}>{i}</button>)
        }
        else {
            buttons.push(<button key={i} className={'aio-input-table-paging-button' + (i === number ? ' active' : '')} onClick={() => changePaging({ number: i })}>{i}</button>)
        }
    }
    return (
        <div className='aio-input-table-paging' style={{ direction: rtl ? 'rtl' : 'ltr' }}>
            {buttons}
            {
                sizes.length &&
                <AIOInput
                    attrs={{ className: 'aio-input-table-paging-button aio-input-table-paging-size' }}
                    type='select' value={size} options={sizes} optionText='option' optionValue='option'
                    onChange={(value) => changePaging({ size: value })}
                />
            }
        </div>
    )
}
function TableRows() {
    let { getProp, ROWS } = useContext(AITableContext)
    let rowTemplate = getProp('rowTemplate');
    let rowAfter = getProp('rowAfter', () => null);
    let rowBefore = getProp('rowBefore', () => null);
    function getContent() {
        let rows = ROWS.pagedRows;
        let rowsTemplate = getProp('rowsTemplate');
        if (rowsTemplate) { return rowsTemplate(rows) }
        if (rows.length) {
            return rows.map((o, i) => {
                let { id = 'ailr' + Math.round(Math.random() * 10000000) } = o;
                o._id = o._id === undefined ? id : o._id;
                let isLast = i === rows.length - 1, Row;
                if (rowTemplate) { Row = rowTemplate({ row: o, rowIndex: i, isLast }) }
                else { Row = <TableRow key={id} row={o} rowIndex={i} isLast={isLast} /> }
                return (<Fragment key={id}>{rowBefore({ row: o, rowIndex: i })}{Row}{rowAfter({ row: o, rowIndex: i })}</Fragment>)
            })
        }
        let placeholder = getProp('placeholder', 'there is not any items');
        return <div style={{ width: '100%', textAlign: 'center', padding: 12, boxSizing: 'border-box' }}>{placeholder}</div>
    }
    return <div className='aio-input-table-rows'>{getContent()}</div>
}
function TableToolbar() {
    let { add, exportToExcel, RowGap, getProp, state, search } = useContext(AITableContext);
    let toolbarAttrs = getProp('toolbarAttrs', {});
    let toolbar = getProp('toolbar');
    let onAdd = getProp('onAdd');
    let excel = getProp('excel');
    let onSearch = getProp('onSearch');
    let { sorts } = state;
    if (!onAdd && !excel && !toolbar && !onSearch && !sorts.length) { return null }
    return (
        <>
            <div {...toolbarAttrs} className={'aio-input-table-toolbar' + (toolbarAttrs.className ? ' ' + toolbarAttrs.className : '')}>
                {toolbar && <div className='aio-input-table-toolbar-content'>{typeof toolbar === 'function' ? toolbar() : toolbar}</div>}
                <div className='aio-input-table-search'>
                    {!!onSearch && <AIOInput type='text' onChange={(value) => search(value)} after={<Icon path={mdiMagnify} size={1} />} />}
                </div>
                {state.Sort.getSortButton()}
                {!!excel && <div className='aio-input-table-toolbar-icon' onClick={() => exportToExcel()}><Icon path={mdiFileExcel} size={0.8} /></div>}
                {!!onAdd && <div className='aio-input-table-toolbar-icon' onClick={() => add()}><Icon path={mdiPlusThick} size={0.8} /></div>}

            </div>
            {RowGap}
        </>
    )
}
function TableHeader() {
    let { RowGap, getProp, state } = useContext(AITableContext);
    let headerAttrs = getProp('headerAttrs', {});
    let onRemove = getProp('onRemove');
    let { columns } = state;
    let Titles = columns.map((o, i) => <TableTitle key={o._id} column={o} isLast={i === columns.length - 1} />);
    let RemoveTitle = !onRemove ? null : <button className='aio-input-table-remove'></button>;
    let className = 'aio-input-table-header' + (headerAttrs.className ? ' ' + headerAttrs.className : '');
    return (<><div {...{ ...headerAttrs, className }}>{Titles}{RemoveTitle}{RowGap}</div></>)
}
function TableTitle({ column, isLast }) {
    let { ColumnGap, getTitleAttrs } = useContext(AITableContext);
    let attrs = getTitleAttrs(column);
    return (
        <>
            <div {...attrs}>{attrs.title}</div>
            {!isLast && ColumnGap}
        </>
    )
}
function TableRow({ row, isLast, rowIndex }) {
    let { remove, RowGap, getProp, state, getRowAttes } = useContext(AITableContext);
    function getCells() {
        return state.columns.map((column, i) => {
            let key = row._id + ' ' + column._id;
            let isLast = i === state.columns.length - 1;
            return (<TableCell isLast={isLast} key={key} row={row} rowIndex={rowIndex} column={column} />)
        })
    }
    let onRemove = getProp('onRemove');
    return (
        <>
            <div key={row._id} {...getRowAttes(row, rowIndex)}>
                {getCells(row, rowIndex)}
                {onRemove ? <button className='aio-input-table-remove' onClick={() => remove(row)}><Icon path={mdiClose} size={0.8} /></button> : null}
            </div>
            {!isLast && RowGap}
        </>
    )
}
const TableCell = ({ row, rowIndex, column, isLast }) => {
    let context = useContext(AITableContext);
    let { ColumnGap, getCellAttrs, getCellContent } = context;
    let content = getCellContent({ row, rowIndex, column });
    return (
        <Fragment key={row._id + ' ' + column._id}>
            <div {...getCellAttrs({ row, rowIndex, column })} >{content}</div>
            {!isLast && ColumnGap}
        </Fragment>
    )

}
class SortClass {
    constructor({ getProp, getState, setState }) {
        this.getProp = getProp;
        this.getState = getState;
        this.setState = setState;
    }
    setSort = (sortId, changeObject) => {
        let { sorts } = this.getState();
        let newSorts = sorts.map((sort) => {
            if (sort.sortId === sortId) {
                let newSort = { ...sort, ...changeObject }
                return newSort;
            }
            return sort
        });
        this.setSorts(newSorts)
    }
    setSorts = async (sorts) => {
        let onChangeSort = this.getProp('onChangeSort');
        if (onChangeSort) {
            let res = await onChangeSort(sorts)
            if (res !== false) { this.setState({ sorts }); }
        }
        else {
            this.setState({ sorts });
            let activeSorts = sorts.filter((sort) => sort.active !== false);
            if (activeSorts.length) {
                let rows = this.getProp('value');
                this.getProp('onChange', () => { })(this.sort(rows, activeSorts))
            }
        }
    }
    getSortedRows = (rows) => {
        if (this.initialSort) { return rows }
        let onChangeSort = this.getProp('onChangeSort');
        let { sorts } = this.getState();
        if (onChangeSort) { return rows }
        let activeSorts = sorts.filter((sort) => sort.active !== false);
        if (!activeSorts.length) { return rows }
        if (rows.length) { this.initialSort = true; this.getProp('onChange', () => { })(this.sort(rows, activeSorts)) }
        else { return rows; }
    }
    sort = (rows = [], sorts = []) => {
        if (!sorts.length) { return rows }
        return rows.sort((a, b) => {
            for (let i = 0; i < sorts.length; i++) {
                let { dir, getValue } = sorts[i];
                let aValue = getValue(a), bValue = getValue(b);
                if (aValue < bValue) { return -1 * (dir === 'dec' ? -1 : 1); }
                if (aValue > bValue) { return 1 * (dir === 'dec' ? -1 : 1); }
                if (i === sorts.length - 1) { return 0; }
            }
            return 0;
        });
    }
    initiateSortsByColumns = (columns) => {
        let { getDynamics } = this.getState();
        let sorts = [];
        for (let i = 0; i < columns.length; i++) {
            let column = columns[i];
            let { sort, _id, type } = column;
            if (!sort) { continue }
            let { active = true, dir = 'dec' } = sort;
            let getValue = (row) => {
                let value = getDynamics({ value: column.value, row, column })
                if (type === 'datepicker') { value = AIODate().getTime(value); }
                return value
            }
            sorts.push({ dir, title: sort.title || column.title, sortId: _id, active, type, getValue })
        }
        return sorts;
    }
    getSortOption = (sort) => {
        let { active, dir = 'dec', title, sortId } = sort;
        return {
            text: title, checked: !!active, close: false, value: sortId,
            after: (
                <Icon
                    path={dir === 'dec' ? mdiArrowDown : mdiArrowUp} size={0.8}
                    onClick={(e) => { e.stopPropagation(); this.setSort(sortId, { dir: dir === 'dec' ? 'inc' : 'dec' }) }}
                />
            )
        }
    }
    getSortButton() {
        let { sorts } = this.getState();
        if (!sorts.length) { return null }
        let sortOptions = sorts.map((sort) => this.getSortOption(sort));
        return (
            <AIOInput
                popover={{ header: { attrs: { className: 'aio-input-table-toolbar-popover-header' }, title: 'Sort', onClose: false }, pageSelector: '.aio-input-table' }}
                key='sortbutton' caret={false} type='select' options={sortOptions}
                attrs={{ className: 'aio-input-table-toolbar-icon' }}
                text={<Icon path={mdiSort} size={0.7} />}
                onSwap={(from, to, swap) => this.setSorts(swap(sorts, from, to))}
                onChange={(value, option) => {
                    this.setSort(value, { active: !option.checked })
                }}
            />
        )
    }
}
class Layout extends Component {
    static contextType = AICTX;
    constructor(p) {
        super(p);
        this.dom = createRef()
    }
    getClassName(label) {
        let { getProp, getOptionProp, datauniqid, isInput, isMultiple } = this.context;
        let { option } = this.props;
        let cls;
        let attrs;
        if (option !== undefined) {
            cls = `aio-input-option aio-input-${this.type}-option`
            if (isMultiple()) { cls += ` aio-input-${this.type}-multiple-option` }
            if (getProp('isDropdown')) { cls += ` aio-input-dropdown-option` }
            if (getOptionProp(option, 'disabled')) { cls += ' disabled' }
            attrs = getOptionProp(option, 'attrs')
        }
        else {
            cls = `aio-input aio-input-${this.type}`;
            if (this.type === 'slider') {
                let direction = getProp('direction', 'right')
                if (direction === 'left' || direction === 'right') { cls += ' aio-input-slider-horizontal' }
                else { cls += ' aio-input-slider-vertical' }
            }
            if (getProp('disabled') || getProp('loading')) { cls += ' disabled' }
            if (isInput) { cls += ` aio-input-input` }
            attrs = getProp('attrs');
            let rtl = getProp('rtl');
            if (rtl) { cls += ' aio-input-rtl' }

        }
        cls += ' ' + datauniqid;
        cls += label ? ' has-label' : '';
        cls += attrs && attrs.className ? ' ' + attrs.className : '';
        return cls;
    }
    getProps() {
        let { dragStart, dragOver, drop, click, optionClick, open, getProp } = this.context;
        let { option, realIndex, renderIndex } = this.props;
        let { label, center, loading, attrs = {}, disabled } = this.properties;
        let zIndex;
        if (open && !option && ['text', 'number', 'textarea'].indexOf(this.type) !== -1) {
            zIndex = 100000
        }
        let onClick;
        //ممکنه این یک آپشن باشه باید دیزیبل پرنتش هم چک بشه تا دیزیبل بشه
        if (option) { disabled = disabled || loading || !!getProp('disabled') || !!getProp('loading') }
        if (!disabled && !loading) {
            if (option === undefined) {onClick = (e) => { e.stopPropagation(); click(e, this.dom) }}
            else {onClick = (e) => { e.stopPropagation(); optionClick(option) }}
        }
        let p = {
            ...attrs, className: this.getClassName(label), onClick, ref: this.dom, disabled, 'data-label': label,
            style: { justifyContent: center ? 'center' : undefined, ...attrs.style, zIndex }
        }
        if (option && getProp('onSwap')) {
            p.datarealindex = realIndex;
            p.datarenderindex = renderIndex;
            p.onDragStart = dragStart;
            p.onDragOver = dragOver;
            p.onDrop = drop;
            p.draggable = true;
        }
        return p;
    }
    getDefaultChecked() {
        let { getProp } = this.context;
        if (this.type === 'checkbox') { return !!getProp('value') }
    }
    getProperties() {
        let { option, text } = this.props;
        if (!option) {
            let { getProp } = this.context;
            let properties = {
                label: getProp('label'),
                tabIndex: getProp('tabIndex'),
                attrs: getProp('attrs', {}),
                caret: getProp('caret'),
                justify: getProp('justify'),
                text: text !== undefined ? text : getProp('text'),
                checkIcon: getProp('checkIcon', [], undefined, true),
                disabled: getProp('disabled'),
                checked: getProp('checked', this.getDefaultChecked()),
                before: getProp('before'),
                placeholder: getProp('placeholder'),
                after: getProp('after'),
                subtext: getProp('subtext'),
                center: getProp('center'),
                loading: getProp('loading')
            }
            return properties
        }
        return option
    }
    getItemClassName(key) {
        let { option } = this.props,className = `aio-input-${key}`;
        if (option) {className += ` aio-input-${this.type}-option-${key}`}
        else {className += ` aio-input-${this.type}-${key}`}
        return className;
    }
    text_layout(text, subtext, placeholder, center, justify) {
        if (text === undefined && placeholder !== undefined) { text = <div className='aio-input-placeholder'>{placeholder}</div> }
        if (text) {
            if (subtext) {
                return (
                    <div className={`aio-input-content aio-input-${this.type}-content${center ? ' aio-input-content-center' : ''}`}>
                        <div style={{ textAlign: justify ? 'center' : undefined }} className={`${this.getItemClassName('value')}${center ? ' aio-input-value-center' : ''}`}>{text}</div>
                        <div style={{ textAlign: justify ? 'center' : undefined }} className={`${this.getItemClassName('subtext')}${center ? ' aio-input-value-center' : ''}`}>{subtext}</div>
                    </div>
                )
            }
            else {
                return (
                    <div
                        style={{ textAlign: justify ? 'center' : undefined }}
                        className={`${this.getItemClassName('value')}${center ? ' aio-input-value-center' : ''}`}
                    >{text}</div>
                )
            }
        }
        else { return <div className='flex-1'></div> }
    }
    render() {
        let { type } = this.context;
        this.type = type;
        let { option } = this.props;
        this.properties = this.getProperties()
        let { checked, checkIcon, before, text, subtext, after, caret, center, placeholder, loading, justify } = this.properties;
        let content = (
            <>
                <CheckIcon {...{ checked, checkIcon, type: this.type, option }} />
                {before !== undefined && <div className={this.getItemClassName('before')}>{before}</div>}
                {this.text_layout(text, subtext, placeholder, center, justify)}
                {after !== undefined && <div className={this.getItemClassName('after')}>{after}</div>}
                {loading && <div className={this.getItemClassName('loading')}>{loading === true ? <Icon path={mdiLoading} spin={0.3} size={.8} /> : loading}</div>}
                {caret && <div className='aio-input-caret'>{caret === true ? <Icon path={mdiChevronDown} size={.8} /> : caret}</div>}
            </>
        )
        let props = this.getProps();
        if (this.type === 'file') { return (<label {...props}>{content}<InputFile /></label>) }
        return (<div {...props}>{content}</div>)
    }
}
class CheckIcon extends Component {
    static contextType = AICTX;
    render() {
        let { gap } = this.context;
        let { checked, checkIcon = [] } = this.props;
        if (checked === undefined) { return null }
        if (typeof checkIcon === 'function') { return checkIcon(checked) }
        return (
            <div className={'aio-input-check-out' + (checked ? ' checked' : '')} style={{ ...checkIcon, background: 'none' }}>
                {checked && <div className={'aio-input-check-in'} style={{ background: checkIcon.background }}></div>}
            </div>
        );
    }
}
function File() {return (<div className='aio-input-file-container'><Layout /><FileItems /></div>)}
export class InputFile extends Component {
    static contextType = AICTX;
    change(e) {
        let { getProp, isMultiple } = this.context;
        let value = getProp('value', []);
        let onChange = getProp('onChange', () => { });
        let Files = e.target.files;
        let result;
        if (isMultiple()) {
            result = [...value];
            let names = result.map(({ name }) => name);
            for (let i = 0; i < Files.length; i++) {
                let file = Files[i];
                if (names.indexOf(file.name) !== -1) { continue }
                result.push({ name: file.name, size: file.size, file })
            }
        }
        else {result = Files.length ? Files[0] : undefined}
        onChange(result)
    }
    render() {
        let { getProp, isMultiple } = this.context;
        let multiple = isMultiple();
        let loading = getProp('loading');
        let disabled = getProp('disabled');
        let props = { disabled: disabled || loading, type: 'file', style: { display: 'none' }, multiple, onChange: (e) => this.change(e) }
        return <input {...props} />
    }
}
export class FileItems extends Component {
    static contextType = AICTX;
    render() {
        let { getProp } = this.context;
        let value = getProp('value'), rtl = getProp('rtl');
        let files = [];
        if (Array.isArray(value)) { files = value }
        else if (value) { files = [value] }
        else { return null }
        if (!files.length) { return null }
        return (
            <div className='aio-input-files' style={{ direction: rtl ? 'rtl' : 'ltr' }}>{files.map((file, i) => <FileItem key={i} file={file} index={i} />)}</div>
        )
    }
}
class FileItem extends Component {
    static contextType = AICTX;
    getFile(file) {
        let filename = file.name || 'untitle';
        let fileSize = file.size || 0;
        let nameLength = 20;
        try {
            let minName, sizeString;
            let lastDotIndex = filename.lastIndexOf('.');
            let name = filename.slice(0, lastDotIndex);
            let format = filename.slice(lastDotIndex + 1, filename.length);
            if (name.length > nameLength) {
                minName = name.slice(0, parseInt(nameLength / 2)) + '...' + name.slice(name.length - parseInt(nameLength / 2), name.length) + '.' + format;
            }
            else { minName = filename; }
            let size = fileSize;
            if (!size) { return { minName, sizeString: false } }
            let gb = size / (1024 * 1024 * 1024), mb = size / (1024 * 1024), kb = size / 1024;
            if (gb >= 1) { sizeString = gb.toFixed(2) + ' GB'; }
            else if (mb >= 1) { sizeString = mb.toFixed(2) + ' MB'; }
            else if (kb >= 1) { sizeString = kb.toFixed(2) + ' KB'; }
            else { sizeString = size + ' byte' }
            return { minName, sizeString }
        }
        catch {return { minName: 'untitle', sizeString: false }}
    }
    remove(index) {
        let { getProp } = this.context;
        let onChange = getProp('onChange', () => { });
        let value = getProp('value', [])
        let newValue = [];
        for (let i = 0; i < value.length; i++) {
            if (i === index) { continue }
            newValue.push(value[i])
        }
        onChange(newValue);
    }
    renderString(minName, sizeString) {
        let size;
        if (sizeString === false) { size = '' }
        else { size = ` ( ${sizeString})` }
        return `${minName}${size}`
    }
    render() {
        let { file, index } = this.props;
        let { minName, sizeString } = this.getFile(file);
        let { url, name } = file;
        return (
            <div className='aio-input-file' style={{ cursor: url ? 'pointer' : 'default' }}>
                <div className='aio-input-file-icon'>
                    <Icon path={url ? mdiDownloadOutline : mdiAttachment} size={.8} />
                </div>
                <div className='aio-input-file-name' onClick={() => {
                    if (url) { DownloadUrl(url, name) }
                }}>
                    {this.renderString(minName, sizeString)}
                </div>
                <div className='aio-input-file-icon' onClick={() => this.remove(index)}>
                    <Icon path={mdiClose} size={.7} />
                </div>
            </div>
        )
    }
}
const DPContext = createContext();
class DatePicker extends Component {
    static contextType = AICTX;
    render() {
        let { getProp } = this.context, { onClose } = this.props
        return (<Calendar getProp={getProp} onClose={onClose} />)
    }
}
class Calendar extends Component {
    constructor(props) {
        super(props);
        let { getProp } = props;
        let calendarType = getProp('calendarType', 'gregorian');
        let value = getProp('value')
        let { getToday, convertToArray, getMonths, getWeekDay } = AIODate();
        let today = getToday({ calendarType });
        if (!value) { value = today }
        let [year, month, day] = convertToArray({ date: value })
        let months = getMonths({ calendarType });
        this.state = {
            activeDate: { year, month, day }, years: this.getYears(), today,
            todayWeekDay: getWeekDay({ date: today }).weekDay,
            months, thisMonthString: months[today[1] - 1],
        }
    }
    translate(text) {
        let { getProp, translate = (text) => text } = this.props;
        let calendarType = getProp('calendarType', 'gregorian');
        let unit = getProp('unit', 'day');
        if (text === 'Today') {
            if (unit === 'month') { text = 'This Month' }
            else if (unit === 'hour') { text = 'This Hour' }
        }
        let obj = { 'Clear': 'حذف', 'This Hour': 'ساعت کنونی', 'Today': 'امروز', 'This Month': 'ماه جاری', }
        let res = text;
        if (calendarType === 'jalali' && obj[text]) { res = obj[text] }
        return translate(res)
    }
    changeActiveDate(obj) {
        let newActiveDate;
        if (obj === 'today') {
            let { today } = this.state;
            let { getProp } = this.props;
            let unit = getProp('unit', 'day');
            let [year, month, day] = today;
            newActiveDate = { year, month, day: unit === 'month' ? 1 : day };
        }
        else { newActiveDate = { ...this.state.activeDate, ...obj } }
        this.setState({ activeDate: newActiveDate })
    }
    getYears() {
        let start, end;
        let { getProp } = this.props;
        let calendarType = getProp('calendarType', 'gregorian');
        let startYear = getProp('startYear', '-20');
        let endYear = getProp('endYear', '+10');
        let today = AIODate().getToday({ calendarType });
        if (typeof startYear === 'string' && startYear.indexOf('-') === 0) {
            start = today[0] - parseInt(startYear.slice(1, startYear.length));
        }
        else { start = parseInt(startYear); }
        if (typeof endYear === 'string' && endYear.indexOf('+') === 0) {
            end = today[0] + parseInt(endYear.slice(1, endYear.length));
        }
        else { end = parseInt(endYear); }
        let years = [];
        for (var i = start; i <= end; i++) { years.push(i); }
        return years;
    }
    getPopupStyle() {
        let { getProp } = this.props;
        let disabled = getProp('disabled');
        let size = getProp('size', 180);
        let theme = getProp('theme', [])
        return {
            width: size, fontSize: size / 17, background: theme[1], color: theme[0], stroke: theme[0],
            cursor: disabled === true ? 'not-allowed' : undefined,
        };
    }
    getContext() {
        let { getProp } = this.props;
        return {
            ...this.state,
            getProp,
            changeActiveDate: this.changeActiveDate.bind(this),
            translate: this.translate.bind(this),
            SetState: (obj) => this.setState(obj),
            onChange: ({ year, month, day, hour }) => {
                let { getProp, onClose } = this.props;
                let calendarType = getProp('calendarType', 'gregorian');
                let unit = getProp('unit', 'day');
                let onChange = getProp('onChange', () => { });
                let close = getProp('close');
                let value = getProp('value')

                let { months } = this.state;
                let dateArray = [year, month, day, hour];
                let jalaliDateArray = calendarType === 'gregorian' ? AIODate().toJalali({ date: dateArray }) : dateArray;
                let gregorianDateArray = calendarType === 'jalali' ? AIODate().toGregorian({ date: dateArray }) : dateArray;
                let { weekDay, index: weekDayIndex } = unit === 'month' ? { weekDay: null, index: null } : AIODate().getWeekDay({ date: dateArray })
                let get2digit = (v) => {
                    if (v === undefined) { return }
                    v = v.toString();
                    return v.length === 1 ? `0${v}` : v
                }
                let dateString;
                let splitter = typeof value === 'string' ? AIODate().getSplitter(value) : '/';
                if (unit === 'month') { dateString = `${year}${splitter}${get2digit(month)}` }
                else if (unit === 'day') { dateString = `${year}${splitter}${get2digit(month)}${splitter}${get2digit(day)}` }
                else if (unit === 'hour') { dateString = `${year}${splitter}${get2digit(month)}${splitter}${get2digit(day)}${splitter}${get2digit(hour)}` }
                let monthString = months[month - 1];
                let jalaliMonthString = calendarType === 'gregorian' ? AIODate().getMonths({ calendarType: 'jalali' })[month - 1] : monthString;
                let gregorianMonthString = calendarType === 'jalali' ? AIODate().getMonths({ calendarType: 'gregorian' })[month - 1] : monthString;
                let props = {
                    months, jalaliDateArray, gregorianDateArray, dateArray, weekDay, weekDayIndex, dateString,
                    year, month, day, hour, monthString, jalaliMonthString, gregorianMonthString,
                }
                onChange(dateString, props);
                if (close) { onClose() }
            }
        }
    }
    render() {
        return (
            <DPContext.Provider value={this.getContext()}>
                <div className='aio-input-datepicker-container' style={{ display: 'flex' }}>
                    <div className='aio-input-datepicker-calendar' style={this.getPopupStyle()}>
                        <DPHeader /><DPBody /><DPFooter />
                    </div>
                    <DPToday />
                </div>
            </DPContext.Provider>
        );
    }
}
class DPToday extends Component {
    static contextType = DPContext;
    render() {
        let { getProp, translate, today, todayWeekDay, thisMonthString } = this.context;
        let theme = getProp('theme', [])
        let calendarType = getProp('calendarType', 'gregorian');
        let unit = getProp('unit', 'day');
        let size = getProp('size', 180);
        return (
            <div className='aio-input-datepicker-today' style={{ width: size / 2, color: theme[1], background: theme[0] }}>
                <div style={{ fontSize: size / 13 }}>{translate('Today')}</div>
                {
                    (unit === 'day' || unit === 'hour') &&
                    <>
                        <div style={{ fontSize: size / 11 }}>{calendarType === 'gregorian' ? todayWeekDay.slice(0, 3) : todayWeekDay}</div>
                        <div style={{ fontSize: size / 12 * 4, height: size / 12 * 4 }}>{today[2]}</div>
                        <div style={{ fontSize: size / 11 }}>{calendarType === 'gregorian' ? thisMonthString.slice(0, 3) : thisMonthString}</div>
                    </>
                }
                {unit === 'month' && <div style={{ fontSize: size / 8 }}>{calendarType === 'gregorian' ? thisMonthString.slice(0, 3) : thisMonthString}</div>}
                <div style={{ fontSize: size / 11 }}>{today[0]}</div>
                {unit === 'hour' && <div style={{ fontSize: size / 10 }}>{today[3] + ':00'}</div>}
            </div>
        )
    }
}
class DPFooter extends Component {
    static contextType = DPContext;
    render() {
        let { getProp, changeActiveDate, translate } = this.context;
        let remove = getProp('remove'),disabled = getProp('disabled'),onChange = getProp('onChange', () => { })
        let size = getProp('size', 180);
        if (disabled) { return null }
        let buttonStyle = { padding: `${size / 20}px 0` };
        return (
            <div className='aio-input-datepicker-footer' style={{ fontSize: size / 13 }}>
                {remove && <button style={buttonStyle} onClick={() => onChange(false)}>{translate('Clear')}</button>}
                <button style={buttonStyle} onClick={() => changeActiveDate('today')}>{translate('Today')}</button>
            </div>
        )
    }
}
class DPBody extends Component {
    static contextType = DPContext;
    getStyle() {
        let { getProp } = this.context;
        let size = getProp('size', 180),calendarType = getProp('calendarType', 'gregorian'),unit = getProp('unit', 'day');
        var columnCount = { hour: 4, day: 7, month: 3 }[unit];
        var rowCount = { hour: 6, day: 7, month: 4 }[unit];
        var padding = size / 18, fontSize = size / 15,a = (size - padding * 2) / columnCount;
        var rowHeight = { hour: size / 7, day: a, month: size / 6, year: size / 7 }[unit];
        var gridTemplateColumns = '', gridTemplateRows = '';
        for (let i = 1; i <= columnCount; i++) {gridTemplateColumns += a + 'px' + (i !== columnCount ? ' ' : '')}
        for (let i = 1; i <= rowCount; i++) {gridTemplateRows += (rowHeight) + 'px' + (i !== rowCount ? ' ' : '')}
        let direction = calendarType === 'gregorian' ? 'ltr' : 'rtl';
        return { gridTemplateColumns, gridTemplateRows, direction, padding, fontSize }
    }
    render() {
        let { getProp, activeDate } = this.context;
        let unit = getProp('unit', 'day');
        return (
            <div className='aio-input-datepicker-body' style={this.getStyle()}>
                {unit === 'hour' && new Array(24).fill(0).map((o, i) => <DPCell key={'cell' + i} dateArray={[activeDate.year, activeDate.month, activeDate.day, i]} />)}
                {unit === 'day' && <DPBodyDay />}
                {unit === 'month' && new Array(12).fill(0).map((o, i) => <DPCell key={'cell' + i} dateArray={[activeDate.year, i + 1]} />)}
            </div>
        )
    }
}
class DPBodyDay extends Component {
    static contextType = DPContext;
    render() {
        let { getProp, activeDate } = this.context;
        let theme = getProp('theme', [])
        let calendarType = getProp('calendarType', 'gregorian');
        let firstDayWeekDayIndex = AIODate().getWeekDay({ date: [activeDate.year, activeDate.month, 1] }).index;
        var daysLength = AIODate().getMonthDaysLength({ date: [activeDate.year, activeDate.month] });
        let weekDays = AIODate().getWeekDays({ calendarType });
        return (<>
            {weekDays.map((weekDay, i) => <DPCell_Weekday key={'weekday' + i} weekDay={weekDay} />)}
            {new Array(firstDayWeekDayIndex).fill(0).map((o, i) => <div key={'space' + i} className='aio-input-datepicker-space aio-input-datepicker-cell' style={{ background: theme[1] }}></div>)}
            {new Array(daysLength).fill(0).map((o, i) => <DPCell key={'cell' + i} dateArray={[activeDate.year, activeDate.month, i + 1]} />)}
            {new Array(42 - (firstDayWeekDayIndex + daysLength)).fill(0).map((o, i) => <div key={'endspace' + i} className='aio-input-datepicker-space aio-input-datepicker-cell' style={{ background: theme[1] }}></div>)}
        </>)
    }
}
class DPCell_Weekday extends Component {
    static contextType = DPContext;
    render() {
        let { getProp, translate } = this.context;
        let theme = getProp('theme', [])
        let calendarType = getProp('calendarType', 'gregorian');
        let { weekDay } = this.props;
        return (
            <div className='aio-input-datepicker-weekday aio-input-datepicker-cell' style={{ background: theme[1], color: theme[0] }}>
                <span>{translate(weekDay.slice(0, calendarType === 'gregorian' ? 2 : 1))}</span>
            </div>
        )
    }
}
class DPCell extends Component {
    static contextType = DPContext;
    getClassName(isActive, isToday, isDisabled, className) {
        var str = 'aio-input-datepicker-cell';
        if (isDisabled) { str += ' aio-input-datepicker-disabled' }
        if (isActive) { str += ' aio-input-datepicker-active'; }
        if (isToday) { str += ' today'; }
        if (className) { str += ' className'; }
        return str;
    }
    render() {
        let { getProp, translate } = this.context;
        let disabled = getProp('disabled')
        let dateAttrs = getProp('dateAttrs')
        let theme = getProp('theme', [])
        let onChange = getProp('onChange', () => { })
        let value = getProp('value');
        let calendarType = getProp('calendarType', 'gregorian');
        let unit = getProp('unit', 'day');
        let { dateArray } = this.props;
        let { isEqual, isMatch, getMonths, getToday } = AIODate();
        let isActive = !value ? false : AIODate().isEqual(dateArray, value);
        let isToday = isEqual(dateArray, getToday({ calendarType }))
        let dateDisabled = getProp('dateDisabled');
        let isDateDisabled = !dateDisabled ? false : isMatch({ date: dateArray, matchers: dateDisabled });
        let isDisabled = disabled || isDateDisabled;
        let Attrs = {}
        if (dateAttrs) { Attrs = dateAttrs({ dateArray, isToday, isDisabled, isActive, isMatch: (o) => isMatch({ date: dateArray, matchers: o }) }) || {} }
        let className = this.getClassName(isActive, isToday, isDisabled, Attrs.className);
        let onClick = isDisabled ? undefined : () => { onChange({ year: dateArray[0], month: dateArray[1], day: dateArray[2], hour: dateArray[3] }, true) };
        let style = {}
        if (!isDisabled) { style.background = theme[1]; }
        if (className.indexOf('aio-input-datepicker-active') !== -1) {
            style.background = theme[0];
            style.color = theme[1];
        }
        if (className.indexOf('today') !== -1) { style.border = `1px solid ${theme[0]}` }
        style = { ...style, ...Attrs.style }
        let text;
        if (unit === 'hour') { text = dateArray[3] + ':00' }
        else if (unit === 'day') { text = dateArray[2] }
        else if (unit === 'month') {
            let months = getMonths({ calendarType });
            text = translate(calendarType === 'gregorian' ? months[dateArray[1] - 1].slice(0, 3) : months[dateArray[1] - 1])
        }
        return <div style={style} onClick={onClick} className={className}>{isDisabled ? <del>{text}</del> : text}</div>
    }
}
class DPHeader extends Component {
    static contextType = DPContext;
    getYears() {
        let { activeDate, years, changeActiveDate } = this.context;
        let props = {
            value: activeDate.year, options: years.map((y) => { return { text: y.toString(), value: y } }),
            onChange: (year) => { changeActiveDate({ year }) }
        }
        return (<DPHeaderDropdown {...props} />)
    }
    getMonths() {
        let { getProp, activeDate, changeActiveDate, months, translate } = this.context;
        let calendarType = getProp('calendarType', 'gregorian');
        let props = {
            value: activeDate.month, onChange: (month) => { changeActiveDate({ month }) },
            options: months.map((o, i) => { return { value: i + 1, text: translate(calendarType === 'gregorian' ? o.slice(0, 3) : o) } })
        }
        return (<DPHeaderDropdown {...props} />)
    }
    getDays() {
        let { activeDate, changeActiveDate } = this.context;
        let daysLength = AIODate().getMonthDaysLength({ date: [activeDate.year, activeDate.month] });
        let options = new Array(daysLength).fill(0).map((o, i) => { return { text: (i + 1).toString(), value: i + 1 } })
        let props = { value: activeDate.day, options, onChange: (day) => changeActiveDate({ day }) }
        return (<DPHeaderDropdown {...props} />)
    }
    render() {
        let { getProp } = this.context;
        let size = getProp('size', 180)
        let unit = getProp('unit', 'day');
        return (
            <div className='aio-input-datepicker-header' style={{ height: size / 4 }}>
                <DPArrow type='minus' />
                <div className='aio-input-datepicker-select' style={{ fontSize: Math.floor(size / 12) }}>
                    {this.getYears()}
                    {unit !== 'month' ? this.getMonths() : null}
                    {unit === 'hour' ? this.getDays() : null}
                </div>
                <DPArrow type='plus' />
            </div>
        )
    }
}
class DPHeaderDropdown extends Component {
    static contextType = DPContext;
    render() {
        //این شرط فقط در حالت سال رخ میدهد در شرایطی که فقط یک سال قابل انتخاب است
        let { value, options, onChange } = this.props;
        if (this.props.options.length === 1) { return this.props.options[0] }
        let { getProp } = this.context;
        let size = getProp('size', 180)
        let theme = getProp('theme', [])
        let props = {
            value, options, onChange, search: false,caret: false, type: 'select',
            attrs: {className: 'aio-input-datepicker-dropdown'},
            optionAttrs: {style: { height: size / 6, background: theme[1], color: theme[0] }}
        }
        return (<AIOInput {...props} />)
    }
}
class DPArrow extends Component {
    static contextType = DPContext;
    change() {
        let { getProp, years, changeActiveDate, activeDate } = this.context;
        let calendarType = getProp('calendarType', 'gregorian');
        let unit = getProp('unit', 'day');
        let { type } = this.props;
        let offset = (calendarType === 'gregorian' ? 1 : -1) * (type === 'minus' ? -1 : 1);
        let date = [activeDate.year, activeDate.month, activeDate.day]
        let next = AIODate().getByOffset({ date, offset, unit: { 'hour': 'day', 'day': 'month', 'month': 'year' }[unit] })
        if (next[0] > years[years.length - 1] || next[0] < years[0]) { return }
        if (unit === 'month') { changeActiveDate({ year: next[0] }) }
        if (unit === 'day') { changeActiveDate({ year: next[0], month: next[1] }) }
        if (unit === 'hour') { changeActiveDate({ year: next[0], month: next[1], day: next[2] }) }
    }
    getIcon() {
        let { getProp } = this.context, { type } = this.props;
        let theme = getProp('theme', [])
        return <Icon path={type === 'minus' ? mdiChevronLeft : mdiChevronRight} size={1} style={{ color: theme[0] }} />
    }
    render() {
        let { size } = this.context;
        return (<div className='aio-input-datepicker-arrow' style={{ width: size / 6, height: size / 6 }} onClick={() => this.change()}>{this.getIcon()}</div>)
    }
}
const SliderContext = createContext();
export class Slider extends Component {
    constructor(props) {
        super(props);
        var { direction } = this.props;
        this.touch = 'ontouchstart' in document.documentElement;
        if (direction === 'left') {
            this.getDiff = function (x, y, client) { return x - client.x; }; this.oriention = 'horizontal';
        }
        else if (direction === 'right') {
            this.getDiff = function (x, y, client) { return client.x - x; }; this.oriention = 'horizontal';
        }
        else if (direction === 'top') {
            this.getDiff = function (x, y, client) { return y - client.y; }; this.oriention = 'vertical'; this.flexDirection = 'column-reverse';
        }
        else {
            this.getDiff = function (x, y, client) { return client.y - y; }; this.oriention = 'vertical'; this.flexDirection = 'column';
        }
        this.dom = createRef();
        this.state = {
            isDown: false,
        }
    }
    getClient(e) { return this.touch ? { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY } : { x: e.clientX, y: e.clientY } }
    getPercentByValue(value, start, end) { return 100 * (value - start) / (end - start); } //getPercentByValue
    fix(number) {
        let dotPos = this.props.step.toString().indexOf('.');
        let a = dotPos === -1 ? 0 : this.props.step.toString().length - dotPos - 1;
        return parseFloat((number).toFixed(a));
    }
    getStartByStep(start, step) {
        var a = Math.round((start - step) / step) * step;
        while (a < start) { a += step; } return a;
    }
    eventHandler(selector, event, action, type = 'bind') {
        var me = { mousedown: "touchstart", mousemove: "touchmove", mouseup: "touchend" };
        event = this.touch ? me[event] : event;
        var element = typeof selector === "string" ? (selector === "window" ? $(window) : $(selector)) : selector;
        element.unbind(event, action);
        if (type === 'bind') { element.bind(event, action) }
    }
    getValidValue() {
        let { value = [], start, end, min = start, max = end, step } = this.props;
        if (!Array.isArray(value) || !value.length) { value = [0] }
        for (var i = 0; i < value.length; i++) {
            var point = value[i];
            point = Math.round((point - start) / step) * step + start;
            if (point < min) { point = min; }
            if (point > max) { point = max; }
            value[i] = point;
        }
        return value
    }
    getOffset(x, y, size, e) {
        var { start, end, step } = this.props, client = this.getClient(e);
        return Math.round((end - start) * this.getDiff(x, y, client) / size / step) * step;
    }
    getValue(value, param = this.props) { return typeof value === 'function' ? value(param) : value; }
    getPercents() {
        var { start, end } = this.props;
        var percents = this.value.map((o, i) => [
            this.getPercentByValue(i ? this.value[i - 1] : start, start, end),
            this.getPercentByValue(o, start, end)
        ]);
        percents.push([percents[percents.length - 1][1], 100])
        return percents;
    }
    decreaseAll(step = this.props.step) {
        var start = this.props.start;
        var { min = start } = this.props;
        var offset = Math.min(step, this.value[0] - this.getValue(min));
        for (var i = 0; i < this.value.length; i++) {
            this.value[i] -= offset;
            this.value[i] = this.fix(this.value[i])
        }
        this.moved = true;
    }
    increaseAll(step = this.props.step) {
        var end = this.props.end;
        var { max = end } = this.props;
        var offset = Math.min(step, this.getValue(max) - this.value[this.value.length - 1]);
        for (var i = 0; i < this.value.length; i++) {
            this.value[i] += offset;
            this.value[i] = this.fix(this.value[i])
        }
        this.moved = true;
    }
    mouseDown(e, index, type) {
        e.preventDefault();
        var { start, end, min = start, max = end, onChange, disabled } = this.props;
        if (!onChange || disabled) { return }
        var { x, y } = this.getClient(e), dom = $(this.dom.current);
        var pointContainers = dom.find('.aio-slider-point-container');
        var size = dom.find('.aio-slider-line')[this.oriention === 'horizontal' ? 'width' : 'height']();
        var length = this.value.length;
        this.eventHandler('window', 'mousemove', $.proxy(this.mouseMove, this));
        this.eventHandler('window', 'mouseup', $.proxy(this.mouseUp, this));
        this.moved = false;
        this.setState({ isDown: true });
        pointContainers.css({ zIndex: 10 });
        if (type === 'point') {
            let pointContainer = pointContainers.eq(index);
            pointContainer.css({ zIndex: 100 });
            pointContainer.find('.aio-slider-point').addClass('active');
            var current = this.value[index];
            var before = index === 0 ? min : this.value[index - 1];
            var after = index === this.value.length - 1 ? max : this.value[index + 1]
            this.startOffset = {x, y, size, index: [index], value: [current],startLimit: before - current, endLimit: after - current}
        }
        else {
            let pointContainer1 = pointContainers.eq(index - 1);
            let pointContainer2 = pointContainers.eq(index);
            pointContainer1.css({ zIndex: 100 });
            pointContainer2.css({ zIndex: 100 });
            let p1 = pointContainer1.find('.aio-slider-point');
            let p2 = pointContainer2.find('.aio-slider-point');
            p1.addClass('active');
            p2.addClass('active');

            if (index === 0) { this.decreaseAll(); }
            else if (index === length) { this.increaseAll(); }
            if (index === 0 || index === length) {
                this.startOffset = {
                    x, y, size,
                    index: this.value.map((o, i) => i), value: this.value.map((o) => o),
                    startLimit: min - this.value[0], endLimit: max - this.value[length - 1],
                }
            }
            else {
                var point1 = this.value[index - 1], point2 = this.value[index];
                var before = index === 1 ? min : this.value[index - 2];//مقدار قبلی رنج
                var after = index === length - 1 ? max : this.value[index + 1]; //مقدار بعدی رنج
                this.startOffset = {
                    x, y, size, index: [index - 1, index],
                    value: [point1, point2], startLimit: before - point1, endLimit: after - point2,
                }
            }
        }
    }

    mouseMove(e) {
        let { onChange } = this.props;
        var { x, y, size, value, startLimit, endLimit, index } = this.startOffset;
        var offset = this.getOffset(x, y, size, e);
        if (offset < startLimit) { offset = startLimit; }
        else if (offset > endLimit) { offset = endLimit; }
        for (var i = 0; i < value.length; i++) {
            let Index = index[i], Value = value[i], newValue = parseFloat(Value) + offset;
            if (this.value[Index] === newValue) { return; }
            this.value[Index] = this.fix(newValue);
        }
        this.moved = true;
        onChange(this.value, true);
    }
    mouseUp() {
        this.eventHandler('window', 'mousemove', this.mouseMove, 'unbind');
        this.eventHandler('window', 'mouseup', this.mouseUp, 'unbind');
        let { onChange } = this.props;
        var points = $(this.dom.current).find('.aio-slider-point');
        points.removeClass('active');
        this.setState({ isDown: false });
        if (this.moved) { onChange(this.value, false); }
    }
    getContext() {
        return {
            ...this.props,
            touch: this.touch,
            fix: this.fix.bind(this),
            oriention: this.oriention,
            getValue: this.getValue.bind(this),
            isDown: this.state.isDown,
            mouseDown: this.mouseDown.bind(this),
            getStartByStep: this.getStartByStep.bind(this),
            getPercentByValue: this.getPercentByValue.bind(this),
            value: this.value
        };
    }
    getStyle() {
        let { attrs } = this.props,{ style = {} } = attrs,obj = { ...style };
        obj = { ...obj };
        obj.direction = 'ltr';
        obj.flexDirection = this.flexDirection;
        return obj
    }
    getClassName() {
        let { attrs, disabled } = this.props, { className } = attrs;
        return `aio-slider ${this.context.oriention}${className ? ' ' + className : ''}${disabled ? ' disabled' : ''}`;
    }
    render() {
        this.value = this.getValidValue();
        this.context = this.getContext();
        var { labelStep, scaleStep, attrs } = this.props;
        var percents = this.getPercents();
        return (
            <SliderContext.Provider value={this.context}>
                <div ref={this.dom} {...attrs} style={this.getStyle()} className={this.getClassName()}>
                    <div style={{ display: 'flex', height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                        <SliderLine />
                        {labelStep && <SliderLabels />}
                        {scaleStep && <SliderScales />}
                        {this.value.map((o, i) => <SliderFill key={i} index={i} percent={percents[i]} />)}
                        <SliderFill key={this.value.length} index={this.value.length} percent={percents[this.value.length]} />
                        {this.value.map((o, i) => <SliderPoint key={i} index={i} percent={percents[i]} />)}
                    </div>
                </div>
            </SliderContext.Provider>
        );
    }
}
Slider.defaultProps = {
    direction: 'right', editLabel: (a) => a, labelStyle: {}, labelRotate: 0,
    value: [0], scaleStyle: {}, style: () => { },
    start: 0, end: 100, step: 1, activegetPointStyle: {}, getText: () => { return '' }, attrs: {},
    pointStyle: {}, lineStyle: {}, fillStyle: {}, valueStyle: {}, textStyle: {}, editValue: (value, index) => value, textStyle: () => { }
}
class SliderLine extends Component {
    static contextType = SliderContext;
    render() {
        var { lineStyle } = this.context;
        return (<div className='aio-slider-line' style={typeof lineStyle === 'function' ? lineStyle(this.context) : lineStyle}></div>)
    }
}
class SliderFill extends Component {
    static contextType = SliderContext;
    getContainerStyle() {
        var { oriention, direction } = this.context, { percent } = this.props;
        var obj = {};
        obj[{ right: 'left', left: 'right', top: 'bottom', bottom: 'top' }[direction]] = percent[0] + '%';
        if (oriention === 'horizontal') { obj.width = (percent[1] - percent[0]) + '%'; }
        else { obj.height = (percent[1] - percent[0]) + '%'; }
        return obj;
    }
    render() {
        var { mouseDown, rangeEvents = {}, fillStyle, getText, textStyle, touch, value } = this.context;
        var { index } = this.props;
        var containerProps = {
            'data-index': index, className: 'aio-slider-fill-container',style: this.getContainerStyle(),
            [touch ? 'onTouchStart' : 'onMouseDown']: (e) => mouseDown(e, index, 'fill')
        }
        for (let prop in rangeEvents) {containerProps[prop] = () => rangeEvents[prop](index)}
        let text = getText(index, this.context),style, active;
        if (typeof fillStyle === 'function') {style = fillStyle(index, this.context);}
        else {
            if (value.length === 1 && index === 0) {style = fillStyle; active = true}
            if (value.length > 1 && index !== 0 && index !== value.length) {style = fillStyle; active = true;}
        }
        return (
            <div {...containerProps}>
                <div className={'aio-slider-fill' + (active ? ' aio-slider-fill-active' : '')} style={style} data-index={index}></div>
                {text !== undefined && <div className='aio-slider-text' style={textStyle(index)}>{text}</div>}
            </div>
        );
    }
}
class SliderPoint extends Component {
    static contextType = SliderContext;
    getContainerStyle() {
        var { direction } = this.context, { percent } = this.props;
        return {[{ right: 'left', left: 'right', top: 'bottom', bottom: 'top' }[direction]]: percent[1] + '%'};
    }
    getValueStyle() {
        var { showValue, isDown, valueStyle } = this.context;
        var { index } = this.props;
        if (showValue === false) { return { display: 'none' } }
        if (showValue === true || showValue === 'inline' || isDown) { return typeof valueStyle === 'function' ? valueStyle(index, this.context) : valueStyle; }
        return { display: 'none' };
    }
    render() {
        var { value, mouseDown, editValue, pointEvents, getPointHTML, pointStyle, touch, fix, showValue } = this.context;
        var { index } = this.props;
        var point = value[index];
        var props = {
            style: this.getContainerStyle(), 'data-index': index, className: 'aio-slider-point-container',
            [touch ? 'onTouchStart' : 'onMouseDown']: (e) => mouseDown(e, index, 'point')
        };
        for (let prop in pointEvents) { props[prop] = () => pointEvents[prop](index) }
        var pointProps = { className: 'aio-slider-point', style: typeof pointStyle === 'function' ? pointStyle(index, this.context) : pointStyle, 'data-index': index };
        var valueProps = {
            style: this.getValueStyle(),
            className: `aio-slider-value ${'aio-slider-value-' + index}` + (showValue === 'inline' ? ' aio-slider-value-inline' : '')
        };
        let html = getPointHTML ? getPointHTML(index, this.context) : '';
        return (
            <div {...props}>
                {showValue !== 'inline' && <div {...pointProps}>{html}</div>}
                <div {...valueProps}>{editValue(fix(point), index)}</div>
            </div>
        );
    }
}
class SliderLabels extends Component {
    static contextType = SliderContext;
    constructor(props) {
        super(props);
        this.dom = createRef();
        $(window).on('resize', this.update.bind(this))
    }
    getLabelsByStep(labelStep) {
        var { start, label = {}, end, getStartByStep } = this.context;
        var Labels = [];
        var value = getStartByStep(start, labelStep);
        var key = 0;
        while (value <= end) {
            Labels.push(<SliderLabel key={key} value={value} />);
            value += labelStep;
            value = parseFloat(value.toFixed(6))
            key++;
        }
        return Labels;
    }
    getLabels(labelStep) { return labelStep.map((o) => <SliderLabel key={o} value={o} />) }
    update() {
        var container = $(this.dom.current);
        var labels = container.find('.aio-slider-label div');
        if (!labels.length) { return; }
        var { direction, label = {} } = this.context;
        var firstLabel = labels.eq(0);
        var firstLabelThickness = firstLabel.attr('datarotated') === 'yes' ? 'height' : 'width';
        if (direction === 'right') {
            var end = firstLabel.offset().left + firstLabel[firstLabelThickness]();
            for (var i = 1; i < labels.length; i++) {
                var label = labels.eq(i);
                let thickness = label.attr('datarotated') === 'yes' ? 'height' : 'width';
                label.css({ display: 'block' })
                var left = label.offset().left

                var width = label[thickness]();
                if (left < end + 5) {
                    label.css({ display: 'none' })
                }
                else { end = left + width; }
            }
        }
        else if (direction === 'left') {
            var end = firstLabel.offset().left;
            for (var i = 1; i < labels.length; i++) {
                var label = labels.eq(i);
                let thickness = label.attr('datarotated') === 'yes' ? 'height' : 'width';
                label.css({ display: 'block' })
                var left = label.offset().left
                var width = label[thickness]();
                var right = left + width;
                if (right > end - 5) {
                    label.css({ display: 'none' })
                }
                else { end = left; }
            }
        }
    }
    componentDidMount() { this.update() }
    componentDidUpdate() { this.update() }
    render() {
        let { labelStep } = this.context;
        return (
            <div className='aio-slider-labels' ref={this.dom}>
                {Array.isArray(labelStep) ? this.getLabels(labelStep) : this.getLabelsByStep(labelStep)}
            </div>
        );
    }
}
class SliderLabel extends Component {
    static contextType = SliderContext;
    getStyle(rotate) {
        var { start, end, getPercentByValue, direction, labelStyle } = this.context;
        var { value } = this.props;
        var obj = typeof labelStyle === 'function' ? labelStyle(value, this.context) : labelStyle;
        obj = !obj ? {} : { ...obj }
        let key = { right: 'left', left: 'right', top: 'bottom', bottom: 'top' }[direction];
        obj[key] = getPercentByValue(value, start, end) + '%';
        if (rotate) {
            obj.transform = `rotate(${rotate + 'deg'})`;
            obj.justifyContent = rotate > 0 ? 'flex-start' : 'flex-end'
        }
        return obj;
    }
    click(e) {
        var { onLabelClick } = this.context;
        e.stopPropagation();
        if (!onLabelClick) { return }
        var { value } = this.props;
        onLabelClick(value);
    }
    render() {
        let { editLabel, labelRotate } = this.context;
        let { value } = this.props;
        let rotate = typeof labelRotate === 'function' ? labelRotate(value) : labelRotate;
        let text;
        try { text = editLabel(value) }
        catch { text = '' }
        return (
            <div onClick={this.click.bind(this)} style={this.getStyle(rotate)} className={`aio-slider-label`}>
                <div datarotated={rotate ? 'yes' : 'no'} className='aio-slider-label-text'>{text}</div>
            </div>
        );
    }
}
class SliderScales extends Component {
    static contextType = SliderContext;
    getScalesByStep(scaleStep) {
        var { start, end, getStartByStep } = this.context;
        var value = getStartByStep(start, scaleStep);
        var key = 0, scales = [];
        while (value <= end) {
            scales.push(<SliderScale value={value} key={key} />);
            value += scaleStep;
            key++;
        }
        return scales;
    }
    getScales(scaleStep) { return scaleStep.map((o) => <SliderScale value={o} key={o} />) }
    render() {
        let { scaleStep } = this.context;
        let scales = Array.isArray(scaleStep) ? this.getScales(scaleStep) : this.getScalesByStep(scaleStep)
        return (<div className='aio-slider-scales'>{scales}</div>);
    }
}
function SliderScale(props) {
    let context = useContext(SliderContext);
    function getStyle() {
        var { scaleStyle } = context;
        var { start, end, direction, getPercentByValue } = context, { value } = props;
        var obj = typeof scaleStyle === 'function' ? scaleStyle(value, context) : scaleStyle;
        obj = !obj ? {} : { ...obj }
        if (!obj) { obj = {} }
        obj[{ right: 'left', left: 'right', top: 'bottom', bottom: 'top' }[direction]] = getPercentByValue(value, start, end) + '%';
        return obj;
    }
    let { getScaleHTML } = context, { value } = props;
    return (<div className="aio-slider-scale" style={getStyle()}>{getScaleHTML && getScaleHTML(value)}</div>);
}
class List extends Component {
    constructor(props) {
        super(props);
        let { getProp, getOptionProp } = props;
        this.getProp = getProp;
        this.getOptionProp = getOptionProp;
        this.touch = 'ontouchstart' in document.documentElement;
        this.dom = createRef();
        let count = this.getProp('count', 3);
        let move = this.getProp('move');
        if (move) { move(this.move.bind(this)) }
        this.state = { count }
    }
    eventHandler(selector, event, action, type = 'bind') {
        var me = { mousedown: "touchstart", mousemove: "touchmove", mouseup: "touchend" };
        event = this.touch ? me[event] : event;
        var element = typeof selector === "string" ? (selector === "window" ? $(window) : $(selector)) : selector;
        element.unbind(event, action);
        if (type === 'bind') { element.bind(event, action) }
    }
    getClient(e) {
        try {return this.touch && e.changedTouches? [e.changedTouches[0].clientX, e.changedTouches[0].clientY]: [e.clientX, e.clientY];}
        catch {return this.touch && e.changedTouches? [e.changedTouches[0].clientX, e.changedTouches[0].clientY]: [e.clientX, e.clientY]}
    }
    getStyle() {
        let size = this.getProp('size', 48),width = this.getProp('width', 200);
        var { count } = this.state,height = count * (size);
        return { width, height }
    }
    getOptions() {
        let size = this.getProp('size', 48);
        let options = this.getProp('options', []);
        let propsValue = this.getProp('value');
        this.activeIndex = 0;
        return options.map((option, i) => {
            let value = this.getOptionProp(option, 'value');
            let text = this.getOptionProp(option, 'text', '');
            let style = this.getOptionProp(option, 'style', {});
            if (value === propsValue) { this.activeIndex = i; }
            return <div key={i} dataindex={i} className='aio-input-list-option' style={{ height: size, ...style }}>{text}</div>
        })
    }
    getIndexByTop(top) {
        let size = this.getProp('size', 48),{ count } = this.state;
        return Math.round(((count * size) - size - (2 * top)) / (2 * size));
    }
    getTopByIndex(index) {
        let size = this.getProp('size', 48),{ count } = this.state;
        return (count - 2 * index - 1) * size / 2;
    }
    getContainerStyle() {return {top: this.getTopByIndex(this.activeIndex)};}
    moveDown() {
        let options = this.getProp('options', []);
        if (this.activeIndex >= options.length - 1) { return }
        this.activeIndex++;
        var newTop = this.getTopByIndex(this.activeIndex);
        this.setStyle({ top: newTop });
        this.setBoldStyle(this.activeIndex);
    }
    setBoldStyle(index) {
        $(this.dom.current).find('.aio-input-list-option').removeClass('active');
        $(this.dom.current).find('.aio-input-list-option[dataindex=' + (index) + ']').addClass('active');
    }
    moveUp() {
        if (this.activeIndex <= 0) { return }
        this.activeIndex--;
        var newTop = this.getTopByIndex(this.activeIndex);
        this.setStyle({ top: newTop });
        this.setBoldStyle(this.activeIndex);
    }
    keyDown(e) {
        let editable = this.getProp('editable', true);
        if (!editable) { return }
        if (e.keyCode === 38) {this.moveUp();}
        else if (e.keyCode === 40) {this.moveDown();}
    }
    getLimit() {return {top: this.getTopByIndex(-1),bottom: this.getTopByIndex(this.getProp('options', []).length)}}
    getTrueTop(top) {
        let options = this.getProp('options', []);
        let index = this.getIndexByTop(top);
        if (index < 0) { index = 0 }
        if (index > options.length - 1) { index = options.length - 1 }
        return this.getTopByIndex(index);
    }
    mouseDown(e) {
        let options = this.getProp('options', []);
        let onChange = this.getProp('onChange', () => { });
        let editable = this.getProp('editable', true);
        if (!editable) { return }
        this.eventHandler('window', 'mousemove', $.proxy(this.mouseMove, this));
        this.eventHandler('window', 'mouseup', $.proxy(this.mouseUp, this));
        clearInterval(this.interval);
        this.moved = false;
        this.isDown = true;
        var [x, y] = this.getClient(e);
        this.setStyle({ transition: 'unset' });
        let top = this.getTop();
        var index = this.getIndexByTop(top);
        this.setBoldStyle(index);
        this.setStyle({ top, transition: 'unset' });
        onChange(options[index].value, index)
        this.so = { y, top, limit: this.getLimit() };
    }
    getTop() {
        var top = parseInt($(this.dom.current).find('.aio-input-list-options').css('top'));
        return this.getTrueTop(top);
    }
    fixTop(value) {
        let { top, bottom } = this.so.limit;
        if (value > top) { return top }
        if (value < bottom) { return bottom }
        return value;
    }
    mouseMove(e) {
        this.moved = true;
        var [x, y] = this.getClient(e);
        var offset = y - this.so.y;
        if (this.lastY === undefined) { this.lastY = y }
        this.deltaY = y - this.lastY;
        this.lastY = y;
        if (Math.abs(offset) < 20) { this.deltaY = 3 }
        var newTop = this.fixTop(this.so.top + offset);
        let index = this.getIndexByTop(newTop);
        this.so.newTop = newTop;
        this.setBoldStyle(index);
        this.setStyle({ top: newTop });
    }
    setStyle(obj) {$(this.dom.current).find('.aio-input-list-options').css(obj);}
    mouseUp(e) {
        this.eventHandler('window', 'mousemove', this.mouseMove, 'unbind');
        this.eventHandler('window', 'mouseup', this.mouseUp, 'unbind');
        this.isDown = false;
        if (!this.moved) { return }
        this.moved = false;
        this.move(this.deltaY, this.so.newTop)
    }
    move(deltaY, startTop = this.getTop()) {
        let options = this.getProp('options', []);
        let onChange = this.getProp('onChange', () => { });
        let decay = this.getProp('decay', 8);
        let stop = this.getProp('stop', 3);
        if (decay < 0) { decay = 0 }
        if (decay > 99) { decay = 99 }
        decay = parseFloat(1 + decay / 1000)
        this.interval = setInterval(() => {
            startTop += deltaY;
            let index = this.getIndexByTop(startTop);
            if (Math.abs(deltaY) < stop || index < 0 || index > options.length - 1) {
                clearInterval(this.interval);
                if (index < 0) { index = 0 }
                if (index > options.length - 1) { index = options.length - 1 }
                let top = this.getTopByIndex(index);
                this.setBoldStyle(index);
                this.setStyle({ top, transition: '0.3s' });
                onChange(options[index].value, index)
                return;
            }
            deltaY /= decay;
            this.setStyle({ top: startTop });
        }, 20)
    }
    componentDidUpdate() {this.setBoldStyle(this.activeIndex);}
    componentDidMount() {this.setBoldStyle(this.activeIndex);}
    render() {
        let attrs = this.getProp('attrs', {}),options = this.getOptions();
        return (
            <div
                {...attrs} ref={this.dom} tabIndex={0} onKeyDown={(e) => this.keyDown(e)}
                className={'aio-input-list' + (attrs.className ? ' ' + attrs.className : '')}
                style={{ ...attrs.style, ...this.getStyle() }}
            >
                <div
                    className='aio-input-list-options' style={this.getContainerStyle()}
                    onMouseDown={(e) => this.mouseDown(e)} onTouchStart={(e) => this.mouseDown(e)}
                >{options}</div>
            </div>
        );
    }
}
const MapContext = createContext();
function Map(props) {
    let context = useContext(AICTX);
    let mapApiKeys = context.mapApiKeys;
    let { getProp } = props;
    let popup = getProp('popup');
    let isPopup = false;
    let mapConfig = getProp('mapConfig', {})
    let onClose = false;
    let onChange = getProp('onChange');
    let disabled = getProp('disabled');
    let loading = getProp('loading');
    let attrs = getProp('attrs', {});
    let onChangeAddress = getProp('onChangeAddress', () => { });
    let value = getProp('value');
    let p = { popup, isPopup, onClose, onChange, attrs, onChangeAddress, value, mapApiKeys, mapConfig, disabled: !!disabled || !!loading }
    return <MapUnit {...p} />
}
class MapUnit extends Component {
    static contextType = AICTX;
    constructor(props) {
        super(props);
        this.datauniqid = 'mp' + (Math.round(Math.random() * 10000000))
        this.markers = []
        this.dom = createRef();
        let { mapConfig = {} } = props;
        let { zoom = 14 } = mapConfig;
        this.state = { address: '', value: props.value, prevValue: props.value, zoom, prevZoom: zoom }
    }
    handleArea() {
        if (this.area) { this.area.remove() }
        let { mapConfig = {} } = this.props;
        let { area } = mapConfig;
        if (area) {
            let { color = 'dodgerblue', opacity = 0.1, radius = 1000, lat, lng } = area;
            this.area = this.L.circle([lat, lng], { color, fillColor: color, fillOpacity: opacity, radius }).addTo(this.map);
        }
    }
    ipLookUp() {
        $.ajax('http://ip-api.com/json')
            .then(
                (response) => {
                    let { lat, lon } = response;
                    this.flyTo(lat, lon, undefined, 'ipLookUp')
                },
                (data, status) => console.log('Request failed.  Returned status of', status)
            );
    }
    handlePermission() {
        navigator.permissions.query({ name: 'geolocation' }).then((result) => {
            if (result.state === 'granted') { console.log(result.state); }
            else if (result.state === 'prompt') { console.log(result.state); }
            else if (result.state === 'denied') { console.log(result.state); }
        });
    }
    async getAddress({ lat, lng }) {
        let { mapApiKeys } = this.props;
        try {
            let res = await Axios.get(`https://api.neshan.org/v5/reverse?lat=${lat}&lng=${lng}`, { headers: { 'Api-Key': mapApiKeys.service, Authorization: false } });
            return res.status !== 200 ? '' : res.data.formatted_address;
        }
        catch (err) { return '' }
    }
    goToCurrent() {
        if ("geolocation" in navigator) {
            this.handlePermission();
            // check if geolocation is supported/enabled on current browser
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    let { latitude: lat, longitude: lng } = position.coords;
                    this.apis.flyTo(lat, lng, undefined, 'goToCurrent');
                },
                (error_message) => { this.ipLookUp() }
            )
        }
        else { this.ipLookUp() }
    }
    async route(from = [35.699739, 51.338097], to = [35.699939, 51.338497]) {
        let { mapApiKeys } = this.context;
        try {
            let param = { headers: { 'Api-Key': mapApiKeys.service } }
            let url = `https://api.neshan.org/v4/direction?type=car&origin=${from[0]},${from[1]}&destination=${to[0]},${to[1]}`;
            await Axios.get(url, param);
        }
        catch (err) { return '' }
    }
    async showPath(path) {
        let { mapApiKeys } = this.props;
        try { await Axios.post(`https://api.neshan.org/v3/map-matching?path=${path}`, { headers: { 'Api-Key': mapApiKeys.service } }); }
        catch (err) { return '' }
    }
    flyTo(lat, lng, zoom = this.state.zoom) {
        let animate = getDistance(this.state.value, { lat, lng }) > 0.3;
        if (!lat || !lng) { return }
        this.map.flyTo([lat, lng], zoom, { animate, duration: 1 });
    }
    panTo(lat, lng) { this.map.panTo({ lat, lng }) }
    async updateAddress({ lat, lng }) {
        let { onChangeAddress = () => { } } = this.props;
        let address = await this.getAddress({ lat, lng });
        this.setState({ address });
        onChangeAddress(address);
    }
    change({ lat, lng }) {
        let { onChange = () => { } } = this.props;
        onChange({ lat, lng });
        this.updateAddress({ lat, lng })
    }
    move({ lat, lng }) {
        let { mapConfig = {} } = this.props;
        let { marker = true } = mapConfig;
        if (marker) { this.marker.setLatLng({ lat, lng }) }
        clearTimeout(this.timeout);
        this.timeout = setTimeout(async () => this.setState({ value: { lat, lng } }, () => this.change({ lat, lng })), 700);
    }
    //maptype: "dreamy" | 'standard-day'  
    init() {
        let { mapApiKeys, onChange, popup, isPopup, mapConfig = {}, disabled, attrs = {} } = this.props;
        let { marker = true, traffic = false, zoomControl = false, maptype = 'dreamy-gold', poi = true, zoomable = true } = mapConfig;
        let { value, zoom } = this.state;
        let config = {
            key: mapApiKeys.map, maptype, poi, traffic,
            center: [value.lat, value.lng], zoom,
            dragging: !disabled,
            scrollWheelZoom: 'center',
            minZoom: zoomable ? undefined : zoom,
            maxZoom: zoomable ? undefined : zoom,
            zoomControl
        }
        let map = new window.L.Map(this.dom.current, config);
        let L = window.L,myMap = map;
        this.map = myMap; this.L = L;
        if (marker) { this.marker = L.marker([value.lat, value.lng]).addTo(myMap); }
        myMap.on('click', (e) => {
            if (attrs.onClick) { return }
            if (popup && !isPopup) { this.setState({ showPopup: true }) }
            else if (onChange) { let { lat, lng } = e.latlng; this.map.panTo({ lat, lng }) }
        });
        if (!disabled) {
            myMap.on('move', (e) => {
                //marker.setLatLng(e.target.getCenter())
                let { lat, lng } = e.target.getCenter()
                this.move({ lat, lng })
            });
        }
        this.updateAddress(value);
        this.handleMarkers()
        this.handleArea()
    }
    componentDidMount() {
        if (document.getElementById('aio-input-map-neshan') === null) {
            try {
                const script = document.createElement("script");
                script.src = `https://static.neshan.org/sdk/leaflet/1.4.0/leaflet.js`;
                script.id = 'aio-input-map-neshan'
                script.onload = () => this.init();
                document.body.appendChild(script);
            }
            catch (err) { console.log(err) }
        }
        else { this.init() }
    }
    componentDidUpdate() {
        let { mapConfig = {} } = this.props;
        let { zoom: pzoom } = mapConfig;
        let { prevValue, prevZoom: szoom } = this.state;
        let { value } = this.props;
        if (JSON.stringify(prevValue) !== JSON.stringify(value) || pzoom !== szoom) {
            setTimeout(() => {
                this.flyTo(value.lat, value.lng, pzoom, 'componentDidUpdate');
                this.setState({ prevValue: value, prevZoom: pzoom })
            }, 0)
        }
        this.handleArea()
        this.handleMarkers()
    }
    getMarkerDefaultOptions(marker) {
        let { mapConfig = {} } = this.props;
        let { markerOptions = {} } = mapConfig;
        let { size: dsize = 20, color: dcolor = 'orange', html: dhtml, text: dtext = '' } = markerOptions;
        let { size = dsize, color = dcolor, html = dhtml, text = dtext } = marker;
        return { size, color, html, text }
    }
    getMarker(marker) {
        let { size, color, html, text } = this.getMarkerDefaultOptions(marker);
        let innerSize = size * 0.4;
        let borderSize = Math.ceil(size / 10);
        let innerTop = Math.round(size / 25);
        let top = `-${(size / 2 + innerSize)}px`;
        let style1 = `transform:translateY(${top});flex-shrink:0;color:${color};width:${size}px;height:${size}px;border:${borderSize}px solid;position:relative;border-radius:100%;display:flex;align-items:center;justify-content:center;`
        let style2 = `position:absolute;left:calc(50% - ${innerSize}px);top:calc(100% - ${innerTop}px);border-top:${innerSize}px solid ${color};border-left:${innerSize}px solid transparent;border-right:${innerSize}px solid transparent;`
        let innerHtml = '', innerText = '';
        if (html) { innerHtml = JSXToHTML(html) }
        if (text) { innerText = JSXToHTML(text) }
        return (`<div class='aio-input-map-marker' data-parent='${this.datauniqid}' style="${style1}">${innerHtml}<div class='aio-input-map-marker-text'>${innerText}</div><div style="${style2}"></div></div>`)
    }
    handleMarkers() {
        let { mapConfig = {} } = this.props;
        let { markers = [] } = mapConfig;
        if (!markers) { markers = [] }
        if (this.markers.length) {
            for (let i = 0; i < this.markers.length; i++) { this.markers[i].remove(); }
            this.markers = [];
        }
        for (let i = 0; i < markers.length; i++) {
            let marker = markers[i];
            let { lat, lng, popup = () => '' } = marker;
            let pres = popup(marker)
            if (typeof pres !== 'string') { try { pres = pres.toString() } catch { } }
            this.markers.push(
                this.L.marker([lat, lng], { icon: this.L.divIcon({ html: this.getMarker(marker) }) }).addTo(this.map).bindPopup(pres)
            )
        }
    }
    getContext() {
        let { mapApiKeys } = this.props;
        return { mapApiKeys, rootProps: { ...this.props }, rootState: { ...this.state }, flyTo: this.flyTo.bind(this), goToCurrent: this.goToCurrent.bind(this) }
    }
    renderPopup() {
        let { showPopup } = this.state;
        if (showPopup) {
            let { popup } = this.props, { attrs = {} } = popup, { value } = this.state;
            if (popup === true) { popup = {} }
            let props = {
                ...this.props, ...popup, value,
                mapConfig: { ...this.props.mapConfig, ...popup.mapConfig },
                isPopup: true, popup: false,
                onClose: () => this.setState({ showPopup: false }),
                attrs: { ...attrs, style: { width: '100%', height: '100%', top: 0, position: 'fixed', left: 0, zIndex: 1000000, ...attrs.style }, onClick: undefined },
                onChange: (obj, calledBySubmitButton) => { this.move(obj); if (calledBySubmitButton) { this.setState({ showPopup: false }) } }
            }
            return <MapUnit {...props} />
        }
        return null
    }
    render() {
        let { attrs = {} } = this.props;
        return (
            <>
                <MapContext.Provider value={this.getContext()}>
                    <RVD
                        layout={{
                            className: 'aio-input-map-container', style: attrs.style,
                            column: [{ html: <MapHeader /> }, { flex: 1, attrs: { ref: this.dom }, html: '' }, { html: <MapFooter /> }]
                        }}
                    />
                </MapContext.Provider>
                {this.renderPopup()}
            </>
        )
    }
}
function MapHeader() {
    let context = useContext(MapContext);
    let { rootProps, rootState, flyTo, goToCurrent, mapApiKeys } = context;
    let { mapConfig = {}, onClose } = rootProps;
    let { title, search } = mapConfig;
    let [searchValue, setSearchValue] = useState('');
    let [searchResult, setSearchResult] = useState([]);
    let [loading, setLoading] = useState(false);
    let [showResult, setShowResult] = useState(false);
    let loadingIcon = <Icon path={mdiLoading} size={1} spin={0.4} />;
    let closeIcon = <Icon path={mdiClose} size={0.8} onClick={() => setShowResult(false)} />;
    let searchIcon = <Icon path={mdiMagnify} size={0.8} />;
    let dom = createRef();
    let timeout;
    async function changeSearch(e) {
        let { value } = rootState, { lat, lng } = value, searchValue = e.target.value;
        setSearchValue(searchValue);
        clearTimeout(timeout);
        timeout = setTimeout(async () => {
            try {
                let param = { headers: { 'Api-Key': mapApiKeys.service } }
                let url = `https://api.neshan.org/v1/search?term=${searchValue}&lat=${lat}&lng=${lng}`;
                setLoading(true); let res = await Axios.get(url, param); setLoading(false)
                if (res.status !== 200) { return }
                setSearchResult(res.data.items)
            }
            catch (err) { }
        }, 1000)
    }
    function SearchInput() {
        return (<input ref={dom} value={searchValue} className='aio-input-map-serach-input' type='text' placeholder='جستجو' onChange={changeSearch} onClick={() => setShowResult(true)} />)
    }
    function search_layout() {
        let showCloseButton = !!showResult && !!searchResult.length;
        return {
            flex: 1, row: [
                { align: 'h', flex: 1, html: SearchInput() },
                { show: !!loading, align: 'vh', className: 'aio-input-map-serach-icon', html: loadingIcon },
                { show: showCloseButton, align: 'vh', className: 'aio-input-map-serach-icon', html: closeIcon },
                { show: !showCloseButton && !loading, align: 'vh', className: 'aio-input-map-serach-icon', html: searchIcon }
            ]
        }
    }
    function input_layout() {
        if (!search) { return false }
        return { className: 'aio-input-map-search', row: [currentPoint_layout(), search_layout()] }
    }
    function result_layout() {
        if (!searchResult || !searchResult.length || !showResult) { return false }
        return {
            className: 'aio-input-map-serach-results',
            column: searchResult.map(({ title, address, location }) => {
                return {
                    onClick: () => { setShowResult(false); flyTo(location.y, location.x, undefined, 'result_layout') },
                    className: 'aio-input-map-search-result',
                    column: [
                        { html: title, className: 'aio-input-map-serach-result-text', align: 'v' },
                        { html: address, className: 'aio-input-map-serach-result-subtext', align: 'v', style: { opacity: 0.5 } }
                    ]
                }
            })
        }
    }
    function header_layout() {
        if (typeof title !== 'string' && !onClose) { return false }
        return {
            row: [
                { show: !!onClose, align: 'vh', html: <Icon path={mdiChevronRight} size={1} />, className: 'aio-input-map-close', onClick: () => onClose() },
                { show: typeof title === 'string', html: title, className: 'aio-input-map-title', align: 'v' },
            ]
        }
    }
    function currentPoint_layout() {
        return { className: 'aio-input-map-current-point', html: <Icon path={mdiCrosshairsGps} size={0.8} onClick={() => goToCurrent()} />, align: 'vh' }
    }
    if (!search && !title && !onClose) { return null }
    return (
        <RVD
            layout={{
                className: 'aio-input-map-header of-visible' + (searchResult && searchResult.length && showResult ? ' aio-input-map-header-open' : ''),
                column: [header_layout(), input_layout(), result_layout(),]
            }}
        />
    )
}
function MapFooter() {
    let context = useContext(MapContext);
    let { rootProps, rootState } = context;
    let { value, onChange } = rootState, { lat, lng } = value;
    function submit_layout() {
        if (!rootProps.isPopup) { return false }
        return { html: (<button className='aio-input-map-submit' onClick={async () => onChange(rootState.value, true)}>تایید موقعیت</button>) }
    }
    function details_layout() {
        return { flex: 1, column: [{ html: rootState.address, className: 'aio-input-map-address' }, { show: !!lat && !!lng, html: () => `${lat} - ${lng}`, className: 'aio-input-map-coords' }] }
    }
    return (<RVD layout={{ className: 'aio-input-map-footer', row: [details_layout(), submit_layout()] }} />)
}
export function getDistance(p1, p2) {
    let { lat: lat1, lng: lon1 } = p1;
    let { lat: lat2, lng: lon2 } = p2;
    let rad = Math.PI / 180;
    let radius = 6371; //earth radius in kilometers
    return Math.acos(Math.sin(lat2 * rad) * Math.sin(lat1 * rad) + Math.cos(lat2 * rad) * Math.cos(lat1 * rad) * Math.cos(lon2 * rad - lon1 * rad)) * radius; //result in Kilometers
}
export function AIOValidation(props) {
    let $$ = {
        translate(text) {
            if (!text) { return text }
            let { lang } = props;
            let dict = {
                'should be contain': 'باید شامل',
                'should be before': 'باید قبل از',
                'cannot be after': 'نمی تواند بعد از',
                'should be after': 'باید بعد از',
                'cannot be before': 'نمی تواند قبل از',
                'should not be contain': 'نمی تواند شامل',
                'should be less than': 'باید کمتر از',
                'should be more than': 'باید بیشتر از',
                'could not be more than': 'نباید بزرگ تر از',
                'could not be less than': 'نباید کوچک تر از',
                'character(s)': 'کاراکتر',
                'item(s)': 'مورد',
                'should be equal': 'باید برابر',
                'cannot be equal': 'نمی تواند برابر'
            }
            return lang === 'fa' ? dict[text] : text
        },
        getMessage(target, { be, validation, unit = '' }) {
            let [a, b, params = {}] = validation;
            let { title = props.title, target: targetPresentation = target, message } = params;
            if (message) { return message }
            return `${title} ${this.translate(be)} ${JSON.stringify(targetPresentation)} ${unit}` + (props.lang === 'fa' ? ' باشد' : '')
        },
        contain(target, validation, value) {
            let config = { be: 'should be contain', validation };
            if (target === 'number') { if (!/\d/.test(value)) { return this.getMessage('number', config) } }
            else if (target === 'letter') { if (!/[a-zA-Z]/.test(value)) { return this.getMessage('letter', config) } }
            else if (target === 'uppercase') { if (!/[A-Z]/.test(value)) { return this.getMessage('uppercase', config) } }
            else if (target === 'lowercase') { if (!/[a-z]/.test(value)) { return this.getMessage('lowercase', config) } }
            else if (target === 'symbol') { if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(value)) { return this.getMessage('symbol', config) } }
            else if (typeof target.test === 'function') { if (!target.test(value)) { return this.getMessage(target.toString(), config) } }
            else { if (value.indexOf(target) === -1 && target !== undefined) { return this.getMessage(target, config) } }
        },
        notContain(target, validation, value) {
            let config = { be: 'should not be contain', validation };
            if (target === 'number') { if (/\d/.test(value)) { return this.getMessage('number', config) } }
            else if (target === 'letter') { if (/[a-zA-Z]/.test(value)) { return this.getMessage('letter', config) } }
            else if (target === 'uppercase') { if (/[A-Z]/.test(value)) { return this.getMessage('uppercase', config) } }
            else if (target === 'lowercase') { if (/[a-z]/.test(value)) { return this.getMessage('lowercase', config) } }
            else if (target === 'symbol') { if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(value)) { return this.getMessage('symbol', config) } }
            else if (typeof target.test === 'function') { if (target.test(value)) { return this.getMessage(target.toString(), config) } }
            else { if (value.indexOf(target) !== -1) { return this.getMessage(target, config) } }
        },
        length(target, validation, value, unit, exact) {
            if (exact) { return this.getMessage(target, { validation, be: 'should be contain', unit }) }
            if (value.length !== target) { return this.getMessage(target, { validation, be: 'should be contain', unit }) }
        },
        notLength(target, validation, value, unit, exact) {
            if (exact) { return this.getMessage(target, { validation, be: 'should not be contain', unit }) }
            if (value.length === target) { return this.getMessage(target, { validation, be: 'should not be contain', unit }) }
        },
        lengthLess(target, validation, value, unit, exact) {
            if (exact) { return this.getMessage(target, { validation, be: 'should be less than', unit }) }
            if (value.length >= target) { return this.getMessage(target, { validation, be: 'should be less than', unit }) }
        },
        lengthLessEqual(target, validation, value, unit, exact) {
            if (exact) { return this.getMessage(target, { validation, be: 'could not be more than', unit }) }
            if (value.length > target) { return this.getMessage(target, { validation, be: 'could not be more than', unit }) }
        },
        lengthMore(target, validation, value, unit, exact) {
            if (exact) { return this.getMessage(target, { validation, be: 'should be more than', unit }) }
            if (value.length <= target) { return this.getMessage(target, { validation, be: 'should be more than', unit }) }
        },
        lengthMoreEqual(target, validation, value, unit, exact) {
            if (exact) { return this.getMessage(target, { validation, be: 'could not be less than', unit }) }
            if (value.length < target) { return this.getMessage(target, { validation, be: 'could not be less than', unit }) }
        },
        equal(target, validation, value, a, exact) {
            if (exact) { this.getMessage(target, { validation, be: 'should be equal' }) }
            if (JSON.stringify(value) !== JSON.stringify(target)) {
                return this.getMessage(target, { validation, be: 'should be equal' })
            }
        },
        not(target, validation, value, a, exact) {
            if (exact) { return this.getMessage(target, { validation, be: 'cannot be equal' }) }
            if (JSON.stringify(value) === JSON.stringify(target)) {
                return this.getMessage(target, { validation, be: 'cannot be equal' })
            }
        },
        dateLess(target, validation, value, a, exact) {
            if (exact) { return this.getMessage(target, { validation, be: 'should be before' }) }
            if (AIODate().isGreater(value, target) || AIODate().isEqual(value, target)) {
                return this.getMessage(target, { validation, be: 'should be before' })
            }
        },
        dateLessEqual(target, validation, value, a, exact) {
            if (exact) { return this.getMessage(target, { validation, be: 'cannot be after' }) }
            if (AIODate().isGreater(value, target)) {
                return this.getMessage(target, { validation, be: 'cannot be after' })
            }
        },
        dateMore(target, validation, value, a, exact) {
            if (exact) { return this.getMessage(target, { validation, be: 'should be after' }) }
            if (AIODate().isLess(value, target) || AIODate().isEqual(value, target)) {
                return this.getMessage(target, { validation, be: 'should be after' })
            }
        },
        dateMoreEqual(target, validation, value, a, exact) {
            if (exact) { this.getMessage(target, { validation, be: 'cannot be before' }) }
            if (AIODate().isLess(value, target)) {
                return this.getMessage(target, { validation, be: 'cannot be before' })
            }
        },
        less(target, validation, value, a, exact) {
            if (exact) { return this.getMessage(target, { validation, be: 'should be less than' }) }
            if (typeof value === 'number' && typeof target === 'number' && value >= target) {
                return this.getMessage(target, { validation, be: 'should be less than' })
            }
        },
        lessEqual(target, validation, value, a, exact) {
            if (exact) { return this.getMessage(target, { validation, be: 'could not be more than' }) }
            if (typeof value === 'number' && typeof target === 'number' && value > target) {
                return this.getMessage(target, { validation, be: 'could not be more than' })
            }
        },
        more(target, validation, value, a, exact) {
            if (exact) { return this.getMessage(target, { validation, be: 'should be more than' }) }
            if (typeof value === 'number' && typeof target === 'number' && value <= target) {
                return this.getMessage(target, { validation, be: 'should be more than' })
            }
        },
        moreEqual(target, validation, value, a, exact) {
            if (exact) { return this.getMessage(target, { validation, be: 'could not be less than' }) }
            if (typeof value === 'number' && typeof target === 'number' && value < target) {
                return this.getMessage(target, { validation, be: 'could not be less than' })
            }
        },
        getResult(fn, target, validation, value, unit) {
            target = Array.isArray(target) ? target : [target];
            if (Array.isArray(target)) {
                let matchedTargets = [];
                let notMatchedTargets = [];
                for (let i = 0; i < target.length; i++) {
                    let result = this[fn](target[i], validation, value, unit)
                    if (!result) { matchedTargets.push(target[i]) }
                    else { notMatchedTargets.push(target[i]) }
                }
                if (matchedTargets.length) { return }
                // if(notMatchedTargets.length > 3){
                //   notMatchedTargets = [notMatchedTargets[0],notMatchedTargets[1],notMatchedTargets[2],'...']
                // }
                return this[fn](notMatchedTargets.join(' or '), validation, value, unit, true)
            }
            else {
                let result = this[fn](target, validation, value, unit)
                if (result) { return result }
            }

        },
        getValidation() {
            let { lang = 'en', value, validations = [] } = props;
            let unit = '';
            if (Array.isArray(value)) { unit = this.translate('item(s)') }
            else if (typeof value === 'string') { unit = this.translate('character(s)') }
            for (let i = 0; i < validations.length; i++) {
                let [type, target, params = {}] = validations[i];
                let result;
                if (type === 'function') {
                    result = target(value);
                }
                else if (type === 'required') {
                    if (value === undefined || value === null || value === '' || value === false || value.length === 0) {
                        let { title = props.title } = params;
                        if (lang === 'en') { return `${title} is required` }
                        if (lang === 'fa') { return `وارد کردن ${title} ضروری است` }
                    }
                }
                else if (type === 'contain') { result = this.getResult('contain', target, validations[i], value) }
                else if (type === '!contain') { result = this.getResult('notContain', target, validations[i], value) }
                else if (type === 'length') { result = this.getResult('length', target, validations[i], value, unit) }
                else if (type === '!length') { result = this.getResult('notLength', target, validations[i], value, unit) }
                else if (type === 'length<') { result = this.getResult('lengthLess', target, validations[i], value, unit) }
                else if (type === 'length<=') { result = this.getResult('lengthLessEqual', target, validations[i], value, unit) }
                else if (type === 'length>') { result = this.getResult('lengthMore', target, validations[i], value, unit) }
                else if (type === 'length>=') { result = this.getResult('lengthMoreEqual', target, validations[i], value, unit) }
                else if (type === '=') { result = this.getResult('equal', target, validations[i], value) }
                else if (type === '!=') { result = this.getResult('not', target, validations[i], value) }
                else if (type === '<') { result = this.getResult('less', target, validations[i], value) }
                else if (type === '<=') { result = this.getResult('lessEqual', target, validations[i], value) }
                else if (type === '>') { result = this.getResult('more', target, validations[i], value) }
                else if (type === '>=') { result = this.getResult('moreEqual', target, validations[i], value) }
                else if (type === 'date<') { result = this.getResult('dateLess', target, validations[i], value) }
                else if (type === 'date<=') { result = this.getResult('dateLessEqual', target, validations[i], value) }
                else if (type === 'date>') { result = this.getResult('dateMore', target, validations[i], value) }
                else if (type === 'date>=') { result = this.getResult('dateMoreEqual', target, validations[i], value) }
                if (result) { return result }
            }
            return ''
        }
    }
    props.translate = props.translate || function (text) { return text }
    props.lang = props.lang || 'en';
    let validation;
    try { validation = $$.getValidation() } catch { validation = '' }
    return validation;
}

class AIOInputValidate {
    constructor(props) {
        this.props = props;
        let error = this.getError()
        if (error && !$('.aio-popup-alert-container').length) {
            let subtext;
            try {subtext = JSON.stringify(props);} catch {subtext = '';}
            new AIOPopup().addAlert({ text: error, type: 'error', subtext })
        }
    }
    varTypes = {'object': true, 'array': true, 'string': true, 'number': true, 'boolean': true, 'undefined': true, 'any': true, 'function': true, 'null': true}
    titr = 'aio-input error =>';
    getTypes = () => {
        return [
            'text', 'number', 'textarea', 'color', 'password', 'file', 'image', 'select', 'multiselect', 'table', 'form',
            'time', 'datepicker', 'list', 'checkbox', 'radio', 'tabs', 'slider', 'button', 'map'
        ]
    }
    getType = (v) => {
        if (Array.isArray(v)) { return 'array' }
        return v === null?'undefined':typeof v;
    }
    checkTypes = (value, types) => {
        if (types === 'any') { return }
        types = types.split('|');
        let res;
        let passed = false;
        for (let i = 0; i < types.length; i++) {
            let type = types[i];
            let error = this.checkType(value, type, types)
            if (error) { res = error }
            else { passed = true }
        }
        if (!passed) { return res }
    }
    checkType = (value, type, types) => {
        let res = false,valueType = this.getType(value);
        if (this.varTypes[type]) {if (valueType === type) { res = true }}
        else {
            let typeString;
            try { typeString = JSON.parse(type) } catch { typeString = type }
            if (value === typeString) { res = true }
        }
        if (res === false) {
            let res;
            try { res = JSON.stringify(value) } catch { res = value }
            return `should be ${types.join('|')} but is ${res}`
        }
    }
    getError = () => {
        let types = this.getTypes();
        let { type } = this.props;
        if (types.indexOf(type) === -1) { return `${this.titr} ${type} is invalid type` }
        let error = this.getMessage(type);
        if (error) { return error }
    }
    getValidateObject = (type) => {
        let options = 'array|undefined', optionText = 'any', optionValue = 'any', optionBefore = 'any', optionAfter = 'any', optionSubtext = 'any', optionDisabled = 'any', optionAttrs = 'any', optionCheckIcon = 'any';
        let style = 'function|object|undefined',disabled = 'boolean|undefined',subtext = 'number|string|function';
        let dic = {
            text: {
                type: '"text"', value: 'string|number|undefined',inputAttrs: "object|undefined",placeholder: 'any',
                options, optionText, optionValue, optionBefore, optionAfter, optionSubtext, optionDisabled, optionAttrs, optionCheckIcon,
                justNumber: "boolean|array|undefined", maxLength: 'number|undefined', filter: 'array',
                before: 'any', after: 'any', subtext,caret: 'any',popover: 'object|undefined',disabled, loading: 'any',
            },
            textarea: {
                type: '"textarea"', value: 'string|number|undefined',maxLength: 'number|undefined',popover: 'object|undefined',
                options, optionText, optionValue, optionBefore, optionAfter, optionSubtext, optionDisabled, optionAttrs, optionCheckIcon,
                inputAttrs: "object|undefined",disabled,placeholder: 'any',caret: 'any',before: 'any', after: 'any', subtext,loading: 'any',
            },
            number: {
                type: '"number"',swip: 'boolean|undefined',popover: 'object|undefined',placeholder: 'any',
                options, optionText, optionValue, optionBefore, optionAfter, optionSubtext, optionDisabled, optionAttrs, optionCheckIcon,
                inputAttrs: "object|undefined",value: '""|number|undefined',caret: 'any',before: 'any', after: 'any', subtext,disabled, loading: 'any',
            },
            radio: {
                type: '"radio"', value: 'any',multiple: 'boolean|undefined',before: 'any', after: 'any', subtext,disabled, loading: 'any',
                options, optionText, optionValue, optionBefore, optionAfter, optionSubtext, optionDisabled, optionAttrs, optionCheckIcon,
            },
            tabs: {
                type: '"tabs"', value: 'any',before: 'any', after: 'any', subtext,disabled, loading: 'any',optionAttrs: 'any',
                options, optionText, optionValue, optionBefore, optionAfter, optionSubtext, optionDisabled, optionAttrs, optionCheckIcon,
            },
            multiselect: {
                type: '"multiselect"', value: 'array|undefined',before: 'any', after: 'any', subtext,text: 'any',
                options, optionText, optionValue, optionBefore, optionAfter, optionSubtext, optionDisabled, optionAttrs, optionCheckIcon,
                popover: 'object|undefined',hideTags: 'boolean|undefined',search: 'boolean|undefined',
                caret: 'any',disabled, loading: 'any',optionTagBefore: 'any', optionTagAfter: 'any', optionTagAttrs: 'any',
            },
            password: {
                type: '"password"', value: 'string|number|undefined',filter: 'array',disabled, loading: 'any',
                before: 'any', after: 'any', subtext,visible: 'boolean|undefined',placeholder: 'any',
                inputAttrs: "object|undefined",justNumber: "boolean|array|undefined",maxLength: 'number|undefined'
            },
            color: {
                type: '"color"', value: 'string|number|undefined',
                options, optionText, optionValue, optionAttrs,
                inputAttrs: "object|undefined",before: 'any', after: 'any', subtext,disabled, loading: 'any',
            },
            checkbox: {
                type: '"checkbox"', value: 'boolean|undefined',
                text: 'any',before: 'any', after: 'any', subtext,disabled, loading: 'any',checkIcon: 'any',
            },
            select: {
                type: '"select"', value: 'number|string|undefined',
                text: 'any',caret: 'any',placeholder: 'any',options: 'array', optionText: 'any', optionValue: 'any',
                search: 'boolean|undefined',optionAttrs: 'function|string|undefined|object',disabled, loading: 'any',
                before: 'any', after: 'any', subtext,optionAttrs: 'any',popover: 'object|undefined',onSwap: 'function|undefined',
                optionClose: 'any',optionChecked: 'string|function|boolean|undefined',optionDisabled: 'any',optionCheckIcon: 'any',
                optionBefore: 'any', optionAfter: 'any', optionSubtext: 'string|number|function|undefined'
            },
            file: {
                type: '"file"', value: 'any',text: 'any',multiple: 'boolean',before: 'any', after: 'any', subtext,
                inputAttrs: "object|undefined",disabled, loading: 'any',center: 'boolean|undefined',
            },
            slider: {
                value: 'number|array|undefined',type: '"slider"',before: 'any', after: 'any',
                start: 'number|undefined', step: 'number|undefined', end: 'number|undefined', min: 'number|undefined', max: 'number|undefined',
                disabled, loading: 'any',showValue: 'boolean|"inline"|undefined',
                lineStyle: style, fillStyle: style, pointStyle: style, valueStyle: style, labelStyle: style, scaleStyle: style,
                multiple: 'boolean|undefined',getPointHTML: 'function|undefined',getScaleHTML: 'function|undefined',
                direction: '"left"|"right"|"top"|"bottom"|undefined',labelStep: 'number|array|undefined',
                scaleStep: 'number|array|undefined',editLabel: 'function|undefined',labelRotate: 'number|function|undefined'
            },
            form: {
                type: '"form"',inputs: 'object',value: 'object',disabled,inputClassName: 'string|function|undefined',inputStyle: style,
                labelAttrs: 'object|function|undefined',lang: '"en"|"fa"|undefined',updateInput: 'function|undefined'
            },
            datepicker: {
                type: '"datepicker"', value: 'any',caret: 'any',popover: 'object|undefined',
                before: 'any', after: 'any', subtext,placeholder: 'any',disabled, loading: 'any',
                calendarType: '"jalali"|"gregorian"|undefined', unit: '"month"|"day"|"hour"', theme: 'array|undefined', size: 'number|undefined', startYear: 'string|number|undefined', endYear: 'string|number|undefined',
                pattern: 'string|undefined',dateDisabled: 'array|undefined',dateAttrs: 'function|undefined',remove: 'boolean|undefined'
            },
            image: {
                type: '"image"', value: 'object|undefined',before: 'any', after: 'any', subtext,
                placeholder: 'any',attrs: 'object|undefined',preview: 'boolean|undefined',disabled, loading: 'any',
                width: 'string|number|undefined', height: 'string|number|undefined',
            },
            time: {type: '"time"', value: 'object|undefined',before: 'any', after: 'any', subtext,disabled, loading: 'any'},
            button: {
                type: '"button"', value: 'any',before: 'any', after: 'any', subtext,
                disabled, loading: 'any',caret: 'any',center: 'boolean|undefined',text: 'any',popover: 'object|undefined',
            },
            list: {
                type: '"list"', value: 'any',options: 'array',
                size: 'number|undefined',width: 'number|undefined',decay: 'number|undefined',stop: 'number|undefined',
            },
            table: {
                type: '"table"', value: 'array|undefined',placeholder: 'any',onChangeSort: 'function|undefined',
                columns: 'array|undefined',onSwap: 'function|undefined|true',getValue: 'object|undefined',
                rowAttrs: 'function|undefined',excel: 'boolean|undefined',
                toolbar: 'any', toolbarAttrs: 'function|object|undefined',
                disabled, loading: 'any',paging: 'object|undefined',
                rowGap: 'number|undefined', columnGap: 'number|undefined',
                onAdd: 'function|object|undefined', onRemove: 'function|boolean|undefined',
                onSearch: 'function|boolean|undefined',headerAttrs: 'function|object|undefined',
                rowTemplate: 'function|undefined', rowsTemplate: 'function|undefined',
                rowAfter: 'function|undefined', rowBefore: 'function|undefined'
            },
            map: {
                type: '"map"', value: 'object|undefined',onChangeAddress: 'function|undefined',
                popup: 'object|undefined',mapConfig: 'object|undefined',before: 'any', after: 'any', subtext,disabled, loading: 'any'
            }
        }
        let privateObject = dic[type];
        if (!privateObject) { return }
        let publicObject = {attrs: 'object|undefined', onChange: 'function|undefined', rtl: 'boolean|undefined', justify: 'boolean|undefined'}
        return { ...publicObject, ...privateObject }
    }
    getMessage = (type) => {
        let validProps = this.getValidateObject(type)
        if (!validProps) { return `${type} validator is not implement` }
        for (let prop in this.props) {
            if (!validProps[prop]) { return `${this.titr} in type="${type}", ${prop} is invalid props` }
            let error = this.checkTypes(this.props[prop], validProps[prop])
            if (error) {
                return `${this.titr} in type="${type}", ${prop} props ${error}`
            }
        }
    }
} 