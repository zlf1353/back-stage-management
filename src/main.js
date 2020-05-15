// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import treetable from 'vue-table-with-tree-grid'
import 'element-ui/lib/theme-chalk/index.css'
// 全局样式需要导入
import './assets/css/global.css'

// axios引入
import axios from 'axios'
axios.defaults.baseURL = 'http://119.23.53.78:8888/api/private/v1/'

// login?username=admin&password=123456
// axios拦截器,为每次请求挂载请求头
// 需要授权的数据，必须在请求头挂在token
axios.interceptors.request.use(config => {
  // console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 必须return
  return config
})
// 接口地址
Vue.prototype.$http = axios

Vue.use(ElementUI)
Vue.component('tree-table', treetable)
Vue.config.productionTip = false
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
