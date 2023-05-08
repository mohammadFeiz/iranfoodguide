import React, { Component, createRef } from 'react';
import RVD from './../react-virtual-dom/react-virtual-dom';
import AIOStorage from './../aio-storage/aio-storage';
import Form from './../aio-form-react/aio-form-react';
import { Icon } from '@mdi/react';
import { mdiCellphone, mdiLock, mdiLoading, mdiAccount, mdiAccountBoxOutline, mdiEmail, mdiChevronRight } from '@mdi/js';
import AIOService from './../aio-service/aio-service';

import './index.css';
export default class AIOLogin extends Component {
    constructor(props) {
        super(props);
        let {id, checkToken,onSubmitUserId, onSubmitPassword,COMPONENT, onRegister,registerFields} = props;
        if (!id) { console.error(`aio-login error=> missing id props`) }
        if (!COMPONENT) { console.error(`aio-login error=> missing COMPONENT props`) }
        this.valid = true
        this.tokenStorage = AIOStorage(`${id}-token`);
        this.state = {
            isAutenticated: false,
            apis: AIOService({
                id: `${id}login`,
                getResponse: () => {
                    return {
                        checkToken: async () => {
                            let token = this.tokenStorage.load({ name: 'token', def: false });
                            if (!token) { return { result: false } }
                            let result = await checkToken(token);
                            return { result }
                        },
                        async onSubmitUserId({mode,userId,registered}) {
                            let result = await onSubmitUserId({mode,userId,registered});
                            if (result === false) {
                                if (result === false && !onRegister) { return 'aio-login error => missing onRegister due to return false in onSubmitUserId' }
                                if (result === false && !registerFields) { return 'aio-login error => missing registerFields due to return false in onSubmitUserId' }
                            }
                            if (typeof result === 'boolean') { return { result } }
                            if (typeof result === 'string') { return { result } }
                            result = 'متد onInterUserId باید یک متن به عنوان خطا و یا بولین به عنوان اینکه کاربر ثبت نام کرده یا خیر را باز گرداند'
                            return { result }
                        },
                        async onSubmitPassword({mode,userId,password}){return { result:await onSubmitPassword({mode,userId,password}) }},
                        async onRegister({registerModel,mode,userId}) {
                            let result = await onRegister({registerModel,mode,userId});
                            if(typeof result === 'string'){return {result}}
                            if(result === true){return {result}}
                            return { result:'ثبت نام انجام نشد' }
                        }
                    }
                },
                onCatch: (res) => { this.setState({ isAutenticated: false }); return 'error' }
            })
        }
    }
    async componentDidMount() {
        if (!this.valid) { return }
        let res = await this.state.apis({
            api: 'checkToken', name: 'بررسی توکن',
            errorMessage: 'اتصال خود را بررسی کنید',
        })
        this.mounted = true;
        if(res === false){
            this.tokenStorage.remove({ name: 'token' });
            
        }
        this.setState({ isAutenticated: res });
    }
    setToken(token, value) {
        this.tokenStorage.save({ value: token, name: 'token' });
        this.tokenStorage.save({ value, name: 'userId' });
        this.setState({ token, isAutenticated: true })
    }
    logout() { this.tokenStorage.remove({ name: 'token' }); window.location.reload() }
    render() {
        if (!this.valid) { return null }
        if (!this.mounted) { return null }
        let { registerFields, layout, otpLength, COMPONENT, id, fields, time = 16,methods } = this.props;
        let { isAutenticated,apis } = this.state;
        if (isAutenticated) {
            let props = {
                token: this.tokenStorage.load({ name: 'token' }),
                userId: this.tokenStorage.load({ name: 'userId' }),
                logout: this.logout.bind(this)
            }
            COMPONENT(props)
            return null
        }
        if (registerFields) {
            fields = registerFields.map(({ icon, label, field, type }) => {
                return { label, field, type, validations: [['required']], prefix: icon }
            })
        }
        let html = (
            <LoginForm
                time={time} fields={fields} otpLength={otpLength} id={id} methods={methods}
                onSubmitPassword={async ({mode,userId,password})=>{
                    return await apis({
                        api:'onSubmitPassword', loading: false, parameter: {mode,userId,password}, name: `ارسال رمز عبور`,
                        callback: ({ token }) => { 
                            if (token) { this.setToken(token, userId) 
                        } }
                    })
                }}
                onSubmitUserId={async ({mode,userId,registered})=>{
                    let title = {OTPPhoneNumber:'شماره همراه',UserName:'نام کاربری',Email:'آدرس ایمیل',PhoneNumber:'شماره همراه'}[mode];
                    return await apis({
                        api:'onSubmitUserId', loading: false, parameter: {mode,userId,registered}, name: `ارسال ${title}`,
                    })
                }}
                onRegister={async ({registerModel,mode,userId}) => await apis({api:'onRegister', loading: false, parameter: {registerModel,mode,userId}, name: `ثبت نام`})}
            />
        )
        if (layout) { return layout(html) }
        return html
    }
}
class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.dom = createRef()
        this.storage = AIOStorage(props.id + 'aio-login');
        let { time = 30, fields = [],userId = {} } = props;
        let mode = props.methods[0];
        this.state = {
            mode,fields, remainingTime: time, time, recode: false, showRegisterForm: false,
            formError: true,
            userId: userId[mode],
            model: this.getInitialModel(mode)
        }
    }
    getInitialModel(mode) {
        if(!mode){mode = this.state.mode}
        let { userId = {},methods } = this.props;
        let obj = {password:''};
        for(let i = 0; i < methods.length; i++){obj[methods[i]] = userId[methods[i]] || '';}
        return obj;
    }
    changeUserId(value){
        this.setState({userId:value});
    }
    getDelta() {
        let { time } = this.state;
        let lastTime = this.storage.load({ name: 'lastTime', def: () => new Date().getTime() - (time * 1000) });
        let now = new Date().getTime();
        return now - lastTime;
    }
    async onSubmit() {
        let { showRegisterForm,loading, formError,userId,model,mode } = this.state;
        let {onSubmitPassword} = this.props;
        if (formError || loading) { return }
        this.setState({ loading: true })
        if(showRegisterForm){await this.onSubmitRegisterModel()}
        else if(userId){await onSubmitPassword({mode,userId,password:model.password});}
        else {await this.onSubmitUserId()}
        this.setState({ loading: false })
    }
    async onSubmitRegisterModel(){
        let { model,mode,userId } = this.state;
        let {onRegister} = this.props;
        let res = await onRegister({regiterModel:model.register,mode,userId});
        if(typeof res === 'string'){this.changeUserId('');}
        else { this.setState({showRegisterForm:false}); if(mode === 'OTPPhoneNumber'){this.updateRecodeTime()} }
    }
    async onSubmitUserId(callInRecode){
        let { onSubmitUserId } = this.props;
        let { time,model,mode } = this.state;
        let delta = this.getDelta();
        if (delta < time * 1000) { return '' }
        console.log('send user info to server', model[mode]);
        let body = {...model};
        if (callInRecode){body.registered = true}
        let response = await onSubmitUserId({registered:body.registered,userId:model[mode],mode});
        if(response === false && callInRecode){
            console.error('aio-login error => this user is registered but onSubmitUserId returned false and this means user is not registered')
            return;
        }
        this.storage.save({ value: new Date().getTime(), name: 'lastTime' });
        this.storage.save({ value: new Date().getTime(), name: 'recodeLastTime' });
        if(typeof response === 'string'){this.update()}
        else {
            this.changeUserId(model[mode])
            this.setState({ showRegisterForm:!response })
        }
    }
    getInputs() {
        let { fields, mode, model, userId,showRegisterForm } = this.state;
        let inputs = [];
        if (showRegisterForm) {
            return [...fields.map((o) => { return { ...o, field: 'model.register.' + o.field, validations: o.required ? [['required']] : undefined } })]
        }
        if (mode === 'UserName') {
            inputs.push({
                type: 'text', field: 'model.UserName', prefix: <Icon path={mdiAccount} size={0.8} />, placeholder: 'نام کاربری',
                label: 'نام کاربری', disabled: !!userId, validations: [['function', () => errorHandler('UserName', model.UserName)]],
                theme: { inputStyle: { direction: 'ltr' } }
            })
        }
        if (mode === 'OTPPhoneNumber' || mode === 'PhoneNumber') {
            inputs.push({
                type: 'text', justNumber: true, field: `model.${mode}`, prefix: <Icon path={mdiCellphone} size={0.8} />, placeholder: '09...',
                label: 'شماره همراه', disabled: !!userId, validations: [['function', () => errorHandler('PhoneNumber', model[mode])]],
                theme: { inputStyle: { direction: 'ltr' } }
            })
        }
        if (mode === 'Email') {
            inputs.push({
                type: 'text', field: 'model.Email', prefix: <Icon path={mdiAccount} size={0.8} />,
                label: 'ایمیل', disabled: !!userId, validations: [['function', () => errorHandler('Email', model.Email)]],
                theme: { inputStyle: { direction: 'ltr' } }
            })
        }
        if (userId) {
            if (mode === 'OTPPhoneNumber') {
                let { otpLength } = this.props;
                inputs.push({
                    maxLength: otpLength, justNumber: true, type: 'text', field: 'model.password', label: 'کد پیامک شده',
                    placeholder: Array(otpLength).fill('-').join(''),
                    validations: [['function', () => errorHandler('code', model.password, otpLength)]],
                    theme: { inputStyle: { fontSize: 32, letterSpacing: 24, textAlign: 'center' } }
                })
            }
            else {
                inputs.push({
                    type: 'password', field: 'model.password', prefix: <Icon path={mdiLock} size={0.8} />,
                    label: 'رمز عبور', validations: [['function', () => errorHandler('password', model.password)]]
                })
            }
        }
        return inputs
    }
    componentDidMount() {
        this.update()
    }
    update() {
        let { time } = this.state;
        clearTimeout(this.tiomeout);
        let delta = this.getDelta();
        if (delta >= time * 1000) { this.setState({ remainingTime: 0 }) }
        else {
            this.setState({ remainingTime: Math.round(((time * 1000) - delta) / 1000) })
            this.tiomeout = setTimeout(() => this.update(), 1000)
        }
    }
    getRecodeDelta() {
        let { time } = this.state;
        let recodeLastTime = this.storage.load({ name: 'recodeLastTime', def: () => new Date().getTime() - (time * 1000) });
        let now = new Date().getTime();
        return now - recodeLastTime;
    }
    updateRecodeTime() {
        let { time } = this.state;
        clearTimeout(this.recodetiomeout);
        let delta = this.getRecodeDelta();
        if (delta >= time * 1000) { this.setState({ recodeRemainingTime: 0 }) }
        else {
            this.setState({ recodeRemainingTime: Math.round(((time * 1000) - delta) / 1000) })
            this.recodetiomeout = setTimeout(() => this.updateRecodeTime(), 1000)
        }
    }
    title_layout() {
        let { mode, showRegisterForm,userId } = this.state;
        let dic = {OTPPhoneNumber:'کد یکبار مصرف',Email:'ایمیل',UserName:'نام کاربری',PhoneNumber:'شماره همراه'}
        let html = showRegisterForm?'ثبت نام':(!!userId ? `ورود با ${dic[mode]}` : `ورود | ثبت نام با ${dic[mode]}`)
        return {
            className: 'aio-login-title',
            row: [
                { show: !!showRegisterForm, size: 30, html: <Icon path={mdiChevronRight} size={1} />, align: 'v', onClick: () => {
                    this.update();
                    this.changeUserId('');
                    this.setState({showRegisterForm:false})
                } },
                { html, align: 'v' }
            ]
        }
    }
    subtitle_layout() {
        let { remainingTime, mode,showRegisterForm,userId } = this.state;
        let userId_label = {OTPPhoneNumber:'شماره همراه',Email:'ایمیل',UserName:'نام کاربری',PhoneNumber:'شماره همراه'}[mode]
        let password_label = {OTPPhoneNumber:'کد یکبار مصرف',Email:'رمز عبور',UserName:'رمز عبور',PhoneNumber:'رمز عبور'}[mode]
        let label = !!userId?password_label:userId_label;
        let html = showRegisterForm?'':`${label} را ${remainingTime ? `پس از ${remainingTime} ثانیه` : ''} وارد کنید`
        return { html, className: 'aio-login-subtitle' }
    }
    form_layout() {
        let { model, remainingTime,userId,mode } = this.state;
        if (remainingTime) { return false }
        return {
            html: (
                <Form
                    delay={false}
                    key={mode + userId}
                    lang='fa' model={model} onChange={(model) => {
                        this.setState({ model});
                    }}
                    rtl={true} inputs={this.getInputs()}
                    getErrors={(errors) => {
                        this.setState({ formError: !!errors.length })
                    }}
                />
            )
        }
    }
    submit_layout() {
        let { remainingTime, loading,showRegisterForm } = this.state;
        if (remainingTime) { return false }
        return {
            style: { padding: '0 12px' }, className: 'm-b-12',
            gap:12,
            row: [
                {
                    flex: 1,
                    html: (
                        <SubmitButton
                            text={showRegisterForm?'ثبت نام':undefined}
                            disabled={() => !!this.state.formError}
                            onClick={() => this.onSubmit()}
                            loading={loading}
                        />
                    )
                },
                {
                    show:!!showRegisterForm,flex: 1,
                    html: (
                        <SubmitButton
                            outline={true}
                            text={'انصراف'}
                            disabled={() => false}
                            onClick={() => {
                                this.update()
                                this.changeUserId('');
                                this.setState({showRegisterForm:false})
                            }}
                            loading={false}
                        />
                    )
                },
            ]
        }
    }
    changeUserId_layout(){
        let { mode,userId,showRegisterForm } = this.state;
        let title = {
            OTPPhoneNumber:'شماره همراه',
            UserName:'نام کاربری',
            Email:'آدرس ایمیل',
            PhoneNumber:'شماره همراه'
        }[mode];
        if (showRegisterForm || !userId) { return false }
        return {
            onClick: () => {
                this.changeUserId('');
                this.setState({ model: this.getInitialModel() })
            }, 
            className: 'aio-login-text m-b-12', align: 'vh', html: `تغییر ${title}`
        }
    }
    recode_layout() {
        let { recodeRemainingTime, mode ,userId,showRegisterForm} = this.state;
        if (mode !== 'OTPPhoneNumber' || !userId || showRegisterForm) { return false }
        
        if (recodeRemainingTime) { 
            return {
                gap: 3, className: 'aio-login-text m-b-12', align: 'h',
                row: [
                    { html: `${recodeRemainingTime} ثانیه`, style: { fontWeight: 'bold' } },
                    { html: 'تا دریافت مجدد کد' }
                ]
            }
        }
        else {
            return {
                className: 'aio-login-text m-b-12', html: 'دریافت مجدد کد', align: 'vh',
                onClick: async () => {
                    await this.onSubmitUserId(true);
                    this.updateRecodeTime();
                }
            }    
        }
        
    }
    changeMode_layout() {
        let { mode,showRegisterForm } = this.state;
        if (showRegisterForm) { return false }
        let { methods } = this.props;
        let others = []
        for (let i = 0; i < methods.length; i++) {
            let key = methods[i];
            if (mode === key) { continue }
            let title = {OTPPhoneNumber:'رمز یکبار مصرف',UserName:'نام کاربری',Email:'آدرس ایمیل',PhoneNumber:'شماره همراه'}[mode];
            let icon = {OTPPhoneNumber: mdiAccount,PhoneNumber: mdiCellphone,UserName: mdiAccountBoxOutline,Email:mdiEmail}[key]
            others.push({
                flex: 1,
                className: `of-visible aio-login-other-method aio-login-${key}`,
                onClick: () => {
                    this.setState({mode:key});
                    this.changeUserId('')
                },
                row: [
                    { html: <Icon path={icon} size={1}/>, align: 'vh' },
                    { size: 6 },
                    { align: 'v', html: title }
                ]
            })
        }
        if (!others.length) { return false }
        return {
            className: 'p-h-12',
            column: [
                {
                    gap: 6,
                    row: [
                        { flex: 1, html: <div className='aio-login-splitter'></div>, align: 'v' },
                        { html: 'یا ورود با', align: 'v', className: 'aio-login-or bold' },
                        { flex: 1, html: <div className='aio-login-splitter'></div>, align: 'v' },
                    ]
                },
                { size: 12 },
                { grid: others, gridCols: 2, gridRow: { gap: 12 } }
            ]
        }
    }
    render() {
        return (
            <RVD
                layout={{
                    className: 'aio-login ofy-auto',
                    column: [
                        {
                            className: 'aio-login-form',
                            attrs: { ref: this.dom, onKeyDown: (e) => { if (e.keyCode === 13) { this.onSubmit() } } },
                            column: [
                                {
                                    className: 'of-visible',
                                    column: [
                                        { column: [this.title_layout(), this.subtitle_layout()] },
                                        this.form_layout(),
                                        this.submit_layout(),
                                        {
                                            gap:12,align:'h',
                                            row:[
                                                this.recode_layout(),      
                                                this.changeUserId_layout(),        
                                                
                                            ]
                                        },
                                        this.changeMode_layout(),
                                    ]
                                },
                                { size: 16 }
                            ]
                        }
                    ]
                }}
            />
        )
    }
}
function errorHandler(field, value = '', otpLength) {
    return {
        UserName() {
            if (!value) { return 'نام کاربری را وارد کنید' }
            return false
        },
        PhoneNumber() {
            if (!value) { return 'شماره همراه خود را وارد کنید' }
            if (value.indexOf('09') !== 0) { return 'شماره همراه باید با 09 شروع شود' }
            if (value.length !== 11) { return 'شماره همراه باید 11 رقم باشد' }
            return false
        },
        Email() {
            let atSignIndex = value.indexOf('@');
            if (!value) { return 'ایمیل خود را وارد کنید' }
            if (atSignIndex < 1) { return 'ایمیل خود را به درستی وارد کنید' }
            if (value.indexOf('.') === -1) { return 'ایمیل خود را به درستی وارد کنید' }
            if (value.lastIndexOf('.') > value.length - 3) { return 'ایمیل خود را به درستی وارد کنید' }
            return false
        },
        password() {
            if (value.length < 6) { return 'رمز عبور باید شامل حداقل 6 کاراکتر باشد' }
            return false
        },
        code() {
            let res;
            if (value.length !== otpLength) { res = `کد ورود باید شامل ${otpLength} کاراکتر باشد` }
            else { res = false }
            return res
        }
    }[field](value)
}

class SubmitButton extends Component {
    state = { loading: false, reload: false }
    async onClick() {
        let { onClick, loading } = this.props;
        if (loading) { return; }
        await onClick();
    }
    render() {
        let { disabled, loading, text = 'ورود',outline } = this.props;
        let { reload } = this.state;
        if (loading && !reload) { setTimeout(() => this.setState({ reload: true }), 16 * 1000) }
        let loadingText = reload ? 'بارگزاری مجدد' : 'در حال ارسال';
        let isDisabled = disabled();
        return (
            <>
                <button className={'aio-login-submit' + (outline?' aio-login-submit-outline':'')} disabled={isDisabled} onClick={() => this.onClick()}>
                    {loading ? (<><Icon path={mdiLoading} size={1} spin={0.2} style={{ margin: '0 6px' }} />{loadingText}</>) : text}
                </button>
                {
                    loading &&
                    <div
                        style={{ position: 'fixed', width: '100%', height: '100%', left: 0, top: 0, zIndex: 100000000000000000000000000000000000000 }}
                        onClick={() => { if (reload) { window.location.reload() } }}
                    ></div>
                }
            </>
        )
    }
}

