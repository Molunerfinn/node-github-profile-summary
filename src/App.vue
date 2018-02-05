<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import io from 'socket.io-client'
const socket = io('http://localhost')
export default {
  name: 'App',
  data () {
    return {
      limit: 5000
    }
  },
  created () {
    socket.on('limit', (data) => {
      console.log(data)
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
