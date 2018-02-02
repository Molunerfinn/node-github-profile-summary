import Vue from 'vue'
import axios from 'axios'
import Router from 'vue-router'
import Welcome from '@/views/Welcome'
import Profile from '@/views/profile'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Welcome',
      component: Welcome
    },
    {
      path: '/profile/:username',
      name: 'Profile',
      component: Profile,
      beforeEnter: (to, from, next) => {
        if (!localStorage.getItem('github-profile-token')) {
          axios.get(`/api/check-status/${to.params.username}`)
            .then(res => {
              if (res.data.success) {
                localStorage.setItem('github-profile-token', res.data.token)
                next()
              } else {
                next({
                  name: 'Welcome',
                  query: {
                    redirect: 'invalid'
                  }
                })
              }
            })
            .catch(err => {
              console.log(err)
            })
        } else {
          next()
        }
      }
    }
  ]
})
