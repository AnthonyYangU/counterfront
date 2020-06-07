import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path:'/login',
    component:() =>import('../components/Login.vue')
  },
  {
    path:'/',
    component:resolve => require(['../views/Home.vue'],resolve),
    children:[
      {
        path:'/tabs',
        component:resolve =>require(['../components/Tabs.vue'],resolve),
        meta: {requiresAuth:true,title:'报警列表'}
      },
      {
        path:'/table',
        component:()=>import('../components/Table.vue'),
        meta: {requiresAuth:true,title:'设备总表'}
      },
      {
        path:'/history',
        component:()=>import('../components/History.vue'),
        meta:{requiresAuth:true,title:'历史数据'}
      },
      {
        path:'/management',
        component:()=>import('../components/Manage.vue'),
        meta:{requiresAuth:true,title:'设备管理'}
      }
    ]
  },
  {
    path:'/test',
    component: resolve=>require(['../components/test.vue'],resolve)
  },
  {
    path: '/403',
    component: resolve => require(['../components/403.vue'], resolve),
  },
  {
    path: '/404',
    component: resolve => require(['../components/404.vue'], resolve),
  },
  {
    path: '*',
    redirect: '/404'
  },
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  routes
})

export default router
