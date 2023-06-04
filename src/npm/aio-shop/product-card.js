import React, { Component } from 'react';
import RVD from '../react-virtual-dom/react-virtual-dom';
import Price from './price';
import AIOVariant from './aio-variant';
import getDiscountPercent from './getDiscountPercent';
import './product-card.css';

export default class ProductCard extends Component {
    constructor(props){
        super(props);
        let {product,variantId,getIconByKey} = props;
        let Variant = AIOVariant(product)
        let variantLayout = Variant.getList(variantId,getIconByKey); 
        let properties = Variant.getVariant(variantId);
        let discountPercentNumber = getDiscountPercent(properties.discountPercent);
        this.state = {discountPercentNumber,variantLayout,properties}
    }
    getImage(image,type) {
        let {onClick} = this.props;
        let props = {src:image,onClick}
        if(type === 'vertical'){props.height = '100%'}
        else if (type === 'horizontal'){props.width = '100%'}
        else if (type === 'shipping'){props.width = '100%'}
        return <img {...props} />
    }
    discount_layout() {
        let {properties,discountPercentNumber} = this.state;
        if(!discountPercentNumber){return false}
        let {price,discountPercent} = properties;
        let {type = 'horizontal',unit} = this.props;
        if(type !== 'horizontal'){return false}
        return <Price price={price} unit={unit} discountPercent={discountPercent} type='h' size='s' style={{position:'absolute',left:6,top:6}} showPrice={false}/>
    }
    name_layout() { 
        let { properties } = this.state;
        let { productName } = properties;
        return { html: productName, className: 'as-product-card-name' } 
    }
    description_layout() {
        let { variantLayout,properties } = this.state;
        let {description} = properties;
        if (!description && !variantLayout) { return false }
        return { html: variantLayout || description, className: 'as-product-card-description' }
    }
    price_layout() {
        let { properties } = this.state;
        let {price,discountPercent} = properties; 
        let {unit} = this.props;
        return {
            html:<Price unit={unit} price={price} discountPercent={discountPercent} type='h' showDiscountPercent={false}/>
        }
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
                    {this.discount_layout()}
                    {this.html_layout(html)}
                </>
            )
        }
    }
    cartButton_layout(){
        let {product,variantId,renderCartCountButton,config = {}} = this.props;
        let {showCart = true} = config;
        if(!showCart){return false}
        return { 
            className:'of-visible',
            html: renderCartCountButton({product,variantId,config})
        }
    }
    getClassName(){
        let {className,type} = this.props;
        return 'as-product-card' + (className ? ' ' + className : '') + (' ' + type)
    }
    getLayout_horizontal(){
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
                                        this.price_layout(),
                                        {flex:1},
                                        this.cartButton_layout(),
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
                                        {flex:1},
                                        this.cartButton_layout(),
                                    ]
                                },
                            ]
                        }
                    ]
                }
            ]
        }
    }
    getLayout_shipping(){
        let {properties} = this.state;
        let {price,discountPercent,variantName} = properties;
        let {unit} = this.props;
        return {
            className: this.getClassName(),
            row: [
                this.image_layout(),
                {size:6},
                {
                    flex: 1,
                    column: [
                        { flex: 1 },
                        this.name_layout(),
                        {html:variantName,className:'as-fs-s as-fc-m m-b-6 as-bold',align:'v',show:!!variantName},
                        {
                            row:[
                                {html:<Price unit={unit} price={price} discountPercent={discountPercent} type='h' size='s'/>,flex:1},
                                this.cartButton_layout()
                            ]
                        },
                        { flex: 1 }
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