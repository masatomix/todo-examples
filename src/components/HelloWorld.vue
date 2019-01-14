<template>
  <div class="hello">
    <h1>My Todo Task<span class='info'>({{remainingTask.length}}/{{todos.length}})</span></h1>
    <ul>
      <li v-for='(todo,index) in todos' >
        <input type='checkbox' v-model='todo.isDone'>
        <span v-bind:class='{done: todo.isDone}'>{{todo.name}}</span>
        <span @click='deleteTask(index)' class='xButton'>[x]</span>
        </li>
    </ul>
    <form @submit.prevent='addTask'>
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
        { name: "task 1", isDone: true },
        { name: "task 2", isDone: false },
        { name: "task 3", isDone: false },
        { name: "task 4", isDone: false }   
      ]
    }
  },
  methods:{
    addTask: function(){
      this.todos.push({
        name: this.newTask,
        isDone: false
      })
      this.newTask=''
    },
    deleteTask: function(index){
      this.todos.splice(index,1)
    }
  },
  computed:{
    remainingTask: function(){
      return this.todos.filter(function(todo){
        return !todo.isDone
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  font-size: 16px;
  border-bottom: 1px solid #ddd;
  padding: 16px 0;
}

.xButton{
  cursor: pointer;
  font-size: 12px;
  color: red
}

li > span.done{
  text-decoration: line-through;
  color:#bbb
}

.info {
  color: #bbb;
  font-size: 12px;
}
</style>