import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import Iconfont from './plugins/iconfont'
// import VueAwesomeSwiper from 'vue-awesome-swiper'
// import 'swiper/css/swiper.css'
// Vue.use(VueAwesomeSwiper, /* { default options with global component } */)
// import echarts from 'echarts'

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(Iconfont)
// Vue.prototype.$echarts = echarts;

router.beforeEach((to, from, next) => {
  const signal = sessionStorage.getItem("loginstate")
  if (to.meta.requiresAuth) { // 判断该路由是否需要登录权限
    if (signal==0) { // 通过sessionStorage获取当前的token是否存在
      next()
    } else {
      console.log('该页面需要登陆')
      next({
        path: '/403',
      //   query: {redirect: '/dashboard'} // 将跳转的路由path作为参数，登录成功后跳转到该路由
      })
    }
  } else {
    next()
  }
})


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
