import firebase from "firebase";
import "firebase/firestore";
import store from "@/store";

export default {
  login() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);

    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.
        store.commit("updateUser", user);
        store.commit("updateLoginStatus", true);
      } else {
        store.commit("updateUser", {});
        store.commit("updateLoginStatus", false);
      }
    });
  },

  logout() {
    firebase.auth().signOut();
    store.commit("updateUser", {});
    store.commit("updateLoginStatus", false);
  }
};
