import React,{Component} from "react";
import RVD from './../npm/react-virtual-dom/react-virtual-dom';
import {splitNumber} from './../npm/react-super-app/react-super-app';
import {Icon} from '@mdi/react';
import {mdiAccount, mdiPlusCircle} from '@mdi/js';
import AppContext from "../app-context";
export default class Profile extends Component{
    static contextType = AppContext;
    constructor(props){
        super(props);
        this.state = {
            items:[
                {icon:<Icon path={mdiAccount} size={1}/>,text:'اطلاعات شخصی'},
                {icon:<Icon path={mdiAccount} size={1}/>,text:'آدرس ها'},
                {icon:<Icon path={mdiAccount} size={1}/>,text:'تخفیف ها'},
                {icon:<Icon path={mdiAccount} size={1}/>,text:'رستوران های محبوب'},
                {icon:<Icon path={mdiAccount} size={1}/>,text:'نظرات من'},
                {icon:<Icon path={mdiAccount} size={1}/>,text:'شبکه اجتماعی غذا'},
                {icon:<Icon path={mdiAccount} size={1}/>,text:'دعوت از دوستان'},
                {icon:<Icon path={mdiAccount} size={1}/>,text:'تنظیمات'},
                {icon:<Icon path={mdiAccount} size={1}/>,text:'قوانین'},
                {icon:<Icon path={mdiAccount} size={1}/>,text:'خروج'}
            ]
        }
    }
    header_layout(){
        let {profile} = this.context;
        return {
            className:'p-6',
            row:[
                {
                    size:60,align:'vh',
                    html:<Icon path={mdiAccount} size={1.4} style={{border:'1px solid',padding:6,width:36,height:36,borderRadius:'100%'}}/>
                },
                {
                    flex:1,
                    column:[
                        {flex:1},
                        {html:`${profile.firstname} ${profile.lastname}`,className:'fs-14 bold'},
                        {html:profile.mobile,className:'fs-12'},
                        {flex:1}
                    ]
                },
                {
                    column:[
                        {flex:1},
                        {
                            align:'v',gap:3,
                            style:{border:'1px solid'},
                            className:'h-24 br-12 p-h-6',
                            row:[
                                {html:'کیف پول',className:'fs-10'},
                                {html:splitNumber(profile.wallet),className:'fs-12 bold'},
                                {html:'تومان',className:'fs-10'},
                                {html:<Icon path={mdiPlusCircle} size={0.7}/>}
                            ]
                        },
                        {flex:1}
                    ]
                }
            ]
        }
    }
    body_layout(){
        let {items} = this.state;
        return {
            flex:1,className:'ofy-auto',
            column:items.map(({icon,text})=>{
                return {
                    size:48,
                    row:[
                        {size:48,html:icon,align:'vh'},
                        {flex:1,html:text,align:'v'}
                    ]
                }
            })
        }
    }
    render(){
        return (
            <RVD
                layout={{
                    column:[
                        this.header_layout(),
                        this.body_layout()
                    ]
                }}
            />
        )
    }
}