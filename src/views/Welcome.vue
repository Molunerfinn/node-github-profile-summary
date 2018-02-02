<template lang="pug">
  .welcome
    img(src="../assets/logo.png")
    div Input your github username
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

<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
