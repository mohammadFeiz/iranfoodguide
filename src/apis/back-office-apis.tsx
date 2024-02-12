import { I_food, I_foodId, I_food_server, I_restoran, I_restoranId, I_restoran_server, I_state, I_tag_type } from "../typs";
export type I_add_or_edit_food_p = { restoranId:I_restoranId, newFood:I_food, type:'add' | 'edit' }
export type I_add_or_edit_food_r = {id:I_foodId}
export type I_remove_food_p = { restoranId:I_restoranId, foodId:I_foodId }
export type I_remove_food_r = boolean
export default function backOfficeApis({baseUrl,Axios}){
    let apis = {
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
        
    }
    return apis
}

type I_MockApis = {
    add_or_edit_food:(p:I_add_or_edit_food_p,appState:I_state)=>{result:I_add_or_edit_food_r},
    remove_food:(p:I_remove_food_p,appState:I_state)=>{result:I_remove_food_r}
}
const MockApis:I_MockApis = {
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
    
}