import React, { Component } from 'react';
import RSA from './npm/react-super-app/react-super-app';
import BackOffice from './components/back-office/back-office';
import AIOStorage from 'aio-storage';
import AIOService from 'aio-service';
import RVD from './npm/react-virtual-dom';
import AIOLogin from 'aio-login';
import getApiFunctions from './apis/apis';
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
import ReservePanel from './components/reserve-panel/reserve-panel';
import URL from './npm/aio-functions/url';

import './App.css';
//تنظیمات دیفالت AIOInput
export default class App extends Component {
  constructor(props) {
    super(props);
   // this.baseUrl = 'https://localhost:7203'
    this.baseUrl = 'https://iranfoodguide.ir'
    this.state = {
      loginClass: new AIOLogin({
        id: 'iranfoodguide', otpLength: 6, modes: ['OTPNumber', 'phoneNumber'],
        timer: 10,
        onAuth: ({ token, userId }) => {
          let {apis} = this.state;
          apis.setToken(token);
          this.setState({ userId, isLogin: true })
        },
        checkToken: async (token, obj) => await this.checkToken(token, obj),
        onSubmit: this.onSubmit.bind(this),
      }),
      isLogin: false,
      apis:new AIOService({
        baseUrl: this.baseUrl + '/api', getApiFunctions, id: 'iranfoodguid',
        getError: (res, obj) => {
          if (!res.data.isSuccess) { return res.data.message || 'خطای تعریف نشده' }
        }
      })
    }
  }
  async checkToken(token, { userId }) {
    Axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    try {
      let response = await Axios.get(`${this.baseUrl}/Users/WhoAmI`);
      try { this.personId = response.data.data.id; }
      catch { }
      if (response.data.isSuccess) {
        this.mobile = userId;
        this.isRegistered = true
      }
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
  async onSubmit(model, mode) {
    if (mode === 'OTPNumber') {
      let response = await Axios.post(`${this.baseUrl}/Users/GenerateUserCode`, { mobileNumber: model.login.userId })
      if (!response.data.isSuccess) { return response.data.message }
      let isRegistered = !!response.data.data.isRegistered;
      this.isRegistered = isRegistered;
      this.mobile = model.login.userId;
      let {loginClass} = this.state;
      loginClass.setMode('OTPCode')
    }
    else if (mode === 'OTPCode') {
      let response = await Axios.post(`${this.baseUrl}/Users/TokenWithCode`, { mobileNumber: model.login.userId, code: model.login.password.toString() });
      if (response.data.isSuccess) {
        let {loginClass} = this.state;
        this.personId = response.data.data.personId
        this.mobile = model.login.userId;
        loginClass.setToken(response.data.data.access_token)
        loginClass.setMode('auth');
      }
      else { return response.data.message }
    }
    else if (mode === 'phoneNumber') {
      let { userId, password } = model.login;
      let response = await Axios.post(`${this.baseUrl}/Users/Token`, { Username: userId, Password: password, grant_type: "password" });
      if (response.data.isSuccess) {
        let {loginClass} = this.state;
        this.personId = response.data.data.personId;
        this.isRegistered = !!this.personId;
        this.mobile = userId;
        loginClass.setToken(response.data.data.access_token)
        loginClass.setMode('auth')
      }
      else { return response.data.message }
    }
  }
  renderLogin() {
    let { loginClass } = this.state;
    return (loginClass.render())
  }
  render() {
    //return <IranFoodGuide/>
    let { loginClass, isLogin,apis } = this.state;
    if (isLogin) {
      if (!this.isRegistered) { loginClass.removeToken() }
      return <IranFoodGuide isRegistered={this.isRegistered} personId={this.personId} loginClass={loginClass} apis={apis} mobile={this.mobile} roles={[]} baseUrl={this.baseUrl} />
    }
    let renderLogin = this.renderLogin()
    return (
      <RVD
        layout={{
          className: 'fullscreen login-page',
          column: [
            {size: 160,column: [{ flex: 1 },{ html: <img src={logo2} />, align: 'vh' },{ size: 16 }]},
            {
              flex: 1,className: 'login-page-form',
              column: [
                { html: '', className: 'login-bg' },
                { html: '', className: 'login-bg-make-dark' },
                {className: 'login-page-header',column: [{ flex: 1 },{ html: <img src={logo} />, align: 'vh' },{ flex: 1 }]},
                { className: 'p-t-0 ofy-auto', html: renderLogin, flex: 1, align: 'h' },
              ]
            }
          ]
        }}
      />
    )
  }
}
function appSetting() {
  return {
    profileFields: [
      { serverField: 'id', clientField: 'id', type: 'text', label: 'آی دی', editable: false },
      { serverField: 'mobileNumber', clientField: 'mobile', type: 'text', label: 'شماره همراه', editable: false },
      { serverField: 'firstName', clientField: 'firstName', type: 'text', label: 'نام', editable: true },
      { serverField: 'lastName', clientField: 'lastName', type: 'text', label: 'نام خانوادگی', editable: true },
      { serverField: 'sheba', clientField: 'sheba', type: 'text', label: 'ایمیل', editable: true },
      { serverField: 'email', clientField: 'email', type: 'text', label: 'شماره شبا', editable: true }
    ]
  }
}
class IranFoodGuide extends Component {
  constructor(props) {
    super(props);
    props.apis.setProperty('getState',()=>this.state)
    this.state = {
      mock:{
        reserve:false
      },
      loginClass:props.loginClass,
      apis:props.apis,
      rsa: new RSA({ rtl: true }),
      appSetting: appSetting(),
      isRegistered: props.isRegistered,
      mockStorage: AIOStorage('ifMock'),
      comming_soon: false,
      restoran_tags: [],
      restoran_tags_dic: {},
      mobile: props.mobile,
      personId: props.personId,
      profile: {},
      discounts: [],
      addresses: [],
      changeStore: this.changeStore.bind(this),
      mojoodiye_kife_pool: 0,
      restoran_tags: [],
      restoran_sort_options: [],
      MapRestorans: (data) => {
        return data.map((o) => {
          let { address, types, workingTimes = {} } = o;
          if (!types || types === null) { types = [] }
          return {
            id: o.id, //String آی دی رستوران
            name: o.title, //String نام رستوران
            latitude: address.latitude, //Number موقعیت رستوران در راستای لتیتیود
            longitude: address.longitude, //Number موقعیت رستوران در راستای لانگیتیود
            phone: address.phoneNumber,//String تلفن رستوران
            image: o.image, //String یو آر ال تصویر رستوران
            logo: o.logo, //String یو آر ال لوگوی رستوران
            address: o.address.address, //String آدرس رستوران
            deliveryTime: o.deliveryTime, //Number مدت زمان ارسال به دقیقه
            tags: types.map((t) => t.typeId), //ArrayOfStrings آرایه ای از آی دی تگ های رستوران
            startTime: workingTimes[0].startTime, //Number bewtween (1 and 24) زمان شروع به کار
            endTime: workingTimes[0].endTime, //Number bewtween (1 and 24) زمان پایان کار
            tax: o.tax
          }
        })
      }
    }
  }
  changeStore(obj, caller) {
    this.setState(obj);
  }
  checkOrderId() {
    let urlInstance = new URL();
    let url = window.location.href;
    let json = urlInstance.toJson(url);
    if (json.orderId) {
      let { apis } = this.state;
      apis.request({
        api: 'peygiriye_sefaresh',
        description: 'پیگیری سفارش',
        parameter: json.orderId,
        onSuccess: (obj) => {
          let dic = {
            '1': "در انتظار پرداخت می باشد",
            '2': "با موفقیت پرداخت شد",
            '3': "در انتظار پرداخت حضوری می باشد"
          }
          let text = `سفارش با شماره ${obj.id} به مبلغ ${`${obj.totalPrice} ریال`} ${dic[obj.statusId.toString()]}`
          alert(text)
          urlInstance.setPageUrl(urlInstance.remove(urlInstance.getPageUrl(), 'orderId'))
        }
      })
    }
  }
  getProfile() {
    let { apis, appSetting } = this.state;
    apis.request({
      api: 'profile.getProfile',
      onSuccess: (obj) => {
        let fields = appSetting.profileFields;
        let profile = {};
        for (let i = 0; i < fields.length; i++) {
          let { serverField, clientField } = fields[i];
          let serverValue;
          eval(`serverValue = obj.${serverField}`);
          profile[clientField] = serverValue;
        }
        this.setState({ profile })
      },
      description: 'دریافت اطلاعات پروفایل'
    });
  }
  componentDidMount() {
    let { apis, isRegistered, rsa } = this.state;
    this.checkOrderId()
    if (isRegistered) {
      this.getProfile()
      apis.request({
        api: 'profile.mojoodiye_kife_pool',
        onSuccess: (res) => this.setState({ mojoodiye_kife_pool: res }),
        description: 'دریافت موجودی کیف پول'
      });
      apis.request({
        api: 'profile.takhfif_ha',
        onSuccess: (res) => { this.setState({ takhfif_ha: res }) },
        description: 'دریافت اطلاعات تخفیف ها'
      });
      apis.request({
        api: 'profile.getAddresses',
        onSuccess: (res) => this.setState({ addresses: res }),
        description: 'دریافت آدرس ها'
      });
    }
    else {
      rsa.addSnakebar({
        type: 'warning',
        text: 'شما ثبت نام نکرده اید',
        subtext: 'برای استفاده از بخش های مختلف از منوی پروفایل ثبت نام کنید',
        action: {
          text: 'ثبت نام',
          onClick: () => rsa.setNavId('profile')
        }
      })
    }
    apis.request({
      api: 'backOffice.get_tags',
      parameter: { type: 'restoran' },
      description: 'دریافت دسته بندی های رستوران',
      onSuccess: (restoran_tags) => {
        let restoran_tags_dic = {};
        for (let i = 0; i < restoran_tags.length; i++) { restoran_tags_dic[restoran_tags[i].id] = restoran_tags[i].name; }
        this.setState({ restoran_tags, restoran_tags_dic })
      }
    })
    apis.request({
      api: 'backOffice.restoran_sort_options',
      description: 'دریافت آپشن های مرتب سازی رستوران',
      onSuccess: (restoran_sort_options) => this.setState({ restoran_sort_options })
    })

  }
  openModal(key, parameter) {
    let { rsa } = this.state;
    if (key === 'back_office') {
      rsa.addModal({
        header: { title: 'پنل مدیریت' },
        body: {
          render: () => {
            return <BackOffice />
          }
        }
      })

    }
    else if (key === 'reserve_admin') {
      rsa.addModal({
        header: { title: 'پنل رزرو' },
        body: {
          render: () => {
            return <ReservePanel />
          }
        }
      })

    }
  }
  getContext() {
    return {
      ...this.state,
    }
  }
  render() {
    let { rsa } = this.state;
    return (
      <AppContext.Provider value={this.getContext()}>
        {
          rsa.render({
            title: false,
            navs: [
              { id: 'sefareshe_ghaza', text: dictionary('سفارش غذا'), icon: () => icons('sefareshe_ghaza') },
              { id: 'sabade_kharid', text: dictionary('سبد خرید'), icon: () => icons('sabade_kharid') },
              { id: 'sefaresh_ha', text: dictionary('سفارش ها'), icon: () => icons('sefaresh_ha') },
              { id: 'ertebate_online', text: dictionary('ارتباط آنلاین'), icon: () => icons('ertebate_online') },
              { id: 'profile', text: dictionary('پروفایل'), icon: () => icons('profile') },
            ],
            side: {
              items: [
                { id: 'back-office', text: 'پنل مدیریت', icon: icons('back_office'), onClick: () => this.openModal('back_office') },
                { id: 'reserve_admin', text: 'پنل رزرو', icon: icons('reserve_admin'), onClick: () => this.openModal('reserve_admin') }
              ],
              header: () => {
                return (
                  <RVD
                    layout={{
                      style: { height: 72 },
                      align: 'vh',
                      column: [
                        { html: icons('logo', { fill: '#fff', style: { transform: 'translateY(-4px)' } }) }
                      ]
                    }}
                  />
                )
              }
            },
            navId: 'sefareshe_ghaza',
            body: ({ navId }) => {
              if (navId === 'sefareshe_ghaza') { return <Sefareshe_ghaza /> }
              if (navId === 'profile') { return <Profile /> }
            },
            header: () => <AppHeader SetState={(obj) => this.setState(obj)} />
          })
        }
      </AppContext.Provider>
    )
  }
}

class AppHeader extends Component {
  static contextType = AppContext
  renderIcon(icon, badge) {
    return (
      <>
        {icons(icon, { className: 'header-icon' })}
        {!!badge && <div className='header-badge'>{badge}</div>}
      </>
    )
  }
  side_layout() {
    let { rsa } = this.context;
    return {
      className: 'of-visible', align: 'vh',
      onClick: () => rsa.openSide(),
      html: icons('side')
    }
  }
  profile_layout() {
    let { SetState } = this.props;
    return { className: 'of-visible', align: 'v', html: this.renderIcon('account'), onClick: () => SetState({ backOffice: true }) }
  }
  logo_layout() {
    return {
      className: 'of-visible', align: 'v',
      html: icons('logo', { fill: '#fff', style: { transform: 'translateY(-4px)' } })
    }
  }
  notif_layout() {
    return { className: 'of-visible', align: 'v', html: this.renderIcon('bell', 3) }
  }
  message_layout() {
    return { className: 'of-visible', align: 'v', html: this.renderIcon('message', 3) }
  }
  render() {
    return (
      <RVD
        layout={{
          className: 'of-visible p-h-12 w-100', gap: 6,
          row: [
            this.side_layout(),
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