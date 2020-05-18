import Vue from 'vue'
import Router from 'vue-router'
/* import login from '@/components/login'
import home from '@/components/home'
import welcome from '@/components/welcome'
import users from '@/components/user/users'
import right from '@/components/power/right'
import roles from '@/components/power/roles'
import categories from '@/components/goods/categories'
import params from '@/components/goods/params'

import list from '@/components/goods/list'
import add from '@/components/goods/add'

import reports from '@/components/report/reports' */

import NProgress from 'nprogress'

const login = () => import(/* webpackChunkName: "login_home_welcome" */ '@/components/login')
const home = () => import(/* webpackChunkName: "login_home_welcome" */ '@/components/home')
const welcome = () => import(/* webpackChunkName: "login_home_welcome" */ '@/components/welcome')

const users = () => import(/* webpackChunkName: "users_right_roles" */ '@/components/user/users')
const right = () => import(/* webpackChunkName: "users_right_roles" */ '@/components/power/right')
const roles = () => import(/* webpackChunkName: "users_right_roles" */ '@/components/power/roles')

const categories = () => import(/* webpackChunkName: "categories_params" */ '@/components/goods/categories')
const params = () => import(/* webpackChunkName: "categories_params" */ '@/components/goods/params')

const list = () => import(/* webpackChunkName: "list_add" */ '@/components/goods/list')
const add = () => import(/* webpackChunkName: "list_add" */ '@/components/goods/add')

const reports = () => import(/* webpackChunkName: "reports" */ '@/components/report/reports')
// import 'nprogress/nprogress.css'
Vue.use(Router)
const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login', // 地址 使用/login而不是/
      name: 'login',
      component: login
    },
    {
      path: '/home',
      name: 'home',
      component: home,
      redirect: '/welcome',
      // 子路由
      children: [
        {
          path: '/welcome',
          name: 'welcome',
          component: welcome
        },
        {
          path: '/users',
          name: 'users',
          component: users
        }, // right在home展示，所以在home子路由中
        // path不能乱写，要与点击权限列表后显示的路径http://localhost:8080/#/rights一致，否则不会显示
        {
          path: '/rights',
          name: 'rights',
          component: right
        },
        {
          path: '/roles',
          name: 'roles',
          component: roles
        },
        {
          path: '/categories',
          name: 'categories',
          component: categories
        },
        {
          path: '/params',
          name: 'params',
          component: params
        },
        {
          path: '/goods',
          name: 'goods',
          component: list
        },
        {
          path: '/goods/add',
          name: 'add',
          component: add
        },
        {
          path: '/reports',
          name: 'reports',
          component: reports
        }
      ]
    }

  ]
})
// 挂载路由导航守卫
// 为router对象调用beaforeach函数
router.beforeEach((to, from, next) => {
  // to 开始的位置
  // from 去的位置
  // next 放行函数
  if (to.path === '/login') return next()
  // 获取token
  const tokenstr = window.sessionStorage.getItem('token')
  // 强制转换
  if (!tokenstr) return next('/login')
  NProgress.start()
  next()
})
// 使用进度条  NProgress.start() 展示 NProgress.done() 隐藏
router.afterEach(() => {
  NProgress.done()
})

export default router
