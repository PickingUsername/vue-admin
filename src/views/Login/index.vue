<template>
    <div id="login">
        <ul class="menu-tab">
            <li @click="toggleMenu(item)" :class="{'current':item.current}" v-for="item in menuTab" :key=item.id>{{item.txt}}</li>
        </ul>
        <div class="login-wrap">
            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" class="login-form" size="medium">
                <el-form-item prop="username" class="item-form">
                    <label for="username">邮箱</label>
                    <el-input id="username" type="text" v-model="ruleForm.username" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item prop="password" class="item-form">
                    <label for="password">密码</label>
                    <el-input id="password" type="password" v-model="ruleForm.password" autocomplete="off" minlength="6" maxlength="20"></el-input>
                </el-form-item>

                <el-form-item prop="password2" class="item-form" v-show="model==='signUp'">
                    <label for="password2">重复密码</label>
                    <el-input id="password2" type="password" v-model="ruleForm.password2" autocomplete="off" minlength="6" maxlength="20"></el-input>
                </el-form-item>

                <el-form-item prop="code" class="item-form">
                    <label for="code">验证码</label>
                    <el-row :gutter="11">
                        <el-col :span="15">
                            <el-input id="code" v-model="ruleForm.code"></el-input>
                        </el-col>
                        <el-col :span="9">
                            <el-button type="success" class="button" @click="getSms()" :disabled="codeButtonStatus.status">{{codeButtonStatus.text}}</el-button>
                        </el-col>
                    </el-row>
                    
                </el-form-item>

                <el-form-item>
                    <el-button size="medium" type="danger" @click="submitForm('ruleForm')" class="login-button button" :disabled="signInButtonStatus">{{model==='signIn'?'登录':'注册'}}</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
import sha1 from "js-sha1";
import {GetSms,SignUp,SignIn} from '@/api/login.js';
import axios from 'axios';
import {reactive,ref, isRef,toRef ,onMounted} from '@vue/composition-api';
import {stripscript,validateEmail,validatePass,validateCode} from '@/utils/validate';
export default {
    name:'login',
    setup(props,context){
        //声明函数
        //页面切换
        let toggleMenu = data=>{
            menuTab.forEach(it=>{
                it.current = false
            })
            data.current = true
            model.value = data.type
            //清除表单数据
            context.refs["ruleForm"].resetFields()
            //清除倒计时
            clearCountDown()
         }
        //清除表单数据
        const resetFormData=()=>{
            //重置表单
            context.refs["ruleForm"].resetFields()
        }
        //更新验证码按钮状态
        const updateButtonStatus=(data)=>{
            codeButtonStatus.status = data.status
            codeButtonStatus.text = data.text
        }
        //提交函数
        let submitForm = formName=>{
            context.refs[formName].validate((valid) => {
                if (valid) {
                    //判断当前是登录状态还是注册状态
                    model.value === 'signIn'? signIn():signUp()
                } 
                else {
                    console.log('登录错误!!');
                    return false;
                }
            });
        }

        //登录
        const signIn = ()=>{
            let requestData = {
                username:ruleForm.username,
                password:sha1(ruleForm.password),
                code:ruleForm.code
            }
            SignIn(requestData).then(response=>{
                console.log(response)
            }).catch(erro=>{})
        }
        //注册
        const signUp = ()=>{
            let requestData = {
                    username:ruleForm.username,
                    password:sha1(ruleForm.password),
                    code:ruleForm.code,
                    module:"register"
                }
                SignUp(requestData).then(response=>{
                    let message = response.message
                        context.root.$message({
                            message:`${message}`,
                            type:"success"
                        })
                    //回到登录界面
                    toggleMenu(menuTab[0])
                    //清除倒计时
                    clearCountDown()
                }).catch(error=>{})
        }
        //获取验证码
        let getSms = ()=>{
            if(ruleForm.username === ''){
                context.root.$message.error('邮箱不能为空');
                return false
            }
            if(!validateEmail(ruleForm.username)){
                context.root.$message.error('邮箱格式错误');
                return false
            }
            let requestData = {
                username:ruleForm.username,
                module: model.value==="signIn"?"login":"register"
            }
            //修改获取验证码按钮状态
            updateButtonStatus({status:true,text:"发送中..."})

            GetSms(requestData).then(response=>{
                let message = response.message
                context.root.$message({
                    message:`${message}`,
                    type:"success"
                })
                //启用登录或注册按钮
                signInButtonStatus.value = false
                //调用定时器
                countDown(60)
            }).catch(error=>{

            })
        }
        //倒计时
        const countDown = (t)=>{
            //判断定时器是否存在，若存在先清空
            if(timer.value){clearInterval(timer.value)}
            let time = t
            timer.value = setInterval(()=>{
                time--
                if(time === 0){
                    clearInterval(timer.value)
                    updateButtonStatus({status:false,text:"重新发送"})
                }else{
                    codeButtonStatus.text=`重新发送(${time}s)`
                }

            },1000)
        }
        //清除倒计时
        const clearCountDown=()=>{
            updateButtonStatus({status:false,text:"获取验证码"})
            clearInterval(timer.value)
        }
        //验证用户名规则
        let validateUsername = (rule, value, callback) => {
            if (value === '') {
            callback(new Error('请输入用户名'));
            }
            else if(!validateEmail(value)){
                callback(new Error('用户名格式错误'))
            }
            else{
                callback()
            }
        }
        //验证密码规则
        let validatePassword = (rule, value, callback) => {
            //将密码中的特殊字符过滤
            ruleForm.password = stripscript(value)
            value = ruleForm.password

            if (value === '') {
                callback(new Error('请输入密码'));
            } 
            else if(!validatePass(value)) {
                callback(new Error('密码格式错误'));
            }
            else{
                callback();
            }
        };
        //验证重复密码规则
        let validatePassword2 = (rule, value, callback) => {
            //如果是登录状态，直接通过验证
            if(model.value === 'signIn'){
                callback()
            }
            //将密码中的特殊字符过滤
            ruleForm.password2 = stripscript(value)
            value = ruleForm.password2

            if (value === '') {
                callback(new Error('请再次输入密码'));
            } 
            else if(value !== ruleForm.password){
                callback(new Error('两次密码输入不一致'));
            }
            else{
                callback();
            }
        };

        //验证验证码规则
        let checkCode = (rule, value, callback) =>{
            //将密码中的特殊字符过滤
            ruleForm.code = stripscript(value)
            value = ruleForm.code

            if (value === '') {
                return callback(new Error('验证码不能为空'));
            }
            else if(!validateCode(value)){
                return callback(new Error('验证码格式错误'));
            }
            else{
                return callback();
            }
        };
        //倒计时
        const timer = ref(null)
        //声明表单绑定数据
        const ruleForm = reactive({
                username: '',
                password: '',
                password2:'',
                code: ''
        })
        //声明表单验证数据
        const rules = reactive({
                username: [
                    { validator: validateUsername, trigger: 'blur' }
                ],
                password: [
                    { validator: validatePassword, trigger: 'blur' }
                ],
                password2: [
                    { validator: validatePassword2, trigger: 'blur' }
                ],
                code: [
                    { validator: checkCode, trigger: 'blur' }
                ]
        })
        //菜单数据
        const menuTab = reactive([
                {txt:"登录",current:true,type:'signIn'},
                {txt:"注册",current:false,type:'signUp'}
        ])

        //模块值
        const model = ref('signIn')
        //登录按钮禁用状态
        const signInButtonStatus = ref(true)
        //验证码按钮状态
        const codeButtonStatus = reactive({
            status:false,
            text:"获取验证码"
        })
        //生命周期，挂载完成后
        onMounted(()=>{

        })
        return {
            menuTab,
            model,
            signInButtonStatus,
            codeButtonStatus,
            ruleForm,
            rules,
            toggleMenu,
            submitForm,
            getSms
        }
    }
}
</script>
<style lang="scss" scoped>
#login {
    height: 100vh;
    background-color: #344a5f
}
.login-wrap {
    width:330px;
    margin: auto;
}
.menu-tab {
    text-align: center;

    li{
        cursor: pointer;
        display: inline-block;
        width:88px;
        line-height: 36px;
        font-size: 14px;
        color:#fff;
        border-radius: 2px
    }
    .current{
        background-color: rgba(0,0,0,.1)
    }
}
.login-form {
    margin-top: 29px;
    .item-form{
        margin-bottom: 13px;
        label{
            display: block;
            font-size: 14px;
            color: #fff;
            margin-bottom: 3px;
        }
    }
}
.button{
    width:100%;
    height:36px;
    display: block;
}
.login-button{
    margin-top: 19px
}
</style>