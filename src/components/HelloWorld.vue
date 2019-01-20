<template>
  <main v-if="$store.state.loginStatus" class="container">
    <h1>
      My Todo Task<span class='info'>({{remainingTask.length}}/{{todos.length}})</span>
      <span class='info' style='cursor:pointer' @click='checkAll()' v-if='!isAllChecked()'>すべてチェック/はずす</span>
      <span class='info' style='cursor:pointer' @click='unCheckAll()' v-if='isAllChecked()'>すべてチェック/はずす</span>
      <b-button size="sm" variant="secondary" @click="deleteEndTask">完了タスクの削除</b-button></h1>
    <ul>
      <li v-for='todo in todos' :key='todo.id'>
        <input type='checkbox' v-model='todo.isDone' @click='toggle(todo.id)' >
        <span v-bind:class='{done: todo.isDone}'>{{todo.name}}</span>
        <span @click='deleteTask(todo.id)' class='xButton'>[x]</span>
        </li>
    </ul>
    <form @submit.prevent='addTask'>
      <input type='text' v-model='newTask' placeholder="タスクを入力" >
      <b-button type='submit' variant="primary" style='margin:4px'>追加</b-button>
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
    const ref = this.db.collection('todos')
    // 変更データを取得するメソッドを使用する。
    // ココは、refのデータに変更があった場合コールバックされる
    // querySnapshot.docChanges() に変更データが入ってる
    ref.onSnapshot(querySnapshot => {
      querySnapshot.docChanges().forEach(change => {
        // 変更されたレコード
        const task = change.doc.data()
        console.log("task: "+ JSON.stringify(task)+" "+change.type)
       
        // 変更されたレコードの配列上のインデックス番号を特定する
        // 配列のfindIndexで、todos配列のうち todo.id プロパティがchange.doc.idとおなじヤツのIndex番号を取得
        const index = this.todos.findIndex(todo => todo.id === change.doc.id);
        console.log("index: " + index)
 
        // change.typeで処理を切り替え
        switch (change.type) {
          case "added":
            // added は、初期表示時と、データをaddしたとき
            // idが""でないときは初期表示なので単純push
            if (task.id !== "") {
              this.todos.push(task)
            }else{
              // なにもしない(addTaskメソッドでpush済み)
            }
            break

          case "modified":
            // modifiedは修正。修正が飛んでくるけどindexがないのは他画面での修正かもなのでpush
            if (index === -1) {
              // 修正(modified)で見つからないと言うことは、別画面での追加。
              this.todos.push(task)
            } else {
              // indexが見つかるときは、該当行を更新すればいいが、
              // this.todos[index] = change.doc.data()
              // これはVue.jsがViewを更新してくれない
              // this.$forceUpdate() // これかもしくは$setをつかう
              this.$set(this.todos, index, task)
            }
            break
          case "removed":
            // removedは削除
            this.todos.splice(index, 1)
            break
          default:
            break
        }
      })
    })
  },
  methods: {
    addTask: function () {
      const task = {
        id: '',
        name: this.newTask,
        isDone: false
      }
      this.todos.push(task)
      const ref = this.db.collection('todos')
      ref.add(task).then( docref => {
          task.id = docref.id
          ref.doc(docref.id).set(task) // idを入れて再度更新
        })
      this.newTask = ''
    },
    toggle: function(key){
      let target ={}
      const ref = this.db.collection('todos').doc(key)
      ref.get().then(docref=>{
        target = docref.data()
        target.isDone = !target.isDone
        ref.set(target)
      })
    },

    deleteTask: function (key) {
      this.db
        .collection('todos')
        .doc(key)
        .delete()
    },
    deleteEndTask: function () {
      const doneTasks = this.todos.filter(todo => todo.isDone)

      // this.todos = this.remainingTask

      const ref = this.db.collection('todos')
      doneTasks.forEach(doneTask=> ref.doc(doneTask.id).delete())
    },

    // 以下はすべてチェック・はずす のためのロジックで、ま、不要っちゃ不要
    updateCheck: function(key,isDone){
      let target ={}
      const ref = this.db.collection('todos').doc(key)
      ref.get().then(docref=>{
        target = docref.data()
        target.isDone = isDone
        ref.set(target)
      })
    },
    check: function(key){
      this.updateCheck(key,true)
    },
    unCheck: function(key){
      this.updateCheck(key,false)
    },
    checkAll: function() {
      const ref = this.db.collection("todos")
      this.todos.forEach(todo => this.check(todo.id))
    },
    unCheckAll: function() {
      const ref = this.db.collection("todos")
      this.todos.forEach(todo => this.unCheck(todo.id))
    },
    isAllChecked: function(){
      if(this.todos.findIndex(todo=> !todo.isDone) ===-1){ 
        // 完了していないのが一つもなければ、true
        return true
      }
      // 完了していないのが一つでもあれば false
      return false
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
  border-bottom: 1px solid #ddd;
  padding: 16px 0;
}
h1 > button {
  float: right;
}

li {
    padding: 4px;
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
