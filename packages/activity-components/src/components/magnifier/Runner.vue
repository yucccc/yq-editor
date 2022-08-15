<!-- 转轮组件 -->
<script lang="ts">
import { defineComponent, reactive } from 'vue'
// import { defaultProps, stylePropsKey } from '@/components/commonProps'
import { createComponent } from '../../utils/create'

// import { onEmitter } from '@/directives/emitter'
import { defaultProps } from '../commonProps'
import { runnerProps } from './props'
const { create } = createComponent('magnifier')

const C = defineComponent({
  props: { ...runnerProps, ...defaultProps },
  emits: ['transitionend'],
  setup(props, { emit }) {
    const state = reactive({
      transform: 'translateX(0)',
      transition: '',
      index: 0,
      iconW: 0,
      unit: 'px',
    })
    const start = (num: number) => {
      if (num) {
        state.index = num
      }
      // const { giftImgs, iconWidth, minTurns, runningTime } = props
      const giftImgs = props.giftImgs
      const minTurns = props.minTurns
      const runningTime = props.runningTime
      const l = giftImgs.length * props.iconW * minTurns + props.iconW * num
      state.transform = `translateX(-${l}${props.unit})`
      state.transition = `all ease-out  ${runningTime}s`
    }

    const transitionend = () => {
      // const { iconWidth } = props
      state.transform = `translateX(-${props.iconW * state.index}${props.unit})`
      state.transition = ''
      emit('transitionend')
    }

    return { start, transitionend, state }
  },
})
export default create(C)
</script>

<template>
  <div style="display: inline-block; width: 100%">
    <div class="main" :style="{ height: `${iconW}${unit}` }">
      <div
        class="out"
        :style="{
          marginLeft: `-${iconW / 2}${unit}`,
          transform: state.transform,
          height: `${iconW}${unit}`,
          transition: state.transition,
        }"
        @transitionend="transitionend"
      >
        <ul
          v-for="(v, index) in minTurns + 3"
          :key="`${index}aa`"
          class="ulbox"
          :style="{
            width: `${giftImgs.length * iconW}${unit}`,
            left: `${giftImgs.length * iconW * (v - 2)}${unit}`,
          }"
        >
          <li v-for="(v, i) in giftImgs" :key="i">
            <img :style="{ width: `${iconW}${unit}` }" :src="v" alt="">
          </li>
        </ul>
      </div>
      <span class="line" :style="{ width: `2px` }" />
    </div>
    <!-- <button @click="startaa">start</button> -->
  </div>
</template>

<style lang="less" scoped>
//@import url(); 引入公共css类
.main {
  .out {
    width: 100%;
  }
  overflow: hidden;
  position: relative;
  .line {
    position: absolute;
    left: 50%;
    top: 0;
    height: 100%;
    background-color: #ffffff;
    box-shadow: 0 0 15px #fff;
  }
  .out {
    position: absolute;
    left: 50%;
  }
}
.ulbox {
  font-size: 0;
  position: absolute;
  top: 0;
  li {
    display: inline-block;
  }
}
</style>
