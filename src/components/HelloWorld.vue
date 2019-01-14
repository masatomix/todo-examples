<template>
  <div class="hello">
    <ul>
      <li v-for='todo in todos' >{{todo}}</li>
    </ul>
    <form @submit.prevent='addItem'>
      <input type='text' v-model='newTask'>
      <input type='submit' value='追加' >
    </form>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      newTask:'',
      todos : [
        { name: "task 1", isDone: false },
        { name: "task 2", isDone: false },
        { name: "task 3", isDone: false },
        { name: "task 4", isDone: false }   
      ]
    }
  },
  methods:{
    addItem: function(){
      this.todos.push({
        name: this.newTask,
        isDone: false
      })
      this.newTask=''
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>