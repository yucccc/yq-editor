import { request } from '@/shared'
export * from './user'
export * from './works'

export const uploaderApi = (data: any, sn: string) => request.post(`/api/utils/uploader?sn=${sn}`, data)