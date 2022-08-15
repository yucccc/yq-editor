<script lang="ts" setup>
import { computed, reactive, useAttrs } from 'vue'
import { isFunction, isString } from 'lodash-es'
import { pickStyle } from '@yq-editor/shared'
import { Props } from './props'
import { createComponent } from '@/utils/create'
import { vEmitter } from '@/directives/emitter'
import { stringStyleToStyle } from '@/utils/helper'
const props = defineProps(Props)
const { create } = createComponent('turntable')
const attrs = useAttrs()

const styleProps = computed(() => pickStyle(attrs))
const state = reactive({
  stop: false,
  angleSpeed: 0,
  angle: 0,
})

const pointerClass = (): Record<string, unknown> => {
  const ary: {
    key: string
    value: 'pointerWidth' | 'pointerLeft' | 'pointerTop'
  }[] = [
    { key: 'width', value: 'pointerWidth' },
    { key: 'left', value: 'pointerLeft' },
    { key: 'top', value: 'pointerTop' },
  ]

  const obj: { [key: string]: string } = {}
  ary.map((t) => {
    if (props[t.value]) {
      const key = t.key as string
      // @ts-expect-error 错误原因xxxxx
      obj[key] = props[t.value]
    }
  })
  if (isString(props.pointerStyle)) {
    return { ...obj, ...stringStyleToStyle(props.pointerStyle) }
  }
  else {
    const style = props.pointerStyle as Object
    return { ...obj, ...style }
  }
}

const start = (index: number) => {
  if (state.stop) { return }
  state.stop = true
  const num = props.num
  // 刻度
  const scale = 360 / props.num

  // 要偏转的角度
  if (props.isPointerRotate - 0) {
    state.angle
          = props.direction - 0 === 0
        ? num * 360 + index * scale
        : 0 - (num * 360 - index * scale)
  }
  else {
    state.angle
          = props.direction - 0 === 0
        ? num * 360 - index * scale
        : 0 - (num * 360 + index * scale)
  }
  state.angleSpeed = 3000
}

const finnalAngle = () => {
  return state.angle % 360
}

const transitionend = () => {
  state.angleSpeed = 0
  state.stop = false
  state.angle = finnalAngle()
  if (props.CALLBACK && isFunction(props.CALLBACK)) {
    props.CALLBACK()
  }
}
</script>

<script lang="ts">
export default {
  name: 'ActTurntable',
  inheritAttrs: false,
}
</script>

<template>
  <div v-emitter:[`${id}-start`]="start" class="corona" :style="styleProps">
    <img
      v-if="coronaImg"
      :src="coronaImg"
      :draggable="false"
      :style="
        isPointerRotate
          ? ''
          : {
            transform: `rotate(${state.angle}deg) `,
            transition: `all cubic-bezier(0.38, 0.77, 0.54, 0.99) ${state.angleSpeed}ms`,
          }
      "
      class="corona-bg"
      @transitionend="transitionend"
    >
    <img
      :src="pointerImg"
      :draggable="false"
      :style="
        isPointerRotate
          ? {
            transform: `rotate(${state.angle}deg) translate(-50%, -50%)`,
            transition: `all cubic-bezier(0.38, 0.77, 0.54, 0.99) ${state.angleSpeed}ms`,
            ...pointerClass(),
          }
          : { ...pointerClass() }
      "
      class="pointer"
      @transitionend="transitionend"
    >
  </div>
</template>

<style lang="less" scoped>
.corona {
  width: 100%;
  overflow: hidden;
  position: relative;
  .corona-bg {
    width: 100%;
    display: block;
  }
  .pointer {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transform-origin: top left;
  }
}
</style>
