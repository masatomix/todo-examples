// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

import router from './router'
import store from '@/store'
import firebase from 'firebase'
import firebaseConfig from '@/firebaseConfig'
import constants from '@/constants'

import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
Vue.use(BootstrapVue)

// if (!firebase.apps.length) {
firebase.initializeApp(firebaseConfig)
// }
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)

Vue.config.productionTip = false

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    console.log(JSON.stringify(user))
    // User is signed in.
    store.commit('user', user)
    store.commit('loginStatus', true)
  } else {
    store.commit('user', {})
    store.commit('loginStatus', false)
  }
})

router.beforeEach((to, from, next) => {
  const currentUser = store.state.user
  if (currentUser.uid) {
    if (to.path === constants.path.LOGIN) {
      firebase.auth().signOut().then(() => next())
    }
  }

  if (to.matched.some(record => record.meta.isPublic)) {
    // alert('isPublic = true '+ to.path)
    next()
  } else {
    // alert('isPublic = false '+ to.path)
    if (currentUser.uid) {
      next()
    } else {
      next({
        path: constants.path.LOGIN,
        query: {
          redirect: to.path
        }
      })
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
