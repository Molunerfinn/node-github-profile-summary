<template>
  <div id="app">
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
      limit: 0
    }
  },
  created () {
    socket.on('limit', (data) => {
      this.limit = data.rateLimit
    })
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
