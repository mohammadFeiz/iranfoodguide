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
    option_layout({text,value,image}){
        let {type} = this.props;
        let active = !!this.dic[value]
        return {
            className:'group-button-option' + (active?' active':'') + (type === 'menu'?' group-button-menu':''),
            onClick:()=>this.click(value),
            column:[
                {flex:1,show:!!image,html:<img src={image} width='100%'/>},
                {flex:!image?1:undefined,html:text,align:'vh'}
            ]
        }
    }
    render(){
        let {options,className} = this.props;
        this.dic = this.getDic();
        return(
            <RVD
                layout={{
                    className:'group-button ofx-auto' + (className?' ' + className:''),gap:6,
                    row:options.map(({text,value,image})=>{
                        return this.option_layout({text,value,image})
                    })
                }}
            />
        )
    }
}