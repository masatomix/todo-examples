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
import Cookies from 'js-cookie'
Vue.use(BootstrapVue)

// if (!firebase.apps.length) {
firebase.initializeApp(firebaseConfig)
// }
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)

Vue.config.productionTip = false

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    // User is signed in.
    store.commit(constants.mutations.user, user)
    store.commit(constants.mutations.loginStatus, true)

    const expiresIn = 60 * 60 * 24
    const options = { maxAge: expiresIn }
    // const options = { maxAge: expiresIn, , secure: true }

    console.log(user.uid)
    Cookies.set('userid', user.uid, options)
  } else {
    store.commit(constants.mutations.user, {})
    store.commit(constants.mutations.loginStatus, false)

    Cookies.remove('userid')
  }
})

router.beforeEach((to, from, next) => {
  const currentUser = store.state.user
  if (currentUser.uid) {
    if (to.path === constants.path.LOGIN) {
      firebase
        .auth()
        .signOut()
        .then(() => next())
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
