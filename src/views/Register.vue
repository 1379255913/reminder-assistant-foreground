<template>
    <el-form class="login-container" label-width="0px">
        <h3 class="login_title">注册</h3>
        <br/>
        <el-form-item>
            <el-input type="text"  auto-complete="off" placeholder="账号" class="login_input" v-model="username"></el-input>
        </el-form-item>
        <el-form-item>
            <el-input type="text"  auto-complete="off" placeholder="昵称" class="login_input" v-model="nickname"></el-input>
        </el-form-item>
        <el-form-item>
            <el-input type="password"  auto-complete="off" placeholder="密码" class="login_input" v-model="password_1"></el-input>
        </el-form-item>
        <el-form-item>
            <el-input type="password"  auto-complete="off" placeholder="确认密码" class="login_input" v-model="password_2"></el-input>
        </el-form-item>
        <el-form-item style="width: 100%">
            <el-button type="primary" style="width: 100%;background: #505458;border: none" class="login_btn" @click="register()">注册</el-button>
        </el-form-item>
        <div class="login_div">
            <router-link to="/login" style="font-size: 20px; color: #000000">已有账号?登录</router-link>
        </div>

    </el-form>
</template>

<script>
import {reactive, toRefs} from "vue";
import {useRouter} from "vue-router";
import axios from "axios";
import {ElMessage} from "element-plus";

export default {
    name: "Register",
    setup(){
        const state = reactive({
            username : "",
            nickname : "",
            password_1 : "",
            password_2 : "",
        })
        const $router = useRouter();
        const register = () => {
            console.log(state.password,state.username)
            axios.post("/api/register",{
                'username' : state.username,
                'nickname' : state.nickname,
                'password_1' : state.password_1,
                'password_2' : state.password_2,
            }).then(res =>{
                if (res.data.code == 200){
                    console.log(res.data.data);
                    ElMessage({
                        message: '注册成功',
                        type: 'success',
                    })
                    $router.push({ path:'/login'})
                }else {
                    console.log(res.data);
                    ElMessage.error("注册失败"+res.data.message);
                }

            }).catch(function (error) {
                console.log(error.message);
            });

        }
        return{
            ...toRefs(state),
            register
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