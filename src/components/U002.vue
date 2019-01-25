<template>
  <b-container>
    U002:{{user}}
  </b-container>
</template>

<script>
export default {
  name: 'U002',
  computed: {
    user () {
      return this.$store.state.user
    }
  }
}
</script>