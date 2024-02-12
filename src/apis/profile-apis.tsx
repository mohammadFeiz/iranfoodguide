import { I_address, I_address_server, I_profile } from "../typs";
import $ from 'jquery';
export default function profileApis({ baseUrl, Axios }) {
    return {
        setProfile: async (profile, { Login }) => {
            let { isRegistered } = Login.getUserInfo()
            let mobile = Login.getUserId();
            let url = `${baseUrl}/People/${isRegistered ? 'UpdateProfile' : 'CreateProfile'}`
            let body = {
                "Id": profile.id,
                "firstName": profile.firstName,//نام
                "lastName": profile.lastName,
                "email": profile.email,
                "sheba": profile.sheba,
                "mobileNumbers": [{ "mobileNumber": mobile, "isDefault": true }]
            }
            let response = await Axios.post(url, body);
            let result = true;
            return { response, result }
        },
        removeAccount: async (parameter, { Login }) => {
            baseUrl = baseUrl.replace('/api', '');
            let url = `${baseUrl}/Users/DeleteUserProfileAsync`
            let mobile = Login.getUserId();
            let body = { "mobileNumber": mobile, }
            let response = await Axios.post(url, body);
            return { response }
        },
        setPassword: async (password, { Login }) => {
            let mobile = Login.getUserId();
            baseUrl = baseUrl.replace('/api', '');
            let url = `${baseUrl}/Users/ChangePasswordByAdmin`
            let body = { "MobileNumber": mobile, "NewPassword": password }
            let response = await Axios.post(url, body);
            return { response }
        },
        getProfile: async (parameter, { Login }) => {
            let url = `${baseUrl}/People/search`
            let { id } = Login.getUserInfo();
            let body = { "Id": id }
            let response = await Axios.post(url, body);
            let result = response.data.data.items[0]
            return { response, result }
        },
        addressForm: async ({ address, type }, { Login }) => {
            if (type === 'add') {
                let url = `${baseUrl}/People/CreatePeopleAddress`;
                let { id } = Login.getUserInfo();
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
        

    }
}
type I_getMockApis = {
    getProfile: () => { result: I_profile },
}
const getMockApis: I_getMockApis = {
    getProfile: () => {
        let result = {
            id: 12,
            firstName: 'احمد',//نام
            lastName: 'بهرامی',//نام خانوادگی
            mobile: '09123534314',//شماره همراه
            email: 'feiz.ms@gmail.com',//آدرس ایمیل
            sheba: '1234567',//شماره شبا
        }
        return { result }
    }
}


