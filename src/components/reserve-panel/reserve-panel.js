import React, { Component } from "react";
import RVD from './../../npm/react-virtual-dom/react-virtual-dom';
import AppContext from "../../app-context";
export default class Profile extends Component {
    static contextType = AppContext;
    constructor(props) {
        super(props);
        this.state = {
            items:[
                {
                    image:'',
                    name:'',
                    persons:6,
                    description:'میز تراس 6 نفره'
                }
            ]
        }
    }
    header_layout(){
        return {html:'msf'}
    }
    items_layout(){
        let {items} = this.state;
        return {
            column:items.map((o)=>{
                return {
                    html:this.item_layout(o)
                }
            })
        }
    }
    item_layout(){
        return {
            column:[
                this.images_layout()
            ]
        }
    }
    render() {
        return (
            <RVD
                layout={{
                    column: [
                        this.header_layout(),
                        this.items_layout()
                    ]
                }}
            />
        )
    }
}

