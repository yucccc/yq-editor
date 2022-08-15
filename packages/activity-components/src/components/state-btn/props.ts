import type { PropType } from 'vue'
import { defaultProps } from '../commonProps'

export interface StateConfigType {
  // 状态显示文案 仅用于标记
  text?: string
  // 标记命中配置
  key: number | string
  // 图片路径
  imgSrc: string
  // 是否需要置灰
  isNeedGrayClass?: boolean
  // 是否禁止点击
  disabled: boolean
  actionConfig: {
    type: string
    [key: string]: any
  }
}

export const Props = {
  stateConfig: {
    type: Array as PropType<StateConfigType[]>,
    default: () => [],
  },
  text: {
    type: String as PropType<string>,
  },
  currentImgSrc: {
    type: String as PropType<string>,
  },
  ...defaultProps,
} as const