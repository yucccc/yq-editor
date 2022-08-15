import type { PropType } from 'vue'
import { defaultProps } from '../commonProps'
export const Props = {
  ...defaultProps,
  // 指针分多少格
  num: {
    default: 8,
    type: Number,
  },
  // 转动方向 0 顺时针 1 逆时针
  direction: {
    default: 0,
    type: Number as PropType<0 | 1>,
  },
  // 1-指针转，0-转盘转
  isPointerRotate: {
    default: 1,
    type: Number as PropType<0 | 1>,
  },
  // 轮盘图片地址
  coronaImg: {
    type: String,
  },
  // 指针图片地址
  pointerImg: {
    type: String,
    required: true,
  },
  // 指针样式
  pointerStyle: {
    type: [Object, String] as PropType<Record<string, any> | string>,
    default: () => ({}),
  },
  pointerWidth: { type: String },
  pointerTop: { type: String },
  pointerLeft: { type: String },
  CALLBACK: {
    type: [Object, Function] as PropType<Record<string, any> | Function>,
  },
}