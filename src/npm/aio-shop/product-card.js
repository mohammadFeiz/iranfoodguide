import React, { Component } from 'react';
import RVD from '../react-virtual-dom/react-virtual-dom';
import Price from './price';
import AIOVariant from './aio-variant';
import getDiscountPercent from './getDiscountPercent';
import './product-card.css';

export default class ProductCard extends Component {
    constructor(props){
        super(props);
        let {product,variantId} = props;
        let Variant = AIOVariant(product);
        let properties = Variant.getProperties({variantId});
        let isExist = Variant.isExist({variantId})
        let discountPercentNumber = getDiscountPercent(properties.discountPercent);
        this.state = {discountPercentNumber,properties,Variant,isExist}
    }
    getImage(image,type) {
        let {onClick} = this.props;
        let props = {src:image,onClick}
        if(type === 'vertical'){props.height = '100%'}
        else if (type === 'horizontal'){props.width = '100%'}
        else if (type === 'shipping'){props.width = '100%'}
        return <img {...props} />
    }
    name_layout() { 
        let { properties } = this.state;
        let { productName } = properties;
        return { html: productName, className: 'as-product-card-name' } 
    }
    description_layout() {
        let { properties,Variant } = this.state;
        let {description} = properties;
        let {variantId} = this.props;
        let variantKey = Variant.getVariantKeyByVariantId(variantId);
        let html;
        if(variantId){html = Variant.variantsDic[variantKey].label}
        else if(description){html = description;}
        else {return false}
        if (!description && variantId === undefined) { return false }
        return { html, className: 'as-product-card-description' }
    }
    html_layout(html){
        if(!html){return null}
        return html
    }
    image_layout(){
        let { type, html } = this.props;
        let { properties } = this.state;
        let {image} = properties;
        return {
            className: 'as-product-card-image',
            align:type === 'vertical'?'vh':undefined,
            html: (
                <>
                    {this.getImage(image,type)}
                    {this.html_layout(html)}
                </>
            )
        }
    }
    cartButton_layout(){
        let {product,variantId,renderCartCountButton,config = {}} = this.props;
        let {isExist} = this.state;
        let {showCart = true} = config;
        if(!showCart){return false}
        if(!isExist){return {html:'نا موجود',className:'fs-10',color:'red',align:'v'}}
        return { 
            className:'of-visible',
            html: !isExist?'نا موجود':renderCartCountButton({product,variantId,config})
        }
    }
    getClassName(){
        let {className,type} = this.props;
        return 'as-product-card' + (className ? ' ' + className : '') + (' ' + type)
    }
    getLayout_horizontal(){
        let { properties } = this.state;
        let {price,discountPercent} = properties; 
        let {unit} = this.props;
        return {
            className: this.getClassName(),
            row: [
                this.image_layout(),
                {size:6},
                {
                    flex: 1,
                    column: [
                        {
                            flex: 1,
                            column: [
                                { size: 6 },
                                this.name_layout(),
                                this.description_layout(),
                                {
                                    className:'of-visible',
                                    row: [
                                        this.cartButton_layout(),
                                        {flex:1},
                                        {html:<Price unit={unit} price={price} discountPercent={discountPercent}/>},
                                        { size: 12 }
                                    ]
                                },
                                { size: 6 }
                            ]
                        }
                    ]
                }
            ]
        }
    }
    getLayout_vertical(){
        let {properties,variantLayout} = this.state;
        let {price,discountPercent} = properties;
        let {unit} = this.props;
        return {
            className: this.getClassName(),
            column: [
                this.image_layout(),
                {
                    flex: 1,className:'p-6',
                    column: [
                        {
                            flex: 1,
                            column: [
                                { size: 6 },
                                this.name_layout(),
                                {html:variantLayout},
                                {flex:1},
                                {html:<Price unit={unit} price={price} discountPercent={discountPercent} type='v' size='s'/>},
                                {size:6},
                                {
                                    row:[
                                        this.cartButton_layout()
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    }
    getLayout_shipping(){
        let {properties,Variant} = this.state;
        let {variantId} = this.props;
        let {price,discountPercent} = properties;
        let {variantsDic} = Variant;
        let {unit} = this.props;
        return {
            className: this.getClassName(),
            row: [
                this.image_layout(),
                {size:6},
                {
                    flex: 1,
                    column: [
                        this.name_layout(),
                        {
                            size:24,
                            html:()=>{
                                let variantKey = Variant.getVariantKeyByVariantId(variantId);
                                return variantsDic[variantKey].label;
                            },className:'fs-10',align:'v',show:variantId !== undefined},
                        {
                            row:[
                                {html:<Price unit={unit} price={price} discountPercent={discountPercent} type='h'/>,flex:1},
                                this.cartButton_layout()
                            ]
                        },
                    ]
                }
            ]
        }
    }
    render() {
        let { type = 'horizontal' } = this.props;
        return (<RVD layout={this['getLayout_' + type]()}/>)
    }
}