import Axios from 'axios';
export default function Apis({getState,token,getDateAndTime,showAlert,AIOServiceShowAlert,baseUrl}){
    return {
        async sabte_shomare_tamas(shomare_tamas){

    
            //نمونه درخواست get
            //let res = await Axios.get(url);
            //نمونه درخواست post
            let url='https://iranfoodguide.ir/api/People/AddMobileNumber';
            
            let res = await Axios.post(url,
              {
                    "PersonId":1,
                    "MobileNumber": shomare_tamas,
                    "IsDefault": true
              });
              if(res.data.isSuccess){return true}
              else {return res.data.message}
        }
    }
}