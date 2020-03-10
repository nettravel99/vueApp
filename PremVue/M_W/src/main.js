import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import i18n from './lang' // Internationalization
import './icons' // icon
import './errorLog' // error log
import './permission' // permission control
// import "./mock"; // simulation data

import * as filters from './filters' // global filters

import { library } from '@fortawesome/fontawesome-svg-core'
import { faCoffee, faFileExport } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import VueTheMask from 'vue-the-mask'
Vue.use(VueTheMask)

import { DataTablesServer } from 'vue-data-tables'
Vue.use(DataTablesServer)

import VueFriendlyIframe from 'vue-friendly-iframe';

Vue.component('vue-friendly-iframe', VueFriendlyIframe);

//import DayPilot from './components/scheduler/daypilot-all.min'

library.add(faCoffee)
library.add(faFileExport)

Vue.component('font-awesome-icon', FontAwesomeIcon)

/*
Vue.component('calendar', {
  props: ['id', 'config'],
  mounted: function() {
    this.control = new DayPilot.Calendar(this.id, this.config).init()
  },
  render(createElement) {
    return createElement(
      'div', {
        attrs: {
          'id': this.id,
          'config': this.config
        }
      }
    )
  }
})
*/

Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
