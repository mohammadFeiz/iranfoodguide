import React,{ Component } from "react";
import RVD from './../react-virtual-dom/react-virtual-dom';
import SearchBox from "../search-box/search-box";
import './list.css';
export default class List extends Component{
    constructor(props){
        super(props);
        let {items = []} = props;
        this.state = {items,searchValue:''};
    }
    isMatch(keys,value){
        for(let i = 0; i < keys.length; i++){
            let key = keys[i];
            if(value.indexOf(key) === -1){return false}
        }
        return true
    }
    getItemsBySearch(){
        let {items,searchValue} = this.state;
        if(!searchValue){return items}
        let keys = searchValue.split(' ');
        return items.filter(({product})=>this.isMatch(keys,product.name))
    }
    render(){
        let {config = {},renderProductCard} = this.props;
        let {header,footer} = config;
        let items = this.getItemsBySearch();
        return (
            <RVD
                layout={{
                    className:'as-list of-visible',
                    column:[
                        {
                            className:'as-list-search',
                            html:<SearchBox onChange={(searchValue)=>this.setState({searchValue})}/>
                        },
                        {
                            flex:1,
                            className:'ofy-auto as-list-products',
                            column:[
                                {show:!!header,html:()=>header},
                                {
                                    className:'of-visible',
                                    column:items.map(({product,variantId})=>{
                                        return {
                                            className:'of-visible',html:renderProductCard({product,variantId,config:{...config,type:'horizontal'}})
                                        }
                                    })
                                },
                                {show:!!footer,html:()=>footer}
                            ]
                        }
                    ]
                }}
            />
        )
    }
}