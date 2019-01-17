<template>
  <div id="app">
    <Header /> <!-- 追加 --> 
    <router-view/>
  </div>
</template>

<script>
import Header from '@/components/Header'  // コンポーネントをimportして

export default {
  name: 'App',
  components:{
    Header // つかうことを宣言する
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  margin-top: 60px;
}
</style>
