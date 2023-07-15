import Axios from 'axios';
import frame210 from './images/Frame 210.png';
import cat_irani_src from './images/cat-irani.png';
import cat_sobhane_src from './images/cat-sobhane.png';
import cat_ajil_src from './images/cat-ajil.png';
import cat_abmive_src from './images/cat-abmive.png';
import cat_saladbar_src from './images/cat-saladbar.png';
import cat_fastfood_src from './images/cat-fastfood.png';
import cat_kafe_src from './images/cat-kafe.png';
import cat_shirini_src from './images/cat-shirini.png';
import shandiz_logo from './images/shandiz_logo.png';
import shandiz_image from './images/shandiz_image.png';
import pasta_alferedo from './images/pasta_alferedo.png';
import ghaem_image from './images/ghaem_image.png';
import ghaem_logo from './images/ghaem_logo.png';

export function getResponse({getState}){
    //let baseUrl = 'https://localhost:7203/api'
     let baseUrl = 'https://iranfoodguide.ir/api'
    let {mockStorage} = getState();
    let mock = !!mockStorage;
    /**********************restoran data model**************************************** */
    //name: String,image: String,logo: String,latitude: Number,longitude: Number,startTime:0,endTime:0,
    //address: '',ifRate: 0,ifComment: '',tags: [{name:String,id:Any},...],phone: '',
    /************************************************************** */
    /**********************restoran_tags data model**************************************** */
    //name: '',id: ''
    /************************************************************** */
    
    return {
        //در یافت لیست تگ های رستوران و تگ های غذا بسته به تایپ ورودی
        async get_tags({ type }) {
            //if (mock) { return { mock: true } }
            let url;
            if (type === 'restoran') { url = `${baseUrl}/ResType/Search`; }
            else if (type === 'food') { url = `${baseUrl}/FoodType/Search` }
            let body;
            if (type === 'restoran') { body = {}; }
            else if (type === 'food') { body = {}; }
            let response = await Axios.post(url, body);
            let data = response.data.data.items
            let result = data.map((o) => {
                return {
                    name: o.title, //String نام تگ
                    id: o.id, //String آی دی تگ
                }
            });
            return { response, result };
        },
        async add_tag({ type, tagName }) {
            //if (mock) { return { mock: true } }
            let url;
            if (type === 'restoran') { url = `${baseUrl}/ResType/Create`; }
            else if (type === 'food') { url = `${baseUrl}/FoodType/Create` }
            let body;
            if (type === 'restoran') {
                body = {
                    "title": tagName,
                    "latinTitle": tagName
                };
            }
            else if (type === 'food') {
                body = {
                    "title": tagName,
                    "latinTitle": tagName
                };
            }
            let response = await Axios.post(url, body);
            let newTagId = response.data.data
            let result = {id:newTagId};
            return { response, result };
        },
        async remove_tag({ type, tagId }) {
            //if (mock) { return { mock: true } }
            let url;
            if (type === 'restoran') { url = `${baseUrl}/ResType?Id=${tagId.toString()}`; }
            else if (type === 'food') { url = `${baseUrl}/FoodType?Id=${tagId.toString()}` }
            let response = await Axios.delete(url);
            return { response, result: true }
        },
        async get_restorans() {
            //if (mock) { return { mock: true } }
            let url = `${baseUrl}/Restaurant/Search`;
            let body = {
                // "PageNumber":pageSize,
                //"RecordsPerPage":pageNumber
            }
            let response = await Axios.post(url,body);
            let data = response.data.data.items
            let result=data;
            result = data.map((o)=>{
                let {address,types,workingTimes = {}} = o;
                if(!types || types === null){types = []}
                return {
                    id:o.id, //String آی دی رستوران
                    name:o.title, //String نام رستوران
                    latitude:address.latitude, //Number موقعیت رستوران در راستای لتیتیود
                    longitude:address.longitude, //Number موقعیت رستوران در راستای لانگیتیود
                    phone:address.phoneNumber,//String تلفن رستوران
                    image:o.image, //String یو آر ال تصویر رستوران
                    logo:o.logo, //String یو آر ال لوگوی رستوران
                    address:o.address.address, //String آدرس رستوران
                    deliveryTime:o.deliveryTime, //Number مدت زمان ارسال به دقیقه
                    tags:types.map((t)=>t.typeId), //ArrayOfStrings آرایه ای از آی دی تگ های رستوران
                    startTime:workingTimes[0].startTime, //Number bewtween (1 and 24) زمان شروع به کار
                    endTime:workingTimes[0].endTime, //Number bewtween (1 and 24) زمان پایان کار
                }
            })
            return { response, result }
        },
        async add_restoran(restoran) {
            //if (mock) { return { mock: true } }
            //parameters
            //restoran آبجکت رستوران برای افزودن
            // این آبجکت به شکل زیر است
            // {
            //     name:String, نام رستوران
            //     latitude:Number, موقعیت رستوران در راستای لتیتیود
            //     longitude:Number, موقعیت رستوران در راستای لانگیتیود
            //     address:String, آدرس رستوران
            //     phone:String, تلفن رستوران
            //     deliveryTime:Number, مدت زمان ارسال به دقیقه
            //     tags:ArrayOfStrings,آرایه ای از آی دی تگ های رستوران
            //     startTime:Number bewtween (1 and 24) زمان شروع به کار
            //     endTime:Number bewtween (1 and 24) زمان پایان کار
            //     tags:Array of ids آرایه ای از تگ های رستوران
            // }
            let body = {
                "Title": restoran.name,
                "LatinTitle": restoran.name,
                "Tax": restoran.tax,
                "DeliveryTime": restoran.deliveryTime,
                "address": {
                    "fullAddress": restoran.address,
                    "latitude": restoran.latitude,
                    "longitude": restoran.longitude,
                    "phoneNumber":restoran.phone
                },
                "phoneNumbers": [
                    {
                        "Title": restoran.name,
                        "phoneNumber": restoran.phone,
                    }],
                "workingTimes": [
                    {
                        "startTime": restoran.startTime,// "12:00",
                        "endTime": restoran.endTime,
                        "applyChangeTime": "12:00"
                    }
                ],
                "types": restoran.tags.map((o)=>{return {typeId:o}})
            }

            //دریافت ریسپانس
            let response = await Axios.post(`${baseUrl}/Restaurant/Create`, body);
            //دریافت آی دی تگ اضافه شده از روی ریسپانس
            let id = response.data.data
            return { response, result: { id } }
        },
        async edit_restoran(restoran) {
            //if (mock) { return { mock: true } }
            let method;
            method = "put";
            let url = `${baseUrl}/Restaurant/Edit`;
            //بادی متد پست (any | undefined)
            let body;
            body = {
                "id":restoran.id,
                "Title": restoran.name,
                "LatinTitle": restoran.name,
                "Id":restoran.id,
                "Tax": restoran.tax,
                "DeliveryTime": restoran.deliveryTime,
                "address": {
                    "fullAddress": restoran.address,
                    "latitude": restoran.latitude,
                    "longitude": restoran.longitude,
                    "phoneNumber":restoran.phone
                },
                "phoneNumbers": [
                    {
                        "Title": restoran.name,
                        "phoneNumber": restoran.phone,
                    }
                ],
                "workingTimes": [
                    {
                        "startTime": restoran.startTime,// "12:00",
                        "endTime": restoran.endTime,
                        "applyChangeTime": "12:00"
                    }
                ],
                "types": restoran.tags.map((o)=>{return {typeId:o}})
            }
            //دریافت ریسپانس
            let response = await Axios[method](url, body);

            //دریافت ریسپانس
            return { response, result: true }
        },
        async remove_restoran(restoranId) {
            //if (mock) { return { mock: true } }
            let url = `${baseUrl}/Restaurant?Id=${restoranId.toString()}`; 
            let response = await Axios.delete(url);
            return { response, result: true }
        },
        async get_restoran_foods(restoranId) {
            if (mock) { return { mock: true } }
            let url = `${baseUrl}/Menu/Search`;
            let body = {"RestaurantId": restoranId}
            let response = await Axios.post(url,body);
            let result = response.data.data.items.FoodCategories;
            //مپ کردن دیتای سرور به دیتای فرانت
            //let result = [];
            // result = data.map((o)=>{
            //     return {
            //       id:<...>, //String آی دی غذا
            //       name:<...>, //String نام غذا
            //       image:<...>, //String یو آر ال تصویر غذا
            //       price:<...>, //Number قیمت غذا
            //       discountPercent:<...>, //Number درصد تخفیف غذا
            //       description:<...>, //String توضیحات مختصر در مورد غذا
            //       review:<...>, //String توضیحات مفصل در مورد غذا
            //       categories:<...> //Array آرایه ای از آی دی های دسته بندی
            //     }
            // })
            return { response, result }
        },
        async add_food({ restoranId, food }) {
            if (mock) { return { mock: true } }
            //restoranId => آی دی رستوران
            //food => آبجکت غذا برای افزودن
            //آبجکت غذا مانند زیر است
            // {
            //     name:String, نام غذا
            //     parentId:String, آی دی غذایی که این غذا زیر مجموعه ی آن است 
            //     image:String, یو آر ال تصویر غذا
            //     price:Number قیمت غذا
            //     discountPercent:درصد تخفیف غذا
            //     description:String توضیحات مختصر در مورد غذا
            //     review:String توضیحات مفصل در مورد غذا
            //     categories:Array آرایه ای از آی دی های دسته بندی
            // }


            let url = `${baseUrl}/RestaurantFood/Create`;

            let body = {
               // "id": 0,
                "title": food.name,
                "food": {
                  //"id": 0,
                  "types":food.categories,
                  "title":  food.name,
                  "latinTitle":  food.name,
                  "description":food.description
                },
                "restaurantId": restoranId,
                "price": food.price,
                "description": food.description,
                //"inventoryCount": 0,
                "isFavorite": true,
                "discount":food.discountPercent
              }
           
            //نوع درخواست ("get" | "post")
            let method;
            method ="post"
            //بادی متد پست (any | undefined)
            //body = <...>

            //دریافت ریسپانس
            let response = await Axios[method](url, body);
            let result = response.data.data.items.FoodCategories;
            //دریافت آی دی غذای اضافه شده از روی ریسپانس
            let id = response.data;
            //id = <...>

            return { response, result:{id} }
        },
        async edit_food({ restoranId, food }) {
            if (mock) { return { mock: true } }
            //restoranId => آی دی رستوران
            //food => آبجکت غذا برای ویرایش
            //آبجکت غذا مانند زیر است
            // {
            //     id:String, آی دی غذا
            //     parentId:String, آی دی غذایی که این غذا زیر مجموعه ی آن است 
            //     menuCategory:String, نام دسته بندی منو برای تفکیک غذا ها در یو آی
            //     name:String, نام غذا
            //     image:String, یو آر ال تصویر غذا
            //     price:Number قیمت غذا
            //     discountPercent:درصد تخفیف غذا
            //     description:String توضیحات مختصر در مورد غذا
            //     review:String توضیحات مفصل در مورد غذا
            // }

            let url = `${baseUrl}/RestaurantFood/Edit`; 
            let body = {
                "id": food.id,
                "title": food.name,
                "food": {
                //"id": 0,
                "types":food.categories,
                "title":  food.name,
                "latinTitle":  food.name,
                "description":food.description
                },
                "restaurantId": restoranId,
                "price": food.price,
                "description": food.description,
                //"inventoryCount": 0,
                "isFavorite": true,
                "discount":food.discountPercent
            }
            let response = await Axios.post(url, body);
            return { response, result: true }
        },
        async remove_food({ restoranId, foodId }) {
            if (mock) { return { mock: true } }
            // parameters
            //restoranId آی دی رستورانی که یک غذا از آن باید حذف بشود
            //foodId آی دی غذایی که باید حذف شود
            let url = `${baseUrl}/RestaurantFood?Id=${foodId.toString()}`; 
            let response = await Axios.delete(url);
            return { response, result: true }
        },
        //ویرایش تصویر غذا
        async edit_food_image({ restoranId, foodId, imageFile }) {
            if (mock) { return { mock: true } }
            //parameters
            //restoranId  آی دی رستوران
            //foodId آی دی غذا
            //imageFile فایل انتخاب شده ی کاربر ادمین برای این غذا

            let url=`${baseUrl}/RestaurantFood/AddLogoImage`; 
            let method;
            //method = <...>;

            //بادی متد پست (any | undefined)
            let body;
            //body = <...>

            //دریافت ریسپانس
            let response = await Axios[method](url, body);
            return { response, result: true }
        },
        //ویرایش تصویر رستوران
        async edit_restoran_image({ restoranId,imageUrl,imageFile }) {
            //if (mock) { return { mock: true } }
            //parameters
            //restoranId  آی دی رستوران
            //imageUrl فایل انتخاب شده ی کاربر ادمین برای تصویر این رستوران
            //آدرس درخواست 
            let url=`${baseUrl}/RestaurantImage/AdImageOfRestaurant?RestaurantId=${restoranId}&Title=${imageFile.name}`; 

            //بادی متد پست (any | undefined)
            let body = {imageFile:imageUrl};
            
            //دریافت ریسپانس
            let response = await Axios.post(url, body);
            return { response, result: true }
        },
        //ویرایش لوگوی رستوران
        async edit_restoran_logo({ restoranId, imageFile }) {
            if (mock) { return { mock: true } }
            //parameters
            //restoranId  آی دی رستوران
            //imageFile فایل انتخاب شده ی کاربر ادمین برای لوگوی این رستوران
            //آدرس درخواست 
            let url=`${baseUrl}/RestaurantImage/AddLogoImage`; 
            //نوع درخواست ("get" | "post")
            let method;
            //method = <...>;
            //بادی متد پست (any | undefined)
            let body;
            //body = <...>
            //دریافت ریسپانس
            let response = await Axios[method](url, body);
            return { response, result: true }
        },
        async setProfile({ profile,mobile, registered }) {
            let url = `${baseUrl}/People/${registered?'UpdateProfile':'CreateProfile'}`
            let body = {
                "Id":profile.id,
                "firstName": profile.firstName,//نام
                "lastName": profile.lastName,
                "email": profile.email,
                "sheba": profile.sheba,
                "mobileNumbers": [
                    {
                        "mobileNumber": profile.mobile,
                        "isDefault": true
                    }
                ]
            }
            let response = await Axios.post(url,body);
            return {response}
        },
        async getProfile() {
            return {mock:true}
            let {personId} = getState();
            let url = `${baseUrl}/People/search`
            let body = {"Id":personId}
            let response = await Axios.post(url,body);
            let result = response.data.data.items[0]
            return {response,result}
        },
        async getAddresses(){//لیست آدرس ها
            return {mock:true}
            let {personId} = getState();
            let url = `${baseUrl}/People/GetPeopleAddress`
            let body = {
                "PersonId":personId
            }
            let response = await Axios.post(url,body);

            let result=response.data.data.map((o)=>
            {
                    return {
                        title: o.title,
                        address: o.address,
                        number: 30,
                        unit: 4,
                        floor: 2,
                        id: o.id,
                        description: o.description,
                        phone: o.phoneNumber
                    }
            });
            // let result = [                
            //     {
            //         title: 'خانه',
            //         address: 'تهران شیخ بهایی شمالی نوربخش',
            //         number: 30,
            //         unit: 4,
            //         floor: 2,
            //         id: '0',
            //         description: '',
            //         phone: '02188050006'
            //     }
            // ];
            return {response,result}
        },
        async takhfif_ha() {
            return {mock:true}
            let {personId} = getState();
            let url = `${baseUrl}/PersonDiscount/Search`;
            let body = {"PersonId": personId}
            let response = await Axios.post(url,body);
            let result = response.data.data.items;
            return {response,result};
        },
        async addressForm({ address, type}) {
            let {personId} = getState();
            if (type === 'add') {
                let url = `${baseUrl}/People/CreatePeopleAddress`;
                let body = {
                    "personId": personId,
                    "address": {
                      "fullAddress": address.address,
                      "latitude": address.latitude,
                      "longitude": address.longitude,
                      "phoneNumber": address.phone
                    },
                    "title": address.title
                }
                let response = await Axios.post(url,body);
                return {response}
            }
            else { 

            }
        },
        async safheye_sefaresh() {
            return {mock:true}
            let url = `${baseUrl}/PageLayout/GetListOfFoodDelivery`;
            let body = {};
            let response = await Axios.post(url,body);
            let result = response.data.data;
            return {response,result};
        },
        async restoran_haye_mahboob() {
            let {personId} = getState();
            let url = `${baseUrl}/RestaurantFavoruite/search`
            let body = {"PersonId":personId}
            let response = await Axios.post(url,body);
            let result = response.data.data.items;
            return {response,result}
        },
        async mojoodiye_kife_pool() {
            return {mock:true}
        },
        async tarikhcheye_kife_pool() {
           return {mock:true} 
        },
        async restoran_sort_options(){
            return {mock:true}
        },
        async jostojooye_restoran({pageSize,pageNumber,selectedCategories,selectedSort,searchValue}){
            //pageSize تعداد ریزالت در هر صفحه
            //pageNumber شماره صفحه
            //selectedCategories لیست تگ های انتخاب شده برای سرچ توسط کاربر
            //selectedSort مرتب سازی انتخابی کاربر
            //searchValue متن سرچ شده توسط کاربر
            return {mock:true}
        },
        async tarikhche_ye_jostojoo(){
            return {mock:true} 
        },
        async hazfe_tarikhche_ye_jostojoo(){
            return {mock:true} 
        },
        // async restoran_menu(restaurantId){
        //     let url = `${baseUrl}/Menu/Search`;
        //     let body = {"RestaurantId": restaurantId}
        //     let response = await Axios.post(url,body);
        //     let result = response.data.data.items.FoodCategories;
        //     return {response,result};

        //     // return {mock:true}
        // },
        async restoran_comments({id,pageSize,pageNumber}){
            //id => آی دی رستوران
            //pageSize => تعداد کامنت صفحه
            //pageNumber => شماره صفحه کامنت

            let url = `${baseUrl}/FeedBack/GetRestaurantComments`;
            let body = {
                "RestaurantId": id,
                "PageNumber":pageSize,
                "RecordsPerPage":pageNumber
            }
            let response = await Axios.post(url,body);
            let result = response.data.data.items;
            return {response,result};

            return {mock:true}
        },
        async restoran_coupons(restaurantId){

            let url = `${baseUrl}/RestaurantDiscount/Search`;
            let body = {"RestaurantId": restaurantId}
            let response = await Axios.post(url,body);
            let result = response.data.data.items;
            return {response,result};

            // return {mock:true}
        }
    }
}

export function getMock({helper,getState}){
    let {mockStorage} = getState();
    return {
        get_tags({ type }) {
            let res = mockStorage.load({ name: `${type}Tags`, def: [] })
            return res
        },
        add_tag({ type, tagName }) {
            let tags = mockStorage.load({ name: `${type}Tags`, def: [] })
            let id = Math.round(Math.random() * 1000000)
            tags.push({ name: tagName, id });
            mockStorage.save({ name: `${type}Tags`, value: tags })
            return { id }
        },
        edit_tag({ type, tagId, tagName }) {
            let tags = mockStorage.load({ name: `${type}Tags`, def: [] })
            tags = tags.map((o) => {
                return o.id === tagId ? { id: tagId, name: tagName } : o;
            })
            mockStorage.save({ name: `${type}Tags`, value: tags })
            return true
        },
        remove_tag({ type, tagId }) {
            let tags = mockStorage.load({ name: `${type}Tags`, def: [] })
            tags = tags.filter((o) => {
                return o.id !== tagId;
            })
            mockStorage.save({ name: `${type}Tags`, value: tags })
            return true
        },
        get_restorans() {
            let res = mockStorage.load({ name: 'restorans', def: [] })
            return res;
        },
        add_restoran(newRestoran) {
            let restorans = mockStorage.load({ name: 'restorans', def: [] });
            let id = 'res' + Math.round(Math.random() * 1000000);
            newRestoran = { ...newRestoran, id }
            let newRestorans = [newRestoran, ...restorans];
            mockStorage.save({ name: 'restorans', value: newRestorans })
            return { id };
        },
        edit_restoran(restoran) {
            let restorans = mockStorage.load({ name: 'restorans', def: [] });
            restorans = restorans.map((o) => {
                if (o.id === restoran.id) { return restoran }
                return o
            })
            mockStorage.save({ name: 'restorans', value: restorans })
            return true;
        },
        remove_restoran(restoranId) {
            let restorans = mockStorage.load({ name: 'restorans', def: [] });
            restorans = restorans.filter((o) => {
                if (o.id === restoranId) { return false }
                return o
            })
            mockStorage.save({ name: 'restorans', value: restorans })
            return true;
        },
        get_restoran_foods(restoranId) {
            let foods = mockStorage.load({ name: `restoran_${restoranId}_menu`, def: [] });
            return foods
        },
        add_food({ restoranId, food }) {
            let foods = mockStorage.load({ name: `restoran_${restoranId}_menu`, def: [] });
            let id = 'food' + Math.round(Math.random() * 1000000);
            let newFood = { ...food, id }
            let newFoods = [newFood, ...foods];
            mockStorage.save({ name: `restoran_${restoranId}_menu`, value: newFoods });
            return { id };
        },
        edit_food({ restoranId, food }) {
            let foods = mockStorage.load({ name: `restoran_${restoranId}_menu`, def: [] });
            let newFood = { ...food }
            let newFoods = foods.map((o) => o.id === newFood.id ? newFood : o);
            mockStorage.save({ name: `restoran_${restoranId}_menu`, value: newFoods });
            return true;
        },
        remove_food({ restoranId, foodId }) {
            let foods = mockStorage.load({ name: `restoran_${restoranId}_menu`, def: [] });
            let newFoods = foods.filter((o) => o.id !== foodId);
            mockStorage.save({ name: `restoran_${restoranId}_menu`, value: newFoods });
            return true;
        },
        edit_food_image({ foodId, imageUrl }) {
            mockStorage.save({ name: `food_${foodId}_image`, value: imageUrl });
            return true;
        },
        edit_restoran_image({ restoranId, imageUrl }) {
            mockStorage.save({ name: `restoran_${restoranId}_image`, value: imageUrl });
            return true;
        },
        edit_restoran_logo({ restoranId, imageUrl }) {
            mockStorage.save({ name: `restoran_${restoranId}_logo`, value: imageUrl });
            return true;
        },
        getAddresses(){
            return [//لیست آدرس ها
                {
                    title: 'خانه',
                    address: 'تهران شیخ بهایی شمالی نوربخش',
                    number: 30,
                    unit: 4,
                    floor: 2,
                    id: '0',
                    description: '',
                    phone: '02188050006',
                    latitude:35.760528,
                    longitude:51.394777
                }
            ]
        },
        getProfile() {
            return {
                firstName: 'احمد',//نام
                lastName: 'بهرامی',//نام خانوادگی
                mobile: '09123534314',//شماره همراه
                email: 'feiz.ms@gmail.com',//آدرس ایمیل
                sheba: '1234567',//شماره شبا
            }
        },
        takhfif_ha(res) {
            return [
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
        },
        safheye_sefaresh(res) {
            return [
                {
                    type: 'Billboard',
                    items: [{src: frame210},{src: frame210},{src: frame210},{src: frame210}]
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
                            name: 'رستوران شاندیز گالریا',image: shandiz_image,logo: shandiz_logo,
                            rate: 3.4,distance: 3,time: 35,tags: ['ایرانی ', 'سنتی', 'فست فود', 'ملل']
                        },
                        {
                            name: 'رستوران شاندیز گالریا',image: shandiz_image,logo: shandiz_logo,
                            rate: 3.4,distance: 3,time: 35,tags: ['ایرانی ', 'سنتی', 'فست فود', 'ملل']
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
                    type: 'Slider',name: 'غذا های تخفیف دار',cardSize: { width: 160 },
                    header: {maxDiscount: 15,endDate: new Date().getTime() + (6 * 60 * 60 * 1000)},
                    items: [
                        {
                            name: 'پاستا آلفردو ', shopName: 'رستوران شاندیز گالریا', rate: 3.4,
                            price: 210000, discount: 15, image: pasta_alferedo, tags: [],id:'4232'
                        },
                        {
                            name: 'پاستا آلفردو ', shopName: 'رستوران شاندیز گالریا', rate: 3.4,id:'423rwe',
                            price: 210000, discount: 15, image: pasta_alferedo, tags: []
                        },
                        {
                            name: 'پاستا آلفردو ', shopName: 'رستوران شاندیز گالریا', rate: 3.4,id:'423456452',
                            price: 210000, discount: 15, image: pasta_alferedo, tags: []
                        },
                        {
                            name: 'پاستا آلفردو ', shopName: 'رستوران شاندیز گالریا', rate: 3.4,id:'42354232',
                            price: 210000, discount: 15, image: pasta_alferedo, tags: []
                        }
                    ]
                },
                {
                    type: 'Slider',name: 'جدید ترین رزروی ها',
                    items: [
                        {
                            name: 'رستوران قایم', distance: 3, rate: 3.4, logo: ghaem_logo, image: ghaem_image,
                            details: [
                                {title: 'نوع میز',value: 'میز و آلاچیق'},
                                {title: 'مدت زمان تاخیر',value: '15 دقیقه'},
                                {title: 'قابلیت مراسم',value: 'تولد و VIP'}
                            ],
                            tags: ['ایرانی', 'فست فود', 'ملل', 'قلیان', 'موسیقی زنده']
                        },
                        {
                            name: 'رستوران قایم', distance: 3, rate: 3.4, logo: ghaem_logo, image: ghaem_image,
                            details: [
                                {title: 'نوع میز',value: 'میز و آلاچیق'},
                                {title: 'مدت زمان تاخیر',value: '15 دقیقه'},
                                {title: 'قابلیت مراسم',value: 'تولد و VIP'}
                            ],
                            tags: ['ایرانی', 'فست فود', 'ملل', 'قلیان', 'موسیقی زنده']
                        },
                        {
                            name: 'رستوران قایم', distance: 3, rate: 3.4, logo: ghaem_logo, image: ghaem_image,
                            details: [
                                {title: 'نوع میز',value: 'میز و آلاچیق'},
                                {title: 'مدت زمان تاخیر',value: '15 دقیقه'},
                                {title: 'قابلیت مراسم',value: 'تولد و VIP'}
                            ],
                            tags: ['ایرانی', 'فست فود', 'ملل', 'قلیان', 'موسیقی زنده']
                        },
                        {
                            name: 'رستوران قایم', distance: 3, rate: 3.4, logo: ghaem_logo, image: ghaem_image,
                            details: [
                                {title: 'نوع میز',value: 'میز و آلاچیق'},
                                {title: 'مدت زمان تاخیر',value: '15 دقیقه'},
                                {title: 'قابلیت مراسم',value: 'تولد و VIP'}
                            ],
                            tags: ['ایرانی', 'فست فود', 'ملل', 'قلیان', 'موسیقی زنده']
                        },
                        {
                            name: 'رستوران قایم', distance: 3, rate: 3.4, logo: ghaem_logo, image: ghaem_image,
                            details: [
                                {title: 'نوع میز',value: 'میز و آلاچیق'},
                                {title: 'مدت زمان تاخیر',value: '15 دقیقه'},
                                {title: 'قابلیت مراسم',value: 'تولد و VIP'}
                            ],
                            tags: ['ایرانی', 'فست فود', 'ملل', 'قلیان', 'موسیقی زنده']
                        }
                    ]
                }
            ]
        },
        restoran_haye_mahboob() {
            return [
                {
                    name: 'رستوران شاندیز گالریا',
                    image: shandiz_image,
                    logo: shandiz_logo,
                    rate: 3.4,
                    distance: 3,
                    time: 35,
                    tags: ['ایرانی ', 'سنتی', 'فست فود', 'ملل']
                }
            ]
        },
        mojoodiye_kife_pool() {
            return 123245666
        },
        tarikhcheye_kife_pool() {
            let data = [
                { date: new Date().getTime(), amount: '123456789', type: 'in' },
                { date: new Date().getTime(), amount: '123456789', type: 'out' },
                { date: new Date().getTime(), amount: '123456789', type: 'in' },
                { date: new Date().getTime(), amount: '123456789', type: 'out' },
                { date: new Date().getTime(), amount: '123456789', type: 'in' },
            ]
            return data.map((o) => {
                let { date, time } = helper.getDateAndTime(o.date)
                return { ...o, date, time }
            })
        },
        restoran_sort_options(){
            return [
                {text:'رستوران اقتصادی',value:'0'},
                {text:'بالاترین امتیاز ',value:'1'},
                {text:'نزدیک ترین ',value:'2'},
                {text:'جدیدترین',value:'3'},
                {text:'تایید شده در ایران فود',value:'4'},
                {text:'گرانترین',value:'5'}
            ]
        },
        jostojooye_restoran({pageSize,pageNumber,selectedCategories,selectedSort,searchValue}){
            let restorans = mockStorage.load({name:'restorans',def:[]})
            return restorans

        },
        tarikhche_ye_jostojoo(){
            return ['برگر','پیتزا','پاستا'] 
        },
        hazfe_tarikhche_ye_jostojoo(){
            return true 
        },
        // restoran_menu(){
        //     return [
        //         {
        //             name:'کباب',
        //             image:undefined,
        //             items:[
        //                 {
        //                     id:'534534',
        //                     name: 'کباب کوبیده یک سیخ', rate: 3.4,
        //                     price: 60000, discountPercent: 10, image: pasta_alferedo, tags: ['کبابی','ایرانی'],
        //                     description:'150 گرم گوشت مخلوط گوسفندی و گوساله',
        //                     items:[
        //                         {
        //                             rates:[
        //                                 {text:'کیفیت',value:4},
        //                                 {text:'حجم',value:3},
        //                                 {text:'سلامت',value:5}
        //                             ],
        //                             details:[
        //                                 ['نوع برنج','ایرانی'],
        //                                 ['نوع گوشت','گوساله']
        //                             ],
        //                             commentsLength:24,
        //                             review:'این غذا خیلی غذای خوبی است . برای مشکل پسندان صو در صو پیشنهاد میشه . در این غذا ار مرغوب ترین متریال موجود در بازار استفاده شده است',
        //                             id:'456473456',
        //                             name: 'کباب لقمه زیر مجموعه 1', rate: 3.4,
        //                             price: 60000, discountPercent: 10, image: pasta_alferedo, tags: ['کبابی','ایرانی'],
        //                             description:'150 گرم گوشت مخلوط گوسفندی و گوساله'
        //                         },
        //                         {
        //                             rates:[
        //                                 {text:'کیفیت',value:4},
        //                                 {text:'حجم',value:3},
        //                                 {text:'سلامت',value:5}
        //                             ],
        //                             details:[
        //                                 ['نوع برنج','ایرانی'],
        //                                 ['نوع گوشت','گوساله']
        //                             ],
        //                             commentsLength:24,
        //                             review:'این غذا خیلی غذای خوبی است . برای مشکل پسندان صو در صو پیشنهاد میشه . در این غذا ار مرغوب ترین متریال موجود در بازار استفاده شده است',
        //                             id:'64557865654346',
        //                             name: 'کباب لقمه زیر مجموعه 2', rate: 3.4,
        //                             price: 60000, discountPercent: 10, image: pasta_alferedo, tags: ['کبابی','ایرانی'],
        //                             description:'150 گرم گوشت مخلوط گوسفندی و گوساله'
        //                         },
        //                         {
        //                             rates:[
        //                                 {text:'کیفیت',value:4},
        //                                 {text:'حجم',value:3},
        //                                 {text:'سلامت',value:5}
        //                             ],
        //                             details:[
        //                                 ['نوع برنج','ایرانی'],
        //                                 ['نوع گوشت','گوساله']
        //                             ],
        //                             commentsLength:24,
        //                             review:'این غذا خیلی غذای خوبی است . برای مشکل پسندان صو در صو پیشنهاد میشه . در این غذا ار مرغوب ترین متریال موجود در بازار استفاده شده است',
        //                             id:'6455458756878346',
        //                             name: 'کباب لقمه زیر مجموعه 3', rate: 3.4,
        //                             price: 60000, discountPercent: 10, image: pasta_alferedo, tags: ['کبابی','ایرانی'],
        //                             description:'150 گرم گوشت مخلوط گوسفندی و گوساله'
        //                         },
        //                         {
        //                             rates:[
        //                                 {text:'کیفیت',value:4},
        //                                 {text:'حجم',value:3},
        //                                 {text:'سلامت',value:5}
        //                             ],
        //                             details:[
        //                                 ['نوع برنج','ایرانی'],
        //                                 ['نوع گوشت','گوساله']
        //                             ],
        //                             commentsLength:24,
        //                             review:'این غذا خیلی غذای خوبی است . برای مشکل پسندان صو در صو پیشنهاد میشه . در این غذا ار مرغوب ترین متریال موجود در بازار استفاده شده است',
        //                             id:'75663464563',
        //                             name: 'کباب لقمه زیر مجموعه 4', rate: 3.4,
        //                             price: 60000, discountPercent: 10, image: pasta_alferedo, tags: ['کبابی','ایرانی'],
        //                             description:'150 گرم گوشت مخلوط گوسفندی و گوساله'
        //                         },      
        //                     ]
        //                 },
        //                 {
        //                     rates:[
        //                         {text:'کیفیت',value:4},
        //                         {text:'حجم',value:3},
        //                         {text:'سلامت',value:5}
        //                     ],
        //                     details:[
        //                         ['نوع برنج','ایرانی'],
        //                         ['نوع گوشت','گوساله']
        //                     ],
        //                     commentsLength:24,
        //                     review:'این غذا خیلی غذای خوبی است . برای مشکل پسندان صو در صو پیشنهاد میشه . در این غذا ار مرغوب ترین متریال موجود در بازار استفاده شده است',
        //                     id:'3453445',
        //                     name: 'کباب لقمه یک سیخ', rate: 3.4,
        //                     price: 70000, discountPercent: 10, image: pasta_alferedo, tags: ['کبابی','ایرانی'],
        //                     description:'200 گرم گوشت مخلوط گوسفندی و گوساله'
        //                 },
        //                 {
        //                     rates:[
        //                         {text:'کیفیت',value:4},
        //                         {text:'حجم',value:3},
        //                         {text:'سلامت',value:5}
        //                     ],
        //                     details:[
        //                         ['نوع برنج','ایرانی'],
        //                         ['نوع گوشت','گوساله']
        //                     ],
        //                     commentsLength:24,
        //                     review:'این غذا خیلی غذای خوبی است . برای مشکل پسندان صو در صو پیشنهاد میشه . در این غذا ار مرغوب ترین متریال موجود در بازار استفاده شده است',
        //                     id:'123433',
        //                     name: 'کباب کوبیده بناب یک سیخ', rate: 3.4,
        //                     price: 85000, discountPercent: 10, image: pasta_alferedo, tags: ['کبابی','ایرانی'],
        //                     description:'250 گرم گوشت مخلوط گوسفندی و گوساله'
        //                 },
        //                 {
        //                     rates:[
        //                         {text:'کیفیت',value:4},
        //                         {text:'حجم',value:3},
        //                         {text:'سلامت',value:5}
        //                     ],
        //                     details:[
        //                         ['نوع برنج','ایرانی'],
        //                         ['نوع گوشت','گوساله']
        //                     ],
        //                     commentsLength:24,
        //                     review:'این غذا خیلی غذای خوبی است . برای مشکل پسندان صو در صو پیشنهاد میشه . در این غذا ار مرغوب ترین متریال موجود در بازار استفاده شده است',
        //                     id:'647834',
        //                     name: 'کباب بختیاری یک سیخ', rate: 3.4,
        //                     price: 90000, discountPercent: 10, image: pasta_alferedo, tags: ['کبابی','ایرانی'],
        //                     description:'ترکیب 100 گرم کباب کوبیده مخلوط گوسفند و گوساله و 100 گرم جوجه کباب بدون استخوان در یک سیخ'
        //                 },
        //                 {
        //                     rates:[
        //                         {text:'کیفیت',value:4},
        //                         {text:'حجم',value:3},
        //                         {text:'سلامت',value:5}
        //                     ],
        //                     details:[
        //                         ['نوع برنج','ایرانی'],
        //                         ['نوع گوشت','گوساله']
        //                     ],
        //                     commentsLength:24,
        //                     review:'این غذا خیلی غذای خوبی است . برای مشکل پسندان صو در صو پیشنهاد میشه . در این غذا ار مرغوب ترین متریال موجود در بازار استفاده شده است',
        //                     id:'5346743',
        //                     name: 'کباب سلطانی دو سیخ', rate: 3.4,
        //                     price: 140000, discountPercent: 10, image: pasta_alferedo, tags: ['کبابی','ایرانی'],
        //                     description:'یک سیخ 100 گرمی کباب کوبیده مخلوط گوسفند و گوساله و یک سیخ 100 گرمی کباب برگ مخصوص گوسفندی'
        //                 },
        //                 {
        //                     rates:[
        //                         {text:'کیفیت',value:4},
        //                         {text:'حجم',value:3},
        //                         {text:'سلامت',value:5}
        //                     ],
        //                     details:[
        //                         ['نوع برنج','ایرانی'],
        //                         ['نوع گوشت','گوساله']
        //                     ],
        //                     commentsLength:24,
        //                     review:'این غذا خیلی غذای خوبی است . برای مشکل پسندان صو در صو پیشنهاد میشه . در این غذا ار مرغوب ترین متریال موجود در بازار استفاده شده است',
        //                     id:'6756343',
        //                     name: 'جوجه کباب با استخوان ران یک سیخ', rate: 3.4,
        //                     price: 90000, discountPercent: 10, image: pasta_alferedo, tags: ['کبابی','ایرانی'],
        //                     description:'یک سیخ 200 گرمی جوجه کباب ران'
        //                 },
        //                 {
        //                     rates:[
        //                         {text:'کیفیت',value:4},
        //                         {text:'حجم',value:3},
        //                         {text:'سلامت',value:5}
        //                     ],
        //                     details:[
        //                         ['نوع برنج','ایرانی'],
        //                         ['نوع گوشت','گوساله']
        //                     ],
        //                     commentsLength:24,
        //                     review:'این غذا خیلی غذای خوبی است . برای مشکل پسندان صو در صو پیشنهاد میشه . در این غذا ار مرغوب ترین متریال موجود در بازار استفاده شده است',
        //                     id:'8674674',
        //                     name: 'جوجه کباب بدون استخوان سینه یک سیخ', rate: 3.4,
        //                     price: 90000, discountPercent: 10, image: pasta_alferedo, tags: ['کبابی','ایرانی'],
        //                     description:'یک سیخ 200 گرمی جوجه کباب سینه'
        //                 },

        //             ]
        //         },
        //         {
        //             name:'ماهی',
        //             image:undefined,
        //             items:[
        //                 {
        //                     rates:[
        //                         {text:'کیفیت',value:4},
        //                         {text:'حجم',value:3},
        //                         {text:'سلامت',value:5}
        //                     ],
        //                     details:[
        //                         ['نوع برنج','ایرانی'],
        //                         ['نوع گوشت','گوساله']
        //                     ],
        //                     commentsLength:24,
        //                     review:'این غذا خیلی غذای خوبی است . برای مشکل پسندان صو در صو پیشنهاد میشه . در این غذا ار مرغوب ترین متریال موجود در بازار استفاده شده است',
        //                     id:'7567467',
        //                     name: 'ماهی قزل آلا', rate: 3.4,
        //                     price: 160000, discountPercent: 10, image: pasta_alferedo, tags: [],
        //                     description:'یک پرس ماهی قزل آلا 150 گرمی'
        //                 },
        //                 {
        //                     rateItems:[

        //                     ],id:'3453463',
        //                     name: 'ماهی سفید', rate: 3.4,
        //                     price: 140000, discountPercent: 10, image: pasta_alferedo, tags: [],
        //                     description:'یک پرس ماهی سفید 100 گرمی'
        //                 },
        //             ]
        //         },
        //         {
        //             name:'برنج ایرانی',
        //             image:undefined,
        //             items:[
        //                 {
        //                     rates:[
        //                         {text:'کیفیت',value:4},
        //                         {text:'حجم',value:3},
        //                         {text:'سلامت',value:5}
        //                     ],
        //                     details:[
        //                         ['نوع برنج','ایرانی'],
        //                         ['نوع گوشت','گوساله']
        //                     ],
        //                     commentsLength:24,
        //                     review:'این غذا خیلی غذای خوبی است . برای مشکل پسندان صو در صو پیشنهاد میشه . در این غذا ار مرغوب ترین متریال موجود در بازار استفاده شده است',
        //                     id:'63455344',
        //                     name: 'چلو کره ای ساده تک نفره', rate: 3.4,
        //                     price: 65000, discountPercent: 10, image: pasta_alferedo, tags: ['کبابی','ایرانی'],
        //                     description:'100 گرم چلو کره ساده'
        //                 },
        //                 {
        //                     rates:[
        //                         {text:'کیفیت',value:4},
        //                         {text:'حجم',value:3},
        //                         {text:'سلامت',value:5}
        //                     ],
        //                     details:[
        //                         ['نوع برنج','ایرانی'],
        //                         ['نوع گوشت','گوساله']
        //                     ],
        //                     commentsLength:24,
        //                     review:'این غذا خیلی غذای خوبی است . برای مشکل پسندان صو در صو پیشنهاد میشه . در این غذا ار مرغوب ترین متریال موجود در بازار استفاده شده است',
        //                     id:'6467863',
        //                     name: 'چلو کره ای ساده دو نفره', rate: 3.4,
        //                     price: 120000, discountPercent: 10, image: pasta_alferedo, tags: ['کبابی','ایرانی'],
        //                     description:'200 گرم چلو کره ساده'
        //                 },
        //                 {
        //                     rates:[
        //                         {text:'کیفیت',value:4},
        //                         {text:'حجم',value:3},
        //                         {text:'سلامت',value:5}
        //                     ],
        //                     details:[
        //                         ['نوع برنج','ایرانی'],
        //                         ['نوع گوشت','گوساله']
        //                     ],
        //                     commentsLength:24,
        //                     review:'این غذا خیلی غذای خوبی است . برای مشکل پسندان صو در صو پیشنهاد میشه . در این غذا ار مرغوب ترین متریال موجود در بازار استفاده شده است',
        //                     id:'645345',
        //                     name: 'چلو کره ای ساده چهار نفره', rate: 3.4,
        //                     price: 240000, discountPercent: 10, image: pasta_alferedo, tags: ['کبابی','ایرانی'],
        //                     description:'400 گرم چلو کره ساده'
        //                 },
        //                 {
        //                     rates:[
        //                         {text:'کیفیت',value:4},
        //                         {text:'حجم',value:3},
        //                         {text:'سلامت',value:5}
        //                     ],
        //                     details:[
        //                         ['نوع برنج','ایرانی'],
        //                         ['نوع گوشت','گوساله']
        //                     ],
        //                     commentsLength:24,
        //                     review:'این غذا خیلی غذای خوبی است . برای مشکل پسندان صو در صو پیشنهاد میشه . در این غذا ار مرغوب ترین متریال موجود در بازار استفاده شده است',
        //                     id:'345345',
        //                     name: 'چلو کره ای ته دیگی تک نفره', rate: 3.4,
        //                     price: 75000, discountPercent: 10, image: pasta_alferedo, tags: ['کبابی','ایرانی'],
        //                     description:'150 گرم چلو کره ته دیگی'
        //                 },
        //                 {
        //                     rates:[
        //                         {text:'کیفیت',value:4},
        //                         {text:'حجم',value:3},
        //                         {text:'سلامت',value:5}
        //                     ],
        //                     details:[
        //                         ['نوع برنج','ایرانی'],
        //                         ['نوع گوشت','گوساله']
        //                     ],
        //                     commentsLength:24,
        //                     review:'این غذا خیلی غذای خوبی است . برای مشکل پسندان صو در صو پیشنهاد میشه . در این غذا ار مرغوب ترین متریال موجود در بازار استفاده شده است',
        //                     id:'867674',
        //                     name: 'چلو کره ای ته دیگی دو نفره', rate: 3.4,
        //                     price: 140000, discountPercent: 10, image: pasta_alferedo, tags: ['کبابی','ایرانی'],
        //                     description:'300 گرم چلو کره ته دیگی'
        //                 },
        //                 {
        //                     rates:[
        //                         {text:'کیفیت',value:4},
        //                         {text:'حجم',value:3},
        //                         {text:'سلامت',value:5}
        //                     ],
        //                     details:[
        //                         ['نوع برنج','ایرانی'],
        //                         ['نوع گوشت','گوساله']
        //                     ],
        //                     commentsLength:24,
        //                     review:'این غذا خیلی غذای خوبی است . برای مشکل پسندان صو در صو پیشنهاد میشه . در این غذا ار مرغوب ترین متریال موجود در بازار استفاده شده است',
        //                     id:'645585',
        //                     name: 'چلو کره ای ته دیگی چهار نفره', rate: 3.4,
        //                     price: 280000, discountPercent: 10, image: pasta_alferedo, tags: ['کبابی','ایرانی'],
        //                     description:'600 گرم چلو کره ته دیگی'
        //                 },
        //                 {
        //                     rates:[
        //                         {text:'کیفیت',value:4},
        //                         {text:'حجم',value:3},
        //                         {text:'سلامت',value:5}
        //                     ],
        //                     details:[
        //                         ['نوع برنج','ایرانی'],
        //                         ['نوع گوشت','گوساله']
        //                     ],
        //                     commentsLength:24,
        //                     review:'این غذا خیلی غذای خوبی است . برای مشکل پسندان صو در صو پیشنهاد میشه . در این غذا ار مرغوب ترین متریال موجود در بازار استفاده شده است',
        //                     id:'6344534',
        //                     name: 'سبزی پلو تک نفره', rate: 3.4,
        //                     price: 65000, discountPercent: 10, image: pasta_alferedo, tags: ['کبابی','ایرانی'],
        //                     description:'100 گرم سبزی پلو'
        //                 },
        //                 {
        //                     rates:[
        //                         {text:'کیفیت',value:4},
        //                         {text:'حجم',value:3},
        //                         {text:'سلامت',value:5}
        //                     ],
        //                     details:[
        //                         ['نوع برنج','ایرانی'],
        //                         ['نوع گوشت','گوساله']
        //                     ],
        //                     commentsLength:24,
        //                     review:'این غذا خیلی غذای خوبی است . برای مشکل پسندان صو در صو پیشنهاد میشه . در این غذا ار مرغوب ترین متریال موجود در بازار استفاده شده است',
        //                     id:'64678463',
        //                     name: 'سبزی پلو دو نفره', rate: 3.4,
        //                     price: 120000, discountPercent: 10, image: pasta_alferedo, tags: ['کبابی','ایرانی'],
        //                     description:'200 گرم سبزی پلو'
        //                 },
        //                 {
        //                     rates:[
        //                         {text:'کیفیت',value:4},
        //                         {text:'حجم',value:3},
        //                         {text:'سلامت',value:5}
        //                     ],
        //                     details:[
        //                         ['نوع برنج','ایرانی'],
        //                         ['نوع گوشت','گوساله']
        //                     ],
        //                     commentsLength:24,
        //                     review:'این غذا خیلی غذای خوبی است . برای مشکل پسندان صو در صو پیشنهاد میشه . در این غذا ار مرغوب ترین متریال موجود در بازار استفاده شده است',
        //                     id:'6434565',
        //                     name: 'سبزی پلو چهار نفره', rate: 3.4,
        //                     price: 240000, discountPercent: 10, image: pasta_alferedo, tags: ['کبابی','ایرانی'],
        //                     description:'400 گرم سبزی پلو'
        //                 }
        //             ]
        //         }
        //     ]
        // },
        restoran_comments({id,pageSize,pageNumber}){
            return [
                {date:'1402/1/1/3/34',name:'رضا عباسی',comment:'کیفیت غذای رستوران خیلی خوب بود ، من خیلی خوشم آمد بهتر بود کمی گرم تر به دستم میرسی'},
                {date:'1402/1/1/3/34',name:'رضا عباسی',comment:'کیفیت غذای رستوران خیلی خوب بود ، من خیلی خوشم آمد بهتر بود کمی گرم تر به دستم میرسی'},
                {date:'1402/1/1/3/34',name:'رضا عباسی',comment:'کیفیت غذای رستوران خیلی خوب بود ، من خیلی خوشم آمد بهتر بود کمی گرم تر به دستم میرسی'},
                {date:'1402/1/1/3/34',name:'رضا عباسی',comment:'کیفیت غذای رستوران خیلی خوب بود ، من خیلی خوشم آمد بهتر بود کمی گرم تر به دستم میرسی'},
                {date:'1402/1/1/3/34',name:'رضا عباسی',comment:'کیفیت غذای رستوران خیلی خوب بود ، من خیلی خوشم آمد بهتر بود کمی گرم تر به دستم میرسی'},
                {date:'1402/1/1/3/34',name:'رضا عباسی',comment:'کیفیت غذای رستوران خیلی خوب بود ، من خیلی خوشم آمد بهتر بود کمی گرم تر به دستم میرسی'},
                {date:'1402/1/1/3/34',name:'رضا عباسی',comment:'کیفیت غذای رستوران خیلی خوب بود ، من خیلی خوشم آمد بهتر بود کمی گرم تر به دستم میرسی'},
            ]
        },
        restoran_coupons(){
            return [
                { id:'23423423',title:'کوپن 1',discountPercent: 10, minCartAmount:500000, maxDiscount:100000 },
                { id:'75684564',title:'کوپن 2',discountPercent: 10, maxDiscount:100000 },
                { id:'4235345',title:'کوپن 3',discountPercent: 10, minCartAmount:500000 },
                { id:'56345234',title:'کوپن 4',discountPercent: 10 },
                               
                { id:'23426',title:'کوپن 5',discount: 100000, minCartAmount:500000 },
                { id:'645634534',title:'کوپن 6',discount: 100000 },
              ]
        }
    }
}
