// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import firebase from 'firebase'  // 追加
import firebaseConfig from '@/firebaseConfig' // 追加


// if (!firebase.apps.length) {
firebase.initializeApp(firebaseConfig) // 初期化処理追加
// }
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
