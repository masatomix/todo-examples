<template>
  <main v-if='$store.state.loginStatus'>
    <h1>
      <button @click="deleteEndTask">完了タスクの削除</button>My Todo Task<span class='info'>({{remainingTask.length}}/{{todos.length}})</span></h1>
    <ul>
      <li v-for='todo in todos' :key='todo.id'>
        <input type='checkbox' v-model='todo.isDone' @click='done(todo)' >
        <span v-bind:class='{done: todo.isDone}'>{{todo.name}}</span>
        <span @click='deleteTask(todo.id)' class='xButton'>[x]</span>
        </li>
    </ul>
    <form @submit.prevent='addTask'>
      <input type='text' v-model='newTask'>
      <input type='submit' value='追加' >
    </form>
  </main>
</template>

<script>
import firebase from 'firebase'

export default {
  name: 'HelloWorld',
  data () {    // 画面で使用する変数を定義する場所
    return {
      newTask: '',
      todos: [],
      db: firebase.firestore()
    }
  },
  created: function () {
    // this.todos = JSON.parse(localStorage.getItem("todos")) || [];
    const me = this
    const ref = this.db.collection('todos')
    ref.get().then(querySnapshot => {
      this.loading = false
      querySnapshot.forEach(doc => {
        const task = doc.data()
        task.id = doc.id
        me.todos.push(task)
      })
    })
  },
  methods: {
    addTask: function () {
      const me = this
      const task = {
        id: '',
        name: this.newTask,
        isDone: false
      }
      this.db
        .collection('todos')
        .add(task)
        .then(function (docref) {
          task.id = docref.id
          me.todos.push(task)
        })
      this.newTask = ''
    },
    done: function(todo){ 
      this.db
        .collection("todos")
        .doc(todo.id)
        .set(todo)
    },
    deleteTask: function (key) {
      this.todos.forEach((todo, index) => {
        if (todo.id == key) {
          this.todos.splice(index, 1)
        }
      })
      this.db
        .collection('todos')
        .doc(key)
        .delete()
    },
    deleteEndTask: function () {
      const doneTasks = this.todos.filter(todo => {
        return todo.isDone
      })
      
      this.todos = this.remainingTask

      for (let task of doneTasks) {
        this.db
          .collection('todos')
          .doc(task.id)
          .delete()
      }
    }
  },
  computed: {
    remainingTask: function () {
      return this.todos.filter(function (todo) {
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

h1 > button {
  float: right;
}

.xButton {
  cursor: pointer;
  font-size: 12px;
  color: red;
}

li > span.done {
  text-decoration: line-through;
  color: #bbb;
}

.info {
  color: #bbb;
  font-size: 12px;
}
</style>
