import React from 'react';
import RVD from '../react-virtual-dom/react-virtual-dom';
import Price from './price';
export default function AIOVariant(product) {
    let { variants = [], optionTypes = [] } = product;
    let $$ = {
        variantsDic:{},
        optionValueDic:{},
        options: [],
        getVariantById(id){return id === undefined?undefined:variants.find((o)=>o.id === id)},
        getVariantByKey(key){return key === undefined?undefined:variants.find((o)=>o.key === key)},
        getVariantKeyByVariantId(variantId){
            if(variantId === undefined){return}
            let variant = this.getVariantById(variantId);
            if(!variant){return}
            return variant.key;
        },
        getVariantKeyByValues(values){
            return values.join('_')
        },
        getOptionTypeById(id){
            return optionTypes.find((o)=>o.id === id)
        },
        getVariantIdByVariantKey(variantKey){
            if(variantKey === undefined){return}
            let variant = this.getVariantByKey(variantKey);
            if(!variant){return}
            return variant.id;
        },
        getOptionValueName({optionTypeId,optionValueId}){
            let {optionValues} = this.getOptionTypeById(optionTypeId);
            return optionValues.find((o)=>o.id === optionValueId).name;
        },
        getFirstVariant(variantId) {
            let { defaultVariant } = product;
            if (!variants.length) { return }
            if(variantId){
                let variant = this.getVariantById(variantId)
                if(variant){return variant}
            }
            if (defaultVariant) {
                let variant = this.getVariantById(defaultVariant)
                if (variant) {
                    let inStock = this.getInStock(variant.key);
                    if (inStock) { return variant }
                }
            }
            for (let i = 0; i < variants.length; i++) {
                let variant = variants[i]
                let inStock = this.getInStock(variant.key);
                if (inStock) { return variant }
            }
        },
        getInStock(variantKey) {
            if(!variantKey){
                let {inStock = Infinity} = product;
                return inStock;
            }
            let variant = this.getVariantByKey(variantKey);
            if(!variant){return false}
            let { inStock = Infinity } = variant;
            return inStock;
        },
        getOptionValueDic() {
            try{
                let res = {};
            for(let i = 0; i < optionTypes.length; i++){
                let {id,name} = optionTypes[i];
                let preventDuplicate = []
                res[id] = [];
                for(let j = 0; j < variants.length; j++){
                    let {key} = variants[j];
                    let keyList = key.split('_')
                    let optionValueId = keyList[i];
                    if(preventDuplicate.indexOf(optionValueId) === -1){
                        preventDuplicate.push(optionValueId);
                        res[id].push({
                            optionValueName:this.getOptionValueName({optionTypeId:id,optionValueId}),
                            optionTypeName:name,optionValueId,optionTypeId:id
                        })
                    }
                }
            }
            return res
            }
            catch{
                debugger;
                let res = {};
            for(let i = 0; i < optionTypes.length; i++){
                let {id,name} = optionTypes[i];
                let preventDuplicate = []
                res[id] = [];
                for(let j = 0; j < variants.length; j++){
                    let {value} = variants[j];
                    let optionValueId = value[id];
                    if(preventDuplicate.indexOf(optionValueId) === -1){
                        preventDuplicate.push(optionValueId);
                        res[id].push({
                            optionValueName:this.getOptionValueName({optionTypeId:id,optionValueId}),
                            optionTypeName:name,optionValueId,optionTypeId:id
                        })
                    }
                }
            }
            return res
            }
        },
        getProp(variantKey, prop, def) {
            let result;
            if (!variantKey) { result = product[prop] }
            else {
                let variant = this.getVariantByKey(variantKey);
                result = variant && variant[prop] !== undefined ? variant[prop] : product[prop]; 
            }
            if (result === undefined) { result = def }
            return result;
        },
        getDetails(variantKey) {
            if (!variantKey) { return product.details || [] }
            let variant = this.getVariantByKey(variantKey);
            if (!variant) { return false }
            let { details: variant_details = [] } = variant;
            let { details: product_details = [] } = product;
            if (!variant_details.length) { return product_details }
            if (!product_details.length) { return [] }
            let result_dic = {};
            let boldKeys = {};
            for (let i = 0; i < product_details.length; i++) {
                let [key, value] = product_details[i];
                result_dic[key] = value;
            }
            for (let i = 0; i < variant_details.length; i++) {
                let [key, value] = variant_details[i];
                if (result_dic[key]) { boldKeys[key] = true }
                result_dic[key] = value;
            }
            let result_list = [];
            for (let prop in result_dic) {
                if (boldKeys[prop]) {
                    result_list = [[prop, result_dic[prop], true], ...result_list]
                }
                else {
                    result_list.push([prop, result_dic[prop]])
                }

            }
            return result_list
        },
        getPriceLayout(variantKey) {
            let price = this.getProp(variantKey,'price');
            let discountPercent = this.getProp(variantKey,'discountPercent');
            return <Price price={price} discountPercent={discountPercent} type='h'/>
        },
        getTextAndPriceLayout(variantKey) {
            if (!variantKey) { return }
            return (
                <RVD
                    layout={{
                        column: [
                            { html: $$.variantsDic[variantKey].label, align: 'v', className: 'as-fs-s as-fc-l' },
                            { size: 3 },
                            { html: this.getPriceLayout(variantKey) }
                        ]
                    }}
                />
            )
        },
        getOptions() {
            let result = []
            for (let i = 0; i < variants.length; i++) {
                let variant = variants[i];
                let variantKey = variant.key;
                if (!this.getInStock(variantKey)) { continue }
                result.push({
                    value: variantKey,
                    variantLabel: $$.variantsDic[variantKey].label,
                    textAndPriceLayout: this.getTextAndPriceLayout(variantKey),
                    priceLayout: this.getPriceLayout(variantKey),
                    price: this.getProp(variantKey,'price')
                })
            }
            return result;
        },
        getVariantLabel({variantId,variantKey}){
            variantKey = variantKey || this.getVariantKeyByVariantId(variantId);
            let variantValues = variantKey.split('_');
            return optionTypes.map((optionType,i)=>{
                let {optionValues,name} = optionType;
                let variantValue = variantValues[i];
                let optionValue = optionValues.find((o)=>o.id === variantValue)
                let optionTypeName = name;
                let optionValueName = optionValue.name;
                return `${optionTypeName} : ${optionValueName}`;
            }).join(' - ')
        },
        getDiscountPercent(dp = 0){
            function validate(v = 0){v = +v; if(isNaN(v)){v = 0} return v};
            let list = !Array.isArray(dp)?[{value:dp}]:dp.map((o)=>{
                return typeof o === 'object'?o:{value:o}
            })
            let sum = 0;
            for(let i = 0; i < list.length; i++){
                sum += validate(list[i].value);
            }
            return sum;
        },
        getProperties(obj = {}) {
            let {variantKey,variantId} = obj;
            if(!variantKey && variantId !== undefined){variantKey = this.getVariantKeyByVariantId(variantId);}
            let type, id;
            if (variantKey) {
                let variant = this.getVariantByKey(variantKey);
                if (!variant) {type = 'product'; id = product.id;}
                else {type = 'variant'; id = variant.id;}
            }
            else {type = 'product'; id = product.id;}
            return {
                type, id,
                variantKey,variantId,
                productId:product.id,
                productName: product.name,
                image: this.getProp(variantKey,'image', ''),
                min: this.getProp(variantKey,'min', 0),
                max: this.getProp(variantKey,'max', Infinity),
                step: this.getProp(variantKey,'step', 1),
                price: this.getProp(variantKey,'price', 0),
                inStock: this.getProp(variantKey,'inStock', Infinity),
                discountPercent: this.getProp(variantKey,'discountPercent', 0),
                review: this.getProp(variantKey,'review'),
                description: this.getProp(variantKey,'description'),
                rate: this.getProp(variantKey,'rate'),
                rates: this.getProp(variantKey,'rates', []),
                details: this.getDetails(variantKey)
            }
        },
        isExist(obj) {
            let {variantKey,variantId} = obj;
            if(!variantKey && variantId !== undefined){variantKey = this.getVariantKeyByVariantId(variantId);}
            if(!variantKey){
                let {max = Infinity,inStock = Infinity} = product;
                return !!max && !!inStock;
            }
            if(!this.getVariantByKey(variantKey)){return false}
            let max = this.getProp(variantKey,'max', Infinity)
            let inStock = this.getProp(variantKey,'inStock', Infinity)
            return !!max && !!inStock;
        }
    }
    $$.variantsDic = {};
    for(let i = 0; i < variants.length; i++){
        let variant = variants[i];
        $$.variantsDic[variant.key] = {}
        $$.variantsDic[variant.key].label = $$.getVariantLabel({variantKey:variant.key});
        $$.variantsDic[variant.key].properties = $$.getProperties({variantKey:variant.key})
    }
    $$.options = $$.getOptions();
    $$.optionValueDic = $$.getOptionValueDic()
    return {
        variantsDic:$$.variantsDic,
        optionValueDic:$$.optionValueDic,
        getVariantKeyByValues:$$.getVariantKeyByValues.bind($$),
        getFirstVariant: $$.getFirstVariant.bind($$),
        options: $$.options,
        isExist: $$.isExist.bind($$),
        getProp: $$.getProp.bind($$),
        getDetails: $$.getDetails,
        getProperties: $$.getProperties.bind($$),
        getVariantById:$$.getVariantById.bind($$),
        getVariantByKey:$$.getVariantByKey.bind($$),
        getVariantKeyByVariantId:$$.getVariantKeyByVariantId.bind($$),
        getVariantIdByVariantKey:$$.getVariantIdByVariantKey.bind($$)
    }
}