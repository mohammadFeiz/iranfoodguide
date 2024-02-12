import AIOApis from "../npm/aio-apis/index.tsx";

type I_checkToken_param = string;
type I_checkToken_result = {id:number} | false;
type I_checkToken = (token:I_checkToken_param)=>Promise<I_checkToken_result>;

type I_OTPNumber_param = string;
type I_OTPNumber_result = {isRegistered:boolean} | false;
type I_OTPNumber = (mobileNumber:I_OTPNumber_param)=>Promise<I_OTPNumber_result>

type I_OTPCode_param = {mobileNumber:string,code:string};
type I_OTPCode_result = {id:number,token:string} | false;
type I_OTPCode = (p:I_OTPCode_param)=>Promise<I_OTPCode_result>;

type I_PhoneNumber_param = {userId:string,password:string};
type I_PhoneNumber_result = {id:number,token:string} | false;
type I_PhoneNumber = (p:I_PhoneNumber_param)=>Promise<I_PhoneNumber_result>

export type I_loginApis = {checkToken:I_checkToken,OTPNumber:I_OTPNumber,OTPCode:I_OTPCode,PhoneNumber:I_PhoneNumber}
export default class LoginApis extends AIOApis{
    checkToken:I_checkToken = async (token:I_checkToken_param)=>{
        return await this.getResult({
            config:{message:{error:false},token,errorResult:false},
            id:'checkToken',method:'get',
            url:`${this.baseUrl}/Users/WhoAmI`,
            getResult:(response)=>{
                let id:number;
                try { id = response.data.data.id; }
                catch { return 'missing id in response of /Users/WhoAmI'}
                let result:I_checkToken_result = {id};
                return result
            }
        })
    }
    OTPNumber:I_OTPNumber = async (mobileNumber:I_OTPNumber_param)=>{
        return await this.getResult({
            config:{description:'ارسال شماره همراه',errorResult:false},
            id:'OTPNumber',method:'post',
            url:`${this.baseUrl}/Users/GenerateUserCode`,
            body:{ mobileNumber },
            getResult:(response)=>{
                let result:I_OTPNumber_result = {isRegistered:!!response.data.data.isRegistered}
                return result
            }
        })
    }
    OTPCode:I_OTPCode = async (p:I_OTPCode_param)=>{
        let {mobileNumber,code} = p;
        return await this.getResult({
            config:{description:'ارسال کد یکبار مصرف',errorResult:false},
            id:'OTPCode',method:'post',
            url:`${this.baseUrl}/Users/TokenWithCode`,
            body:{mobileNumber,code},
            getResult:(response)=>{
                let result:I_OTPCode_result = {id:response.data.data.personId,token:response.data.data.access_token}
                return result;
            }
        })
    }
    PhoneNumber:I_PhoneNumber = async (p:I_PhoneNumber_param)=>{
        let {userId,password} = p;
        return await this.getResult({
            config:{description:'ارسال شماره همراه و رمز عبور',errorResult:false},
            id:'PhoneNumber',method:'post',
            url:`${this.baseUrl}/Users/Token`,
            body:{ Username: userId, Password: password, grant_type: "password" },
            getResult:(response)=>{
                let result:I_PhoneNumber_result = {id:response.data.data.personId,token:response.data.data.access_token}
                return result;
            }
        })
    }
}