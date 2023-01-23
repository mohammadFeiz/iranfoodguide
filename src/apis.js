import Axios from 'axios';
export default function Apis({getState,token,getDateAndTime,showAlert,AIOServiceShowAlert,baseUrl}){
    return {
        async sabte_shomare_tamas(shomare_tamas){
    
            //نمونه درخواست get
            //let res = await Axios.get(url);
            //نمونه درخواست post
            //let url='https://iranfoodguide.ir/api/People/AddMobileNumber';
            let url='https://localhost:7203/api/People/AddMobileNumber';

            try{
                let res = await Axios.post(url,
                {
                        "PersonId":3,
                        "MobileNumber": shomare_tamas,
                        "IsDefault": true
                });

                if(res.data.isSuccess){
                    AIOServiceShowAlert({
                        type:'success',
                        text:'شماره شما با موفقیت ثبت شد',
                        subtext:res.data.message
                    })
                    return true
                }
                else {
                    AIOServiceShowAlert({
                        type:'error',
                        text:'شماره ثبت نشد',
                        subtext:res.data.message
                    })
                    return false
                }
            }
            catch(error){

                debugger

            if(error.code=='ERR_NETWORK')    
            {
                AIOServiceShowAlert({
                    type:'error',
                    text:'شماره ثبت نشد',
                    subtext:'مشکل برقراری اینترنت'
                })
            }
            else
            {
                AIOServiceShowAlert({
                    type:'error',
                    text:'شماره ثبت نشد',
                    subtext:error.response.data.Message
                })
            }
                return false
            }
            
              
        }
    }
}