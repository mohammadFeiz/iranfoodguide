import Axios from 'axios';
import AIOStorage from './npm/aio-storage/aio-storage';
export function getResponse({getState}){
    //let baseUrl = 'https://localhost:7203/api/v1'
    //let baseUrl = 'https://iranfoodguide.ir/api'
    let mock = true
    return {
        async get_restorans(){
            //ریترن آرایه ای از آبجکت های رستوران
            
            //هر آبجکت مانند زیر است
            // {
            //     id:String, آی دی رستوران
            //     name:String, نام رستوران
            //     latitude:Number, موقعیت رستوران در راستای لتیتیود
            //     longitude:Number, موقعیت رستوران در راستای لانگیتیود
            //     image:String, یو آر ال تصویر رستوران
            //     logo:String, یو آر ال لوگوی رستوران
            //     address:String, آدرس رستوران
            //     phone:String, تلفن رستوران
            //     ifRate:Number, امتیاز ایران فود به این رستوران
            //     ifComment:String, کامنت ایران فود در مورد این رستوران
            // }

            return {mock:true} 
        },
        async add_restoran(restoran){
            // پارامتر ورودی آبجکت رستوران برای افزودن است
            
            // این آبجکت به شکل زیر است
            // {
            //     name:String, نام رستوران
            //     latitude:Number, موقعیت رستوران در راستای لتیتیود
            //     longitude:Number, موقعیت رستوران در راستای لانگیتیود
            //     address:String, آدرس رستوران
            //     phone:String, تلفن رستوران
            // }

            //در صورت موفقیت در عملیات باید یک آبجکت شامل آی دی رستوران ریترن شود
            //return {id:...}
            
            return {mock:true} 
        },
        async edit_restoran(restoran){
            // پارامتر ورودی آبجکت رستوران برای ویرایش است
            // این آبجکت به شکل زیر است
            
            // {
            //     name:String, نام رستوران
            //     latitude:Number, موقعیت رستوران در راستای لتیتیود
            //     longitude:Number, موقعیت رستوران در راستای لانگیتیود
            //     address:String, آدرس رستوران
            //     phone:String, تلفن رستوران
            // }
            
            //در صورت موفقیت در عملیات باید ترو ریترن شود
            //return true
            
            return {mock:true} 
        },
        async remove_restoran(restoranId){
            // پارامتر ورودی آی دی رستورانی که قراره حذف بشه می باشد
            
            //در صورت موفقیت در عملیات باید ترو ریترن شود
            //return true
            
            return {mock:true} 
        },
        async get_restoran_menu(restoranId){
            // پارامتر ورودی آی دی رستوران می باشد
            
            //ریترن آرایه ای از آبجکت های منوی رستوران
            
            //هر آبجکت مانند زیر است
            // {
            //     id:String, آی دی غذا
            //     name:String, نام غذا
            //     image:String, یو آر ال تصویر غذا
            //     price:Number قیمت غذا
            //     discountPercent:درصد تخفیف غذا
            //     description:String توضیحات مختصر در مورد غذا
            //     review:String توضیحات مفصل در مورد غذا
            // }
            return {mock:true} 
        },
        async add_food({restoranId,food}){
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
            // }

            //در صورت موفقیت در عملیات باید یک آبجکت شامل آی دی غذا ریترن شود
            //return {id:...}
            
            return {mock:true}
        },
        async edit_food({restoranId,food}){
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

            //در صورت موفقیت در عملیات باید ترو ریترن شود
            //return true
            
            return {mock:true}
        },
        async remove_food({restoranId,foodId}){
            //restoranId => آی در رستوران
            //foodId => آی دی غذا برای حذف

            //در صورت موفقیت در عملیات باید ترو ریترن شود
            //return true
            
            return {mock:true}
        },
        async edit_food_image({restoranId,foodId,imageFile}){
            //ویرایش تصویر غذا
            return {mock:true}
        },
        async edit_restoran_image({restoranId,imageFile}){
            //ویرایش تصویر رستوران
            
            return {mock:true}
        },
        async edit_restoran_logo({restoranId,imageFile}){
            //ویرایش لوگوی رستوران
            
            return {mock:true}
        }

    }
}

export function getMock({helper}){
    let Storage = AIOStorage('iranfoodbackoffice')
    return {
        get_restorans(){
            let res = Storage.load({name:'restorans',def:[]})
            return res;
        },
        add_restoran(newRestoran){
            let restorans = Storage.load({name:'restorans',def:[]});
            let id = 'res' + Math.round(Math.random() * 1000000);
            newRestoran = {...newRestoran,id}
            let newRestorans = [newRestoran,...restorans];
            Storage.save({name:'restorans',value:newRestorans})
            return {id};
        },
        edit_restoran(restoran){
            let restorans = Storage.load({name:'restorans',def:[]});
            restorans = restorans.map((o)=>{
                if(o.id === restoran.id){return restoran}
                return o
            })
            Storage.save({name:'restorans',value:restorans})
            return true;
        },
        remove_restoran(restoranId){
            let restorans = Storage.load({name:'restorans',def:[]});
            restorans = restorans.filter((o)=>{
                if(o.id === restoranId){return false}
                return o
            })
            Storage.save({name:'restorans',value:restorans})
            return true;
        },
        get_restoran_menu(restoranId){
            let foods = Storage.load({name:`restoran_${restoranId}_menu`,def:[]});
            return foods
        },
        add_food({restoranId,food}){
            let foods = Storage.load({name:`restoran_${restoranId}_menu`,def:[]});
            let id = 'food' + Math.round(Math.random() * 1000000);
            let newFood = {...food,id}
            let newFoods = [newFood,...foods];
            Storage.save({name:`restoran_${restoranId}_menu`,value:newFoods});
            return {id};
        },
        edit_food({restoranId,food}){
            let foods = Storage.load({name:`restoran_${restoranId}_menu`,def:[]});
            let newFood = {...food}
            let newFoods = foods.map((o)=>o.id === newFood.id?newFood:o);
            Storage.save({name:`restoran_${restoranId}_menu`,value:newFoods});
            return true;
        },
        remove_food({restoranId,foodId}){
            let foods = Storage.load({name:`restoran_${restoranId}_menu`,def:[]});
            let newFoods = foods.filter((o)=>o.id !== foodId);
            Storage.save({name:`restoran_${restoranId}_menu`,value:newFoods});
            return true;
        },
        edit_food_image({foodId,imageUrl}){
            Storage.save({name:`food_${foodId}_image`,value:imageUrl});
            return true;
        },
        edit_restoran_image({restoranId,imageUrl}){
            Storage.save({name:`restoran_${restoranId}_image`,value:imageUrl});
            return true;
        },
        edit_restoran_logo({restoranId,imageUrl}){
            Storage.save({name:`restoran_${restoranId}_logo`,value:imageUrl});
            return true;
        }
    }
}
