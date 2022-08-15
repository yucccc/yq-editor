import type { PropType } from 'vue'
import { defaultProps } from '../commonProps'

export interface Arrange {
  // 要渲染的值 当值不存在的时候 直接显示该key
  key: string
  // 样式 可编辑
  style?: object | string
  // 渲染标签
  type?: string
}

export const Props = {
  ...defaultProps,
  sourceData: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
  arrange: {
    type: Array as PropType<Arrange[]>,
    default: () => [],
  },

} as const