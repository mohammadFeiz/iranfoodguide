import React,{Component} from "react";
import RVD from './../npm/react-virtual-dom/react-virtual-dom';
import './group-button.css';
export default class GroupButton extends Component{
    getDic(){
        let {value} = this.props;
        let dic = {};
        for(let i = 0; i < value.length; i++){
            dic[value[i]] = true
        }
        return dic
    }
    click(val){
        let {value,onChange} = this.props;
        onChange(this.dic[val]?value.filter((o)=>o !== val):value.concat(val),val)
    }
    option_layout({text,value}){
        let active = !!this.dic[value]
        return {
            html:(
                <button 
                    className={'group-button-option' + (active?' active':'')}
                    onClick={()=>this.click(value)}
                >
                    {text}
                </button>
            )
        }
    }
    render(){
        let {options,className} = this.props;
        this.dic = this.getDic();
        return(
            <RVD
                layout={{
                    className:'group-button ofx-auto' + (className?' ' + className:''),gap:6,
                    row:options.map(({text,value})=>{
                        return this.option_layout({text,value})
                    })
                }}
            />
        )
    }
}