<template lang="pug">
  .welcome
    img(src="../assets/logo.png")
    .welcome-title Input your github username
    input(type="text" placeholder="ex. Molunerfinn" v-model="username" @keyup.enter="searchUser")
</template>

<script>
export default {
  name: 'Welcome',
  data () {
    return {
      username: 'Molunerfinn'
    }
  },
  methods: {
    searchUser () {
      this.checkStar()
    },
    async checkStar () {
      let res = await this.$http.get(`/api/check-status/${this.username}`)
      if (res.data.success) {
        this.$router.push({
          name: 'Profile',
          params: {
            username: this.username
          }
        })
        localStorage.setItem('github-profile-token', res.data.token)
      }
    }
  }
}
</script>

<style lang="stylus">
.welcome
  margin-top 20px
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
</style>
