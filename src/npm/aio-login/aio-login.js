import React,{Component} from 'react';
import RVD from './../../npm/react-virtual-dom/react-virtual-dom';
import AIOStorage from './../../npm/aio-storage/aio-storage';
import Form from './../../npm/aio-form-react/aio-form-react';
import {Icon} from '@mdi/react';
import {mdiCellphone,mdiLock,mdiLoading} from '@mdi/js';
import './index.css';
import { createRef } from 'react';
export class OTPLogin extends Component{
    constructor(props){
      super(props);
      this.storage = AIOStorage('otp-login');
      let {number} = props;
      this.state = {
        mode:'inter-phone',error:'',number,exactNumber:number
      }
    }
    changeNumber(number){
      let {exactNumber} = this.state;
      if(exactNumber){number = exactNumber}
      this.setState({number})
    }
    getDelta(){
      let {time} = this.props; 
      let lastTime = this.storage.load({name:'lastTime',def:new Date().getTime() - (time * 1000)});
      return new Date().getTime() - lastTime;
    }
    async onInterPhone(number) {
      let {time,onInterNumber} = this.props;
      let delta = this.getDelta(number);
      if(delta >= time * 1000){
        console.log('send phone number to server',number);
        let res = await onInterNumber(number);
        this.storage.save({value:new Date().getTime(),name:'lastTime'});
        if(typeof res === 'string'){
          this.storage.save({value:new Date().getTime() - (time * 1000),name:'lastTime'});
          this.setState({mode:'error',error:res})
          this.changeNumber('')
          return
        }
        else if(res !== true){return}
      }
      this.setState({ mode: 'inter-code'})
      this.changeNumber(number)
    }
    async onInterCode(model) {
      let {onInterCode} = this.props;
      let res = await onInterCode(model);
      if(typeof res === 'string') {
          this.setState({ error: res,mode:'error' })
      }
    }
    async onInterPassword(number,password){
      let {onInterPassword} = this.props;
      let res = await onInterPassword(number,password);
      if(typeof res === 'string') {
          this.setState({ error: res,mode:'error' })
      }
    }
    render(){
      let {mode,number,error,exactNumber} = this.state;
      let {time,codeLength = 4,fields = [],verifiedCode,onInterPassword} = this.props;
      return (
        <RVD
          layout={{
            className:'otp-login ofy-auto',
            column: [
              { 
                show:mode === 'inter-phone',align:'h',
                html:()=>(
                  <NumberForm
                    time={time}
                    exactNumber={exactNumber}
                    onSubmit={(number)=>this.onInterPhone(number)}
                    onInterPassword={!!onInterPassword?(number,password)=>this.onInterPassword(number,password):undefined}
                    getDelta={this.getDelta.bind(this)}
                  />
                )
              },
              { 
                show:mode === 'inter-code',align:'h',
                html:()=>(
                  <CodeForm 
                    verifiedCode={verifiedCode}
                    fields={fields}
                    codeLength={codeLength}
                    number={number}
                    time={time}
                    getDelta={this.getDelta.bind(this)}
                    onSubmit={async (obj)=>await this.onInterCode(obj)} 
                    onClose={()=>this.setState({ mode: 'inter-phone'})}
                    onResend={async (number)=>await this.onInterPhone(number)}
                  />
                )
              },
              { show:mode === 'error',html:()=><CodeError error={error} onClose={()=>this.setState({ error: '',mode:'inter-phone' })}/>},
            ]
          }}
        />
      )
    }
  }
  OTPLogin.defaultProps = {time:60}
  //time getDelta onSubmit
  class NumberForm extends Component{
    constructor(props){
      super(props);
      this.dom = createRef()
      this.state = {
        remainingTime:props.time,mode:'otp',
        model:{number:props.exactNumber || '',password:''}
      }
    }
    componentDidMount(){
      this.update()
    }
    update(){
      let {getDelta,time} = this.props;
      clearTimeout(this.tiomeout);
      let delta = getDelta();
      if(delta >= time * 1000){this.setState({remainingTime:0})}
      else{
        this.setState({remainingTime:Math.round(((time * 1000) - delta) / 1000)})
        this.tiomeout = setTimeout(()=>this.update(),1000)
      }
    }
    async onSubmit(){
      if(!!this.getNumberError() || !!this.getPasswordError()){return;}
      let {mode,model,loading} = this.state;
      if(loading){return}
      let {number,password} = model;
      this.setState({loading:true})
      if(mode === 'otp'){
        let {onSubmit} = this.props;
        await onSubmit(number)
      }
      else if(mode === 'password'){
        let {onInterPassword} = this.props;
        await onInterPassword(number,password);
      }
      this.setState({loading:false})
    }
    title_layout(){
      let {remainingTime,mode} = this.state;
      let title = 'ورود | ثبت نام',subtitle;
      if(mode === 'otp'){
        if(remainingTime){subtitle = `شماره تلفن همراه خود را پس از ${remainingTime} ثانیه وارد کنید`}
        else{subtitle = 'شماره تلفن همراه خود را وارد کنید. پیامکی حاوی کد برای شما ارسال میشود'}
      }
      if(mode === 'password'){subtitle = 'شماره تلفن همراه و رمز عبور را وارد کنید.'}
      return {
        column:[
          { html: title, className: 'otp-login-text1' },
          {html:subtitle,className:'otp-login-text2'},
          {size:12}
        ]
      }
    }
    getNumberError(){
      let {model} = this.state;
      let {number} = model;
      if(!number){return 'شماره همراه خود را وارد کنید'}
      if(number.indexOf('09') !== 0){return 'شماره همراه باید با 09 شروع شود'}
      if(number.length !== 11){return 'شماره همراه باید 11 رقم باشد'}
      return false
    }
    getPasswordError(){
      let {mode,model} = this.state;
      let {password} = model;
      if(mode !== 'password'){return false}
      if(password.length < 6){return 'رمز عبور باید شامل حداقل 6 کاراکتر باشد'}
      return false
    }
    form_layout(){
      let {model,mode,remainingTime} = this.state;
      if(remainingTime){return false}
      let {exactNumber} = this.props;
      return {
        html:(
          <Form
            lang='fa' model={model} onChange={(model)=>this.setState({model})}
            rtl={true}
            inputs={[
              {
                type:'text',justNumber:true,field:'model.number',prefix:<Icon path={mdiCellphone} size={0.8}/>,placeholder:'09...',
                label:'شماره همراه',disabled:!!exactNumber,validations:[['function',()=>this.getNumberError()]],
                theme:{inputStyle:{direction:'ltr'}}
              },
              {
                show:mode === 'password',type:'password',field:'model.password',prefix:<Icon path={mdiLock} size={0.8}/>,
                label:'پسوورد',validations:[['function',()=>this.getPasswordError()]]
              }
            ]}
          />
        )
      }
    }
    submit_layout(){
      let {remainingTime,mode,loading} = this.state;
      if(remainingTime && mode === 'otp'){return false}
      return {
        style:{padding:'0 12px'},
        html: (
          <SubmitButton 
            disabled={!!this.getNumberError() || !!this.getPasswordError()} 
            onClick={async () => await this.onSubmit()}
            loading={loading}
          />
        )
      }
    }
    changeMode_layout(){
      let {onInterPassword} = this.props;
      if(!onInterPassword){return false}
      let {mode} = this.state;
      return {
        column:[
          {
            gap:6,className:'p-h-12',
            row:[
              {flex:1,html:<div className='otp-login-splitter'></div>,align:'v'},
              {html:'یا',align:'v',className:'otp-login-or'},
              {flex:1,html:<div className='otp-login-splitter'></div>,align:'v'},
            ]
          },
          {size:12},
          {
            align:'vh',
            html:(
              <button 
                className='otp-login-text4' 
                onClick={()=>this.setState({mode:mode === 'otp'?'password':'otp',model:{number:'',password:''}})}
              >{mode === 'otp'?'ورود با رمز عبور':'ورود با کد یکبار مصرف'}</button>
            ),
            className:'p-h-12 of-visible'
          }
        ]
      }
    }
    render(){
      return (
        <RVD
          layout={{
            className:'otp-login-form',
            attrs:{ref:this.dom,onKeyDown:(e)=>{if(e.keyCode === 13){this.onSubmit()}}},
            column: [
              {
                className:'of-visible',
                column: [
                  this.title_layout(),
                  this.form_layout(),
                  this.submit_layout(),
                  {size:12},
                  this.changeMode_layout()
                ]
              },
              { size: 16 }
            ]
          }}
        />
      )
    }
  }
  //getDelta number onSubmit onClose onResend
  class CodeForm extends Component{
    constructor(props){
      super(props);
      let model = {code:''};
      this.state = {recode:false,model}
      this.update();
    }
    title_layout(){
      let {number} = this.props;
      return {
        column:[
          {html: `کد تایید برای شماره ${number} پیامک شد`,className: 'otp-login-text1'}    
        ]
      }
    }
    input_layout(){
      let {model} = this.state;
      let {codeLength,fields} = this.props;
      fields = [...fields.map((o)=>{return {...o,field:'model.' + o.field}})]
      fields.push({
        type:'number',field:'model.code',label:'کد پیامک شده',placeholder:Array(codeLength).fill('-').join(''),theme:{inputStyle:{fontSize:32,letterSpacing:24}},
        maxLength:codeLength
      })  
      
      return {
        flex:1,
        style:{padding:'0 12px'},
        column:[
          {
            html:()=>(
              <Form
                rtl={true}
                lang='fa'
                model={model}
                onChange={(model)=>this.setState({model})}
                inputs={fields}
              />
            )
          }
        ]
      }
    }
    onSubmit(){
      if(this.isDisabled()){return}
      let {onSubmit,number} = this.props;
      let {model} = this.state;
      onSubmit({model,number,code:model.code})
    }
    isDisabled(){
      let {model} = this.state;
      let {codeLength,fields,verifiedCode} = this.props;
      let {code} = model;
      for(let i = 0; i < fields.length; i++){
        let field = fields[i];
        if(!this.state.model[field.field]){return true}
      }
      if(verifiedCode !== undefined){
        if(verifiedCode.toString() === code.toString()){return false}
      }
      if(isNaN(+code)){return true}
      return code.toString().length !== codeLength
    }
    submit_layout(){
      let disabled = this.isDisabled()
      return {
        style:{padding:'0 12px',marginBottom:12},
        html: (<SubmitButton disabled={disabled} onClick={() => this.onSubmit()}/>)
      }
    }
    update(){
      let {getDelta,number,time} = this.props;
      clearTimeout(this.tiomeout);
      let delta = getDelta(number);
      if(delta > time * 1000){this.setState({recode:true})}
      else{
        this.setState({remainingTime:Math.round(((time * 1000) - delta) / 1000),recode:false})
        this.tiomeout = setTimeout(()=>this.update(),1000)
      }
    }
    remainingTime_layout(){
      let {recode,remainingTime} = this.state;
      if(recode || !remainingTime){return false}
      return {
        gap: 3,className: 'otp-login-text3 m-b-12', align: 'h',
        row: [
          { html: `${remainingTime} ثانیه`, style: {fontWeight:'bold' }},
          { html: 'مانده تا دریافت مجدد کد' }
        ]
      }
    }
    recode_layout(){
      let {number,onResend} = this.props;
      let {recode} = this.state;
      return {
        show:!!recode,
        attrs: { onClick: async () =>{
          await onResend(number);
          this.update();
        } },
        className: 'otp-login-text4',
        html: 'دریافت مجدد کد',align:'vh'
      }
    }
    changePhone_layout(){
      let {onClose} = this.props;
      return {
        attrs: { onClick: () => onClose() },
        className: 'otp-login-text4',align:'vh',
        html: 'تغییر شماره تلفن یا ورود با رمز'
      }
    }
    render(){
      return (
        <RVD
          layout={{
            className:'otp-login-form',
            attrs:{onKeyDown:(e)=>{if(e.keyCode === 13){this.onSubmit()}}},
            column: [
              this.title_layout(),
              this.input_layout(),
              this.submit_layout(),
              this.remainingTime_layout(),
              this.recode_layout(),
              this.changePhone_layout()
            ]
          }}
        />
      )
    }
  }
  class CodeError extends Component{
    render(){
      let {error,onClose} = this.props;
      return (
        <RVD
          layout={{
            className:'otp-login-form',
            column: [
              { html: error, className: 'otp-login-error', align: 'vh' },
              { size: 24 },
              { html: (<button className='otp-login-submit' onClick={() => onClose()}>تلاش مجدد</button>) }
            ]
          }}
        />
      )
    }
  }


  class SubmitButton extends Component{
    state = {loading:false,reload:false}
    async onClick(){
      let {onClick,loading} = this.props;
      if(loading){return;}
      await onClick();
    }
    render(){
      let {disabled,loading} = this.props;
      let {reload} = this.state;
      if(loading && !reload){
        setTimeout(()=>{
          this.setState({reload:true})
        },16 * 1000)
      }
      let text = 'در حال ارسال';
      if(reload){text = 'بارگزاری مجدد'}
      return (
        <>
          <button 
            className='otp-login-submit' 
            disabled={disabled}
            onClick={() => this.onClick()}
          >{loading?(<><Icon path={mdiLoading} size={1} spin={0.2} style={{margin:'0 6px'}}/>{text}</>):'ورود'}</button>
          {
            loading &&
            <div 
              style={{position:'fixed',width:'100%',height:'100%',left:0,top:0,zIndex:100000000000000000000000000000000000000}}
              onClick={()=>{
                if(reload){
                  window.location.reload()
                }
              }}
            ></div> 
          }
        </>
        
      )
    }
  }