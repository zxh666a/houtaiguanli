import Vue from "vue"
import Router from "vue-router"

import login from "./view/login"
import home from "./view/home"
import welcome from "./view/welcome"
import users from './components/user/user'
import rights from "./components/power/rights"
import roles from "./components/power/roles"

Vue.use(Router)

const router = new Router({
    routes: [
        { path: '/', redirect: '/login' },
        { path: '/login', component: login },
        {
            path: '/home',
            redirect: '/welcome',
            component: home,
            children: [
                { path: '/welcome', component: welcome },
                { path: '/users', component: users },
                { path: '/rights', component: rights },
                { path: '/roles', component: roles }
            ]
        },
    ]
})
//挂载路由导航守卫
router.beforeEach((to, from, next) => {
    if (to.path === '/login') return next();
    //获取token
    const token = window.sessionStorage.getItem('token');
    if (!token) return next('/login');
    next();
})

export default router