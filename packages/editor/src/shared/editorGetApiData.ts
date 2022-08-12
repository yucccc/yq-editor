import { HRequest } from '@yq-editor/shared'
import { message } from 'ant-design-vue'

export const request = new HRequest({
  interceptorHooks: {
    requestInterceptor: (config) => {
      try {
        // 与服务端协定的所需参数
        config.headers!.login = JSON.parse(localStorage.getItem('user') || '{}').data?.login
      }
      catch (error) {

      }
      return config
    },
    responseInterceptor: (res) => {
      if (res.data.errCode) {
        message.error(res.data.message)
        throw new Error(res.data.message)
      }
      return res.data
    },
  },
})