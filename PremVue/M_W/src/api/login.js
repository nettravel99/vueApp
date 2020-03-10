import request from '@/utils/request'
import { getToken } from '@/utils/auth'

export function loginByUsername(username, password, entity) {
  const data = {
    username,
    password,
    entity
  }
  return request({
    headers: {
      'SES': getToken()
    },
    url: 'API^MW',
    method: 'post',
    data: {
      routine: 'Login',
      data: data
    }
  })
}

export function loginBySES(SES) {
  const data = {
    SES
  }
  return request({
    headers: {
      'SES': getToken()
    },
    url: 'API^MW',
    method: 'post',
    data: {
      routine: 'LoginBySES',
      data: data
    }
  })
}

export function loginByJWT(JWT) {
  const data = {
    JWT
  }
  return request({
    headers: {
      'SES': getToken()
    },
    url: 'API^MW',
    method: 'post',
    data: {
      routine: 'LoginByJWT',
      data: data
    }
  })
}

export function logout(token) {
  return request({
    headers: {
      'SES': getToken()
    },
    url: 'API^MW',
    method: 'post',
    data: {
      routine: 'Logout',
      data: { token: token }
    }
  })
}

export function getUserInfo(token) {
  return request({
    headers: {
      'SES': getToken()
    },
    url: 'API^MW',
    method: 'post',
    params: { token },
    data: {
      routine: 'getUserInfo^MWR',
      data: {
        token: token
      }
    }
  })
}
