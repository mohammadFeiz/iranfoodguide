import React, { Component } from 'react';
import RVD from '../react-virtual-dom/react-virtual-dom';
import AIOInput from '../aio-input/aio-input';
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
        let {product,variantId} = props;
        let {variants = []} = product;
        let Variant = AIOVariant(product);
        if(variantId !== undefined){
            if(!Variant.getVariantById(variantId)){
                this.state = {error:'محصول مورد نظر یافت نشد'}
                return;
            }
        }
        let variantKey;
        let variantMode = !!variants.length;
        if(variantMode){
            let firstVariant = Variant.getFirstVariant(variantId)
            variantKey = firstVariant?firstVariant.key:undefined;
        }
        
        this.state = {
            variantKey,
            variantMode,
            Variant,
            isExist:Variant.isExist({variantKey})
        }
    }
    changeVariantKey(optionTypeIndex,optionValueId){
        let {variantKey,Variant} = this.state
        let optionValueIds = variantKey.split('_');
        optionValueIds[optionTypeIndex] = optionValueId;
        let newVariantKey = optionValueIds.join('_');
        let isExist = Variant.isExist({variantKey:newVariantKey})
        this.setState({variantKey:newVariantKey,isExist})
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
    variant_layout(optionTypes,variants){
        let {Variant,variantKey,isExist} = this.state;
        if(!optionTypes.length){return false}
        if(!variants.length){return false}
        if(!variantKey){return false}
        let {variantId} = this.props;
        if(variantId !== undefined){
            let variantKey = Variant.getVariantKeyByVariantId(variantId);
            let detail = Variant.variantsDic[variantKey];
            let label = detail.label
            return {html:(<Box layout={{html:label}}/>)}
        }
        return {
            html:(
                <Box
                    layout={{
                        column:[
                            {gap:6,column:optionTypes.map((o,i)=>this.optionValues_layout(o,i))},
                            {
                                html:(
                                    <AIOInput
                                        type='select'
                                        text={isExist?undefined:'نا موجود'}
                                        popupWidth='fit'
                                        className='as-product-page-variant-options-button'
                                        popoverAttrs={{className:'as-product-page-variant-options-popup'}}
                                        options={Variant.options}
                                        optionText='option.textAndPriceLayout'
                                        value={variantKey}
                                        onChange={(variantKey)=>this.setState({variantKey,isExist:Variant.isExist({variantKey})})}
                                    />
                                )
                            }
                        ]
                    }}
                />
            )
        }
    }
    optionValues_layout({name,id},index){
        let {variantKey,Variant} = this.state;
        let optionValues = Variant.optionValueDic[id];
        let selectedOptionValueId = variantKey.split('_')[index];
        return {
            className:'as-product-page-option-type',
            column:[
                this.label_layout(name),
                {size:6},
                {
                    className:'ofx-auto',
                    row:optionValues.map((o)=>{
                        let active = selectedOptionValueId === o.optionValueId;
                        return this.optionButton_layout(o,active,index)
                    })
                }
            ]
        }
    }
    optionButton_layout(o,active,index){
        let {optionValueName,optionValueId} = o;
        return {
            html:(
                <button 
                    className={'as-product-page-option-type-button as-fs-m' + (active?' active':'')}
                    onClick={()=>this.changeVariantKey(index,optionValueId)}
                >{optionValueName}</button>
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
        let {variantKey,isExist,Variant} = this.state;
        if(!isExist){return {html:'ناموجود',className:'as-product-page-footer as-not-exist',align:'v'}}
        let {getCartCount,unit} = this.props;
        let variantId = Variant.getVariantIdByVariantKey(variantKey)
        let count = getCartCount({variantId,productId:product.id});
        if(count && count < min){
            count = min
        }
        let maxText = '',minText = '';
        if(max && inStock){
            if(!!min){minText = `حداقل ${min} عدد`}
            if(max && inStock){
                if(count === max){maxText = `حداکثر ${max} عدد`}
                else if(count === inStock){maxText = `سقف موجودی`}
            }
        }
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
                {html:<Price unit={unit} price={price} discountPercent={discountPercent} type='v' size='l'/>} 
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
        let {variantKey,Variant,error} = this.state;
        if(error){return (<RVD layout={{className:'as-product-page',html:error,align:'vh'}}/>)}
        let {product,collections = [],renderCartCountButton,renderProductSlider} = this.props;
        let {name,variants = [],optionTypes = [],commentsLength} = product;
        let {image,price,discountPercent,review,rate,rates,details,inStock = Infinity,min,max} = Variant.getProperties({variantKey});
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
                                this.variant_layout(optionTypes,variants),
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