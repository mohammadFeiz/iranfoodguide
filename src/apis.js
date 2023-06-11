import Axios from 'axios';
import frame210 from './images/Frame 210.png';
import cat_irani_src from './images/cat-irani.png';
import cat_sobhane_src from './images/cat-sobhane.png';
import cat_ajil_src from './images/cat-ajil.png';
import cat_abmive_src from './images/cat-abmive.png';
import cat_saladbar_src from './images/cat-saladbar.png';
import cat_fastfood_src from './images/cat-fastfood.png';
import cat_kafe_src from './images/cat-kafe.png';
import cat_shirini_src from './images/cat-shirini.png';
import shandiz_logo from './images/shandiz_logo.png';
import shandiz_image from './images/shandiz_image.png';
import pasta_alferedo from './images/pasta_alferedo.png';
import ghaem_image from './images/ghaem_image.png';
import ghaem_logo from './images/ghaem_logo.png';
import kabab_src from './images/kabab.jpg';
import rice_src from './images/rice.png';
import fish_src from './images/fish.jpg';
export function getResponse({getState}){
    //let baseUrl = 'https://localhost:7203/api/v1'
   let baseUrl = 'https://iranfoodguide.ir/api'
    return {
        async sabte_shomare_tamas(shomare_tamas) {
            let url = `${baseUrl}/People/AddMobileNumber`;
            let body = {
                "PersonId": 1,
                "MobileNumber": shomare_tamas,
                "IsDefault": true
            }
            let response = await Axios.post(url,body);
            return {response}
        },
        async setProfile({ profile,mobileNumber, registered }) {
            let url = `${baseUrl}/People/${registered?'UpdateProfile':'CreateProfile'}`
            let body = {
                "Id":profile.id,
                "firstName": profile.firstName,//نام
                "lastName": profile.lastName,
                "email": profile.email,
                "sheba": profile.sheba,
                "mobileNumbers": [
                    {
                        "mobileNumber": mobileNumber,
                        "isDefault": true
                    }
                ]
            }
            let response = await Axios.post(url,body);
            return {response}
        },
        async getProfile() {
            let {personId} = getState();
            let url = `${baseUrl}/People/search`
            let body = {"Id":personId}
            let response = await Axios.post(url,body);
            let result = response.data.data.items[0]
            return {response,result}
        },
        async getAddresses(){//لیست آدرس ها
            //return {mock:true}
            let {personId} = getState();
            let url = `${baseUrl}/People/GetPeopleAddress`
            let body = {
                "PersonId":personId
            }
            let response = await Axios.post(url,body);

            let result=response.data.data.map((o)=>
            {
                    return {
                        title: o.title,
                        address: o.address,
                        number: 30,
                        unit: 4,
                        floor: 2,
                        id: o.id,
                        description: o.description,
                        phone: o.phoneNumber
                    }
            });
            // let result = [                
            //     {
            //         title: 'خانه',
            //         address: 'تهران شیخ بهایی شمالی نوربخش',
            //         number: 30,
            //         unit: 4,
            //         floor: 2,
            //         id: '0',
            //         description: '',
            //         phone: '02188050006'
            //     }
            // ];
            return {response,result}
        },
        async takhfif_ha() {
            let {personId} = getState();
            let url = `${baseUrl}/PersonDiscount/Search`;
            let body = {"PersonId": personId}
            let response = await Axios.post(url,body);
            let result = response.data.data.items;
            return {response,result};
        },
        async addressForm({ address, type}) {
            let {personId} = getState();
            if (type === 'add') {
                let url = `${baseUrl}/People/CreatePeopleAddress`;
                let body = {
                    "personId": personId,
                    "address": {
                      "fullAddress": address.address,
                      "latitude": address.latitude,
                      "longitude": address.longitude,
                      "phoneNumber": address.phone
                    },
                    "title": address.title
                }
                let response = await Axios.post(url,body);
                return {response}
            }
            else { 

            }
        },
        async safheye_sefaresh() {
            //return {mock:true}
            let url = `${baseUrl}/PageLayout/GetListOfFoodDelivery`;
            let body = {};
            let response = await Axios.post(url,body);
            let result = response.data.data;
            return {response,result};
        },
        async restoran_haye_mahboob() {
            let {personId} = getState();
            let url = `${baseUrl}/RestaurantFavoruite/search`
            let body = {"PersonId":personId}
            let response = await Axios.post(url,body);
            let result = response.data.data.items;
            return {response,result}
        },
        async mojoodiye_kife_pool() {
            return {mock:true}
        },
        async tarikhcheye_kife_pool() {
           return {mock:true} 
        },
        async restoran_category_options(){
            return {mock:true}
        },
        async restoran_sort_options(){
            return {mock:true}
        },
        async jostojooye_restoran({pageSize,pageNumber,selectedCategories,selectedSort,searchValue}){
            //pageSize تعداد ریزالت در هر صفحه
            //pageNumber شماره صفحه
            //selectedCategories لیست تگ های انتخاب شده برای سرچ توسط کاربر
            //selectedSort مرتب سازی انتخابی کاربر
            //searchValue متن سرچ شده توسط کاربر
            return {mock:true}
        },
        async tarikhche_ye_jostojoo(){
            return {mock:true} 
        },
        async hazfe_tarikhche_ye_jostojoo(){
            return {mock:true} 
        },
        async restoran_menu(restaurantId){
            let url = `${baseUrl}/Menu/Search`;
            let body = {"RestaurantId": restaurantId}
            let response = await Axios.post(url,body);
            let result = response.data.data.items.FoodCategories;
            return {response,result};

            // return {mock:true}
        },
        async restoran_comments({id,pageSize,pageNumber}){
            //id => آی دی رستوران
            //pageSize => تعداد کامنت صفحه
            //pageNumber => شماره صفحه کامنت

            let url = `${baseUrl}/FeedBack/GetRestaurantComments`;
            let body = {"RestaurantId": id,
                            "PageNumber":pageSize,
                            "RecordsPerPage":pageNumber
                        }
            let response = await Axios.post(url,body);
            let result = response.data.data.items;
            return {response,result};

            return {mock:true}
        },
        async restoran_coupons(restaurantId){

            let url = `${baseUrl}/RestaurantDiscount/Search`;
            let body = {"RestaurantId": restaurantId}
            let response = await Axios.post(url,body);
            let result = response.data.data.items;
            return {response,result};

            // return {mock:true}
        }
    }
}

export function getMock({helper}){
    return {
        getAddresses(){
            return [//لیست آدرس ها
                {
                    title: 'خانه',
                    address: 'تهران شیخ بهایی شمالی نوربخش',
                    number: 30,
                    unit: 4,
                    floor: 2,
                    id: '0',
                    description: '',
                    phone: '02188050006'
                }
            ]
        },
        getProfile() {
            return {
                firstName: 'احمد',//نام
                lastName: 'بهرامی',//نام خانوادگی
                mobileNumber: '09123534314',//شماره همراه
                email: 'feiz.ms@gmail.com',//آدرس ایمیل
                sheba: '1234567',//شماره شبا
            }
        },
        takhfif_ha(res) {
            return [
                {
                    amounts: [{ percent: 10, amount: 100000 }], description: 'تخفیف خرید شیرینی',
                    code: '31234545332343', endDate: '1401/12/21/13/0', order: 0
                },
                {
                    amounts: [{ percent: 10 }, { percent: 15 }, { percent: 20 }], description: 'تخفیف خرید شیرینی',
                    code: '31234545332343', endDate: '1401/12/21/13/0', order: 2
                },
                {
                    amounts: [{ percent: 10, amount: 200000 }, { percent: 20, amount: 200000 }], description: 'تخفیف خرید شیرینی',
                    code: '31234545332343', endDate: '1401/12/21/13/0', order: 0
                },
                {
                    amounts: [{ amount: 50000 }], description: 'تخفیف خرید شیرینی',
                    code: '31234545332343', endDate: '1401/12/21/13/0', order: 0
                },
            ]
        },
        safheye_sefaresh(res) {
            return [
                {
                    type: 'Billboard',
                    items: [{src: frame210},{src: frame210},{src: frame210},{src: frame210}]
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
                            name: 'رستوران شاندیز گالریا',image: shandiz_image,logo: shandiz_logo,
                            rate: 3.4,distance: 3,time: 35,tags: ['ایرانی ', 'سنتی', 'فست فود', 'ملل']
                        },
                        {
                            name: 'رستوران شاندیز گالریا',image: shandiz_image,logo: shandiz_logo,
                            rate: 3.4,distance: 3,time: 35,tags: ['ایرانی ', 'سنتی', 'فست فود', 'ملل']
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
                    type: 'Slider',name: 'غذا های تخفیف دار',cardSize: { width: 160 },
                    header: {maxDiscount: 15,endDate: new Date().getTime() + (6 * 60 * 60 * 1000)},
                    items: [
                        {
                            name: 'پاستا آلفردو ', shopName: 'رستوران شاندیز گالریا', rate: 3.4,
                            price: 210000, discount: 15, image: pasta_alferedo, tags: [],id:'4232'
                        },
                        {
                            name: 'پاستا آلفردو ', shopName: 'رستوران شاندیز گالریا', rate: 3.4,id:'423rwe',
                            price: 210000, discount: 15, image: pasta_alferedo, tags: []
                        },
                        {
                            name: 'پاستا آلفردو ', shopName: 'رستوران شاندیز گالریا', rate: 3.4,id:'423456452',
                            price: 210000, discount: 15, image: pasta_alferedo, tags: []
                        },
                        {
                            name: 'پاستا آلفردو ', shopName: 'رستوران شاندیز گالریا', rate: 3.4,id:'42354232',
                            price: 210000, discount: 15, image: pasta_alferedo, tags: []
                        }
                    ]
                },
                {
                    type: 'Slider',name: 'جدید ترین رزروی ها',
                    items: [
                        {
                            name: 'رستوران قایم', distance: 3, rate: 3.4, logo: ghaem_logo, image: ghaem_image,
                            details: [
                                {title: 'نوع میز',value: 'میز و آلاچیق'},
                                {title: 'مدت زمان تاخیر',value: '15 دقیقه'},
                                {title: 'قابلیت مراسم',value: 'تولد و VIP'}
                            ],
                            tags: ['ایرانی', 'فست فود', 'ملل', 'قلیان', 'موسیقی زنده']
                        },
                        {
                            name: 'رستوران قایم', distance: 3, rate: 3.4, logo: ghaem_logo, image: ghaem_image,
                            details: [
                                {title: 'نوع میز',value: 'میز و آلاچیق'},
                                {title: 'مدت زمان تاخیر',value: '15 دقیقه'},
                                {title: 'قابلیت مراسم',value: 'تولد و VIP'}
                            ],
                            tags: ['ایرانی', 'فست فود', 'ملل', 'قلیان', 'موسیقی زنده']
                        },
                        {
                            name: 'رستوران قایم', distance: 3, rate: 3.4, logo: ghaem_logo, image: ghaem_image,
                            details: [
                                {title: 'نوع میز',value: 'میز و آلاچیق'},
                                {title: 'مدت زمان تاخیر',value: '15 دقیقه'},
                                {title: 'قابلیت مراسم',value: 'تولد و VIP'}
                            ],
                            tags: ['ایرانی', 'فست فود', 'ملل', 'قلیان', 'موسیقی زنده']
                        },
                        {
                            name: 'رستوران قایم', distance: 3, rate: 3.4, logo: ghaem_logo, image: ghaem_image,
                            details: [
                                {title: 'نوع میز',value: 'میز و آلاچیق'},
                                {title: 'مدت زمان تاخیر',value: '15 دقیقه'},
                                {title: 'قابلیت مراسم',value: 'تولد و VIP'}
                            ],
                            tags: ['ایرانی', 'فست فود', 'ملل', 'قلیان', 'موسیقی زنده']
                        },
                        {
                            name: 'رستوران قایم', distance: 3, rate: 3.4, logo: ghaem_logo, image: ghaem_image,
                            details: [
                                {title: 'نوع میز',value: 'میز و آلاچیق'},
                                {title: 'مدت زمان تاخیر',value: '15 دقیقه'},
                                {title: 'قابلیت مراسم',value: 'تولد و VIP'}
                            ],
                            tags: ['ایرانی', 'فست فود', 'ملل', 'قلیان', 'موسیقی زنده']
                        }
                    ]
                }
            ]
        },
        restoran_haye_mahboob() {
            return [
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
        },
        mojoodiye_kife_pool() {
            return 123245666
        },
        tarikhcheye_kife_pool() {
            let data = [
                { date: new Date().getTime(), amount: '123456789', type: 'in' },
                { date: new Date().getTime(), amount: '123456789', type: 'out' },
                { date: new Date().getTime(), amount: '123456789', type: 'in' },
                { date: new Date().getTime(), amount: '123456789', type: 'out' },
                { date: new Date().getTime(), amount: '123456789', type: 'in' },
            ]
            return data.map((o) => {
                let { date, time } = helper.getDateAndTime(o.date)
                return { ...o, date, time }
            })
        },
        restoran_category_options(){
            return [
                {text:'فست فود',value:'0'},
                {text:'ایرانی',value:'1'},
                {text:'کبابی',value:'2'},
                {text:'سالادبار',value:'3'},
                {text:'خارجی',value:'4'},
                {text:'عربی',value:'5'}
            ]
        },
        restoran_sort_options(){
            return [
                {text:'رستوران اقتصادی',value:'0'},
                {text:'بالاترین امتیاز ',value:'1'},
                {text:'نزدیک ترین ',value:'2'},
                {text:'جدیدترین',value:'3'},
                {text:'تایید شده در ایران فود',value:'4'},
                {text:'گرانترین',value:'5'}
            ]
        },
        jostojooye_restoran({pageSize,pageNumber,selectedCategories,selectedSort,searchValue}){
            let restorans = [
                {
                    id:'34',
                    name: 'رستوران 1',
                    image: shandiz_image,
                    logo: shandiz_logo,
                    rate: 3.4,
                    distance: 3,
                    time: 35,
                    tags: ['ایرانی', 'کبابی', 'فست فود','خارجی','سالادبار','عربی','صبحانه'],
                    address:'تهران خیابان شیخ بهایی خیابان نوربخش پلاک 30 واحد 4 طبقه دوم',
                    ifRate:3.5,
                    ifComment:'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می‌باشد. کتابهای زیادی در شصت و سه درصد گذشته، حال و آینده شناخت فراوان جامعه و متخصصان را می‌طلبد تا با نرم‌افزارها شناخت بیشتری را برای طراحان رایانه ای علی‌الخصوص طراحان خلاقی و فرهنگ پیشرو در زبان فارسی ایجاد کرد. در این صورت می‌توان امید داشت که تمام و دشواری موجود در ارائه راهکارها و شرایط سخت تایپ به پایان رسد و زمان مورد نیاز شامل حروفچینی دستاوردهای اصلی و جوابگوی سوالات پیوسته اهل دنیای موجود طراحی اساساً مورد استفاده قرار گیرد'
                },
                {
                    id:'6453',
                    name: 'رستوران 2',
                    image: shandiz_image,
                    logo: shandiz_logo,
                    rate: 3.4,
                    distance: 3,
                    time: 35,
                    tags: ['خارجی', 'سنتی', 'کبابی', 'سالادبار'],
                    address:'تهران خیابان شیخ بهایی خیابان نوربخش پلاک 30 واحد 4 طبقه دوم',
                    ifRate:3.5,
                    ifComment:'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می‌باشد. کتابهای زیادی در شصت و سه درصد گذشته، حال و آینده شناخت فراوان جامعه و متخصصان را می‌طلبد تا با نرم‌افزارها شناخت بیشتری را برای طراحان رایانه ای علی‌الخصوص طراحان خلاقی و فرهنگ پیشرو در زبان فارسی ایجاد کرد. در این صورت می‌توان امید داشت که تمام و دشواری موجود در ارائه راهکارها و شرایط سخت تایپ به پایان رسد و زمان مورد نیاز شامل حروفچینی دستاوردهای اصلی و جوابگوی سوالات پیوسته اهل دنیای موجود طراحی اساساً مورد استفاده قرار گیرد'
                },
                {
                    id:'7563',
                    name: 'رستوران 3', 
                    image: shandiz_image, 
                    logo: shandiz_logo, 
                    rate: 3.4, 
                    distance: 3, 
                    time: 35,
                    tags: ['عربی', 'سنتی', 'سالادبار', 'ملل'],
                    address:'تهران خیابان شیخ بهایی خیابان نوربخش پلاک 30 واحد 4 طبقه دوم',
                    ifRate:3.5,
                    ifComment:'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می‌باشد. کتابهای زیادی در شصت و سه درصد گذشته، حال و آینده شناخت فراوان جامعه و متخصصان را می‌طلبد تا با نرم‌افزارها شناخت بیشتری را برای طراحان رایانه ای علی‌الخصوص طراحان خلاقی و فرهنگ پیشرو در زبان فارسی ایجاد کرد. در این صورت می‌توان امید داشت که تمام و دشواری موجود در ارائه راهکارها و شرایط سخت تایپ به پایان رسد و زمان مورد نیاز شامل حروفچینی دستاوردهای اصلی و جوابگوی سوالات پیوسته اهل دنیای موجود طراحی اساساً مورد استفاده قرار گیرد'
                },
            ]
            return restorans

        },
        tarikhche_ye_jostojoo(){
            return ['برگر','پیتزا','پاستا'] 
        },
        hazfe_tarikhche_ye_jostojoo(){
            return true 
        },
        restoran_menu(){
            return [
                {
                    name:'کباب',
                    image:undefined,
                    items:[
                        {
                            id:'534534',
                            name: 'کباب کوبیده یک سیخ', rate: 3.4,
                            price: 60000, discountPercent: 10, image: pasta_alferedo, tags: ['کبابی','ایرانی'],
                            description:'150 گرم گوشت مخلوط گوسفندی و گوساله',
                            items:[
                                {
                                    rates:[
                                        {text:'کیفیت',value:4},
                                        {text:'حجم',value:3},
                                        {text:'سلامت',value:5}
                                    ],
                                    details:[
                                        ['نوع برنج','ایرانی'],
                                        ['نوع گوشت','گوساله']
                                    ],
                                    commentsLength:24,
                                    review:'این غذا خیلی غذای خوبی است . برای مشکل پسندان صو در صو پیشنهاد میشه . در این غذا ار مرغوب ترین متریال موجود در بازار استفاده شده است',
                                    id:'456473456',
                                    name: 'کباب لقمه زیر مجموعه 1', rate: 3.4,
                                    price: 60000, discountPercent: 10, image: pasta_alferedo, tags: ['کبابی','ایرانی'],
                                    description:'150 گرم گوشت مخلوط گوسفندی و گوساله'
                                },
                                {
                                    rates:[
                                        {text:'کیفیت',value:4},
                                        {text:'حجم',value:3},
                                        {text:'سلامت',value:5}
                                    ],
                                    details:[
                                        ['نوع برنج','ایرانی'],
                                        ['نوع گوشت','گوساله']
                                    ],
                                    commentsLength:24,
                                    review:'این غذا خیلی غذای خوبی است . برای مشکل پسندان صو در صو پیشنهاد میشه . در این غذا ار مرغوب ترین متریال موجود در بازار استفاده شده است',
                                    id:'64557865654346',
                                    name: 'کباب لقمه زیر مجموعه 2', rate: 3.4,
                                    price: 60000, discountPercent: 10, image: pasta_alferedo, tags: ['کبابی','ایرانی'],
                                    description:'150 گرم گوشت مخلوط گوسفندی و گوساله'
                                },
                                {
                                    rates:[
                                        {text:'کیفیت',value:4},
                                        {text:'حجم',value:3},
                                        {text:'سلامت',value:5}
                                    ],
                                    details:[
                                        ['نوع برنج','ایرانی'],
                                        ['نوع گوشت','گوساله']
                                    ],
                                    commentsLength:24,
                                    review:'این غذا خیلی غذای خوبی است . برای مشکل پسندان صو در صو پیشنهاد میشه . در این غذا ار مرغوب ترین متریال موجود در بازار استفاده شده است',
                                    id:'6455458756878346',
                                    name: 'کباب لقمه زیر مجموعه 3', rate: 3.4,
                                    price: 60000, discountPercent: 10, image: pasta_alferedo, tags: ['کبابی','ایرانی'],
                                    description:'150 گرم گوشت مخلوط گوسفندی و گوساله'
                                },
                                {
                                    rates:[
                                        {text:'کیفیت',value:4},
                                        {text:'حجم',value:3},
                                        {text:'سلامت',value:5}
                                    ],
                                    details:[
                                        ['نوع برنج','ایرانی'],
                                        ['نوع گوشت','گوساله']
                                    ],
                                    commentsLength:24,
                                    review:'این غذا خیلی غذای خوبی است . برای مشکل پسندان صو در صو پیشنهاد میشه . در این غذا ار مرغوب ترین متریال موجود در بازار استفاده شده است',
                                    id:'75663464563',
                                    name: 'کباب لقمه زیر مجموعه 4', rate: 3.4,
                                    price: 60000, discountPercent: 10, image: pasta_alferedo, tags: ['کبابی','ایرانی'],
                                    description:'150 گرم گوشت مخلوط گوسفندی و گوساله'
                                },      
                            ]
                        },
                        {
                            rates:[
                                {text:'کیفیت',value:4},
                                {text:'حجم',value:3},
                                {text:'سلامت',value:5}
                            ],
                            details:[
                                ['نوع برنج','ایرانی'],
                                ['نوع گوشت','گوساله']
                            ],
                            commentsLength:24,
                            review:'این غذا خیلی غذای خوبی است . برای مشکل پسندان صو در صو پیشنهاد میشه . در این غذا ار مرغوب ترین متریال موجود در بازار استفاده شده است',
                            id:'3453445',
                            name: 'کباب لقمه یک سیخ', rate: 3.4,
                            price: 70000, discountPercent: 10, image: pasta_alferedo, tags: ['کبابی','ایرانی'],
                            description:'200 گرم گوشت مخلوط گوسفندی و گوساله'
                        },
                        {
                            rates:[
                                {text:'کیفیت',value:4},
                                {text:'حجم',value:3},
                                {text:'سلامت',value:5}
                            ],
                            details:[
                                ['نوع برنج','ایرانی'],
                                ['نوع گوشت','گوساله']
                            ],
                            commentsLength:24,
                            review:'این غذا خیلی غذای خوبی است . برای مشکل پسندان صو در صو پیشنهاد میشه . در این غذا ار مرغوب ترین متریال موجود در بازار استفاده شده است',
                            id:'123433',
                            name: 'کباب کوبیده بناب یک سیخ', rate: 3.4,
                            price: 85000, discountPercent: 10, image: pasta_alferedo, tags: ['کبابی','ایرانی'],
                            description:'250 گرم گوشت مخلوط گوسفندی و گوساله'
                        },
                        {
                            rates:[
                                {text:'کیفیت',value:4},
                                {text:'حجم',value:3},
                                {text:'سلامت',value:5}
                            ],
                            details:[
                                ['نوع برنج','ایرانی'],
                                ['نوع گوشت','گوساله']
                            ],
                            commentsLength:24,
                            review:'این غذا خیلی غذای خوبی است . برای مشکل پسندان صو در صو پیشنهاد میشه . در این غذا ار مرغوب ترین متریال موجود در بازار استفاده شده است',
                            id:'647834',
                            name: 'کباب بختیاری یک سیخ', rate: 3.4,
                            price: 90000, discountPercent: 10, image: pasta_alferedo, tags: ['کبابی','ایرانی'],
                            description:'ترکیب 100 گرم کباب کوبیده مخلوط گوسفند و گوساله و 100 گرم جوجه کباب بدون استخوان در یک سیخ'
                        },
                        {
                            rates:[
                                {text:'کیفیت',value:4},
                                {text:'حجم',value:3},
                                {text:'سلامت',value:5}
                            ],
                            details:[
                                ['نوع برنج','ایرانی'],
                                ['نوع گوشت','گوساله']
                            ],
                            commentsLength:24,
                            review:'این غذا خیلی غذای خوبی است . برای مشکل پسندان صو در صو پیشنهاد میشه . در این غذا ار مرغوب ترین متریال موجود در بازار استفاده شده است',
                            id:'5346743',
                            name: 'کباب سلطانی دو سیخ', rate: 3.4,
                            price: 140000, discountPercent: 10, image: pasta_alferedo, tags: ['کبابی','ایرانی'],
                            description:'یک سیخ 100 گرمی کباب کوبیده مخلوط گوسفند و گوساله و یک سیخ 100 گرمی کباب برگ مخصوص گوسفندی'
                        },
                        {
                            rates:[
                                {text:'کیفیت',value:4},
                                {text:'حجم',value:3},
                                {text:'سلامت',value:5}
                            ],
                            details:[
                                ['نوع برنج','ایرانی'],
                                ['نوع گوشت','گوساله']
                            ],
                            commentsLength:24,
                            review:'این غذا خیلی غذای خوبی است . برای مشکل پسندان صو در صو پیشنهاد میشه . در این غذا ار مرغوب ترین متریال موجود در بازار استفاده شده است',
                            id:'6756343',
                            name: 'جوجه کباب با استخوان ران یک سیخ', rate: 3.4,
                            price: 90000, discountPercent: 10, image: pasta_alferedo, tags: ['کبابی','ایرانی'],
                            description:'یک سیخ 200 گرمی جوجه کباب ران'
                        },
                        {
                            rates:[
                                {text:'کیفیت',value:4},
                                {text:'حجم',value:3},
                                {text:'سلامت',value:5}
                            ],
                            details:[
                                ['نوع برنج','ایرانی'],
                                ['نوع گوشت','گوساله']
                            ],
                            commentsLength:24,
                            review:'این غذا خیلی غذای خوبی است . برای مشکل پسندان صو در صو پیشنهاد میشه . در این غذا ار مرغوب ترین متریال موجود در بازار استفاده شده است',
                            id:'8674674',
                            name: 'جوجه کباب بدون استخوان سینه یک سیخ', rate: 3.4,
                            price: 90000, discountPercent: 10, image: pasta_alferedo, tags: ['کبابی','ایرانی'],
                            description:'یک سیخ 200 گرمی جوجه کباب سینه'
                        },

                    ]
                },
                {
                    name:'ماهی',
                    image:undefined,
                    items:[
                        {
                            rates:[
                                {text:'کیفیت',value:4},
                                {text:'حجم',value:3},
                                {text:'سلامت',value:5}
                            ],
                            details:[
                                ['نوع برنج','ایرانی'],
                                ['نوع گوشت','گوساله']
                            ],
                            commentsLength:24,
                            review:'این غذا خیلی غذای خوبی است . برای مشکل پسندان صو در صو پیشنهاد میشه . در این غذا ار مرغوب ترین متریال موجود در بازار استفاده شده است',
                            id:'7567467',
                            name: 'ماهی قزل آلا', rate: 3.4,
                            price: 160000, discountPercent: 10, image: pasta_alferedo, tags: [],
                            description:'یک پرس ماهی قزل آلا 150 گرمی'
                        },
                        {
                            rateItems:[

                            ],id:'3453463',
                            name: 'ماهی سفید', rate: 3.4,
                            price: 140000, discountPercent: 10, image: pasta_alferedo, tags: [],
                            description:'یک پرس ماهی سفید 100 گرمی'
                        },
                    ]
                },
                {
                    name:'برنج ایرانی',
                    image:undefined,
                    items:[
                        {
                            rates:[
                                {text:'کیفیت',value:4},
                                {text:'حجم',value:3},
                                {text:'سلامت',value:5}
                            ],
                            details:[
                                ['نوع برنج','ایرانی'],
                                ['نوع گوشت','گوساله']
                            ],
                            commentsLength:24,
                            review:'این غذا خیلی غذای خوبی است . برای مشکل پسندان صو در صو پیشنهاد میشه . در این غذا ار مرغوب ترین متریال موجود در بازار استفاده شده است',
                            id:'63455344',
                            name: 'چلو کره ای ساده تک نفره', rate: 3.4,
                            price: 65000, discountPercent: 10, image: pasta_alferedo, tags: ['کبابی','ایرانی'],
                            description:'100 گرم چلو کره ساده'
                        },
                        {
                            rates:[
                                {text:'کیفیت',value:4},
                                {text:'حجم',value:3},
                                {text:'سلامت',value:5}
                            ],
                            details:[
                                ['نوع برنج','ایرانی'],
                                ['نوع گوشت','گوساله']
                            ],
                            commentsLength:24,
                            review:'این غذا خیلی غذای خوبی است . برای مشکل پسندان صو در صو پیشنهاد میشه . در این غذا ار مرغوب ترین متریال موجود در بازار استفاده شده است',
                            id:'6467863',
                            name: 'چلو کره ای ساده دو نفره', rate: 3.4,
                            price: 120000, discountPercent: 10, image: pasta_alferedo, tags: ['کبابی','ایرانی'],
                            description:'200 گرم چلو کره ساده'
                        },
                        {
                            rates:[
                                {text:'کیفیت',value:4},
                                {text:'حجم',value:3},
                                {text:'سلامت',value:5}
                            ],
                            details:[
                                ['نوع برنج','ایرانی'],
                                ['نوع گوشت','گوساله']
                            ],
                            commentsLength:24,
                            review:'این غذا خیلی غذای خوبی است . برای مشکل پسندان صو در صو پیشنهاد میشه . در این غذا ار مرغوب ترین متریال موجود در بازار استفاده شده است',
                            id:'645345',
                            name: 'چلو کره ای ساده چهار نفره', rate: 3.4,
                            price: 240000, discountPercent: 10, image: pasta_alferedo, tags: ['کبابی','ایرانی'],
                            description:'400 گرم چلو کره ساده'
                        },
                        {
                            rates:[
                                {text:'کیفیت',value:4},
                                {text:'حجم',value:3},
                                {text:'سلامت',value:5}
                            ],
                            details:[
                                ['نوع برنج','ایرانی'],
                                ['نوع گوشت','گوساله']
                            ],
                            commentsLength:24,
                            review:'این غذا خیلی غذای خوبی است . برای مشکل پسندان صو در صو پیشنهاد میشه . در این غذا ار مرغوب ترین متریال موجود در بازار استفاده شده است',
                            id:'345345',
                            name: 'چلو کره ای ته دیگی تک نفره', rate: 3.4,
                            price: 75000, discountPercent: 10, image: pasta_alferedo, tags: ['کبابی','ایرانی'],
                            description:'150 گرم چلو کره ته دیگی'
                        },
                        {
                            rates:[
                                {text:'کیفیت',value:4},
                                {text:'حجم',value:3},
                                {text:'سلامت',value:5}
                            ],
                            details:[
                                ['نوع برنج','ایرانی'],
                                ['نوع گوشت','گوساله']
                            ],
                            commentsLength:24,
                            review:'این غذا خیلی غذای خوبی است . برای مشکل پسندان صو در صو پیشنهاد میشه . در این غذا ار مرغوب ترین متریال موجود در بازار استفاده شده است',
                            id:'867674',
                            name: 'چلو کره ای ته دیگی دو نفره', rate: 3.4,
                            price: 140000, discountPercent: 10, image: pasta_alferedo, tags: ['کبابی','ایرانی'],
                            description:'300 گرم چلو کره ته دیگی'
                        },
                        {
                            rates:[
                                {text:'کیفیت',value:4},
                                {text:'حجم',value:3},
                                {text:'سلامت',value:5}
                            ],
                            details:[
                                ['نوع برنج','ایرانی'],
                                ['نوع گوشت','گوساله']
                            ],
                            commentsLength:24,
                            review:'این غذا خیلی غذای خوبی است . برای مشکل پسندان صو در صو پیشنهاد میشه . در این غذا ار مرغوب ترین متریال موجود در بازار استفاده شده است',
                            id:'645585',
                            name: 'چلو کره ای ته دیگی چهار نفره', rate: 3.4,
                            price: 280000, discountPercent: 10, image: pasta_alferedo, tags: ['کبابی','ایرانی'],
                            description:'600 گرم چلو کره ته دیگی'
                        },
                        {
                            rates:[
                                {text:'کیفیت',value:4},
                                {text:'حجم',value:3},
                                {text:'سلامت',value:5}
                            ],
                            details:[
                                ['نوع برنج','ایرانی'],
                                ['نوع گوشت','گوساله']
                            ],
                            commentsLength:24,
                            review:'این غذا خیلی غذای خوبی است . برای مشکل پسندان صو در صو پیشنهاد میشه . در این غذا ار مرغوب ترین متریال موجود در بازار استفاده شده است',
                            id:'6344534',
                            name: 'سبزی پلو تک نفره', rate: 3.4,
                            price: 65000, discountPercent: 10, image: pasta_alferedo, tags: ['کبابی','ایرانی'],
                            description:'100 گرم سبزی پلو'
                        },
                        {
                            rates:[
                                {text:'کیفیت',value:4},
                                {text:'حجم',value:3},
                                {text:'سلامت',value:5}
                            ],
                            details:[
                                ['نوع برنج','ایرانی'],
                                ['نوع گوشت','گوساله']
                            ],
                            commentsLength:24,
                            review:'این غذا خیلی غذای خوبی است . برای مشکل پسندان صو در صو پیشنهاد میشه . در این غذا ار مرغوب ترین متریال موجود در بازار استفاده شده است',
                            id:'64678463',
                            name: 'سبزی پلو دو نفره', rate: 3.4,
                            price: 120000, discountPercent: 10, image: pasta_alferedo, tags: ['کبابی','ایرانی'],
                            description:'200 گرم سبزی پلو'
                        },
                        {
                            rates:[
                                {text:'کیفیت',value:4},
                                {text:'حجم',value:3},
                                {text:'سلامت',value:5}
                            ],
                            details:[
                                ['نوع برنج','ایرانی'],
                                ['نوع گوشت','گوساله']
                            ],
                            commentsLength:24,
                            review:'این غذا خیلی غذای خوبی است . برای مشکل پسندان صو در صو پیشنهاد میشه . در این غذا ار مرغوب ترین متریال موجود در بازار استفاده شده است',
                            id:'6434565',
                            name: 'سبزی پلو چهار نفره', rate: 3.4,
                            price: 240000, discountPercent: 10, image: pasta_alferedo, tags: ['کبابی','ایرانی'],
                            description:'400 گرم سبزی پلو'
                        }
                    ]
                }
            ]
        },
        restoran_comments({id,pageSize,pageNumber}){
            return [
                {date:'1402/1/1/3/34',name:'رضا عباسی',comment:'کیفیت غذای رستوران خیلی خوب بود ، من خیلی خوشم آمد بهتر بود کمی گرم تر به دستم میرسی'},
                {date:'1402/1/1/3/34',name:'رضا عباسی',comment:'کیفیت غذای رستوران خیلی خوب بود ، من خیلی خوشم آمد بهتر بود کمی گرم تر به دستم میرسی'},
                {date:'1402/1/1/3/34',name:'رضا عباسی',comment:'کیفیت غذای رستوران خیلی خوب بود ، من خیلی خوشم آمد بهتر بود کمی گرم تر به دستم میرسی'},
                {date:'1402/1/1/3/34',name:'رضا عباسی',comment:'کیفیت غذای رستوران خیلی خوب بود ، من خیلی خوشم آمد بهتر بود کمی گرم تر به دستم میرسی'},
                {date:'1402/1/1/3/34',name:'رضا عباسی',comment:'کیفیت غذای رستوران خیلی خوب بود ، من خیلی خوشم آمد بهتر بود کمی گرم تر به دستم میرسی'},
                {date:'1402/1/1/3/34',name:'رضا عباسی',comment:'کیفیت غذای رستوران خیلی خوب بود ، من خیلی خوشم آمد بهتر بود کمی گرم تر به دستم میرسی'},
                {date:'1402/1/1/3/34',name:'رضا عباسی',comment:'کیفیت غذای رستوران خیلی خوب بود ، من خیلی خوشم آمد بهتر بود کمی گرم تر به دستم میرسی'},
            ]
        },
        restoran_coupons(){
            return [
                { id:'23423423',title:'کوپن 1',discountPercent: 10, minCartAmount:500000, maxDiscount:100000 },
                { id:'75684564',title:'کوپن 2',discountPercent: 10, maxDiscount:100000 },
                { id:'4235345',title:'کوپن 3',discountPercent: 10, minCartAmount:500000 },
                { id:'56345234',title:'کوپن 4',discountPercent: 10 },
                               
                { id:'23426',title:'کوپن 5',discount: 100000, minCartAmount:500000 },
                { id:'645634534',title:'کوپن 6',discount: 100000 },
              ]
        }
    }
}
