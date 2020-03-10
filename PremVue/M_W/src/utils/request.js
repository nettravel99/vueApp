import axios from 'axios'
import { Message, Loading,MessageBox  } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import router from '@/router'

// create an axios instance
const service = axios.create({
  baseURL: process.env.BASE_API, // api base_url
  timeout: 600000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // Do something before request is sent
    if (store.getters.token) {
      //
      config.headers['SES'] = getToken()
    }
    return config
  },
  error => {
    // Do something with request error
    // console.log(error); // for debug
    Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  // response => response,

  response => {
    if (
      response &&
      response.headers &&
      response.headers['content-type'] === 'text/html'
    ) {
      Message({
        dangerouslyUseHTMLString: true,
        message: response.data,
        type: 'error',
        duration: 30000
      })
      return
    }
    if (
      response &&
      response.data &&
      response.data._Mw &&
      response.data._Mw.Message
    ) {
      Message(response.data._Mw.Message)
    }
    if (
      response &&
      response.data &&
      response.data.error &&
      response.data.error.ERR
    ) {
      Message(response.data.error.ERR)
    }
    if (
      response &&
      response.data &&
      response.data._Mw &&
      response.data._Mw.$alert
    ) {
      MessageBox.alert(response.data._Mw.$alert)
    }
    if (
      response &&
      response.data &&
      response.data._Mw &&
      response.data._Mw.Loading
    ) {
      Loading.service(response.data._Mw.Loading)
    }
    if (response && 
        response.data &&
        response.data._Mw && 
        response.data._Mw.LogOff === true
      ){
        store.dispatch('LogOut')
        //console.log('router => ',router);
        router.go();
        return
      }
    return response.data
  },
  error => {
    // console.log("err" + error);
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
