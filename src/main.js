// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import components from './components'
import 'melody.css'

Vue.config.productionTip = false
Vue.use(components)

Vue.prototype.$http = axios

axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('github-profile-token')
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token
    }
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})
