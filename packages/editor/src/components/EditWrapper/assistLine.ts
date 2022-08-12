import { isString, pick } from 'lodash-es'
import type { ComponentData } from '@yq-editor/global-types'

/**
 * 简单组件键值数组，仅用来判断辅助线
 */
const simpleComponentDataKeyArr = ['width', 'height', 'left', 'top'] as const

type simpleComponentDataKeys = typeof simpleComponentDataKeyArr

export interface threePointPropType {
  top: number
  left: number
  width?: number
  height?: number
}

// 有height，height为第一优先级
type threePointObjType = Record<
  'topLeft' | 'center' | 'rightBottom',
  // | { top: number; left: number; width?: number }
  // | { top: number; left: number; height?: number }
  threePointPropType
>

/**
 * 获取三点位置的对象，生成三点式对象，分别为左上点，中心点和右下点，用于判断对齐辅助线生成。
 */
function getPosObj(props: {
  [key in simpleComponentDataKeys[number]]: string | number
}) {
  const numberComp = simpleComponentDataKeyArr.reduce(
    (
      obj: {
        [key: string]: number
      },
      key,
    ) => {
      const keyVal = props[key]
      if (simpleComponentDataKeyArr.includes(key)) { obj[key] = isString(keyVal) ? parseInt(keyVal || '', 10) : Number(keyVal) }
      return obj
    },
    {},
  )
  const obj: threePointObjType = {
    // 左上点
    topLeft: {
      top: numberComp.top,
      left: numberComp.left,
    },
    // 中心点
    center: {
      top: numberComp.top + numberComp.height / 2,
      left: numberComp.left + numberComp.width / 2,
    },
    // 右下点
    rightBottom: {
      top: numberComp.top + numberComp.height,
      left: numberComp.left + numberComp.width,
    },
  }
  return obj
}

/**
 * 获取三点式对象的数组，其中过滤当前活动组件
 * @param components 页面上的所有组件 store.state?.editor?.components
 * @param currentComponentId 当前活动组件id
 * @returns 三点式对象数组
 */
export function getcomponentPosDataArr(components: ComponentData[], currentComponentId: string | number) {
  const dataArr = []
  for (const comp of components) {
    // 这里可能要补充上边界情况，比如宽高等于0，opacity为0或者display为none
    // if(comp.width === 0) {
    // continue
    // }
    // 过滤当前移动的组件
    if (comp.id === currentComponentId) {
      continue
    }
    const obj = getPosObj(pick(comp.props, ['width', 'height', 'left', 'top']) as any)
    dataArr.push(obj)
  }

  // 添加画布中心点
  const dom = (document.querySelector('#canvas-area img') || document.querySelector('#canvas-area')) as HTMLElement
  if (dom) {
    const { offsetWidth: canvasWidth, offsetHeight: canvasHeight } = dom
    dataArr.push({
      center: {
        top: 0,
        left: canvasWidth / 2,
        height: canvasHeight,
      },
    })
    return dataArr
  }
  return []
}

/**
 * 生成辅助线数据数组
 * @param obj
 * @param obj.currentComponentData 当前移动组件数据
 * @param obj.components 所有组件数据
 * @param obj.lineGap 判断线的距离，不小于0，越大越容易显示辅助线，调整位置也大
 * @returns 辅助线数据数组
 */
export function getAssistLineArr({
  currentComponentData,
  components,
  lineGap = 1,

}: {
  currentComponentData: Record<simpleComponentDataKeys[number], string | number> & {
    id: number | string
  }
  components: ComponentData[]
  lineGap: number
}): threePointPropType[] {
  const { left, top, width, height, id } = currentComponentData

  const lineArr = []
  const currentCompData = getPosObj({
    left,
    top,
    width,
    height,
  })

  const componentPosDataArr = getcomponentPosDataArr(components, id)
  for (const compData of componentPosDataArr) {
    const {
      top: centerTop,
      left: centerLeft,
      height: centerHeight,
    } = compData.center as {
      left: number
      top: number
      height: number | undefined
    }
    // key的值为 topLeft,center,rightBottom
    let key1: keyof typeof compData
    for (key1 in compData) {
      if (Object.prototype.hasOwnProperty.call(compData, key1)) {
        const { top, left } = compData[key1]
        let key2: keyof typeof currentCompData
        for (key2 in currentCompData) {
          const { top: curTop, left: curLeft } = currentCompData[key2]
          const { top: curCenterTop, left: curCenterLeft } = currentCompData.center
          // top相同
          if (Math.abs(top - curTop) <= lineGap) {
            if (left === curLeft) {
              break // 跳出循环，一个点匹配，其它点不会再匹配到
            }
            lineArr.push({
              top,
              left: centerLeft - curCenterLeft < 0 ? centerLeft : curCenterLeft,
              width: Math.abs(centerLeft - curCenterLeft),
            })
            break
          }
          // left相同
          if (Math.abs(left - curLeft) <= lineGap) {
            if (top === curTop) {
              break // 跳出循环，一个点匹配，其它点不会再匹配到
            }
            lineArr.push({
              left,
              top: centerTop - curCenterTop < 0 ? centerTop : curCenterTop,
              height: centerHeight || Math.abs(centerTop - curCenterTop),
            })
            break
          }
        }
      }
    }
  }
  return lineArr
}
