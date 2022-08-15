<template>
  <div
    :data-component-id="id"
    @mousedown.stop="startMove"
    class="edit-wrapper"
    :class="[active ? 'active' : '']"
    ref="editWrapper"
    @click.stop="onItemClick(id)"
    :style="{ ...commonStyle, ...styles }"
  >
    <slot />

    <div class="resizers">
      <div
        class="resizer top-left"
        @mousedown.stop="startResize('top-left')"
      ></div>
      <div class="resizer top" @mousedown.stop="startResize('top')"></div>
      <div
        class="resizer top-right"
        @mousedown.stop="startResize('top-right')"
      ></div>
      <div class="resizer right" @mousedown.stop="startResize('right')"></div>
      <div
        class="resizer bottom-left"
        @mousedown.stop="startResize('bottom-left')"
      ></div>
      <div class="resizer bottom" @mousedown.stop="startResize('bottom')"></div>
      <div
        class="resizer bottom-right"
        @mousedown.stop="startResize('bottom-right')"
      ></div>
      <div class="resizer left" @mousedown.stop="startResize('left')"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, nextTick, computed, PropType, inject } from 'vue'
import { pick } from 'lodash-es'
export const pxToNumberHandler = {
  initialTransform: (v: string) => (v ? parseInt(v) : 0),
  afterTransform: (e: number | string) => (e ? `${e}px` : ''),
}
type ResizeDirection =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'top'
  | 'right'
  | 'bottom'
  | 'left'
interface OriginalPositions {
  left: number
  right: number
  top: number
  bottom: number
  Hscale: number
}
interface ComProps {
  width: string
  height: string
  isLockScale: boolean
  [key: string]: any
}

export default defineComponent({
  name: 'edit-wrapper',
  props: {
    id: {
      type: [String, Number],
      required: true,
    },
    /**
     * 父级信息 子级位置需要加上父级的定位信息
     */
    parentProps: {
      type: Object,
      default: () => ({}),
    },
    props: {
      type: Object as PropType<ComProps>,
      default: () => ({}),
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['set-active', 'update-position'],
  setup(props, context) {
    const editWrapper = ref<null | HTMLElement>(null)
    const onItemClick = (id: string | number) => {
      context.emit('set-active', id)
    }
    // 由外部主动注入的公共样式 受嵌套组件影响
    const commonStyle = inject('commonStyle', {})
    const styles = computed(() => {
      return pick(props.props, ['position', 'top', 'left', 'width', 'height'])
    })

    const gap = {
      x: 0,
      y: 0,
    }
    const caculateMovePosition = (e: MouseEvent) => {
      // 子元素的话需要再减去父盒子定位尺寸
      const parentProps = pick(props.parentProps, ['top', 'left'])

      const container = document.getElementById('canvas-area') as HTMLElement
      const left =
        e.clientX -
        gap.x -
        container.offsetLeft -
        pxToNumberHandler.initialTransform(parentProps.left)

      const top =
        e.clientY -
        gap.y -
        container.offsetTop +
        container.scrollTop -
        pxToNumberHandler.initialTransform(parentProps.top)
      return {
        left,
        top,
      }
    }
    let isMoving = false
    // 开始移动
    const startMove = (e: MouseEvent) => {
      const currentElement = editWrapper.value as HTMLElement
      if (currentElement) {
        const { left, top } = currentElement.getBoundingClientRect()
        gap.x = e.clientX - left
        gap.y = e.clientY - top
      }

      const handleMove = (e: MouseEvent) => {
        const { left, top } = caculateMovePosition(e)
        isMoving = true
        if (currentElement) {
          currentElement.style.top = top + 'px'
          currentElement.style.left = left + 'px'
        }
      }
      // 移动的时候只改变 left, top
      const handleMouseUp = (e: MouseEvent) => {
        document.removeEventListener('mousemove', handleMove)
        if (isMoving) {
          const { left, top } = caculateMovePosition(e)
          context.emit('update-position', { left, top, id: props.id })
          isMoving = false
        }
        nextTick(() => {
          document.removeEventListener('mouseup', handleMouseUp)
        })
      }
      document.addEventListener('mousemove', handleMove)
      document.addEventListener('mouseup', handleMouseUp)
    }
    const calculateSize = (
      direction: ResizeDirection,
      e: MouseEvent,
      positions: OriginalPositions
    ) => {
      // 鼠标位置
      const { clientX, clientY } = e
      // 画布
      const container = document.getElementById('canvas-area') as HTMLElement
      const { left, top, right, bottom, Hscale } = positions

      const leftWidth = right - clientX
      const rightWidth = clientX - left
      const topHeight = bottom - clientY
      const bottomHeight = clientY - top

      const offsetLeft = clientX - container.offsetLeft
      const offsetTop = clientY - container.offsetTop + container.scrollTop
      // TODO: 待优化
      switch (direction) {
        case 'top-left':
          if (Hscale) {
            return {
              width: leftWidth,
              height: leftWidth * Hscale,
              left: offsetLeft,
              top: offsetTop - leftWidth * Hscale + topHeight,
            }
          }
          return {
            width: leftWidth,
            height: topHeight,
            left: offsetLeft,
            top: offsetTop,
          }
        case 'top-right':
          if (Hscale) {
            return {
              width: rightWidth,
              height: rightWidth * Hscale,
              top: offsetTop - rightWidth * Hscale + topHeight,
            }
          }
          return {
            width: rightWidth,
            height: topHeight,
            top: offsetTop,
          }
        case 'bottom-left':
          if (Hscale) {
            return {
              width: leftWidth,
              left: offsetLeft,
              height: leftWidth * Hscale,
            }
          }
          return {
            width: leftWidth,
            height: bottomHeight,
            left: offsetLeft,
          }
        case 'bottom-right':
          if (Hscale) {
            return {
              width: rightWidth,
              height: rightWidth * Hscale,
            }
          }
          return {
            width: rightWidth,
            height: bottomHeight,
          }
        case 'top':
          return {
            top: offsetTop,
            height: topHeight,
          }
        case 'left':
          return {
            width: leftWidth,
            left: offsetLeft,
          }
        case 'right':
          return {
            width: rightWidth,
          }
        case 'bottom':
          return {
            height: bottomHeight,
          }
        default:
          break
      }
    }

    const startResize = (direction: ResizeDirection) => {
      const currentElement = editWrapper.value as HTMLElement
      // 开始移动的元素位置
      const { left, top, bottom, right } =
        currentElement.getBoundingClientRect()
      console.log(left, top, '===修改大小')

      const { width, height, isLockScale = true } = props.props
      const w = pxToNumberHandler.initialTransform(width)
      const h = pxToNumberHandler.initialTransform(height)
      const Hscale = isLockScale ? +(h / w).toFixed(2) : 0

      const handleMove = (e: MouseEvent) => {
        const size = calculateSize(direction, e, {
          left,
          top,
          bottom,
          right,
          Hscale,
        })
        const { style } = currentElement

        if (size) {
          style.width = size.width + 'px'
          style.height = size.height + 'px'
          if (style.left) {
            style.left = size.left + 'px'
          }
          if (style.top) {
            style.top = size.top + 'px'
          }
        }
      }
      // 修改大小
      const handleMouseUp = (e: MouseEvent) => {
        document.removeEventListener('mousemove', handleMove)
        const size = calculateSize(direction, e, {
          left,
          top,
          bottom,
          right,
          Hscale,
        })
        context.emit('update-position', { ...size, id: props.id })
        nextTick(() => {
          document.removeEventListener('mouseup', handleMouseUp)
        })
      }
      document.addEventListener('mousemove', handleMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return {
      startMove,
      onItemClick,
      styles,
      commonStyle,
      editWrapper,
      startResize,
    }
  },
})
</script>

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
    z-index: 1500;
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
      z-index: 1501;
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
</style>
