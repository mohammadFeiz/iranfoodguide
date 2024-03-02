import AIOApis, { AIOApis_config } from '../npm/aio-apis/index.tsx';
import { I_profile, I_discount, I_address, I_address_server, I_tag_type, I_tag, I_restoran_sort_option, I_restoran, I_restoran_server, I_food, I_coupon, I_reserveItem, I_deliveryType } from '../typs.tsx';
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
type I_bo_getTags = (p:{type:I_tag_type},config:AIOApis_config)=>Promise<I_tag[]>
type I_getRestoranSortOptions = (p:any,config:AIOApis_config)=>Promise<I_restoran_sort_option[]>
type backOffice_addOrEditTag_result = {id:any} | false
type backOffice_addOrEditTag_param = {tagId?:any,type:'restoran' | 'food',tagName:string}
type I_bo_addOrEditTag = (p:backOffice_addOrEditTag_param,config:AIOApis_config)=>Promise<backOffice_addOrEditTag_result>
type I_bo_removeTag = (p:{type:'restoran' | 'food',tagId:any},config:AIOApis_config)=>Promise<void>
type I_bo_getRestorans_param = { pageSize?:number, pageNumber?:number, selectedTags?:number[], searchValue?:string,selectedSort?:false|string }
type I_bo_getRestorans = (p:I_bo_getRestorans_param,config:AIOApis_config)=>Promise<I_restoran[]>
type I_bo_removeRestoran = (restoranId:any,config:AIOApis_config)=>Promise<boolean>
export type I_addOrEditImage_param = {imageFile:any,imageId:any};
export type I_addOrEditImage_result = {id:any,url:string};
type I_addOrEditImage = (p:I_addOrEditImage_param,config:AIOApis_config)=>Promise<I_addOrEditImage_result>
export type I_bo_addOrEditRestoran_param = {type:'add' | 'edit',newRestoran:I_restoran}
export type I_bo_addOrEditRestoran_result = {id:any};
type I_bo_addOrEditRestoran = (p:I_bo_addOrEditRestoran_param,config:AIOApis_config)=>Promise<I_bo_addOrEditRestoran_result | false>
type I_bo_getRestoranFoods_param = {restoranId:any}
type I_bo_getRestoranFoods_result = I_food[];
type I_bo_getRestoranFoods = (p:I_bo_getRestoranFoods_param,config:AIOApis_config)=>Promise<I_bo_getRestoranFoods_result>
type I_bo_removeFood_result = boolean;
type I_bo_removeFood_param = {restoranId:any,foodId:any}
type I_bo_removeFood = (p:I_bo_removeFood_param,config?:AIOApis_config)=>Promise<I_bo_removeFood_result>
export type I_bo_addOrEditFood_param = {restoranId:any, newFood:I_food, type:'add' | 'edit'}
export type I_bo_addOrEditFood_result = {id:any}
type I_bo_addOrEditFood = (p:I_bo_addOrEditFood_param,config?:AIOApis_config)=>Promise<I_bo_addOrEditFood_result>
type I_getRestoranCoupons_param = {restoranId:any};
type I_getRestoranCoupons_result = I_coupon[];
type I_getRestoranCoupons = (p:I_getRestoranCoupons_param,config?:AIOApis_config)=>Promise<I_getRestoranCoupons_result>
type I_getRestoranReserveItems_param = {restoranId:any};
type I_getRestoranReserveItems_result = I_reserveItem[];
type I_getRestoranReserveItems = (p:I_getRestoranReserveItems_param,config?:AIOApis_config)=>Promise<I_getRestoranReserveItems_result>
export type I_pardakhteOnline_param = {deliveryType:I_deliveryType,foods:{foodId:any,count:number}[],restoranId:any,payment:number,selectedCouponIds?:any[],addressId:any}
type I_pardakhteOnline_result = boolean; 
type I_pardakhteOnline = (p:I_pardakhteOnline_param,config?:AIOApis_config)=>Promise<I_pardakhteOnline_result>
type I_getReserveCapacity_param = { restoranId:any, reserveItemId:any }
type I_getReserveCapacity_result = number[];
type I_getReserveCapacity = (p:I_getReserveCapacity_param,config?:AIOApis_config)=>Promise<I_getReserveCapacity_result>
export type I_APIClass = {
    profile_set:I_profile_set,
    profile_get:I_profile_get,
    peygiriye_sefaresh:I_peygiriye_sefaresh,
    getWalletAmount:I_getWalletAmount,
    profile_getDiscounts:I_profile_getDiscounts,
    profile_getAddresses:I_profile_getAddresses,
    backOffice_getTags:I_bo_getTags,
    getRestoranSortOptions:I_getRestoranSortOptions,
    backOffice_addOrEditTag:I_bo_addOrEditTag,
    backOffice_removeTag:I_bo_removeTag,
    backOffice_getRestorans:I_bo_getRestorans,
    backOffice_removeRestoran:I_bo_removeRestoran,
    addOrEditImage:I_addOrEditImage,
    backOffice_addOrEditRestoran:I_bo_addOrEditRestoran,
    backOffice_getRestoranFoods:I_bo_getRestoranFoods,
    backOffice_removeFood:I_bo_removeFood,
    backOffice_addOrEditFood:I_bo_addOrEditFood,
    getRestoranCoupons:I_getRestoranCoupons,
    getRestoranReserveItems:I_getRestoranReserveItems,
    pardakhteOnline:I_pardakhteOnline,
    getReserveCapacity:I_getReserveCapacity
}
export default class APISClass extends AIOApis{
    mock:boolean = false;
    getReserveCapacity = (p,config) => {
        if(this.mock || true){
            let result:I_getReserveCapacity_result = this.getReserveCapacity_mock(p)
            if(config.onSuccess){config.onSuccess(result)}
            return result
        }
        // return await this.getResult({
        //     config:{description:'دریافت ظرفیت رزرو',...config,errorResult:new Array(24).fill(0).map(() => 0)},
        //     ...
        // })
    }
    getReserveCapacity_mock = (p:I_getReserveCapacity_param)=>{
        let result = [
            0,//ساعت 0
            0,//ساعت 1
            0,//ساعت 2
            0,//ساعت 3
            0,//ساعت 4
            0,//ساعت 5
            0,//ساعت 6
            0,//ساعت 7
            60,//ساعت 8
            60,//ساعت 9
            60,//ساعت 10
            60,//ساعت 11
            48,//ساعت 12
            48,//ساعت 13
            60,//ساعت 14
            60,//ساعت 15
            60,//ساعت 16
            60,//ساعت 17
            60,//ساعت 18
            60,//ساعت 19
            22,//ساعت 20
            22,//ساعت 21
            28,//ساعت 22
            28,//ساعت 23
        ]
        return result
    }
    pardakhteOnline:I_pardakhteOnline = async (p,config) => {
        //deliveryType => 'ارسال با پیک' | 'دریافت حضوری'
        //لیست غذا ها که یک نمونه از اون در لیست زیر نمایش داده شده
        //foods => [
        //    {foodId:Any,count:Number},
        //    ...
        //]
        //restoranId => آی دی رستوران
        //amount => Number مبلغ قابل پرداخت
        //selectedCouponIds => آرایه ای از آی دی کوپن های انتخاب شده
        //addressId => آی دی آدرس انتخاب شده ی کاربر
        let { deliveryType, foods, restoranId, payment, selectedCouponIds, addressId } = p;
        let foodList = [];
        for (let i = 0; i < foods.length; i++) {
            let { count, foodId } = foods[i];
            for (let j = 0; j < count; j++) {
                foodList.push({ restaurantId: restoranId, restaurantFoodId: foodId })
            }
        }
        let dic: { [key in I_deliveryType]: number } = { 'ارسال با پیک': 1, 'دریافت حضوری': 2 };
        return await this.getResult({
            config:{description:'پرداخت آنلاین',...config,errorResult:false},
            id:'pardakhteOnline',method:'post',url:`${this.baseUrl}/Order/OrderTotal`,
            body:{
                "customerId": 1,
                "isPreOrder": false,
                'description': '',
                "serviceTypeId": dic[deliveryType],//delivery 1//takeaway 2
                "addressId": addressId,
                "paymentTypeId": 1,//online
                "callback": window.location.href,//"http://localhost:3000"
                "dinners": foodList
            },
            getResult:(response)=>{
                let paymentUrl = response.data.data;
                window.open(paymentUrl);
                return true
            }
        })
    }
    getRestoranReserveItems:I_getRestoranReserveItems = async (p,config) => {
        if(this.mock){
            let result:I_getRestoranReserveItems_result = this.getRestoranReserveItems_mock(p);
            if(config.onSuccess){config.onSuccess(result)}
            return result
        }
        let { restoranId } = p;
        return await this.getResult({
            config:{description:'دریافت خدمات رزرو رستوران در پنل ادمین',errorResult:[],...config},
            id:'getRestoranReserveItems',method:'post',body:{restaurantId: restoranId},
            url:`${this.baseUrl}/RestaurantReservasionPlan/Search`,
            getResult:(response)=>{
                let data = response.data.data.items
                let result:I_reserveItem[] = data.map((o)=>{
                    let res:I_reserveItem = {
                        id:o.id,
                        images:[],
                        name: o.name || '', // نام آیتم
                        description: o.description || '', // توضیحات آیتم
                        countType: o.countType || false, //سفارس بر اساس تعداد می باشد یا خیر
                        minCount: isNaN(o.minLimitCount)?0:o.minLimitCount, //حداقل تعداد قابل سفارش
                        maxCount: isNaN(o.maxLimitCount)?0:o.maxLimitCount, //حداکثر تعداد قابل سفارش
                        timeType: o.isDaily === 1 ? "day" : "hour", // واحد زمانی آیتم روز یا ساعت
                        price: isNaN(o.price)?0:o.price, // قیمت واحد
                        returnAmount: o.isReturnAmount || false, //آیا رقم روی فاکتور بر می گردد؟
                        preOrderTime: isNaN(o.preOrderTime)?0:o.preOrderTime//مدت زمانی که طول میکشه سفارش آماده بشه
                    }
                    return res
                })
                return result;
            }
        })
    }
    getRestoranReserveItems_mock = (p:I_getRestoranReserveItems_param) => {
        let {restoranId} = p;
        let restorans_reserveItems = this.getStorage('restorans_reserveItems',{})
        return restorans_reserveItems[`restoran_${restoranId}`]
    }
    getRestoranCoupons:I_getRestoranCoupons = async (p,config) => {
        if(this.mock){
            let result:I_getRestoranCoupons_result = this.getRestoranCoupons_mock(p);
            if(config.onSuccess){config.onSuccess(result)}
            return result;
        }
        let {restoranId} = p;
        return await this.getResult({
            config:{
                description:'دریافت کوپن های تخفیف رستوران',errorResult:[],
                ...config
            },
            id:'getRestoranCoupons',method:'post',
            url:`${this.baseUrl}/RestaurantDiscount/Search`,
            body:{ "RestaurantId": restoranId },
            getResult:(response)=>response.data.data.items
        })
    }
    getRestoranCoupons_mock = (p:I_getRestoranCoupons_param) => {
        let result:I_coupon[] = [
            { id: '23423423', title: 'کوپن 1', discountPercent: 10, minCartAmount: 500000, maxDiscount: 100000 },
            { id: '75684564', title: 'کوپن 2', discountPercent: 10, maxDiscount: 100000 },
            { id: '4235345', title: 'کوپن 3', discountPercent: 10, minCartAmount: 500000 },
            { id: '56345234', title: 'کوپن 4', discountPercent: 10 },
            { id: '23426', title: 'کوپن 5', discount: 100000, minCartAmount: 500000 },
            { id: '645634534', title: 'کوپن 6', discount: 100000 },
        ]
        return result
    }
    backOffice_getRestoranFoods:I_bo_getRestoranFoods = async (p,config)=>{
        let {restoranId} = p;
        if(this.mock){
            let result:I_food[] = this.backOffice_getRestoranFoods_mock(p)
            if(config.onSuccess){config.onSuccess(result);}
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
    backOffice_getRestoranFoods_mock = (p:I_bo_getRestoranFoods_param)=>{
        let {restoranId} = p;
        let foods:I_food[] = this.getStorage(`restoranFoods_${restoranId}`,[]);
        return foods
    }
    backOffice_addOrEditRestoran:I_bo_addOrEditRestoran = async (p,config)=>{
        let {type,newRestoran:nr} = p;
        if(this.mock){
            let result:I_bo_addOrEditRestoran_result = this.backOffice_addOrEditRestoran_mock(p);
            if(config.onSuccess){config.onSuccess(result);}
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
                let result:I_bo_addOrEditRestoran_result;
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
        let result:I_bo_addOrEditRestoran_result = {id};
        return result;
    }
    addOrEditImage = async (p,config)=>{
        let {imageFile,imageId} = p;
        // if(this.mock){
        //     let result:I_addOrEditImage_result = this.addOrEditImage_mock(p);
        //     if(config.onSuccess){config.onSuccess(result);}
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
    backOffice_removeRestoran:I_bo_removeRestoran = async (restoranId,config)=>{
        if(this.mock){
            let result = this.backOffice_removeRestoran_mock(restoranId);
            if(config.onSuccess){config.onSuccess(result);}
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
    backOffice_getRestorans:I_bo_getRestorans = async (p,config)=>{
        let { pageSize = 1000, pageNumber = 1, selectedTags = [], searchValue,selectedSort } = p;
            
        if(this.mock){
            let result = this.backOffice_getRestorans_mock(p);
            if(config.onSuccess){config.onSuccess(result);}
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
    backOffice_removeFood:I_bo_removeFood = async (p,config) => {
        let { restoranId, foodId } = p;
        if(this.mock){
            let result:I_bo_removeFood_result = this.backOffice_removeFood_mock(p);
            if(config.onSuccess){config.onSuccess(result);}
            return true
        }
        return await this.getResult({
            config:{description:'حذف غذا از منوی رستوران',errorResult:false,...config},
            id:'BORemoveFood',method:'delete',
            url:`${this.baseUrl}/RestaurantFood?Id=${foodId.toString()}`,
            getResult:(response)=>true
        })
    }
    backOffice_removeFood_mock = (p:I_bo_removeFood_param) => {
        let { restoranId, foodId } = p;
        let foods = this.getStorage(`menuOfRestoran_${restoranId}`,[]);
        let newFoods = foods.filter((o) => o.id !== foodId);
        this.setStorage(`menuOfRestoran_${restoranId}`,newFoods);
        return true;
    }
    backOffice_addOrEditFood:I_bo_addOrEditFood = async (p,config) => {
        if(this.mock){
            let result:I_bo_addOrEditFood_result = this.backOffice_addOrEditFood_mock(p);
            if(config.onSuccess){config.onSuccess(result);}
            return true
        }
        let { restoranId, newFood, type } = p
        let {foodToServer} = this.getAppState();
        return await this.getResult({
            config:{
                description:`${type === 'add'?'ثبت':'ویرایش'} غذا در منوی رستوران`,
                ...config
            },
            id:'BOAddOrEditFood',method:type === 'add' ? 'post' : 'put',
            body:foodToServer(newFood,type,restoranId),
            url:`${this.baseUrl}/RestaurantFood/${type === 'add' ? 'Create' : 'Edit'}`,
            getResult:(response)=>type === 'edit' ? {id:restoranId} : { id: response.data.data }
        })
    }
    backOffice_addOrEditFood_mock = (p:I_bo_addOrEditFood_param) => {
        let { restoranId, newFood, type } = p;
        let foods = this.getStorage(`menuOfRestoran_${restoranId}`, [] );
        let newFoods:I_food[], result:I_bo_addOrEditFood_result;
        if (type === 'add') {
            let id:any = Math.round(Math.random() * 1000000);
            newFoods = [{ ...newFood, id }, ...foods];
            result = { id }
        }
        else {
            newFoods = foods.map((o) => o.id === newFood.id ? { ...newFood } : o)
            result = {id:newFood.id};
        }
        this.setStorage(`menuOfRestoran_${restoranId}`, newFoods );
        return result;
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
            if(config.onSuccess){config.onSuccess(result)}
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
            if(config.onSuccess){config.onSuccess(result)}
            return result;
        }
    }
    profile_getDiscounts:I_profile_getDiscounts = async (parameter,config)=>{
        if(this.mock || true){
            let result:I_discount[] = this.profile_getDiscounts_mock()
            if(config.onSuccess){config.onSuccess(result)}
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
            if(config.onSuccess){config.onSuccess(result)}
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
    backOffice_getTags:I_bo_getTags = async (p,config)=>{
        let {type} = p;
        if(this.mock){
            let result:I_tag[] = this.backOffice_getTags_mock(type)
            if(config.onSuccess){config.onSuccess(result)}
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
    backOffice_addOrEditTag:I_bo_addOrEditTag = async (p,config)=>{
        if(this.mock){
            let result:{id:any} | string = this.backOffice_addOrEditTag_mock(p)
            if(typeof result === 'string'){
                alert(result); return false
            }
            else {
                if(config.onSuccess){config.onSuccess(result)}
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
    backOffice_removeTag:I_bo_removeTag = async (p,config)=>{
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
            if(config.onSuccess){config.onSuccess(result)}
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