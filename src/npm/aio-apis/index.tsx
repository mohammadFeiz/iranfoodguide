import React from 'react';
import Axios from 'axios';
import AIOStorage from 'aio-storage';
import AIODate from 'aio-date';
import AIOPopup from 'aio-popup';
import $ from 'jquery';
import './index.css';
type I_AIOStorage = {
    save: (p: { name: string, value: any }) => void,
    load: (p: { name: string, def?: any,time?:number }) => any
}
type AIOApis_method = 'post' | 'get' | 'delete' | 'put';
type AIOApis_message = {error?:boolean | string,success?:((p:{result:any,appState:any,parameter:any})=>string|boolean) | string | boolean,time?:number}
type AIOApis_onCatch = (err: any, config: AIOApis_config) => string;
type AIOApis_getError = (response: any, confing: AIOApis_config) => string | false;
export type AIOApis_props = {
    id: string, getAppState?: () => any, baseUrl?: string, token?: string, loader?: () => React.ReactNode,
    onCatch?: AIOApis_onCatch, getError?: AIOApis_getError
}
export type AIOApis_config = {
    loading?: boolean, loadingParent?: string,token?:string,
    message?:AIOApis_message,
    onError?:(result:string)=>void,
    onSuccess?:(result:any)=>void,
    onCatch?: AIOApis_onCatch, 
    getError?: AIOApis_getError,
    errorResult?:any,
    description?:string,
    cache?: { name: string, time: number },
}
type AIOApis_getStorage = (name: string, def?: any) => any;
type AIOApis_setStorage = (key: string, value: any) => void;
type AIOApis_removeStorage = (key:string)=>void;
type AIOApis_setProperty = (property: string, value: any) => void;
type AIOApis_setToken = (token?: string) => void;
type AIOApis_handleLoading = (state: boolean, apiName: string, config:AIOApis_config) => void;
type AIOApis_messageParameter = {result:any,message:AIOApis_message,description:string}
type AIOApis_params = {id:string,body?:any,method:AIOApis_method,url:string,config?:AIOApis_config,getResult:(response:any)=>any,mock?:boolean,mockFunction?:Function,parameter?:any};
type AIOApis_request = (p:AIOApis_params)=>Promise<any>
export default class AIOApis {
    token: string;
    baseUrl:string;
    id: string;
    onCatch: AIOApis_onCatch;
    getError: AIOApis_getError;
    storage: I_AIOStorage;
    setProperty: AIOApis_setProperty;
    getAppState: () => any;
    setStorage: AIOApis_setStorage;
    getStorage: AIOApis_getStorage;
    removeStorage:AIOApis_removeStorage;
    setToken: AIOApis_setToken;
    getLoading: (id: string) => string;
    loader: () => React.ReactNode;
    handleLoading: AIOApis_handleLoading;
    responseToResult: (p:AIOApis_params) => Promise<any>;
    request:AIOApis_request;
    addAlert:(type:'success' | 'error',text:string,subtext?:string,time?:number)=>void;
    handleCacheVersions:(cacheVersions:{[key:string]:number})=>{[key:string]:boolean};
    setMockApi:(apiName:string)=>void;
    setApi:(apiName:string)=>void;
    showErrorMessage:(messageParameter:AIOApis_messageParameter)=>void;
    showSuccessMessage:(messageParameter:AIOApis_messageParameter)=>void;
    dateToString:(date:any,pattern?:string)=>string;
    dateToNumber:(date:any)=>number;
    dateToArray:(date:any,jalali?:boolean)=>number[];
    init = (p: AIOApis_props)=>{
        let { id, getAppState = () => { }, baseUrl, token, loader, onCatch, getError } = p
        this.baseUrl = baseUrl;
        this.loader = loader;
        this.token = token;
        this.onCatch = onCatch;
        this.getError = getError;
        this.id = id;
        let storage = AIOStorage(id);
        this.storage = storage;
        this.getAppState = getAppState;
        this.setProperty = (property, value) => this[property] = value;
        this.setStorage = (name: string, value: any) => storage.save({ name, value })
        this.getStorage = (name, def) => storage.load({ name, def });
        this.setToken = (token?: string) => { let res = token || this.token; if (res) { this.token = res; Axios.defaults.headers.common['Authorization'] = `Bearer ${res}`; } }
        this.addAlert = (type:'success' | 'error' | 'warning' | 'info',text:string,subtext?:string,time?:number)=>{
            new AIOPopup().addAlert({type,text,subtext,time})
        }
        this.dateToString = (date,pattern = '{year}/{month}/{day}')=>{
            return AIODate().getDateByPattern({date,pattern})
        }
        this.dateToNumber = (date)=>{
            return AIODate().getTime({date})
        }
        this.dateToArray = (date,jalali)=>{
            return AIODate().convertToArray({date,jalali})
        }
        this.getLoading = (id) => {
            console.log(`aio-service show loading by ${id}`)
            return (`
              <div class="aio-service-loading" id="aio-service-${id}">
                <div class="aio-service-loading-0">
                  <div class="aio-service-loading-1">
                    <div class="aio-service-loading-2" style="animation: 1s ease-in-out 0.0s infinite normal none running aioserviceloading;"></div>
                    <div class="aio-service-loading-2" style="animation: 1s ease-in-out 0.1s infinite normal none running aioserviceloading;"></div>
                    <div class="aio-service-loading-2" style="animation: 1s ease-in-out 0.2s infinite normal none running aioserviceloading;"></div>
                    <div class="aio-service-loading-2" style="animation: 1s ease-in-out 0.3s infinite normal none running aioserviceloading;"></div>
                    <div class="aio-service-loading-2" style="animation: 1s ease-in-out 0.4s infinite normal none running aioserviceloading;"></div>
                  </div>
                </div>
              </div>
            `)
        }
        this.handleLoading = (state, apiName, config) => {
            let {loading = true,loadingParent = 'body'} = config
            if (!loading) { return }
            if (state) { $(loadingParent).append(this.loader ? this.loader() : this.getLoading(apiName)); }
            else {
                let loadingDom = $('#aio-service-' + apiName);
                if (!loadingDom.length) { loadingDom = $('.aio-service-loading') }
                loadingDom.remove()
            }
        }
        this.handleCacheVersions = (cacheVersions:{[key:string]:number}) => {
            let def = {};
            for(let prop in cacheVersions){def[prop] = 0}
            let storedCacheVersions = this.getStorage('storedCacheVersions',def);
            let diffrences = {};
            for(let prop in cacheVersions){
              if(storedCacheVersions[prop] === undefined){continue}
              if (storedCacheVersions[prop] !== cacheVersions[prop]) {
                diffrences[prop] = true;
                this.removeStorage(prop)
              }
              else {diffrences[prop] = false;}
            }
            this.setStorage('storedCacheVersions',cacheVersions);
            return diffrences;
        }
        this.showErrorMessage = (messageParameter:AIOApis_messageParameter)=>{
            let {result,message,description} = messageParameter;
            if(message.error === false){return}
            let text:string;
            if(typeof message.error === 'string'){text = message.error}
            else {text = `${description} با خطا روبرو شد`}
            this.addAlert('error',text,result,message.time );
        }
        this.showSuccessMessage = (messageParameter:AIOApis_messageParameter)=>{
            let {result,message,description} = messageParameter;
            if (!message.success) {return}
            let subtext = typeof message.success === 'function' ? message.success(result) : message.success;
            if (subtext === true) { subtext = '' }
            this.addAlert('success',`${description} با موفقیت انجام شد`, subtext as string,message.time);
        }
        this.responseToResult = async (p) => {
            let {url,method,body,getResult,config = {}} = p;
            let {onCatch = this.onCatch,getError = this.getError} = config;
            try {
                let response = await Axios[method](url, body !== undefined ? body : undefined)
                if (response) {
                    let error = getError?getError(response,config):undefined;
                    if (typeof error === 'string') { return error }
                }
                return getResult(response);
            }
            catch (err) {
                let catchResult;
                try { catchResult = onCatch?onCatch(err,config):undefined }
                catch (err) { catchResult = err.message || err.Message; }
                if (!catchResult) { catchResult = err.message || err.Message }
                console.log(err);
                return catchResult
            }
        }
        let fn:AIOApis_request = async (p:AIOApis_params)=>{
            let {id,config = {},mock,mockFunction} = p;
            if(mock && mockFunction){
                let res = mockFunction(p);
                if(config.onSuccess){config.onSuccess(res)}
                return res;
            }
            let {onError,onSuccess,errorResult,cache,message = {},description = id,token} = config;
            if (cache) { let res = this.storage.load({name:cache.name,time:cache.time}); if (res !== undefined) { return res } }
            this.setToken(token);
            this.handleLoading(true, id, config);
            let result = await this.responseToResult(p)
            let messageParameter:AIOApis_messageParameter = {result,message,description}
            if (typeof result === 'string') {
                this.showErrorMessage(messageParameter);
                if(onError){onError(result)}
                result = errorResult
            }
            else {
                this.showSuccessMessage(messageParameter);
                if(result === undefined){result = errorResult}
                if(cache){this.storage.save({name:cache.name,value:result})}
                if(onSuccess){onSuccess(result);}
            }
            this.handleLoading(false, id, config);
            return result;
        }
        this.request = fn;
    }
    constructor(p: AIOApis_props) {this.init(p)}
}
