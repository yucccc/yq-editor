import { request } from '@/shared'

export const getUserInfoApi = function (data: { name: string }) {
  return request.get('/api/user/info', data)
}
export const getMyWorksApi = function (data = {}) {
  return request.get('/api/works', data)
}
export const getTemplateWorksApi = function (data = {}) {
  return request.get('/api/templates', data)
}

export const getWorkDescApi = function (id: string) {
  return request.get(`/api/works/${id}`)
}
