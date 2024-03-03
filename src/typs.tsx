import React from 'react'
import { I_APIClass } from "./apis/APIClass"
import { I_AIOLogin } from "./npm/aio-login"

/////aio-service
export type I_AIOService_request = (obj:{
    api:string,parameter?:any,loading?:boolean,onCatch?:I_AIOService_onCatch,
    message?:{error?:boolean | string,success?:boolean | string},
    description?:string,getError?:I_AIOService_getError,def?:any,
    cache?:{time:number,name:string},
    onSuccess?:(any)=>void,
    onError?:(message:string)=>void
})=>any
export type I_apis = {
    request:I_AIOService_request,
    setToken:(token:string)=>void,
    getCache:(key:string)=>any,
    setCache:(key:string,value:any)=>void,
    setProperty:(key:string,value:any)=>void,
}
export type I_AIOService_onCatch = (error:any)=>string | undefined
export type I_AIOService_getError = (response:any)=>string | undefined
export type I_apiFunctionReturn = {result:any,response?:any}
/////aio-service

/////rsa
export type I_rsa_addModal = {
    position?:'fullscreen' | 'center' | 'popover' | 'left' | 'right' | 'top' | 'bottom',
    id?:string,
    attrs?:any,
    header?:false | {
        title:string,subtitle?:string,attrs?:any,backButton?:boolean,
        buttons?:[text:React.ReactNode,attrs?:any][]
    },
    body:{render:(p:{state:any,setState:(p:any)=>void})=>React.ReactNode,attrs?:any},
    footer?:{
        attrs?:any,
        buttons?:[text:React.ReactNode,attrs?:any][]
    }
}
export type I_rsa_addSnakebar = {
    type:'info' | 'warning' | 'error' | 'success',
    text:string,
    subtext?:string,
    time?:number,
    rtl?:boolean,
    action?:{text:string,onClick:()=>void},
    onClose?:false | (()=>void)
}
export type I_rsa_addConfirm = {
    title:string,
    text:string,
    onSubmit:()=>Promise<boolean>,
    subtitle?:string,
    submitText?:string,
    canselText?:string,
    onCansel?:()=>void,
    attrs?:any
}
export type I_rsa = {
    setNavId:(navId:string)=>void,
    addModal:(p:I_rsa_addModal)=>void,
    removeModal:(id?:string)=>void,
    addSnakebar:(p:I_rsa_addSnakebar)=>void,
    closeSide:()=>void,
    getNavId:()=>string,
    addConfirm:(p:I_rsa_addConfirm)=>void,
    openSide:()=>void,
    render:()=>React.ReactNode,
    changeTheme: (index:number) => void
}
export type I_rsa_navItem = {
    id:string,
    text:string | (()=>string),
    icon?:React.ReactNode | (()=>React.ReactNode),
    items?:I_rsa_navItem[],
    show?:()=>boolean,
    render?:()=>React.ReactNode
}
export type I_rsa_nav = {
    items:()=>I_rsa_navItem[]
    id?:string,
    header?:()=>React.ReactNode,
    footer?:()=>React.ReactNode,
    cache?:boolean
}
export type I_rsa_sideItem = {
    icon?:React.ReactNode | (()=>React.ReactNode),
    text:string,
    attrs?:any,
    show?:()=>boolean,
    onClick:Function
}
export type I_rsa_side = {
    items:I_rsa_sideItem[] | (()=>I_rsa_sideItem[]),
    header?:()=>React.ReactNode,
    footer?:()=>React.ReactNode,
    attrs?:any
}
export type I_rsa_props = {
    rtl:boolean,maxWidth:number,id:string,title?:((nav:I_rsa_nav)=>string) | false,
    nav:I_rsa_nav,side?:I_rsa_side,
    headerContent?:()=>React.ReactNode,
    body:(activeNavItem:I_rsa_navItem)=>React.ReactNode
    header?:false | (()=>React.ReactNode)
}
//////rsa
export type I_state_key = 'restoran_tags'|'profile'|'addresses'|'backOffice'|''|''|''|''|''|''|''|''|''|''|''|''|''|''|''|''|''|''|''|''|''|''|''|''|''|''|''|''|''|''|''|''|''|''|''|''|''
export type I_state = {
    mock:{reserve:boolean},
    Login:I_AIOLogin,
    APIS:I_APIClass,
    rsa:I_rsa,
    mockStorage:any,
    restoran_tags:I_tag[],
    food_tags:I_tag[],
    profile: I_profile | false,
    addresses:I_address[],
    changeStore:(key:I_state_key,value:any,caller:string)=>void,
    wallet:number,
    restoran_sort_options:I_restoran_sort_option[],
    restoranToClient:(p:I_restoran_server)=>I_restoran
    foodToClient:(p:I_food_server)=>I_food[]
    foodToServer:(food:I_food,type:'add' | 'edit',restoranId:I_restoranId)=>I_foodToServer_r,
    discounts:I_discount[]
}
export type I_foodToServer_r = {
    id?: I_foodId,
    title: string,
    food: {
        //"types": food.tags.map((o) => { return { typeId: o } }),
        types: any,
        title: string,
        latinTitle: string,
        description: string
    },
    restaurantId: I_restoranId,
    parentFoodId: I_foodId,
    menuCategoryTitle: string,
    price: number,
    description: string,
    isFavorite: boolean,
    discount: number
  }
export type I_tag = {
    id:number,name:string
}
export type I_tag_type = 'restoran' | 'food'
export type I_profile = {
    id:number,firstName:string,lastName:string,sheba:string,email:string
}
export type I_profile_server = {
    id:number,firstName:string,lastName:string,sheba:string,email:string
}
export type I_address = {
    title: string,
    address: string,
    number: string,
    unit: string,
    floor: string,
    id: any,
    description: string,
    phone: string,
    latitude:number,
    longitude:number
}
export type I_address_server = any
export type I_discount = {
    amounts:I_discount_amount[],
    code:string,
    endDate:string,
    order:number,
    description:string,
}
export type I_discount_amount = {percent?:number,amount?:number}
export type I_restoran_sort_option = {text:I_restoran_sort_text,value:I_restoran_sort_value}
export type I_restoran_sort_text = 'رستوران اقتصادی'|'بالاترین امتیاز'|'نزدیک ترین'|'جدیدترین'|'گرانترین';
export type I_restoran_sort_value = '0'|'1'|'2'|'3'|'4';

export type I_restoran = {
    id: I_restoranId,
    name: string, 
    latitude: number,
    longitude: number,
    phone: string,
    image: string,
    imageId:I_imageId,
    logo: string,
    logoId:I_imageId,
    address: string,
    deliveryTime: number,
    rate?:number,
    ifRate:number,
    ifComment:string,
    distance?:number,
    tags: number[],
    startTime: number, //Number bewtween (1 and 24)
    endTime: number, //Number bewtween (1 and 24) 
    tax: number
}
export type I_restoran_server = {
    id:number,
    title:string,
    address:{phoneNumber:string,latitude:number,longitude:number,address:string},
    image:string,
    imageId:I_imageId,
    logo:string,
    deliveryTime:number,
    types:{typeId:number}[],
    workingTimes:{startTime:number,endTime:number}[],
    tax:number
}
export type I_food = {
    optionType:'product',
    id:I_foodId,
    name:string,
    images:string[],
    description:string,
    data:{
        imageId:I_imageId,
        tags:I_tagId[],
        dailyInStock:number,
        parentId:I_foodId,
        menuCategory:string,
    },
    cartInfo:{
        price:number,
        discountPercent:{}[],
        inStock:number
    }
}
export type I_food_server = {
    id:I_foodId,
    name:string,
    parentFoodId?:null | I_foodId,
    menuCategoryTitle:string,
    image:string,
    price:number,
    discountPercent:number,
    description:string,
    types:{typeId:number}[],
}
export type I_imageId = any;
export type I_restoranId = number;
export type I_foodId = number;
export type I_tagId = number;
export type I_coupon = {id:any,title:string,discountPercent?:number,discount?:number,maxDiscount?:number,minCartAmount?:number}
export type I_reserveItem = {
    id:any,
    images:any[],
    name:string,
    description?:string,
    data:{
        returnAmount:boolean,
        preOrderTime:number,
        price:number,
        minCount?:number, maxCount?:number, countUnit?:string,
        timeType:'hour'|'day',
        countType:boolean
    }
}
export type I_reserveQuantity = {count:number,hours:number[],date:string}
export type I_deliveryType = 'ارسال با پیک' | 'دریافت حضوری';
export type I_comment = { name:string, date:string, comment:string }