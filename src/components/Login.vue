<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">计数器管理系统</div>

            <div class="myLogin" v-show="registerFlag">
                <el-form :model="ruleForm2" ref="ruleForm2" label-width="0px" class="ms-content">
                    <el-form-item prop="userName">
                        <el-input v-model="ruleForm2.userName" placeholder="用户名">
                            <el-button slot="prepend" icon="el-icon-s-check"></el-button>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input type="password" placeholder="密码" v-model="ruleForm2.userPwd">
                            <el-button slot="prepend" icon="el-icon-edit-outline"></el-button>
                        </el-input>
                    </el-form-item>
                    <div class="login-btn">
                        <el-button type="primary" @click="login">登录</el-button>
                        <el-button type="primary" @click="toRegister">注册</el-button>
                    </div>
                    <p class="login-tips" v-show="errorTip">用户名或者密码错误</p>
                </el-form>
            </div>

            <div class="ms-register" v-show="!registerFlag">
                <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm"  class="ms-content">
                    <el-form-item label="" prop="username">
                        <el-input v-model="ruleForm.username" clearable placeholder="用户名">
                           <el-button slot="prepend" icon="el-icon-s-check"></el-button> 
                        </el-input>
                    </el-form-item>                    
                    <!-- <el-form-item label="" prop="email">
                        <el-input v-model="ruleForm.email" clearable placeholder="邮箱">
                           <el-button slot="prepend" icon="el-icon-eleme"></el-button> 
                        </el-input>
                    </el-form-item> -->
                    <el-form-item label="" prop="pass">
                        <el-input type="password" v-model="ruleForm.pass" autocomplete="off" placeholder="密码" clearable>
                            <el-button slot="prepend" icon="el-icon-s-goods"></el-button> 
                        </el-input>
                    </el-form-item> 
                    <el-form-item label="" prop="checkPass">
                        <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off" placeholder="确认密码" clearable>
                            <el-button slot="prepend" icon="el-icon-goods"></el-button> 
                        </el-input>
                    </el-form-item>
                    <div class="login-btn">
                        <el-button type="primary" @click="toLogin">返回登录</el-button>
                        <el-button type="primary" @click="submitForm('ruleForm')">确认注册</el-button>
                    </div>
                    <br>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    export default {
        data: function(){
            
            var validatePass = (rule, value, callback) => {
                let reg = /(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^[^\s\u4e00-\u9fa5]{6,16}$/;
                if (value === '') {
                    callback(new Error('请输入密码'));
                }else if(!reg.test(value)){
                    callback(new Error('密码长度需6-16位，且包含字母和字符'))
                } else {
                    if (this.ruleForm.checkPass !== '') {
                        this.$refs.ruleForm.validateField('checkPass');
                    }
                    callback();
                }
            };
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.ruleForm.pass) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            return {
                swiperOptions: {
                    autoplay:{
                        delay:2000,
                    },
                    pagination: {
                        el: '.swiper-pagination'
                    }
                },
                errorTip:false,
                registerFlag:this.$store.state.registerState,
                userExist:false,
                emaiExist:false,
                ruleForm2: {
                    userName: '',
                    userPwd: ''
                },
                ruleForm: {
                    username:'',
                    checkPass: '',
                    pass: '',
                    //email: '847124730@qq.com'
                },
                rules: {
                    pass: [
                        { validator: validatePass, trigger: 'blur' }
                    ],
                    checkPass: [
                        { validator: validatePass2, trigger: 'blur' }
                    ],
                    // email: [
                    //     { validator: checkEmail, trigger: 'blur' }
                    // ]
                },
                // load:false
            }
        },
        computed:{
            swiper() {
                return this.$refs.mySwiper.$swiper
            }
        },
        mounted(){
            // this.swiper.slideTo(3,1000,false)
        },
        methods: {
            login(){
                if(!this.ruleForm2.userName || !this.ruleForm2.userPwd){
                  this.errorTip = true;
                  sessionStorage.setItem("loginstate","1")
                  return;
                }
                // console.log(this.ruleForm2.userName)
                axios.post("/api/login",{
                  userName:this.ruleForm2.userName,
                  userPwd:this.ruleForm2.userPwd
                }).then((response)=>{
                    let res = response.data;
                    if(res.status==1){
                      this.errorTip = false;
                      sessionStorage.setItem("loginstate",0)
                      sessionStorage.setItem("ms_username",this.ruleForm2.userName);
                      this.$router.push('/table');
                    }else{
                    //   this.$store.commit("updateUserSignal",false)
                        sessionStorage.setItem("loginstate","1")
                        this.errorTip = true;
                    }
                });
            },
            toRegister(){
                this.registerFlag = false;
            },
            toLogin(){
                this.registerFlag = true;
            },
            submitForm(formName) {
                // this.load=true
                this.$refs[formName].validate((valid) => {
                    if(valid){
                        // console.log(this.ruleForm)
                        axios.get('/api/userfind',{
                            params: {
                                userName:this.ruleForm.username
                            }
                        }).then((response)=>{
                            let res = response.data;
                            // console.log(res)
                            if(res.status==1){
                                this.$alert("用户名已经被注册")
                            }else{
                                console.log(this.ruleForm.username)
                                axios.post('/api/register',{
                                    userName:this.ruleForm.username,
                                    userPwd:this.ruleForm.pass
                                }).then((response)=>{
                                    let res = response.data;
                                    // console.log(res)
                                    if(res.status=='0'){
                                        this.$message("注册成功")
                                        //this.toLogin();
                                        // console.log("Register successfully")
                                    }
                                })
                            }
                        })
                    }else{
                        console.log('error submit!!');
                        return false;
                    }
                });
            }
        }
    }
</script>

<style scoped>
    .login-wrap{
        position: relative;
        width:100%;
        height:100%;
        background-image: url(../assets/img/train3.jpg);
        background-size: 100%;
    }

    .ms-title{
        width:100%;
        line-height: 50px;
        text-align: center;
        font-size:20px;
        font-weight: 700;
        color: rgba(65, 131, 215, 1);
        border-bottom: 1px solid #ddd;
    }
    .ms-login{
        position: absolute;
        float:left;
        left:50%;
        top:50%;
        width:350px;
        margin:-190px 0 0 -175px;
        border-radius: 5px;
        background: rgba(255,255,255, 0.3);
        overflow: hidden;
    }
    .ms-content{
        padding: 30px 30px;
    }
    .login-btn{
        text-align: center;
    }
    .login-tips{
        font-size:12px;
        text-align: center;
        line-height:30px;
        color:rgb(211, 19, 19);
    }
</style>