import { AxiosRequestConfig  } from 'axios';

export interface ApiConfig {
  // 请求的api列表
  apis: ApiType[]
}

export interface GetApiDataType {
  // 请求参数 合并数据源中的列表参数 一个函数字符串
  paramsSf?: string
  // 成功回调 一个函数字符串
  successFn?: string
  // 失败
  errorFn?: string
  // 无论如何都执行
  finallyFn?: string
  
}
// extends AxiosRequestConfig
export interface ApiType  {
  // 接口名称 需要保持唯一
  name: string
  // 接口url 会被拼接上公共前缀
  url: string
  // 请求方式
  method: AxiosRequestConfig['method']
  // 请求配置名
  requestConfigName: string
  // 请求头参数 字符串函数
  headersSf?: string
  // 请求参数 字符串函数
  paramsSf?: string
  // 是否启用mock 只在开发预览环境下有效
  isUseMock?: boolean
  // 是否启用loading显示 默认是false
  isUseLoading?: boolean
  // 执行优先级 数字越小优先级越高
  index?: number,
  
} 
