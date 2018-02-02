<template lang="pug">
  .profile

</template>

<script>
export default {
  name: 'Profile',
  data () {
    return {
    }
  },
  methods: {
    async getData () {
      const res = await this.$http.get(`/api/user-profile/${this.$route.params.username}`)
      console.log(res)
    }
  },
  created () {
    this.getData()
  }
}
</script>
