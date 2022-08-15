<script lang="ts" setup>
import { computed, reactive, ref, useAttrs } from 'vue'
import { pickStyle } from '@yq-editor/shared'
import BaseImage from '../base-image/index.vue'
import type { PlayParams } from './props'
import { Props } from './props'
import { __DEV__ } from '@/shared'

import { vEmitter } from '@/directives/emitter'
import { stringStyleToStyle } from '@/utils/helper'
import { createComponent } from '@/utils/create'

const props = defineProps(Props)
const { componentName } = createComponent('track')
const attrs = useAttrs()

const state = reactive<{ play: PlayParams }>({
  play: props.playParams,
})
// 从前后到前
if (props.direction === 'reverse' && props.playParams.number === 0) {
  state.play.number = props.subComponent.length - 1
}

const currentActive = ref(-1)

const isAnimation = ref(false)

const styleProps = computed(() => pickStyle(attrs))

const nineGame = (
  minTimes: number,
  stopIndex: number,
  callback: Function,
) => {
  let { number, speed } = state.play
  // 判断是否从头开始
  if (props.fromZero) { number = 0 }
  const lottery = (duration?: number) => {
    const durationTime = duration || speed
    setTimeout(() => {
      // 当前命中的
      currentActive.value = number
      if (minTimes <= 0 && stopIndex === number) {
        // 记忆停留位置
        state.play.number = number
        callback()
        return
      }
      else if (minTimes <= 5) {
        speed += 35
      }
      else if (minTimes > 5 && speed >= 50) {
        speed -= 15
      }
      if (props.direction === 'reverse') {
        number = number - 1
        if (number === -1) {
          number = props.subComponent.length - 1
        }
      }
      else {
        number = (number + 1) % props.subComponent.length
      }
      minTimes--
      lottery()
    }, durationTime)
  }
  lottery(0)
}
const start = (stopIndex: number | string) => {
  stopIndex = +stopIndex - 1
  if (stopIndex > props.subComponent.length - 1 || stopIndex < 0) {
    return console.error('停止参数错误', stopIndex)
  }
  if (isAnimation.value) {
    __DEV__ && console.log('%c [ 正在播放动画 ]-78-「index」', 'font-size:13px; background:pink; color:#bf2c9f;')
    return
  }
  isAnimation.value = true
  nineGame(props.circle * props.subComponent.length, stopIndex, () => {
    isAnimation.value = false
    if (typeof props.CALLBACK_END === 'function') {
      props.CALLBACK_END && props.CALLBACK_END()
    }
  })
}
</script>

<script lang="ts">
export default {
  name: 'ActTrack',
  inheritAttrs: false,
}
</script>

<template>
  <div :id="id" v-emitter:[`${id}-start`]="start" :class="componentName" :style="styleProps">
    <slot>
      <BaseImage
        v-for="(item, index) in subComponent" v-show="!isEditing || currentActive === index" :key="index"
        :class="`act-track-item-${index}` " :style="item" :src="item.src || activeImage"
      />
    </slot>
  </div>
</template>

<style lang="less">
.act-track {
  img {
    display: block;
    width: 100%;
    height: 100%;
  }
}

.el {
  width: 100px;
  height: 100px;
  background-color: aquamarine;
}
</style>
