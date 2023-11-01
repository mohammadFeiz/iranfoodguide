export default function backOfficeApis({baseUrl,Axios}){
    return {
        get_tags:async ({ type })=> {
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
        add_or_edit_tag: async ({ type, tagName }) => {
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
            let result = { id: newTagId };
            return { response, result };
        },
        remove_tag:async ({ type, tagId }) => {
            //if (mock) { return { mock: true } }
            let url;
            if (type === 'restoran') { url = `${baseUrl}/ResType?Id=${tagId.toString()}`; }
            else if (type === 'food') { url = `${baseUrl}/FoodType?Id=${tagId.toString()}` }
            let response = await Axios.delete(url);
            return { response, result: true }
        },
        get_restorans: async (searchObject = {},{MapRestorans}) => {
            //if (mock) { return { mock: true } }
            let url = `${baseUrl}/Restaurant/Search`;
            //create from searchObject
            let { pageSize = 1000, pageNumber = 1, selected_tags = [], searchValue } = searchObject;
            let body = {

                RecordsPerPage: pageSize,// تعداد ریزالت در هر صفحه
                pageNumber: pageNumber,// شماره صفحه
                TypesId: selected_tags,// array id tags
                Title: searchValue
                //selected_tags لیستی از آی دی تگ های انتخاب شده برای سرچ توسط کاربر
                //searchValue متن سرچ شده توسط کاربر
            }
            let response = await Axios.post(url, body);
            let data = response.data.data.items
            let result = MapRestorans(data);
            return { response, result }
        },
        add_or_edit_restoran: async ({ restoran, type }) => {
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
            let body = {
                "id": type === 'edit' ? restoran.id : undefined,
                "Id": type === 'edit' ? restoran.id : undefined,
                "Title": restoran.name,
                "LatinTitle": restoran.name,
                "Tax": restoran.tax,
                "DeliveryTime": restoran.deliveryTime,
                "address": {
                    "fullAddress": restoran.address,
                    "latitude": restoran.latitude,
                    "longitude": restoran.longitude,
                    "phoneNumber": restoran.phone
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
                "types": restoran.tags.map((o) => { return { typeId: o } })
            }
            let response, result;
            if (type === 'add') {
                response = await Axios.post(`${baseUrl}/Restaurant/Create`, body);
                result = { id: response.data.data }
            }
            else if (type === 'edit') {
                response = await Axios.put(`${baseUrl}/Restaurant/Edit`, body);
                result = true
            }
            return { response, result }
        },
        remove_restoran:async (restoranId) => {
            //if (mock) { return { mock: true } }
            let url = `${baseUrl}/Restaurant?Id=${restoranId.toString()}`;
            let response = await Axios.delete(url);
            return { response, result: true }
        },
        get_restoran_foods: async (restoranId) => {
            //if (mock) { return { mock: true } }
            let url = `${baseUrl}/RestaurantFood/Search`;
            let body = { "RestaurantId": restoranId }
            let response = await Axios.post(url, body);
            let data = response.data.data.items;
            //مپ کردن دیتای سرور به دیتای فرانت
            //let result = [];
            let result = data.map((o) => {
                return {
                    id: o.id, //String آی دی غذا
                    name: o.name, //String نام غذا
                    parentId: o.parentFoodId === null ? undefined : o.parentFoodId,// آی دی غذایی که این غذا زیر مجموعه ی آن است 
                    menuCategory: o.menuCategoryTitle,// نام دسته بندی منو برای تفکیک غذا ها در یو آی
                    image: o.image, //String یو آر ال تصویر غذا
                    price: o.price, //Number قیمت غذا
                    discountPercent: o.discountPercent, //Number درصد تخفیف غذا
                    description: o.description, //String توضیحات مختصر در مورد غذا
                    review: o.description, //String توضیحات مفصل در مورد غذا
                    tags: [],
                    //tags: o.tags //Array آرایه ای از آی دی های دسته بندی
                }
            })
            return { response, result }
        },
        add_or_edit_food:async ({ restoranId, food, action }) => {
            //if (mock) { return { mock: true } }
            //restoranId => آی دی رستوران
            //food => آبجکت غذا
            //action => "add" | "edit"
            //آبجکت غذا مانند زیر است
            // {
            //     id:String, آی دی غذا فقط در ویرایش
            //     name:String, نام غذا
            //     parentId:String, آی دی غذایی که این غذا زیر مجموعه ی آن است 
            //     menuCategory:String, نام دسته بندی منو برای تفکیک غذا ها در یو آی
            //     image:String, یو آر ال تصویر غذا
            //     price:Number قیمت غذا
            //     discountPercent:درصد تخفیف غذا
            //     description:String توضیحات مختصر در مورد غذا
            //     review:String توضیحات مفصل در مورد غذا
            //     tags:Array آرایه ای از آی دی های تگ های غذا
            // }
            let url = `${baseUrl}/RestaurantFood/${action === 'add' ? 'Create' : 'Edit'}`;
            let body = {
                "id": action === 'edit' ? food.id : undefined,
                "title": food.name,
                "food": {
                    //"types": food.tags.map((o) => { return { typeId: o } }),
                    "types": [],
                    "title": food.name,
                    "latinTitle": food.name,
                    "description": food.description
                },
                "restaurantId": restoranId,
                "parentFoodId": food.parentId,
                "menuCategoryTitle": food.menuCategory,
                "price": food.price,
                "description": food.description,
                //"inventoryCount": 0,
                "isFavorite": true,
                "discount": food.discountPercent
            }
            //دریافت ریسپانس
            let response = await Axios[action === 'add' ? 'post' : 'put'](url, body);
            let result = action === 'edit' ? true : { id: response.data.data };
            return { response, result }
        },
        remove_food:async ({ restoranId, foodId }) => {
            //if (mock) { return { mock: true } }
            // parameters
            //restoranId آی دی رستورانی که یک غذا از آن باید حذف بشود
            //foodId آی دی غذایی که باید حذف شود
            let url = `${baseUrl}/RestaurantFood?Id=${foodId.toString()}`;
            let response = await Axios.delete(url);
            return { response, result: true }
        },
        edit_food_image:async ({ foodId, imageFile }) => {
            if (!imageFile) { return { result: true } }
            //if (mock) { return { mock: true } }
            let url = `${baseUrl}/RestaurantFood/AddLogoImage?RestaurantFoodId=${foodId}&Title=${'msf'}`;
            let formData = new FormData()
            formData.append('imageFile', imageFile, imageFile.name)
            let body = formData;
            //دریافت ریسپانس
            let response = await Axios.post(url, body);
            return { response, result: true }
        },
        //ویرایش تصویر رستوران
        edit_restoran_image:async ({ restoranId, imageFile }) => {
            //if (mock) { return { mock: true } }
            //parameters
            //restoranId  آی دی رستوران
            //imageUrl فایل انتخاب شده ی کاربر ادمین برای تصویر این رستوران
            //آدرس درخواست 
            let url = `${baseUrl}/RestaurantImage/AdImageOfRestaurant?RestaurantId=${restoranId}&Title=${'msf'}`;
            let formData = new FormData()
            formData.append('imageFile', imageFile, imageFile.name)
            let body = formData;
            //دریافت ریسپانس
            let response = await Axios.post(url, body);
            return { response, result: true }
        },
        edit_restoran_logo:async ({ restoranId, imageFile }) =>{
            //if (mock) { return { mock: true } }
            //parameters
            //restoranId  آی دی رستوران
            //imageFile فایل انتخاب شده ی کاربر ادمین برای لوگوی این رستوران
            //آدرس درخواست 
            let url = `${baseUrl}/RestaurantImage/AddLogoImage?RestaurantId=${restoranId}&Title=${'msf'}`;
            let formData = new FormData()
            formData.append('imageFile', imageFile, imageFile.name)
            let body = formData;
            //دریافت ریسپانس
            let response = await Axios.post(url, body);
            return { response, result: true }
        },
        restoran_sort_options:()=>{
            return MockApis.restoran_sort_options()
        }
        
    }
}


const MockApis = {
    get_tags({ type },{mockStorage}) {
        let res = mockStorage.load({ name: `${type}Tags`, def: [] })
        return {result:res}
    },
    add_or_edit_tag({ type, tagName },{mockStorage}) {
        let tags = mockStorage.load({ name: `${type}Tags`, def: [] })
        let id = Math.round(Math.random() * 1000000)
        tags.push({ name: tagName, id });
        mockStorage.save({ name: `${type}Tags`, value: tags })
        return { result:id }
    },
    remove_tag({ type, tagId },{mockStorage}) {
        let tags = mockStorage.load({ name: `${type}Tags`, def: [] })
        tags = tags.filter((o) => {
            return o.id !== tagId;
        })
        mockStorage.save({ name: `${type}Tags`, value: tags })
        return {result:true}
    },
    get_restorans(parameter,{mockStorage}) {
        let res = mockStorage.load({ name: 'restorans', def: [] })
        return {result:res};
    },
    add_or_edit_restoran({ newRestoran, type },{mockStorage}) {
        if (type === 'add') {
            let restorans = mockStorage.load({ name: 'restorans', def: [] });
            let id = 'res' + Math.round(Math.random() * 1000000);
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
            return {result:true};
        }
    },
    remove_restoran(restoranId,{mockStorage}) {
        let restorans = mockStorage.load({ name: 'restorans', def: [] });
        restorans = restorans.filter((o) => {
            if (o.id === restoranId) { return false }
            return o
        })
        mockStorage.save({ name: 'restorans', value: restorans })
        return {result:true};
    },
    get_restoran_foods(restoranId,{mockStorage}) {
        let foods = mockStorage.load({ name: `restoran_${restoranId}_menu`, def: [] });
        return {result:foods}
    },
    add_or_edit_food({ restoranId, food, action },{mockStorage}) {
        let foods = mockStorage.load({ name: `restoran_${restoranId}_menu`, def: [] });
        let newFoods, result;
        if (action === 'add') {
            let id = 'food' + Math.round(Math.random() * 1000000);
            let newFood = { ...food, id }
            newFoods = [newFood, ...foods];
            result = { id }
        }
        else {
            let newFood = { ...food }
            newFoods = foods.map((o) => o.id === newFood.id ? newFood : o)
            result = true;
        }
        mockStorage.save({ name: `restoran_${restoranId}_menu`, value: newFoods });
        return {result};
    },
    remove_food({ restoranId, foodId },{mockStorage}) {
        let foods = mockStorage.load({ name: `restoran_${restoranId}_menu`, def: [] });
        let newFoods = foods.filter((o) => o.id !== foodId);
        mockStorage.save({ name: `restoran_${restoranId}_menu`, value: newFoods });
        return {result:true};
    },
    edit_food_image({ foodId, imageUrl },{mockStorage}) {
        mockStorage.save({ name: `food_${foodId}_image`, value: imageUrl });
        return {result:true};
    },
    edit_restoran_image({ restoranId, imageUrl },{mockStorage}) {
        mockStorage.save({ name: `restoran_${restoranId}_image`, value: imageUrl });
        return {result:true};
    },
    edit_restoran_logo({ restoranId, imageUrl },{mockStorage}) {
        mockStorage.save({ name: `restoran_${restoranId}_logo`, value: imageUrl });
        return {result:true};
    },
    restoran_sort_options() {
        let result = [
            { text: 'رستوران اقتصادی', value: '0' },
            { text: 'بالاترین امتیاز ', value: '1' },
            { text: 'نزدیک ترین ', value: '2' },
            { text: 'جدیدترین', value: '3' },
            { text: 'تایید شده در ایران فود', value: '4' },
            { text: 'گرانترین', value: '5' }
        ]
        return {result}
    },
    
    
    
    
}