import Axios from "axios";
import { I_address, I_address_server, I_profile, I_takhfif } from "../typs";
import AIOStorage from 'aio-storage';
import $ from 'jquery';
export default function profileApis({ baseUrl, Axios }) {
    return {
        setProfile: async (profile, { Login }) => {
            let { isRegistered } = Login.getUserInfo()
            let mobile = Login.getUserId();
            let url = `${baseUrl}/People/${isRegistered ? 'UpdateProfile' : 'CreateProfile'}`
            let body = {
                "Id": profile.id,
                "firstName": profile.firstName,//نام
                "lastName": profile.lastName,
                "email": profile.email,
                "sheba": profile.sheba,
                "mobileNumbers": [{ "mobileNumber": mobile, "isDefault": true }]
            }
            let response = await Axios.post(url, body);
            let result = true;
            return { response, result }
        },
        removeAccount: async (parameter, { Login }) => {
            baseUrl = baseUrl.replace('/api', '');
            let url = `${baseUrl}/Users/DeleteUserProfileAsync`
            let mobile = Login.getUserId();
            let body = { "mobileNumber": mobile, }
            let response = await Axios.post(url, body);
            return { response }
        },
        setPassword: async (password, { Login }) => {
            let mobile = Login.getUserId();
            baseUrl = baseUrl.replace('/api', '');
            let url = `${baseUrl}/Users/ChangePasswordByAdmin`
            let body = { "MobileNumber": mobile, "NewPassword": password }
            let response = await Axios.post(url, body);
            return { response }
        },
        getProfile: async (parameter, { Login }) => {
            let url = `${baseUrl}/People/search`
            let { id } = Login.getUserInfo();
            let body = { "Id": id }
            let response = await Axios.post(url, body);
            let result = response.data.data.items[0]
            return { response, result }
        },
        getAddresses: async (parameter, { Login }) => {//لیست آدرس ها
            let url = `${baseUrl}/People/GetPeopleAddress`
            let { id } = Login.getUserInfo();
            let body = { "PersonId": id }
            let response = await Axios.post(url, body);
            let addresses = response.data.data;
            if (!Array.isArray(addresses)) { return { response, result: 'آدرس های دریافتی نا معتبر است' } }
            let result = addresses.map((o: I_address_server) => {
                let address: I_address = {
                    title: o.title,
                    address: o.address,
                    latitude: o.latitude,
                    longitude: o.longitude,
                    number: '30',
                    unit: '4',
                    floor: '2',
                    id: o.id,
                    description: o.description,
                    phone: o.phoneNumber
                }
                return address
            });
            return { response, result }
        },
        takhfif_ha: async (parameter, { Login }) => {
            return getMockApis.takhfif_ha()
            let url = `${baseUrl}/PersonDiscount/Search`;
            let { id } = Login.getUserInfo();
            let body = { "PersonId": id }
            let response = await Axios.post(url, body);
            let result = response.data.data.items;
            return { response, result };
        },
        addressForm: async ({ address, type }, { Login }) => {
            if (type === 'add') {
                let url = `${baseUrl}/People/CreatePeopleAddress`;
                let { id } = Login.getUserInfo();
                let body = {
                    "personId": id,
                    "address": {
                        "fullAddress": address.address,
                        "latitude": address.latitude,
                        "longitude": address.longitude,
                        "phoneNumber": address.phone
                    },
                    "title": address.title
                }
                let response = await Axios.post(url, body);
                return { response }
            }
            else {

            }
        },
        getWalletAmount: async () => {
            return getMockApis.getWalletAmount()
        },


    }
}
type I_getMockApis = {
    getProfile: () => { result: I_profile },
    getAddresses: () => { result: I_address[] },
    takhfif_ha: () => { result: I_takhfif[] },
    getWalletAmount: () => { result: number }
}
const getMockApis: I_getMockApis = {
    getProfile: () => {
        let result = {
            id: 12,
            firstName: 'احمد',//نام
            lastName: 'بهرامی',//نام خانوادگی
            mobile: '09123534314',//شماره همراه
            email: 'feiz.ms@gmail.com',//آدرس ایمیل
            sheba: '1234567',//شماره شبا
        }
        return { result }
    },
    getAddresses: () => {
        let result = [//لیست آدرس ها
            {
                title: 'خانه',
                address: 'تهران شیخ بهایی شمالی نوربخش',
                number: '30',
                unit: '4',
                floor: '2',
                id: '0',
                description: '',
                phone: '02188050006',
                latitude: 35.760528,
                longitude: 51.394777
            }
        ]
        return { result }
    },
    takhfif_ha: () => {
        let result = [
            {
                amounts: [{ percent: 10, amount: 100000 }], description: 'تخفیف خرید شیرینی',
                code: '31234545332343', endDate: '1401/12/21/13/0', order: 0
            },
            {
                amounts: [{ percent: 10 }, { percent: 15 }, { percent: 20 }], description: 'تخفیف خرید شیرینی',
                code: '31234545332343', endDate: '1401/12/21/13/0', order: 2
            },
            {
                amounts: [{ percent: 10, amount: 200000 }, { percent: 20, amount: 200000 }], description: 'تخفیف خرید شیرینی',
                code: '31234545332343', endDate: '1401/12/21/13/0', order: 0
            },
            {
                amounts: [{ amount: 50000 }], description: 'تخفیف خرید شیرینی',
                code: '31234545332343', endDate: '1401/12/21/13/0', order: 0
            },
        ]
        return { result }
    },
    getWalletAmount() {
        return { result: 123245666 }
    }
}


type I_AIOStorage = {
    save: (p: { name: string, value: any }) => void,
    load: (p: { name: string, def?: any,time?:number }) => any
}
type I_AIOService_api = {
    url: (p: { baseUrl: string, parameter: any, appState: any }) => string,
    method: 'post' | 'get' | 'delete' | 'put',
    mock?: boolean,
    getBody?: (p: { parameter: any, appState: any }) => any,
    getMockResult?: (p: { setStorage: (key: string, value: any) => void, getStorage: (key: string) => any, parameter: any, appState: any }) => any,
    getResult: (p: { parameter: any, appState: any, response: any }) => any,
    config?: I_AIOService_config
}
type I_AIOService_onCatch = (err: any, config: I_AIOService_config) => string;
type I_AIOService_getError = (response: any) => string | false;
type I_AIOService_props = {
    id: string, apis: { [name: string]: I_AIOService_api }, getAppState: () => any, baseUrl: string, token?: string, loader?: () => React.ReactNode,
    onCatch?: I_AIOService_onCatch, getError?: I_AIOService_getError
}
type I_AIOService_config = {
    loading?: boolean, loadingParent?: string,
    message?:{error?:false | string,success?:((result:any)=>string|boolean) | string | boolean,time?:number},
    onError?:(result:string)=>void,
    onSuccess?:(result:any)=>void,
    onCatch?: I_AIOService_onCatch, 
    getError?: I_AIOService_getError,
    def?:any,
    description?:((parameter:any)=>string) | string,
    cache?: { name: string, time: number },
}
class AIOService {
    token: string;
    id: string;
    onCatch: (err: any, config: I_AIOService_config) => string;
    getError: (response: any, confing: I_AIOService_config) => string | false;
    storage: I_AIOStorage;
    setProperty: (property: string, value: any) => void;
    getAppState: () => any;
    setStorage: (key: string, value: any) => void;
    getStorage: (name: string, def?: any) => any;
    setToken: (token?: string) => void;
    getLoading: (id: string) => string;
    loader: () => React.ReactNode;
    handleLoading: (state: boolean, apiName: string, config:I_AIOService_config) => void;
    getConfig: (p: { key: string, def?: any, config: I_AIOService_config }) => any;
    getResult: (api:I_AIOService_api,parameter: any,parameterConfig:I_AIOService_config) => any;
    showAlert:(type:'success' | 'error',text:string,subtext?:string,time?:number)=>void;
    constructor(p: I_AIOService_props) {
        let { id, apis, getAppState = () => { }, baseUrl, token, loader, onCatch, getError } = p
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
        this.getConfig = (p: { key: string, def?: any, config: I_AIOService_config }) => {
            let { key, def, config } = p;
            let result = config[key];
            return result === undefined?def:result
        }
        this.getResult = async (api,parameter,config) => {
            let {getResult,method,url,getBody} = api;
            let appState = this.getAppState();
            let Url = url({ baseUrl, appState, parameter });
            let onCatch = this.getConfig({ key: 'onCatch',def:()=>{}, config })
            let getError = this.getConfig({ key: 'getError',def:()=>{}, config }) 
            try {
                let response = await Axios[method](Url, getBody ? getBody({ parameter, appState }) : undefined)
                if (response) {
                    let error = getError(response);
                    if (typeof error === 'string') { return error }
                }
                return getResult({ parameter, appState, response });
            }
            catch (err) {
                let catchResult;
                try { catchResult = onCatch(err) }
                catch (err) { catchResult = err.message || err.Message; }
                if (!catchResult) { catchResult = err.message || err.Message }
                console.log(err);
                return catchResult
            }
        }
        this.showAlert = (type:'success' | 'error',text:string,subtext?:string,time?:number)=>{
            alert(`
                ${text}
                ${subtext?subtext:''}
            `)
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
            let loading = this.getConfig({ key: 'loading', def: true, config })
            if (!loading) { return }
            let loadingParent = this.getConfig({ key: 'loadingParent', def: 'body', config })        
            if (state) { $(loadingParent).append(this.loader ? this.loader() : this.getLoading(apiName)); }
            else {
                let loadingDom = $('#aio-service-' + apiName);
                if (!loadingDom.length) { loadingDom = $('.aio-service-loading') }
                loadingDom.remove()
            }
        }
        for (let prop in apis) {
            let api = apis[prop];
            let { mock, getMockResult } = api;
            if (mock) {
                if (typeof getMockResult !== 'function') { alert('AIOService error : missing getMockResult function in mock mode(mock:true)'); continue }
                this[prop] = (parameter?: any) => {
                    let appState:any = this.getAppState();
                    let result = getMockResult({ appState, parameter, getStorage: this.getStorage.bind(this), setStorage: this.setStorage.bind(this) })
                    return { result };
                }
            }
            else {
                this[prop] = async (parameter: any, config?: I_AIOService_config) => {
                    let {message = {},onError,onSuccess,def,description = prop,cache} = config;
                    if (cache) { let res = this.storage.load({name:cache.name,time:cache.time}); if (res !== undefined) { return res } }
                    description = typeof description === 'function'?description(parameter):description;
                    this.setToken();
                    this.handleLoading(true, prop, config);
                    let result = this.getResult(api,parameter,config)
                    if (typeof result === 'string' && message.error !== false) {
                        let text = message.error || `${description} با خطا روبرو شد`;
                        this.showAlert('error',text,result,message.time );
                        if(onError){onError(result)}
                        result = def
                    }
                    else {
                        if (message.success) {
                            let subtext = typeof message.success === 'function' ? message.success(result) : message.success;
                            if (subtext === true) { subtext = '' }
                            this.showAlert('success',`${description} با موفقیت انجام شد`, subtext as string,message.time);
                        }
                        if(result === undefined){result = def}
                        if(cache){this.storage.save({name:cache.name,value:result})}
                        if(onSuccess){onSuccess(result);}
                    }
                    this.handleLoading(false, prop, config);
                    return result;
                }
            }
        }
    }
}
let apis = new AIOService({
    id: 'ifg',
    getAppState: () => { },
    baseUrl: 'ifg',
    apis: {
        profile_set: {
            mock: true,
            url: ({ baseUrl, parameter, appState }) => `${baseUrl}/People/${!parameter.Login.getUserInfo().isregistered ? 'CreateProfile' : 'UpdateProfile'}`,
            method: 'post', 
            getBody: ({ parameter, appState }) => {
                let profile = parameter;
                return {
                    "Id": profile.id,
                    "firstName": profile.firstName,
                    "lastName": profile.lastName,
                    "email": profile.email,
                    "sheba": profile.sheba,
                    "mobileNumbers": [{ "mobileNumber": profile.mobile, "isDefault": true }]
                }
            },
            getMockResult: ({ setStorage, getStorage, parameter, appState }) => {setStorage('profile', parameter); return true},
            getResult: ({ parameter, appState, response }) => true,
        },
        profile_get:{
            mock:true,
            url:({baseUrl})=>`${baseUrl}/People/search`,method:'post',
            getBody:({appState})=>{return {Id:appState.Login.getUserInfo().id}},
            getResult:({response})=>response.data.data.items[0],
            getMockResult:({getStorage})=>getStorage('profile')
        },
        profile_removeAccount:{
            mock:true,
            url:({baseUrl})=>baseUrl.replace('/api', ''),
            method:'post',
            getBody:({appState})=>{return { "mobileNumber": appState.Login.getUserId() }}
        }
    }
})
// removeAccount: async (parameter, { Login }) => {
//     baseUrl = baseUrl.replace('/api', '');
//     let url = `${baseUrl}/Users/DeleteUserProfileAsync`
//     let mobile = Login.getUserId();
//     let body = { "mobileNumber": mobile }
//     let response = await Axios.post(url, body);
//     return { response }
// },
