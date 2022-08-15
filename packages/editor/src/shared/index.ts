import { message } from 'ant-design-vue'
import QRCode from 'qrcode'
import domtoimage from 'dom-to-image'
import { isPlainObject } from 'lodash-es'
import { uploaderApi } from '../api'

export * from './editorGetApiData'
export * from '@yq-editor/shared'

type ErrorType = 'size' | 'format' | null
export function beforeUploadCheck(file: File, condition: {
  format?: string[]
  // 使用多少 M 为单位
  size?: number
}) {
  const { format, size } = condition
  const isValidFormat = format ? format.includes(file.type) : true
  const isValidSize = size ? file.size / 1024 / 1024 < size : true
  let error: ErrorType = null
  if (!isValidFormat) {
    error = 'format'
  }
  if (!isValidSize) {
    error = 'size'
  }
  return {
    passed: isValidFormat && isValidSize,
    error,
  }
}

export const commonUploadCheck = (file: File) => {
  const result = beforeUploadCheck(file, {
    format: ['image/jpeg', 'image/png'],
    size: 1,
  })
  const { passed, error } = result
  if (error === 'format') {
    message.error('上传图片只能是 JPG/PNG 格式!')
  }
  if (error === 'size') {
    message.error('上传图片大小不能超过 1Mb')
  }
  return passed
}

/**
 * 转换为二维码
 * @param id
 * @param url
 * @param width
 */
export function generateQRCode(id: string, url: string, width = 240) {
  const ele = document.getElementById(id) as HTMLCanvasElement
  return QRCode.toCanvas(ele, url, { width })
}

/**
 * 字符串转换为object
 * @param jsonStringStyle
 */
export const stringStyleToStyle = (jsonStringStyle: string | object): object => {
  if (!jsonStringStyle) { return {} }
  try {
    if (isPlainObject(jsonStringStyle)) { return jsonStringStyle as object }
    return JSON.parse(jsonStringStyle as string)
  }
  catch (e) {
    return { jsonStringStyle }
  }
}
// 数据某个位置插入
export const insertAt = (arr: any[], index: number, newItem: any) => {
  return [...arr.slice(0, index), newItem, ...arr.slice(index)]
}

/**
 * 对节点进行截图
 * @params dom 节点
 * @returns 节点截图base64
 */
export const getDomScreenshotImg = async function (dom: Node, sn: string) {
  const width = (dom as HTMLElement).offsetWidth
  const height = 1.637 * width
  try {
    const base64Img = await domtoimage.toPng(dom, {
      width,
      height,
      cacheBust: true,
    })
    const { blob, imgType, mimeType } = base64ToBlob(base64Img)
    const file = blobToFile(blob, `screenshot.${imgType}`, mimeType)
    const formData = new FormData()
    formData.append('files', file)
    const res = await uploaderApi(formData, sn)
    return res.data
  }
  catch (error) {
    message.error('截图失败 可能是cdn未设置图片跨域 请检查')
    throw new Error(error.message)
  }
}

/**
 * base64转blob
 */
export function base64ToBlob(base64: any) {
  const matchRes = String(base64).match(/data:([a-zA-Z/]+)/) || []
  const mimeType = matchRes[1]
  const imgType = mimeType.split('/')[1]
  const byteString = atob(base64.split(',')[1])
  const mimeString = base64.split(',')[0].split(':')[1].split(';')[0]
  const ab = new ArrayBuffer(byteString.length)
  const ia = new Uint8Array(ab)
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }
  const blob = new Blob([ab], { type: mimeString })
  return { blob, mimeType, imgType }
}

/**
 * blob转file
 */
export function blobToFile(blob: Blob, name: string, type: string) {
  return new File([blob], name, { type })
}

// 下载
export function downloadBlobData(blobData: any, name: string) {
  if (!window.Blob) {
    alert('你的浏览器不支持该下载功能！请使用更高级的浏览器下载！')
    return
  }
  const downLink = document.createElement('a')
  downLink.download = `${name}.zip`
  downLink.style.display = 'none'
  const blob = new Blob([blobData], { type: 'application/zip' })
  downLink.href = URL.createObjectURL(blob)
  document.body.appendChild(downLink)
  downLink.click()
  document.body.removeChild(downLink)
}
