<template>
    <div id="login">
        <ul class="menu-tab">
            <li @click="toggleMenu(item)" :class="{'current':item.current}" v-for="item in menuTab" :key=item.id>{{item.txt}}</li>
        </ul>
        <div class="login-wrap">
            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" class="login-form" size="medium">
                <el-form-item prop="username" class="item-form">
                    <label>邮箱</label>
                    <el-input type="text" v-model="ruleForm.username" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item prop="password" class="item-form">
                    <label>密码</label>
                    <el-input type="password" v-model="ruleForm.password" autocomplete="off" minlength="6" maxlength="20"></el-input>
                </el-form-item>

                <el-form-item prop="password2" class="item-form" v-show="model==='signUp'">
                    <label>重复密码</label>
                    <el-input type="password" v-model="ruleForm.password2" autocomplete="off" minlength="6" maxlength="20"></el-input>
                </el-form-item>

                <el-form-item prop="code" class="item-form">
                    <label>验证码</label>
                    <el-row :gutter="11">
                        <el-col :span="15">
                            <el-input v-model="ruleForm.code"></el-input>
                        </el-col>
                        <el-col :span="9">
                            <el-button type="success" class="button">获取验证码</el-button>
                        </el-col>
                    </el-row>
                    
                </el-form-item>

                <el-form-item>
                    <el-button size="medium" type="danger" @click="submitForm('ruleForm')" class="login-button button">提交</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
import {stripscript,validateEmail,validatePass,validateCode} from '@/utils/validate'
export default {
    name:'login',
    data(){
        //验证用户名规则
        var validateUsername = (rule, value, callback) => {
            if (value === '') {
            callback(new Error('请输入用户名'));
            }
            else if(!validateEmail(value)){
                callback(new Error('用户名格式错误'))
            }
            else{
                callback()
            }
        };
        //验证密码规则
        var validatePassword = (rule, value, callback) => {
            //将密码中的特殊字符过滤
            this.ruleForm.password = stripscript(value)
            value = this.ruleForm.password

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
        var validatePassword2 = (rule, value, callback) => {
            //如果是登录状态，直接通过验证
            if(this.model === 'signIn'){
                callback()
            }
            //将密码中的特殊字符过滤
            this.ruleForm.password2 = stripscript(value)
            value = this.ruleForm.password2

            if (value === '') {
                callback(new Error('请再次输入密码'));
            } 
            else if(value !== this.ruleForm.password){
                callback(new Error('两次密码输入不一致'));
            }
            else{
                callback();
            }
        };

        //验证验证码规则
        var checkCode = (rule, value, callback) => {
            //将密码中的特殊字符过滤
            this.ruleForm.code = stripscript(value)
            value = this.ruleForm.password

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
        return{
            model:'signIn',
            menuTab:[
                {txt:"登录",current:true,type:'signIn'},
                {txt:"注册",current:false,type:'signUp'}
            ],
            ruleForm: {
                username: '',
                password: '',
                password2:'',
                code: ''
            },
            rules: {
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
            }
        }
    },
    methods:{
        toggleMenu(data){
            this.model = data.type
            this.menuTab.forEach(it=>{
                it.current = false
            })
            data.current = true
        },
        submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    },
    create(){

    },
    mount(){

    },
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