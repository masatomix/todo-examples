import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Slack from '@/components/Slack'
import constants from '@/constants'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: constants.path.TOP,
      component: Slack
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
