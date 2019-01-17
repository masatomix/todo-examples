<template>
  <header>{{message}}</header>
</template>

<script>
export default {
  name: 'Header',
  data () {
    return {
      message:'共通ヘッダ'
    }
  },
  computed:{
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>