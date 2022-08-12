import { isString } from 'lodash-es'
import type { VNode } from 'vue'
import { stateMap } from '@/config/common'
import { useEditorStore } from '@/store/editor'
const actRequestBtnFns = {
  handleStateConfig: (v: string, props: any) => {
    const key = props.text
    // 换当前图
    if (isString(key)) {
      const store = useEditorStore()
      for (const config of props.stateConfig) {
        if (config.key === key) {
          if (config.imgSrc !== props.currentImgSrc) {
            store.updateComponent({
              key: 'currentImgSrc',
              value: config.imgSrc,
            })
          }
          if (config.isNeedGrayClass !== props.isNeedGrayClass) {
            store.updateComponent({
              key: 'isNeedGrayClass',
              value: config.isNeedGrayClass,
            })
          }
          if (config.disabled !== props.disabled) {
            store.updateComponent({
              key: 'disabled',
              value: config.disabled,
            })
          }
        }
      }
    }
  },
}
export interface PropToForm {
  text?: string
  component: string
  /**
   * 传递给组件的属性
   */
  extraProps?: { [key: string]: any }
  // 输出值处理
  afterTransform?: (v: any, properties: any) => any
  initialTransform?: (v: any, properties: any) => any
  valueProp?: string
  eventName?: string
  /**
   * 嵌套子组件
   */
  subComponent?: string
  children?: any[]
  options?: { text: string | VNode; value: any }[]
}

/**
 * 自定义input-number的单位，并及时更新视图
 */
const _pxToNumberHandler = (unit?: string) => {
  return {
    component: 'a-input-number',
    extraProps: { style: { width: '100px' } },
    initialTransform: (v: string) => (v ? parseInt(v, 10) : 0),
    afterTransform: (e: number) => (e ? `${e}${unit !== undefined ? unit : 'px'}` : ''),
  }
}

export default {
  'act-state-btn': {
    stateConfig: {
      text: '状态配置',
      ...stateMap,
      initialTransform: (val: any, props: any) => {
        actRequestBtnFns.handleStateConfig(val, props)
        return val
      },
      afterTransform: (val: any, props: any) => {
        actRequestBtnFns.handleStateConfig(val, props)

        return val
      },
    },
  },
  'act-track': {
    // activeImage: {
    //   text: '公共运动图',
    //   component: 'image-processor',
    //   afterTransform: (e: any) => {
    //     return e.src
    //   },
    // },
    subComponent: {
      component: 'more-uploader',
      text: '运动图',
      extraProps: {
        commitType: 'object',
      },
    },
    circle: {
      text: '跳转圈数',
      component: 'a-input-number',
      extraProps: { style: { width: '100px' } },
      initialTransform: (v: string) => {
        return v ? parseInt(v, 10) : 0
      },
    },
    execCbDuration: {
      text: '回调执行延迟（ms）',
      component: 'a-input-number',
      extraProps: { style: { width: '100px' } },
      initialTransform: (v: string) => {
        return v ? parseInt(v, 10) : 0
      },
    },
    direction: {
      text: '转圈方向',
      component: 'a-radio-group',
      subComponent: 'a-radio',
      afterTransform: (e: any) => e.target.value,
      options: [
        {
          text: '顺时针',
          value: 'observe',
        },
        {
          text: '逆时针',
          value: 'reverse',
        },
      ],
    },
    fromZero: {
      text: '每次从头',
      component: 'a-switch',
      valueProp: 'checked',
    },
    CALLBACK_END: {
      text: '结束回调',
      component: 'modal-button',
      extraProps: {
        btnProps: {
          slot: '自定义代码',
        },
        modalProps: {
          slot: 'action-set',
          isComponent: true,
        },
      },
    },
  },
  'act-turntable': {
    num: {
      text: '奖励数量',
      component: 'a-input-number',
      extraProps: { style: { width: '100px' } },
      initialTransform: (v: string) => {
        return v ? parseInt(v, 10) : 0
      },
    },
    isPointerRotate: {
      text: '旋转对象',
      component: 'a-radio-group',
      subComponent: 'a-radio',
      afterTransform: (e: any) => {
        return e.target.value
      },
      options: [
        {
          text: '指针转',
          value: 1,
        },
        {
          text: '轮盘转',
          value: 0,
        },
      ],
    },
    direction: {
      text: '转动方向',
      component: 'a-radio-group',
      subComponent: 'a-radio',
      afterTransform: (e: any) => {
        return e.target.value
      },
      options: [
        {
          text: '顺时针',
          value: 0,
        },
        {
          text: '逆时针',
          value: 1,
        },
      ],
    },
    pointerWidth: {
      text: '宽度-指针',
      ..._pxToNumberHandler(),
    },
    pointerTop: {
      text: 'x-指针',
      ..._pxToNumberHandler('%'),
    },
    pointerLeft: {
      text: 'y-指针',
      ..._pxToNumberHandler('%'),
    },
    coronaImg: {
      text: '背景图',
      component: 'image-processor',
      afterTransform: (e: any) => {
        return e.src
      },
    },
    pointerImg: {
      text: '指针图',
      component: 'image-processor',
      afterTransform: (e: any) => {
        return e.src
      },
    },
    pointerStyle: {
      text: '自定义指针',
      component: 'modal-button',
      extraProps: {
        btnProps: {
          slot: '自定义样式',
        },
        modalProps: {
          slot: 'monaco-set',
          isComponent: true,
          componentsProps: {
            language: 'json',
          },
        },
      },
    },
    CALLBACK: {
      text: '结束回调',
      component: 'modal-button',
      extraProps: {
        btnProps: {
          slot: '自定义代码',
        },
        modalProps: {
          slot: 'action-set',
          isComponent: true,
        },
      },
    },
  },
  'act-egg': {
    eggImgAry: {
      text: '运动图',
      component: 'more-uploader',
      extraProps: {
        maxNam: 10,
      },
    },
    CALLBACK: {
      text: '结束回调',
      component: 'modal-button',
      extraProps: {
        btnProps: {
          slot: '自定义代码',
        },
        modalProps: {
          slot: 'action-set',
          isComponent: true,
        },
      },
    },
  },
  'act-magnifier': {
    giftImgs: {
      text: '奖品',
      component: 'more-uploader',
      extraProps: {
        maxNam: 10,
      },
    },
    iconWidth: {
      text: 'icon宽度',
      component: 'a-input-number',
      initialTransform: (v: string) => {
        return v ? parseInt(v, 10) : 0
      },
      afterTransform: (e: number) => {
        return `${e}px`
      },
    },
    runningTime: {
      text: '运动时间',
      component: 'a-input-number',
      initialTransform: (v: string) => {
        return v ? parseInt(v, 10) : 0
      },
    },
    minTurns: {
      text: '循环次数',
      component: 'a-input-number',
      initialTransform: (v: string) => {
        return v ? parseInt(v, 10) : 0
      },
    },

    scale: {
      text: '放大倍数',
      component: 'a-input-number',
    },
    CALLBACK: {
      text: '结束回调',
      component: 'modal-button',
      extraProps: {
        btnProps: {
          slot: '自定义代码',
        },
        modalProps: {
          slot: 'action-set',
          isComponent: true,
        },
      },
    },
  },
}
