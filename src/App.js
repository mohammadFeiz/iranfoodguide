import React,{Component} from 'react';
import RSA from './npm/react-super-app/react-super-app';
import CommingSoon from './components/comming-soon/commin-soon';
import AIOService from './npm/aio-service/aio-service';
import RVD from './npm/react-virtual-dom/react-virtual-dom';
import apis from './apis';
import AppContext from './app-context';
import { dictionary } from './dictionary';
import './App.css';
import { icons } from './icons';
import Sefareshe_ghaza from './pages/sefareshe_ghaza';
import Profile from './pages/profile';

export default class App extends Component{
  constructor(props){
    super(props);
    this.state = {
      comming_soon:false,
      profile:{},
      discounts:[],
      SetState:(obj)=>this.setState(obj)
    }
    this.state.apis = AIOService({getState:()=>this.state,apis,id:'iranfoodguid'})
  }
  async getProfile(){
    let {apis} = this.state;
    await apis({
      api:'getProfile',
      callback:(res)=>this.setState({profile:res}),
      name:'دریافت اطلاعات پروفایل'
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