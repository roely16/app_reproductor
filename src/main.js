import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'

Vue.config.productionTip = false

// Bootstrap Vue
import { BootstrapVue } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
Vue.use(BootstrapVue)

// FontAwesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { faStop, faPlay, faPause, faSyncAlt, faShare, faExpand, faInfoCircle, faSearch, faVideo, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(faStop, faPlay, faPause, faSyncAlt, faShare, faExpand, faInfoCircle, faSearch, faVideo, faExclamationTriangle)
Vue.component('font-awesome-icon', FontAwesomeIcon)

// Axios
import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)

// Marquee
import MarqueeText from 'vue-marquee-text-component'
Vue.component('marquee-text', MarqueeText)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
