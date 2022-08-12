/**
 * 默认请求配置
 */
import { message } from 'ant-design-vue'
import type { ApiConfig, FormConfig } from '@yq-editor/global-types'
import { HRequest } from '@yq-editor/shared'
let hide: any = null
export const name = '默认请求配置'

type FormConfigKey = 'baseURL'

export const request = new HRequest({
  interceptorHooks: {
    requestInterceptor(config) {
      // 这里的数据由提供端定制提供 因此能保证必须有该数据格式
      const editorStore = JSON.parse(localStorage.getItem('editor') || '{}')

      // 这里是保证有的 业务方需要保证存在
      // 取到用户填写的字段 params
      const params = editorStore.page.requestConfig[name] as Record<FormConfigKey, any>
      config.baseURL = params.baseURL
      const { isLoading } = config

      if (isLoading && !hide) {
        hide = message.loading('加载中...', 0)
      }

      return config
    },
    responseInterceptor(res) {
      if (res.data.errorCode) {
        throw new Error(res.data)
      }
      hide && hide()
      hide = null
      return res.data
    },
  },
})

const formConfig: { [key: string]: FormConfig } = {
  baseURL: {
    label: '请求地址',
  },
}

/**
 * 需要传递的字段
 */
export const getFormConfig = () => {
  return formConfig
}

export const defaultParams = {
  baseURL: 'http://localhost:3000/',
}

export const initApiConfig: ApiConfig = {
  apis: [
    {
      requestConfigName: name,
      name: '测试get请求',
      url: '/test-api',
      method: 'get',
      index: 1,
      isUseMock: false,
      isUseLoading: true,
    },
    {
      name: '测试post请求',
      url: '/test-act',
      index: 1,
      isUseMock: false,
      method: 'POST',
      requestConfigName: name,
      isUseLoading: true,
    },
  ],
}