import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

// const store = new Vuex.Store({
export default new Vuex.Store({
  state: {
    user:  {},
    loginStatus: false
  },
  mutations: {
    updateUser(state, user) {
      state.user = user;
    },
    updateLoginStatus(state, loginStatus) {
      state.loginStatus = loginStatus;
    }
  },
  plugins: [createPersistedState()]
});
