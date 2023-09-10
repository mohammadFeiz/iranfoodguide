import React, { Component } from 'react';
import RSA from './npm/react-super-app/react-super-app';
import BackOffice from './components/back-office/back-office';
import AIOStorage from './npm/aio-storage/aio-storage';
import AIOService from './npm/aio-service/aio-service';
import RVD from './npm/react-virtual-dom/react-virtual-dom';
import AIOLogin from './npm/aio-login/aio-login';
import { getResponse, getMock } from './apis';
import AppContext from './app-context';
import { dictionary } from './dictionary';
import Axios from 'axios';
import { Icon } from '@mdi/react';
import { mdiClock, mdiComment, mdiTable, mdiWallet } from '@mdi/js';
import logo from './images/logo.png';
import logo2 from './images/logo2.png';
import { icons } from './icons';
import Sefareshe_ghaza from './pages/sefareshe_ghaza';
import Profile from './pages/profile';
import RestoranPage from './components/restoran-page';
import URL from './npm/aio-functions/url';

import './App.css';

export default class App extends Component {
  constructor(props) {
    super(props);
    //this.baseUrl = 'https://localhost:7203'
   this.baseUrl = 'https://iranfoodguide.ir'
    this.state = {
      isLogin: false,
      isRegistered:false,
      registerFields: [
        { type: 'text', label: 'نام', field: 'firstName', required: true },
        { type: 'text', label: 'نام خانوادگی', field: 'lastName', required: true },
        { type: 'text', label: 'ایمیل', field: 'email', required: true },
        { type: 'text', label: 'شبا', field: 'sheba' },
      ]
    }
  }
  async checkToken(token) {
    Axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    try {
      let response = await Axios.get(`${this.baseUrl}/Users/WhoAmI`);
      this.personId = response.data.data.id;
      return !!response.data.isSuccess
    }
    catch (err) {
      try {
        if (err.response) {
          if (err.response.status === 401) { return false }
          return err.response.statusText
        }
        else { return err.message }
      }
      catch { return 'error' }
    }
  }
  async onSubmit(model,mode){
    if(mode === 'OTPPhoneNumber'){
      let response = await Axios.post(`${this.baseUrl}/Users/GenerateUserCode`, { mobileNumber: model.OTPPhoneNumber })
      if (!response.data.isSuccess) { return {mode:'Error',error:response.data.message} }
      let isRegistered = !!response.data.data.isRegistered;
      this.setState({isRegistered});
      return {mode:'OTPCode'}
    }
    else if (mode === 'OTPCode'){
      let response = await Axios.post(`${this.baseUrl}/Users/TokenWithCode`, {mobileNumber: model.OTPPhoneNumber,code: model.OTPCode.toString()});
      if (response.data.isSuccess) {
        this.personId = response.data.data.personId
        return { mode:'Authenticated',token: response.data.data.access_token };
      }
      else {return {mode:'Error',error:response.data.message};} 
    }
    else if (mode === 'PhoneNumber'){
      let {PhoneNumber,password} = model;
    }
  }
  renderLogin() {
    let { registerFields } = this.state;
    return (
      <AIOLogin
        //registerButton='ثبت نام در ایران فود'
        id='iranfoodguide' otpLength={6} methods={['OTPPhoneNumber','PhoneNumber']}
        COMPONENT={({ token, logout, userId }) => this.setState({ token, logout, userId, isLogin: true })}
        registerFields={registerFields}
        checkToken={async (token) => await this.checkToken(token)}
        onSubmit={this.onSubmit.bind(this)}
      />
    )
  }
  render() {
    //return <IranFoodGuide/>
    let { isLogin, token, logout, userId,isRegistered } = this.state;
    if (isLogin) {
      return <IranFoodGuide isRegistered={isRegistered} token={token} personId={this.personId} logout={logout} mobile={userId} roles={[]} baseUrl={this.baseUrl}/>
    }
    let renderLogin = this.renderLogin()
    return (
      <RVD
        layout={{
          className: 'fullscreen login-page',
          column: [
            {
              size: 160,
              column: [
                { flex: 1 },
                { html: <img src={logo2} />, align: 'vh' },
                { size: 16 }
              ]
            },
            {
              flex: 1,
              className: 'login-page-form',
              column: [
                { html: '', className: 'login-bg' },
                { html: '', className: 'login-bg-make-dark' },
                {
                  className: 'login-page-header',
                  column: [
                    { flex: 1 },
                    { html: <img src={logo} />, align: 'vh' },
                    { flex: 1 }
                  ]
                },
                { className: 'p-t-0 ofy-auto', html: renderLogin, flex: 1, align: 'h' },
              ]
            }
          ]
        }}
      />
    )
  }
}
function appSetting(){
  return {
    profileFields:[
      {serverField:'id',clientField:'id',type:'text',label:'آی دی',editable:false},
      {serverField:'mobileNumber',clientField:'mobile',type:'text',label:'شماره همراه',editable:false},
      {serverField:'firstName',clientField:'firstName',type:'text',label:'نام',editable:true},
      {serverField:'lastName',clientField:'lastName',type:'text',label:'نام خانوادگی',editable:true},
      {serverField:'sheba',clientField:'sheba',type:'text',label:'ایمیل',editable:true},
      {serverField:'email',clientField:'email',type:'text',label:'شماره شبا',editable:true},
      {serverField:'password',clientField:'password',type:'text',label:'رمز ورود',editable:true}
    ]
  }
}
class IranFoodGuide extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appSetting:appSetting(),
      isRegistered:props.isRegistered,
      mockStorage:AIOStorage('ifMock'),
      comming_soon: false,
      restoran_tags:[],
      restoran_tags_dic:{},
      mobile: props.mobile,
      personId: props.personId,
      logout: props.logout,
      profile: {},
      discounts: [],
      addresses: [],
      changeStore: this.changeStore.bind(this),
      mojoodiye_kife_pool: 0,
      restoran_tags: [],
      restoran_sort_options: [],
    }
    this.state.apis = AIOService({
      getState: () => this.state,
      baseUrl:props.baseUrl + '/api',
      token: props.token,
      getResponse, getMock,
      id: 'iranfoodguid',
      validation: {
        firstName: 'string',
        lastName: 'string',
        sheba: 'string,undefined',
        email: 'string'
      },
      getError: (res, obj) => {
        if (!res.data.isSuccess) { return res.data.message || 'خطای تعریف نشده' }
      }
    })
  }
  changeStore(obj,caller) {
    this.setState(obj);
  }
  checkOrderId(){
    let urlInstance = new URL();
    let url = window.location.href;
    let json = urlInstance.toJson(url);
    if(json.orderId){
      let { apis } = this.state;
      apis({
        api:'peygiriye_sefaresh',
        name:'پیگیری سفارش',
        parameter:json.orderId,
        callback:(obj)=>{
          let dic = {
            '1':"در انتظار پرداخت می باشد",
            '2':"با موفقیت پرداخت شد",
            '3':"در انتظار پرداخت حضوری می باشد"
          }
          let text = `سفارش با شماره ${obj.id} به مبلغ ${`${obj.totalPrice} ریال`} ${dic[obj.statusId.toString()]}`
          alert(text)
          urlInstance.setPageUrl(urlInstance.remove(urlInstance.getPageUrl(),'orderId'))      
        }
      }) 
    }
  }
  getProfile(){
    let { apis,appSetting } = this.state;
    apis({
      api: 'getProfile',
      callback: (obj) => {
        let fields = appSetting.profileFields;
        let profile = {};
        for(let i = 0; i < fields.length; i++){
          let {serverField,clientField} = fields[i];
          let serverValue;
          eval(`serverValue = obj.${serverField}`);
          profile[clientField] = serverValue; 
        }
        this.setState({ profile })
      },
      name: 'دریافت اطلاعات پروفایل'
    });
  }
  componentDidMount() {
    let { apis } = this.state;
    this.checkOrderId()
    this.getProfile()
    apis({
      api: 'mojoodiye_kife_pool',
      callback: (res) => this.setState({ mojoodiye_kife_pool: res }),
      name: 'دریافت موجودی کیف پول'
    });
    apis({
      api: 'takhfif_ha',
      callback: (res) => { this.setState({ takhfif_ha: res }) },
      name: 'دریافت اطلاعات تخفیف ها'
    });
    apis({
      api: 'getAddresses',
      callback: (res) => this.setState({ addresses: res }),
      name: 'دریافت آدرس ها'
    });
    apis({
      api: 'get_tags',
      parameter:{type:'restoran'},
      name: 'دریافت دسته بندی های رستوران',
      callback: (restoran_tags) => {
        let restoran_tags_dic = {};
        for(let i = 0; i < restoran_tags.length; i++){restoran_tags_dic[restoran_tags[i].id] = restoran_tags[i].name;}
        this.setState({ restoran_tags,restoran_tags_dic })
      }
    })
    apis({
      api: 'restoran_sort_options',
      name: 'دریافت آپشن های مرتب سازی رستوران',
      callback: (restoran_sort_options) => this.setState({ restoran_sort_options })
    })
    
  }
  getContext() {
    return {
      ...this.state,
    }
  }
  render() {
    return (
      <AppContext.Provider value={this.getContext()}>
        <RSA
          title={false}
          navs={[
            { id: 'sefareshe_ghaza', text: dictionary('سفارش غذا'), icon: () => icons('sefareshe_ghaza') },
            { id: 'sabade_kharid', text: dictionary('سبد خرید'), icon: () => icons('sabade_kharid') },
            { id: 'sefaresh_ha', text: dictionary('سفارش ها'), icon: () => icons('sefaresh_ha') },
            { id: 'ertebate_online', text: dictionary('ارتباط آنلاین'), icon: () => icons('ertebate_online') },
            { id: 'profile', text: dictionary('پروفایل'), icon: () => icons('profile') },
            { id: 'admin_panel', text: dictionary('پنل ادمین'), icon: () => icons('profile') },
            
          ]}
          navId='sefareshe_ghaza'
          body={({ navId }) => {
            if (navId === 'sefareshe_ghaza') {return <Sefareshe_ghaza />}
            if (navId === 'profile') {return <Profile />}
            if (navId === 'admin_panel') {return <BackOffice />}
          }}
          getActions={({ addPopup, removePopup }) => {
            let obj = { addPopup, removePopup }
            this.state.rsa_actions = obj;
            this.setState({ rsa_actions: obj })
          }}
          header={() => <AppHeader SetState={(obj)=>this.setState(obj)}/>}
        />
      </AppContext.Provider>
    )
  }
}

class AppHeader extends Component {
  renderIcon(icon,badge){
    return (
      <>
        {icons(icon, { className: 'header-icon' })}
        {!!badge && <div className='header-badge'>{badge}</div>}
      </>
    )
  }
  profile_layout(){
    let {SetState} = this.props;
    return {className: 'of-visible', align: 'v',html: this.renderIcon('account'),onClick:()=>SetState({backOffice:true})}
  }
  logo_layout(){
    return {
      className: 'of-visible', align: 'v',
      html: icons('logo', { fill: '#fff', style: { transform: 'translateY(-4px)' } })
    }
  }
  notif_layout(){
    return {className: 'of-visible', align: 'v',html: this.renderIcon('bell',3)}
  }
  message_layout(){
    return {className: 'of-visible', align: 'v',html: this.renderIcon('message',3)}
  }
  render() {
    return (
      <RVD
        layout={{
          className: 'of-visible p-h-12 w-100', gap: 6,
          row: [
            this.profile_layout(),
            { flex: 1 },
            this.logo_layout(),
            this.notif_layout(),
            this.message_layout(),
          ]
        }}
      />
    )
  }
}