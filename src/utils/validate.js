//过滤特殊字符
export function stripscript(s){
    let pattern = new RegExp("[`~!@#$%^&*()=|{}':;',\\[\\].<>/?~! @#……￥（）;——|{}【】‘；：“”’。，、？]")
    let rs=""
    for(let i=0;i<s.length;i++){
        //substr(start,length)返回从start开始长度为length的子串
        //repalce(regExp,str)将匹配的部分用str替换
        rs=rs+s.substr(i,1).replace(pattern,'');
    }
    return rs
}

//验证邮箱
export function validateEmail(value){
    let reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
    if(!reg.test(value)){
        return false 
    }
    else{
        return true
    }
}

//验证密码
export function validatePass(value){
    let reg = /^(?!\D+$)(?![^a-zA-Z]+$)\S{6,20}$/
    if(!reg.test(value)){
        return false 
    }
    else{
        return true
    }
}

//验证验证码
export function validateCode(value){
    let reg=/^[a-z0-9]{6}$/
    if(!reg.test(value)){
        return false 
    }
    else{
        return true
    }
}