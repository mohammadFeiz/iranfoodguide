import React,{Component} from "react";
import RVD from '../npm/react-virtual-dom/react-virtual-dom';
import SearchBox from "./../npm/search-box/search-box";
import GroupButton from "../components/group-button";
import AIOButton from '../npm/aio-button/aio-button';
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
            searchType:'0',selected_tags:[],selectedSort:false,restorans:[],pageSize:1000,pageNumber:1
        }
    }
    async componentDidMount(){
        let {restoran_tags} = this.context;
        this.setState({selected_tags:[restoran_tags[0].value]})
        this.fetchData()
    }
    async fetchData(){
        let {apis} = this.context;
        let {pageSize,pageNumber,selected_tags,selectedSort,searchValue} = this.state;
        apis({
            api:'jostojooye_restoran',name:'دریافت لیست رستوران ها',
            parameter:{pageSize,pageNumber,selected_tags,selectedSort,searchValue},
            callback:(restorans)=>this.setState({restorans})
        })
    }
    search(searchValue){
        this.setState({searchValue},()=>this.fetchData());
    }
    tabs_layout(){
        let {searchType} = this.state;
        return {
            className:'bgFF5900',size:36,align:'vh',html:(
                <AIOButton
                    type='tabs' className='restoran-search-type' value={searchType}
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
                    onChange={(selected_tags)=>this.setState({selected_tags})}
                />
            )
        }
    }
    search_layout(){
        return {flex:1,html:(<SearchBox onChange={(value)=>this.search(value)}/>)}
    }
    sort_layout(){
        let {restoran_sort_options} = this.context;
        let {selectedSort} = this.state;
        return {
            html:(
                <AIOButton
                    type='select' caret={false}
                    optionChecked='option.value === props.value'
                    optionClose={true}
                    optionCheckIcon={{color:'orange'}}
                    className='button-2'
                    options={restoran_sort_options}
                    value={selectedSort}
                    text={<Icon path={mdiSort} size={0.8}/>}
                    onChange={(selectedSort)=>this.setState({selectedSort})}
                />
            )
        }
    }
    openRestoranPage(restoran){
        let {rsa_actions} = this.context;
        rsa_actions.addPopup({
            type:'fullscreen',
            header:false,
            body:()=>{
                return <RestoranPage {...restoran} onClose={()=>rsa_actions.removePopup()}/>
            }
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