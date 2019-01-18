<template>
  <div class="hello">
    <h1>
      <button @click="deleteEndTask">完了タスクの削除</button>My Todo Task<span class='info'>({{Object.keys(remainingTask).length}}/{{Object.keys(todos).length}})</span></h1>
    <ul>
      <li v-for='(todo,key) in todos' :key='key'>
        <input type='checkbox' v-model='todo.isDone'>
        <span v-bind:class='{done: todo.isDone}'>{{todo.name}}</span>
        <span @click='deleteTask(key)' class='xButton'>[x]</span>
        </li>
    </ul>
    <form @submit.prevent='addTask'>
      <input type='text' v-model='newTask'>
      <input type='submit' value='追加' >
    </form>
  </div>
</template>

<script>
import firebase from 'firebase'

export default {
  name: 'HelloWorld',
  data () {    // 画面で使用する変数を定義する場所
    return {
      newTask: '',
      todos: {},
      db: firebase.firestore()
    }
  },
  watch: {
    // todos: {
    //   handler: function() {
    //     // localStorage.setItem("todos", JSON.stringify(this.todos));
    //   },
    //   deep: true
    // }
  },
  created: function () {
    // this.todos = JSON.parse(localStorage.getItem("todos")) || [];
    const me = this
    const ref = this.db.collection('todos')
    ref.get().then(querySnapshot => {
      this.loading = false
      querySnapshot.forEach(doc => {
        const task = doc.data()
        // me.todos[doc.id]=task
        me.$set(me.todos, doc.id, task);
        // https://jp.vuejs.org/2016/02/06/common-gotchas/
      })
    })
  },
  methods: {
    addTask: function () {
      const me = this
      const task = {
        name: this.newTask,
        isDone: false
      }
      this.db
        .collection('todos')
        .add(task)
        .then(function (docref) {
          // me.todos[docref.id]=task
          me.$set(me.todos, docref.id, task);
        })
      this.newTask = ''
    },

    deleteTask: function (key) {
      this.$delete(this.todos, key)
      this.db
        .collection('todos')
        .doc(key)
        .delete()
    },
    deleteEndTask: function () {
      const doneTasks = {}
      Object.keys(this.todos)
        .filter(key => this.todos[key].isDone)
        .forEach(key => {
          doneTasks[key] = this.todos[key]
          this.db
            .collection("todos")
            .doc(key)
            .delete()
        })
      this.todos = this.remainingTask
    }


  },
  computed: {
    remainingTask: function () {

      // 関数をつかう場合
      const me = this
      const remainingTask = {}
      Object.keys(this.todos)
        .filter(function(key) {
          return !me.todos[key].isDone
        })
        .forEach(key => (remainingTask[key] = me.todos[key]));
        
    
      // // Arrow関数で 簡単に書いた場合
      // return Object.keys(this.todos)
      //   .filter(key => !this.todos[key].isDone)
      //   .map(key => this.todos[key])

      // return this.todos.filter(function (todo) {
      //   return !todo.isDone
      // })
      return remainingTask   
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
