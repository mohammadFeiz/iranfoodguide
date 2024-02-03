import { I_food, I_foodId, I_food_server, I_restoran, I_restoranId, I_restoran_server, I_restoran_sort_option, I_state, I_tag, I_tag_type } from "../typs";
export type I_get_tags_p = { type:I_tag_type }
export type I_get_tags_r = I_tag[]
export type I_add_or_edit_tag_p = { type:I_tag_type, tagName:string } 
export type I_add_or_edit_tag_r = { id:number } 
export type I_remove_tag_p = { type:I_tag_type, tagId:number }
export type I_remove_tag_r = boolean
export type I_get_restorans_p = { pageSize?:number, pageNumber?:number, selectedTags?:number[], searchValue?:string,selectedSort?:false|string }
export type I_get_restorans_r = I_restoran[]
export type I_add_or_edit_restoran_p = { newRestoran:I_restoran, type:'add' | 'edit' }
export type I_add_or_edit_restoran_r = {id:I_restoranId}
export type I_remove_restoran_p = I_restoranId
export type I_remove_restoran_r = boolean
export type I_add_or_edit_food_p = { restoranId:I_restoranId, newFood:I_food, type:'add' | 'edit' }
export type I_add_or_edit_food_r = {id:I_foodId}
export type I_get_restoran_foods_p = I_restoranId;
export type I_get_restoran_foods_r = I_food[];
export type I_remove_food_p = { restoranId:I_restoranId, foodId:I_foodId }
export type I_remove_food_r = boolean
export type I_get_restoran_sort_options_r = I_restoran_sort_option[]
export default function backOfficeApis({baseUrl,Axios}){
    let apis = {
        get_tags:async (p:I_get_tags_p)=> {
            let { type } = p;
            let url;
            if (type === 'restoran') { url = `${baseUrl}/ResType/Search`; }
            else if (type === 'food') { url = `${baseUrl}/FoodType/Search` }
            let body;
            if (type === 'restoran') { body = {}; }
            else if (type === 'food') { body = {}; }
            let response = await Axios.post(url, body);
            let data = response.data.data.items
            let result:I_get_tags_r = data.map((o) => {
                return {
                    name: o.title, //String نام تگ
                    id: o.id, //String آی دی تگ
                }
            });
            return { response, result };
        },
        add_or_edit_tag: async (p:I_add_or_edit_tag_p) => {
            let { type, tagName } = p;
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
            let result:I_add_or_edit_tag_r = { id: newTagId };
            return { response, result };
        },
        remove_tag:async (p:I_remove_tag_p) => {
            let { type, tagId } = p;
            //if (mock) { return { mock: true } }
            let url;
            if (type === 'restoran') { url = `${baseUrl}/ResType?Id=${tagId.toString()}`; }
            else if (type === 'food') { url = `${baseUrl}/FoodType?Id=${tagId.toString()}` }
            let response = await Axios.delete(url);
            let result:I_remove_tag_r = true
            return { response, result }
        },
        get_restorans: async (searchObject:I_get_restorans_p,{restoranToClient}) => {
            searchObject = searchObject || {};
            //if (mock) { return { mock: true } }
            let url = `${baseUrl}/Restaurant/Search`;
            //create from searchObject
            let { pageSize = 1000, pageNumber = 1, selectedTags = [], searchValue,selectedSort } = searchObject;
            let body = {

                RecordsPerPage: pageSize,// تعداد ریزالت در هر صفحه
                pageNumber: pageNumber,// شماره صفحه
                TypesId: selectedTags,// array id tags
                Title: searchValue
                //selected_tags لیستی از آی دی تگ های انتخاب شده برای سرچ توسط کاربر
                //searchValue متن سرچ شده توسط کاربر
            }
            let response = await Axios.post(url, body);
            let data = response.data.data.items
            let result:I_get_restorans_r = data.map((o:I_restoran_server)=>{
                let res:I_restoran = restoranToClient(o);
                return res;
            });
            return { response, result }
        },
        add_or_edit_restoran: async (p:I_add_or_edit_restoran_p) => {
            let { newRestoran, type } = p;
            //if (mock) { return { mock: true } }
            //parameters
            //restoran آبجکت رستوران برای افزودن
            // این آبجکت به شکل زیر است
            // {
            //     id:Any, آی دی رستوران
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
            let {id,name,tax,deliveryTime,address,latitude,longitude,phone,startTime,endTime,tags} = newRestoran
            let body = {
                "id": type === 'edit' ? id : undefined,
                "Id": type === 'edit' ? id : undefined,
                "Title": name,
                "LatinTitle": name,
                "Tax": tax,
                "DeliveryTime": deliveryTime,
                "address": {
                    "fullAddress": address,
                    "latitude": latitude,
                    "longitude": longitude,
                    "phoneNumber": phone
                },
                "phoneNumbers": [{"Title": name,"phoneNumber": phone}],
                "workingTimes": [
                    {
                        "startTime": startTime,// "12:00",
                        "endTime": endTime,
                        "applyChangeTime": "12:00"
                    }
                ],
                "types": tags.map((o) => { return { typeId: o } })
            }
            let response:any, result:I_add_or_edit_restoran_r;
            if (type === 'add') {
                response = await Axios.post(`${baseUrl}/Restaurant/Create`, body);
                result = { id: response.data.data }
            }
            else if (type === 'edit') {
                response = await Axios.put(`${baseUrl}/Restaurant/Edit`, body);
                result = {id:newRestoran.id}
            }
            return { response, result }
        },
        remove_restoran:async (restoranId:I_remove_restoran_p) => {
            //if (mock) { return { mock: true } }
            let url = `${baseUrl}/Restaurant?Id=${restoranId.toString()}`;
            let response = await Axios.delete(url);
            let result:I_remove_restoran_r = true;
            return { response, result }
        },
        get_restoran_foods: async (restoranId:I_get_restoran_foods_p,appState:I_state) => {
            let {foodToClient} = appState;
            //if (mock) { return { mock: true } }
            let url = `${baseUrl}/RestaurantFood/Search`;
            let body = { "RestaurantId": restoranId }
            let response = await Axios.post(url, body);
            let data = response.data.data.items;
            //مپ کردن دیتای سرور به دیتای فرانت
            //let result = [];
            let result:I_get_restoran_foods_r = data.map((o:I_food_server) => foodToClient(o))
            return { response, result }
        },
        add_or_edit_food:async (p:I_add_or_edit_food_p,appState:I_state) => {
            let { restoranId, newFood, type } = p
            let {foodToServer} = appState;
            //if (mock) { return { mock: true } }
            let url = `${baseUrl}/RestaurantFood/${type === 'add' ? 'Create' : 'Edit'}`;
            let body = foodToServer(newFood,type,restoranId)
            //دریافت ریسپانس
            let response = await Axios[type === 'add' ? 'post' : 'put'](url, body);
            let result = type === 'edit' ? {id:restoranId} : { id: response.data.data };
            return { response, result }
        },
        remove_food:async (p:I_remove_food_p) => {
            let { restoranId, foodId } = p;
            //if (mock) { return { mock: true } }
            // parameters
            //restoranId آی دی رستورانی که یک غذا از آن باید حذف بشود
            //foodId آی دی غذایی که باید حذف شود
            let url = `${baseUrl}/RestaurantFood?Id=${foodId.toString()}`;
            let response = await Axios.delete(url);
            let result:I_remove_food_r = true;
            return { response, result }
        },
        get_restoran_sort_options:()=>{
            let res = MockApis.get_restoran_sort_options()
            let result:I_get_restoran_sort_options_r = res.result;
            return {result}
        }
        
    }
    return apis
}

type I_MockApis = {
    get_restoran_sort_options:()=>{result:I_restoran_sort_option[]},
    get_tags:(p:I_get_tags_p,appState:I_state)=>{result:I_get_tags_r},
    add_or_edit_tag:(p:I_add_or_edit_tag_p,appState:I_state)=>{result:I_add_or_edit_tag_r},
    remove_tag:(p:I_remove_tag_p,appState:I_state)=>{result:I_remove_tag_r},
    get_restorans:(p:I_get_restorans_p,appState:I_state)=>{result:I_get_restorans_r},
    add_or_edit_restoran:(p:I_add_or_edit_restoran_p,appState:I_state)=>{result:{id:number}},
    remove_restoran:(o:I_remove_restoran_p,appState:I_state)=>{result:boolean},
    get_restoran_foods:(restoranId:I_get_restoran_foods_p,appState:I_state)=>{result:I_get_restoran_foods_r},
    add_or_edit_food:(p:I_add_or_edit_food_p,appState:I_state)=>{result:I_add_or_edit_food_r},
    remove_food:(p:I_remove_food_p,appState:I_state)=>{result:I_remove_food_r}
}
const MockApis:I_MockApis = {
    get_tags(p,appState) {
        let {mockStorage} = appState;
        let { type } = p;
        let res = mockStorage.load({ name: `${type}Tags`, def: [] }) as I_get_tags_r
        return {result:res}
    },
    add_or_edit_tag(p,appState) {
        let { type, tagName } = p;
        let {mockStorage} = appState
        let tags = mockStorage.load({ name: `${type}Tags`, def: [] })
        let id = Math.round(Math.random() * 1000000)
        tags.push({ name: tagName, id });
        mockStorage.save({ name: `${type}Tags`, value: tags })
        return { result:{id} }
    },
    remove_tag(p,appState) {
        let { type, tagId } = p;
        let {mockStorage} = appState;
        let tags = mockStorage.load({ name: `${type}Tags`, def: [] })
        tags = tags.filter((o) => {
            return o.id !== tagId;
        })
        mockStorage.save({ name: `${type}Tags`, value: tags })
        return {result:true}
    },
    get_restorans(parameter,appState) {
        let {mockStorage} = appState;
        let res = mockStorage.load({ name: 'restorans', def: [] })
        return {result:res};
    },
    add_or_edit_restoran(p,appState) {
        let { newRestoran, type } = p;
        let {mockStorage} = appState;
        if (type === 'add') {
            let restorans = mockStorage.load({ name: 'restorans', def: [] });
            let id = Math.round(Math.random() * 1000000);
            newRestoran = { ...newRestoran, id }
            let newRestorans = [newRestoran, ...restorans];
            mockStorage.save({ name: 'restorans', value: newRestorans })
            return {result:{ id }};
        }
        else if (type === 'edit') {
            let restorans = mockStorage.load({ name: 'restorans', def: [] });
            restorans = restorans.map((o) => {
                if (o.id === newRestoran.id) { return newRestoran }
                return o
            })
            mockStorage.save({ name: 'restorans', value: restorans })
            let result:I_add_or_edit_restoran_r = {id:newRestoran.id}
            return {result};
        }
    },
    remove_restoran(restoranId,{mockStorage}) {
        let restorans = mockStorage.load({ name: 'restorans', def: [] });
        restorans = restorans.filter((o) => {
            if (o.id === restoranId) { return false }
            return o
        })
        mockStorage.save({ name: 'restorans', value: restorans })
        let result:I_remove_restoran_r = true
        return {result};
    },
    get_restoran_foods(restoranId,appState:I_state) {
        let {mockStorage} = appState;
        let foods = mockStorage.load({ name: `restoran_${restoranId}_menu`, def: [] });
        return {result:foods}
    },
    add_or_edit_food(p,appState:I_state) {
        let { restoranId, newFood, type } = p;
        let {mockStorage} = appState;
        let foods = mockStorage.load({ name: `restoran_${restoranId}_menu`, def: [] });
        let newFoods:I_food[], result:I_add_or_edit_food_r;
        if (type === 'add') {
            let id:I_foodId = Math.round(Math.random() * 1000000);
            newFoods = [{ ...newFood, id }, ...foods];
            result = { id }
        }
        else {
            newFoods = foods.map((o) => o.id === newFood.id ? { ...newFood } : o)
            result = {id:newFood.id};
        }
        mockStorage.save({ name: `restoran_${restoranId}_menu`, value: newFoods });
        return {result};
    },
    remove_food(p,appState) {
        let { restoranId, foodId } = p;
        let {mockStorage} = appState;
        let foods = mockStorage.load({ name: `restoran_${restoranId}_menu`, def: [] });
        let newFoods = foods.filter((o) => o.id !== foodId);
        mockStorage.save({ name: `restoran_${restoranId}_menu`, value: newFoods });
        return {result:true};
    },
    get_restoran_sort_options() {
        let result:I_restoran_sort_option[] = [
            { text: 'رستوران اقتصادی', value: '0' },
            { text: 'بالاترین امتیاز', value: '1' },
            { text: 'نزدیک ترین', value: '2' },
            { text: 'جدیدترین', value: '3' },
            { text: 'گرانترین', value: '4' }
        ]
        return {result}
    },
    
    
    
    
}