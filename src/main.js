import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

import VueCoreVideoPlayer from 'vue-core-video-player'
Vue.use(VueCoreVideoPlayer)

import router from "./router";

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
