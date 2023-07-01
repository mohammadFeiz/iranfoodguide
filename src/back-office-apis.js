import Axios from 'axios';
import AIOStorage from './npm/aio-storage/aio-storage';
export function getResponse({ getState }) {
    let baseUrl = 'https://localhost:7203/api'
    //let baseUrl = 'https://iranfoodguide.ir/api'
    return {
        //در یافت لیست تگ های رستوران و تگ های غذا بسته به تایپ ورودی
        async get_tags({ type }) {
            //parameters
            // type => 'restoran' | 'food'


            //آدرس درخواست 
            let url;
            if (type === 'restoran') { url = `${baseUrl}/ResType/Search`; }
            else if (type === 'food') { url = `${baseUrl}/FoodType/Search` }

            //نوع درخواست ("get" | "post")
            let method;
            method = "post"

            //بادی متد پست (any | undefined)
            let body;
            if (type === 'restoran') { body = {}; }
            else if (type === 'food') { body = {}; }

            let response = await Axios[method](url, body);

            //دریافت دیتا از روی ریسپانس
            let data;
            data = response.data.data.items

            //مپ کردن دیتای سرور به دیتای فرانت
            let result;
            result = data.map((o)=>{
               return {
                   name:o.title, //String نام تگ
                   id:o.id, //String آی دی تگ
               }
            });

            return { response, result };
            return {mock:true}

        },
        async add_tag({ type, tagName }) {
            
            //parameters
            // type => 'restoran' | 'food'
            // tagName => نام تگ


            //آدرس درخواست 
            let url;
            //url = `${baseUrl}/<...>`;

            if (type === 'restoran') { url = `${baseUrl}/ResType/Create`; }
            else if (type === 'food') { url = `${baseUrl}/FoodType/Create` }

            //نوع درخواست ("get" | "post")
            let method;
            //method = <...>
            method = "post"
            //بادی متد پست (any | undefined)
            let body;
            if (type === 'restoran') { body = {

                    "title": tagName,
                    "latinTitle": tagName
            }; }
            else if (type === 'food') { body = {
                "title": tagName,
                "latinTitle": tagName
            }; }

            let response = await Axios[method](url, body);

            //دریافت دیتا از روی ریسپانس
            let data;
            data = response.data.data.items

            //مپ کردن دیتای سرور به دیتای فرانت
            let result;
            //result = data.map((o)=>{
            //    return {
            //        name:<...>, //String نام تگ
            //        id:<...>, //String آی دی تگ
            //    }
            //});

            return { response, result };
            return {mock:true}
        },
        async remove_tag({ type, tagId }) {
            //parameters
            // type => 'restoran' | 'food'
            // tagId => آی دی تگ
                let url;
            if (type === 'restoran') { url = `${baseUrl}/ResType?Id=${tagId.toString()}`; }
            else if (type === 'food') { url = `${baseUrl}/FoodType?Id=${tagId.toString()}` }

            //نوع درخواست ("get" | "post")
            let method;
            //method = <...>
            method = "delete"
            //بادی متد پست (any | undefined)
            debugger
            let body;
            if (type === 'restoran') { body = {

                    "id": tagId
            }; }
            else if (type === 'food') { body = {
                "id": tagId
            }; }

            //دریافت ریسپانس
            let response = await Axios[method](url);

            return { response, result: true }

            return {mock:true}

        },
        async get_restorans() {
            return {mock:true}
            //آدرس درخواست 
            let url;
            //url = `${baseUrl}/<...>`;

            //نوع درخواست ("get" | "post")
            let method;
            //method = <...>

            //بادی متد پست (any | undefined)
            let body;
            //body = <...>

            //دریافت ریسپانس
            let response = await Axios[method](url, body);

            //دریافت دیتا از روی ریسپانس
            let data = [];
            //data = <...>

            //مپ کردن دیتای سرور به دیتای فرانت
            let result = [];
            // result = data.map((o)=>{
            //     return {
            //         id:<...>, //String آی دی رستوران
            //         name:<...>, //String نام رستوران
            //         latitude:<...>, //Number موقعیت رستوران در راستای لتیتیود
            //         longitude:<...>, //Number موقعیت رستوران در راستای لانگیتیود
            //         image:<...>, //String یو آر ال تصویر رستوران
            //         logo:<...>, //String یو آر ال لوگوی رستوران
            //         address:<...>, //String آدرس رستوران
            //         phone:<...>, //String تلفن رستوران
            //         ifRate:<...>, //Number امتیاز ایران فود به این رستوران
            //         ifComment:<...>, //String کامنت ایران فود در مورد این رستوران
            //         deliveryTime:<...>, //Number مدت زمان ارسال به دقیقه
            //         tags:<...>, //ArrayOfStrings آرایه ای از آی دی تگ های رستوران
            //         startTime:<...>, //Number bewtween (1 and 24) زمان شروع به کار
            //         endTime:<...>, //Number bewtween (1 and 24) زمان پایان کار
            //         tags: Array of ids آرایه ای از تگ های رستوران
            //     }
            // })
            return { response, result }
        },
        async add_restoran(restoran) {

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


            //آدرس درخواست 
            let url;
            url = `${baseUrl}/Restaurant/Create`; 
            //url = `${baseUrl}/<...>`

            //نوع درخواست ("get" | "post")
            let method;
            method = "post";
debugger
            //بادی متد پست (any | undefined)
            let body;
            body = {
                "Title": restoran.name,
                "LatinTitle": restoran.name,
                "address": {
                    "fullAddress": restoran.address,
                    "latitude": restoran.latitude,
                    "longitude": restoran.longitude
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
                "types": restoran.tags
            }

            //دریافت ریسپانس
            let response = await Axios[method](url, body);

            //دریافت آی دی تگ اضافه شده از روی ریسپانس
            let id;
            //id = <...>

            return { response, result: { id } }
            return {mock:true}


        },
        async edit_restoran(restoran) {
            return {mock:true}
            let method;
            method = "put";
            let url = `${baseUrl}/Restaurant/Edit`; 
            //بادی متد پست (any | undefined)
            let body;
            body = {
                "Title": restoran.name,
                "LatinTitle": restoran.name,
                "address": {
                    "fullAddress": restoran.address,
                    "latitude": restoran.latitude,
                    "longitude": restoran.longitude
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
                "types": [
                    {
                        "typeId": restoran.tags
                    }
                ]
            }

            //دریافت ریسپانس
            let response = await Axios[method](url, body);

            //دریافت ریسپانس
            return { response, result: true }
        },
        async remove_restoran(restoranId) {
            // parameters
            //restoranId آی دی رستورانی که باید حذف بشود
            

           let url = `${baseUrl}/Restaurant/delete`; 

            //نوع درخواست ("get" | "post")
            let method;
            //method = <...>
            method = "post"
            //بادی متد پست (any | undefined)
            let body={

                "id": restoranId
        };

            //دریافت ریسپانس
            let response = await Axios[method](url, body);

            return { response, result: true }
            return {mock:true}

        },
        async get_restoran_menu(restoranId) {
            return {mock:true}
            // parameters
            // restoranId آی دی رستورانی که منوی اون رو می خواهیم


            //آدرس درخواست 
            let url;
            //url = `${baseUrl}/<...>`;

            //نوع درخواست ("get" | "post")
            let method;
            //method = <...>

            //بادی متد پست (any | undefined)
            let body;
            //body = <...>

            //دریافت ریسپانس
            let response = await Axios[method](url, body);

            //دریافت دیتا از روی ریسپانس
            let data = [];
            //data = <...>

            //مپ کردن دیتای سرور به دیتای فرانت
            let result = [];
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
            return {mock:true}
            //restoranId => آی دی رستوران
            //food => آبجکت غذا برای افزودن
            //آبجکت غذا مانند زیر است
            // {
            //     name:String, نام غذا
            //     image:String, یو آر ال تصویر غذا
            //     price:Number قیمت غذا
            //     discountPercent:درصد تخفیف غذا
            //     description:String توضیحات مختصر در مورد غذا
            //     review:String توضیحات مفصل در مورد غذا
            //     categories:Array آرایه ای از آی دی های دسته بندی
            // }


            //آدرس درخواست 
            let url;
            //url = `${baseUrl}/<...>`;

            //نوع درخواست ("get" | "post")
            let method;
            //method = <...>

            //بادی متد پست (any | undefined)
            let body;
            //body = <...>

            //دریافت ریسپانس
            let response = await Axios[method](url, body);

            //دریافت آی دی غذای اضافه شده از روی ریسپانس
            let id;
            //id = <...>

            return { response, result:{id} }
        },
        async edit_food({ restoranId, food }) {
            return {mock:true}
            //restoranId => آی دی رستوران
            //food => آبجکت غذا برای ویرایش
            //آبجکت غذا مانند زیر است
            // {
            //     id:String, آی دی غذا
            //     name:String, نام غذا
            //     image:String, یو آر ال تصویر غذا
            //     price:Number قیمت غذا
            //     discountPercent:درصد تخفیف غذا
            //     description:String توضیحات مختصر در مورد غذا
            //     review:String توضیحات مفصل در مورد غذا
            // }

            //آدرس درخواست 
            let url;
            //url = `${baseUrl}/<...>`;

            //نوع درخواست ("get" | "post")
            let method;
            //method = <...>

            //بادی متد پست (any | undefined)
            let body;
            //body = <...>
            
            //دریافت ریسپانس
            let response = await Axios[method](url, body);
            return { response, result: true }
        },
        async remove_food({ restoranId, foodId }) {
            return {mock:true}
            // parameters
            //restoranId آی دی رستورانی که یک غذا از آن باید حذف بشود
            //foodId آی دی غذایی که باید حذف شود


            //آدرس درخواست 
            let url;
            //url = `${baseUrl}/<...>`

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
        //ویرایش تصویر غذا
        async edit_food_image({ restoranId, foodId, imageFile }) {
            return {mock:true}
            //parameters
            //restoranId  آی دی رستوران
            //foodId آی دی غذا
            //imageFile فایل انتخاب شده ی کاربر ادمین برای این غذا
            
            //آدرس درخواست 
            let url;
            //url = `${baseUrl}/<...>`

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
        //ویرایش تصویر رستوران
        async edit_restoran_image({ restoranId, imageFile }) {
            return {mock:true}
            //parameters
            //restoranId  آی دی رستوران
            //imageFile فایل انتخاب شده ی کاربر ادمین برای تصویر این رستوران
            
            //آدرس درخواست 
            let url;
            //url = `${baseUrl}/<...>`

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
        //ویرایش لوگوی رستوران
        async edit_restoran_logo({ restoranId, imageFile }) {
            return {mock:true}
            //parameters
            //restoranId  آی دی رستوران
            //imageFile فایل انتخاب شده ی کاربر ادمین برای لوگوی این رستوران
            
            //آدرس درخواست 
            let url;
            //url = `${baseUrl}/<...>`

            //نوع درخواست ("get" | "post")
            let method;
            //method = <...>;

            //بادی متد پست (any | undefined)
            let body;
            //body = <...>

            //دریافت ریسپانس
            let response = await Axios[method](url, body);
            return { response, result: true }
        }

    }
}

export function getMock({ helper }) {
    let Storage = AIOStorage('iranfoodbackoffice')
    return {
        get_tags({ type }) {
            let res = Storage.load({ name: `${type}Tags`, def: [] })
            return res
        },
        add_tag({ type, tagName }) {
            let tags = Storage.load({ name: `${type}Tags`, def: [] })
            let id = Math.round(Math.random() * 1000000)
            tags.push({ name: tagName, id });
            Storage.save({ name: `${type}Tags`, value: tags })
            return { id }
        },
        edit_tag({ type, tagId, tagName }) {
            let tags = Storage.load({ name: `${type}Tags`, def: [] })
            tags = tags.map((o) => {
                return o.id === tagId ? { id: tagId, name: tagName } : o;
            })
            Storage.save({ name: `${type}Tags`, value: tags })
            return true
        },
        remove_tag({ type, tagId }) {
            let tags = Storage.load({ name: `${type}Tags`, def: [] })
            tags = tags.filter((o) => {
                return o.id !== tagId;
            })
            Storage.save({ name: `${type}Tags`, value: tags })
            return true
        },
        get_restorans() {
            let res = Storage.load({ name: 'restorans', def: [] })
            return res;
        },
        add_restoran(newRestoran) {
            let restorans = Storage.load({ name: 'restorans', def: [] });
            let id = 'res' + Math.round(Math.random() * 1000000);
            newRestoran = { ...newRestoran, id }
            let newRestorans = [newRestoran, ...restorans];
            Storage.save({ name: 'restorans', value: newRestorans })
            return { id };
        },
        edit_restoran(restoran) {
            let restorans = Storage.load({ name: 'restorans', def: [] });
            restorans = restorans.map((o) => {
                if (o.id === restoran.id) { return restoran }
                return o
            })
            Storage.save({ name: 'restorans', value: restorans })
            return true;
        },
        remove_restoran(restoranId) {
            let restorans = Storage.load({ name: 'restorans', def: [] });
            restorans = restorans.filter((o) => {
                if (o.id === restoranId) { return false }
                return o
            })
            Storage.save({ name: 'restorans', value: restorans })
            return true;
        },
        get_restoran_menu(restoranId) {
            let foods = Storage.load({ name: `restoran_${restoranId}_menu`, def: [] });
            return foods
        },
        add_food({ restoranId, food }) {
            let foods = Storage.load({ name: `restoran_${restoranId}_menu`, def: [] });
            let id = 'food' + Math.round(Math.random() * 1000000);
            let newFood = { ...food, id }
            let newFoods = [newFood, ...foods];
            Storage.save({ name: `restoran_${restoranId}_menu`, value: newFoods });
            return { id };
        },
        edit_food({ restoranId, food }) {
            let foods = Storage.load({ name: `restoran_${restoranId}_menu`, def: [] });
            let newFood = { ...food }
            let newFoods = foods.map((o) => o.id === newFood.id ? newFood : o);
            Storage.save({ name: `restoran_${restoranId}_menu`, value: newFoods });
            return true;
        },
        remove_food({ restoranId, foodId }) {
            let foods = Storage.load({ name: `restoran_${restoranId}_menu`, def: [] });
            let newFoods = foods.filter((o) => o.id !== foodId);
            Storage.save({ name: `restoran_${restoranId}_menu`, value: newFoods });
            return true;
        },
        edit_food_image({ foodId, imageUrl }) {
            Storage.save({ name: `food_${foodId}_image`, value: imageUrl });
            return true;
        },
        edit_restoran_image({ restoranId, imageUrl }) {
            Storage.save({ name: `restoran_${restoranId}_image`, value: imageUrl });
            return true;
        },
        edit_restoran_logo({ restoranId, imageUrl }) {
            Storage.save({ name: `restoran_${restoranId}_logo`, value: imageUrl });
            return true;
        }
    }
}
