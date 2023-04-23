import React, { Component } from 'react';
import RSA, { OTP } from './npm/react-super-app/react-super-app';
import CommingSoon from './components/comming-soon/commin-soon';
import BackOffice from './components/back-office/back-office';
import AIOService from './npm/aio-service/aio-service';
import RVD from './npm/react-virtual-dom/react-virtual-dom';
import { getResponse } from './apis';
import AppContext from './app-context';
import { dictionary } from './dictionary';
import Axios from 'axios';
import logo from './images/logo.png';
import logo2 from './images/logo2.png';
import { icons } from './icons';
import Sefareshe_ghaza from './pages/sefareshe_ghaza';
import Profile from './pages/profile';
import './App.css';
import AIOButton from './npm/aio-button/aio-button';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = { backOffice: false }
  }
  render() {
    let { backOffice } = this.state;
    // let baseUrl = 'https://localhost:7203'
    let baseUrl = 'https://iranfoodguide.ir'
    return (
      <OTP
        id='iranfoodguide'
        COMPONENT={({ token, logout, mobile }) => {
          return (
            <IranFoodGuide
              token={token}
              personId={this.personId}
              logout={logout}
              mobileNumber={mobile}
              roles={[]}
            />
          )
        }}
        varifiedCode={undefined}
        codeLength={6}
        fields={[
          { type: 'text', label: 'نام', field: 'firstname', rowKey: '1' },
          { type: 'html', html: () => '', rowWidth: 12, rowKey: '1' },
          { type: 'text', label: 'نام خانوادگی', field: 'lastname', rowKey: '1' },
          { type: 'select', label: 'جنسیت', field: 'gender', options: [{ text: 'مرد', value: 'male' }, { text: 'زن', value: 'female' }], rowKey: '2' },
          { type: 'html', html: () => '', rowWidth: 12, rowKey: '2' },
          { type: 'text', label: 'ایمیل', field: 'email', rowKey: '2' },
          { type: 'text', label: 'شبا', field: 'sheba' },
        ]}
        checkToken={async (token) => { // if error occured return error messsage - else if token is valid return true - else if token is not valid return false 
          let response;
          Axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          try {
            response = await Axios.get(`${baseUrl}/Users/WhoAmI`);
            this.personId = response.data.data.id;
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
          return response.data.isSuccess || 'error'
        }}
        onRegister={async ({ model, number }) => {
          let apis = getResponse()
          let {firstName,lastName,email,sheba} = model;
          let { response } = await apis.setProfile({
            profile: {firstName,lastName,email,sheba}, 
            mobileNumber:number,
            registered: false
          })
          if (response.data.isSuccess) {
            this.setState({ resigtered: true })
            this.onInterNumber(number)
            return true
          }
          else {return response.data.message}
        }}
        onInterNumber={async (number) => {//return boolean
          let response = await Axios.post(`${baseUrl}/Users/GenerateUserCode`, { mobileNumber: number })
          debugger;
          if (!response.data.isSuccess) { return response.data.message }
          return response.data.data.isRegistered;
        }}
        onInterCode={async ({ number, code, model }) => {//return string or false
          let response = await Axios.post(`${baseUrl}/Users/TokenWithCode`, {
            mobileNumber: number,
            code: code.toString()
          });
          if (response.data.isSuccess) {
            this.personId = response.data.data.personId
            return response.data.data.access_token;
          }
          else
            return false;
        }}
        // registerFields={[
        //   {label:'نام',field:'FirstName',type:'text',icon:<Icon path={mdiAccountBoxOutline} size={1}/>},
        //   {label:'نام خانوادگی',field:'LastName',type:'text',icon:<Icon path={mdiAccountBoxOutline} size={1}/>},
        //   {label:'ایمیل',field:'Email',type:'text',icon:<Icon path={mdiEmailOutline} size={1}/>},
        // ]}
        layout={(html) => {
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
                      { className: 'p-t-0 ofy-auto', html, flex: 1 },
                    ]
                  }
                ]
              }}
            />
          )
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
      ChangeState: this.ChangeState.bind(this),
      mojoodiye_kife_pool: 0
    }
    this.state.apis = AIOService({
      getState: () => this.state,
      token: props.token,
      getResponse,
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
  async getProfile() {
    let { apis } = this.state;
    await apis({
      api: 'getProfile',
      callback: ({firstName,lastName,sheba,email,id}) => {
        this.ChangeState(
          {profile: {firstName,lastName,sheba,email,id}},
          'IranFoodGuide Component => getProfile'
        )
      },
      name: 'دریافت اطلاعات پروفایل'
    });
  }
  async getKife_pool() {
    let { apis } = this.state;
    await apis({
      api: 'mojoodiye_kife_pool',
      callback: (res) => this.setState({ mojoodiye_kife_pool: res }),
      name: 'دریافت موجودی کیف پول'
    });
  }
  async get_takhfif_ha() {
    let { apis } = this.state;
    await apis({
      api: 'takhfif_ha',
      callback: (res) => this.setState({ takhfif_ha: res }),
      name: 'دریافت اطلاعات تخفیف ها'
    });
  }
  componentDidMount() {
    this.getProfile();
    this.getKife_pool();
    this.get_takhfif_ha();
  }
  render() {
    let { comming_soon } = this.state;

    return (
      <AppContext.Provider value={this.state}>
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
            navId='profile'
            body={({ navId }) => {
              if (navId === 'sefareshe_ghaza') {
                return <Sefareshe_ghaza />
              }
              if (navId === 'profile') {
                return <Profile />
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