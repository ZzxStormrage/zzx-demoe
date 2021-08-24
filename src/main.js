/*
 * @Author: your name
 * @Date: 2021-07-26 12:10:55
 * @LastEditTime: 2021-07-26 20:49:14
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /cloud-media-web/src/main.js
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/styles/index.scss' // global css

import api from './axios/api'
import { get } from './axios/http'

Vue.prototype.$api = api
Vue.prototype.$get = get

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
