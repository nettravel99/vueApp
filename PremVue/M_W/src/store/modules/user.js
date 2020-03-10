import { loginByUsername, logout, getUserInfo, loginBySES,loginByJWT } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { Message } from 'element-ui'

const user = {
  state: {
    user: '',
    status: '',
    code: '',
    token: getToken(),
    name: '',
    avatar: '',
    introduction: '',
    roles: [],
    entities:[],
    entity:'',
    setting: {
      articlePlatform: []
    }
  },
  mutations: {
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_ENTITIES: (state, entities) => {
      state.entities =entities
    },
    SET_CURRENT_ENTIY: (state,entity) =>{
      state.entity = entity
    }
  },
  actions: {
    LoginByUsername({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        loginByUsername(username, userInfo.password, userInfo.entity)
          .then(response => {
            const data = response.data
            if (data && data.token === '') {
              Message({
                message: 'Invalid login and/or password!',
                type: 'error',
                duration: 1 * 1000
              })
              reject()
            }
            commit('SET_TOKEN', data.token)
            setToken(response.data.token)
            resolve()
          })
          .catch(error => {
            // console.log(error);
            reject(error)
          })
      })
    },
    LoginBySES({ commit }, SES) {
      return new Promise((resolve, reject) => {
        loginBySES(SES)
          .then(response => {
            const data = response.data
            if (data && data.token === '') {
              Message({
                message: 'Invalid Token',
                type: 'error',
                duration: 1 * 1000
              })
              reject()
            }
            commit('SET_TOKEN', '')
            commit('SET_TOKEN', data.token)
            setToken(response.data.token)
            resolve()
          })
          .catch(error => {
            // console.log(error);
            reject(error)
          })
      })
    },
    LoginByJWT({ commit }, JWT) {
      return new Promise((resolve, reject) => {
        loginByJWT(JWT)
          .then(response => {
            const data = response.data
            if (data && data.token === '') {
              Message({
                message: 'Invalid Token',
                type: 'error',
                duration: 1 * 1000
              })
              reject()
            }
            commit('SET_TOKEN', '')
            commit('SET_TOKEN', data.token)
            setToken(response.data.token)
            resolve()
          })
          .catch(error => {
            // console.log(error);
            reject(error)
          })
      })
    },
    SetCurrentEntity({ commit },payload){
      return new Promise((resolve) => {
        commit('SET_CURRENT_ENTIY', payload)
        resolve();
      })
    },
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getUserInfo(state.token)
          .then(response => {
            if (!response.data) {
              reject('Verification failed, please login again.')
            }
            const data = response.data
            if (data.roles && data.roles.length > 0) {
              commit('SET_ROLES', data.roles)
            } else {
              reject('getInfo: roles must be a non-null array!')
            }
            commit('SET_NAME', data.name)
            commit('SET_AVATAR', data.avatar)
            commit('SET_INTRODUCTION', data.introduction)
            commit('SET_ENTITIES', data.entities)
            commit('SET_CURRENT_ENTIY', data.entity)
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token)
          .then(() => {
            commit('SET_TOKEN', '')
            commit('SET_ROLES', [])
            removeToken()
            resolve()
            Message({
              message: "You've been Logged Out",
              type: 'error',
              duration: 1 * 1000
            })
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    },
    ChangeRoles({ commit, dispatch }, role) {
      return new Promise(resolve => {
        commit('SET_TOKEN', role)
        setToken(role)
        getUserInfo(role).then(response => {
          const data = response.data
          commit('SET_ROLES', data.roles)
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          commit('SET_INTRODUCTION', data.introduction)
          dispatch('GenerateRoutes', data) // After modifying permissions dynamic redraw the side menu
          resolve()
        })
      })
    }
  }
}

export default user
