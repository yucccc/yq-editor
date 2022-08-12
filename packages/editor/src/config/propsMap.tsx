import type { VNode } from 'vue'
import { isString } from 'lodash-es'
import componentPropsMap from './activity-component'
import type { AllFromProps, PageProps } from '@/store/editor'
import { useEditorStore } from '@/store/editor'
import {
  pxToNumberHandler,
  runCodeWithFunction,
  strGetSourceData,
} from '@/shared'

export type AllProps = AllFromProps &
PageProps & { title?: string } & ActProps &
MySetting &
pageProp
// 组件的 先写这 后期需要业务组件返回
export interface ActProps {
  signImgSrc: string
  sourceDataKey?: string
  handleSourceData?: string
  actionConfig?: boolean
  id: string
  index?: string
}

export interface pageProp {
  thirdSetting: string[]
  baseSetting: string[]
}
export interface MySetting {
  setting?: object
  isLockScale: boolean
}
export type PropsToForms = {
  [P in keyof AllProps]?: PropToForm

}
export interface PropToForm {
  // 显示的名称
  text?: string
  // 显示提示
  tips?: string
  // 渲染的组件名称
  component: string
  // 传递给组件的props
  extraProps?: Record<string, any>
  // 输出值处理
  afterTransform?: (v: any, properties: any) => any
  initialTransform?: (v: any, properties: any) => any
  // 动态属性绑定 之前用于ant组件
  valueProp?: string
  // 触发事件名称
  eventName?: string
  // 嵌套子组件名称
  subComponent?: string
  //  子组件options
  options?: { text: string | VNode; value: any }[]
}

export interface ImageType {
  width: number
  height: number
  src: string
}

// 触发其他属性面板值更新
export const emitProps = (
  key: string[],
  value: () => any[],
) => {
  const eStore = useEditorStore()
  eStore.updateComponent({ key, value: value() })
}

export const mapPropsToForms2: ({
  // 进入属性的key值
  propKeys: string[]
} & PropToForm)[] = [
  {
    text: '位置',
    propKeys: ['left', 'top'],
    component: 'Position',
  },
  {
    text: '尺寸',
    propKeys: ['width', 'height'],
    component: 'Size',
  },
  {
    text: '文字',
    propKeys: ['fontSize', 'color', 'fontFamily', 'lineHeight', 'text', 'textAlign'],
    component: 'Font',
  },
  {
    text: '背景设置',
    propKeys: ['backgroundImage', 'backgroundColor', 'backgroundSize'],
    component: 'Background',
  },
  {
    text: '内边距',
    propKeys: ['paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight'],
    component: 'Padding',
  },

  {
    text: '边框',
    propKeys: ['borderStyle', 'borderWidth'],
    component: 'Border',
  },
]
// 数据字段
export const mapPropsToForms: PropsToForms = {
  // 提交的时候还是以Props 后续样式重构到style中
  src: {
    text: '图片',
    component: 'image-processor',
    afterTransform: (e: ImageType) => {
      emitProps(['width', 'height'], () => {
        return [
          pxToNumberHandler.afterTransform(e.width),
          pxToNumberHandler.afterTransform(e.height),
        ]
      })
      return e.src
    },
  },

  // 自定义交互设置字段
  isLockScale: {
    text: '锁定比例',
    component: 'a-switch',
    valueProp: 'checked',
  },
  actionConfig: {
    component: 'modal-button',
    extraProps: {
      btnProps: {
        slot: '设置交互',
      },
      modalProps: {
        slot: 'action-set',
        isComponent: true,
      },
    },
  },
  sourceDataKey: {
    text: '字段数据',
    component: 'source-key',
    afterTransform: (currentValue: string, properties: any) => {
      const eStore = useEditorStore()
      if (!currentValue) { return currentValue }
      const { handleSourceData } = properties
      // 得到解析的数据
      let res = strGetSourceData(
        eStore.page.totalResData,
        currentValue,
      )

      // 处理下字段
      if (handleSourceData) {
        res = runCodeWithFunction(handleSourceData, res)
      }
      else {
        emitProps(['handleSourceData'], () => {
          return ['function f(v){return v}']
        })
      }

      emitProps(['text'], () => {
        return [`${isString(res) ? res : JSON.stringify(res)}`]
      })
      return currentValue
    },
  },
  thirdSetting: {
    component: 'modal-button',
    text: '第三方设置（fb分享）',
    extraProps: {
      btnProps: {
        slot: '第三方设置',
        isComponent: false,
      },
      modalProps: {
        slot: 'third-set',
        isComponent: true,
      },
    },
  },
  baseSetting: {
    component: 'modal-button',
    text: '页面基础设置',
    extraProps: {
      btnProps: {
        slot: '页面基础设置',
        isComponent: false,
      },
      modalProps: {
        slot: 'PageBaseSet',
        isComponent: true,
      },
    },
  },
  isUseBgToImg: {
    text: '背图置换',
    component: 'a-switch',
    valueProp: 'checked',
  },

  handleSourceData: {
    text: '处理数据',
    component: 'modal-button',
    extraProps: {
      btnProps: {
        slot: '处理指定字段数据自定义代码',
      },
      modalProps: {
        slot: 'code-set',
        isComponent: true,
      },
      hasNextStep: false,
    },
    initialTransform(e) {
      return e
    },
    afterTransform: (currentValue: string, properties) => {
      const eStore = useEditorStore()
      const result = strGetSourceData(
        eStore.page.totalResData,
        properties.sourceDataKey,
      )
      const res = runCodeWithFunction(currentValue, result)
      emitProps(['text'], () => {
        return [`${isString(res) ? res : JSON.stringify(res)}`]
      })
      return currentValue
    },
  },

  // 组件自有
  ...componentPropsMap,
}
