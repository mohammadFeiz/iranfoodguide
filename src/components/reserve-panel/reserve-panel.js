import React, { Component,useState } from "react";
import RVD from './../../npm/react-virtual-dom/react-virtual-dom';
import AIOInput from "../../npm/aio-input/aio-input";
import AIODate from "../../npm/aio-date/aio-date";
import AIOStorage from './../../npm/aio-storage/aio-storage';
import ICS from './../../npm/aio-content-slider/aio-content-slider';
import AppContext from "../../app-context";
import './reserve-panel.css';
import {Icon} from '@mdi/react';
import { mdiAlert, mdiCheck, mdiCheckCircle, mdiCheckCircleOutline, mdiChevronDown, mdiChevronLeft, mdiClose, mdiCloseCircle, mdiDelete, mdiPlusThick } from "@mdi/js";
export default class Profile extends Component {
    static contextType = AppContext;
    constructor(props) {
        super(props);
        let storage = AIOStorage('ifgreservemockserver');
        let items = storage.load({name:'items',def:[]})
        this.state = {
            storage:AIOStorage('ifgreservemockserver'),
            tab:'admin_panel',
            timeTypes:[
                {text:'بدون در نظر گرفتن زمان',value:''},
                {text:'ساعتی',value:'hour'},
                {text:'روزانه',value:'day'},
            ],
            openId:false,
            items
        }
    }
    addItem(){
        let addItem = {
            id:Math.round(Math.random() * 100000),image1:'',image2:'',image3:'',isSubmited:false,added:false,name:'',description:'',
            countType:false,minCount:false,maxCount:false,countUnit:'عدد',returnAmount:false,timeType:'',price:'',preOrderTime:{type:'day',amount:''},timeLimits:[[],[],[],[],[],[],[]],hasError:true
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
        return {
            className:'m-3',
            style:{border:'1px solid orange'},
            column:[
                this.form_header(item,index,open),
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
                                    this.form_countType(),
                                    {
                                        row:[
                                            this.form_countUnit(item),
                                            this.form_minCount(item),
                                            this.form_maxCount(item)
                                        ]
                                    },
                                    this.form_timeType(),
                                    this.form_price(item),
                                    this.form_returnAmount(item),
                                    this.form_preOrderTime(),
                                    this.form_timeLimits(item,index)
                                ]
                            }}
                        />
                    )
                }
            ]
        }
    }
    form_header(item,index,open){
        let {isSubmited,id,name,hasError} = item;
        return {
            style:{background:'orange',color:'#fff',height:36},
            row:[
                {html:index + 1,align:"vh",size:30,style:{background:'#fff',color:'orange',margin:3}},
                {
                    html:<Icon path={open?mdiChevronDown:mdiChevronLeft} size={1}/>,size:36,align:'vh',
                    onClick:()=>this.setState({openId:open?false:id})
                },
                {html:name,flex:1,align:'v'},
                {
                    show:!hasError,
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
                    show:!!hasError,html:(
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
        }
    }
    getAfter(text){
        return <div style={{padding:'0 12px',background:'orange',color:'#fff'}}>{text}</div>
    }
    form_name(){return {input:{type:'text'},label:'عنوان',field:'value.name',validations:[['required']]}}
    form_description(){return {input:{type:'textarea'},label:'توضیحات',field:'value.description',validations:[['required']]}}
    form_countType(){
        return {
            input:{type:'checkbox',text:'محاسبه بر اساس تعداد'},field:'value.countType'
        }
    }
    form_countUnit(item){
        if(!item.countType){return false}
        return {
            input:{type:'text'},label:'واحد تعداد',field:'value.countUnit',validations:[['required']]
        }
    }
    form_minCount(item){
        if(!item.countType){return false}
        return {
            input:{type:'number'},label:'حداقل تعداد',field:'value.minCount',validations:[['required'],['>',0]]
        }
    }
    form_maxCount(item){
        if(!item.countType){return false}
        return {
            input:{type:'number'},label:'حداکثر تعداد',field:'value.maxCount',validations:[['required'],['>',0]]
        }
    }
    form_returnAmount(){
        return {
            input:{type:'checkbox',text:'بازگشت مبلغ روی فاکتور'},field:'value.returnAmount'
        }
    }
    form_timeType(){
        let {timeTypes} = this.state;
        return {
            input:{type:'radio',options:timeTypes},label:'محاسبه بر اساس زمان',field:'value.timeType'
        }
    }
    form_price(item){
        let label = this.getPriceLabel(item);
        return {input:{type:'number',after:this.getAfter('تومان')},field:'value.price',label,validations:[['required']]}
    }
    getPriceLabel(item){
        let timeLabel = '';
        if(item.timeType === 'hour'){timeLabel = ' هر ساعت'}
        else if(item.timeType === 'day'){timeLabel = ' هر روز'}
        let countLabel = ''
        if(item.countType){countLabel = ' هر عدد'}
        return timeLabel || countLabel?`قیمت بر اساس${timeLabel}${countLabel}`:'قیمت';
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
    form_timeLimits(item,index){
        if(!item.timeType){return false}
       return {
        props:{gap:1},
        column:[
            {size:12},
            {
                row:[
                    {html:'محدودیت ساعات هفته'},
                    {size:6},{size:24,style:{background:'red'}},{size:6},{html:'غیر قابل رزرو'},{size:12},
                    {size:24,style:{background:'green'}},{size:6},{html:'قابل رزرو'},
                ]
            },
            {size:6},
            {
                row:[
                    {size:40},
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
                {size:40,html:days[dayIndex],onClick:()=>this.changeTimeLimitByDay(index,dayIndex),className:'fs-10'},
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
                    width={96}
                    onChange={({file,url})=>{
                        this.changeItem({...item,[prop]:url,isSubmited:false},index)
                    }}
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
        let {tab} = this.state;
        if(tab !== 'user_panel'){return false}
        return {
            column:[
                // {
                //     style:{padding:12,background:'orange',color:'#fff'},
                //     row:[
                //         {
                //             size:60,
                //             html:<img src={item.image1}/>
                //         },
                //         {
                //             flex:1,
                //             column:[
                //                 {html:item.name,className:'bold',align:'v'},
                //                 {size:6},
                //                 {html:item.description,style:{width:'100%',border:'1px solid #fff',maxHeight:100,overflowY:'auto',borderRadius:6,padding:6,boxSizing:'border-box'}},
                //                 {size:12},
                //                 {
                //                     row:[
                //                         {html:this.getPriceLabel(item),flex:1,align:'v'},
                //                         {html:item.price},
                //                         {size:3},
                //                         {html:'تومان'}
                //                     ]
                //                 },
                //                 {size:12},
                //                 {
                //                     row:[
                //                         {flex:1},
                //                         {html:(<button>مشاهده و سفارش رزرو</button>)}
                //                     ]
                //                 } 
                //             ]
                //         }
                //     ]
                // },
                {
                    html:<ReservePage item={item}/>
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

class ReservePage extends Component{
    constructor(props){
        super(props);
        let {item} = props;
        let countDetails,model = {};
        if(item.countType){
            countDetails = item.countType?this.getCountDetails():undefined;
            model.count = countDetails.minCount;
        }
        if(item.timeType === 'hour'){
            model.hourRange = [1,24]
        }
        //////////for test/////////////
        // model.hourRange = [8,20];
        // model.count = 23;
        // model.date = '1402/7/3'
        ////////////////////////
        this.state = {
            model,
            countDetails,
            errors:[],
            capacityOfHours:[
                0,//ساعت 0
                0,//ساعت 1
                0,//ساعت 2
                0,//ساعت 3
                0,//ساعت 4
                0,//ساعت 5
                0,//ساعت 6
                0,//ساعت 7
                60,//ساعت 8
                60,//ساعت 9
                60,//ساعت 10
                60,//ساعت 11
                48,//ساعت 12
                48,//ساعت 13
                60,//ساعت 14
                60,//ساعت 15
                60,//ساعت 16
                60,//ساعت 17
                60,//ساعت 18
                60,//ساعت 19
                22,//ساعت 20
                22,//ساعت 21
                28,//ساعت 22
                28,//ساعت 23
            ]
        }
    }
    getCountDetails(){
        let {item} = this.props;
        let {minCount,maxCount,countUnit} = item;
        let validations = [['required','',{title:'تعداد'}],['>=',minCount,{title:'تعداد'}],['<=',maxCount,{title:'تعداد'}]]
        let label = `تعداد را مشخص کنید (از ${minCount} عدد تا ${maxCount} عدد)`
        return {validations,label,minCount,maxCount,countUnit}
    }
    getAfter(text){
        return <div style={{padding:'0 12px',background:'orange',color:'#fff',borderRadius:6}}>{text}</div>
    }
    getImage(url){
        return {html:<AIOInput type='image' value={url} preview={true} width={100} height={100} style={{width:100,height:100}}/>,size:100}
    }
    images_layout(image1,image2,image3){
        let images = [];
        if(image1){images.push(this.getImage(image1))}
        if(image2){images.push(this.getImage(image2))}
        if(image3){images.push(this.getImage(image3))}
        return {size:100,row:[{flex:1},{row:images},{flex:1}]}
    }
    description_layout(description){
        return {
            html:description,className:'p-12'
        }
    }
    day_layout(timeType){
        if(!timeType){return false}
        return {
                label:'انتخاب روز رزرو',
                input:{
                    type:'datepicker',
                    placeholder:'تایین نشده',
                    unit:'day',
                    calendarType:'jalali',
                    startYear:'-0',
                    endYear:'+0'
                },
                field:'value.date',
                validations:[['required']]
        }
    }
    hourRange_layout(timeType){
        if(timeType !== 'hour'){return false}
        let {model} = this.state;
        return {
            column:[
                this.hours_has_capacity_layout(),
                {
                    input:{type:'slider',start:1,end:24,multiple:true,showValue:'inline',direction:'left',disabled:!model.date},
                    field:'value.hourRange',label:'زمان رزرو را مشخص کنید',
                    validations:[['function',(value)=>{
                        let {model} = this.state;
                        if(!model.date){return 'ابتدا روز رزرو را مشخص کنید'}
                        if(!this.hasCapacityInHourRange(value)){
                            return 'ظرفیت در بازه زمانی انتخاب شده موجود نیست'
                        }
                        
                    }]]
                },
                
            ]
        }
    }
    count_layout(){
        let {countDetails} = this.state;
        let {countUnit,label,minCount,maxCount} = countDetails;
        return {input:{type:'slider',start:0,min:minCount,end:maxCount,after:this.getAfter(countUnit),showValue:'inline',direction:'left'},field:'value.count',label}
    }
    getDateText(){
        let {model} = this.state;
        if(model.hourRange){
            return `1400 از ساعت ${model.hourRange[0]} تا ساعت ${model.hourRange[1]}`
        }
        return AIODate().getDateByPattern({date:model.date,pattern:'{year}/{month}/{day}'})
    }
    result_layout(name,countUnit){
        let {errors,model} = this.state;
        if(errors.length){
            return {
                align:'vh',
                style:{border:'2px solid',color:'red',padding:12,borderRadius:12,background:'#ff000020'},
                column:errors.map((error)=>{
                    return {size:36,align:'v',html:error}
                })
            }
        }
        return {
            style:{border:'2px solid',color:'green',padding:12,borderRadius:12,background:'#00800020'},
            column:[
                {html:`رزرو ${name}`},
                {show:!!model.count,html:`به تعداد ${model.count} ${countUnit}`},
                {show:!!model.date,html:`برای تاریخ ${this.getDateText()}`},
                {
                    row:[
                        {flex:1},
                        {
                            html:(
                                <button style={{background:'green',color:'#fff',border:'none',borderRadius:6,padding:'3px 16px'}}>افزودن به سبد رزرو</button>
                            )
                        }
                    ]
                }
            ]
        }
    }
    getHoursCapacity(){
        let {model,capacityOfHours} = this.state;
        let {count,date} = model;
        if(!date){return []}
        let res = [];
        for(let i = 0; i < capacityOfHours.length; i++){
            let o = capacityOfHours[i]
            if(o >= count){res.push(i)}
        }
        return res
    }
    hasCapacityInHourRange(hourRange){
        let hoursCapacity = this.getHoursCapacity();
        for(let i = hourRange[0]; i < hourRange[1]; i++){
            if(hoursCapacity.indexOf(i) === -1){return false}
        }
        return true
    }
    hours_has_capacity_layout(){
        let {item} = this.props;
        let {countType,timeType} = item;
        if(!countType || timeType !== 'hour'){return false}
        let hoursCapacity = this.getHoursCapacity();
        return {
            column:[
                {html:'ساعات قابل رزرو برای تعداد انتخاب شده در روز انتخاب شده'},
                {
                    html:(
                        <div style={{}}>
                            {hoursCapacity.map((o)=>{
                                return (
                                    <div 
                                        style={{display:'inline-block',direction:'ltr',padding:'3px 6px',margin:3,background:'orange',color:'#fff',borderRadius:6}}
                                    >{`${o} : 00`}</div>
                                )
                            })}
                        </div>
                    )
                }
            ]
        }

    }
    render(){
        let {model} = this.state;
        let {item} = this.props
        let {name,image1,image2,image3,countType,timeType,description,countUnit} = item;
        return (
            <AIOInput
                type='form' lang='fa'
                inputAttrs={{
                    className:'reserve-page-input'
                }}
                value={model}
                inputs={{
                    props:{gap:12},
                    column:[
                        this.images_layout(image1,image2,image3),
                        this.description_layout(description),
                        this.count_layout(countUnit),
                        this.day_layout(timeType),
                        this.hourRange_layout(timeType),
                        this.result_layout(name,countUnit)
                    ]
                }}
                onChange={(model,errors)=>{
                    this.setState({model,errors})
                }}
                getErrors={(errors)=>this.setState({errors})}
            />
        )
    }
}
// function ReservePage({item}){
//     function getImage(url){
//         return {html:<AIOInput type='image' value={url} preview={true} width={100} height={100} style={{width:100,height:100}}/>,size:100}
//     }
//     function images_layout(){
//         let images = [];
//         if(item.image1){images.push(getImage(item.image1))}
//         if(item.image2){images.push(getImage(item.image2))}
//         if(item.image3){images.push(getImage(item.image3))}
//         return {size:100,row:[{flex:1},{row:images,gap:12},{flex:1}]}
//     }
//     function description_layout(){
//         return {
//             html:item.description,className:'p-12'
//         }
//     }
//     function time_layout(){
//         if(!item.timeType){return false}
//         return {
//                 label:item.timeType === 'hour'?'انتخاب روز و ساعت رزرو':'انتخاب روز رزرو',
//                 input:{
//                     type:'datepicker',
//                     placeholder:'تایین نشده',
//                     unit:item.timeType === 'hour'?'hour':'day',
//                     calendarType:'jalali',
//                     startYear:'-0',
//                     endYear:'+0'
//                 },
//                 field:'value.date'
//         }
//     }
//     function hours_layout(){
//         if(item.timeType !== 'hour'){return false}
//         return {
//             input:{type:'number'},field:'value.hours',label:'مدت زمان رزرو را مشخص کنید'
//         } 
//     }
//     let [model,setModel] = useState({});
//     console.log(model)
//     return (
//         <AIOInput
//             type='form'
//             inputAttrs={{
//                 className:'reserve-page-input'
//             }}
//             value={model}
//             inputs={{
//                 column:[
//                     images_layout(),
//                     description_layout(),
//                     time_layout(),
//                     hours_layout()
//                 ]
//             }}
//             onChange={(obj)=>{
//                 setModel(obj)
//             }}
//         />
//     )
// }
