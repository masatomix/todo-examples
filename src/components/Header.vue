<template>
  <header>
    <span @click="auth.login()" v-if='!loginStatus' class='button' >login</span>
    <span @click="auth.logout()" v-if='loginStatus' class='button' >{{user.displayName}}さんを logout</span>
  </header>
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

.button{
  cursor: pointer;
  font-size: 12px;
  color:steelblue
}
</style>
