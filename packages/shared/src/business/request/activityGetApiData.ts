/**
 * 网页活动请求实现 注意 该配置根据业务而变动 因此下方写的代码都是模拟真实复杂场景
 * 如不需要 请删除后按照规范自行实现
 */
import { Toast } from 'vant'
import 'vant/es/toast/style'
import md5 from 'md5'
import { HRequest, filterReqParams, getURLParameters, sortByASCII } from '@yq-editor/shared'
import qs from 'qs'
import type { ApiConfig, FormConfig } from '@yq-editor/global-types'

// 本地调试地址 需要跟进业务进行配置修改

export const bcBUrl = 'http://localhost:3000/'
/**
 * 获取请求参数签名
 * @param params 请求参数Object
 * @param signKey
 * @param timestamp
 */
function getReqSign(params: Record<string, unknown>, signKey: string, timestamp: number) {
  const filterParams = filterReqParams(params)
  const sortParams = sortByASCII(filterParams)
  let paramStr = Object.keys(sortParams).reduce((str, key) => {
    return `${str}${key}=${sortParams[key]}&`
  }, '')
  paramStr = paramStr.replace(/&$/, '')
  paramStr += `${paramStr && '&'}signKey=${signKey}&timestamp=${timestamp}`
  const md5Str = md5(paramStr) as string
  return md5Str.toUpperCase()
}

function getUrlParams() {
  const { userId, roleId, serverId, channelId, subCkAppId, childGameId, fromArea, appId, ckAppId } = getURLParameters()
  return {
    userId: decodeURIComponent(userId),
    roleId,
    serverId,
    channelId,
    subCkAppId,
    childGameId: subCkAppId || childGameId || 0,
    fromArea: fromArea || 0,
    gameId: appId || ckAppId,
  }
}
type FormConfigKey = 'custom-p-1' | 'loginType' | 'baseURL' | 'baseURL2'
const formConfig: Record<FormConfigKey, FormConfig > = {
  'baseURL': {
    label: 'baseURL请求地址',
    formItemProps: { required: true },
    component: 'a-select',
    subComponent: 'a-select-option',
    subComponentOptions: [
      {
        text: '请求地址2',
        value: '请求地址2',
      },
      {
        text: '请求地址2',
        value: 'http://localhost:3000/',
      },
    ],
  },
  'baseURL2': {
    label: '自定义请求地址',
    tips: '如果你填写了这个字段 则会覆盖上面的baseURL',
  },
  'custom-p-1': {
    label: '自定义参数1',
    tips: '如果你填写了这个字段 会被传递给请求config',
  },
  // ：1-参数拼接（游戏内跳转）；2-账密登录；3-第三方登录
  'loginType': {
    label: '登录类型',
    formItemProps: {
      required: true,
    },
    component: 'a-select',
    subComponent: 'a-select-option',
    subComponentOptions: [
      {
        text: '参数拼接(游戏内跳转登陆)',
        value: 1,
      },
      {
        text: '账密登录',
        value: 2,
      },
      {
        text: '第三方登录',
        value: 3,
      },
    ],
  },

}

let loading: any = null

export const name = '网页活动请求'
export const request = new HRequest({
  interceptorHooks: {
    requestInterceptor: (config) => {
      try {
        // 这里的数据由提供端定制提供 因此能保证必须有该数据格式
        const editorStore = JSON.parse(localStorage.getItem('editor') || '{}')
        // 这里是保证有的 业务方需要保证存在
        // 取到用户填写的字段 params
        const params = editorStore.page?.requestConfig[name] || {} as Record<FormConfigKey, any>

        config.baseURL = params.baseURL

        const { isLoading } = config
        if (isLoading && !loading) {
          loading = Toast.loading({
            duration: 0,
            message: '加载中...',
            forbidClick: true,
          })
        }
        // 假设用户需要获取url信息
        const commonParams = getUrlParams()
        const data = qs.parse(config.data)

        if (config.method === 'post') {
          config.data = {
            ...data,
            ...commonParams,
            ...params,
          }
          const timestamp = Date.now()
          // 假设用户需要自定义加密参数
          const sign = getReqSign(config.data, '123', timestamp)
          config!.headers!.timestamp = timestamp
          config!.headers!.sign = sign
        }
        // TODO: 乱写的token 需要业务者自行修改
        const token = editorStore.page.totalResData.visit.data
        if (token) {
        // 这里是业务者定的 所以一定要按照这个设置走 否则只能通过每一条请求配置自行设置
          config!.headers!.token = token
        }
      }
      catch (error) {
        // TODO: 需要业务自行处理
        console.log('%c [ 请求拦截器出现错误 ]-149-「activityGetApiData」', 'font-size:13px; background:pink; color:#bf2c9f;', error.message)
        hideLoading()
      }
      return config
    },
    responseInterceptor: (response) => {
      // 这里的错误返回判断是根据服务端而定
      if (response.data.code) {
        throw new Error(response.data)
      }
      hideLoading()

      return response.data
    },
    responseInterceptorCatch(error) {
      hideLoading()
      return error
    },
  },
})
function hideLoading() {
  loading && loading.clear()
  loading = null
}
// 默认填写数据
export const defaultParams = {
  baseURL: bcBUrl,
  loginType: 1,
}

// 用户需要填写的字段
export const getFormConfig = () => {
  return formConfig
}
// 提供给外部的初始化请求 h会被合并到数据源中
// 我们手动写了_mock在前面 实际业务中可以在config中取到是否使用mock 有利于我们进行调试开发
export const initApiConfig: ApiConfig = {
  apis: [
    {
      requestConfigName: name,
      name: 'test-post-login',
      url: '/_mock/login',
      method: 'POST',
      index: 1,
      isUseMock: false,
      isUseLoading: true,
    },
    {
      name: 'test-get-info',
      url: '/_mock/info',
      index: 2,
      isUseMock: false,
      method: 'GET',
      requestConfigName: name,
      isUseLoading: true,
    },
    // {
    //   requestConfigName: name,
    //   name: 'luck',
    //   url: '/api/lottery/common',
    //   index: 0,
    //   isUseMock: false,
    //   method: 'POST',
    //   isUseLoading: true,
    // },
    // {
    //   requestConfigName: name,
    //   name: '签到',
    //   url: '/api/sign-in/common',
    //   index: 0,
    //   isUseMock: false,
    //   isUseLoading: true,
    //   method: 'POST',
    // },
    // {
    //   requestConfigName: name,
    //   name: '礼物列表',
    //   url: '/api/gift/list',
    //   index: 0,
    //   isUseMock: false,
    //   isUseLoading: true,
    //   method: 'GET',
    //   paramsSf: `
    //   function fn(props) {
    //     return {
    //       way: 'lottery'
    //     }
    //   }
    //   `,
    // },
    // {
    //   requestConfigName: name,
    //   name: '兑奖',
    //   url: '/api/exchange/common',
    //   index: 0,
    //   isUseMock: false,
    //   isUseLoading: true,
    //   method: 'POST',
    // },
    // {
    //   requestConfigName: name,
    //   name: '分享',
    //   url: '/api/exchange/common',
    //   index: 0,
    //   isUseMock: false,
    //   isUseLoading: true,
    //   method: 'POST',
    // },
  ],
}