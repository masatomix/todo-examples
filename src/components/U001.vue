<template>
  <b-container>
    U001:{{user}}
  </b-container>
</template>

<script>
export default {
  name: 'U001',
  computed: {
    user () {
      return this.$store.state.user
    }
  }
}
</script>