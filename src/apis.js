import Axios from 'axios';
export default function Apis({getState,token,getDateAndTime,showAlert,AIOServiceShowAlert,baseUrl}){
    return {
        async sabte_shomare_tamas(shomare_tamas){
    
            //نمونه درخواست get
            //let res = await Axios.get(url);
            //نمونه درخواست post
            let url='https://iranfoodguide.ir/api/People/AddMobileNumber';
           // let url='https://localhost:7203/api/People/AddMobileNumber';

            try{
                let res = await Axios.post(url,
                {
                        "PersonId":1,
                        "MobileNumber": shomare_tamas,
                        "IsDefault": true
                });

                if(res.data.isSuccess){
                    AIOServiceShowAlert({
                        type:'success',
                        text:'شماره شما با موفقیت ثبت شد',
                        subtext:res.data.Message
                    })
                    return true
                }
                else {
                    AIOServiceShowAlert({
                        type:'error',
                        text:'شماره ثبت نشد',
                        subtext:res.data.Message
                    })
                    return false
                }
            }
            catch(error){

            if(error.code=='ERR_NETWORK')    
            {
                AIOServiceShowAlert({
                    type:'error',
                    text:'شماره ثبت نشد',
                    subtext:'مشکل برقراری اینترنت'
                })
            }
            else
            {
                AIOServiceShowAlert({
                    type:'error',
                    text:'شماره ثبت نشد',
                    subtext:error.response.data.Message
                })
            }
                return false
            }
            
              
        },
        async getProfile(){
            //درصورت خطا ریترن متن خطا
            return {
                firstname:'احمد',//نام
                lastname:'بهرامی',//نام خانوادگی
                mobile:'09123534314',//شماره همراه
                email:'feiz.ms@gmail.com',//آدرس ایمیل
                sheba:'1234567',//شماره شبا
                addressId:'0',//آی دی آدرس منتخب
                addresses:[//لیست آدرس ها
                  {
                    title:'خانه',
                    address:'آدرس  یبلیلیبل یبل یبل یبل یبل یبل یبل یبل یبل یبل یبل یبل یبلی غاقف غاقفغ بفعغ قفغ قفغ قفغ 1',
                    number:30,
                    unit:4,
                    floor:2,
                    id:'0',
                    description:'',
                    phone:'02188050006'
                  }
                ]
            }
        },
        async takhfif_ha(){
            return [
                {
                    amounts:[{percent:10,amount:100000}],description:'تخفیف خرید شیرینی',
                    code:'31234545332343',endDate:'1401/12/21/13/0',order:0
                },
                {
                    amounts:[{percent:10},{percent:15},{percent:20}],description:'تخفیف خرید شیرینی',
                    code:'31234545332343',endDate:'1401/12/21/13/0',order:2
                },
                {
                    amounts:[{percent:10,amount:200000},{percent:20,amount:200000}],description:'تخفیف خرید شیرینی',
                    code:'31234545332343',endDate:'1401/12/21/13/0',order:0
                },
                {
                    amounts:[{amount:50000}],description:'تخفیف خرید شیرینی',
                    code:'31234545332343',endDate:'1401/12/21/13/0',order:0
                },
            ]
        },
        async addAddress(model){
            //درصورت خطا ریترن متن خطا
            return {
                ...model,
                id:'address' + Math.random()
            }
        },
        async editAddress(model){
            //درصورت خطا ریترن متن خطا
            return model
        },
        async safheye_sefaresh(){
            return [
                {
                    type:'billboard',
                    srcs:[frame210,frame210,frame210,frame210]
                },
                {
                    type:'categories',
                    categories:[
                        { name: 'فست فود', src: cat_fastfood_src, id: '0' },
                        { name: 'ایرانی', src: cat_irani_src, id: '1' },
                        { name: 'صبحانه', src: cat_sobhane_src, id: '2' },
                        { name: 'سالاد بار', src: cat_saladbar_src, id: '3' },
                        { name: 'شیرینی', src: cat_shirini_src, id: '4' },
                        { name: 'آجیل', src: cat_ajil_src, id: '5' },
                        { name: 'آبمیوه بستنی', src: cat_abmive_src, id: '6' },
                        { name: 'کافه', src: cat_kafe_src, id: '7' },
                    ]
                },
                {
                    type:'slider',
                    name:'رستوران های تخفیف دار',
                    items:[
                        {
                            name:'رستوران شاندیز گالریا',
                            image:shandiz_image,
                            logo:shandiz_logo,
                            rate:3.4,
                            distance:3,
                            time:35,
                            tags:['ایرانی ','سنتی','فست فود','ملل']
                        },
                        {
                            name:'رستوران شاندیز گالریا',
                            image:shandiz_image,
                            logo:shandiz_logo,
                            rate:3.4,
                            distance:3,
                            time:35,
                            tags:['ایرانی ','سنتی','فست فود','ملل']
                        },
                        {
                            name:'رستوران شاندیز گالریا',image:shandiz_image,logo:shandiz_logo,rate:3.4,distance:3,time:35,
                            tags:['ایرانی ','سنتی','فست فود','ملل']
                        }
                    ]
                },
                {
                    type:'slider',
                    name:'نزدیک ترین ها به شما',
                    items:[
                        {
                            name:'رستوران شاندیز گالریا',image:shandiz_image,logo:shandiz_logo,rate:3.4,distance:3,time:35,
                            tags:['ایرانی ','سنتی','فست فود','ملل']
                        },
                        {
                            name:'رستوران شاندیز گالریا',image:shandiz_image,logo:shandiz_logo,rate:3.4,distance:3,time:35,
                            tags:['ایرانی ','سنتی','فست فود','ملل']
                        },
                        {
                            name:'رستوران شاندیز گالریا',image:shandiz_image,logo:shandiz_logo,rate:3.4,distance:3,time:35,
                            tags:['ایرانی ','سنتی','فست فود','ملل']
                        }
                    ]
                },
                {
                    type:'slider',
                    name:'غذا های تخفیف دار',
                    cardSize:{width:160},
                    header:{
                        maxDiscount:15,
                        endDate:new Date().getTime() + (6 * 60 * 60 * 1000)
                    },
                    items:[
                        {
                            name:'پاستا آلفردو ',shopName:'رستوران شاندیز گالریا',rate:3.4,
                            price:210000,discount:15,image:pasta_alferedo
                        },
                        {
                            name:' rtyrty rty rty rtyپاستا آلفردو ',shopName:'رستوران شاندیز گالریا',rate:3.4,
                            price:210000,discount:15,image:pasta_alferedo
                        },
                        {
                            name:'پاستا آلفردو ',shopName:'رستوران شاندیز گالریا',rate:3.4,
                            price:210000,discount:15,image:pasta_alferedo
                        },
                        {
                            name:'پاستا آلفردو ',shopName:'رستوران شاندیز گالریا',rate:3.4,
                            price:210000,discount:15,image:pasta_alferedo
                        }
                    ]
                },
                {
                    type:'slider',
                    name:'جدید ترین رزروی ها',
                    items:[
                        {
                            name:'رستوران قایم',distance:3,rate:3.4,logo:ghaem_logo,image:ghaem_image,
                            details:[
                               { 
                                title:'نوع میز',  
                                value:'میز و آلاچیق'  
                               },
                               { 
                                title:'مدت زمان تاخیر',  
                                value:'15 دقیقه'  
                               },
                               { 
                                title:'قابلیت مراسم',  
                                value:'تولد و VIP'  
                               }
                            ],
                            tags:['ایرانی','فست فود','ملل','قلیان','موسیقی زنده']
                        },
                        {
                            name:'رستوران قایم',distance:3,rate:3.4,logo:ghaem_logo,image:ghaem_image,
                            details:[
                                ['نوع میز','میز و آلاچیق'],['مدت زمان تاخیر','15 دقیقه'],['قابلیت مراسم','تولد و VIP']
                            ],
                            tags:['ایرانی','فست فود','ملل','قلیان','موسیقی زنده']
                        },
                        {
                            name:'رستوران قایم',distance:3,rate:3.4,logo:ghaem_logo,image:ghaem_image,
                            details:[
                                { 
                                 title:'نوع میز',  
                                 value:'میز و آلاچیق'  
                                },
                                { 
                                 title:'مدت زمان تاخیر',  
                                 value:'15 دقیقه'  
                                },
                                { 
                                 title:'قابلیت مراسم',  
                                 value:'تولد و VIP'  
                                }
                             ],
                            tags:['ایرانی','فست فود','ملل','قلیان','موسیقی زنده']
                        },
                        {
                            name:'رستوران قایم',distance:3,rate:3.4,logo:ghaem_logo,image:ghaem_image,
                            details:[
                                { 
                                 title:'نوع میز',  
                                 value:'میز و آلاچیق'  
                                },
                                { 
                                 title:'مدت زمان تاخیر',  
                                 value:'15 دقیقه'  
                                },
                                { 
                                 title:'قابلیت مراسم',  
                                 value:'تولد و VIP'  
                                }
                             ],
                            tags:['ایرانی','فست فود','ملل','قلیان','موسیقی زنده']
                        },
                        {
                            name:'رستوران قایم',distance:3,rate:3.4,logo:ghaem_logo,image:ghaem_image,
                            details:[
                                { 
                                 title:'نوع میز',  
                                 value:'میز و آلاچیق'  
                                },
                                { 
                                 title:'مدت زمان تاخیر',  
                                 value:'15 دقیقه'  
                                },
                                { 
                                 title:'قابلیت مراسم',  
                                 value:'تولد و VIP'  
                                }
                             ],
                            tags:['ایرانی','فست فود','ملل','قلیان','موسیقی زنده']
                        }
                    ]
                }
            ]
        }
    }
}