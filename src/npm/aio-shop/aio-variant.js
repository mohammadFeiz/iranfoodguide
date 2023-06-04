import React from 'react';
import RVD from '../react-virtual-dom/react-virtual-dom';
import Price from './price';
export default function AIOVariant(product) {
    let { variants = {}, optionTypes = [] } = product;
    let $$ = {
        existValues: [],
        options: [],
        getFirst() {
            let { defaultVariant } = product;
            if (!this.variantIds.length) { return false }
            if (defaultVariant) {
                if (variants[defaultVariant]) {
                    let inStock = this.getInStock(defaultVariant);
                    if (inStock) { return defaultVariant }
                }
            }
            for (let i = 0; i < this.variantIds.length; i++) {
                let key = this.variantIds[i]
                let inStock = this.getInStock(key);
                if (inStock) { return key }
            }
            return false
        },
        getList(variantId,getIconByKey,inline){
            if(!variantId){return false}
            let values = variantId.split('_'); 
            let childs = optionTypes.map((ot,i)=>{
                let value = values[i];
                let {nameDictionary = {[value]:value},iconKey,text} = ot;
                let icon = typeof iconKey === 'object'?iconKey[value] : iconKey;
                icon = getIconByKey(icon) || '';
                return {
                    className:'as-variant-list-item',
                    gap:3,
                    row:[
                        {show:!!icon,html:icon,align:'vh'},
                        {html:text,align:'vh'},
                        {html:':',align:'vh'},
                        {html:nameDictionary[value],align:'vh'},
                        
                    ]
                }
            })
            return <RVD layout={{[inline?'row':'column']:childs,className:'as-variant-list'}}/>
        },
        getInStock(variantId) {
            if(!variantId){
                let {inStock = Infinity} = product;
                return inStock;
            }
            let variant = variants[variantId];
            if(!variant){return false}
            let { inStock = Infinity } = variant;
            return inStock;
        },
        getExistValues() {
            let result = optionTypes.map(() => [])
            for (let i = 0; i < this.variantIds.length; i++) {
                let values = this.variantIds[i].split('_');
                for (let j = 0; j < optionTypes.length; j++) {
                    if (result[j].indexOf(values[j]) === -1) {
                        result[j].push(values[j])
                    }
                }
            }
            return result;
        },
        getProp(variantId, prop, def) {
            let result;
            if (!variantId) { result = product[prop] }
            else {
                let variant = variants[variantId];
                result = variant && variant[prop] !== undefined ? variant[prop] : product[prop]; 
            }
            if (result === undefined) { result = def }
            return result;
        },
        getDetails(variantId) {
            if (!variantId) { return product.details || [] }
            let variant = variants[variantId];
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
        getPriceLayout(key) {
            let price = this.getProp('price', key);
            let discountPercent = this.getProp('discountPercent', key);
            return <Price price={price} discountPercent={discountPercent} type='h' size='s' />
        },
        getText(key) {
            if (!key) { return }
            let values = key.split('_');
            let str = '';
            for (let i = 0; i < optionTypes.length; i++) {
                let { nameDictionary = { [value]: value }, text } = optionTypes[i];
                let value = values[i];
                str += text;
                str += ' : ' + nameDictionary[value];
                if (i < optionTypes.length - 1) { str += ' - ' }
            }
            return str;
        },
        getTextLayout(key) {
            if (!key) { return }
            let values = key.split('_');
            return (
                <RVD
                    layout={{
                        gap: 6,
                        row: optionTypes.map((o, i) => {
                            let { nameDictionary = { [value]: value }, text } = o;
                            let value = values[i];
                            return {
                                gap: 3,
                                row: [
                                    { html: `${text} :`, align: 'v', className: 'as-fs-s as-fc-l' },
                                    { html: nameDictionary[value], align: 'v', className: 'as-fs-m as-fc-d as-bold' }
                                ]
                            }
                        })
                    }}
                />
            )
        },
        getTextAndPriceLayout(key) {
            if (!key) { return }
            return (
                <RVD
                    layout={{
                        column: [
                            { html: this.getTextLayout(key) },
                            { size: 3 },
                            { html: this.getPriceLayout(key) }
                        ]
                    }}
                />
            )
        },
        getOptions() {
            let result = []
            let variant_list = Object.keys(variants);
            for (let i = 0; i < variant_list.length; i++) {
                let key = variant_list[i];
                if (!this.getInStock(key)) { continue }
                result.push({
                    value: key,
                    text: this.getText(key),
                    textAndPriceLayout: this.getTextAndPriceLayout(key),
                    textLayout: this.getText(key),
                    priceLayout: this.getPriceLayout(key),
                    price: this.getProp('price', key)
                })
            }
            return result;
        },
        getVariant(variantId) {
            let { variants = {} } = product;
            let type, id;
            if (variantId) {
                if (!variants[variantId]) {type = 'product'; id = product.id;}
                else {type = 'variant'; id = variants[variantId].id;}
            }
            else {type = 'product'; id = product.id;}
            return {
                type, id, variantName:this.getText(variantId),
                variantId,
                productId:product.id,
                productName: product.name,
                image: this.getProp(variantId,'image', ''),
                min: this.getProp(variantId,'min', 0),
                max: this.getProp(variantId,'max', Infinity),
                step: this.getProp(variantId,'step', 1),
                price: this.getProp(variantId,'price', 0),
                inStock: this.getProp(variantId,'inStock', Infinity),
                discountPercent: this.getProp(variantId,'discountPercent', 0),
                review: this.getProp(variantId,'review'),
                description: this.getProp(variantId,'description'),
                rate: this.getProp(variantId,'rate'),
                rates: this.getProp(variantId,'rates', []),
                details: this.getDetails(variantId)
            }
        },
        getVariants() {
            let result = {};
            for (let i = 0; i < $$.variantIds.length; i++) {
                let variantId = $$.variantIds[i];
                result[variantId] = this.getVariant(variantId)
            }
            return result;
        },
        isExist(variantId) {
            if(!variantId){
                let {max = Infinity,inStock = Infinity} = product;
                return !!max && !!inStock;
            }
            if(!variants[variantId]){return false}
            let max = this.getProp(variantId,'max', Infinity)
            let inStock = this.getProp(variantId,'inStock', Infinity)
            return !!max && !!inStock;
        }
    }
    $$.variantIds = Object.keys(variants);
    $$.existValues = $$.getExistValues();
    $$.options = $$.getOptions();
    return {
        getFirst: $$.getFirst.bind($$),
        getList:$$.getList.bind($$),
        existValues: $$.existValues,
        options: $$.options,
        variantIds: $$.variantIds,
        isExist: $$.isExist.bind($$),
        getProp: $$.getProp.bind($$),
        getDetails: $$.getDetails,
        getVariant: $$.getVariant.bind($$),
        getVariants: $$.getVariants.bind($$),
    }
}