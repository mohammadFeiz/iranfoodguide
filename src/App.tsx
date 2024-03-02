import React, { Component, useContext } from 'react';
import RSA from './npm/react-super-app/react-super-app';
import BackOffice from './components/back-office/back-office.tsx';
import AIOStorage from 'aio-storage';
import AIOService from 'aio-service';
import RVD from './npm/react-virtual-dom/index.tsx';
import AIOLogin,{I_AIOLogin, I_AL_props} from './npm/aio-login/index.tsx';
import APISClass, { I_APIClass, I_getWalletAmount_result } from './apis/APIClass.tsx';
import AppContext from './app-context';
import { dictionary } from './dictionary';
import logo from './images/logo.png';
import logo2 from './images/logo2.png';
import { icons } from './icons';
import Sefareshe_ghaza from './pages/sefareshe_ghaza';
import Profile from './pages/profile.tsx';
import ReservePanel from './components/reserve-panel/reserve-panel';
import URL from './npm/aio-functions/url';
import './App.css';
import { I_address, I_profile, I_restoran_server, I_tag, I_state, I_state_key, I_food_server, I_food, I_restoranId, I_foodToServer_r, I_rsa_props, I_discount, I_restoran_sort_option } from './typs.tsx';
import LoginApis, { I_loginApis } from './apis/LoginApis.tsx';
//تنظیمات دیفالت AIOInput
type I_App = {}
type I_App_state = {
  Login:I_AIOLogin,
  APIS:any,
  loginApis:I_loginApis
}
export default class App extends Component <I_App,I_App_state> {
  baseUrl:string;
  constructor(props) {
    super(props);
   // this.baseUrl = 'https://localhost:7203'
    this.baseUrl = 'https://iranfoodguide.ir'
    let APIS = new APISClass({
      id:'ifgapis',baseUrl: this.baseUrl + '/api',
      getError: (res, obj) => {
        if (!res.data.isSuccess) { return res.data.message || 'خطای تعریف نشده' }
      }
    })
    let AIOLoginProps:I_AL_props = {
      id: 'iranfoodguide', otpLength: 6, modes: ['OTPNumber', 'phoneNumber'],timer: 10,
      renderApp:({token})=>{
        let {Login,APIS} = this.state;
        let {isRegistered} = Login.getUserInfo();
        if(!isRegistered){Login.setToken(false)}
        let props:I_IranFoodGuide = {Login,APIS}
        return (<IranFoodGuide {...props}/>)
      },
      renderLogin:(loginForm)=>{
        return (
          <RVD
            layout={{
              className: 'fullscreen login-page',
              column: [
                {size: 160,column: [{ flex: 1 },{ html: <img src={logo2 as string} />, align: 'vh' },{ size: 16 }]},
                {
                  flex: 1,className: 'login-page-form',
                  column: [
                    { html: '', className: 'login-bg' },
                    { html: '', className: 'login-bg-make-dark' },
                    {className: 'login-page-header',column: [{ flex: 1 },{ html: <img src={logo as string} />, align: 'vh' },{ flex: 1 }]},
                    { className: 'p-t-0 ofy-auto', html: loginForm, flex: 1, align: 'h' },
                  ]
                }
              ]
            }}
          />
        )
      },
      checkToken: async (token) => {
        debugger
        if(!token){return false}
        let {Login,loginApis} = this.state;
        let res = await loginApis.checkToken(token);
        if(res === false){return false}
        else if(typeof res === 'object'){
          Login.updateUserInfo('id',res.id);
          return true
        }
      },
      onSubmit: async (model, mode) => {
        let {Login,loginApis} = this.state;
        let { userId, password } = model.login;
        if (mode === 'OTPNumber') {
          let res = await loginApis.OTPNumber(userId);
          if(res === false){return false}
          Login.updateUserInfo('isRegistered',res.isRegistered)
        }
        else if (mode === 'OTPCode') {
          let res = await loginApis.OTPCode({ mobileNumber: userId, code: password });
          if(res === false){return false} 
          Login.updateUserInfo('id',res.id);
          Login.setToken(res.token);
        }
        else if (mode === 'phoneNumber') {
          let res = await loginApis.PhoneNumber({ userId, password });
          if(res === false){return false} 
          Login.updateUserInfo('id',res.id);
          Login.updateUserInfo('isRegistered',res.id !== undefined);
          Login.setToken(res.token);
        }
        return true
      },
    }
    let Login:I_AIOLogin = new AIOLogin(AIOLoginProps)
    let loginApis = new LoginApis({id:'ifgloginapis',baseUrl:this.baseUrl,getError:(response)=>{if (!response.data.isSuccess) { return response.data.message }}}) 
    this.state = {Login,APIS,loginApis}
  }
  render() {
    let { Login } = this.state;
    return Login.render()
  }
}
type I_IranFoodGuide = {
  Login:I_AIOLogin,
  APIS:I_APIClass
}
class IranFoodGuide extends Component <I_IranFoodGuide,I_state> {
  constructor(props) {
    super(props);
    props.APIS.setProperty('getAppState',()=>this.state);
    let rsaProps:I_rsa_props = {
      rtl:true,title: false,maxWidth:770,id:'iranfoodguideapp',
      nav:{
        id:'sefareshe_ghaza',
        items:()=>[
          { id: 'sefareshe_ghaza', text: dictionary('سفارش غذا'), icon: () => icons('sefareshe_ghaza'),render:()=><Sefareshe_ghaza /> },
          { id: 'sabade_kharid', text: dictionary('سبد خرید'), icon: () => icons('sabade_kharid') },
          { id: 'sefaresh_ha', text: dictionary('سفارش ها'), icon: () => icons('sefaresh_ha') },
          { id: 'ertebate_online', text: dictionary('ارتباط آنلاین'), icon: () => icons('ertebate_online') },
          { id: 'profile', text: dictionary('پروفایل'), icon: () => icons('profile'),render:()=><Profile /> },
        ]
      },
      side: {
        items: [
          { text: 'پنل مدیریت', icon: icons('back_office'), onClick: () => this.openModal('back_office') },
          { text: 'پنل رزرو', icon: icons('reserve_admin'), onClick: () => this.openModal('reserve_admin') }
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
      body: (activeNavItem) => activeNavItem.render(),
      header: () => <AppHeader/>
    }
    let state:I_state = {
      mock:{
        reserve:false
      },
      discounts:[],
      Login:props.Login,
      APIS:props.APIS,
      rsa: new RSA(rsaProps),
      mockStorage: AIOStorage('ifMock'),
      restoran_tags: [],
      profile: false,
      addresses: [],
      changeStore: this.changeStore.bind(this),
      wallet: 0,
      food_tags: [],
      restoran_sort_options: [],
      restoranToClient:this.restoranToClient.bind(this),
      foodToClient:this.foodToClient.bind(this),
      foodToServer:this.foodToServer.bind(this),
    }
    this.state = state
  }
  restoranToClient(serverData:I_restoran_server){
    let { id,title,image,logo,deliveryTime,address,tax, types, workingTimes = {} } = serverData;
      if (!types || types === null) { types = [] }
      return {
        id,name:title,image,logo,deliveryTime,tax,
        latitude: address.latitude,longitude: address.longitude,phone: address.phoneNumber,address:address.address,
        tags: types.map((t) => t.typeId),
        startTime: workingTimes[0].startTime,
        endTime: workingTimes[0].endTime
      }
  }
  foodToClient(serverData:I_food_server){
    let {id,name,parentFoodId,menuCategoryTitle,image,price,discountPercent,description,types} = serverData;
    parentFoodId = parentFoodId === null?undefined:parentFoodId
    return {
      id,name,parentId: parentFoodId,menuCategory: menuCategoryTitle,image,price,
      discountPercent,description,review: description,tags: types.map((o)=>o.typeId),
    }
  }
  foodToServer(food:I_food,type:'add' | 'edit',restoranId:I_restoranId){
    let {id,name,description,parentId,menuCategory,discountPercent} = food;
    let res:I_foodToServer_r = {
      "id": type === 'edit' ? id : undefined,
      "title": name,
      "food": {
          //"types": food.tags.map((o) => { return { typeId: o } }),
          "types": [],
          "title": food.name,
          "latinTitle": food.name,
          "description": description
      },
      "restaurantId": restoranId,
      "parentFoodId": parentId,
      "menuCategoryTitle": menuCategory,
      "price": food.price,
      "description": description,
      //"inventoryCount": 0,
      "isFavorite": true,
      "discount": discountPercent
    }
    return res
  }
  changeStore(key:I_state_key,value:any,caller:string) {
    let changeObj = {[key]:value} as I_state 
    this.setState(changeObj);
  }
  checkOrderId() {
    let urlInstance = new URL();
    let url = window.location.href;
    let json = urlInstance.toJson(url);
    if (json.orderId) {
      let { APIS } = this.state;
      APIS.peygiriye_sefaresh(json.orderId,{
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
  async componentDidMount() {
    let { APIS, Login, rsa } = this.state;
    this.checkOrderId()
    let {isRegistered} = Login.getUserInfo();
    if (isRegistered) {
      await APIS.profile_get(null,{
        onSuccess:(profile:I_profile)=>this.setState({ profile })
      });
      APIS.getWalletAmount(null,{
        onSuccess: (res:I_getWalletAmount_result) => this.setState({ wallet: res }),
      })
      APIS.profile_getDiscounts(undefined,{
        onSuccess: (res:I_discount[]) => { this.setState({ discounts: res }) }
      })
      APIS.profile_getAddresses(undefined,{
        onSuccess: (res:I_address[]) => this.setState({ addresses: res }),
      })
    }
    else {
      rsa.addSnakebar({
        type: 'warning',text: 'شما ثبت نام نکرده اید',
        subtext: 'برای استفاده از بخش های مختلف از منوی پروفایل ثبت نام کنید',
        action: {text: 'ثبت نام',onClick: () => rsa.setNavId('profile')}
      })
    }
    APIS.backOffice_getTags({ type: 'food' },{
      onSuccess: (food_tags:I_tag[]) => this.setState({ food_tags })
    })
    APIS.backOffice_getTags({ type: 'restoran' },{
      onSuccess: (restoran_tags:I_tag[]) => this.setState({ restoran_tags })
    })
    APIS.getRestoranSortOptions(undefined,{
      onSuccess: (restoran_sort_options:I_restoran_sort_option[]) => this.setState({ restoran_sort_options })
    })
  }
  openModal(key:string, parameter?:any) {
    let { rsa } = this.state;
    if (key === 'back_office') {
      rsa.addModal({header: { title: 'پنل مدیریت' },body: {render: () => <BackOffice />}})
    }
    else if (key === 'reserve_admin') {
      rsa.addModal({header: { title: 'پنل رزرو' },body: {render: () => <ReservePanel />}})
    }
  }
  getContext() {
    let context:I_state = {
      ...this.state
    }
    return context;
  }
  render() {
    let { rsa } = this.state;
    return (
      <AppContext.Provider value={this.getContext()}>{rsa.render()}</AppContext.Provider>
    )
  }
}

function AppHeader() {
  let {rsa,changeStore}:I_state = useContext(AppContext);
  function renderIcon(icon:string, badge?:number) {
    return (
      <>
        {icons(icon, { className: 'header-icon' })}
        {!!badge && <div className='header-badge'>{badge}</div>}
      </>
    )
  }
  function side_layout() {return {className: 'of-visible', align: 'vh',onClick: () => rsa.openSide(),html: icons('side')}}
  function profile_layout() {
    return { className: 'of-visible', align: 'v', html: renderIcon('account'), onClick: () => changeStore('backOffice',true,'<AppHeader/> profile_layout') }
  }
  function logo_layout() {
    return {className: 'of-visible', align: 'v',html: icons('logo', { fill: '#fff', style: { transform: 'translateY(-4px)' } })}
  }
  function notif_layout() {
    return { className: 'of-visible', align: 'v', html: renderIcon('bell', 3) }
  }
  function message_layout() {
    return { className: 'of-visible', align: 'v', html: renderIcon('message', 3) }
  }
  return (
    <RVD
      layout={{
        className: 'of-visible p-h-12 w-100', gap: 6,
        row: [side_layout(),profile_layout(),{ flex: 1 },logo_layout(),notif_layout(),message_layout(),]
      }}
    />
  )
}