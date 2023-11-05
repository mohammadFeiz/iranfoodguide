import React,{Component} from "react";
import RVD from './../npm/react-virtual-dom';

export default class ListHeader extends Component{
    render(){
        let {title,length} = this.props;
        return (
            <RVD
                layout={{
                    className:'p-h-12',
                    row:[
                        {html:title,flex:1,className:'bold fs-16'},
                        {show:length !== undefined,html:`${length} مورد`,className:'fs-14'}
                    ]
                }}
            />
        )
    }
}