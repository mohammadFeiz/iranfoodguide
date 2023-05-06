import React,{Component} from "react";
import RVD from './../npm/react-virtual-dom/react-virtual-dom';
import SearchBox from "../components/search-box";
import GroupButton from "../components/group-button";
import AIOButton from './../npm/aio-button/aio-button';
import Card from "../card/card";
import ListHeader from "../components/list-header";
import AppContext from "../app-context";
import {Icon} from '@mdi/react';
import { mdiSort } from "@mdi/js";

export default class Tab3 extends Component{
    static contextType = AppContext;
    constructor(props){
        super(props);
        this.state = {
            searchType:'0',
            selectedCategories:[],
            selectedSort:false,
            restoran_ha:[],
            pageSize:1000,
            pageNumber:1
        }
    }
    async componentDidMount(){
        let {restoran_category_options} = this.context;
        this.setState({selectedCategories:[restoran_category_options[0].value]})
        this.fetchData()
    }
    async fetchData(){
        let {apis} = this.context;
        let {pageSize,pageNumber,selectedCategories,selectedSort,searchValue,searchType} = this.state;
        apis({
            api:'jostojooye_restoran',
            name:'دریافت لیست رستوران ها',
            parameter:{pageSize,pageNumber,selectedCategories,selectedSort,searchValue,searchType},
            callback:(restoran_ha)=>this.setState({restoran_ha})
        })
    }
    search(searchValue){
        this.setState({searchValue},()=>this.fetchData());
    }
    header_layout(){
        let {searchType} = this.state;
        return {
            className:'bgFF5900',size:36,align:'vh',html:(
                <AIOButton
                    type='tabs'
                    className='restoran-search-type'
                    options={[
                        {text:'رستوران',value:'0'},
                        {text:'غذا',value:'1'}
                    ]}
                    value={searchType}
                    onChange={(searchType)=>this.setState({searchType},()=>this.fetchData())}
                />
            )

        }
    }
    toolbar_layout(){
        let {restoran_sort_options,apis} = this.context;
        let {selectedSort} = this.state;
        return {
            className:'p-12',gap:12,
            row:[
                {
                    flex:1,
                    html:(
                        <SearchBox 
                            onChange={(value)=>this.search(value)}
                            historyMode={true}
                            getHistory={async ()=>await apis({api:'tarikhche_ye_jostojoo'})}
                            removeHistory={async (text)=>await apis({api:'hazfe_tarikhche_ye_jostojoo',parameter:text}) }
                        />
                    )
                },
                {
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
            ]
        }
    }
    daste_bandi_layout(){
        let {restoran_category_options} = this.context;
        let {selectedCategories} = this.state;
        return {
            className:'p-h-12',
            html:(
                <GroupButton
                    options={restoran_category_options}
                    value={selectedCategories}
                    onChange={(selectedCategories)=>{
                        this.setState({selectedCategories})
                    }}
                />
            )
        }
    }
    items_layout(){
        let {restoran_ha} = this.state;
        return {
            flex:1,
            column:[
                {html:<ListHeader title='لیست رستوران' length={restoran_ha.length}/>},
                {size:12},
                {
                    flex:1,className:'ofy-auto',gap:12,
                    column:restoran_ha.map((o)=>{
                        return {
                            className:'p-h-12 of-visible',html:<Card type='card2' {...o}/>
                        }
                    })
                }
            ]
        }
    }
    render(){
        return (
            <RVD
                layout={{
                    style:{background:'#fff',width:'100%'},
                    column:[
                        this.header_layout(),
                        this.toolbar_layout(),
                        this.daste_bandi_layout(),
                        {size:12},
                        this.items_layout()
                    ]
                }}
            />
        )
    }
}