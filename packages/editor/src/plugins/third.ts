/**
 * 第三方的一些配置
 *
 * 设计:
 *
 * 只配置第三方所需要填的信息 然后映射到页面 让用户填写
 */
import type { FormConfig } from '@yq-editor/global-types'

// fb分享所需参数
export interface FBShareConfig {
  /**
   * 分享标题
   */
  title: string
  /**
   * 分享描述
   */
  content: string
  /**
   * 点击跳转地址
   */
  androidHref: string
  /**
   * 点击跳转地址
   */
  iosHref: string
  /**
   * 分享地址
   */
  url: string
  // 分享图
  shareImg: string
  appId: string
}

type FbShare = {
  [P in keyof FBShareConfig]: Partial<FormConfig>
}

export const fbShareConfig: FbShare = {
  title: { label: '标题' },
  content: { label: '分享描述' },
  androidHref: { label: '安卓跳转地址' },
  iosHref: { label: 'IOS跳转地址' },
  url: { label: '分享跳转地址' },
  shareImg: { label: '分享图片' },
  appId: { label: 'appId' },
}
// 未实现
export const twitterShareConfig: any = {}
