import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/Login'
import SignUp from '@/components/SignUp'
import constants from '@/constants'

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
    },
    {
      path: constants.path.SIGN_UP,
      component: SignUp,
      meta: {
        isPublic: true
      }
    }
  ]
})
