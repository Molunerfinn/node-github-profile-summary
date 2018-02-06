<template lang="pug">
  .profile
    .row
      .col-lg -
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
