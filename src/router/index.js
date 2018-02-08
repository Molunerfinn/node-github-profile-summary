import Vue from 'vue'
import axios from 'axios'
import Router from 'vue-router'
import jwt from 'jsonwebtoken'
const Welcome = () => import('../views/Welcome.vue')
const Profile = () => import('../views/Profile.vue')

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
        const token = localStorage.getItem('github-profile-token')
        if (!token || jwt.decode(token).username !== to.params.username) {
          axios.get(`/api/check-status/${to.params.username}`)
            .then(res => {
              if (res.data.success) {
                localStorage.setItem('github-profile-token', res.data.token)
                next()
              } else {
                next({
                  name: 'Welcome',
                  query: {
                    redirect: 'invalid',
                    username: to.params.username
                  }
                })
              }
            })
            .catch(err => {
              console.log(err)
              next({
                name: 'Welcome',
                query: {
                  redirect: 'invalid',
                  username: to.params.username
                }
              })
            })
        } else {
          next()
        }
      }
    }
  ]
})
