import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router';
import BootstrapVue from 'bootstrap-vue'

import Chartkick from 'chartkick'
import VueChartkick from 'vue-chartkick'
// import store from './store/store.js'
import Chart from 'chart.js'

import VueSweetAlert from 'vue-sweetalert'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import { routes } from './routes'
import store from './store/store.js'

Vue.use(VueRouter);
Vue.use(BootstrapVue);
Vue.use(VueChartkick, { Chartkick })
Vue.use(VueSweetAlert);

Vue.config.productionTip = false

const router = new VueRouter({
  routes,
  mode: 'history'
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
