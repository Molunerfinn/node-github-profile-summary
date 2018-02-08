<template>
  <div id="app">
    <div class="control-panel">
      <div>
        Requests left: {{ limit }}
      </div>
      <div>
        Reset at: {{ resetAt }}
      </div>
      <div class="panel-button" v-if="$route.name === 'Profile'" @click="forceUpdate">Force Update</div>
      <div class="panel-button" v-if="$route.name === 'Profile'" @click="saveImage">Save As Img</div>
    </div>
    <div class="social-share text-align" data-sites="wechat,weibo,qzone,facebook,twitter,google">
    </div>
    <transition name="fade" mode="out-in">
      <router-view/>
    </transition>
    <div class="footer">
      Node GitHub Profile Summary is built with <a href="https://github.com/vuejs/vue" target="_blank">Vue</a> \ <a href="https://github.com/koajs/koa" target="_blank">Koa</a> and <a href="https://github.com/chartjs/Chart.js" target="_blank">Chart.js</a>. Source is on <a href="https://github.com/Molunerfinn/node-github-profile-summary" target="_blank">GitHub</a>.
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client'
import html2Canvas from 'html2canvas'
export default {
  name: 'App',
  data () {
    return {
      limit: 0,
      resetAt: ''
    }
  },
  created () {
    const host = window.location.hostname
    const protocol = window.location.protocol
    const socket = io(`${protocol}//${host}:8899`)
    socket.on('limit', (data) => {
      this.limit = data.rateLimit
      this.resetAt = data.resetAt
    })
    socket.emit('getLimit')
  },
  methods: {
    forceUpdate () {
      localStorage.removeItem(this.$route.params.username)
      location.reload()
    },
    saveImage () {
      html2Canvas(document.querySelector('.profile'), {
        backgroundColor: '#f6f8fa',
        useCORS: true,
        scale: 2
      })
        .then(canvas => {
          const a = document.createElement('a')
          a.href = canvas.toDataURL('image/jpeg').replace('image/jpeg', 'image/octet-stream')
          a.download = `${this.$route.params.username}-Profile.jpg`
          a.click()
        })
    }
  }
}
</script>

<style lang="stylus">
*
  box-sizing: border-box;
body,html
  margin: 0;
  padding: 0;
  background: #f6f8fa;
  min-height: 100%
  height: 100%
  overflow inherit!important
.fade
  &-enter,
  &-leave,
  &-leave-active
    opacity 0
  &-enter-active,
  &-leave-active
    transition opacity 200ms linear
#app
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
.social-share
  padding-top 10px
  .icon-wechat
    .wechat-qrcode
      top: 40px
      &:after
        border-width 0
.text-align
  text-align: center
.control-panel
  position fixed
  top 20px
  right 20px
  background #fff
  padding 12px 16px
  z-index 200
  .panel-button
    color #fff
    background rgba(7,144,232, 0.7)
    padding 6px 8px
    text-align center
    margin-top 8px
    font-size 14px
    cursor pointer
    border-radius 20px
    transition all .2s ease-in
    &:hover
      background rgba(7,144,232, 1)
.footer
  text-align center
  background #fff
  padding 12px 16px
  position fixed
  left: 0
  bottom: 0
  width 100%
  box-shadow: 0 -2px 3px 0px rgba(133,133,133,.2);
  a
    text-decoration none
    color rgba(7, 144, 232, 0.7)
@media (max-width: 768px)
  .control-panel
    display none
</style>
