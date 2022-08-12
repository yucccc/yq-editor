// 取出样式
import { pick } from 'lodash-es'
import type { Properties } from 'csstype'
export const stylePropsKey: (keyof Properties)[] = [
  // size
  'height',
  'width',
  'paddingLeft',
  'paddingRight',
  'paddingTop',
  'paddingBottom',
  // border type
  'borderStyle',
  'borderColor',
  'borderWidth',
  'borderRadius',
  // shadow and opacity
  'boxShadow',
  'opacity',
  // position and x,y
  'position',
  'left',
  'top',
  'right',
  'bottom',
  // 背景
  'backgroundColor',
  'backgroundImage',
  'backgroundRepeat',
  'backgroundAttachment',
  'backgroundPosition',
  'backgroundSize',
  // 字体
  'color',
  'fontFamily',
  'fontStyle',
  'fontWeight',
  'fontSize',
  // display
  'display',
  'textAlign',
]

export const pickStyle = (props: Record<string, unknown>): Record<typeof stylePropsKey[number], any> => pick(props, stylePropsKey)

// 将驼峰命名转换为-分隔命名
export const camelToDash = (str: string) => {
  return str.replace(/([A-Z])/g, g => `-${g[0].toLowerCase()}`)
}
