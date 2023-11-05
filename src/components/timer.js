import React,{Component} from "react";
import RVD from './../npm/react-virtual-dom';
import AIODate from './../npm/aio-date';
import { icons } from "../icons";
export default class Timer extends Component{
    constructor(props){
        super(props);
        let {endDate} = props;
        let delta = AIODate().getDelta({date:endDate,pattern:'{day}:{hour}:{minute}:{second}'})
        this.state = {delta}
        setInterval(()=>{
            let delta = AIODate().getDelta({date:endDate,pattern:'{day}:{hour}:{minute}:{second}'})
            this.setState({delta})
        },1000)
    }
    render(){
        let {delta} = this.state;
        return (
            <RVD
                layout={{
                    className:'br-12',style:{height:256,width:96,color:'#fff',height:16},
                    row:[
                        {flex:1},
                        {
                            style:{background:'#fff',borderRadius:12,width:'fit-content',color:'#333'},
                            className:'fs-14 bold p-h-6',
                            row:[{html:delta,align:'v'},{size:6},{html:icons('time'),align:'vh'}]
                        },
                        {flex:1}
                    ]   
                }}
            />
        )
    }
}