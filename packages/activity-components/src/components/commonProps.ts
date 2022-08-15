import type * as Css from 'csstype'
export const defaultProps = {
  // 是否编辑中
  isEditing: {
    type: Boolean,
    default: false,
  },
  // 组件的唯一id
  id: String,
}

export interface DefaultProps {
  id: string | number
  isEditing: boolean
}

export const stylePropsKey: (keyof Css.Properties)[] = [
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
]
