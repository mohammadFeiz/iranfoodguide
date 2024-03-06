import AIOApis, { AIOApis_config } from '../npm/aio-apis/index.tsx';
import { I_profile, I_discount, I_address, I_address_server, I_tag_type, I_tag, I_restoran_sort_option, I_restoran, I_restoran_server, I_food, I_coupon, I_reserveItem, I_deliveryType, I_comment, I_image, I_walletHistoryItem } from '../typs.tsx';
import shandiz_logo from '../images/shandiz_logo.png';
import shandiz_image from '../images/shandiz_image.png';
import frame210 from '../images/Frame 210.png';
import cat_irani_src from '../images/cat-irani.png';
import cat_sobhane_src from '../images/cat-sobhane.png';
import cat_ajil_src from '../images/cat-ajil.png';
import cat_abmive_src from '../images/cat-abmive.png';
import cat_saladbar_src from '../images/cat-saladbar.png';
import cat_fastfood_src from '../images/cat-fastfood.png';
import cat_kafe_src from '../images/cat-kafe.png';
import cat_shirini_src from '../images/cat-shirini.png';
import pasta_alferedo from '../images/pasta_alferedo.png';
import ghaem_image from '../images/ghaem_image.png';
import ghaem_logo from '../images/ghaem_logo.png';

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
type I_bo_addOrEditTag = (p:{tagId?:any,type:'restoran' | 'food',tagName:string},config:AIOApis_config)=>Promise<{id:any} | false>
type I_bo_removeTag = (p:{type:'restoran' | 'food',tagId:any},config:AIOApis_config)=>Promise<void>
type I_bo_getRestorans = (p:{ pageSize?:number, pageNumber?:number, selectedTags?:number[], searchValue?:string,selectedSort?:false|string },config:AIOApis_config)=>Promise<I_restoran[]>
type I_bo_removeRestoran = (restoranId:any,config:AIOApis_config)=>Promise<boolean>
type I_addOrEditImage = (p:{imageFile:any,imageId:any},config:AIOApis_config)=>Promise<{id:any,url:string}>
type I_removeImage = (p:{imageId:any},config:AIOApis_config)=>Promise<boolean>
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
type I_getRestoranReserveItems = (p:{restoranId:any},config?:AIOApis_config)=>Promise<I_reserveItem[]>
type I_removeRestoranReserveItem = (p:{restoranId:any,itemId:any},config?:AIOApis_config)=>Promise<boolean>
type I_addOrEditRestoranReserveItem = (p:{ restoranId:any, item: I_reserveItem, type:'add'|'edit' },config?:AIOApis_config)=>Promise<{id:any}>
export type I_pardakhteOnline_param = {deliveryType:I_deliveryType,foods:{foodId:any,count:number}[],restoranId:any,payment:number,selectedCouponIds?:any[],addressId:any}
type I_pardakhteOnline_result = boolean; 
type I_pardakhteOnline = (p:I_pardakhteOnline_param,config?:AIOApis_config)=>Promise<I_pardakhteOnline_result>
type I_getReserveCapacity_param = { restoranId:any, reserveItemId:any }
type I_getReserveCapacity_result = number[];
type I_getReserveCapacity = (p:I_getReserveCapacity_param,config?:AIOApis_config)=>Promise<I_getReserveCapacity_result>
export type I_getRestoranComments_param = { restoranId:number | string, pageSize:number, pageNumber:number }
type I_getRestoranComments_result = I_comment[]
type I_getRestoranComments = (p:I_getRestoranComments_param,config?:AIOApis_config)=>Promise<I_getRestoranComments_result>
type I_profile_removeAccount = (p:any,config:AIOApis_config)=>Promise<boolean>
type I_profile_setProfile = (profile:I_profile,config?:AIOApis_config)=>Promise<boolean>
type I_profile_setPassword = (password:string,config?:AIOApis_config)=>Promise<boolean>
type I_profile_getProfile = (p:any,config?:AIOApis_config)=>Promise<I_profile | false>
type I_profile_addressForm = (p:{address:I_address,type:'add' | 'edit'},config?:AIOApis_config)=>Promise<boolean>
type I_restoranHayeMahboob = (p:any,config?:AIOApis_config)=>Promise<I_restoran[]>
type I_getWalletHistory = (p:any,config:AIOApis_config)=>Promise<I_walletHistoryItem[]>
type I_safheye_sefaresh = (p:any,config?:AIOApis_config)=>Promise<any[]>
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
    removeImage:I_removeImage,
    backOffice_addOrEditRestoran:I_bo_addOrEditRestoran,
    backOffice_getRestoranFoods:I_bo_getRestoranFoods,
    backOffice_removeFood:I_bo_removeFood,
    backOffice_addOrEditFood:I_bo_addOrEditFood,
    getRestoranCoupons:I_getRestoranCoupons,
    getRestoranReserveItems:I_getRestoranReserveItems,
    removeRestoranReserveItem:I_removeRestoranReserveItem,
    addOrEditRestoranReserveItem:I_addOrEditRestoranReserveItem,
    pardakhteOnline:I_pardakhteOnline,
    getReserveCapacity:I_getReserveCapacity,
    getRestoranComments:I_getRestoranComments,
    profile_removeAccount:I_profile_removeAccount,
    profile_setProfile:I_profile_setProfile,
    profile_setPassword:I_profile_setPassword,
    profile_getProfile:I_profile_getProfile,
    profile_addressForm:I_profile_addressForm,
    restoranHayeMahboob:I_restoranHayeMahboob,
    getWalletHistory:I_getWalletHistory,
    safheye_sefaresh:I_safheye_sefaresh
}
export default class APISClass extends AIOApis{
    mock:boolean = false;
    getWalletHistory:I_getWalletHistory = (p,config)=>{
        return this.request({
            mock:this.mock || true,
            mockFunction:this.getWalletHistory_mock.bind(this),
            config:{description:'دریافت تاریخچه کیف پول',...config,errorResult:[]},
            id:'getWalletHistory',
            method:'get',
            url:'',
            getResult:(response)=>[]
        })
    }
    getWalletHistory_mock = ()=>{
        let data:{date:number,amount:number,type:'in'|'out'}[] = [
            { date: new Date().getTime(), amount: 123456789, type: 'in' },
            { date: new Date().getTime(), amount: 123456789, type: 'out' },
            { date: new Date().getTime(), amount: 123456789, type: 'in' },
            { date: new Date().getTime(), amount: 123456789, type: 'out' },
            { date: new Date().getTime(), amount: 123456789, type: 'in' },
        ]
        let result:I_walletHistoryItem[] = data.map((o) => {
            let [year,month,day,hour,minute] = this.dateToArray(o.date,true)
            return { ...o, date:`${year}/${month}/${day}`, time:`${hour}:${minute}` }
        })
        return result
    }
    restoranHayeMahboob:I_restoranHayeMahboob = async (p, config) => {
        let {Login} = this.getAppState();
        let {id} = Login.getUserInfo();
        return await this.request({
            config:{
                description:'دریافت لیست رستوران های محبوب',errorResult:[],
                ...config,
            },
            parameter:p,
            mock:this.mock,
            mockFunction:this.restoranHayeMahboob_mock.bind(this),
            id:'restoranHayeMahboob',method:'post',
            url:`${this.baseUrl}/RestaurantFavoruite/search`,
            body:{ "PersonId": id },
            getResult:(response)=>{
                let result:I_restoran[] = response.data.data.items;
                return result
            }
        })
    }
    restoranHayeMahboob_mock = (p) => {
        let result:I_restoran[] = []
        return result
    }  
    profile_addressForm:I_profile_addressForm = async (p,config)=>{
        let {address,type} = p;
        let {Login} = this.getAppState();
        let { id } = Login.getUserInfo();
        return await this.request({
            config:{
                description:`${type === 'add'?'افزودن':'ویرایش'} آدرس `,errorResult:false,
                ...config
            },
            parameter:p,
            mock:this.mock,
            mockFunction:this.profile_addressForm_mock.bind(this),
            id:'addressForm',method:'post',
            url:`${this.baseUrl}/People/CreatePeopleAddress`,
            body:{
                "personId": id,
                "address": {
                    "fullAddress": address.address,
                    "latitude": address.latitude,
                    "longitude": address.longitude,
                    "phoneNumber": address.phone
                },
                "title": address.title
            },
            getResult:(repsonse)=>true
        })
    }
    profile_addressForm_mock = (p)=>{}
    profile_getProfile:I_profile_getProfile = async (p,config)=>{
        let {Login} = this.getAppState();
        let { id } = Login.getUserInfo();    
        return await this.request({
            config:{
                description:'دریافت اطلاعات کاربری',errorResult:false,
                ...config
            },
            parameter:p,
            mock:this.mock,
            mockFunction:this.profile_getProfile_mock.bind(this),
            id:'getProfile',method:'post',
            url:`${this.baseUrl}/People/search`,
            body:{ "Id": id },
            getResult:(response)=>{
                let result:I_profile = response.data.data.items[0];
                return result
            }
        })
    }
    profile_getProfile_mock = (p)=>{
        let result:I_profile = {
            id: 12,
            firstName: 'احمد',//نام
            lastName: 'بهرامی',//نام خانوادگی
            email: 'feiz.ms@gmail.com',//آدرس ایمیل
            sheba: '1234567',//شماره شبا
        }
        return result
    }
    profile_setPassword:I_profile_setPassword = async (password,config) =>{
        let {Login} = this.getAppState();
        let mobile = Login.getUserId();
        return await this.request({
            config:{
                description:'ثبت رمز عبور',errorResult:false,
                ...config
            },
            parameter:password,
            mock:this.mock,
            mockFunction:this.profile_setPassword_mock.bind(this),
            id:'setPassword',method:'post',
            url:`${this.baseUrl.replace('/api', '')}/Users/ChangePasswordByAdmin`,
            body:{ "MobileNumber": mobile, "NewPassword": password },
            getResult:(response)=>true
        })
    }
    profile_setPassword_mock = (p)=>{}
    profile_setProfile:I_profile_setProfile = async (profile,config)=>{
        let {Login} = this.getAppState();
        let { isRegistered } = Login.getUserInfo();
        let mobile = Login.getUserId();
        return await this.request({
            config:{
                description:'ثبت اطلاعات پروفایل',errorResult:false,
                message:{success:true},
                ...config
            },
            parameter:profile,
            mock:this.mock,
            mockFunction:this.profile_setProfile_mock.bind(this),
            id:'setProfile',method:'post',
            url:`${this.baseUrl}/People/${isRegistered ? 'UpdateProfile' : 'CreateProfile'}`,
            body:{
                "Id": profile.id,
                "firstName": profile.firstName,//نام
                "lastName": profile.lastName,
                "email": profile.email,
                "sheba": profile.sheba,
                "mobileNumbers": [{ "mobileNumber": mobile, "isDefault": true }]
            },
            getResult:(response)=>true
        })
    }
    profile_setProfile_mock = (profile)=>{

    }
    profile_removeAccount:I_profile_removeAccount = async (p,config)=>{
        let {Login} = this.getAppState();
        return await this.request({
            config:{
                description:'حذف حساب کاربری',errorResult:false,
                ...config
            },
            parameter:p,
            mock:this.mock,
            mockFunction:this.profile_removeAccount_mock.bind(this),
            id:'profileRemoveAccount',method:'post',
            url:`${this.baseUrl.replace('/api', '')}/Users/DeleteUserProfileAsync`,
            body:{ "mobileNumber": Login.getUserId() },
            getResult:(response)=>true
        })
    }
    profile_removeAccount_mock = (p)=>{//notice
        return true
    }
    getRestoranComments:I_getRestoranComments = async (p,config) => {
        let { restoranId, pageSize, pageNumber } = p;
        return this.request({
            config:{
                description:'دریافت نظرات ثبت شده در مورد رستوران',errorResult:[],
                ...config
            },
            parameter:p,
            mock:this.mock,
            mockFunction:this.getRestoranComments_mock.bind(this),
            id:'getRestoranComments',method:'post',
            url:`${this.baseUrl}/FeedBack/GetRestaurantComments`,
            body:{
                "RestaurantId": restoranId,
                "PageNumber": pageSize,
                "RecordsPerPage": pageNumber
            },
            getResult:(response)=>{
                let result = response.data.data.items;
                return result
            }
        })
    }
    getRestoranComments_mock = (p) => {
        let result:I_comment[] = [
            { date: '1402/1/1/3/34', name: 'رضا عباسی', comment: 'کیفیت غذای رستوران خیلی خوب بود ، من خیلی خوشم آمد بهتر بود کمی گرم تر به دستم میرسی' },
            { date: '1402/1/1/3/34', name: 'رضا عباسی', comment: 'کیفیت غذای رستوران خیلی خوب بود ، من خیلی خوشم آمد بهتر بود کمی گرم تر به دستم میرسی' },
            { date: '1402/1/1/3/34', name: 'رضا عباسی', comment: 'کیفیت غذای رستوران خیلی خوب بود ، من خیلی خوشم آمد بهتر بود کمی گرم تر به دستم میرسی' },
            { date: '1402/1/1/3/34', name: 'رضا عباسی', comment: 'کیفیت غذای رستوران خیلی خوب بود ، من خیلی خوشم آمد بهتر بود کمی گرم تر به دستم میرسی' },
            { date: '1402/1/1/3/34', name: 'رضا عباسی', comment: 'کیفیت غذای رستوران خیلی خوب بود ، من خیلی خوشم آمد بهتر بود کمی گرم تر به دستم میرسی' },
            { date: '1402/1/1/3/34', name: 'رضا عباسی', comment: 'کیفیت غذای رستوران خیلی خوب بود ، من خیلی خوشم آمد بهتر بود کمی گرم تر به دستم میرسی' },
            { date: '1402/1/1/3/34', name: 'رضا عباسی', comment: 'کیفیت غذای رستوران خیلی خوب بود ، من خیلی خوشم آمد بهتر بود کمی گرم تر به دستم میرسی' },
        ]
        return result
    }
    getReserveCapacity = async (p,config) => {
        return await this.request({
            config:{description:'دریافت ظرفیت رزرو',...config,errorResult:new Array(24).fill(0).map(() => 0)},
            parameter:p,
            mock:this.mock || true,
            mockFunction:this.getReserveCapacity_mock.bind(this),
            body:false,
            url:'',
            method:'post',
            id:'getReserveCapacity',
            getResult:()=>{}
        })
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
        return await this.request({
            config:{description:'پرداخت آنلاین',...config,errorResult:false},
            parameter:p,
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
        let { restoranId } = p;
        return await this.request({
            config:{description:'دریافت خدمات رزرو رستوران در پنل ادمین',errorResult:[],...config},
            parameter:p,
            mock:this.mock,
            mockFunction:this.getRestoranReserveItems_mock.bind(this),
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
                        data:{
                            type:'reserve',
                            countType: o.countType || false, //سفارس بر اساس تعداد می باشد یا خیر
                            minCount: isNaN(o.minLimitCount)?0:o.minLimitCount, //حداقل تعداد قابل سفارش
                            maxCount: isNaN(o.maxLimitCount)?0:o.maxLimitCount, //حداکثر تعداد قابل سفارش
                            timeType: o.isDaily === 1 ? "day" : "hour", // واحد زمانی آیتم روز یا ساعت
                            price: isNaN(o.price)?0:o.price, // قیمت واحد
                            returnAmount: o.isReturnAmount || false, //آیا رقم روی فاکتور بر می گردد؟
                            preOrderTime: isNaN(o.preOrderTime)?0:o.preOrderTime//مدت زمانی که طول میکشه سفارش آماده بشه
                        }
                    }
                    return res
                })
                return result;
            }
        })
    }
    getRestoranReserveItems_mock = (p) => {
        let {restoranId} = p;
        let restorans_reserveItems = this.getStorage('restorans_reserveItems',{})
        return restorans_reserveItems[`restoran_${restoranId}`]
    }
    removeRestoranReserveItem:I_removeRestoranReserveItem = async (p,config) => {
        let { restoranId, itemId } = p;
        return await this.request({
            config:{description:'حذف خدمت رزرو رستوران در پنل ادمین',errorResult:false,...config},
            parameter:p,
            mock:this.mock,
            mockFunction:this.removeRestoranReserveItem_mock.bind(this),
            id:'removeRestoranReserveItem',
            url:`${this.baseUrl}/RestaurantReservasionPlan?Id=${itemId.toString()}`,
            method:'delete',
            getResult:()=>true
        })
    }
    removeRestoranReserveItem_mock = (p) => {
        let {itemId} = p
        let items = this.getStorage('reserveItems',[])
        items = items.filter((o)=>o.id !== itemId);
        this.setStorage('reserveItems',items);
        return true
    }
    reserveItemToServer = (item:I_reserveItem,type:'add'|'edit') => {
        return {
            "images":item.images.map((o)=>{return {imageId:o.id}}) || [],
            "id": type === 'edit' ? item.id : undefined,
            "Id": type === 'edit' ? item.id : undefined,
            "name": item.name || '',
            "restaurantId": 30,//restoranId
            "description": item.description || '',
            "maxLimitCount": item.data.maxCount || 0,
            "minLimitCount": item.data.minCount || 0,
            "countType": item.data.countType || false,
            "guestCount": 0,
            "price": item.data.price || 0,
            "isReturnAmount": item.data.returnAmount || false,
            "preOrderTime": item.data.preOrderTime || 0,
            "isDaily": item.data.timeType === 'day'
        }
    }
    addOrEditRestoranReserveItem:I_addOrEditRestoranReserveItem = async (p,config)=>{
        let { restoranId, item, type } = p;
        return await this.request({
            config:{description:`${type === 'add' ? 'ذخیره' : 'ویرایش'} خدمت رزرو رستوران در پنل ادمین`,errorResult:false,...config},
            parameter:p,
            mock:this.mock,
            mockFunction:this.addOrEditRestoranReserveItem_mock.bind(this),
            id:'addOrEditRestoranReserveItem',
            url:`${this.baseUrl}/RestaurantReservasionPlan/${type === 'add'?'Create':'Edit'}`,
            method:type === 'add'?'post':'put',
            body:this.reserveItemToServer(item,type),
            getResult:(response)=>{
                if(type === 'add'){return { id: response.data.data }}
                return {id:item.id}
            }
        })
    }
    addOrEditRestoranReserveItem_mock = (p)=>{
        let {item,type} = p;
        let items = this.getStorage('reserveItems',[])
        if(type === 'add'){
            let id = 'sss' + Math.round(Math.random() * 10000000)
            item.id = id;
            items = items.concat(item);
            this.setStorage('reserveItems',items)
            return {id}
        }
        else {
            items = items.map((o)=>o.id === item.id?item:o);
            this.setStorage('reserveItems',items)
            return {id:item.id}
        }
    }
    getRestoranCoupons:I_getRestoranCoupons = async (p,config) => {
        let {restoranId} = p;
        return await this.request({
            config:{
                description:'دریافت کوپن های تخفیف رستوران',errorResult:[],
                ...config
            },
            parameter:p,
            mock:this.mock,
            mockFunction:this.getRestoranCoupons_mock.bind(this),
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
        let {foodToClient} = this.getAppState();
        let {restoranId} = p;
        return await this.request({
            config:{
                description:'دریافت منوی رستوران',
                ...config
            },
            parameter:p,
            mock:this.mock,
            mockFunction:this.backOffice_getRestoranFoods_mock.bind(this),
            id:'BOGerRestoranFoods',method:'post',
            url:`${this.baseUrl}/RestaurantFood/Search`,
            body:{ "RestaurantId": restoranId },
            getResult:(response)=>{
                let serverFoods = response.data.data.items;

                let result:I_food[] = serverFoods.map((o)=>{return foodToClient(o)})
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
        return await this.request({
            config:{
                errorResult:false,
                description:`${type === 'add'?'افزودن':'ویرایش'} رستوران`,
                ...config
            },
            parameter:p,
            mock:this.mock,
            mockFunction:this.backOffice_addOrEditRestoran_mock.bind(this),
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
    backOffice_addOrEditRestoran_mock = (p:I_bo_addOrEditRestoran_param)=>{
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
    addOrEditImage:I_addOrEditImage = async (p,config)=>{
        let {imageFile,imageId} = p;
        let formData = new FormData()
        formData.append('imageFile', imageFile, imageFile.name)
        formData.append('title', imageFile.name)
        formData.append('imageId', imageId)   
        return await this.request({
            config:{
                errorResult:false,
                description:'ثبت تصویر',
                ...config
            },
            parameter:p,
            mock:this.mock && false,
            mockFunction:this.addOrEditImage_mock.bind(this),
            id:'addOrEditImage',method:'post',body:formData,
            url:`${this.baseUrl}/Image/UploadImage`,
            getResult:(response)=>response.data.data
        })
    }
    addOrEditImage_mock = (p)=>{

    }
    removeImage:I_removeImage = async (p,config)=>{
        let {imageId} = p;
        return await this.request({
            config:{errorResult:false,description:'حذف تصویر',...config},
            parameter:p,
            mock:this.mock && false,
            mockFunction:this.removeImage_mock.bind(this),
            id:'removeImage',method:'post',
            url:'',
            getResult:(response)=>true
        })
    }
    removeImage_mock = (imageId:string | number)=>{
        let images = this.getStorage('images',[])
        let newImages:I_image[] = images.filter((o:I_image)=>o.id !== imageId);
        this.setStorage('images',newImages)
        return true
    }
    backOffice_removeRestoran:I_bo_removeRestoran = async (restoranId,config)=>{
        return await this.request({
            config:{
                description:'حذف رستوران',errorResult:false,
                ...config
            },
            parameter:restoranId,
            mock:this.mock,
            mockFunction:this.backOffice_removeRestoran_mock.bind(this),
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
        let {restoranToClient} = this.getAppState();
        return await this.request({
            config:{
                description:'دریافت لیست رستوران ها',errorResult:[],
                ...config
            },
            parameter:p,
            mock:this.mock,
            mockFunction:this.backOffice_getRestorans_mock.bind(this),
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
    backOffice_removeFood:I_bo_removeFood = async (p,config) => {
        let { restoranId, foodId } = p;
        return await this.request({
            config:{description:'حذف غذا از منوی رستوران',errorResult:false,...config},
            parameter:p,
            mock:this.mock,
            mockFunction:this.backOffice_removeFood_mock.bind(this),
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
        let { restoranId, newFood, type } = p
        let {foodToServer} = this.getAppState();
        return await this.request({
            config:{
                description:`${type === 'add'?'ثبت':'ویرایش'} غذا در منوی رستوران`,
                ...config
            },
            parameter:p,
            mock:this.mock,
            mockFunction:this.backOffice_addOrEditFood_mock.bind(this),
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
    profile_set:I_profile_set = async (profile,config)=> {
        let {Login} = this.getAppState();
        let mobile = Login.getUserId();
        return await this.request({
            config:{description:'ثبت اطلاعات شخصی',message:{success:true},...config},
            parameter:profile,
            mock:this.mock,
            mockFunction:this.profile_set_mock.bind(this),
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
    profile_set_mock = (profile:I_profile)=>{this.setStorage('profile',profile); return true}
    profile_get:I_profile_get = async (parameter,config)=>{
        let {Login} = this.getAppState();
        return await this.request({
            config:{description:'دریافت اطلاعات شخصی',...config},
            mock:this.mock,
            mockFunction:this.profile_get_mock.bind(this),
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
    profile_get_mock = ()=>{
        let def:I_profile = {id:12,firstName:'محمد شریف',lastName:'فیض',sheba:'12345678',email:'feiz.ms@gmail.com'}
        return this.getStorage('profile',def)
    }
    peygiriye_sefaresh:I_peygiriye_sefaresh = async (orderId,config)=>{
        return await this.request({
            config:{
                description:'پیگیری سفارش',
                ...config
            },
            parameter:orderId,
            mock:this.mock || true,
            mockFunction:this.peygiriye_sefaresh_mock.bind(this),
            id:'peygiriyeSefaresh',method:'post',url:`${this.baseUrl}/Order/InquiryOrder`,
            body:{"OrderId": orderId},
            getResult:(response)=>{
                let result:I_peygiriye_sefaresh_result = response.data.data.items[0];
                return result
            }

        })
    }
    peygiriye_sefaresh_mock = (orderId)=>{
        let result:I_peygiriye_sefaresh_result = { statusId: 1, totalPrice: 12344444, id: 88678 }
        return result
    }
    getWalletAmount:I_getWalletAmount = async (parameter,config)=>{
        return this.request({
            config:{description:'دریافت موجودی کیف پول',...config},
            parameter,
            mock:true,
            mockFunction:this.getWalletAmount_mock.bind(this),
            id:'getWalletAmount',
            method:'post',
            url:'',
            getResult:()=>{}
        })
    }
    getWalletAmount_mock = ()=>{
        let result:I_getWalletAmount_result = 123245666;
        return result
    }
    profile_getDiscounts:I_profile_getDiscounts = async (parameter,config)=>{
        let {Login} = this.getAppState();
        let { id } = Login.getUserInfo();
        return await this.request({
            config:{description:'دریافت لیست تخفیف ها',...config},
            parameter,
            mock:this.mock,
            mockFunction:this.profile_getDiscounts_mock.bind(this),
            id:'profileGetDiscounts',method:'post',url:`${this.baseUrl}/PersonDiscount/Search`,
            body:{ "PersonId": id },
            getResult:(response)=>{
                let result:I_discount[] = response.data.data.items;
                return result
            }
        })
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
    
    profile_getAddresses:I_profile_getAddresses = async (parameter,config)=>{
        let {Login} = this.getAppState(),{ id } = Login.getUserInfo();
        return await this.request({
            config:{errorResult:[],description:'دریافت لیست آدرس ها',...config},
            parameter,
            mock:this.mock,
            mockFunction:this.profile_getAddresses_mock.bind(this),
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
    backOffice_getTags:I_bo_getTags = async (p,config)=>{
        let {type} = p;
        let trans = {'restoran':'رستوران','food':'غذا'}
        let urlDic = {'restoran':'ResType','food':'FoodType'}
        if(type === 'restoran'){}
        else if(type === 'food'){}
        return await this.request({
            config:{description: `دریافت تگ های ${trans[type]}`,...config},
            parameter:p,
            mock:this.mock,
            mockFunction:this.backOffice_getTags_mock.bind(this),
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
    backOffice_getTags_mock = (type) => {
        let result:I_tag[] = this.getStorage(`${type}Tags`,[])
        return result
    }
    backOffice_addOrEditTag:I_bo_addOrEditTag = async (p,config)=>{
        let { tagId, tagName,type } = p;
        return await this.request({
            config:{
                errorResult:false,
                description:`${tagId === undefined?'ثبت':'ویرایش'} تگ ${type === 'restoran'?'رستوران':'غذا'}`,
                ...config
            },
            parameter:p,
            mock:this.mock,
            mockFunction:this.backOffice_addOrEditTag_mock.bind(this),
            id:'BOaddOrEditTag',method:'post',
            url:`${this.baseUrl}/${type === 'restoran'?'ResType':'FoodType'}/Create`,
            body:{"title": tagName,"latinTitle": tagName},
            getResult:(response)=>{
                return { id: response.data.data }
            }
        })
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
    
    backOffice_removeTag:I_bo_removeTag = async (p,config)=>{
        let {type,tagId} = p
        return await this.request({
            config:{errorResult:false,description:`حذف تگ ${type === 'restoran'?'رستوران':'غذا'}`,...config},
            parameter:p,
            mock:this.mock,
            mockFunction:this.backOffice_removeTag_mock.bind(this),
            id:'BORemoveTag',method:'delete',
            url:`${this.baseUrl}/${type === 'restoran'?'ResType':'FoodType'}?Id=${tagId.toString()}`,
            getResult:(response)=>true
        })
    } 
    backOffice_removeTag_mock = (p)=>{
        let {type,tagId} = p;
        let storageName = `${type}Tags`;
        let tags:I_tag[] = this.getStorage(storageName, [] );
        let newTags:I_tag[] = tags.filter((o:I_tag)=>o.id !== tagId)
        this.setStorage(storageName,newTags);
        return true
    }
    getRestoranSortOptions:I_getRestoranSortOptions = async (p,config)=>{
        return await this.request({
            config:{description:'دریافت موارد مرتب سازی رستوران',...config},
            parameter:p,
            mock:true,
            mockFunction:this.getRestoranSortOptions_mock.bind(this),
            method:'post',
            url:'',
            id:'',
            getResult:()=>{}
        })
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
    safheye_sefaresh = async (p,config)=> {
        return await this.request({
            config:{description:'دریافت اطلاعات صفحه سفارش غذا',...config,errorResult:[]},
            mock:true,
            mockFunction:this.safheye_sefaresh_mock.bind(this),
            body:{},method:'post',id:'safheyeSefaresh',
            url:`${this.baseUrl}/PageLayout/GetListOfFoodDelivery`,
            getResult:(response)=>response.data.data
        })
    }
    safheye_sefaresh_mock = ()=>{
        let result = [
            {
                type: 'Billboard',
                items: [{ src: frame210 }, { src: frame210 }, { src: frame210 }, { src: frame210 }]
            },
            {
                type: 'Categories',
                items: [
                    { name: 'فست فود', src: cat_fastfood_src, id: '0' },
                    { name: 'ایرانی', src: cat_irani_src, id: '1' },
                    { name: 'صبحانه', src: cat_sobhane_src, id: '2' },
                    { name: 'سالاد بار', src: cat_saladbar_src, id: '3' },
                    { name: 'شیرینی', src: cat_shirini_src, id: '4' },
                    { name: 'آجیل', src: cat_ajil_src, id: '5' },
                    { name: 'آبمیوه بستنی', src: cat_abmive_src, id: '6' },
                    { name: 'کافه', src: cat_kafe_src, id: '7' },
                ]
            },
            {
                type: 'Slider',
                name: 'رستوران های تخفیف دار',
                items: [
                    {
                        name: 'رستوران شاندیز گالریا', image: shandiz_image, logo: shandiz_logo,
                        rate: 3.4, distance: 3, time: 35, tags: ['ایرانی ', 'سنتی', 'فست فود', 'ملل']
                    },
                    {
                        name: 'رستوران شاندیز گالریا', image: shandiz_image, logo: shandiz_logo,
                        rate: 3.4, distance: 3, time: 35, tags: ['ایرانی ', 'سنتی', 'فست فود', 'ملل']
                    },
                    {
                        name: 'رستوران شاندیز گالریا', image: shandiz_image, logo: shandiz_logo, rate: 3.4, distance: 3, time: 35,
                        tags: ['ایرانی ', 'سنتی', 'فست فود', 'ملل']
                    }
                ]
            },
            {
                type: 'Slider',
                name: 'نزدیک ترین ها به شما',
                items: [
                    {
                        name: 'رستوران شاندیز گالریا', image: shandiz_image, logo: shandiz_logo, rate: 3.4, distance: 3, time: 35,
                        tags: ['ایرانی ', 'سنتی', 'فست فود', 'ملل']
                    },
                    {
                        name: 'رستوران شاندیز گالریا', image: shandiz_image, logo: shandiz_logo, rate: 3.4, distance: 3, time: 35,
                        tags: ['ایرانی ', 'سنتی', 'فست فود', 'ملل']
                    },
                    {
                        name: 'رستوران شاندیز گالریا', image: shandiz_image, logo: shandiz_logo, rate: 3.4, distance: 3, time: 35,
                        tags: ['ایرانی ', 'سنتی', 'فست فود', 'ملل']
                    }
                ]
            },
            {
                type: 'Slider', name: 'غذا های تخفیف دار', cardSize: { width: 160 },
                header: { maxDiscount: 15, endDate: new Date().getTime() + (6 * 60 * 60 * 1000) },
                items: [
                    {
                        name: 'پاستا آلفردو ', shopName: 'رستوران شاندیز گالریا', rate: 3.4,
                        price: 210000, discount: 15, image: pasta_alferedo, tags: [], id: '4232'
                    },
                    {
                        name: 'پاستا آلفردو ', shopName: 'رستوران شاندیز گالریا', rate: 3.4, id: '423rwe',
                        price: 210000, discount: 15, image: pasta_alferedo, tags: []
                    },
                    {
                        name: 'پاستا آلفردو ', shopName: 'رستوران شاندیز گالریا', rate: 3.4, id: '423456452',
                        price: 210000, discount: 15, image: pasta_alferedo, tags: []
                    },
                    {
                        name: 'پاستا آلفردو ', shopName: 'رستوران شاندیز گالریا', rate: 3.4, id: '42354232',
                        price: 210000, discount: 15, image: pasta_alferedo, tags: []
                    }
                ]
            },
            {
                type: 'Slider', name: 'جدید ترین رزروی ها',
                items: [
                    {
                        name: 'رستوران قایم', distance: 3, rate: 3.4, logo: ghaem_logo, image: ghaem_image,
                        details: [
                            { title: 'نوع میز', value: 'میز و آلاچیق' },
                            { title: 'مدت زمان تاخیر', value: '15 دقیقه' },
                            { title: 'قابلیت مراسم', value: 'تولد و VIP' }
                        ],
                        tags: ['ایرانی', 'فست فود', 'ملل', 'قلیان', 'موسیقی زنده']
                    },
                    {
                        name: 'رستوران قایم', distance: 3, rate: 3.4, logo: ghaem_logo, image: ghaem_image,
                        details: [
                            { title: 'نوع میز', value: 'میز و آلاچیق' },
                            { title: 'مدت زمان تاخیر', value: '15 دقیقه' },
                            { title: 'قابلیت مراسم', value: 'تولد و VIP' }
                        ],
                        tags: ['ایرانی', 'فست فود', 'ملل', 'قلیان', 'موسیقی زنده']
                    },
                    {
                        name: 'رستوران قایم', distance: 3, rate: 3.4, logo: ghaem_logo, image: ghaem_image,
                        details: [
                            { title: 'نوع میز', value: 'میز و آلاچیق' },
                            { title: 'مدت زمان تاخیر', value: '15 دقیقه' },
                            { title: 'قابلیت مراسم', value: 'تولد و VIP' }
                        ],
                        tags: ['ایرانی', 'فست فود', 'ملل', 'قلیان', 'موسیقی زنده']
                    },
                    {
                        name: 'رستوران قایم', distance: 3, rate: 3.4, logo: ghaem_logo, image: ghaem_image,
                        details: [
                            { title: 'نوع میز', value: 'میز و آلاچیق' },
                            { title: 'مدت زمان تاخیر', value: '15 دقیقه' },
                            { title: 'قابلیت مراسم', value: 'تولد و VIP' }
                        ],
                        tags: ['ایرانی', 'فست فود', 'ملل', 'قلیان', 'موسیقی زنده']
                    },
                    {
                        name: 'رستوران قایم', distance: 3, rate: 3.4, logo: ghaem_logo, image: ghaem_image,
                        details: [
                            { title: 'نوع میز', value: 'میز و آلاچیق' },
                            { title: 'مدت زمان تاخیر', value: '15 دقیقه' },
                            { title: 'قابلیت مراسم', value: 'تولد و VIP' }
                        ],
                        tags: ['ایرانی', 'فست فود', 'ملل', 'قلیان', 'موسیقی زنده']
                    }
                ]
            }
        ]
        return result
    }
    
}