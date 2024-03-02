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
    
    async function ReserveItemToServer(item,type){
        try{
            return {
                "images":item.images.map((o)=>{return {imageId:o.id}}) || [],
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
        add_or_edit_restoran_reserve_item: async ({ restoranId, item, type },{mock}) => {
            if(mock.reserve){return getMockApis.add_or_edit_restoran_reserve_item({item,type})}
            //restoranId آی دی رستوران
            //item آیتم رزرو رستوران برای افزودن
            //type "add" | "edit"
            debugger
            let body = await ReserveItemToServer(item,type);
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

    }
}


const getMockApis = {
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
    
}