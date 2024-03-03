import profileApis from "./profile-apis.tsx";
import reserveApis from "./reserve-apis";
import frame210 from '../images/Frame 210.png';
import cat_irani_src from '../images/cat-irani.png';
import cat_sobhane_src from '../images/cat-sobhane.png';
import cat_ajil_src from '../images/cat-ajil.png';
import cat_abmive_src from '../images/cat-abmive.png';
import cat_saladbar_src from '../images/cat-saladbar.png';
import cat_fastfood_src from '../images/cat-fastfood.png';
import cat_kafe_src from '../images/cat-kafe.png';
import cat_shirini_src from '../images/cat-shirini.png';
import shandiz_logo from '../images/shandiz_logo.png';
import shandiz_image from '../images/shandiz_image.png';
import pasta_alferedo from '../images/pasta_alferedo.png';
import ghaem_image from '../images/ghaem_image.png';
import ghaem_logo from '../images/ghaem_logo.png';
import AIOStorage from 'aio-storage';
import { I_imageId, I_restoran, I_restoran_server } from "../typs.tsx";

/**********************restoran data model**************************************** */
//name: String,image: String,logo: String,latitude: Number,longitude: Number,startTime:0,endTime:0,
//address: '',ifRate: 0,ifComment: '',tags: [{name:String,id:Any},...],phone: '',
/************************************************************** */
/**********************restoran_tags data model**************************************** */
//name: '',id: ''
/************************************************************** */
export default function getApiFunctions(obj) {
    let { baseUrl, Axios,helper } = obj;
    return {
        profile: profileApis(obj),
        reserve: reserveApis(obj),
        async remove_image(id,{mock}){
            if(mock.reserve){return MockApis.remove_image(id);}
            return {result:'remove_image not implemented'}
        },
        async search_restorans(parameter, { restoranToClient }) {
            let response;
            let data = [];
            let result = data.map((o:I_restoran_server)=>{let res:I_restoran = restoranToClient(o); return res});
            return { response, result }
        },
        async safheye_sefaresh() {
            return MockApis.safheye_sefaresh(helper)
            let url = `${baseUrl}/PageLayout/GetListOfFoodDelivery`;
            let body = {};
            let response = await Axios.post(url, body);
            let result = response.data.data;
            return { response, result };
        },
        async restoran_haye_mahboob(parameter, { Login }) {
            let {id} = Login.getUserInfo();
            let url = `${baseUrl}/RestaurantFavoruite/search`
            let body = { "PersonId": id }
            let response = await Axios.post(url, body);
            let result = response.data.data.items;
            return { response, result }
        },
        async getWalletHistory() {
            return MockApis.getWalletHistory(helper)
        },
        async tarikhche_ye_jostojoo() {
            return MockApis.tarikhche_ye_jostojoo()
        },
        async hazfe_tarikhche_ye_jostojoo() {
            return MockApis.hazfe_tarikhche_ye_jostojoo()
        },
        
        
    }
}

const MockApis = {
    remove_image(id){
        let storage = AIOStorage('ifgreservemockserver');
        let images = storage.load({name:'images',def:[]})
        let newImages = images.filter((o)=>o.id !== id);
        storage.save({name:'images',value:newImages})
        return {result:true}
    },
    safheye_sefaresh(res) {
        let result = [
            {
                type: 'Billboard',
                items: [{ src: frame210 }, { src: frame210 }, { src: frame210 }, { src: frame210 }]
            },
            {
                type: 'Categories',
                items: [
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
                type: 'Slider',
                name: 'رستوران های تخفیف دار',
                items: [
                    {
                        name: 'رستوران شاندیز گالریا', image: shandiz_image, logo: shandiz_logo,
                        rate: 3.4, distance: 3, time: 35, tags: ['ایرانی ', 'سنتی', 'فست فود', 'ملل']
                    },
                    {
                        name: 'رستوران شاندیز گالریا', image: shandiz_image, logo: shandiz_logo,
                        rate: 3.4, distance: 3, time: 35, tags: ['ایرانی ', 'سنتی', 'فست فود', 'ملل']
                    },
                    {
                        name: 'رستوران شاندیز گالریا', image: shandiz_image, logo: shandiz_logo, rate: 3.4, distance: 3, time: 35,
                        tags: ['ایرانی ', 'سنتی', 'فست فود', 'ملل']
                    }
                ]
            },
            {
                type: 'Slider',
                name: 'نزدیک ترین ها به شما',
                items: [
                    {
                        name: 'رستوران شاندیز گالریا', image: shandiz_image, logo: shandiz_logo, rate: 3.4, distance: 3, time: 35,
                        tags: ['ایرانی ', 'سنتی', 'فست فود', 'ملل']
                    },
                    {
                        name: 'رستوران شاندیز گالریا', image: shandiz_image, logo: shandiz_logo, rate: 3.4, distance: 3, time: 35,
                        tags: ['ایرانی ', 'سنتی', 'فست فود', 'ملل']
                    },
                    {
                        name: 'رستوران شاندیز گالریا', image: shandiz_image, logo: shandiz_logo, rate: 3.4, distance: 3, time: 35,
                        tags: ['ایرانی ', 'سنتی', 'فست فود', 'ملل']
                    }
                ]
            },
            {
                type: 'Slider', name: 'غذا های تخفیف دار', cardSize: { width: 160 },
                header: { maxDiscount: 15, endDate: new Date().getTime() + (6 * 60 * 60 * 1000) },
                items: [
                    {
                        name: 'پاستا آلفردو ', shopName: 'رستوران شاندیز گالریا', rate: 3.4,
                        price: 210000, discount: 15, image: pasta_alferedo, tags: [], id: '4232'
                    },
                    {
                        name: 'پاستا آلفردو ', shopName: 'رستوران شاندیز گالریا', rate: 3.4, id: '423rwe',
                        price: 210000, discount: 15, image: pasta_alferedo, tags: []
                    },
                    {
                        name: 'پاستا آلفردو ', shopName: 'رستوران شاندیز گالریا', rate: 3.4, id: '423456452',
                        price: 210000, discount: 15, image: pasta_alferedo, tags: []
                    },
                    {
                        name: 'پاستا آلفردو ', shopName: 'رستوران شاندیز گالریا', rate: 3.4, id: '42354232',
                        price: 210000, discount: 15, image: pasta_alferedo, tags: []
                    }
                ]
            },
            {
                type: 'Slider', name: 'جدید ترین رزروی ها',
                items: [
                    {
                        name: 'رستوران قایم', distance: 3, rate: 3.4, logo: ghaem_logo, image: ghaem_image,
                        details: [
                            { title: 'نوع میز', value: 'میز و آلاچیق' },
                            { title: 'مدت زمان تاخیر', value: '15 دقیقه' },
                            { title: 'قابلیت مراسم', value: 'تولد و VIP' }
                        ],
                        tags: ['ایرانی', 'فست فود', 'ملل', 'قلیان', 'موسیقی زنده']
                    },
                    {
                        name: 'رستوران قایم', distance: 3, rate: 3.4, logo: ghaem_logo, image: ghaem_image,
                        details: [
                            { title: 'نوع میز', value: 'میز و آلاچیق' },
                            { title: 'مدت زمان تاخیر', value: '15 دقیقه' },
                            { title: 'قابلیت مراسم', value: 'تولد و VIP' }
                        ],
                        tags: ['ایرانی', 'فست فود', 'ملل', 'قلیان', 'موسیقی زنده']
                    },
                    {
                        name: 'رستوران قایم', distance: 3, rate: 3.4, logo: ghaem_logo, image: ghaem_image,
                        details: [
                            { title: 'نوع میز', value: 'میز و آلاچیق' },
                            { title: 'مدت زمان تاخیر', value: '15 دقیقه' },
                            { title: 'قابلیت مراسم', value: 'تولد و VIP' }
                        ],
                        tags: ['ایرانی', 'فست فود', 'ملل', 'قلیان', 'موسیقی زنده']
                    },
                    {
                        name: 'رستوران قایم', distance: 3, rate: 3.4, logo: ghaem_logo, image: ghaem_image,
                        details: [
                            { title: 'نوع میز', value: 'میز و آلاچیق' },
                            { title: 'مدت زمان تاخیر', value: '15 دقیقه' },
                            { title: 'قابلیت مراسم', value: 'تولد و VIP' }
                        ],
                        tags: ['ایرانی', 'فست فود', 'ملل', 'قلیان', 'موسیقی زنده']
                    },
                    {
                        name: 'رستوران قایم', distance: 3, rate: 3.4, logo: ghaem_logo, image: ghaem_image,
                        details: [
                            { title: 'نوع میز', value: 'میز و آلاچیق' },
                            { title: 'مدت زمان تاخیر', value: '15 دقیقه' },
                            { title: 'قابلیت مراسم', value: 'تولد و VIP' }
                        ],
                        tags: ['ایرانی', 'فست فود', 'ملل', 'قلیان', 'موسیقی زنده']
                    }
                ]
            }
        ]
        return { result }
    },
    restoran_haye_mahboob() {
        let result = [
            {
                name: 'رستوران شاندیز گالریا',
                image: shandiz_image,
                logo: shandiz_logo,
                rate: 3.4,
                distance: 3,
                time: 35,
                tags: ['ایرانی ', 'سنتی', 'فست فود', 'ملل']
            }
        ]
        return { result }
    },
    getWalletHistory(helper) {
        let data = [
            { date: new Date().getTime(), amount: '123456789', type: 'in' },
            { date: new Date().getTime(), amount: '123456789', type: 'out' },
            { date: new Date().getTime(), amount: '123456789', type: 'in' },
            { date: new Date().getTime(), amount: '123456789', type: 'out' },
            { date: new Date().getTime(), amount: '123456789', type: 'in' },
        ]
        let result = data.map((o) => {
            let { date, time } = helper.getDateAndTime(o.date)
            return { ...o, date, time }
        })
        return { result }
    },
    search_restorans({ pageSize, pageNumber, selectedCategories, selectedSort, searchValue }, { mockStorage }) {
        let restorans = mockStorage.load({ name: 'restorans', def: [] })
        return { result: restorans }
    },
    tarikhche_ye_jostojoo() {
        let result = ['برگر', 'پیتزا', 'پاستا']
        return { result }
    },
    hazfe_tarikhche_ye_jostojoo() {
        return { result: true }
    },
    // restoran_menu(){
    //     let result = [
    //         {
    //             name:'کباب',
    //             image:undefined,
    //             items:[
    //                 {
    //                     id:'534534',
    //                     name: 'کباب کوبیده یک سیخ', rate: 3.4,
    //                     price: 60000, discountPercent: 10, image: pasta_alferedo, tags: ['کبابی','ایرانی'],
    //                     description:'150 گرم گوشت مخلوط گوسفندی و گوساله',
    //                     items:[
    //                         {
    //                             rates:[
    //                                 {text:'کیفیت',value:4},
    //                                 {text:'حجم',value:3},
    //                                 {text:'سلامت',value:5}
    //                             ],
    //                             details:[
    //                                 ['نوع برنج','ایرانی'],
    //                                 ['نوع گوشت','گوساله']
    //                             ],
    //                             commentsLength:24,
    //                             review:'این غذا خیلی غذای خوبی است . برای مشکل پسندان صو در صو پیشنهاد میشه . در این غذا ار مرغوب ترین متریال موجود در بازار استفاده شده است',
    //                             id:'456473456',
    //                             name: 'کباب لقمه زیر مجموعه 1', rate: 3.4,
    //                             price: 60000, discountPercent: 10, image: pasta_alferedo, tags: ['کبابی','ایرانی'],
    //                             description:'150 گرم گوشت مخلوط گوسفندی و گوساله'
    //                         },
    //                         {
    //                             rates:[
    //                                 {text:'کیفیت',value:4},
    //                                 {text:'حجم',value:3},
    //                                 {text:'سلامت',value:5}
    //                             ],
    //                             details:[
    //                                 ['نوع برنج','ایرانی'],
    //                                 ['نوع گوشت','گوساله']
    //                             ],
    //                             commentsLength:24,
    //                             review:'این غذا خیلی غذای خوبی است . برای مشکل پسندان صو در صو پیشنهاد میشه . در این غذا ار مرغوب ترین متریال موجود در بازار استفاده شده است',
    //                             id:'64557865654346',
    //                             name: 'کباب لقمه زیر مجموعه 2', rate: 3.4,
    //                             price: 60000, discountPercent: 10, image: pasta_alferedo, tags: ['کبابی','ایرانی'],
    //                             description:'150 گرم گوشت مخلوط گوسفندی و گوساله'
    //                         },
    //                         {
    //                             rates:[
    //                                 {text:'کیفیت',value:4},
    //                                 {text:'حجم',value:3},
    //                                 {text:'سلامت',value:5}
    //                             ],
    //                             details:[
    //                                 ['نوع برنج','ایرانی'],
    //                                 ['نوع گوشت','گوساله']
    //                             ],
    //                             commentsLength:24,
    //                             review:'این غذا خیلی غذای خوبی است . برای مشکل پسندان صو در صو پیشنهاد میشه . در این غذا ار مرغوب ترین متریال موجود در بازار استفاده شده است',
    //                             id:'6455458756878346',
    //                             name: 'کباب لقمه زیر مجموعه 3', rate: 3.4,
    //                             price: 60000, discountPercent: 10, image: pasta_alferedo, tags: ['کبابی','ایرانی'],
    //                             description:'150 گرم گوشت مخلوط گوسفندی و گوساله'
    //                         },
    //                         {
    //                             rates:[
    //                                 {text:'کیفیت',value:4},
    //                                 {text:'حجم',value:3},
    //                                 {text:'سلامت',value:5}
    //                             ],
    //                             details:[
    //                                 ['نوع برنج','ایرانی'],
    //                                 ['نوع گوشت','گوساله']
    //                             ],
    //                             commentsLength:24,
    //                             review:'این غذا خیلی غذای خوبی است . برای مشکل پسندان صو در صو پیشنهاد میشه . در این غذا ار مرغوب ترین متریال موجود در بازار استفاده شده است',
    //                             id:'75663464563',
    //                             name: 'کباب لقمه زیر مجموعه 4', rate: 3.4,
    //                             price: 60000, discountPercent: 10, image: pasta_alferedo, tags: ['کبابی','ایرانی'],
    //                             description:'150 گرم گوشت مخلوط گوسفندی و گوساله'
    //                         },      
    //                     ]
    //                 },
    //                 {
    //                     rates:[
    //                         {text:'کیفیت',value:4},
    //                         {text:'حجم',value:3},
    //                         {text:'سلامت',value:5}
    //                     ],
    //                     details:[
    //                         ['نوع برنج','ایرانی'],
    //                         ['نوع گوشت','گوساله']
    //                     ],
    //                     commentsLength:24,
    //                     review:'این غذا خیلی غذای خوبی است . برای مشکل پسندان صو در صو پیشنهاد میشه . در این غذا ار مرغوب ترین متریال موجود در بازار استفاده شده است',
    //                     id:'3453445',
    //                     name: 'کباب لقمه یک سیخ', rate: 3.4,
    //                     price: 70000, discountPercent: 10, image: pasta_alferedo, tags: ['کبابی','ایرانی'],
    //                     description:'200 گرم گوشت مخلوط گوسفندی و گوساله'
    //                 },
    //                 {
    //                     rates:[
    //                         {text:'کیفیت',value:4},
    //                         {text:'حجم',value:3},
    //                         {text:'سلامت',value:5}
    //                     ],
    //                     details:[
    //                         ['نوع برنج','ایرانی'],
    //                         ['نوع گوشت','گوساله']
    //                     ],
    //                     commentsLength:24,
    //                     review:'این غذا خیلی غذای خوبی است . برای مشکل پسندان صو در صو پیشنهاد میشه . در این غذا ار مرغوب ترین متریال موجود در بازار استفاده شده است',
    //                     id:'123433',
    //                     name: 'کباب کوبیده بناب یک سیخ', rate: 3.4,
    //                     price: 85000, discountPercent: 10, image: pasta_alferedo, tags: ['کبابی','ایرانی'],
    //                     description:'250 گرم گوشت مخلوط گوسفندی و گوساله'
    //                 },
    //                 {
    //                     rates:[
    //                         {text:'کیفیت',value:4},
    //                         {text:'حجم',value:3},
    //                         {text:'سلامت',value:5}
    //                     ],
    //                     details:[
    //                         ['نوع برنج','ایرانی'],
    //                         ['نوع گوشت','گوساله']
    //                     ],
    //                     commentsLength:24,
    //                     review:'این غذا خیلی غذای خوبی است . برای مشکل پسندان صو در صو پیشنهاد میشه . در این غذا ار مرغوب ترین متریال موجود در بازار استفاده شده است',
    //                     id:'647834',
    //                     name: 'کباب بختیاری یک سیخ', rate: 3.4,
    //                     price: 90000, discountPercent: 10, image: pasta_alferedo, tags: ['کبابی','ایرانی'],
    //                     description:'ترکیب 100 گرم کباب کوبیده مخلوط گوسفند و گوساله و 100 گرم جوجه کباب بدون استخوان در یک سیخ'
    //                 },
    //                 {
    //                     rates:[
    //                         {text:'کیفیت',value:4},
    //                         {text:'حجم',value:3},
    //                         {text:'سلامت',value:5}
    //                     ],
    //                     details:[
    //                         ['نوع برنج','ایرانی'],
    //                         ['نوع گوشت','گوساله']
    //                     ],
    //                     commentsLength:24,
    //                     review:'این غذا خیلی غذای خوبی است . برای مشکل پسندان صو در صو پیشنهاد میشه . در این غذا ار مرغوب ترین متریال موجود در بازار استفاده شده است',
    //                     id:'5346743',
    //                     name: 'کباب سلطانی دو سیخ', rate: 3.4,
    //                     price: 140000, discountPercent: 10, image: pasta_alferedo, tags: ['کبابی','ایرانی'],
    //                     description:'یک سیخ 100 گرمی کباب کوبیده مخلوط گوسفند و گوساله و یک سیخ 100 گرمی کباب برگ مخصوص گوسفندی'
    //                 },
    //                 {
    //                     rates:[
    //                         {text:'کیفیت',value:4},
    //                         {text:'حجم',value:3},
    //                         {text:'سلامت',value:5}
    //                     ],
    //                     details:[
    //                         ['نوع برنج','ایرانی'],
    //                         ['نوع گوشت','گوساله']
    //                     ],
    //                     commentsLength:24,
    //                     review:'این غذا خیلی غذای خوبی است . برای مشکل پسندان صو در صو پیشنهاد میشه . در این غذا ار مرغوب ترین متریال موجود در بازار استفاده شده است',
    //                     id:'6756343',
    //                     name: 'جوجه کباب با استخوان ران یک سیخ', rate: 3.4,
    //                     price: 90000, discountPercent: 10, image: pasta_alferedo, tags: ['کبابی','ایرانی'],
    //                     description:'یک سیخ 200 گرمی جوجه کباب ران'
    //                 },
    //                 {
    //                     rates:[
    //                         {text:'کیفیت',value:4},
    //                         {text:'حجم',value:3},
    //                         {text:'سلامت',value:5}
    //                     ],
    //                     details:[
    //                         ['نوع برنج','ایرانی'],
    //                         ['نوع گوشت','گوساله']
    //                     ],
    //                     commentsLength:24,
    //                     review:'این غذا خیلی غذای خوبی است . برای مشکل پسندان صو در صو پیشنهاد میشه . در این غذا ار مرغوب ترین متریال موجود در بازار استفاده شده است',
    //                     id:'8674674',
    //                     name: 'جوجه کباب بدون استخوان سینه یک سیخ', rate: 3.4,
    //                     price: 90000, discountPercent: 10, image: pasta_alferedo, tags: ['کبابی','ایرانی'],
    //                     description:'یک سیخ 200 گرمی جوجه کباب سینه'
    //                 },

    //             ]
    //         },
    //         {
    //             name:'ماهی',
    //             image:undefined,
    //             items:[
    //                 {
    //                     rates:[
    //                         {text:'کیفیت',value:4},
    //                         {text:'حجم',value:3},
    //                         {text:'سلامت',value:5}
    //                     ],
    //                     details:[
    //                         ['نوع برنج','ایرانی'],
    //                         ['نوع گوشت','گوساله']
    //                     ],
    //                     commentsLength:24,
    //                     review:'این غذا خیلی غذای خوبی است . برای مشکل پسندان صو در صو پیشنهاد میشه . در این غذا ار مرغوب ترین متریال موجود در بازار استفاده شده است',
    //                     id:'7567467',
    //                     name: 'ماهی قزل آلا', rate: 3.4,
    //                     price: 160000, discountPercent: 10, image: pasta_alferedo, tags: [],
    //                     description:'یک پرس ماهی قزل آلا 150 گرمی'
    //                 },
    //                 {
    //                     rateItems:[

    //                     ],id:'3453463',
    //                     name: 'ماهی سفید', rate: 3.4,
    //                     price: 140000, discountPercent: 10, image: pasta_alferedo, tags: [],
    //                     description:'یک پرس ماهی سفید 100 گرمی'
    //                 },
    //             ]
    //         },
    //         {
    //             name:'برنج ایرانی',
    //             image:undefined,
    //             items:[
    //                 {
    //                     rates:[
    //                         {text:'کیفیت',value:4},
    //                         {text:'حجم',value:3},
    //                         {text:'سلامت',value:5}
    //                     ],
    //                     details:[
    //                         ['نوع برنج','ایرانی'],
    //                         ['نوع گوشت','گوساله']
    //                     ],
    //                     commentsLength:24,
    //                     review:'این غذا خیلی غذای خوبی است . برای مشکل پسندان صو در صو پیشنهاد میشه . در این غذا ار مرغوب ترین متریال موجود در بازار استفاده شده است',
    //                     id:'63455344',
    //                     name: 'چلو کره ای ساده تک نفره', rate: 3.4,
    //                     price: 65000, discountPercent: 10, image: pasta_alferedo, tags: ['کبابی','ایرانی'],
    //                     description:'100 گرم چلو کره ساده'
    //                 },
    //                 {
    //                     rates:[
    //                         {text:'کیفیت',value:4},
    //                         {text:'حجم',value:3},
    //                         {text:'سلامت',value:5}
    //                     ],
    //                     details:[
    //                         ['نوع برنج','ایرانی'],
    //                         ['نوع گوشت','گوساله']
    //                     ],
    //                     commentsLength:24,
    //                     review:'این غذا خیلی غذای خوبی است . برای مشکل پسندان صو در صو پیشنهاد میشه . در این غذا ار مرغوب ترین متریال موجود در بازار استفاده شده است',
    //                     id:'6467863',
    //                     name: 'چلو کره ای ساده دو نفره', rate: 3.4,
    //                     price: 120000, discountPercent: 10, image: pasta_alferedo, tags: ['کبابی','ایرانی'],
    //                     description:'200 گرم چلو کره ساده'
    //                 },
    //                 {
    //                     rates:[
    //                         {text:'کیفیت',value:4},
    //                         {text:'حجم',value:3},
    //                         {text:'سلامت',value:5}
    //                     ],
    //                     details:[
    //                         ['نوع برنج','ایرانی'],
    //                         ['نوع گوشت','گوساله']
    //                     ],
    //                     commentsLength:24,
    //                     review:'این غذا خیلی غذای خوبی است . برای مشکل پسندان صو در صو پیشنهاد میشه . در این غذا ار مرغوب ترین متریال موجود در بازار استفاده شده است',
    //                     id:'645345',
    //                     name: 'چلو کره ای ساده چهار نفره', rate: 3.4,
    //                     price: 240000, discountPercent: 10, image: pasta_alferedo, tags: ['کبابی','ایرانی'],
    //                     description:'400 گرم چلو کره ساده'
    //                 },
    //                 {
    //                     rates:[
    //                         {text:'کیفیت',value:4},
    //                         {text:'حجم',value:3},
    //                         {text:'سلامت',value:5}
    //                     ],
    //                     details:[
    //                         ['نوع برنج','ایرانی'],
    //                         ['نوع گوشت','گوساله']
    //                     ],
    //                     commentsLength:24,
    //                     review:'این غذا خیلی غذای خوبی است . برای مشکل پسندان صو در صو پیشنهاد میشه . در این غذا ار مرغوب ترین متریال موجود در بازار استفاده شده است',
    //                     id:'345345',
    //                     name: 'چلو کره ای ته دیگی تک نفره', rate: 3.4,
    //                     price: 75000, discountPercent: 10, image: pasta_alferedo, tags: ['کبابی','ایرانی'],
    //                     description:'150 گرم چلو کره ته دیگی'
    //                 },
    //                 {
    //                     rates:[
    //                         {text:'کیفیت',value:4},
    //                         {text:'حجم',value:3},
    //                         {text:'سلامت',value:5}
    //                     ],
    //                     details:[
    //                         ['نوع برنج','ایرانی'],
    //                         ['نوع گوشت','گوساله']
    //                     ],
    //                     commentsLength:24,
    //                     review:'این غذا خیلی غذای خوبی است . برای مشکل پسندان صو در صو پیشنهاد میشه . در این غذا ار مرغوب ترین متریال موجود در بازار استفاده شده است',
    //                     id:'867674',
    //                     name: 'چلو کره ای ته دیگی دو نفره', rate: 3.4,
    //                     price: 140000, discountPercent: 10, image: pasta_alferedo, tags: ['کبابی','ایرانی'],
    //                     description:'300 گرم چلو کره ته دیگی'
    //                 },
    //                 {
    //                     rates:[
    //                         {text:'کیفیت',value:4},
    //                         {text:'حجم',value:3},
    //                         {text:'سلامت',value:5}
    //                     ],
    //                     details:[
    //                         ['نوع برنج','ایرانی'],
    //                         ['نوع گوشت','گوساله']
    //                     ],
    //                     commentsLength:24,
    //                     review:'این غذا خیلی غذای خوبی است . برای مشکل پسندان صو در صو پیشنهاد میشه . در این غذا ار مرغوب ترین متریال موجود در بازار استفاده شده است',
    //                     id:'645585',
    //                     name: 'چلو کره ای ته دیگی چهار نفره', rate: 3.4,
    //                     price: 280000, discountPercent: 10, image: pasta_alferedo, tags: ['کبابی','ایرانی'],
    //                     description:'600 گرم چلو کره ته دیگی'
    //                 },
    //                 {
    //                     rates:[
    //                         {text:'کیفیت',value:4},
    //                         {text:'حجم',value:3},
    //                         {text:'سلامت',value:5}
    //                     ],
    //                     details:[
    //                         ['نوع برنج','ایرانی'],
    //                         ['نوع گوشت','گوساله']
    //                     ],
    //                     commentsLength:24,
    //                     review:'این غذا خیلی غذای خوبی است . برای مشکل پسندان صو در صو پیشنهاد میشه . در این غذا ار مرغوب ترین متریال موجود در بازار استفاده شده است',
    //                     id:'6344534',
    //                     name: 'سبزی پلو تک نفره', rate: 3.4,
    //                     price: 65000, discountPercent: 10, image: pasta_alferedo, tags: ['کبابی','ایرانی'],
    //                     description:'100 گرم سبزی پلو'
    //                 },
    //                 {
    //                     rates:[
    //                         {text:'کیفیت',value:4},
    //                         {text:'حجم',value:3},
    //                         {text:'سلامت',value:5}
    //                     ],
    //                     details:[
    //                         ['نوع برنج','ایرانی'],
    //                         ['نوع گوشت','گوساله']
    //                     ],
    //                     commentsLength:24,
    //                     review:'این غذا خیلی غذای خوبی است . برای مشکل پسندان صو در صو پیشنهاد میشه . در این غذا ار مرغوب ترین متریال موجود در بازار استفاده شده است',
    //                     id:'64678463',
    //                     name: 'سبزی پلو دو نفره', rate: 3.4,
    //                     price: 120000, discountPercent: 10, image: pasta_alferedo, tags: ['کبابی','ایرانی'],
    //                     description:'200 گرم سبزی پلو'
    //                 },
    //                 {
    //                     rates:[
    //                         {text:'کیفیت',value:4},
    //                         {text:'حجم',value:3},
    //                         {text:'سلامت',value:5}
    //                     ],
    //                     details:[
    //                         ['نوع برنج','ایرانی'],
    //                         ['نوع گوشت','گوساله']
    //                     ],
    //                     commentsLength:24,
    //                     review:'این غذا خیلی غذای خوبی است . برای مشکل پسندان صو در صو پیشنهاد میشه . در این غذا ار مرغوب ترین متریال موجود در بازار استفاده شده است',
    //                     id:'6434565',
    //                     name: 'سبزی پلو چهار نفره', rate: 3.4,
    //                     price: 240000, discountPercent: 10, image: pasta_alferedo, tags: ['کبابی','ایرانی'],
    //                     description:'400 گرم سبزی پلو'
    //                 }
    //             ]
    //         }
    //     ]
    //     return {result}
    // },
    
    
}

