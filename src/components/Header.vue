<template>
  <b-navbar toggleable="md" type="dark" variant="info">
  <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
  <b-navbar-brand href="#" @click="gotoTop">ToDo管理</b-navbar-brand>
  <b-collapse is-nav id="nav_collapse">
    <!-- Right aligned nav items -->
    <b-navbar-nav class="ml-auto" v-if='loginStatus' >
      <b-nav-item-dropdown right>
        <!-- Using button-content slot -->
        <template slot="button-content">
          <em><span>{{user.displayName}}</span></em>
        </template>
        <b-dropdown-item @click="logout()" >{{user.displayName}}さんを Signout</b-dropdown-item>
      </b-nav-item-dropdown>
    </b-navbar-nav>
  </b-collapse>
  </b-navbar>
</template>

<script>
import firebase from 'firebase'
import constants from '@/constants'

export default {
  name: 'Header',
  computed: {
    loginStatus () {
      return this.$store.state.loginStatus
    },
    user () {
      return this.$store.state.user
    }
  },
  methods: {
    gotoTop () {
      this.$router.push(constants.path.TOP)
    },
    logout () {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$router.push(constants.path.TOP)
          window.location.reload()
        })
        .catch(function (error) {
          const errorCode = error.code
          const errorMessage = error.message
          alert(errorCode,errorMessage)
        })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
