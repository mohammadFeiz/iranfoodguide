import React,{Component,createRef} from 'react';
import {Icon} from '@mdi/react';
import {mdiChevronDown} from '@mdi/js';
import Popover from './../../npm/aio-popup/aio-popup';
import $ from 'jquery';
import './aio-input.css';
export default class Input extends Component{
  constructor(props){
    super(props);
    this.dataUniqId = 'ai' + Math.round(Math.random() * 10000000)
    this.dom = createRef();
    this.container = createRef();
    this.state = {value:props.value,prevValue:props.value,error:false,open:false} 
    $(window).on('click',(e)=>this.handleClick(e))
  }
  handleClick(e){
    let target = $(e.target);
    if(target.attr('data-uniq-id') === this.dataUniqId){
      console.log('ai 1')
      return
    }
    if(target.parents(`[data-uniq-id=${this.dataUniqId}]`).length){
      console.log('ai 2')
      return
    }
    this.setState({open:false})
  }
  change(value){
    let {type,onChange,maxLength = Infinity,justNumber,delay = 400,filter = []} = this.props;
    if (type === 'number') {
      if(value){value = +value;}
    }
    else if(type === 'text' || value === 'textarea'){
      if(value){
        if(justNumber){
          value = value.toString();
          let lastChar = value[value.length - 1];
          if(isNaN(+lastChar)){value = value.slice(0,value.length - 1)}
        }
        if(filter.length){
          value = value.toString();
          let lastChar = value[value.length - 1];
          if(filter.indexOf(lastChar) !== -1){value = value.slice(0,value.length - 1)}
        }
        if(value.toString().length > maxLength){
          value = value.toString().slice(0,maxLength);
        }
      }
    }
    this.setState({value});
    clearTimeout(this.timeout);
    this.timeout = setTimeout(()=>{
      onChange(value);
    },delay);
  }
  getOptions(){
    let {optionText,options = []} = this.props;
    let {value} = this.state;
    let res = options.map((option,index)=>{
      let text;
      if(typeof option === 'object' && option.text !== undefined){text = option.text}
      else if(typeof optionText === 'function'){
        text = optionText(option,index)
      }
      else if(typeof optionText === 'string'){
        try{eval(`text = ${optionText}`)}
        catch{text = ''}
      }
      else {text = ''}
      return text
    })
    return res.filter((o)=>!value || o.indexOf(value) !== -1)
  }
  componentDidMount(){
    let {type,min,max,swip} = this.props;
    if(type === 'number' && swip){
      AIOSwip({
        speedY:0.2,
        dom:$(this.dom.current),
        start:()=>{
          this.so = this.state.value;
        },
        move:({dx,dy,dist})=>{
          let newValue = -dy + this.so
          if(min !== undefined && newValue < min){return}
          if(max !== undefined && newValue > max){return}
          this.change(newValue)
        }
      })
    }
  }
  componentDidUpdate(){
    let {type,autoHeight,delay = 400} = this.props;
    if(type === 'textarea' && autoHeight){
      let dom = this.dom.current;
      dom.style.height = 'fit-content';
      let scrollHeight = dom.scrollHeight + 'px'
      dom.style.height = scrollHeight;
      dom.style.overflow = 'hidden';
      dom.style.resize = 'none';
    }
    clearTimeout(this.rrt)
    if(this.state.value !== this.props.value){
      this.rrt = setTimeout(()=>this.setState({value:this.props.value}),delay + 10)
    }
  }
  getInput(){
    let {attrs = {},type,spin} = this.props;
    let {error,value} = this.state;   
    if(error !== false){
      return <div className='aio-form-inline-error aio-form-input' onClick={()=>this.setState({error:false})}>{error}</div>
    }
    let props = {
       ...attrs,value,type,ref:this.dom,
       className:spin === false?'no-spin':'',
       onChange:(e)=>this.change(e.target.value)
    }
    if(type === 'textarea'){return <textarea {...props}/>}
    else {return (<input {...props}/>)}
  }
  getBefore(){
    let {before} = this.props;
    return (
      <div className='aio-input-before'>
        {before}
      </div>
    )
  }
  getAfter(){
    let {after} = this.props;
    return (
      <div className='aio-input-after'>
        {after}
      </div>
    )
  }
  getPopup(){
    let {open} = this.state;
    if(!open){return null}
    let options = this.getOptions()
    if(!options.length){return null}
    let getTarget = ()=>$(this.container.current);
    
    return (
      <Popover
        popupWidth='fit'
        id={this.dataUniqId}
        backdrop={false}
        attrs={{style:{padding:0}}}
        body={()=>{
          return (
            <div className='aio-input-options'>
              {
                options.map((o,i)=>{
                  return (
                    <div key={i} className='aio-input-option' onClick={()=>this.change(o)}>{o}</div>
                  )
                })
              }
            </div>
          )
        }}
        getTarget={getTarget}
      />
    )
  }
  getCaret(){
    let {options = []} = this.props;
    if(!options.length){return null}
    return (
      <div className='aio-input-caret'>
        <Icon path={mdiChevronDown} size={0.7}/>
      </div>
    )
  }
  render(){
    let {type,label,className,style} = this.props;
    return (
      <>
        <div 
          ref={this.container} 
          style={style}
          data-uniq-id={this.dataUniqId}
          className={`aio-input aio-input-${type}${className?' ' + className:''}`} 
          data-label={label?label:undefined}
          onClick={()=>this.setState({open:!this.state.open})}
        >
          {this.getBefore()}
          {this.getInput()}
          {this.getAfter()}
          {this.getCaret()}
        </div>
        {this.getPopup()}
      </>
    )
  }
}
function AIOSwip({dom,start = ()=>{},move = ()=>{},end = ()=>{},speedX = 1,speedY = 1,stepX = 1,stepY = 1,parameter}){
  let a = {
    init(){
      this.eventHandler(dom,'mousedown',$.proxy(this.mouseDown,this))
    },
    getClient(e){
      let touch = 'ontouchstart' in document.documentElement;
      return touch?{x: e.changedTouches[0].clientX,y:e.changedTouches[0].clientY }:{x:e.clientX,y:e.clientY}
    },
    eventHandler(selector, event, action,type = 'bind'){
      var me = { mousedown: "touchstart", mousemove: "touchmove", mouseup: "touchend" }; 
      event = 'ontouchstart' in document.documentElement ? me[event] : event;
      var element = typeof selector === "string"?(selector === "window"?$(window):$(selector)):selector; 
      element.unbind(event, action); 
      if(type === 'bind'){element.bind(event, action)}
    },
    getPercentByValue(value,start,end){
      return 100 * (value - start) / (end - start)
    },
    getMousePosition(e){
        let client = this.getClient(e);
        var x = client.x - this.left;
        var y = client.y - this.top;
        var xp = this.getPercentByValue(x,0,this.width);
        var yp = this.getPercentByValue(y,0,this.height);
        return {xp,yp,clientX:client.x,clientY:client.y,x,y}
    },
    mouseDown(e){
      var offset = dom.offset();
      this.width = dom.width();
      this.height = dom.height(); 
      this.left = offset.left;
      this.top = offset.top;
      let mp = this.getMousePosition(e)
      this.so = {
        client:{x:mp.clientX,y:mp.clientY}
      };
      let res = start({mousePosition:{...mp},parameter,e});
      if(res === false){return}
      if(Array.isArray(res)){
        let x = res[0];
        let y = res[1]
        this.so.x = x;
        this.so.y = y;
      }
      this.eventHandler('window','mousemove',$.proxy(this.mouseMove,this));
      this.eventHandler('window','mouseup',$.proxy(this.mouseUp,this))
    },
    mouseMove(e){
      let client = this.getClient(e);
      let dx = client.x - this.so.client.x;
      let dy = client.y - this.so.client.y;
      dx = Math.round(dx * speedX)
      dy = Math.round(dy * speedY)
      dx = Math.floor(dx / stepX) * stepX;
      dy = Math.floor(dy / stepY) * stepY;
      if(dx === this.dx && dy === this.dy){return}
      this.dx = dx;
      this.dy = dy;
      let dist = Math.round(Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2)))
      this.dist = dist;
      let x,y;
      if(this.so.x !== undefined && this.so.y !== undefined){
        x = this.so.x + dx;
        y = this.so.y + dy;
      }
      move({dx,dy,dist,x,y,parameter,mousePosition:{...this.getMousePosition(e)},e});
    },
    mouseUp(e){
      this.eventHandler('window','mousemove',this.mouseMove,'unbind');
      this.eventHandler('window','mouseup',this.mouseUp,'unbind');
      end({dx:this.dx,dy:this.dy,dist:this.dist,parameter,e})
    }
  }
  a.init();
}