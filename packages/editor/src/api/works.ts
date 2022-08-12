import type { ComponentData } from '@yq-editor/global-types'
import { request } from '@/shared'

interface workType {
  content?: {
    components?: ComponentData[]
    thirdSetting?: any
    baseSetting?: any
    props?: any
    apiConfig?: any
    preSetting?: any
    requestConfig: Record<string, any>
  }
}
type crateWorkByWorkType = workType & {
  workData: {
    from: {
      author: string
      workId: number
      uuid: string
    }
  }
  type: 'byPresentationWork' | 'byWork'
}
export const createWorkApi = function (params: workType) {
  return request.post('/api/works', params)
}
/**
 * 从作品中创建作品（从赠予作品中创建作品或者复制作品）
 */
export const createWorkByWorkApi = function (params: crateWorkByWorkType) {
  return request.post('/api/works', params)
}

// 保存 更新作品
export const patchWorkApi = function (id: string, params: workType) {
  return request.patch(`/api/works/${id}`, params)
}

// 发布作品
export const publishWorkApi = function (id: string) {
  return request.post(`/api/works/publish/${id}`)
}

// 预览作品
export const previewWorkApi = function (id: string) {
  return request.post(`/api/works/preview/${id}`)
}
// 发布模板
export const publishWorkTemplateApi = function (id: string) {
  return request.post(`/api/works/publishTemplate/${id}`)
}

// 预览本地作品
export const previewLocalWorkApi = function (id: string) {
  return request.post(`/api/works/previewLocal/${id}`)
}

// 获取cdn列表
export const getCdnList = function () {
  return request.post('/api/works/cdnList')
}
// 下载
export const downloadApi = (id: any) => {
  return request.request(
    `/api/works/download/${id}`,
    {
      method: 'post',
      responseType: 'blob',
      headers: { 'content-Type': 'application/x-www-form-urlencoded' },
    },
  )
}
/**
 * 生成作品的json，以供预览或者其它操作
 */
export const generateJson = function (id: string) {
  return request.get('/api/works/jsonGenerations', { workId: id })
}
