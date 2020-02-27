import service from '@/utils/request'

//获取验证码接口
export function GetSms(data){
    service.request({
        method:'post',
        url:'/getSms/',
        data:data
    })
}