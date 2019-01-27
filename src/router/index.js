import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/Login'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: constants.path.TOP,
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: constants.path.LOGIN,
      component: Login,
      meta: {
        isPublic: true
      }
    }
  ]
})
