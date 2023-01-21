import Axios from 'axios';
export default function Apis({getState,token,getDateAndTime,showAlert,AIOServiceShowAlert,baseUrl}){
    return {
        async sabte_shomare_tamas(shomare_tamas){

    
            //نمونه درخواست get
            //let res = await Axios.get(url);
            //نمونه درخواست post
            let res = await Axios.post(url,{
                "firstName": "مشتریان",
                "lastName": "مشتریان",
                "fatherName": "مشتریان",
                "nationalId": "۱۱۱۱۱۱۱۱۱۱",
                "genderTypeId": "۱",
                "mobileNumbers": [
                  {
                    "mobileNumber":shomare_tamas,
                    "isDefault": true,
                  }
                ]
              });
              debugger;
        }
    }
}