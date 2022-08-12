import { request } from '@/shared'

interface sendWorkApiParamsType {
  recipient: string
  workData: {
    author: string
    _id: number
    uuid: string
    contentId: string
  }
}

// 赠送作品
export const sendPresentationWorkApi = function (data: sendWorkApiParamsType) {
  return request.post('/api/presentationWorks/', data)
}

// 查看赠送作品
export const getPresentationWorkApi = function (data = {}) {
  return request.get('/api/presentationWorks/', data)
}

// 删除收到的赠送作品
export const deletePresentationWorkApi = function (id: string) {
  return request.delete(`/api/presentationWorks/${id}`)
}
