import React, { useContext, useEffect, useState } from "react";
import AIOInput from '../../npm/aio-input/aio-input.js';
import RVD from '../../npm/react-virtual-dom.js';
import Restorans from "./restorans.tsx";
import './back-office.css';
import AppContext from "../../app-context.js";
import { I_restoran, I_state, I_tag, I_tag_type } from "../../typs.tsx";

type I_tab = 'restorans' | 'restoranTags' | 'foodTags' | 'order-page' | 'sliders'
type I_tab_option = {text:string,value:I_tab}
export default function BackOffice() {
    let [tabs] = useState<I_tab_option[]>([
        { text: 'رستوران ها', value: 'restorans' },
        { text: 'تگ های رستوران ها', value: 'restoranTags' },
        { text: 'تگ های غذا ها', value: 'foodTags' },
    ])
    let [activeTabId,setActiveTabId] = useState<I_tab>('restorans')
    function tabs_layout() {
        return {
            html: (<AIOInput type='tabs' options={tabs} value={activeTabId} onChange={(activeTabId:I_tab) => setActiveTabId(activeTabId)}/>)
        }
    }
    function getBody() {
        if (activeTabId === 'restorans') {return (<Restorans/>)}
        if (activeTabId === 'restoranTags') {return (<Tags key='restoran' type='restoran'/>)}
        if (activeTabId === 'foodTags') {return (<Tags key='food' type='food'/>)}
        
    }
    function body_layout() {return {flex: 1,html: getBody()}}
    return (<RVD layout={{gap:12,column: [tabs_layout(),body_layout()]}}/>)
}
type I_Tags = {type:I_tag_type}
function Tags(props:I_Tags){
    let {apis,APIS}:I_state = useContext(AppContext);
    let {type} = props;
    let trans = {'restoran':'رستوران','food':'غذا'}
    let [tags,setTags] = useState<I_tag[]>();
    let [temp,setTemp] = useState<string>('')
    
    async function getTags(){
        APIS.backOffice_getTags({ type },{onSuccess:(tags:I_tag[])=>setTags(tags)})
    }
    useEffect(()=>{getTags()},[])
    function add(){
        if(tags.find((o:I_tag)=>o.name === temp)){alert('نام تگ تکراری است'); setTemp(''); return;}
        APIS.backOffice_addOrEditTag({tagName:temp,type},{
            onSuccess:(p:{id:any})=>{
                let {id} = p,newTag:I_tag = {name:temp,id};
                setTemp(''); setTags([...tags,newTag])
            }
        })
    }
    function remove(p:{row:I_tag}){
        let tag = p.row;
        APIS.backOffice_removeTag({tagId:tag.id,type},{
            onSuccess:()=>{setTemp(''); setTags(tags.filter((o:I_tag)=>o.id !== tag.id));}
        })
    }
    function header(){
        let input = <input type='text' value={temp} onChange={(e)=>setTemp(e.target.value)}/>;
        let button = <button disabled={!temp} className='bo-submit-button' onClick={()=>add()}>ثبت</button>
        return (<RVD layout={{gap:6,row:[{html:input},{html:button,align:'v'}]}}/>)
    }
    function table_layout(){
        return {
            html:(
                <AIOInput
                    type='table' toolbar={header()} value={tags} onRemove={remove}
                    columns={[
                        {title:'نام',value:'row.name',input:{type:'text',disabled:true}},
                        {title:'آی دی',value:'row.id',input:{type:'text',disabled:true}},  
                    ]}
                />
            )
        }
    }
    return !tags?null:<RVD layout={{column:[table_layout()]}}/>
}