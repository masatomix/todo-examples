import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/Login'
import U001 from '@/components/U001'
import U002 from '@/components/U002'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/login',
      component: Login,
      meta: {
        isPublic: true
      }
    },
    {
      path: '/ui001',
      component: U001,
      meta: {
        isPublic: false
      }
    },
    {
      path: '/ui002',
      component: U002,
      meta: {
        isPublic: true
      }
    }
  ]
})
