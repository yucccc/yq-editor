import type { PropType } from 'vue'

import { defaultProps } from '../commonProps'

export interface ActiveArr {
  src: string
  light: boolean
  // 其他位置信息
  [key: string]: any
}

export interface PlayParams {
  speed: number
  number: number
}

export const Props = {
  ...defaultProps,
  // 动画图片 初始化时会给子组件当前图片
  activeImage: {
    type: String,
  },
  // 动画公共配置 给子组件 在编辑器中没用 子组件有会自身宽高
  // activeCommonStyle: {
  //   type: [Object, String] as PropType<Record<string, any> | string>,
  //   default: () => ({}),
  // },
  // 子组件位置信息 会被编辑器传递位置配置
  subComponent: {
    type: Array as PropType<({ src?: string } & Record<string, unknown>)[]>,
    default: () => [],
  },
  // 播放参数
  playParams: {
    type: Object as PropType<PlayParams>,
    default: () => ({
      number: 0,
      speed: 350,
    }),
  },
  // 抽奖最少跳转圈数
  circle: {
    type: Number,
    default: 3,
  },
  // 运动方向 从 index高到底 还是低到高
  direction: {
    type: String as PropType<'observe' | 'reverse'>,
    default: 'observe',
  },
  // 是否每次从头开始
  fromZero: {
    type: Boolean,
    default: false,
  },
  // 回调执行完毕
  CALLBACK_END: {
    type: [Object, Function] as PropType<Record<string, any> | Function>,
  },
} as const