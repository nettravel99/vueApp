import Vue from 'vue'
import axios from 'axios'

const service = axios.create({
  baseURL: 'http://10.10.10.6:5001/', // api base_url
  timeout: 600000 // request timeout
})
Vue.prototype.$axios = service
Vue.prototype.$M = function M (routine, data) {
  return service({
    url: 'api^quasar',
    method: 'post',
    data: {
      routine: routine,
      data: data
    }
  })
}
