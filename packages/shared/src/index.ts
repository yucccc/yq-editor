import { cloneDeep, isNumber, isString, mergeWith } from 'lodash-es'
export * from './compile'
export * from './request'
export * from './pickStyle'
export * from './initApiData'
export * from './emitter'

try {
  // const a = import.meta.glob('./business/request/**.ts')
  // console.log('%c [ a ]-15-「index」', 'font-size:13px; background:pink; color:#bf2c9f;', a)
}
catch (error) {

}

/**
 * 根据相同key进行分组
 * @param arr 需要分组的数组
 * @param key 分组的key
 * @param filterNull 过滤空值
 * @returns []
 */
export function groupBy<T extends Record<any, any>, K extends keyof T>(
  arr: T[],
  key: K,
  config: { filterNull?: boolean; filterZero?: boolean } = {},
): Record<string, T[]> {
  const _config = myMergeWith({ filterNull: false, filterZero: false }, [config])
  return arr.reduce((acc, cur) => {
    const k = cur[key]
    if ((k == null || k === '') && _config.filterNull) {
      return acc
    }
    if (_config.filterNull && k === 0) {
      return acc
    }
    // @ts-expect-error 类型推断 类型“T[K]”无法用于索引类型“{}”
    if (!acc[k]) {
      // @ts-expect-error 类型推断 类型“T[K]”无法用于索引类型“{}”
      acc[k] = []
    }
    // @ts-expect-error 类型推断 类型“T[K]”无法用于索引类型“{}”
    acc[k].push(cur)
    return acc
  }, {})
}

/**
 * 将对象拼接
 * @param data  { a: 1, b: 2, c: 3 }
 * @returns 'a=1&b=2&c=3'
 */
export function stringify(data: Record<string, string | number>): string {
  return Object.keys(data).map(key => `${key}=${data[key]}`).join('&')
}

/**
 * url字符串拼接
 * @param options { url: '', params: { a: 1, b: 2 } }
 * @returns 'url?a=1&b=2'
 */
export const setUrlQuery = (
  query: Record<string, string | number>,
  url: string = window.location.href,
) => {
  return `${url}${url.includes('?') ? '&' : '?'}${stringify(query)}`
}

// url 路径拼接 http://localhost:9990/ + /asda/asd/asd.html = http://localhost:9990/asda/asd/asd.html
// fix 剔除url中多余的 /
export const fixUrl = (path: string) => {
  return path.replace(/[\/]+[\/]/g, '/').replace(':/', '://')
}

/**
 * 获取url上的参数
 * @param url
 */
export const getURLParameters = <T>(url: string = window.location.href): T =>
  (url.match(/([^?=&]+)(=([^&]*))/g) || []).reduce((a: any, v: string) => ((a[v.slice(0, v.indexOf('='))] = v.slice(v.indexOf('=') + 1)), a),
    {},
  )

// 删除url上某个query参数
export function removeURLParameter(parameter: string, url: string = window.location.href) {
  const urlObj = new URL(url)
  urlObj.searchParams.delete(parameter)
  return urlObj.href
}
/**
 * 背景图地址转换为纯地址
 * @param v 'url('xxx')'
 * @returns xxx
 */
export const bgUrlToSrc = (v: string) => {
  if (v) {
    const reg = /\(["'](.+)["']\)/g
    const matches = reg.exec(v)
    if (matches && matches.length > 1) {
      return matches[1]
    }
    else {
      return ''
    }
  }
  else {
    return ''
  }
}
/**
 * 地址拼接上url 变为背景地址
 * @param src 图片地址
 * @returns 'url(' + src + ')'
 */
export const srcToBgUrl = (src: string) => {
  if (src.startsWith('url')) { return src }
  return `url('${src}')`
}
/**
 * 休眠
 * @param ms 毫秒
 * @returns Promise
 */
export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 深度合并对象 返回新对象 mergeWith的二次封装不改变源数据
 * @param obj
 * @param sources
 * @param customize
 */
export function myMergeWith<T>(obj: T, sources: any[], customize?: (objectValue: any, srcValue: any) => any): T {
  return mergeWith(cloneDeep(obj), ...sources, customize)
}

// px和数字的相互转换
export const pxToNumberHandler = {
  initialTransform: (v: unknown) => {
    if (isNumber(v)) { return v }
    if (isString(v)) { return parseInt(v, 10) }
    return 0
  },
  afterTransform: (e: number | string) => (e ? `${e}px` : ''),
}
/**
 * 转为字符串
 * @param v
 * @returns
 */
export const toString = (v: unknown) => {
  if (isString(v)) { return v }
  return JSON.stringify(v)
}

/**
 * 将字符串解析为数据
 * @param obj {a: {b: 1}}
 * @param path 'a.b' => 1
 * // console.log(strGetSourceData({ a: { b: { b: { c: 1 } } } }, 'a.b.b'))
 */
// const cacheRes: Record<string, any> =
export const strGetSourceData = function (obj: Record<string, any> | null, path: string) {
  try {
    if (obj == null) { return path }
    // 防止是代理对象
    obj = cloneDeep(obj)
    const arr: any[] = path.split('.')
    while (arr.length) {
      // @ts-expect-error 原因待补充
      obj = obj[arr.shift()]
    }
    // isNumber 兼容下基础组件 数字全转为字符串显示
    const res = isNumber(obj) ? `${obj}` : obj
    return res
  }
  catch (error) {
    return path
  }
}

export function isJSON(str: string): boolean {
  try {
    const obj = JSON.parse(str)
    return !!(typeof obj == 'object' && obj)
  }
  catch (e) {
    return false
  }
}

/**
 * 过滤请求参数 过滤空的和复杂数据
 * @param data
 * @returns
 */
export function filterReqParams(data: Record<string, unknown>) {
  return Object.keys(data).reduce((total: Record<string, unknown>, key: string) => {
    if ((data[key] ?? '') !== '' && typeof data[key] !== 'object') {
      total[key] = data[key]
    }
    return total
  }, {})
}

/**
 * 参数按ascall码从小到大排序
 * @param Object
 * @returns Object
 */
export function sortByASCII(params: Record<string, unknown>) {
  const paramKeyArr = Object.keys(params)
  paramKeyArr.sort()
  return paramKeyArr.reduce((obj: Record<string, unknown>, key) => {
    obj[key] = params[key]
    return obj
  }, {})
}

/**
 * 将字符串转为json
 */
export const stringToJson = (str: string): Record<string, any> => {
  try {
    return JSON.parse(str)
  }
  catch (e) {
    return {}
  }
}
