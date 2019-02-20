<template>
  <main v-if="$store.state.loginStatus" class="container">
    <h1>
      My路線
      <span class="info">({{remainingTask.length}}/{{userRails.length}})</span>
      <img
        alt="Add to Slack"
        height="40"
        width="139"
        src="https://platform.slack-edge.com/img/add_to_slack.png"
        srcset="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x"
        @click="execute()"
        style="cursor:pointer"
      >
    </h1>
    <form>
      <input type="text" v-model="railName" placeholder="路線名でフィルタ">
    </form>
    <table class="table table-hover table-condensed">
      <tr class="row">
        <td class="col-sm-1">NO</td>
        <td class="col-sm-2">状態</td>
        <td class="col-sm-3">路線図</td>
        <td class="col-sm-3">鉄道会社</td>
        <td class="col-sm-2">登録日時</td>
        <!--        <td class="col-sm-1">優先</td> -->
      </tr>
      <tr class="row" v-for="(item,index) in filteredRails" :key="key(item.hash,item,index)">
        <td class="col-sm-1">{{index+1}}</td>
        <td class="col-sm-2">
          <button
            class="btn btn-primary"
            type="button"
            @click="addData(item)"
          >{{item.user_id? '外す':'登録する'}}</button>
        </td>
        <td class="col-sm-3">{{item.rail_name}}</td>
        <td class="col-sm-3">{{item.company}}</td>
        <td class="col-sm-2">{{item.update_time|moment}}</td>
        <!--        <td class="col-sm-1">{{item.priority}}</td> -->
      </tr>
    </table>
  </main>
</template>

<script>
import firebase from 'firebase'
import axios from 'axios'
import * as moment from 'moment-timezone'
import restConfig from '@/restConfig'

export default {
  name: 'Rails',
  data () {
    // 画面で使用する変数を定義する場所
    return {
      railName: '',
      userRails: [],
      fields: []
    }
  },
  created: function () {
    const unwatch = this.$store.watch(
      state => state.user,
      user => {
        this.init()
      }
    )
    if (firebase.auth().currentUser) {
      this.init()
    }
  },
  methods: {
    key (hash, value, index) {
      return value.user_id + '|' + value.rail_name
    },
    filterRow: function (row) {
      return !this.railName || JSON.stringify(row).includes(this.railName)
    },
    init: async function () {
      const token = await firebase.auth().currentUser.getIdToken()
      const config = {
        url: restConfig.apiUri + 'api/user_rail/' + this.$store.state.user.uid,
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
      axios(config)
        .then(response => {
          this.userRails = response.data
        })
        .catch(error => {
          alert(error.message)
        })
    },
    addData: async function (item) {
      const token = await firebase.auth().currentUser.getIdToken()
      const value = {
        user_id: this.$store.state.user.uid,
        rail_name: item.rail_name
      }

      let config = {}
      if (item.user_id) {
        config = {
          url:
            restConfig.apiUri +
            'api/user_rail/' +
            item.user_id +
            '/' +
            item.rail_name +
            '',
          method: 'DELETE',
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          json: true
        }
      } else {
        config = {
          url: restConfig.apiUri + 'api/user_rail',
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          data: value,
          json: true
        }
      }

      axios(config)
        .then(response => this.init())
        .catch(error => alert(error.message))
    },

    execute () {
      const url = [
        restConfig.apiUri,
        'api/oauth/addCookie?user=',
        this.$store.state.user.uid
      ].join('')
      window.open(
        url,
        'pop',
        () =>
          `toolbar=0,status=0,top=100,left=200,width=700,height=600,modal=yes,alwaysRaised=yes`
      )
    }
  },
  computed: {
    remainingTask: function () {
      return this.userRails.filter(function (todo) {
        return todo.user_id
      })
    },
    filteredRails: function () {
      return this.userRails.filter(userRail => this.filterRow(userRail))
    }
  },
  filters: {
    moment: function (date) {
      if (date) {
        return moment(date)
          .tz('UTC')
          .format('YYYY/MM/DD HH:mm')
      }
      return ''
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
h1 > img {
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

.list-item {
  display: inline-block;
  margin-right: 10px;
}
.list-enter-active,
.list-leave-active {
  transition: all 1s;
}
.list-enter, .list-leave-to /* .list-leave-active for below version 2.1.8 */ {
  opacity: 0;
  transform: translateX(30px);
}
</style>
