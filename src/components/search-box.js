import React,{Component} from "react";
import RVD from './../npm/react-virtual-dom/react-virtual-dom';
import AIOButton from './../npm/aio-button/aio-button';
import {Icon} from "@mdi/react";
import { mdiDeleteOutline, mdiHistory, mdiMagnify } from "@mdi/js";
import './search-box.css';
export default class SearchBox extends Component{
    constructor(props){
        super(props);
        this.state = {
            searchValue:props.value || '',
            historyMode:props.historyMode,
            history:[]
        }
    }
    async getHistory(){
        let {getHistory,historyMode} = this.props;
        if(!historyMode){return false}
        let history = await getHistory();
        this.setState({history})
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
        let {history} = this.state;
        return {
            column:[
                {
                    html:'تاریخچه جستجو',align:'v',className:'search-box-label'
                },
                {
                    flex:1,className:'ofy-auto',column:history.map((text)=>this.historyItem_layout(text))
                }
            ]
        }
    }
    removeHistory(text){
        let {history} = this.state;
        let newHistory = history.filter((o)=>o !== text)
        this.setState({history:newHistory})
    }
    historyItem_layout(text){
        let {removeHistory} = this.props;
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
                        let res = await removeHistory(text);
                        if(res === true){this.removeHistory(text)}
                    }
                }
            ]
        }
    }
    historyModeRender(){
        return (
            <AIOButton
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
        let {historyMode,onClick} = this.props;
        return (
            <div className='search-box' onClick={onClick}>
                {historyMode && this.historyModeRender()}
                {!historyMode && this.renderSearchBox()}
            </div>
        )
    }
}


