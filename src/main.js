// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

import router from './router'
import store from '@/store'
import firebase from 'firebase'
import firebaseConfig from '@/firebaseConfig'

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

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
