import React, { Component } from 'react';
import RSA from './npm/react-super-app/react-super-app';
import CommingSoon from './components/comming-soon/commin-soon';
import BackOffice from './components/back-office/back-office';
import AIOService from './npm/aio-service/aio-service';
import RVD from './npm/react-virtual-dom/react-virtual-dom';
import AIOLogin from './npm/aio-login/aio-login';
import { getResponse,getMock } from './apis';
import AppContext from './app-context';
import { dictionary } from './dictionary';
import Axios from 'axios';
import {Icon} from '@mdi/react';
import { mdiClock, mdiComment, mdiTable, mdiWallet } from '@mdi/js';
import logo from './images/logo.png';
import logo2 from './images/logo2.png';
import { icons } from './icons';
import Sefareshe_ghaza from './pages/sefareshe_ghaza';
import Profile from './pages/profile';
import Tab3 from './pages/tab3';
import RestoranPage from './components/restoran-page';

import './App.css';

export default class App extends Component {
  constructor(props) {
    super(props);
    //this.baseUrl = 'https://localhost:7203'
    this.baseUrl = 'https://iranfoodguide.ir'
    this.state = { 
      backOffice: false,isLogin:false,
      registerFields:[
        { type: 'text', label: 'نام', field: 'firstName',required:true, rowKey: '1' },
        { type: 'html', html: () => '', rowWidth: 12, rowKey: '1' },
        { type: 'text', label: 'نام خانوادگی', field: 'lastName',required:true, rowKey: '1' },
        { type: 'text', label: 'ایمیل', field: 'email',required:true, rowKey: '2' },
        { type: 'text', label: 'شبا', field: 'sheba' },
      ]
    }
  }
  async checkToken(token){
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
  async onSubmitUserId({mode,userId,registered}){//return boolean or string
    let response = await Axios.post(`${this.baseUrl}/Users/GenerateUserCode`, { mobileNumber: userId })
    if (!response.data.isSuccess) { return response.data.message }
    return !!response.data.data.isRegistered;
  }
  async onRegister ({registerModel,mode,userId}){//return string or true
    let apis = getResponse({})
    let {firstName,lastName,email,sheba} = registerModel;
    let { response } = await apis.setProfile({
      profile: {firstName,lastName,email,sheba}, 
      mobileNumber:userId,
      registered: false
    })
    if (response.data.isSuccess) {return true}
    else {return response.data.message}
  }
  async onSubmitPassword({mode,userId,password}){//return string or true
    let response = await Axios.post(`${this.baseUrl}/Users/TokenWithCode`, {
      mobileNumber: userId,
      code: password.toString()
    });
    if (response.data.isSuccess) {
      this.personId = response.data.data.personId
      return {token:response.data.data.access_token};
    }
    else{
      return response.data.message || 'error';
    }
  }
  renderLogin(){
    let {registerFields} = this.state;
    return (
      <AIOLogin
        id='iranfoodguide' otpLength={6} methods={['OTPPhoneNumber']}
        COMPONENT={({ token, logout, userId }) => this.setState({token,logout,userId,isLogin:true})}
        registerFields={registerFields}
        checkToken={async (token) => await this.checkToken(token)}
        onRegister={async (obj) => await this.onRegister(obj)}
        onSubmitUserId={async (obj) => await this.onSubmitUserId(obj)}
        onSubmitPassword={async (obj) => await this.onSubmitPassword(obj)}
      />
    )
  }
  render() {
    let { isLogin,token, logout, userId } = this.state;
    isLogin = true;
    if(isLogin){
      return <IranFoodGuide token={token} personId={this.personId} logout={logout} mobileNumber={userId} roles={[]}/>
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
                { className: 'p-t-0 ofy-auto', html:renderLogin, flex: 1,align:'h' },
              ]
            }
          ]
        }}
      />
    )
  }
}

class IranFoodGuide extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comming_soon: false,
      mobileNumber:props.mobileNumber,
      personId: props.personId,
      logout: props.logout,
      profile: {},
      discounts: [],
      addresses:[],
      ChangeState: this.ChangeState.bind(this),
      mojoodiye_kife_pool: 0,
      restoran_category_options:[],
      restoran_sort_options:[],
    }
    this.state.apis = AIOService({
      getState: () => this.state,
      token: props.token,
      getResponse,getMock,
      id: 'iranfoodguid',
      validation:{
        firstName:'string',
        lastName:'string',
        sheba:'string,undefined',
        email:'string'
      },
      getError: (res, obj) => {
        if (!res.data.isSuccess) { return res.data.message || 'خطای تعریف نشده' }
      }
    })
  }
  ChangeState(obj){
    this.setState(obj);
  }
  componentDidMount() {
    let { apis } = this.state;
    apis({
      api: 'getProfile',
      callback: ({firstName,lastName,sheba,email,id}) => {
        this.ChangeState(
          {profile: {firstName,lastName,sheba,email,id}},
          'IranFoodGuide Component => getProfile'
        )
      },
      name: 'دریافت اطلاعات پروفایل'
    });
    apis({
      api: 'mojoodiye_kife_pool',
      callback: (res) => this.setState({ mojoodiye_kife_pool: res }),
      name: 'دریافت موجودی کیف پول'
    });
    apis({
      api: 'takhfif_ha',
      callback: (res) =>{this.setState({ takhfif_ha: res })},
      name: 'دریافت اطلاعات تخفیف ها'
    });
    apis({
      api: 'getAddresses',
      callback: (res) => this.setState({ addresses: res }),
      name: 'دریافت آدرس ها'
    });
    apis({
      api:'restoran_category_options',
      name:'دریافت دسته بندی های رستوران',
      callback:(restoran_category_options)=>this.setState({restoran_category_options})
    })
    apis({
        api:'restoran_sort_options',
        name:'دریافت آپشن های مرتب سازی رستوران',
        callback:(restoran_sort_options)=>this.setState({restoran_sort_options})
    })
  }
  getContext(){
    return {
      ...this.state,
    }
  }
  render() {
    let { comming_soon } = this.state;
    return (
      <AppContext.Provider value={this.getContext()}>
        {comming_soon && <CommingSoon />}
        {
          !comming_soon &&
          <RSA
            title={false}
            navs={[
              { id: 'sefareshe_ghaza', text: dictionary('سفارش غذا'), icon: () => icons('sefareshe_ghaza') },
              { id: 'sabade_kharid', text: dictionary('سبد خرید'), icon: () => icons('sabade_kharid') },
              { id: 'sefaresh_ha', text: dictionary('سفارش ها'), icon: () => icons('sefaresh_ha') },
              { id: 'ertebate_online', text: dictionary('ارتباط آنلاین'), icon: () => icons('ertebate_online') },
              { id: 'profile', text: dictionary('پروفایل'), icon: () => icons('profile') },
            ]}
            navId='sefaresh_ha'
            body={({ navId }) => {
              if (navId === 'sefareshe_ghaza') {
                return <Sefareshe_ghaza />
              }
              if (navId === 'profile') {
                return <Profile />
              }
              if (navId === 'sefaresh_ha') {
                return <Tab3/>
              }
              if (navId === 'ertebate_online') {
                return <RestoranPage/>
              }
            }}
            getActions={({ addPopup, removePopup }) => {
              let obj = { addPopup, removePopup }
              this.state.rsa_actions = obj;
              this.setState({ rsa_actions: obj })
            }}
            header={() => {
              return (
                <RVD
                  layout={{
                    className: 'of-visible p-h-12 w-100', gap: 6,
                    row: [
                      {
                        className: 'of-visible', align: 'v',
                        html: (
                          <>
                            {icons('account', { className: 'header-icon' })}
                            {false && <div className='header-badge'></div>}
                          </>
                        )
                      },
                      { flex: 1 },
                      {
                        className: 'of-visible', align: 'v',
                        html: icons('logo', { fill: '#fff', style: { transform: 'translateY(-4px)' } })
                      },
                      {
                        className: 'of-visible', align: 'v',
                        html: (
                          <>
                            {icons('bell', { className: 'header-icon' })}
                            {<div className='header-badge'>{3}</div>}
                          </>
                        )
                      },
                      {
                        className: 'of-visible', align: 'v',
                        html: (
                          <>
                            {icons('message', { className: 'header-icon' })}
                            {<div className='header-badge'>{3}</div>}
                          </>
                        )
                      },
                    ]
                  }}
                />
              )
            }}
          />
        }
      </AppContext.Provider>

    )
  }
}

