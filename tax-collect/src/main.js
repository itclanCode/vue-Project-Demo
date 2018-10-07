// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import router from './router'
import ajax from '@/services/ajax'
import '@/style/all'
import constant from './common/js/constant'
import VCharts from 'v-charts'

// 插件配置
Vue.use(ElementUI)
Vue.use(VCharts)
Vue.config.productionTip = false

// 变量配置
Vue.prototype._constant = constant;

// axios 统一配置
ajax.init()

let app = new Vue({
  el: '#app',
  data: { isRealName: false },
  router,
  template: '<App/>',
  components: {App},
});
Vue.use({
  app
});
