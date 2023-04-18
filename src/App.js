import React,{Component} from 'react';
import RSA,{OTP} from './npm/react-super-app/react-super-app';
import CommingSoon from './components/comming-soon/commin-soon';
import BackOffice from './components/back-office/back-office';
import AIOService from './npm/aio-service/aio-service';
import RVD from './npm/react-virtual-dom/react-virtual-dom';
import {getResponse} from './apis';
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

export default class App extends Component{
  constructor(props){
    super(props);
    this.state = {registered:true,backOffice:false}
  }
  render(){
    let {registered,backOffice} = this.state;
    let baseUrl = 'https://localhost:7203'
    return (
      <OTP
        id='iranfoodguide'
        registered={registered}
        COMPONENT={backOffice?BackOffice:IranFoodGuide}
        varifiedCode={undefined}
        codeLength={6}
        checkToken={async (token)=>{ // if success return true else return string
          let response;
          Axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          try{response = await Axios.get(`${baseUrl}/Users/WhoAmI`);}
          catch(err){
            try{
              debugger;
              if(err.response){
                if(err.response.status === 401){return false}
                return err.response.statusText
              }
              else {return err.message}
            }
            catch{return 'error'}
          }
          return response.data.IsSuccess || 'error'
        }}
        onInterNumber={async (number)=>{//return boolean
          let response = await Axios.post(`${baseUrl}/Users/GenerateUserCode`,{mobileNumber:number})
          debugger;
          let registered=response.data.data.isRegistered;
          debugger
          this.setState({ registered});

          if(response.data.isSuccess)
          return true;
          else
          return response.data.message;


        }}
        onInterCode={async ({number,code,model})=>{//return string or false
          let response = await Axios.post(`${baseUrl}/Users/TokenWithCode`,{
            mobileNumber:number,
            code:code.toString()
          });
          debugger
          if(response.data.isSuccess)
          return response.data.access_token;
          else
          return false;
        }}
        // registerFields={[
        //   {label:'نام',field:'FirstName',type:'text',icon:<Icon path={mdiAccountBoxOutline} size={1}/>},
        //   {label:'نام خانوادگی',field:'LastName',type:'text',icon:<Icon path={mdiAccountBoxOutline} size={1}/>},
        //   {label:'ایمیل',field:'Email',type:'text',icon:<Icon path={mdiEmailOutline} size={1}/>},
        // ]}
        layout={(html)=>{
          return (
            <RVD
              layout={{
                className:'fullscreen login-page',
                column:[
                  {
                    size:160,
                    column:[
                      {flex:1},
                      {html:<img src={logo2}/>,align:'vh'},
                      {size:16}
                    ]
                  },
                  {
                    flex:4,
                    className:'login-page-form',
                    column:[
                      {html:'',className:'login-bg'},
                      {html:'',className:'login-bg-make-dark'},
                      {
                        className:'login-page-header',
                        column:[
                          {flex:1},
                          {html:<img src={logo} />,align:'vh'},
                          {flex:1}
                        ]
                      },
                      {style:{paddingTop:0},html},
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

class IranFoodGuide extends Component{
  constructor(props){
    super(props);
    this.state = {
      comming_soon:false,
      profile:{},
      discounts:[],
      SetState:(obj)=>this.setState(obj),
      mojoodiye_kife_pool:0
    }
    this.state.apis = AIOService({
      getState:()=>this.state,
      getResponse,
      id:'iranfoodguid',
      getError:(res)=>{
        if (!res.data.IsSuccess) { return res.data.Message }
      }
    })
  }
  async getProfile(){
    let {apis} = this.state;
    await apis({
      api:'getProfile',
      callback:(res)=>this.setState({profile:res}),
      name:'دریافت اطلاعات پروفایل'
    });
  }
  async getKife_pool(){
    let {apis} = this.state;
    await apis({
      api:'mojoodiye_kife_pool',
      callback:(res)=>this.setState({mojoodiye_kife_pool:res}),
      name:'دریافت موجودی کیف پول'
    });
  }
  async get_takhfif_ha(){
    let {apis} = this.state;
    await apis({
      api:'takhfif_ha',
      callback:(res)=>this.setState({takhfif_ha:res}),
      name:'دریافت اطلاعات تخفیف ها'
    });
  }
  componentDidMount(){
    this.getProfile();
    this.getKife_pool();
    this.get_takhfif_ha();
  }
  render(){
    let {comming_soon} = this.state;
    
    return (
      <AppContext.Provider value={this.state}>
        {comming_soon && <CommingSoon/>}
        {
          !comming_soon && 
          <RSA
            title={false}
            navs={[
              {id:'sefareshe_ghaza',text:dictionary('سفارش غذا'),icon:()=>icons('sefareshe_ghaza')},
              {id:'sabade_kharid',text:dictionary('سبد خرید'),icon:()=>icons('sabade_kharid')},
              {id:'sefaresh_ha',text:dictionary('سفارش ها'),icon:()=>icons('sefaresh_ha')},
              {id:'ertebate_online',text:dictionary('ارتباط آنلاین'),icon:()=>icons('ertebate_online')},
              {id:'profile',text:dictionary('پروفایل'),icon:()=>icons('profile')},
            ]}
            navId='profile'
            body={({navId})=>{
              if(navId === 'sefareshe_ghaza'){
                return <Sefareshe_ghaza/>
              }
              if(navId === 'profile'){
                return <Profile/>
              }
            }}
            getActions={({addPopup,removePopup})=>{
              let obj = {addPopup,removePopup}
              this.state.rsa_actions = obj;
              this.setState({rsa_actions:obj})
            }}
            header={()=>{
              return (
                <RVD
                  layout={{
                    className:'of-visible p-h-12 w-100',gap:6,
                    row:[
                      {
                        className:'of-visible',align:'v',
                        html:(
                          <>
                            {icons('account',{className:'header-icon'})}
                            {false && <div className='header-badge'></div>}
                          </>
                        )
                      },
                      {flex:1},
                      {
                        className:'of-visible',align:'v',
                        html:icons('logo',{fill:'#fff',style:{transform:'translateY(-4px)'}})  
                      },
                      {
                        className:'of-visible',align:'v',
                        html:(
                          <>
                            {icons('bell',{className:'header-icon'})}
                            {<div className='header-badge'>{3}</div>}
                          </>
                        )
                      },
                      {
                        className:'of-visible',align:'v',
                        html:(
                          <>
                            {icons('message',{className:'header-icon'})}
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