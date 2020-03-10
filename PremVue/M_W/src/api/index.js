import request from '@/utils/request'
import { getToken } from '@/utils/auth'

export function M(routine, data) {
  return request({
    headers: {
      'SES': getToken()
    },
    url: 'API^MW',
    method: 'post',
    data: {
      routine: routine,
      data: data
    }
  })
}
