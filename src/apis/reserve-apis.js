/////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////رزرو/////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
//reserve item properties
// {
//     name:string, // نام آیتم
//     description:string, // توضیحات آیتم
//     countType:boolean, //سفارس بر اساس تعداد می باشد یا خیر
//     countUnit:string, //واحد تعداد مثل نفر یا عدد فقط برای نمایش یو آی
//     minCount:number, //حداقل تعداد قابل سفارش
//     maxCount:number, //حداکثر تعداد قابل سفارش
//     timeType:"hour"|"day", // واحد زمانی آیتم روز یا ساعت
//     price:number, // قیمت واحد
//     returnAmount:boolean, //آیا رقم روی فاکتور بر می گردد؟
//     preOrderTime:number//مدت زمانی که طول میکشه سفارش آماده بشه به ساعت
// }
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
import AIOStorage from './../npm/aio-storage/aio-storage';
export default function reserveApis({ baseUrl,Axios,helper }) {
    function MapReserveItems(data = []){
        try{
            return data.map((o) => {
                return {
                    id:o.id,
                    name: o.name, // نام آیتم
                    description: o.description, // توضیحات آیتم
                    countType: o.countType || false, //سفارس بر اساس تعداد می باشد یا خیر
                    minCount: o.minLimitCount, //حداقل تعداد قابل سفارش
                    maxCount: o.maxLimitCount, //حداکثر تعداد قابل سفارش
                    timeType: o.isDaily ? "day" : "hour", // واحد زمانی آیتم روز یا ساعت
                    price: o.price, // قیمت واحد
                    returnAmount: o.isReturnAmount, //آیا رقم روی فاکتور بر می گردد؟
                    preOrderTime: isNaN(o.preOrderTime)?0:o.preOrderTime//مدت زمانی که طول میکشه سفارش آماده بشه
                }
            });
        }
        catch(error){
            helper.showAlert({type:'error',text:'map reserve items error',subtext:error.message});
            return []
        }
    }
    return {
        get_restoran_reserve_items: async ({ restoranId }) => {
            let url = `${baseUrl}/RestaurantReservasionPlan/Search`;
            //create from searchObject
            //let { pageSize = 1000, pageNumber = 1, selected_tags = [], searchValue } = searchObject;
            let body = {

                // RecordsPerPage: pageSize,// تعداد ریزالت در هر صفحه
                // pageNumber: pageNumber,// شماره صفحه
                restaurantId: 30// array id tags
            }
            let response = await Axios.post(url, body);
            let data = response.data.data.items
            debugger
            let result = MapReserveItems(data)
            return { response, result }
        },
        add_or_edit_restoran_reserve_item: async ({ restoranId, item, type }) => {
            //restoranId آی دی رستوران
            //item آیتم رزرو رستوران برای افزودن
            //type "add" | "edit"
            debugger
            let body = {
                "id": type === 'edit' ? item.id : undefined,
                "Id": type === 'edit' ? item.id : undefined,
                "name": item.name,
                "restaurantId": 30,//restoranId
                "description": item.description,
                "maxLimitCount": item.maxCount || 0,
                "minLimitCount": item.minCount || 0,
                "countType": item.countType,
                "guestCount": 0,
                "price": item.price,
                "isReturnAmount": item.returnAmount,
                "PreOrderTimeCount": item.preOrderTime || 0,
                "isDaily": item.timeType === 'day'?true:false
            }
            let response, result;
            if (type === 'add') {
                response = await Axios.post(`${baseUrl}/RestaurantReservasionPlan/Create`, body);
                result = { id: response.data.data }
            }
            else if (type === 'edit') {
                response = await Axios.put(`${baseUrl}/RestaurantReservasionPlan/Edit`, body);
                result = true
            }
            return { response, result }


            return { mock: true }
        },
        remove_restoran_reserve_item: async ({ restoranId, itemId }) => {
            let url = `${baseUrl}/RestaurantReservasionPlan?Id=${itemId.toString()}`;
            let response = await Axios.delete(url);
            return { response, result: true }
        },
        get_restoran_reserve_capacity: async ({ restoranId, itemId }) => {
            return { mock: true }

            // let response = await Axios.get(url, body);
            // let result = []; // ریزالت باید یک آرایه 24 تایی باشد که هر عضو اون عدد ظرفیت باقی مانده ی آیتم رزرو رو نشون میده  
            // example of result
            //[
            //     0, //ساعت 0
            //     0, //ساعت 1
            //     0, //ساعت 2
            //     0, //ساعت 3
            //     0, //ساعت 4
            //     0, //ساعت 5
            //     0, //ساعت 6
            //     0, //ساعت 7
            //     0, //ساعت 8
            //     0, //ساعت 9
            //     0, //ساعت 10
            //     0, //ساعت 11
            //     0, //ساعت 12
            //     0, //ساعت 13
            //     0, //ساعت 14
            //     0, //ساعت 15
            //     0, //ساعت 16
            //     0, //ساعت 17
            //     0, //ساعت 18
            //     0, //ساعت 19
            //     0, //ساعت 20
            //     0, //ساعت 21
            //     0, //ساعت 22
            //     0, //ساعت 23
            // ]
            // return {response,result}
        },

    }
}


const getMockApis = {
    get_restoran_reserve_items(parameter,{mockStorage}){
        let storage = AIOStorage('ifgreservemockserver');
        let res = storage.load({name:'items',def:[]})
        return {result:res}
    },
    add_or_edit_restoran_reserve_item({restoranId,item,type},{mockStorage}){
        let storage = AIOStorage('ifgreservemockserver');
        let items = storage.load({name:'items',def:[]})
        if(type === 'add'){
            let id = 'sss' + Math.round(Math.random() * 10000000)
            item.id = id;
            items = items.concat(item);
            storage.save({name:'items',value:items})
            return {result:{id}}
        }
        else {
            items = items.map((o)=>o.id === item.id?item:o);
            storage.save({name:'items',value:items})
        }
        
    },
    remove_restoran_reserve_item({restoranId,itemId},{mockStorage}){
        let storage = AIOStorage('ifgreservemockserver');
        let items = storage.load({name:'items',def:[]})
        items = items.filter((o)=>o.id !== itemId);
        storage.save({name:'items',value:items})
    },
    get_restoran_reserve_capacity(parameter,{mockStorage}){
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
        return {result}
    },
    
}