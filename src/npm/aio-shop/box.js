import React, { Component } from 'react';
import RVD from '../react-virtual-dom/react-virtual-dom';
import { Icon } from '@mdi/react';
import { mdiChevronDown,mdiChevronLeft } from '@mdi/js';
import './box.css';

export default class Box extends Component{
    constructor(props){
        super(props);
        this.state={open:true,toggleShowAll:false}
    }
    toggle_layout(toggle){
        if(!toggle){return false}
        let {open} = this.state;
        return {
            size:30,align:'vh',html:<Icon path={open?mdiChevronDown:mdiChevronLeft} size={1}/>
        }
    }
    header_layout(title, subtitle,toggle,showAll){
        let {toggleShowAll} = this.state;
        return {
            className: 'as-fs-l as-fc-d as-bold',
            onClick:toggle?()=>this.setState({open:!this.state.open}):undefined,
            row: [
                this.toggle_layout(toggle),
                { html: title, align: 'v' },
                { show: !!subtitle, html: `( ${subtitle} )`, className:'as-fs-s as-fc-l as-box-subtitle', align: 'v' },
                {flex:1},
                {
                    show:!!showAll,
                    html:toggleShowAll?'نمایش کمتر':'نمایش همه',
                    className:'as-link',
                    onClick:()=>this.setState({toggleShowAll:!toggleShowAll})
                }
            ]
        }
    }
    render(){
        let {open,toggleShowAll} = this.state;
        let {title,subtitle,content,layout,toggle,showAll} = this.props;
        return (
            <RVD
                layout={{
                    className: 'as-box',
                    column: [
                        this.header_layout(title, subtitle,toggle,showAll),
                        {size:12,show:!!open && !!title},
                        {show:!!open && !!content,html: typeof content === 'function'?content(toggleShowAll):content,className:'as-fs-m as-fc-m as-box-content'},
                        {...layout,show:!!open && !!layout && layout.show !== false,className:'as-fs-m as-fc-m as-box-content' + (layout && layout.className?' ' + layout.className:'')}
                    ]
                }}
            />
        )
    }
}