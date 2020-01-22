import Vue from 'vue'
import App from './App.vue'
import router from "./router"


import tree from "vue-table-with-tree-grid"
import VueQuillEdit from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEdit)

import 'element-ui/lib/theme-chalk/index.css';
import "../src/plugins/element.js"
import "./assets/css/global.css"

import axios from "axios"
axios.defaults.baseURL = `http://127.0.0.1:8888/api/private/v1/`
// 拦截器
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios
Vue.component('tree-table', tree)
//事件过滤器
Vue.filter('dataFormat', function (originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  const h = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${h}:${mm}:${ss}`
})


new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
