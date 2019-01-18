<template>
  <b-navbar toggleable="md" type="dark" variant="info">
  <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
  <b-navbar-brand href="#">ToDo管理</b-navbar-brand>
  <b-collapse is-nav id="nav_collapse">
    <!-- Right aligned nav items -->
    <b-navbar-nav class="ml-auto">
      <b-nav-item-dropdown right>
        <!-- Using button-content slot -->
        <template slot="button-content">
          <em><span v-if='!loginStatus' >未ログイン</span><span v-if='loginStatus' >{{user.displayName}}</span></em>
        </template>
        <b-dropdown-item @click="auth.login()" v-if='!loginStatus' >Signin</b-dropdown-item>
        <b-dropdown-item @click="auth.logout()" v-if='loginStatus' >{{user.displayName}}さんを Signout</b-dropdown-item>
      </b-nav-item-dropdown>
    </b-navbar-nav>
  </b-collapse>
  </b-navbar>
</template>

<script>
import Auth from '@/Auth'

export default {
  name: 'Header',
  data () {
    return {
      auth: Auth
    }
  },
  computed:{
    loginStatus(){
      return this.$store.state.loginStatus
    },
    user(){
      return this.$store.state.user
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
