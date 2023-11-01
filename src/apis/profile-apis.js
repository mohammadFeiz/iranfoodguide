export default function profileApis({baseUrl,Axios}){
    return {
        setProfile:async ({ profile, mobile,isRegistered })=> {
            let url = `${baseUrl}/People/${isRegistered ? 'UpdateProfile' : 'CreateProfile'}`
            let body = {
                "Id": profile.id,
                "firstName": profile.firstName,//نام
                "lastName": profile.lastName,
                "email": profile.email,
                "sheba": profile.sheba,
                "mobileNumbers": [
                    {
                        "mobileNumber": mobile,
                        "isDefault": true
                    }
                ]
            }
            let response = await Axios.post(url, body);
            return { response }
        },
        setPassword:async ( {mobile,password}) =>{
            //var baseUrl1 = 'https://localhost:7203'
              var baseUrl1 = 'https://iranfoodguide.ir'
                 let url = `${baseUrl1}/Users/ChangePasswordByAdmin`
                 let body = {
                     "MobileNumber": mobile,
                     "NewPassword": password,
                 }
                 let response = await Axios.post(url, body);
                 return { response }
        },
        getProfile:async (parameter,{personId}) => {
            let url = `${baseUrl}/People/search`
            let body = { "Id": personId }
            let response = await Axios.post(url, body);
            let result = response.data.data.items[0]
            return { response, result }
        },
        getAddresses:async (parameter,{personId}) => {//لیست آدرس ها
            let url = `${baseUrl}/People/GetPeopleAddress`
            let body = {
                "PersonId": personId
            }
            let response = await Axios.post(url, body);

            let result = response.data.data.map((o) => {
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
            return { response, result }
        },
        takhfif_ha:async (parameter,{personId}) => {
            return getMockApis.takhfif_ha()
            let url = `${baseUrl}/PersonDiscount/Search`;
            let body = { "PersonId": personId }
            let response = await Axios.post(url, body);
            let result = response.data.data.items;
            return { response, result };
        },
        addressForm:async ({ address, type },{personId}) =>{
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
                let response = await Axios.post(url, body);
                return { response }
            }
            else {

            }
        },
        mojoodiye_kife_pool:async () => {
            return getMockApis.mojoodiye_kife_pool()
        },
        
             
    }
}

const getMockApis = {
    getProfile:()=> {
        let result = {
            firstName: 'احمد',//نام
            lastName: 'بهرامی',//نام خانوادگی
            mobile: '09123534314',//شماره همراه
            email: 'feiz.ms@gmail.com',//آدرس ایمیل
            sheba: '1234567',//شماره شبا
        }
        return {result}
    },
    getAddresses:() =>{
        let result = [//لیست آدرس ها
            {
                title: 'خانه',
                address: 'تهران شیخ بهایی شمالی نوربخش',
                number: 30,
                unit: 4,
                floor: 2,
                id: '0',
                description: '',
                phone: '02188050006',
                latitude: 35.760528,
                longitude: 51.394777
            }
        ]
        return {result}
    },
    takhfif_ha:(res) => {
        let result = [
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
        return {result}
    },
    mojoodiye_kife_pool() {
        return { result: 123245666 }
    },
    
    
    
    
}