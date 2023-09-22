import React, { Component } from "react";
import RVD from './../../npm/react-virtual-dom/react-virtual-dom';
import AIOInput from "../../npm/aio-input/aio-input";
import AIOStorage from './../../npm/aio-storage/aio-storage';
import AppContext from "../../app-context";
import './reserve-panel.css';
import {Icon} from '@mdi/react';
import { mdiAlert, mdiCheck, mdiCheckCircle, mdiCheckCircleOutline, mdiChevronDown, mdiChevronLeft, mdiClose, mdiCloseCircle, mdiDelete, mdiPlusThick } from "@mdi/js";
export default class Profile extends Component {
    static contextType = AppContext;
    constructor(props) {
        super(props);
        let storage = AIOStorage('ifgreservemockserver');
        let items = storage.load({name:'items',def:[{
                id:'0',isSubmited:true,image1:'',image2:'',image3:'',
                name:'میز تراس 6 نفره',persons:6,description:'میز مستطیل همراه با بخاری ویلایی',
                priceType:'hour',price:100000,persons:6,preOrderTime:{type:'day',amount:1},timeLimits:[[],[],[],[],[],[],[]]
        }]})
        this.state = {
            storage:AIOStorage('ifgreservemockserver'),
            tab:'user_panel',
            priceTypes:[
                {text:'مبلغ کلی',value:'static'},
                {text:'به ازای هر نفر',value:'person'},
                {text:'به ازای هر ساعت',value:'hour'},
                {text:'به ازای هر روز',value:'day'},
                
            ],
            openId:false,
            items
        }
    }
    addItem(){
        let addItem = {
            id:Math.round(Math.random() * 100000),image1:'',image2:'',image3:'',isSubmited:false,added:false,name:'',persons:'',description:'',
            priceType:'',price:'',persons:'',preOrderTime:{type:'day',amount:''},timeLimits:[[],[],[],[],[],[],[]],hasError:true
        }
        let {items} = this.state;
        this.setState({items:items.concat(addItem)})
    }
    removeItem(index){
        let {items,storage} = this.state;
        let newItems = items.filter((o,i)=>i !== index) 
        this.setState({items:newItems});
        storage.save({name:'items',value:newItems})
    }
    changeItem(newItem,index,mock){
        let {items,storage} = this.state;
        let newItems = items.map((o,i)=>i === index?{...newItem}:o);
        this.setState({items:newItems});
        if(mock){
            storage.save({name:'items',value:newItems})
        }
    }
    // async submit(index){
    //     let {apis} = this.context;
    //     let {items} = this.state;
    //     let item = items[index];
    //     apis({
    //         api:'submit_reserve',
    //         parameter:{item,type:item.added === false?'add':'edit'},
    //         successMessage:true,
    //         name:`${item.added === false?'افزودن':'ویرایش'} خدمت قابل رزرو`,
    //         callback:({id})=>{
    //             this.changeItem({...item,id,added:true,isSubmited:true},index)
    //         }
    //     })
    // }
    submit(index){
        let {items} = this.state;
        let item = items[index];
        let newItem = {...item,added:true,isSubmited:true}
        this.changeItem(newItem,index,true)
    }
    changeTimeLimitByHour(index,dayIndex,timeIndex,state){
        let {items} = this.state;
        let item = items[index];
        let newTimes;
        if(state){newTimes = [...item.timeLimits[dayIndex],timeIndex]}
        else{newTimes = item.timeLimits[dayIndex].filter((o)=>o !== timeIndex)}
        let newDay = item.timeLimits.map((o,i)=>i === dayIndex?newTimes:o)
        let newItem = {...item,timeLimits:newDay,isSubmited:false};
        this.changeItem(newItem,index)
    }
    changeTimeLimitByDay(index,dayIndex){ 
        let {items} = this.state;
        let item = items[index];
        let newTimes;
        if(item.timeLimits[dayIndex].length === 0){newTimes = new Array(24).fill(0).map((o,i)=>i);}
        else {newTimes = [];}
        let newDay = item.timeLimits.map((o,i)=>i === dayIndex?newTimes:o);
        let newItem = {...item,timeLimits:newDay,isSubmited:false};
        this.changeItem(newItem,index)
    }
    tabs_layout(){
        let {tab} = this.state;
        return {
            html:(
                <AIOInput
                    type='tabs'
                    options={[{text:'پنل ادمین',value:'admin_panel'},{text:'پنل کاربر',value:'user_panel'}]}
                    value={tab}
                    onChange={(tab)=>this.setState({tab})}
                />
            )
        }
    }
    header_layout(){
        let {tab} = this.state;
        if(tab !== 'admin_panel'){return false}
        return {
            className:'p-12 p-b-0',
            html:(
                <AIOInput
                    before={<Icon path={mdiPlusThick} size={1}/>}
                    style={{background:'orange',color:'#fff'}}
                    className='fs-12 bold'
                    type='button'
                    text='افزودن خدمت قابل رزرو'
                    onClick={()=>this.addItem()}
                />
            )
        }
    }
    
    items_layout(){
        let {items,tab} = this.state;
        if(tab !== 'admin_panel'){return false}
        return {flex:1,className:'ofy-auto',column:items.map((o,i)=>this.item_form_layout(o,i))}
    }
    item_form_layout(item,index){
        let {openId} = this.state;
        let open = openId === item.id;
        let {isSubmited} = item;
        return {
            className:'m-12',
            style:{border:'1px solid orange'},
            column:[
                {
                    style:{background:'orange',color:'#fff',height:36},
                    row:[
                        {
                            html:index + 1,align:"vh",size:30,style:{background:'#fff',color:'orange',margin:3}
                        },
                        {
                            html:<Icon path={open?mdiChevronDown:mdiChevronLeft} size={1}/>,size:36,align:'vh',
                            onClick:()=>this.setState({openId:open?false:item.id})
                        },
                        {html:item.name,flex:1,align:'v'},
                        {
                            show:!item.hasError,
                            html:(
                                <AIOInput
                                    type='button'
                                    before={<Icon path={mdiCheckCircle} size={1}/>}
                                    style={{color:isSubmited?'green':'red',fontWeight:'bold'}}
                                    text={isSubmited?'ثبت شده':'ثبت'}
                                    onClick={isSubmited?undefined:()=>this.submit(index)}
                                />
                            ),
                            align:'v'
                        },
                        {
                            show:!!item.hasError,html:(
                                <AIOInput
                                    type='button'
                                    before={<Icon path={mdiAlert} size={1}/>}
                                    style={{color:'red',fontWeight:'bold'}}
                                    text={'دارای خطا'}
                                />
                            ),align:'v'
                        },
                        {size:6},
                        {
                            size:36,style:{color:'#fff'},align:'vh',
                            html:<Icon path={mdiDelete} size={1}/>,
                            onClick:()=>this.removeItem(index)
                        }
                    ]
                },
                {
                    show:!!open,
                    html:(
                        <AIOInput
                            type='form' lang='fa'
                            value={item}
                            onChange={(newItem,errors,isFirstChange)=>{
                                //فرم پس از رندر یکبار چنج را صدا می زند برای اعلام خطا های اولیه
                                //پس استتوس تغییر این آیتم در اولین فراخوانی نباید تغییر کند
                                this.changeItem({...newItem,isSubmited:isFirstChange?newItem.isSubmited:false,hasError:!!errors.length},index)
                            }}
                            inputAttrs={{className:'reserve-form-input'}}
                            inputs={{
                                props:{gap:12},
                                column:[
                                    this.form_images(item,index),
                                    this.form_name(),
                                    this.form_description(),
                                    this.form_priceType(),
                                    this.form_preOrderTime(),
                                    {
                                        row:[
                                            this.form_persons(),
                                            this.form_price()
                                        ]
                                    },
                                    this.form_timeLimits(item,index)
                                ]
                            }}
                        />
                    )
                }
            ]
        }
    }
    getAfter(text){
        return <div style={{padding:'0 12px',background:'orange',color:'#fff'}}>{text}</div>
    }
    form_name(){return {input:{type:'text'},label:'عنوان',field:'value.name',validations:[['required']]}}
    form_description(){return {input:{type:'textarea'},label:'توضیحات',field:'value.description',validations:[['required']]}}
    form_priceType(){
        let {priceTypes} = this.state;
        return {
            input:{type:'radio',options:priceTypes},field:'value.priceType',label:'نحوه محاسبه',validations:[['required']]
        }
    }
    form_price(){
        return {input:{type:'number',after:this.getAfter('تومان')},field:'value.price',label:'قیمت',validations:[['required']]}
    }
    form_preOrderTime(){
        return {
            column:[
                {html:'مدت زمان آماده سازی سفارش'},
                {
                    row:[
                        {size:120,input:{type:'number'},field:'value.preOrderTime.amount',validations:[['required','',{title:'مقدار'}]],label:''},
                        {size:120,input:{type:'select',options:[{text:'روز',value:'day'},{text:'ساعت',value:'hour'}]},field:'value.preOrderTime.type',validations:[['required']]},
                    ]
                }
            ]
        }
    }
    form_persons(){
        return {input:{type:'number',after:this.getAfter('نفر')},field:'value.persons',label:'تعداد نفرات قابل استفاده',validations:[['required']]}
    }
    form_timeLimits(item,index){
        if(item.priceType !== 'hour' && item.priceType !== 'day'){return false}
       return {
        props:{gap:1},
        column:[
            {size:12},
            {
                row:[
                    {html:'محدودیت سرویس بر اساس ساعت و روز هفته'},
                    {size:6},{size:24,style:{background:'red'}},{size:6},{html:'غیر قابل رزرو'},{size:12},
                    {size:24,style:{background:'green'}},{size:6},{html:'قابل رزرو'},
                ]
            },
            {size:6},
            {
                row:[
                    {size:60},
                    {flex:1,row:new Array(24).fill(0).map((o,i)=>{return {html:i,flex:1,align:'vh',className:'fs-10'}})}
                ]
            },
            {
                column:new Array(7).fill(0).map((o,i)=>this.form_dayLimit(i,item.timeLimits[i],index))
            } 
        ]
       }
    }
    form_dayLimit(dayIndex,times,index){
        let days = ['شنبه','یکشنبه','دوشنبه','سه شنبه','چهارشنبه','پنجشنبه','جمعه']
        return {
            size:24,props:{gap:1},
            row:[
                {size:60,html:days[dayIndex],onClick:()=>this.changeTimeLimitByDay(index,dayIndex)},
                {
                    flex:1,
                    row:new Array(24).fill(0).map((o,i)=>{
                        let active = times.indexOf(i) !== -1;
                        return {
                            flex:1,
                            style:{background:!active?'green':'red'},
                            onClick:()=>this.changeTimeLimitByHour(index,dayIndex,i,!active)
                        }
                    })
                }
            ]
        }
    }
    form_images(item,index){
        return {
            column:[
                {html:'تصاویر'},
                {row:[this.form_image(item,index,'image1'),this.form_image(item,index,'image2'),this.form_image(item,index,'image3')]}
            ]
        }
    }
    form_image(item,index,prop){
        return {
            html:(
                <AIOInput
                    type='image' className='reserve-panel-image' value={item[prop]} placeholder='انتخاب تصویر'
                    onChange={(image)=>this.changeItem({...item,[prop]:image,isSubmited:false},index)}
                />
            )
        }
    }
    userPanel_layout(){
        let {items} = this.state;
        return {
            column:items.map((o)=>this.reserveCard_layout(o))
        }
    }
    reserveCard_layout(item){
        return {
            style:{padding:12,background:'orange',color:'#fff'},
            row:[
                {
                    size:60,
                    html:<img src={item.image1}/>
                },
                {
                    flex:1,
                    column:[
                        {html:item.name,className:'bold',align:'v'},
                        {html:`قابل استفاده برای ${item.persons} نفر`,size:24,align:'v'},
                        {html:item.description,style:{width:'100%',border:'1px solid #fff',maxHeight:100,overflowY:'auto',borderRadius:6}}
                        
                    ]
                }
            ]
        }
    }
    render() {
        return (
            <RVD
                layout={{
                    style:{fontSize:12},
                    column: [
                        this.tabs_layout(),
                        this.header_layout(),
                        this.items_layout(),
                        this.userPanel_layout()
                    ]
                }}
            />
        )
    }
}

