import React,{Component, useContext, useState} from "react";
import RVD from '../npm/react-virtual-dom';
import SearchBox from "../npm/search-box/search-box";
import GroupButton from "../components/group-button";
import AIOInput from "../npm/aio-input/aio-input";
import Card from "../card/card";
import ListHeader from "../components/list-header";
import calculateDistance from '../npm/aio-functions/calculate-distance';
import AppContext from "../app-context";
import {Icon} from '@mdi/react';
import { mdiSort } from "@mdi/js";
import RestoranPage from "../components/restoran-page";
import { I_restoran, I_restoran_sort_value, I_state } from "../typs";
import { I_get_restorans_p } from "../apis/back-office-apis";
type I_searchType = '0' | '1';
type I_filter = {searchType:I_searchType,selectedSort:false|I_restoran_sort_value,selectedTags:number[],pageSize:number,pageNumber:number,searchValue:string}
export default function Search(){
    let {apis,restoran_tags,restoran_sort_options,rsa}:I_state = useContext(AppContext);
    let [filter,setFilter] = useState<I_filter>({selectedSort:false,pageSize:1000,pageNumber:1,searchValue:'',selectedTags:[],searchType:'0'})
    let [restorans,setRestorans] = useState<I_restoran[]>([])
    let timeout;
    async function fetchData(obj){
        let newFilter:I_filter = {...filter,...obj};
        let parameter:I_get_restorans_p = newFilter;
        setFilter(newFilter);
        clearTimeout(timeout);
        timeout = setTimeout(()=>{
            apis.request({
                api:'backOffice.get_restorans',description:'جستجوی رستوران ها',parameter,
                onSuccess:(restorans:I_restoran[])=>setRestorans(restorans)
            })
        },1000)
        
    }
    function tabs_layout(){
        return {
            className:'bgFF5900',size:36,align:'vh',html:(
                <AIOInput
                    type='tabs' attrs={{className:'restoran-search-type'}} value={filter.searchType}
                    options={[{text:'رستوران',value:'0'},{text:'غذا',value:'1'}]}
                    onChange={(searchType:I_searchType)=>fetchData({searchType})}
                />
            )
        }
    }
    function restoran_tags_layout(){
        return {
            className:'p-h-12',
            html:(
                <GroupButton
                    options={restoran_tags.map((o)=>{return {text:o.name,value:o.id}})} value={filter.selectedTags}
                    onChange={(selectedTags:number[])=>fetchData({selectedTags})}
                />
            )
        }
    }
    function search_layout(){
        return {flex:1,html:(<SearchBox onChange={(searchValue:string)=>fetchData({searchValue})}/>)}
    }
    function sort_layout(){
        return {
            html:(
                <AIOInput
                    type='select' caret={false}
                    optionChecked='option.value === props.value'
                    optionClose={false}
                    optionCheckIcon={{width:14,height:14,color:'orange',background:'orange'}}
                    attrs={{className:'button-2'}}
                    options={restoran_sort_options}
                    value={filter.selectedSort}
                    text={<Icon path={mdiSort} size={0.8}/>}
                    onChange={(selectedSort:I_restoran_sort_value)=>fetchData({selectedSort})}
                />
            )
        }
    }
    function openRestoranPage(restoran){
        rsa.addModal({
            position:'fullscreen',header:false,
            body:{render:()=><RestoranPage restoran={restoran} onClose={()=>rsa.removeModal()}/>}
        })
    }
    function items_layout(){
        return {
            flex:1,
            column:[
                {html:<ListHeader title='لیست رستوران' length={restorans.length}/>},
                {size:12},
                {
                    flex:1,className:'ofy-auto',gap:12,
                    column:restorans.map((o)=>{
                        return {
                            className:'p-h-12 of-visible',
                            html:(<Card type='restoran_card' {...o} onClick={()=>openRestoranPage(o)}/>)
                        }
                    })
                }
            ]
        }
    }
    return (
        <RVD
            layout={{
                style:{background:'#fff',width:'100%',height:'100%'},
                column:[
                    tabs_layout(),
                    {
                        className:'p-12',gap:12,
                        column:[
                            {gap:12,row:[search_layout(),sort_layout()]},
                            restoran_tags_layout()
                        ]
                    },
                    {size:12},
                    items_layout()
                ]
            }}
        />
    )
}