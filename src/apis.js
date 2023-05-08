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
        async jostojooye_restoran(){
            return {mock:true}
        },
        async tarikhche_ye_jostojoo(){
            return {mock:true} 
        },
        async hazfe_tarikhche_ye_jostojoo(){
            return {mock:true} 
        },
        async ghaza_haye_restoran(){
            return {mock:true}
        },
        async restoran_comments(){
            return {mock:true}
        },
        async restoran_coupons(){
            return {mock:true}
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
                    type: 'billboard',
                    items: [{src: frame210},{src: frame210},{src: frame210},{src: frame210}]
                },
                {
                    type: 'categories',
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
                    type: 'slider',
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
                    type: 'slider',
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
                    type: 'slider',name: 'غذا های تخفیف دار',cardSize: { width: 160 },
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
                    type: 'slider',name: 'جدید ترین رزروی ها',
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
        jostojooye_restoran(){
            return [
                {
                    id:'34',name: 'رستوران 1',image: shandiz_image,logo: shandiz_logo,
                    rate: 3.4,distance: 3,time: 35,tags: ['ایرانی', 'کبابی', 'فست فود','خارجی','سالادبار','عربی','صبحانه']
                },
                {
                    id:'6453',name: 'رستوران 2',image: shandiz_image,logo: shandiz_logo,
                    rate: 3.4,distance: 3,time: 35,tags: ['خارجی', 'سنتی', 'کبابی', 'سالادبار']
                },
                {
                    id:'7563',name: 'رستوران 3', image: shandiz_image, logo: shandiz_logo, rate: 3.4, distance: 3, time: 35,
                    tags: ['عربی', 'سنتی', 'سالادبار', 'ملل']
                },
                {
                    id:'27879',name: 'رستوران 4', image: shandiz_image, logo: shandiz_logo, rate: 3.4, distance: 3, time: 35,
                    tags: ['صبحانه', 'سنتی', 'عربی', 'ملل']
                },
                {
                    id:'2342356',name: 'رستوران 5', image: shandiz_image, logo: shandiz_logo, rate: 3.4, distance: 3, time: 35,
                    tags: ['ایرانی ', 'خارجی', 'فست فود', 'کبابی']
                },
                {
                    id:'2356345',name: 'رستوران 6', image: shandiz_image, logo: shandiz_logo, rate: 3.4, distance: 3, time: 35,
                    tags: ['صبحانه', 'سنتی', 'عربی', 'ملل']
                },
                {
                    id:'457744',name: 'رستوران 7', image: shandiz_image, logo: shandiz_logo, rate: 3.4, distance: 3, time: 35,
                    tags: ['عربی', 'سنتی', 'سالادبار', 'ملل']
                },
                {
                    id:'3467568',name: 'رستوران 8', image: shandiz_image, logo: shandiz_logo, rate: 3.4, distance: 3, time: 35,
                    tags: ['صبحانه', 'سنتی', 'کبابی', 'ملل']
                },
                {
                    id:'234577',name: 'رستوران 9', image: shandiz_image, logo: shandiz_logo, rate: 3.4, distance: 3, time: 35,
                    tags: ['ایرانی ', 'سنتی', 'سالادبار', 'ملل']
                },
                {
                    id:'95544',name: 'رستوران 10', image: shandiz_image, logo: shandiz_logo, rate: 3.4, distance: 3, time: 35,
                    tags: ['خارجی', 'سنتی', 'فست فود', 'ملل']
                },
                {
                    id:'5436473',name: 'رستوران 11', image: shandiz_image, logo: shandiz_logo, rate: 3.4, distance: 3, time: 35,
                    tags: ['عربی', 'سنتی', 'کبابی', 'ملل']
                },
                {
                    id:'534643',name: 'رستوران 12', image: shandiz_image, logo: shandiz_logo, rate: 3.4, distance: 3, time: 35,
                    tags: ['سنتی', 'صبحانه', 'سالادبار']
                },
                {
                    id:'6586743',name: 'رستوران 13', image: shandiz_image, logo: shandiz_logo, rate: 3.4, distance: 3, time: 35,
                    tags: ['ایرانی ', 'سنتی', 'خارجی', 'ملل']
                },
                {
                    id:'675363',name: 'رستوران 14', image: shandiz_image, logo: shandiz_logo, rate: 3.4, distance: 3, time: 35,
                    tags: ['صبحانه', 'سنتی', 'خارجی', 'ملل']
                },
                {
                    id:'89342367',name: 'رستوران 16', image: shandiz_image, logo: shandiz_logo, rate: 3.4, distance: 3, time: 35,
                    tags: ['ایرانی ', 'سنتی', 'عربی', 'ملل']
                },
                {
                    id:'768645',name: 'رستوران 16', image: shandiz_image, logo: shandiz_logo, rate: 3.4, distance: 3, time: 35,
                    tags: ['سالادبار', 'سنتی', 'کبابی', 'عربی']
                },
                {
                    id:'7453456',name: 'رستوران 17', image: shandiz_image, logo: shandiz_logo, rate: 3.4, distance: 3, time: 35,
                    tags: ['خارجی', 'سنتی', 'کبابی', 'سالادبار']
                },
                
            ]
        },
        tarikhche_ye_jostojoo(){
            return ['برگر','پیتزا','پاستا'] 
        },
        hazfe_tarikhche_ye_jostojoo(){
            return true 
        },
        ghaza_haye_restoran(){
            return [
                {
                    id:'644263',name: 'پاستا آلفردو ', shopName: 'رستوران شاندیز گالریا', rate: 3.4,
                    price: 210000, discount: 15, image: pasta_alferedo, tags: [],
                    description:'250 گرم گوشت مخلوط گوساله و گوسفندی  همراه با 300 گرم برنج ایرانی در بسته بندی ماکرویوو'
                },
                {
                    id:'6534534',name: 'پاستا آلفردو ', shopName: 'رستوران شاندیز گالریا', rate: 3.4,
                    price: 210000, discount: 15, image: pasta_alferedo, tags: [],
                    description:'250 گرم گوشت مخلوط گوساله و گوسفندی  همراه با 300 گرم برنج ایرانی در بسته بندی ماکرویوو'
                },
                {
                    id:'3456743',name: 'پاستا آلفردو ', shopName: 'رستوران شاندیز گالریا', rate: 3.4,
                    price: 210000, discount: 15, image: pasta_alferedo, tags: [],
                    description:'250 گرم گوشت مخلوط گوساله و گوسفندی  همراه با 300 گرم برنج ایرانی در بسته بندی ماکرویوو'
                },
                {
                    id:'756453',name: 'پاستا آلفردو ', shopName: 'رستوران شاندیز گالریا', rate: 3.4,
                    price: 210000, discount: 15, image: pasta_alferedo, tags: [],
                    description:'250 گرم گوشت مخلوط گوساله و گوسفندی  همراه با 300 گرم برنج ایرانی در بسته بندی ماکرویوو'
                }
            ]
        },
        restoran_comments(){
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
                { percent: 10, amount: 100000 },
                { percent: 10, amount: 100000 },
                { percent: 10, amount: 100000 },
                { percent: 10, amount: 100000 },
                { percent: 10, amount: 100000 },
                { percent: 10, amount: 100000 }
              ]
        }
    }
}
