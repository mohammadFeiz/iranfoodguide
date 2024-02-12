import AIOApis, { AIOApis_config } from '../npm/aio-apis/index.tsx';
import { I_profile, I_discount, I_address, I_address_server, I_tag_type, I_tag, I_restoran_sort_option, I_restoran, I_restoran_server, I_food } from '../typs.tsx';
type I_profile_set = (profile:I_profile,config:AIOApis_config)=>Promise<boolean>
type I_profile_get = (parameter,config:AIOApis_config)=>Promise<I_profile>

type I_peygiriye_sefaresh_param = any;
type I_peygiriye_sefaresh_result = { statusId: number, totalPrice: number, id: any };
type I_peygiriye_sefaresh = (orderId:I_peygiriye_sefaresh_param,config:AIOApis_config)=>Promise<I_peygiriye_sefaresh_result>

type I_getWalletAmount_param = null;
export type I_getWalletAmount_result = number;
type I_getWalletAmount = (parameter:I_getWalletAmount_param,config:AIOApis_config)=>Promise<I_getWalletAmount_result>;
type I_profile_getDiscounts = (p:any,config:AIOApis_config)=>Promise<I_discount[]>
type I_profile_getAddresses = (p:any,config:AIOApis_config)=>Promise<I_address[]>
type I_backOffice_getTags = (p:{type:I_tag_type},config:AIOApis_config)=>Promise<I_tag[]>
type I_getRestoranSortOptions = (p:any,config:AIOApis_config)=>Promise<I_restoran_sort_option[]>
type backOffice_addOrEditTag_result = {id:any} | false
type backOffice_addOrEditTag_param = {tagId?:any,type:'restoran' | 'food',tagName:string}
type I_backOffice_addOrEditTag = (p:backOffice_addOrEditTag_param,config:AIOApis_config)=>Promise<backOffice_addOrEditTag_result>
type I_backOffice_removeTag = (p:{type:'restoran' | 'food',tagId:any},config:AIOApis_config)=>Promise<void>
type I_backOffice_getRestorans_param = { pageSize?:number, pageNumber?:number, selectedTags?:number[], searchValue?:string,selectedSort?:false|string }
type I_backOffice_getRestorans = (p:I_backOffice_getRestorans_param,config:AIOApis_config)=>Promise<I_restoran[]>
type I_backOffice_removeRestoran = (restoranId:any,config:AIOApis_config)=>Promise<boolean>
export type I_addOrEditImage_param = {imageFile:any,imageId:any};
export type I_addOrEditImage_result = {id:any,url:string};
type I_addOrEditImage = (p:I_addOrEditImage_param,config:AIOApis_config)=>Promise<I_addOrEditImage_result>
export type I_backOffice_addOrEditRestoran_param = {type:'add' | 'edit',newRestoran:I_restoran}
export type I_backOffice_addOrEditRestoran_result = {id:any};
type I_backOffice_addOrEditRestoran = (p:I_backOffice_addOrEditRestoran_param,config:AIOApis_config)=>Promise<I_backOffice_addOrEditRestoran_result | false>
type I_backOffice_getRestoranFoods = (restoranId:any,config:AIOApis_config)=>Promise<I_food[]>
export type I_APIClass = {
    profile_set:I_profile_set,
    profile_get:I_profile_get,
    peygiriye_sefaresh:I_peygiriye_sefaresh,
    getWalletAmount:I_getWalletAmount,
    profile_getDiscounts:I_profile_getDiscounts,
    profile_getAddresses:I_profile_getAddresses,
    backOffice_getTags:I_backOffice_getTags,
    getRestoranSortOptions:I_getRestoranSortOptions,
    backOffice_addOrEditTag:I_backOffice_addOrEditTag,
    backOffice_removeTag:I_backOffice_removeTag,
    backOffice_getRestorans:I_backOffice_getRestorans,
    backOffice_removeRestoran:I_backOffice_removeRestoran,
    addOrEditImage:I_addOrEditImage,
    backOffice_addOrEditRestoran:I_backOffice_addOrEditRestoran,
    backOffice_getRestoranFoods:I_backOffice_getRestoranFoods
}
export default class APISClass extends AIOApis{
    mock:boolean = false;
    backOffice_getRestoranFoods:I_backOffice_getRestoranFoods = async (restoranId,config)=>{
        if(this.mock){
            let result:I_food[] = this.backOffice_getRestoranFoods_mock(restoranId)
            config.onSuccess(result);
            return result;
        }
        return await this.getResult({
            config:{
                description:'دریافت منوی رستوران',
                ...config
            },
            id:'BOGerRestoranFoods',method:'post',
            url:`${this.baseUrl}/RestaurantFood/Search`,
            body:{ "RestaurantId": restoranId },
            getResult:(response)=>{
                let result:I_food[] = response.data.data.items
                return result;
            }
        })
    }
    backOffice_getRestoranFoods_mock = (restoranId)=>{
        let foods:I_food[] = this.getStorage(`restoranFoods_${restoranId}`,[]);
        return foods
    }
    backOffice_addOrEditRestoran:I_backOffice_addOrEditRestoran = async (p,config)=>{
        let {type,newRestoran:nr} = p;
        if(this.mock){
            let result:I_backOffice_addOrEditRestoran_result = this.backOffice_addOrEditRestoran_mock(p);
            config.onSuccess(result);
            return result;
        }
        return await this.getResult({
            config:{
                errorResult:false,
                description:`${type === 'add'?'افزودن':'ویرایش'} رستوران`,
                ...config
            },
            id:'BOAddOrEditRestoran',method:'post',
            url:`${this.baseUrl}/Restaurant/${type === 'add'?'Create':'Edit'}`,
            body:{
                "id": type === 'edit' ? nr.id : undefined,
                "Id": type === 'edit' ? nr.id : undefined,
                "Title": nr.name,
                "LatinTitle": nr.name,
                "Tax": nr.tax,
                "DeliveryTime": nr.deliveryTime,
                "address": {
                    "fullAddress": nr.address,
                    "latitude": nr.latitude,
                    "longitude": nr.longitude,
                    "phoneNumber": nr.phone
                },
                "phoneNumbers": [{"Title": nr.name,"phoneNumber": nr.phone}],
                "workingTimes": [
                    {
                        "startTime": nr.startTime,// "12:00",
                        "endTime": nr.endTime,
                        "applyChangeTime": "12:00"
                    }
                ],
                "types": nr.tags.map((o) => { return { typeId: o } })
            },
            getResult:(response)=>{
                let result:I_backOffice_addOrEditRestoran_result;
                if(type === 'add'){result = response.data.data}
                else {result = {id:nr.id}}
                return result
            }
        })
    }
    backOffice_addOrEditRestoran_mock = (p)=>{
        let { newRestoran, type } = p;
        let restorans = this.getStorage('restorans', []);
        let newRestorans:I_restoran[];
        let id:any;
        if (type === 'add') {
            id = Math.round(Math.random() * 1000000);
            newRestoran = { ...newRestoran, id }
            newRestorans = [newRestoran, ...restorans];
        }
        else if (type === 'edit') {
            newRestorans = restorans.map((o) => {
                if (o.id === newRestoran.id) { return newRestoran }
                return o
            })
            id = newRestoran.id;
        }
        this.setStorage('restorans',newRestorans)
        let result:I_backOffice_addOrEditRestoran_result = {id};
        return result;
    }
    addOrEditImage = async (p,config)=>{
        let {imageFile,imageId} = p;
        // if(this.mock){
        //     let result:I_addOrEditImage_result = this.addOrEditImage_mock(p);
        //     config.onSuccess(result);
        //     return result
        // }
        let formData = new FormData()
        formData.append('imageFile', imageFile, imageFile.name)
        formData.append('title', imageFile.name)
        formData.append('imageId', imageId)   
        return await this.getResult({
            config:{
                errorResult:false,
                description:'ثبت تصویر',
                ...config
            },
            id:'addOrEditImage',method:'post',body:formData,
            url:`${this.baseUrl}/Image/UploadImage`,
            getResult:(response)=>{
                let {id,url}:I_addOrEditImage_result = response.data.data;
                return {id,url}
            }
        })
    }
    addOrEditImage_mock = (p)=>{

    }
    backOffice_removeRestoran:I_backOffice_removeRestoran = async (restoranId,config)=>{
        if(this.mock){
            let result = this.backOffice_removeRestoran_mock(restoranId);
            config.onSuccess(result);
            return result
        }
        return await this.getResult({
            config:{
                description:'حذف رستوران',errorResult:false,
                ...config
            },
            id:'BORemoveRestoran',method:'delete',
            url:`${this.baseUrl}/Restaurant?Id=${restoranId.toString()}`,
            getResult:(response)=>true
        })
    }
    backOffice_removeRestoran_mock = (restoranId)=>{
        let restorans:I_restoran[] = this.getStorage('restorans', []);
        let newRestorans:I_restoran[] = restorans.filter((o:I_restoran) => o.id !== restoranId)
        this.setStorage('restorans',newRestorans)
        return true
    }
    backOffice_getRestorans:I_backOffice_getRestorans = async (p,config)=>{
        let { pageSize = 1000, pageNumber = 1, selectedTags = [], searchValue,selectedSort } = p;
            
        if(this.mock){
            let result = this.backOffice_getRestorans_mock(p);
            config.onSuccess(result);
            return result
        }
        let {restoranToClient} = this.getAppState();
        return await this.getResult({
            config:{
                description:'دریافت لیست رستوران ها',errorResult:[],
                ...config
            },
            id:'BOGetRestorans',method:'post',url:`${this.baseUrl}/Restaurant/Search`,
            body:{
                RecordsPerPage: pageSize,// تعداد ریزالت در هر صفحه
                pageNumber: pageNumber,// شماره صفحه
                TypesId: selectedTags,// array id tags
                Title: searchValue
                //selected_tags لیستی از آی دی تگ های انتخاب شده برای سرچ توسط کاربر
                //searchValue متن سرچ شده توسط کاربر
            },
            getResult:(response)=>{
                let data = response.data.data.items
                let result:I_restoran[] = data.map((o:I_restoran_server)=>{
                    let res:I_restoran = restoranToClient(o);
                    return res;
                });
                return result;
            }
        })
    }
    backOffice_getRestorans_mock = (p)=>{
        return this.getStorage('restorans',[])
    }
    profile_set:I_profile_set = async (profile,config)=> {
        if(this.mock){return this.profile_set_mock(profile)}
        let {Login} = this.getAppState();
        let mobile = Login.getUserId();
        return await this.getResult({
            config:{description:'ثبت اطلاعات شخصی',message:{success:true},...config},
            id:'profile-set',method:'post',
            url:`${this.baseUrl}/People/${!Login.getUserInfo().isregistered ? 'CreateProfile' : 'UpdateProfile'}`,
            body:{
                "Id": profile.id,
                "firstName": profile.firstName,
                "lastName": profile.lastName,
                "email": profile.email,
                "sheba": profile.sheba,
                "mobileNumbers": [{ "mobileNumber": mobile, "isDefault": true }]
            },
            getResult:()=>true,
        })
    }
    profile_get:I_profile_get = async (parameter,config)=>{
        if(this.mock){return this.profile_get_mock()}
        let {Login} = this.getAppState();
        return await this.getResult({
            config:{description:'دریافت اطلاعات شخصی',...config},
            id:'profile-get',method:'post',
            url:`${this.baseUrl}/People/search`,
            body:{Id:Login.getUserInfo().id},
            getResult:(response)=>{
                let {id,firstName,lastName,sheba,email} = response.data.data.items[0]
                let profile:I_profile = {id,firstName,lastName,sheba,email}
                return profile
            },
        })
    }
    peygiriye_sefaresh:I_peygiriye_sefaresh = async (orderId,config)=>{
        if(this.mock || true){
            let result:I_peygiriye_sefaresh_result = this.peygiriye_sefaresh_mock()
            config.onSuccess(result)
            return result
        }
        return await this.getResult({
            config:{
                description:'پیگیری سفارش',
                ...config
            },
            id:'peygiriyeSefaresh',method:'post',url:`${this.baseUrl}/Order/InquiryOrder`,
            body:{"OrderId": orderId},
            getResult:(response)=>{
                let result:I_peygiriye_sefaresh_result = response.data.data.items[0];
                return result
            }

        })
    }
    getWalletAmount:I_getWalletAmount = async (parameter,config)=>{
        if(this.mock || true){
            let result:I_getWalletAmount_result = this.getWalletAmount_mock()
            config.onSuccess(result)
            return result;
        }
    }
    profile_getDiscounts:I_profile_getDiscounts = async (parameter,config)=>{
        if(this.mock || true){
            let result:I_discount[] = this.profile_getDiscounts_mock()
            config.onSuccess(result)
            return result;
        }
        let {Login} = this.getAppState();
        let { id } = Login.getUserInfo();
        return await this.getResult({
            config:{description:'دریافت لیست تخفیف ها',...config},
            id:'profileGetDiscounts',method:'post',url:`${this.baseUrl}/PersonDiscount/Search`,
            body:{ "PersonId": id },
            getResult:(response)=>{
                let result:I_discount[] = response.data.data.items;
                return result
            }
        })
    }
    profile_getAddresses:I_profile_getAddresses = async (parameter,config)=>{
        if(this.mock){
            let result:I_address[] = this.profile_getAddresses_mock()
            config.onSuccess(result)
            return result;
        }
        let {Login} = this.getAppState(),{ id } = Login.getUserInfo();
        return await this.getResult({
            config:{errorResult:[],description:'دریافت لیست آدرس ها',...config},
            id:'profileGetAddresses',method:'post',url:`${this.baseUrl}/People/GetPeopleAddress`,
            body:{ "PersonId": id },
            getResult:(response)=>{
                let addresses:I_address_server[] = response.data.data;
                if (!Array.isArray(addresses)) { return 'آدرس های دریافتی نا معتبر است'}
                let result:I_address[] = addresses.map((o: I_address_server) => {
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
                return result
            }
        })
    }
    backOffice_getTags:I_backOffice_getTags = async (p,config)=>{
        let {type} = p;
        if(this.mock){
            let result:I_tag[] = this.backOffice_getTags_mock(type)
            config.onSuccess(result)
            return result;
        }
        let trans = {'restoran':'رستوران','food':'غذا'}
        let urlDic = {'restoran':'ResType','food':'FoodType'}
        if(type === 'restoran'){}
        else if(type === 'food'){}
        return await this.getResult({
            config:{description: `دریافت تگ های ${trans[type]}`,...config},
            id:'boGetTags',method:'post',url:`${this.baseUrl}/${urlDic[type]}/Search`,
            body:{},
            getResult:(response)=>{
                let data:{title:string,id:any}[] = response.data.data.items
                let result:I_tag[] = data.map((o) => {
                    let tag:I_tag = {name: o.title,id: o.id}; return tag
                });
                return result
            }
        })
    }
    backOffice_addOrEditTag:I_backOffice_addOrEditTag = async (p,config)=>{
        if(this.mock){
            let result:{id:any} | string = this.backOffice_addOrEditTag_mock(p)
            if(typeof result === 'string'){
                alert(result); return false
            }
            else {
                config.onSuccess(result)
                return result;
            }
        }
        let { tagId, tagName,type } = p;
        return await this.getResult({
            config:{
                errorResult:false,
                description:`${tagId === undefined?'ثبت':'ویرایش'} تگ ${type === 'restoran'?'رستوران':'غذا'}`,
                ...config
            },
            id:'BOaddOrEditTag',method:'post',
            url:`${this.baseUrl}/${type === 'restoran'?'ResType':'FoodType'}/Create`,
            body:{"title": tagName,"latinTitle": tagName},
            getResult:(response)=>{
                return { id: response.data.data }
            }
        })
    }
    backOffice_removeTag:I_backOffice_removeTag = async (p,config)=>{
        let {type,tagId} = p
        if(this.mock){
            return this.backOffice_removeTag_mock(p) 
        }
        return await this.getResult({
            config:{errorResult:false,description:`حذف تگ ${type === 'restoran'?'رستوران':'غذا'}`,...config},
            id:'BORemoveTag',method:'delete',
            url:`${this.baseUrl}/${type === 'restoran'?'ResType':'FoodType'}?Id=${tagId.toString()}`,
            getResult:(response)=>true
        })
    } 
    getRestoranSortOptions:I_getRestoranSortOptions = async (p,config)=>{
        if(this.mock || true){
            let result:I_restoran_sort_option[] = this.getRestoranSortOptions_mock()
            config.onSuccess(result)
            return result;
        }
    }
    profile_set_mock = (profile:I_profile)=>{this.setStorage('profile',profile); return true}
    profile_get_mock = ()=>{
        let def:I_profile = {id:12,firstName:'محمد شریف',lastName:'فیض',sheba:'12345678',email:'feiz.ms@gmail.com'}
        return this.getStorage('profile',def)
    }
    peygiriye_sefaresh_mock = ()=>{
        let result:I_peygiriye_sefaresh_result = { statusId: 1, totalPrice: 12344444, id: 88678 }
        return result
    }
    getWalletAmount_mock = ()=>{
        let result:I_getWalletAmount_result = 123245666;
        return result
    }
    profile_getDiscounts_mock = ()=>{
        let result:I_discount[] = [
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
        return result
    }
    profile_getAddresses_mock = ()=>{
        let result:I_address[] = [//لیست آدرس ها
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
        return result
    }
    backOffice_getTags_mock = (type) => {
        let result:I_tag[] = this.getStorage(`${type}Tags`,[])
        return result
    }
    getRestoranSortOptions_mock = ()=>{
        let result:I_restoran_sort_option[] = [
            { text: 'رستوران اقتصادی', value: '0' },
            { text: 'بالاترین امتیاز', value: '1' },
            { text: 'نزدیک ترین', value: '2' },
            { text: 'جدیدترین', value: '3' },
            { text: 'گرانترین', value: '4' }
        ]
        return result
    }
    backOffice_addOrEditTag_mock = (p)=>{
        let { tagId, tagName,type } = p;
        let storageName = `${type}Tags`;
        let tags:I_tag[] = this.getStorage(storageName, [] );
        let newTags;
        let result:{id:any};
        //add
        if(tagId === undefined){
            let res = tags.find((o:I_tag)=>o.name === tagName)
            if(res){return `تگ با نام ${tagName} موجود است . نام دیگری انتخاب کنید`}
            let id = Math.round(Math.random() * 1000000)
            result = {id}
            newTags = [...tags,{id,name:tagName}] 
        }
        //edit
        else {
            let res = tags.find((o:I_tag)=>o.id === tagId)
            if(!res){return `تگ با آی دی ${tagId} موجود نیست`}
            result = {id:tagId}
            newTags = tags.map((o:I_tag)=>o.id === tagId?{id:o.id,name:tagName}:o)
        }
        this.setStorage(storageName,newTags)
        return result
    }
    backOffice_removeTag_mock = (p)=>{
        let {type,tagId} = p;
        let storageName = `${type}Tags`;
        let tags:I_tag[] = this.getStorage(storageName, [] );
        let newTags:I_tag[] = tags.filter((o:I_tag)=>o.id !== tagId)
        this.setStorage(storageName,newTags);
        return true
    }
}