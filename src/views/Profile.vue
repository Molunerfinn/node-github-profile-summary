<template lang="pug">
  .profile
    .container
      .row.user-info(v-if="userInfo.name !== undefined")
        .col-sm-4.col-sm-offset-0.col-xs-6.col-xs-offset-3
          .col-xs-12
            img.user-avatar(:src="userInfo.avatarUrl", alt="")
          .col-xs-12
            | {{ userInfo.username }} ({{ userInfo.name }})
          .col-xs-12
            | {{ userInfo.email }}
          .col-xs-12
            | Joined at {{ userInfo.createdAt.slice(0, 10) }}
          .col-xs-12
            | {{ userInfo.bio }}
</template>

<script>
export default {
  name: 'Profile',
  data () {
    return {
      username: this.$route.params.username,
      userInfo: {},
      userRepos: [],
      userCommits: []
    }
  },
  methods: {
    async getData () {
      const res = await this.$http.get(`/api/user-profile/${this.$route.params.username}`)
      if (res.data.success) {
        this.userInfo = res.data.userInfo
        this.userRepos = res.data.userRepos
        this.userCommits = res.data.userCommits
        localStorage.setItem(this.username, JSON.stringify(res.data))
      }
    },
    checkLocalStorage () {
      let userData = localStorage.getItem(this.username)
      if (!userData) {
        return false
      } else {
        userData = JSON.parse(userData)
        this.userInfo = userData.userInfo
        this.userRepos = userData.userRepos
        this.userCommits = userData.userCommits
        return true
      }
    }
  },
  created () {
    if (!this.checkLocalStorage()) {
      this.getData()
    }
  }
}
</script>
<style lang="stylus">
  .profile
    .user-avatar
      width 100%
</style>
