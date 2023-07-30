import React,{Component} from "react";
import RVD from './../react-virtual-dom/react-virtual-dom';
import AIOInput from "../aio-input/aio-input";
import {Icon} from "@mdi/react";
import { mdiDeleteOutline, mdiHistory, mdiMagnify } from "@mdi/js";
import './search-box.css';
export default class SearchBox extends Component{
    constructor(props){
        super(props);
        this.state = {
            searchValue:props.value || '',
            historyMode:props.historyMode,
            historyList:[]
        }
    }
    async getHistory(){
        let {history} = this.props;
        if(!history){return false}
        this.setState({historyList:await history.get()})
    }
    componentDidMount(){
        this.getHistory()
    }
    change(searchValue){
        let {onChange} = this.props;
        if(!onChange){return}
        this.setState({searchValue});
        clearTimeout(this.timeout);
        this.timeout = setTimeout(()=>onChange(searchValue),800)
    }
    icon_layout(){
        return {
            className:'search-box-icon',
            align:'vh',
            html:<Icon path={mdiMagnify} size={.8}/>
        }
    }
    input_layout(){
        let {searchValue} = this.state;
        return {
            flex:1,
            html:(
                <input 
                    type='text' value={searchValue} 
                    onChange={(e)=>this.change(e.target.value)}
                    placeholder="جستجو"
                />
            )
        }
    }
    history_layout(){
        let {historyList} = this.state;
        return {
            column:[
                {
                    html:'تاریخچه جستجو',align:'v',className:'search-box-label'
                },
                {
                    flex:1,className:'ofy-auto',column:historyList.map((text)=>this.historyItem_layout(text))
                }
            ]
        }
    }
    removeHistory(text){
        let {historyList} = this.state;
        let newHistoryList = historyList.filter((o)=>o !== text)
        this.setState({historyList:newHistoryList})
    }
    historyItem_layout(text){
        let {history} = this.props;
        return {
            size:36,className:'search-box-history-item',
            row:[
                {
                    flex:1,onClick:()=>this.change(text),
                    row:[
                        {size:36,html:<Icon path={mdiHistory} size={.9}/>,align:'vh'},
                        {flex:1,html:text,align:'v'}
                    ]
                },
                {
                    size:36,html:<Icon path={mdiDeleteOutline} size={.8}/>,align:'vh',
                    onClick:async ()=>{
                        let res = await history.remove(text);
                        if(res === true){this.removeHistory(text)}
                    }
                }
            ]
        }
    }
    historyModeRender(){
        return (
            <AIOInput
                type='button' popupWidth='fit' text={'جستجو'}
                className='search-box-button search-box-input'
                popupAttrs={{className:'search-box-popup'}}
                before={<Icon path={mdiMagnify} size={.8}/>}
                style={{width:'100%',justifyContent:'flex-start'}}
                popOver={()=>this.renderPopup()}
            />
        )
    }
    renderPopup(){
        return (
            <RVD
                layout={{
                    column:[
                        {html:this.renderSearchBox()},
                        this.history_layout()
                    ]
                }}
            />
        )
    }
    renderSearchBox(){
        return (
            <RVD
                layout={{
                    className:'search-box-input',
                    row:[
                        this.icon_layout(),
                        this.input_layout(),
                    ]
                }}
            />
        )
    }
    render(){
        let {history,onClick} = this.props;
        return (
            <div className='search-box' onClick={onClick}>
                {history && this.historyModeRender()}
                {!history && this.renderSearchBox()}
            </div>
        )
    }
}


