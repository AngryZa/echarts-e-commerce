import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
//引入字体的文件
import './assets/font/iconfont.css'

// 引入全局样式
import "./assets/css/global.scss"

//请求基准路径的配置
axios.defaults.baseURL = 'http://192.168.1.2:3000/api/'
//将axios挂载到 Vue 的原型对象上
//在别的组件中 this.$http
Vue.prototype.$http = axios



// 将全局Echarts对象全局挂载在 Vue 的原型对象上
// 在别的组件上 this.$echarts 
Vue.prototype.$echarts = window.echarts




Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
