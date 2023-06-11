import Axios from 'axios';
import AIOStorage from './npm/aio-storage/aio-storage';
export function getResponse({getState}){
    //let baseUrl = 'https://localhost:7203/api/v1'
    //let baseUrl = 'https://iranfoodguide.ir/api'
    let mock = true
    return {
        async get_restorans(){
            if(mock){return {mock:true}} 
        },
        async add_restoran(restoran){
            if(mock){return {mock:true}} 
        },
        async edit_restoran(restoran){
            if(mock){return {mock:true}} 
        },
        async remove_restoran(restoranId){
            if(mock){return {mock:true}} 
        },
        async get_restoran_menu(restoranId){
            if(mock){return {mock:true}} 
        },
        async edit_restoran_menu({restoranId,menu}){
            if(mock){return {mock:true}} 
        },

    }
}

export function getMock({helper}){
    let Storage = AIOStorage('iranfoodbackoffice')
    return {
        get_restorans(){
            let res = Storage.load({name:'restorans',def:[]})
            return res;
        },
        add_restoran(restoran){
            let restorans = Storage.load({name:'restorans',def:[]});
            let id = 'res' + Math.round(Math.random() * 1000000);
            let newRestoran = {...restoran,id,added:true}
            restorans.push(newRestoran);
            Storage.save({name:'restorans',value:restorans})
            return newRestoran;
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
            return foods; 
        },
        edit_restoran_menu({restoranId,menu}){
            Storage.save({name:`restoran_${restoranId}_menu`,value:menu});
            return true;
        }

    }
}
