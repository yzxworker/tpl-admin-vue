import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/zh-CN'// 设置语言
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'

import '@/assets/icons' // icon
// import '@/permission' // 权限控制

Vue.use(ElementUI, { locale })

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
console.log('test branch app env')
console.log(`APP_ENV:${process.env.APP_ENV}, NODE_ENV:${process.env.NODE_ENV}`)
