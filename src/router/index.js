import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login'
import home from '@/components/home'
import welcome from '@/components/welcome'
import users from '@/components/user/users'
import right from '@/components/power/right'
import roles from '@/components/power/roles'
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
  next()
})

export default router
