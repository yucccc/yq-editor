import type { FormItemProps } from 'ant-design-vue'

export interface FormConfig {
  label?: string
  formItemProps?: FormItemProps
  // 要渲染的包裹组件 不传是a-input
  component?: string
  // 组件的属性
  componentProps?: any
  // 暂时支持string 理应支持任何vnode
  componentSlot?: string
  // 子组件渲染
  subComponent?: string
  // 子组件渲染选项
  subComponentOptions?: { value: any; text: string }[]
  // 双向数据控制值 不传为 value
  vModel?: 'value' | 'checked' | string
  // 传递该字段会生成提示字段
  tips?: string
}

export type FormConfigKv = Record<string, FormConfig>