<template>
  <main v-if="$store.state.loginStatus" class="container">
    <h1>
      <img
        alt="Add to Slack"
        height="40"
        width="139"
        src="https://platform.slack-edge.com/img/add_to_slack.png"
        srcset="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x"
        @click="popup()"
        style="cursor:pointer"
      >
    </h1>
  </main>
</template>

<script>
export default {
  name: 'Slack',
  methods: {
    popup () {
      const url = '/api/oauth/'
      window.open(
        url,
        'pop',
        () =>
          `toolbar=0,status=0,top=100,left=200,width=700,height=600,modal=yes,alwaysRaised=yes`
      )
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
</style>
