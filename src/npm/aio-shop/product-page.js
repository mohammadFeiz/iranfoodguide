import React, { Component } from 'react';
import RVD from '../react-virtual-dom/react-virtual-dom';
import AIOButton from './../../npm/aio-button/aio-button';
import AIOVariant from './aio-variant';
import Price from './price';
import Box from './box';
import {Rate,RateItems} from './rate';
import { Icon } from '@mdi/react';
import { mdiChevronDown,mdiChevronLeft, mdiCircleSmall } from '@mdi/js';
import './product-page.css';

export default class ProductPage extends Component{
    constructor(props){
        super(props);
        let Variant = AIOVariant(props.product);
        this.state = {
            variantId:props.variantId?props.variantId:Variant.getFirst(),
            Variant,
            isExist:true
        }
    }
    changeVariantId(index,value){
        let {variantId,Variant} = this.state
        let selectedValues = variantId.split('_');
        selectedValues[index] = value;
        let newVariantId = selectedValues.join('_');
        let isExist = Variant.isExist(newVariantId)
        this.setState({variantId:newVariantId,isExist})
    }
    getImage(image) {
        return <img src={image} height='100%'/>
    }
    image_layout(image,name,rate){
        return {
            html:(
                <Box
                    layout={{
                        className: 'as-product-page-image',
                        column:[
                            {
                                align:'vh',
                                html: (
                                    <>
                                        {this.getImage(image)}
                                        {this.rate_layout(rate)}
                                    </>
                                )
                            },
                            this.name_layout(name)
                        ]
                    }}
                />
            )
        }
         
    }
    comments_layout(commentsLength){
        let {onShowComments} = this.props;
        if(isNaN(commentsLength) && typeof onShowComments !== 'function'){return false}
        return {
            html:(
                <Box
                    layout={{
                        className:'as-fs-m as-fc-m',
                        row:[
                            {
                                show:!isNaN(commentsLength),
                                flex:1,align:'v',
                                html:`${commentsLength} نظر ثبت شده`
                            },
                            {show:typeof onShowComments === 'function',html:'نمایش نظرات',className:'as-link'}
                        ]
                    }}
                />
            )
        }
    }
    rate_layout(rate) {
        if (rate === undefined) { return false }
        return <div className='as-product-page-rate-container'><Rate rate={rate} singleStar={true}/></div>
    }
    name_layout(name){return {className:'as-fs-l as-fc-d as-bold',html:name}}
    optionTypes_layout(optionTypes,variants){
        if(this.props.variantId){
            let {getIconByKey} = this.props;
            return {html:(<Box layout={{html:this.state.Variant.getList(this.props.variantId,getIconByKey)}}/>)}
        }
        if(!optionTypes.length){return false}
        let keys = Object.keys(variants);
        if(!keys.length){return false}
        let {Variant,variantId,isExist} = this.state;
        return {
            html:(
                <Box
                    layout={{
                        column:[
                            {gap:6,column:optionTypes.map((o,i)=>this.optionType_layout(o,i))},
                            {
                                html:(
                                    <AIOButton
                                        type='select'
                                        text={isExist?undefined:'نا موجود'}
                                        popupWidth='fit'
                                        className='as-product-page-variant-options-button'
                                        popupAttrs={{className:'as-product-page-variant-options-popup'}}
                                        options={Variant.options}
                                        optionText='option.textAndPriceLayout'
                                        value={variantId}
                                        onChange={(variantId)=>this.setState({variantId,isExist:Variant.isExist(variantId)})}
                                    />
                                )
                            }
                        ]
                    }}
                />
            )
        }
    }
    optionType_layout({text,value,nameDictionary},index){
        let {variantId,Variant} = this.state;
        let exist = Variant.existValues[index];
        let selectedValue = variantId.split('_')[index];
        return {
            className:'as-product-page-option-type',
            column:[
                this.label_layout(text),
                {size:6},
                {
                    className:'ofx-auto',
                    row:exist.map((v)=>this.optionButton_layout(nameDictionary[v],v,selectedValue === v,index))
                }
            ]
        }
    }
    optionButton_layout(text,value,active,index){
        return {
            html:(
                <button 
                    className={'as-product-page-option-type-button as-fs-m' + (active?' active':'')}
                    onClick={()=>this.changeVariantId(index,value)}
                >{text}</button>
            )
        }
    }
    label_layout(label,toggle){
        return {
            className:'as-box-label',
            onClick:toggle?()=>this.setState({[toggle]:!this.state[toggle]}):undefined,
            row:[
                {show:!!toggle,html:<Icon path={this.state[toggle]?mdiChevronDown:mdiChevronLeft} size={1}/>,size:30,align:'vh'},
                {html:label,align:'v'},
            ]
        }
    }
    review_layout(review){
        if(!review){return false}
        return {
            html:(
                <Box
                    title={'توضیحات'} content={review} toggle={true}
                />
            )
        }
    }
    details_layout(details){
        if(!details.length){return false}
        return {
            html:(
                <Box
                    title={'مشخصات'} showAll={true}
                    content={(showAll)=><Details details={details} showAll={showAll}/>}
                />
            )
        }
    }
    detail_layout([key,value,bold]){
        let isList = Array.isArray(value)
        return {
            className:'as-product-page-detail',
            row:[
                {html:key,className:'as-fs-s as-fc-m as-detail-key' + (bold?' bold-key':''),align:'v'},
                {show:!isList,html:value,className:'as-fs-m as-fc-d as-detail-value'},
                {show:!!isList,className:'as-fs-m as-fc-d as-detail-value',column:()=>value.map((v)=>{
                    return {
                        row:[
                            {html:<Icon path={mdiCircleSmall} size={.8}/>},
                            {html:v,flex:1}
                        ]
                    }
                })}
            ]
        }
    }
    rates_layout(rates){
        if(!rates.length){return false}
        return {
            html:<Box title='امتیاز کاربران' content={<RateItems rates={rates}/>}/>
        }
    }
    import_layout(row){
        let {importHtml = ()=>{}} = this.props;
        let obj = importHtml(row);
        if(!obj){return false}
        return {html:<Box {...obj}/>,className:'as-fs-m as-fc-m'}
    }
    footer_layout(product,price,discountPercent,inStock,min,max,renderCartCountButton){
        let {getCartCount,unit} = this.props;
        let {variantId,isExist} = this.state;
        let count = getCartCount({variantId});
        if(count && count < min){
            count = min
        }
        let maxText = '',minText = '';
        if(!!min){minText = `حداقل ${min} عدد`}
        if(count === max){maxText = `حداکثر ${max} عدد`}
        else if(count === inStock){maxText = `سقف موجودی`}
        return {
            className:'as-product-page-footer',
            row:[
                {
                    align:'v',
                    column:[
                        {align:'v',flex:1,html:minText,className:'as-product-page-min'},
                        {
                            className:'of-visible',align:'v',
                            html:renderCartCountButton({product,variantId,config:{changeCart:true}})
                        },
                        {align:'v',flex:1,html:maxText,className:'as-product-page-max'} 
                    ]
                },
                {flex:1},
                {show:!!isExist,html:<Price unit={unit} price={price} discountPercent={discountPercent} type='v' size='l'/>} 
            ]
        }        
    }
    collections_layout(collections,renderProductSlider){
        return {
            column:collections.map(({title,items,config = {}})=>{
                return {
                    html:(
                        <Box 
                            title={title}
                            content={()=>renderProductSlider({items,config})}
                        />
                    )
                }
            })
        }
    }
    render(){
        let {variantId,Variant} = this.state;
        let {product,collections = [],renderCartCountButton,renderProductSlider} = this.props;
        let {name,variants = {},optionTypes = [],commentsLength} = product;
        let {image,price,discountPercent,review,rate,rates,details,inStock = Infinity,min,max} = Variant.getVariant(variantId);
        return (
            <RVD
                layout={{
                    className:'as-product-page',
                    column:[
                        {
                            flex:1,className:'ofy-auto as-product-page-body',
                            column:[
                                this.image_layout(image,name,rate),
                                this.import_layout(0),
                                this.comments_layout(commentsLength),
                                this.import_layout(1),
                                this.optionTypes_layout(optionTypes,variants),
                                this.import_layout(2),
                                this.details_layout(details),
                                this.import_layout(3),
                                this.review_layout(review),
                                this.import_layout(4),
                                this.rates_layout(rates),
                                this.import_layout(5),
                                this.collections_layout(collections,renderProductSlider)
                            ]
                        },
                        this.footer_layout(product,price,discountPercent,inStock,min,max,renderCartCountButton)
                    ]
                }}
            />
        )
    }
}

class Details extends Component{
    lowDetails_layout(details,showAll){
        if(showAll){return false}
        let bolds = details.filter(([key,value,bold])=>bold);
        if(bolds.length < 3){
            for(let i = 0; i < details.length; i++){
                let [key,value,bold] = details[i];
                if(bold){continue}
                if(bolds.length >= 3){break;}
                bolds.push(details[i])
            }
        }
        return {
            className:'as-product-page-details',
            column:bolds.map((o)=>this.detail_layout(o))
        }
    }
    fullDetails_layout(details,showAll){
        if(!showAll){return false}
        return {
            className:'as-product-page-details',
            column:details.map((o)=>this.detail_layout(o))
        }
    }
    detail_layout([key,value,bold]){
        let isList = Array.isArray(value)
        return {
            className:'as-product-page-detail',
            row:[
                {html:key,className:'as-fs-s as-fc-m as-detail-key' + (bold?' bold-key':''),align:'v'},
                {show:!isList,html:value,className:'as-fs-m as-fc-d as-detail-value'},
                {show:!!isList,className:'as-fs-m as-fc-d as-detail-value',column:()=>value.map((v)=>{
                    return {
                        row:[
                            {html:<Icon path={mdiCircleSmall} size={.8}/>},
                            {html:v,flex:1}
                        ]
                    }
                })}
            ]
        }
    }
    render(){
        let {details,showAll} = this.props;
        return (
            <RVD
                layout={{
                    column:[
                        this.fullDetails_layout(details,showAll),
                        this.lowDetails_layout(details,showAll),
                    ]
                }}
            />
        )
    }
}