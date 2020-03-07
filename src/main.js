import Vue from 'vue'
import App from '@/App.vue'
import router from "@/router/index"
import store from "@/store"
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import md5 from "js-md5"

Vue.use(ElementUI,{size:'small'});
Vue.config.productionTip = false
Vue.prototype.$md5 = md5

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')


