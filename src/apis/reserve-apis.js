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
import AIOStorage from 'aio-storage';
export default function reserveApis({ baseUrl,Axios,helper }) {
    function ReserveItemToClient(o){
        try{
            let res = {
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
        }
        catch(error){
            helper.showAlert({type:'error',text:'map reserve item error',subtext:error.message});
            return []
        }
    }
    async function ReserveItemToServer(item,type){
        try{
            return {
                "images":item.images || [],
                "id": type === 'edit' ? item.id : undefined,
                "Id": type === 'edit' ? item.id : undefined,
                "name": item.name || '',
                "restaurantId": 30,//restoranId
                "description": item.description || '',
                "maxLimitCount": item.maxCount || 0,
                "minLimitCount": item.minCount || 0,
                "countType": item.countType || false,
                "guestCount": 0,
                "price": item.price || 0,
                "isReturnAmount": item.returnAmount || false,
                "preOrderTime": item.preOrderTime || 0,
                "isDaily": item.timeType === 'day'
            }
        }
        catch(error){
            helper.showAlert({type:'error',text:'map reserve items error',subtext:error.message});
            return []
        }
    }
    return {
        get_restoran_reserve_items: async ({ restoranId },{mock}) => {
            if(mock.reserve){return getMockApis.get_restoran_reserve_items();}
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
            let result = data.map((o)=>ReserveItemToClient(o))
            return { response, result }
        },
        add_or_edit_restoran_reserve_item: async ({ restoranId, item, type },{mock}) => {
            if(mock.reserve){return getMockApis.add_or_edit_restoran_reserve_item({item,type})}
            //restoranId آی دی رستوران
            //item آیتم رزرو رستوران برای افزودن
            //type "add" | "edit"
            let body = ReserveItemToServer(item,type);
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
        },
        remove_restoran_reserve_item: async ({ restoranId, itemId },{mock}) => {
            if(mock.reserve){return getMockApis.remove_restoran_reserve_item({itemId})}
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
    get_restoran_reserve_items(){
        let storage = AIOStorage('ifgreservemockserver');
        let res = storage.load({name:'items',def:[]})
        return {result:res}
    },
    add_or_edit_restoran_reserve_item(parameter){
        let {item,type} = parameter;
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
            return {result:true}
        }
        
    },
    remove_restoran_reserve_item(parameter){
        let {itemId} = parameter
        let storage = AIOStorage('ifgreservemockserver');
        let items = storage.load({name:'items',def:[]})
        items = items.filter((o)=>o.id !== itemId);
        storage.save({name:'items',value:items})
        return {result:true}
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