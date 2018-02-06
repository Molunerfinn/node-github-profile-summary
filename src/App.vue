<template>
  <div id="app">
    rateLimit: {{ limit }}
    resetAt: {{ resetAt }}
    <router-view/>
  </div>
</template>

<script>
import io from 'socket.io-client'
const socket = io('http://localhost:8899')
export default {
  name: 'App',
  data () {
    return {
      limit: 0,
      resetAt: ''
    }
  },
  created () {
    socket.on('limit', (data) => {
      this.limit = data.rateLimit
      this.resetAt = data.resetAt
    })
    socket.emit('getLimit')
  }
}
</script>

<style>
body,html {
  margin: 0;
  padding: 0;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
