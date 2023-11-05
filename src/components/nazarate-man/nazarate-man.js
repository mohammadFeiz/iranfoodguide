import React,{Component} from "react";
import RVD from './../../npm/react-virtual-dom';
import PopupHeader from './../../components/popup-header';
import AppContext from "../../app-context";
export default class Nazarate_man extends Component{
    static contextType = AppContext;
    render(){
        let {items} = this.state;
        return (
            <RVD
                style={{background:'#fff',height:'100%'}}
                layout={{
                    column:[
                        {html:<PopupHeader title='نظرات من'/>},
                        {
                            flex:1,gap:6,className:'ofy-auto',
                            column:items.map((o)=>{
                                return {html:<NazarCard {...o}/>}
                            })
                        }
                    ]
                }}
            
            />
        )
    }
}

