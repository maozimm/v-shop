import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
// 引入字体样式图标
import './assets/fonts/iconfont.css'
import './assets/css/glo-color.css'
// 引入home图标
import './assets/font_home/iconfont.css'
// 引入home二级图标
import './assets/font_second/iconfont.css'
// 导入tree插件
import Tree from 'vue-table-with-tree-grid'
// 引入分类图标
import './assets/font_category/iconfont.css'
import moment from 'moment'

// 添加请求拦截器
axios.interceptors.request.use(function(config) {
  // 在发送请求之前做些什么
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1'
Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.component('tree-table', Tree)
// 注册一个全局的过滤器
Vue.filter('formatTime', function(time, type) {
  var newTime = moment(new Date(time)).format(type)
  return newTime
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
