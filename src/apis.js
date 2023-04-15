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
export function getResponse(){
    let baseUrl = 'https://localhost:7203/api'
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
        async setProfile({ profile, registered }) {
            let url = `${baseUrl}/People/${registered?'UpdateProfile':'CreateProfile'}`
            let body = {
                "Id":profile.id,
                "firstName": profile.firstname,//نام
                "lastName": profile.lastname,
                "email": profile.email,
                "sheba": profile.sheba,
                "mobileNumbers": [
                    {
                        "mobileNumber": profile.mobile,
                        "isDefault": true
                    }
                ]
            }
            let response = await Axios.post(url,body);
            return {response}
        },
        async takhfif_ha(PersonId = 10010) {
            let url = `${baseUrl}/PersonDiscount/Search`;
            let body = {"PersonId": PersonId}
            let response = await Axios.post(url,body);
            let result = response.data.data.items;
            return {response,result};
        },
        async addressForm({ model, type,PersonId = 10011}) {
            if (type === 'add') {
                let url = `${baseUrl}/People/CreatePeopleAddress`;
                let body = {
                    "personId": PersonId,
                    "address": {
                      "fullAddress": model.address,
                      "latitude": model.latitude,
                      "longitude": model.longitude,
                      "phoneNumber": model.phone
                    },
                    "title": model.title
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
            return {mock:true}   
        },
        async mojoodiye_kife_pool() {
            return {mock:true}
        },
        async tarikhcheye_kife_pool() {
           return {mock:true} 
        }
    }
}

export function getMock({helper}){
    return {
        async getProfile() {
            return {
                firstname: 'احمد',//نام
                lastname: 'بهرامی',//نام خانوادگی
                mobile: '09123534314',//شماره همراه
                email: 'feiz.ms@gmail.com',//آدرس ایمیل
                sheba: '1234567',//شماره شبا
                addressId: '0',//آی دی آدرس منتخب
                addresses: [//لیست آدرس ها
                    {
                        title: 'خانه',
                        address: 'آدرس  یبلیلیبل یبل یبل یبل یبل یبل یبل یبل یبل یبل یبل یبل یبلی غاقف غاقفغ بفعغ قفغ قفغ قفغ 1',
                        number: 30,
                        unit: 4,
                        floor: 2,
                        id: '0',
                        description: '',
                        phone: '02188050006'
                    }
                ],
                kife_pool: {
                    mojoodi: 12343546567,
                    tarikhche: []
                }
            }
        },
        async takhfif_ha(res) {
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
        async safheye_sefaresh(res) {
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
                            price: 210000, discount: 15, image: pasta_alferedo, tags: []
                        },
                        {
                            name: ' rtyrty rty rty rtyپاستا آلفردو ', shopName: 'رستوران شاندیز گالریا', rate: 3.4,
                            price: 210000, discount: 15, image: pasta_alferedo, tags: []
                        },
                        {
                            name: 'پاستا آلفردو ', shopName: 'رستوران شاندیز گالریا', rate: 3.4,
                            price: 210000, discount: 15, image: pasta_alferedo, tags: []
                        },
                        {
                            name: 'پاستا آلفردو ', shopName: 'رستوران شاندیز گالریا', rate: 3.4,
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
        async restoran_haye_mahboob() {
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
        async mojoodiye_kife_pool() {
            return 123245666
        },
        async tarikhcheye_kife_pool() {
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
        }
    }
}
