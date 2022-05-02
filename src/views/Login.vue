<template>
    <el-form class="login-container" label-width="0px">
        <h3 class="login_title">系统登录</h3>
        <div class="login_div">
            <img style="height: 200px" src="../assets/lock.png" class="input_img">
        </div>
        <br/>
        <el-form-item>
            <el-input type="text"  auto-complete="off" placeholder="账号" class="login_input" v-model="username"></el-input>
        </el-form-item>

        <el-form-item>
            <el-input type="password"  auto-complete="off" placeholder="密码" class="login_input" v-model="password"></el-input>
        </el-form-item>

        <el-form-item style="width: 100%">
            <el-button type="primary" style="width: 100%;background: #505458;border: none" class="login_btn" @click="login()">登录</el-button>
        </el-form-item>
        <div>
            <router-link to="/register" style="font-size: 20px; color: #000000">注册</router-link>
            <a style="font-size: 20px; color: #000000; float: right" href="#">忘记密码?</a>
        </div>

    </el-form>
</template>

<script>
import {toRefs, reactive,} from "vue"
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router';
export default {
    name: "Login",
    setup(){
        const state = reactive({
            username : "",
            password : ""
        })
        const $router = useRouter();
        const login = () => {
            const that=this;
            console.log(state.password,state.username)
            axios.post("/api/login",{
                'username' : state.username,
                'password' : state.password
            }).then(res =>{
                if (res.data.code == 200){
                    console.log(res.data.data);
                    ElMessage({
                        message: '登录成功',
                        type: 'success',
                    })
                    sessionStorage.setItem('username', res.data.data.username)
                    console.log(sessionStorage.getItem('username'))
                    $router.push({ path:'/home'})
                }else {
                    console.log(res.data);
                    ElMessage.error("登录失败"+res.data.message);
                }

            }).catch(function (error) {
                console.log(error.message);
            });

            }
        return{
            ...toRefs(state),
            login
        }
    }
}
</script>

<style scoped>
    #poster {
        background-position: center;
        height: 100%;
        width: 100%;
        background-size: cover;
        position: fixed;
    }
    .login_div{
        text-align: center;
    }
    .login_img{
        height: 200px;
        width: 200px;
    }
    .login_input{
        height: 50px;
    }
    .login_btn{
        height: 50px;
    }
    .login-container {
        border-radius: 15px;
        background-clip: padding-box;
        margin: 90px auto;
        width: 500px;
        padding: 35px 35px 15px 35px;
        background: #fff;
        border: 1px solid #eaeaea;
        box-shadow: 0 0 25px #cac6c6;
        height: 550px;
    }

    .login_title {
        font-size: 35px;
        margin: 0px auto 40px auto;
        text-align: center;
        color: #505458;
    }

</style>