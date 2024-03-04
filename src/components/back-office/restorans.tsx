import React, { useContext, useEffect, useState } from "react";
import AIOInput from '../../npm/aio-input/aio-input';
import RVD,{I_RVD_node} from '../../npm/react-virtual-dom/index.tsx';
import { Icon } from "@mdi/react";
import {Search} from 'aio-utils';
import { mdiMagnify, mdiFormatListBulletedSquare, mdiMapMarkerAlert, mdiMapMarkerCheck, mdiClose, mdiPlusThick, mdiDotsHorizontal, mdiPencil, mdiDelete } from '@mdi/js';
import AppContext from './../../app-context';
import './back-office.css';
import { I_food, I_foodId, I_restoran, I_restoranId, I_state, I_tag } from "../../typs.tsx";
import { I_bo_addOrEditFood_param, I_bo_addOrEditFood_result, I_bo_addOrEditRestoran_param, I_bo_addOrEditRestoran_result } from "../../apis/APIClass.tsx";
export default function Restorans() {
    let {APIS,rsa}:I_state = useContext(AppContext)
    let [restorans,setRestorans] = useState<I_restoran[]>([])
    async function getRestorans() {
        APIS.backOffice_getRestorans({},{ 
            onSuccess:(restorans:I_restoran[])=>setRestorans(restorans)
        }); 
    }
    let [searchValue,setSearchValue] = useState<string>('')
    async function remove_restoran(restoranId:I_restoranId) {
        APIS.backOffice_removeRestoran(restoranId,{
            onSuccess: () => {
                let newRestorans:I_restoran[] = restorans.filter((o) => o.id !== restoranId)
                setRestorans(newRestorans);
                rsa.removeModal();
            }
        })
    }
    function onMount(){getRestorans();}
    useEffect(()=>{onMount()},[])
    function header_layout():I_RVD_node {
        return {
            className: 'p-h-12',
            gap:12,
            row: [
                { size: 96, align: 'vh', html: 'افزودن رستوران', onClick: () => openModal('add'), className: 'fs-12', style: { background: 'orange', color: '#fff'} },
                {
                    flex: 1,
                    html: (
                        <AIOInput
                            placeholder='جستجو'
                            type='text' attrs={{style:{ width: '100%', background: '#fff' }}} value={searchValue}
                            after={<Icon path={mdiMagnify} size={.9} />}
                            onChange={(searchValue) => setSearchValue(searchValue)}
                        />
                    )
                }
            ]
        }
    }
    function getRestoransBySearch() {
        return Search(restorans, searchValue, (o:I_restoran) => `${o.name} ${o.address} ${o.phone}`)
    }
    function body_layout():I_RVD_node {
        let list = getRestoransBySearch();
        return {
            flex: 1, className: 'ofy-auto p-12', gap: 6,
            column: list.map((restoran) => {
                let onClick = ()=>openModal('edit',restoran);
                let onRemove = ()=>remove_restoran(restoran.id);
                return {html:<RestoranCard key={restoran.id} onClick={onClick} onRemove={onRemove} restoran={restoran}/>}
            })
        }
    }
    function openModal(type:'add' | 'edit', restoran?:I_restoran) {
        if (type === 'add') {
            restoran = {
                id:0,deliveryTime:30,tax:0,imageId:0,logoId:0,
                name: '', image: '', logo: '', latitude: 35.699739, longitude: 51.338097, startTime: 8, endTime: 12,
                address: '', ifRate: 0, ifComment: '', tags: [], phone: '',
            }
        }
        rsa.addModal({
            header:{title: type === 'add' ? 'افزودن رستوران' : 'ویرایش رستوران'}, position: 'fullscreen',
            body: {render:() => <RestoranForm type={type} restoran={restoran} onSubmit={(newRestoran:I_restoran)=>{
                let newRestorans:I_restoran[];
                if(type === 'add'){newRestorans = [newRestoran, ...restorans];}
                else {newRestorans = restorans.map((restoran:I_restoran) => restoran.id === newRestoran.id ? newRestoran : restoran);}
                setRestorans(newRestorans);
                rsa.removeModal();
            }} />}
        })
    }
    return (<RVD layout={{ column: [header_layout(), body_layout()] }} />)
    
}
type I_RestoranCard = {onClick:()=>void,restoran:I_restoran,onRemove:()=>void,key?:any}
function RestoranCard(props:I_RestoranCard){
    let {restoran_tags}:I_state = useContext(AppContext);
    let {onClick,restoran,onRemove} = props;
    function image_layout(image){return {size:60,html:<img src={image} width='100%' alt=''/>}}
    
    function body_layout():I_RVD_node{
        let row1 = {row: [name_layout(),remove_layout()]};
        let row2 = { row: [tags_layout(), code_layout()] };
        return {flex: 1,column: [row1,row2],className:'p-6'}
    }
    function name_layout():I_RVD_node{return { flex: 1, html: restoran.name }}
    function remove_layout():I_RVD_node{return {html:<Icon path={mdiClose} size={.9}/>,onClick:onRemove}}
    function tags_layout():I_RVD_node{return { flex: 1, html: getTagNames(restoran.tags), className: 'fs-10' }}
    function getTagNames(tags:number[]){
        let tagNames = tags.map((tagId)=>{
            let tag = restoran_tags.find((o:I_tag)=>o.id === tagId);
            return tag.name
        })
        return tagNames.join(',')
    }
    
    function code_layout():I_RVD_node{return { html: `کد : ${restoran.id}` }}
    return <RVD layout={{onClick, className: 'bo-restoran-card',row: [image_layout(restoran.image),body_layout()]}}/>;
    
}
type I_RestoranForm = {restoran?:I_restoran,type:'add'|'edit',onSubmit:(newRestoran:I_restoran)=>void}
function RestoranForm(props:I_RestoranForm) {
    let {restoran_tags,rsa,APIS}:I_state = useContext(AppContext)
    let {type,onSubmit} = props;
    let [model,setModel] = useState<I_restoran>({ ...props.restoran })
    let [timeOptions] = useState<{text:React.ReactNode,value:React.ReactNode}[]>(
        new Array(24).fill(0).map((o, i) => {
            let hour = i.toString();
            hour = hour.length === 1 ? `0${hour}` : hour;
            return { text: <div style={{ direction: 'ltr' }}>{`${hour}:00`}</div>, value: `${hour}:00` }
        })
    )
    function foods_layout():I_RVD_node {
        if(type !== 'edit'){return {}}
        return {
            column: [
                { html: 'منوی رستوران', className: 'fs-12' },
                {
                    style: { border: '1px dashed #333', padding: 6 },
                    html: (
                        <RVD
                            layout={{
                                onClick: () => openFoods(),style:{width:72,height:72},align:'vh',
                                column: [
                                    { align: 'vh', html: <Icon path={mdiFormatListBulletedSquare} size={1} />, style: { color: 'orange' } },
                                    { html: <Foods restoranId={model.id} justLength={true}/>, align: 'vh' }
                                ]
                            }}
                        />
                    )
                }
            ]
        }
    }
    function map_layout() {
        return {
            flex:1,
            label:'موقعیت رستوران',
            field:{lat:model.latitude,lng:model.longitude},
            input:{
                type:'map',style:{ width: '100%', height: '100%' },
                    mapConfig:{draggable:false},popup:{title:'انتخاب موقعیت'},
                    onChangeAddress:(address)=>setModel({ ...model,address }),
                    onChange:(p:{lat:number,lng:number})=>setModel({ ...model, latitude:p.lat, longitude:p.lng })
                }
        }
    }
    function image_layout(p:{width:number,height:number,field:string,idField:string,label:string}) {
        let {field,width,height,label,idField} = p
        return {
            props:{gap:0},
            column: [
                { html: label, className: 'fs-12' },
                {
                    className: 'p-6 of-hidden',
                    style: { border: '1px dashed #333' },
                    label,
                    field:{url:model[field]},
                    input:{
                        type:'image',width,height,placeholder:label,
                        onChange:(p:{file:any,url:string})=>{
                            let {file} = p;
                            APIS.addOrEditImage({imageFile:file,imageId:model.imageId},{
                                description:`ثبت ${label}`,message:{success:true},
                                onSuccess:(p)=>{
                                    let {id,url} = p;
                                    setModel({...model,[idField]:id,[field]:url})
                                }
                            })
                        }
                    }
                }
            ]
        }
    }
    function submit(){
        let parameter:I_bo_addOrEditRestoran_param = {newRestoran:model,type};
        APIS.backOffice_addOrEditRestoran(parameter,{
            onSuccess: async (p:I_bo_addOrEditRestoran_result) => onSubmit({...model,id:p.id})
        })
    }
    function form_layout():I_RVD_node {
        return {
            className: 'admin-panel-restoran-card p-12 ofy-auto',flex:1,
            html: (
                <AIOInput
                    attrs={{style:{height:'100%',fontSize:12}}}
                    type='form' lang='fa' value={{...model}}
                    onChange={(model,errors) => setModel(model)}
                    onSubmit={()=>submit()}
                    inputs={{
                        props:{gap:12,inlineLabelAttrs:{style:{width:90,fontSize:12,justifyContent:'end',padding:'0 12px'}}},
                        column: [
                            {
                                row: [
                                    image_layout({width:200,height:72,label:'تصویر رستوران',field:'image',idField:'imageId'}),
                                    {flex:1},
                                    image_layout({width:72,height:72,label:'لوگوی رستوران',field:'logo',idField:'logoId'})
                                ]
                            },
                            {row: [map_layout(),{flex:1},foods_layout()]},
                            {
                                row:[
                                    { input: { type: 'text' }, field: 'value.name', inlineLabel: 'نام', validations: [['required']] },
                                    { input: { type: 'text', disabled: true }, field: 'value.id', show: model.id !== undefined,size:72 }
                                ]
                            },
                            { input: { type: 'textarea' }, field: 'value.address', inlineLabel: 'آدرس', validations: [['required']] },
                            { input: { type: 'text', justNumber: true }, field: 'value.phone', inlineLabel: 'تلفن ثابت', validations: [['required']] },
                            {
                                row:[
                                    { input: { type: 'select', options: timeOptions }, field: 'value.startTime', inlineLabel: 'ساعت شروع', validations: [['required']] },
                                    { input: { type: 'select', options: timeOptions }, field: 'value.endTime', inlineLabel: 'ساعت پایان', validations: [['required']]},
                                ]
                            },
                            {
                                row:[
                                    { input: { type: 'number' }, field: 'value.tax', inlineLabel: 'درصد مالیات', validations: [['>=', 0], ['<=', 100]] },
                                    { input: { type: 'number' }, field: 'value.deliveryTime', inlineLabel: 'زمان ارسال (دقیقه)' },
                            
                                ]
                            },
                            { input: { type: 'multiselect', options: restoran_tags, optionText: 'option.name', optionValue: 'option.id' }, text: 'انتخاب تگ', field: 'value.tags', inlineLabel: 'تگ ها' },
                        ]
                    }}
                />
            )
        }
    }
    function openFoods() {
        rsa.addModal({
            header:{title: `منوی رستوران ${model.name}`}, position: 'fullscreen',
            body: {render:() => <Foods restoranId={props.restoran.id}/>}
        })
    }
    return (<RVD layout={form_layout()} />)
}

type I_Foods = {restoranId:I_restoranId,justLength?:boolean}
function Foods(props:I_Foods) {
    let {APIS,rsa}:I_state = useContext(AppContext);
    let {restoranId,justLength} = props;
    let [foods,setFoods] = useState<I_food[]>()
    function getFoods(){
        APIS.backOffice_getRestoranFoods({restoranId},{ 
            onSuccess: (foods:I_food[]) => setFoods(foods) 
        })
    }
    useEffect(()=>{getFoods()},[])
    async function remove_food(id:I_foodId):Promise<boolean> {
        let res:boolean = await APIS.backOffice_removeFood({restoranId,foodId:id},{
            onSuccess:()=>setFoods(foods.filter((food:I_food) => food.id !== id))
        })
        return res
    }
    function openFoodForm(type:'add'|'edit',food?:I_food){
        rsa.addModal({
            header:{title:`${type === 'add'?'افزودن':'ویرایش'} غذا`},
            body:{
                render:()=>{
                    let siblingFoods = foods.filter((o:I_food)=>o.id !== food.id && o.data.parentId === null && o.data.menuCategory === food.data.menuCategory)
                    let props:I_FoodForm = {
                        food,type,restoranId,siblingFoods,
                        onSubmit:(newFood:I_food)=>{
                            if(type === 'add'){setFoods([...foods,{...newFood}]);}
                            else if(type === 'edit'){setFoods(foods.map((food:I_food)=>food.id === newFood.id?newFood:food))}
                            rsa.removeModal()
                        }
                    }
                    return <FoodForm {...props}/>
                }
            }
        })
    }
    function header_layout():I_RVD_node{
        if(!foods){return {}}
        return {
            row:[
                {html:<button onClick={()=>openFoodForm('add')}><Icon path={mdiPlusThick} size={0.8}/>افزودن غذا</button>}
            ]
        }
    }
    function body_layout():I_RVD_node{
        if(!foods){return {html:'در حال بارگزاری',align:'vh',size:300}}
        return {flex:1,className:'ofy-auto',column:foods.map((o:I_food)=>foodCard_layout(o))}
    }
    function name_layout(food:I_food):I_RVD_node{return {flex:1,html:food.name,className:'fs-12 bold',align:'v'}}
    function options_layout(food:I_food):I_RVD_node{
        let confirmProps = {title:'حذف غذا',text:'آیا از حذف غذا اطمینان دارید؟',onSubmit:async ()=>await remove_food(food.id)}
        return {
            size:30,align:'vh',
            html:(
                <AIOInput
                    type='select' text={<Icon path={mdiDotsHorizontal} size={0.8}/>}
                    options={[
                        {text:'ویرایش',onClick:()=>openFoodForm('edit',food),before:<Icon path={mdiPencil} size={0.8}/>},
                        {text:'حذف',onClick:()=>rsa.addConfirm(confirmProps),before:<Icon path={mdiDelete} size={0.8}/>},
                    ]}
                />
            )
        }
    }
    function foodCard_layout(food:I_food):I_RVD_node{
        let {images} = food;
        return {
            row:[
                {size:60,html:<img src={images[0]} alt='' width='100%'/>,align:'vh'},
                {flex:1,column:[{row:[name_layout(food),options_layout(food)]}]}
            ]
        }
    }
    if(justLength){return <div>{`${foods.length} مورد`}</div>}
    if(!foods){return <button onClick={()=>getFoods()}>دریافت لیست غذا ها</button>}
    return (<RVD layout={{column:[header_layout(),body_layout()]}}/>)
}
type I_FoodForm = {restoranId:I_restoranId,type:'add' | 'edit',food?:I_food,onSubmit:(food:I_food)=>void,siblingFoods:I_food[]}
function FoodForm(props:I_FoodForm){
    let {APIS,food_tags}:I_state = useContext(AppContext);
    let {restoranId,type,onSubmit,siblingFoods} = props;
    let [food,setFood] = useState<I_food>()
    function getFood(){if(type === 'add'){setFood({} as I_food)} else{setFood(props.food)}}
    useEffect(()=>{getFood()},[])
    function changeImage(file:any){
        APIS.addOrEditImage({ imageId:food.imageId,imageFile:file },{
            description: 'ثبت تصویر منوی رستوران',
            onSuccess:(p)=>{
                let {id,url} = p;
                setFood({...food,imageId:id,image:url})
            }
        })
    }
    function submit(){
        if(!food.imageId){alert('لطفا تصویر غذا را انتخاب کنید'); return}
        let parameter:I_bo_addOrEditFood_param = { restoranId, newFood:food,type }
        APIS.backOffice_addOrEditFood(parameter,{
            onSuccess:(p:I_bo_addOrEditFood_result)=>onSubmit({...food,id:p.id})
        })
    }
    function getParentFoods(){
        let options = siblingFoods.map((o:I_food)=>{
            let {name,id} = o;
            return {text:name,value:id}
        })
        options = [{text:'انتخاب نشده',value:null},...options]
        return options
    }
    function getInputs(){
        return {
            props:{gap:12},
            column:[
                {label:'تصویر',field:'value.image',validations:[['required']],input:{type:'image',width:90,preview:true,onChange:({file})=>changeImage(file)}},
                {label:'نام',field:'value.name',validations:[['required']],input:{type:'text'}},
                {label:'توضیحات مختصر',field:'value.description',validations:[['required']],input:{type:'text'}},
                {label:'توضیحات کامل',field:'value.review',validations:[['required']],input:{type:'textarea'}},
                {label:'تنظیم این غذا به عنوان زیر مجموعه ی',field:'value.parentId',input:{type:'select',options:getParentFoods()}},
                {label:'قیمت',field:'value.price',validations:[['required']],input:{type:'number',after:'تومان'}},
                {label:'درصد تخفیف',field:'value.discountPercent',validations:[['required']],input:{type:'number',after:'%'}},
                {label:'موجودی روزانه',field:'value.dailyInStock',validations:[['required']],input:{type:'number',after:'عدد'}},
                {label:'تگ ها',field:'value.tags',input:{type:'multiselect',options:food_tags,optionText:'option.name',optionValue:'option.id'}},
                {label:'موجودی امروز',field:'value.inStock',input:{type:'number',after:'عدد'}},

            ]
        }
    }
    return (
        <AIOInput
            type='form' value={{...food}} lang='fa' onSubmit={()=>submit()} inputs={getInputs()}
            submitText={type === 'add'?'افزودن':'ویرایش'} onChange={(newFood:I_food)=>setFood(newFood)}
        />
    )
}
