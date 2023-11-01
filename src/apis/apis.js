import backOfficeApis from "./back-office-apis";
import profileApis from "./profile-apis";
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
        backOffice: backOfficeApis(obj),
        profile: profileApis(obj),
        reserve: reserveApis(obj),
        async peygiriye_sefaresh(orderId) {
            return { result: { statusId: 1, totalPrice: 12344444, id: 88678 } }
            let url = `${baseUrl}/Order/InquiryOrder`;
            //create from searchObject
            let body = {
                "OrderId": orderId
            }
            let response = await Axios.post(url, body);
            let result = response.data.data.items[0];
            if (!result) { return }
            debugger
            //id:59,
            //paymentId:0
            //statusId:1,
            //statusTitle:"در انتظار پرداخت"
            //title:"شماره سفارش: "
            //totalPrice:200022
            return { response, result }
        },
        async pardakht_online({ deliveryType, foods, restoranId, amount, selectedCouponIds, addressId }) {
            //deliveryType => 'ارسال با پیک' | 'دریافت حضوری'
            //لیست غذا ها که یک نمونه از اون در لیست زیر نمایش داده شده
            //foods => [
            //    {foodId:Any,count:Number},
            //    ...
            //]
            //restoranId => آی دی رستوران
            //amount => Number مبلغ قابل پرداخت
            //selectedCouponIds => آرایه ای از آی دی کوپن های انتخاب شده
            //addressId => آی دی آدرس انتخاب شده ی کاربر
            let callbackurl = window.location.href; //یو آر ال فعلی اپ
            let foodList = [];
            for (let i = 0; i < foods.length; i++) {
                let { count, foodId } = foods[i];
                for (let j = 0; j < count; j++) {
                    foodList.push({ restaurantId: restoranId, restaurantFoodId: foodId })
                }
            }
            let url = `${baseUrl}/Order/OrderTotal`;
            //create from searchObject
            let body = {
                "customerId": 1,
                "isPreOrder": false,
                'description': '',
                "serviceTypeId": { 'ارسال با پیک': 1, 'دریافت حضوری': 2 }[deliveryType],//delivery 1//takeaway 2
                "addressId": addressId,
                "paymentTypeId": 1,//online
                "callback": "http://localhost:3000",
                "dinners": foodList
            }
            let response = await Axios.post(url, body);
            //باز کردن صفحه درگاه
            let paymentUrl = response.data.data;
            window.open(paymentUrl)

            let result;
            return { response, result }
        },
        async search_restorans(parameter, { MapRestorans }) {
            let response;
            let data = [];
            let result = MapRestorans(data);
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
        async restoran_haye_mahboob(parameter, { personId }) {
            let url = `${baseUrl}/RestaurantFavoruite/search`
            let body = { "PersonId": personId }
            let response = await Axios.post(url, body);
            let result = response.data.data.items;
            return { response, result }
        },
        async tarikhcheye_kife_pool() {
            return MockApis.tarikhcheye_kife_pool(helper)
        },
        async tarikhche_ye_jostojoo() {
            return MockApis.tarikhche_ye_jostojoo(helper)
        },
        async hazfe_tarikhche_ye_jostojoo() {
            return MockApis.hazfe_tarikhche_ye_jostojoo(helper)
        },
        async restoran_comments({ id, pageSize, pageNumber }) {
            //id => آی دی رستوران
            //pageSize => تعداد کامنت صفحه
            //pageNumber => شماره صفحه کامنت

            let url = `${baseUrl}/FeedBack/GetRestaurantComments`;
            let body = {
                "RestaurantId": id,
                "PageNumber": pageSize,
                "RecordsPerPage": pageNumber
            }
            let response = await Axios.post(url, body);
            let result = response.data.data.items;
            return { response, result };

            return { mock: true }
        },
        async restoran_coupons(restaurantId) {

            let url = `${baseUrl}/RestaurantDiscount/Search`;
            let body = { "RestaurantId": restaurantId }
            let response = await Axios.post(url, body);
            let result = response.data.data.items;
            return { response, result };

            // return {mock:true}
        }
    }
}


const MockApis = {

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
    tarikhcheye_kife_pool(helper) {
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
    restoran_comments({ id, pageSize, pageNumber }) {
        let result = [
            { date: '1402/1/1/3/34', name: 'رضا عباسی', comment: 'کیفیت غذای رستوران خیلی خوب بود ، من خیلی خوشم آمد بهتر بود کمی گرم تر به دستم میرسی' },
            { date: '1402/1/1/3/34', name: 'رضا عباسی', comment: 'کیفیت غذای رستوران خیلی خوب بود ، من خیلی خوشم آمد بهتر بود کمی گرم تر به دستم میرسی' },
            { date: '1402/1/1/3/34', name: 'رضا عباسی', comment: 'کیفیت غذای رستوران خیلی خوب بود ، من خیلی خوشم آمد بهتر بود کمی گرم تر به دستم میرسی' },
            { date: '1402/1/1/3/34', name: 'رضا عباسی', comment: 'کیفیت غذای رستوران خیلی خوب بود ، من خیلی خوشم آمد بهتر بود کمی گرم تر به دستم میرسی' },
            { date: '1402/1/1/3/34', name: 'رضا عباسی', comment: 'کیفیت غذای رستوران خیلی خوب بود ، من خیلی خوشم آمد بهتر بود کمی گرم تر به دستم میرسی' },
            { date: '1402/1/1/3/34', name: 'رضا عباسی', comment: 'کیفیت غذای رستوران خیلی خوب بود ، من خیلی خوشم آمد بهتر بود کمی گرم تر به دستم میرسی' },
            { date: '1402/1/1/3/34', name: 'رضا عباسی', comment: 'کیفیت غذای رستوران خیلی خوب بود ، من خیلی خوشم آمد بهتر بود کمی گرم تر به دستم میرسی' },
        ]
        return { result }
    },
    restoran_coupons() {
        let result = [
            { id: '23423423', title: 'کوپن 1', discountPercent: 10, minCartAmount: 500000, maxDiscount: 100000 },
            { id: '75684564', title: 'کوپن 2', discountPercent: 10, maxDiscount: 100000 },
            { id: '4235345', title: 'کوپن 3', discountPercent: 10, minCartAmount: 500000 },
            { id: '56345234', title: 'کوپن 4', discountPercent: 10 },

            { id: '23426', title: 'کوپن 5', discount: 100000, minCartAmount: 500000 },
            { id: '645634534', title: 'کوپن 6', discount: 100000 },
        ]
        return { result }
    }
}

