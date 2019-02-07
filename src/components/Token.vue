<template>
  <main class="container">
    <div>HTTP 呼び出し！</div>
    <button class="btn btn-primary" @click="checkToken">HTTP 呼び出し！</button>
  </main>
</template>

<script>
import firebase from "firebase";

export default {
  name: "Token",
  methods: {
    checkToken() {
      if (firebase.auth().currentUser) {
        firebase
          .auth()
          .currentUser.getIdToken()
          .then(token => console.log(token));
      } else {
        console.log("currentUser is null");
      }

      const value = {
        id: "001",
        name: "こんにちは",
        isDone: true
      };
      // HTTP呼び出し
      const echo_onCall = firebase.functions().httpsCallable("echo_onCall");
      echo_onCall(value).then(result => alert(JSON.stringify(result)));
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
  