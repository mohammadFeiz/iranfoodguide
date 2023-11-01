import React,{Component} from "react";
import RVD from '../npm/react-virtual-dom/react-virtual-dom';
import SearchBox from "./../npm/search-box/search-box";
import GroupButton from "../components/group-button";
import AIOInput from "../npm/aio-input/aio-input";
import Card from "../card/card";
import ListHeader from "../components/list-header";
import calculateDistance from './../npm/aio-functions/calculate-distance';
import AppContext from "../app-context";
import {Icon} from '@mdi/react';
import { mdiSort } from "@mdi/js";
import RestoranPage from "../components/restoran-page";

export default class Search extends Component{
    static contextType = AppContext;
    constructor(props){
        super(props);
        this.state = {
            searchType:'0',selected_tags:[],selectedSort:false,restorans:[],pageSize:1000,pageNumber:1,searchValue:''
        }
    }
    // async componentDidMount(){
    //     let {restoran_tags = []} = this.context;
    //     this.setState({selected_tags:restoran_tags[0]?[restoran_tags[0].value]:[]})
    //     this.fetchData()
    // }
    async fetchData(){
        let {apis} = this.context;
        let {pageSize,pageNumber,selected_tags,selectedSort,searchValue = ''} = this.state;
        apis.request({
            api:'backOffice.get_restorans',description:'جستجوی رستوران ها',
            parameter:{pageSize,pageNumber,selected_tags,selectedSort,searchValue},
            onSuccess:(restorans)=>this.setState({restorans})
        })
    }
    changeState(obj){
        this.setState(obj);
        clearTimeout(this.timeout);
        this.timeout = setTimeout(()=>this.fetchData(),1000)
    }
    search(searchValue){
        this.setState({searchValue},()=>this.fetchData());
    }
    tabs_layout(){
        let {searchType} = this.state;
        return {
            className:'bgFF5900',size:36,align:'vh',html:(
                <AIOInput
                    type='tabs' attrs={{className:'restoran-search-type'}} value={searchType}
                    options={[{text:'رستوران',value:'0'},{text:'غذا',value:'1'}]}
                    onChange={(searchType)=>this.setState({searchType},()=>this.fetchData())}
                />
            )
        }
    }
    restoran_tags_layout(restoran_tags,selected_tags){
        return {
            className:'p-h-12',
            html:(
                <GroupButton
                    options={restoran_tags.map((o)=>{return {text:o.name,value:o.id}})} value={selected_tags}
                    onChange={(selected_tags)=>this.changeState({selected_tags})}
                />
            )
        }
    }
    search_layout(){
        return {flex:1,html:(<SearchBox onChange={(value)=>this.changeState({searchValue:value})}/>)}
    }
    sort_layout(){
        let {restoran_sort_options} = this.context;
        let {selectedSort} = this.state;
        return {
            html:(
                <AIOInput
                    type='select' caret={false}
                    optionChecked='option.value === props.value'
                    optionClose={false}
                    optionCheckIcon={{width:14,height:14,color:'orange',background:'orange'}}
                    attrs={{className:'button-2'}}
                    options={restoran_sort_options}
                    value={selectedSort}
                    text={<Icon path={mdiSort} size={0.8}/>}
                    onChange={(selectedSort)=>this.changeState({selectedSort})}
                />
            )
        }
    }
    openRestoranPage(restoran){
        let {rsa} = this.context;
        rsa.addModal({
            position:'fullscreen',header:false,
            body:{render:()=><RestoranPage restoran={restoran} onClose={()=>rsa.removeModal()}/>}
        })
    }
    items_layout(){
        let {restorans} = this.state;
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
                            html:(<Card type='restoran_card' {...o} onClick={()=>this.openRestoranPage(o)}/>)
                        }
                    })
                }
            ]
        }
    }
    render(){
        let {restoran_tags} = this.context;
        let {selected_tags} = this.state;
        
        return (
            <RVD
                layout={{
                    style:{background:'#fff',width:'100%',height:'100%'},
                    column:[
                        this.tabs_layout(),
                        {
                            className:'p-12',
                            column:[
                                {gap:12,row:[this.search_layout(),this.sort_layout()]},
                                {size:12},
                                this.restoran_tags_layout(restoran_tags,selected_tags)
                            ]
                        },
                        {size:12},
                        this.items_layout()
                    ]
                }}
            />
        )
    }
}