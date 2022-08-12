import type { FormConfig } from '@yq-editor/global-types'

// 推特分享所需参数
export interface twShareConfig {
  /**
   * 文本
   */
  text: string
  /**
   * 标签
   */
  hashTags: string[]
  /**
   * 分享地址
   */
  url: string
}

type twShare = {
  [P in keyof twShareConfig]: Partial<FormConfig>
}

export const twitterConfig: twShare = {
  text: { label: '文本' },
  url: { label: '分享跳转地址' },
  hashTags: { label: '标签' },
}
