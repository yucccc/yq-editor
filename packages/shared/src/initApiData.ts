import type { ApiConfig, ApiType, GetApiDataType, RequestModules } from '@yq-editor/global-types'
import { groupBy, runCodeWithFunction } from '@yq-editor/shared'
import { merge } from 'lodash-es'

let requestModules: RequestModules | null = null
// 加载本地配置
export const loadRequestModules = async () => {
  if (requestModules) {
    return requestModules
  }

  const modules = import.meta.glob('./business/request/**.ts')
  if (!modules) {
    console.log('%c [ 未找到配置文件 ]-13-「initApiData」', 'font-size:13px; background:pink; color:#bf2c9f;')
    return null
  }
  requestModules = {} as RequestModules
  for (const path in modules) {
    const mod = await modules[path]() as RequestModules
    if (!mod.name || !mod.request) {
      console.log('%c [ 缺少必要参数 ]-19-「initApiData」', 'font-size:13px; background:pink; color:#bf2c9f;')
    }
    else {
      requestModules[mod.name] = mod
    }
  }
  return requestModules
}
/**
 * 请求方法
 * @param config
 * @param config2 被合并的配置
 * @returns
 */
export const getApiData = async (config: ApiType, config2: GetApiDataType = {}) => {
  const { paramsSf } = config2
  const {
    requestConfigName,
    url,
    method = 'get',
    isUseLoading,
    name,
    paramsSf: cParamsSf,
    headersSf: cHeadersSf,
  } = config
  if (requestConfigName && requestModules) {
    // 当前使用的请求配置
    const currentReqConfig = requestModules[requestConfigName] as RequestModules
    const params = {}
    // 请求参数会被合并
    if (cParamsSf) { merge(params, runCodeWithFunction(cParamsSf, {})) }
    if (paramsSf) { merge(params, runCodeWithFunction(paramsSf, {})) }
    const headers = {}
    if (cHeadersSf) { merge(headers, runCodeWithFunction(cHeadersSf, {})) }

    // 该配置的用户填写参数
    const me = method.toLocaleLowerCase() as 'get' | 'post' | 'delete' | 'put' | 'patch'

    // 发送请求 使用配置的请求方法
    const res = await currentReqConfig.request[me](url, params, {
      isLoading: isUseLoading,
      headers,
    })

    res.key = name || url
    return res
  }
  else {
    console.warn('%c [ 缺少请求配置名 ]-530-「editor」', 'font-size:13px; background:pink; color:#bf2c9f;')
  }
}
const getAsync = async (apis: ApiType[][]) => {
  const totalResData = {} as any
  for (let index = 0; index < apis.length; index++) {
    const item = apis[index]
    const res = await Promise.allSettled(item.map(v => getApiData(v)))
    res.forEach((item) => {
      if (item.status === 'rejected') {
        // TODO: 未处理失败的报错情况
        console.log('%c [ 失败 ]-77-「initApiData」', 'font-size:13px; background:pink; color:#bf2c9f;', item.reason.message)
      }
      else {
        const v = item.value
        totalResData[v.key] = v
      }
    })
  }
  return totalResData
}
export const initApiData = async (apiConfig: ApiConfig) => {
  // 加载本地请求配置
  if (!requestModules) {
    await loadRequestModules()
  }
  if (apiConfig.apis.length) {
    // 数据分组
    const groupApis = groupBy(apiConfig.apis, 'index', { filterNull: true, filterZero: true })
    return await getAsync(Object.values(groupApis))
  }
}