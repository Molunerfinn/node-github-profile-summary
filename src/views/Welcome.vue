<template lang="pug">
  .welcome(v-loading.fullscreen="loading")
    img(src="../assets/logo.png")
    .welcome-title Input your github username
    input(type="text" placeholder="ex. Molunerfinn" v-model="username" @keyup.enter="searchUser")
    .invalid(v-if="invalid")
      p
        | If you are {{ invalidUsername }}, please star the #[a(href="https://github.com/Molunerfinn/node-github-profile-summary" target="_blank") repo] and try again.
      p
        | This is necessary because GitHub has a 5000req/hour rate-limit which would be reached very quickly if you tried to analyze some of the bigger profiles on GitHub.
      p
        | If the app has been rate-limited (check lower right corner), please come back later
        | or build the app locally and use your own token
</template>

<script>
export default {
  name: 'Welcome',
  data () {
    return {
      username: '',
      loading: false,
      invalid: false,
      invalidUsername: ''
    }
  },
  methods: {
    searchUser () {
      this.checkStar()
    },
    async checkStar () {
      this.loading = true
      let res = await this.$http.get(`/api/check-status/${this.username}`)
      if (res.data.success) {
        this.$router.push({
          name: 'Profile',
          params: {
            username: this.username
          }
        })
        localStorage.setItem('github-profile-token', res.data.token)
      } else {
        this.invalid = true
        this.invalidUsername = this.username
        this.loading = false
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    if (to.query.redirect === 'invalid') {
      next(vm => {
        vm.invalid = true
        vm.invalidUsername = to.query.username
      })
    } else {
      next()
    }
  }
}
</script>

<style lang="stylus">
.welcome
  padding-top 60px
  text-align center
  &-title
    margin 12px 0
    font-size 20px
  input
    -webkit-appearance: none;
    background-color: #fff;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    box-sizing: border-box;
    color: #606266;
    display: inline-block;
    font-size: inherit;
    height: 40px;
    line-height: 1;
    outline: none;
    padding: 0 15px;
    transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    width: 250px;
  .invalid
    min-width 300px
    width 50%
    margin 10px auto 80px
    text-align left
    background #fff
    padding 12px 16px
</style>
