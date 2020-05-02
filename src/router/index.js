import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login'
import home from '@/components/home'
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
      component: home
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
  next()
})

export default router
