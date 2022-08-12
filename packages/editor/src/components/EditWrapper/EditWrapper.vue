<script lang="ts" setup>
import type { PropType } from 'vue'
import { computed, defineComponent, inject, nextTick, onMounted, reactive, ref, watch, withDefaults } from 'vue'
import { debounce, pick } from 'lodash-es'
import type { DebouncedFuncLeading } from 'lodash'
import type * as Css from 'csstype'
import type { threePointPropType } from './assistLine'
import { getAssistLineArr } from './assistLine'
import { pxToNumberHandler } from '@/shared'
import { useEditorStore } from '@/store/editor'

type currentCompStyleKeyType = ['position', 'top', 'left', 'width', 'height']

type currentCompStyleType = {
  [key in currentCompStyleKeyType[number]]: string
}

interface ComProps {
  width: string
  height: string
  left: string
  top: string
  position: string
  isLockScale: boolean
  [key: string]: any
}

const props = withDefaults(defineProps<Props>(), {
  el: 'body',
  isLockScale: true,
  parentProps: () => ({}),
  isActive: false,
  props: () => ({}),
})

const emit = defineEmits(['setActive', 'updatePosition'])

enum ResizeDirection {
  Top = 'top',
  Right = 'right',
  Bottom = 'bottom',
  Left = 'left',
  TopLeft = 'top-left',
  TopRight = 'top-right',
  BottomLeft = 'bottom-left',
  BottomRight = 'bottom-right',
}

interface OriginalPosition {
  left: number
  right: number
  top: number
  bottom: number
  HeightScale: number
}
const lineGap = 1 // px，距离越大，越容易检测到，需要调整的距离也大
const checkGapTime = 5 // ms，时间越短，越灵敏，越吃性能

interface Props {
  // 唯一id
  id: string | number
  // 容器 编辑容器相对大容器的定位范围
  el?: string
  // isLockScale 是否锁定缩放
  // isLockScale: boolean
  // 父级信息 如果嵌套使用edit-wrapper 定位需要加上父级的定位信息
  parentProps?: Partial<ComProps>
  // 选中
  isActive: boolean
  props: Partial<ComProps>
}
// 由外部主动注入的公共样式 受嵌套组件影响
const commonStyle = inject('commonStyle', {})
const currentCompStyles = reactive<{ values: currentCompStyleType | {} }>({
  values: {},
})
const editWrapper = ref<null | HTMLElement>(null)
const assistLineArr = reactive<{ values: threePointPropType[] }>({
  values: [],
})

let container: HTMLElement
onMounted(() => {
  container = document.querySelector(props.el) as HTMLElement
})

const store = useEditorStore()

const gap = {
  x: 0,
  y: 0,
}
const components = computed(() => store.components)
const clearAssistLine = () => {
  assistLineArr.values = []
}

const onItemClick = (id: string | number) => {
  if (!props.isActive) {
    emit('setActive', id)
  }
}

watch(
  props.props,
  v => (currentCompStyles.values = pick(v, ['position', 'top', 'left', 'width', 'height'])),
  {
    immediate: true,
  },
)

// 子元素的话需要再减去父盒子定位尺寸
const parentProps = computed(() => {
  return pick(props.parentProps, ['top', 'left'])
})

const caculateMovePosition = (e: MouseEvent) => {
  return {
    left: e.clientX - gap.x - container.offsetLeft - pxToNumberHandler.initialTransform(parentProps.value.left || '0'),
    top:
          e.clientY
          - gap.y
          - container.offsetTop
          + container.scrollTop
          - pxToNumberHandler.initialTransform(parentProps.value.top || '0'),
  }
}
let isMoving = false
const calculateSize = (direction: ResizeDirection, e: MouseEvent, position: OriginalPosition) => {
  // 鼠标位置
  const { clientX, clientY } = e
  const { left, top, right, bottom, HeightScale } = position

  const leftWidth = right - clientX
  const rightWidth = clientX - left
  const topHeight = bottom - clientY
  const bottomHeight = clientY - top

  const offsetLeft = clientX - container.offsetLeft - pxToNumberHandler.initialTransform(parentProps.value.left || '0')
  const offsetTop
        = clientY - container.offsetTop + container.scrollTop - pxToNumberHandler.initialTransform(parentProps.value.top || '0')
  // TODO: 待优化
  switch (direction) {
    case ResizeDirection.TopLeft:
      if (HeightScale) {
        return {
          width: leftWidth,
          height: leftWidth * HeightScale,
          left: offsetLeft,
          top: offsetTop - leftWidth * HeightScale + topHeight,
        }
      }
      return {
        width: leftWidth,
        height: topHeight,
        left: offsetLeft,
        top: offsetTop,
      }
    case ResizeDirection.TopRight:
      if (HeightScale) {
        return {
          width: rightWidth,
          height: rightWidth * HeightScale,
          top: offsetTop - rightWidth * HeightScale + topHeight,
        }
      }
      return {
        width: rightWidth,
        height: topHeight,
        top: offsetTop,
      }
    case ResizeDirection.BottomLeft:
      if (HeightScale) {
        return {
          width: leftWidth,
          left: offsetLeft,
          height: leftWidth * HeightScale,
        }
      }
      return {
        width: leftWidth,
        height: bottomHeight,
        left: offsetLeft,
      }
    case ResizeDirection.BottomRight:
      if (HeightScale) {
        return {
          width: rightWidth,
          height: rightWidth * HeightScale,
        }
      }
      return {
        width: rightWidth,
        height: bottomHeight,
      }
    case ResizeDirection.Top:
      return {
        top: offsetTop,
        height: topHeight,
      }
    case ResizeDirection.Left:
      return {
        width: leftWidth,
        left: offsetLeft,
      }
    case ResizeDirection.Right:
      return {
        width: rightWidth,
      }
    case ResizeDirection.Bottom:
      return {
        height: bottomHeight,
      }
    default:
      break
  }
}

// 移动
const startMove = (e: MouseEvent, id: string) => {
  onItemClick(id)

  const currentElement = editWrapper.value as HTMLElement
  if (currentElement) {
    const { left, top } = currentElement.getBoundingClientRect()
    gap.x = e.clientX - left
    gap.y = e.clientY - top
  }

  let getAssistLineDebouce: DebouncedFuncLeading<(...args: any[]) => any>

  const handleMove = (e: MouseEvent) => {
    const { left, top } = caculateMovePosition(e)
    isMoving = true
    if (currentElement) {
      currentElement.style.top = `${top}px`
      currentElement.style.left = `${left}px`
    }

    const target = e.target as HTMLElement
    getAssistLineDebouce = debounce(() => {
      assistLineArr.values = getAssistLineArr({
        components: components.value,
        currentComponentData: {
          id: props.id,
          left,
          top,
          width: target?.offsetWidth,
          height: target?.offsetHeight,
        },
        lineGap,
      })
      currentCompStyles.values = {
        ...currentCompStyles.values,
        top: currentElement.style.top,
        left: currentElement.style.left,
      }
    }, checkGapTime)

    getAssistLineDebouce()
  }
  // 移动的时候只改变 left, top
  const handleMouseUp = (e: MouseEvent) => {
    document.removeEventListener('mousemove', handleMove)
    if (isMoving) {
      // 鼠标放开 清空辅助线 取消生成辅助线数据方法执行
      getAssistLineDebouce.cancel()
      clearAssistLine()
      const { left, top } = caculateMovePosition(e)

      emit('updatePosition', { left, top, id: props.id })
      isMoving = false
    }
    nextTick(() => {
      document.removeEventListener('mouseup', handleMouseUp)
    })
  }
  document.addEventListener('mousemove', handleMove)
  document.addEventListener('mouseup', handleMouseUp)
}

// 改变宽高
const startResize = (direction: ResizeDirection) => {
  const currentElement = editWrapper.value as HTMLElement
  // 开始移动的元素位置
  const { left, top, bottom, right } = currentElement.getBoundingClientRect()

  const { width, height, isLockScale = true } = props.props
  const w = pxToNumberHandler.initialTransform(width || '0')
  const h = pxToNumberHandler.initialTransform(height || '0')
  const HeightScale = isLockScale ? +(h / w).toFixed(2) : 0

  let getAssistLineDebounce: DebouncedFuncLeading<(...args: any[]) => any>

  const handleMove = (e: MouseEvent) => {
    const size = calculateSize(direction, e, {
      left,
      top,
      bottom,
      right,
      HeightScale,
    })
    const { style } = currentElement

    if (size) {
      style.width = `${size.width}px`
      style.height = `${size.height}px`
      if (style.left) {
        style.left = `${size.left}px`
      }
      if (style.top) {
        style.top = `${size.top}px`
      }
    }

    getAssistLineDebounce = debounce(() => {
      const { left, top, width, height } = style
      assistLineArr.values = getAssistLineArr({
        components: store.components,
        currentComponentData: {
          id: props.id,
          left,
          top,
          width,
          height,
        },
        lineGap,
      })
      // position也需要一起更新的原因是辅助线渲染后会引起组件的更新，如果不更新组件位置就会回原位
      currentCompStyles.values = {
        ...currentCompStyles.values,
        left,
        top,
        width,
        height,
      }
    }, checkGapTime)
    getAssistLineDebounce()
  }
  // 修改大小
  const handleMouseUp = (e: MouseEvent) => {
    document.removeEventListener('mousemove', handleMove)
    // 鼠标放开 清空辅助线 取消生成辅助线数据方法执行
    getAssistLineDebounce && getAssistLineDebounce.cancel()
    clearAssistLine()
    const size = calculateSize(direction, e, {
      left,
      top,
      bottom,
      right,
      HeightScale,
    })
    emit('updatePosition', { ...size, id: props.id })
    nextTick(() => {
      document.removeEventListener('mouseup', handleMouseUp)
    })
  }
  document.addEventListener('mousemove', handleMove)
  document.addEventListener('mouseup', handleMouseUp)
}
</script>

<template>
  <div
    ref="editWrapper"
    :data-component-id="id"
    class="edit-wrapper"
    :class="{ active: isActive }"
    :style="{ ...commonStyle, ...currentCompStyles.values }"
    @mousedown.stop="(e) => startMove(e, id)"
    @click.stop="onItemClick(id)"
  >
    <slot />
    <div class="resizers">
      <div class="resizer top-left" @mousedown.stop="startResize(ResizeDirection.TopLeft)" />
      <div class="resizer top" @mousedown.stop="startResize(ResizeDirection.Top)" />
      <div class="resizer top-right" @mousedown.stop="startResize(ResizeDirection.TopRight)" />
      <div class="resizer right" @mousedown.stop="startResize(ResizeDirection.Right)" />
      <div class="resizer bottom-left" @mousedown.stop="startResize(ResizeDirection.BottomLeft)" />
      <div class="resizer bottom" @mousedown.stop="startResize(ResizeDirection.Bottom)" />
      <div class="resizer bottom-right" @mousedown.stop="startResize(ResizeDirection.BottomRight)" />
      <div class="resizer left" @mousedown.stop="startResize(ResizeDirection.Left)" />
    </div>
  </div>
  <div class="assist-lines">
    <div
      v-for="(line, index) in assistLineArr.values"
      :key="index"
      class="assist-item"
      :style="{
        top: `${line.top}px`,
        left: `${line.left}px`,
        width: `${line.width || 0}px`,
        height: `${line.height || 0}px`,
        borderTop: `${line.width ? 1 : 0}px solid rgb(255, 84, 72)`,
        borderLeft: `${line.height ? 1 : 0}px solid rgb(255, 84, 72)`,
      }"
    />
  </div>
</template>

<style lang="less">
.edit-wrapper {
  padding: 0px;
  cursor: pointer;
  border: 1px solid transparent;
  user-select: none;
  box-sizing: content-box !important;
  > * {
    position: static !important;
    width: 100% !important;
    height: 100% !important;
  }

  &:hover {
    border: 1px dashed #ccc;
  }
  // 被选中
  &.active {
    border: 1px solid #1890ff;
    user-select: none;
    z-index: 10;
    // 直接子级才显示
    > .resizers {
      display: block;
      position: absolute !important;
      left: 0;
      top: 0;
      width: 100% !important;
      height: 100% !important;
    }
    // 一旦被选中 子组件需要提高一个层级 否则选中不了子元素
    .edit-wrapper {
      z-index: 11;
    }
  }
}
.resizers {
  display: none;
  .resizer {
    position: absolute;
    border: 2px solid #1890ff;
    border-radius: 50%;
    width: 10px;
    height: 10px;
    background: #fff;
  }
  .top-left {
    left: -5px;
    top: -5px;
    cursor: nwse-resize;
  }
  .top {
    left: 50%;
    transform: translateX(-50%);
    top: -5px;
    cursor: n-resize;
  }
  .right {
    right: -5px;
    top: 50%;
    transform: translateY(-50%);
    cursor: e-resize;
  }
  .bottom {
    left: 50%;
    transform: translateX(-50%);
    bottom: -5px;
    cursor: s-resize;
  }

  .left {
    left: -5px;
    top: 50%;
    transform: translateY(-50%);
    cursor: w-resize;
  }

  .top-right {
    right: -5px;
    top: -5px;
    cursor: nesw-resize;
  }

  .bottom-left {
    left: -5px;
    bottom: -5px;
    cursor: nesw-resize;
  }
  .bottom-right {
    right: -5px;
    bottom: -5px;
    cursor: nwse-resize;
  }
}
.assist-lines {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 3;
  .assist-item {
    position: absolute;
  }
}
</style>
