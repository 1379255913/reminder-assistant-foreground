import { createRouter,createWebHashHistory } from 'vue-router'
import Home from "../views/Home";
import Login from "../views/Login";
import Register from "../views/Register";
import index from "../Layout/index";
import CreateLabel from "../components/CreateLabel";
const routes = [

    {
        path: '/',
        name: '',
        component: index,
        children: [
            {
                path: 'Home',
                name: 'Home',
                component: Home
            },
            {
                path: 'Login',
                name: 'Login',
                component: Login
            },
            {
                path: 'Register',
                name: 'Register',
                component: Register
            },
            {
                path: 'test',
                name: 'test',
                component: CreateLabel
            },
        ]
    },




]
const router = createRouter({
    history:createWebHashHistory(process.env.BASE_URL),
    routes
})
//导出
export default router
