import service from '@/utils/request'

//获取验证码接口
export function GetSms(data){
    return service.request({
        method:'post',
        url:'/getSms/',
        data:data
    })
}

//注册接口
export function SignUp(data){
    return service.request({
        method:'post',
        url:'/register/',
        data:data
    })
}

//登录接口
export function SignIn(data){
    return service.request({
        method:'post',
        url:'/login/',
        data:data
    })
}