import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login.vue'
import home from '../components/home.vue'
import users from '../components/user.vue'
import roles from '../components/roles.vue'
import rigths from '../components/rigths.vue'
import categories from '../components/goodsCategories.vue'
import goods from '../components/goods.vue'
import params from '../components/goodsParams.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: login
  },
  {
    path: '/home',
    component: home,
    children: [{
      path: '/users',
      component: users
    },
    {
      path: '/roles',
      component: roles
    },
    {
      path: '/rights',
      component: rigths
    },
    {
      path: '/categories',
      component: categories
    },
    {
      path: '/params',
      component: params
    },
    {
      path: '/goods',
      component: goods
    }
    ]
  }
]

const router = new VueRouter({
  routes
})
// 路由拦截 判断有没有token值和路由
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  if (window.sessionStorage.getItem('token')) {
    return next()
  } else {
    return next('/login')
  }
})
// 处理Element UI 路由报错
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
export default router
