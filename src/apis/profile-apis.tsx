import { I_address, I_address_server, I_profile, I_takhfif } from "../typs";

export default function profileApis({ baseUrl, Axios }) {
    return {
        setProfile: async (profile,{Login}) => {
            let {isRegistered} = Login.getUserInfo()
            let mobile = Login.getUserId();
            let url = `${baseUrl}/People/${isRegistered ? 'UpdateProfile' : 'CreateProfile'}`
            let body = {
                "Id": profile.id,
                "firstName": profile.firstName,//نام
                "lastName": profile.lastName,
                "email": profile.email,
                "sheba": profile.sheba,
                "mobileNumbers": [{"mobileNumber": mobile,"isDefault": true}]
            }
            let response = await Axios.post(url, body);
            return { response }
        },
        removeAccount: async (parameter, { Login }) => {
            baseUrl = baseUrl.replace('/api', '');
            let url = `${baseUrl}/Users/DeleteUserProfileAsync`
            let mobile = Login.getUserId();
            let body = {"mobileNumber": mobile,}
            let response = await Axios.post(url, body);
            return { response }
        },
        setPassword: async (password ,{Login}) => {
            let mobile = Login.getUserId();
            baseUrl = baseUrl.replace('/api','');
            let url = `${baseUrl}/Users/ChangePasswordByAdmin`
            let body = {"MobileNumber": mobile,"NewPassword": password}
            let response = await Axios.post(url, body);
            return { response }
        },
        getProfile: async (parameter, { Login }) => {
            let url = `${baseUrl}/People/search`
            let {id} = Login.getUserInfo();
            let body = { "Id": id }
            let response = await Axios.post(url, body);
            let result = response.data.data.items[0]
            return { response, result }
        },
        getAddresses: async (parameter, { Login }) => {//لیست آدرس ها
            let url = `${baseUrl}/People/GetPeopleAddress`
            let {id} = Login.getUserInfo();
            let body = {"PersonId": id}
            let response = await Axios.post(url, body);
            let addresses = response.data.data;
            if(!Array.isArray(addresses)){return {response,result:'آدرس های دریافتی نا معتبر است'}}
            let result = addresses.map((o:I_address_server) => {
                let address:I_address = {
                    title: o.title,
                    address: o.address,
                    number: '30',
                    unit: '4',
                    floor: '2',
                    id: o.id,
                    description: o.description,
                    phone: o.phoneNumber
                }
                return address 
            });
            return { response, result }
        },
        takhfif_ha: async (parameter, { Login }) => {
            return getMockApis.takhfif_ha()
            let url = `${baseUrl}/PersonDiscount/Search`;
            let {id} = Login.getUserInfo();
            let body = { "PersonId": id }
            let response = await Axios.post(url, body);
            let result = response.data.data.items;
            return { response, result };
        },
        addressForm: async ({ address, type }, { Login }) => {
            if (type === 'add') {
                let url = `${baseUrl}/People/CreatePeopleAddress`;
                let {id} = Login.getUserInfo();
                let body = {
                    "personId": id,
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
        getWalletAmount: async () => {
            return getMockApis.getWalletAmount()
        },


    }
}
type I_getMockApis = {
    getProfile:()=>{result:I_profile},
    getAddresses:()=>{result:I_address[]},
    takhfif_ha:()=>{result:I_takhfif[]},
    getWalletAmount:()=>{result:number}
}
const getMockApis:I_getMockApis = {
    getProfile: () => {
        let result = {
            id:12,
            firstName: 'احمد',//نام
            lastName: 'بهرامی',//نام خانوادگی
            mobile: '09123534314',//شماره همراه
            email: 'feiz.ms@gmail.com',//آدرس ایمیل
            sheba: '1234567',//شماره شبا
        }
        return { result }
    },
    getAddresses: () => {
        let result = [//لیست آدرس ها
            {
                title: 'خانه',
                address: 'تهران شیخ بهایی شمالی نوربخش',
                number: '30',
                unit: '4',
                floor: '2',
                id: '0',
                description: '',
                phone: '02188050006',
                latitude: 35.760528,
                longitude: 51.394777
            }
        ]
        return { result }
    },
    takhfif_ha: () => {
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
        return { result }
    },
    getWalletAmount() {
        return { result: 123245666 }
    },




}