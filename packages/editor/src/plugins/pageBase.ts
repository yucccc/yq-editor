/**
 * 页面的一些基础配置
 *
 * 设计:
 *
 * 只配置页面基础配置所需要填的信息 然后映射到页面 让用户填写
 */
import type { FormConfig } from '@/components/DynamicForm'

// 页面所需参数
export interface pageBaseConfigType {
  /**
   * 标题
   */
  title: string
  /**
   * 描述
   */
  description: string
}

type pageBase = {
  [P in keyof pageBaseConfigType]: Partial<FormConfig>
}

export const pageBaseConfig: pageBase = {
  title: { label: '标题' },
  description: { label: '描述' },
}
