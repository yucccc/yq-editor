<!--
  *
  * 公用组件：扭蛋动画
  *
  * 必传
  * {[]} eggImgAry             小球图片url数组[x,x,x,x,x],最多10个球
  * {() => void} start()             start：调起动画
  * {() => void} CALLBACK            结束回调
  *
  * (注:大盒子宽高需一样)
  *
-->

<script lang="ts">
import { computed, defineComponent, reactive, watch } from 'vue'
import { pickStyle } from '@yq-editor/shared'
import { isFunction } from 'lodash-es'
import { createComponent } from '@/utils/create'
import useComponentCommon from '@/hooks/use-component-common'
import { defaultProps, stylePropsKey } from '@/components/commonProps'
import { onEmitter } from '@/directives/emitter'
import { stringStyleToStyle } from '@/utils/helper'
const { create } = createComponent('egg')

const C = defineComponent({
  directives: {
    onEmitter,
  },
  inheritAttrs: false,
  props: {
    ...defaultProps,
    // eggImgAry: {
    //   default: [],
    //   type: Array,
    // },
    eggImgAry: {
      type: Array,
      required: true,
    },
    CALLBACK: { type: [Object, Function] },
  },
  setup(props, ctx) {
    const styleProps = computed(() => pickStyle(ctx.attrs))

    const state = reactive({
      wieyiClass: false,
    })

    const start = () => {
      state.wieyiClass = true
      setTimeout(() => {
        state.wieyiClass = false
      }, 1100)
      setTimeout(() => {
        if (isFunction(props.CALLBACK)) {
          props.CALLBACK()
        }
      }, 3000)
    }

    const styleJudge = (i: number) => {
      let context = `left:${13 * (i + 1)}%;bottom:4%;transform: rotate(${
        35 * (i + 1)
      }deg);`
      if (i == 0 || i == 4) {
        context = `left:${
          (!i ? 10 : 14) * (i + 1)
        }%;bottom:16%;transform: rotate(${35 * (i + 1)}deg);`
      }
      if (i > 4) {
        const j = props.eggImgAry.length - i - 1
        if (j == 0 || j == 4) {
          context = `left:${
            (!j ? 12 : 13) * (j + 1)
          }%;bottom:32%;transform: rotate(${45 * (j + 1)}deg);`
        }
        else {
          context = `left:${14 * (j + 1)}%;bottom:24%;transform: rotate(${
            45 * (j + 1)
          }deg);`
        }
      }
      return context
    }

    watch(
      () => props,
      (nv) => {
        props = { ...nv }
      },
    )

    return {
      state,
      start,
      styleJudge,
      stringStyleToStyle,
      styleProps,
    }
  },
})

export default create(C)
</script>

<template>
  <ul v-onEmitter:[`${id}-start`]="start" class="turn_egg" :style="styleProps">
    <li
      v-for="(t, i) in eggImgAry"
      :key="i"
      :class="`turn_li diaol_${i + 1} ${
        state.wieyiClass ? `wieyi_${i + 1}` : ''
      }`"
      :style="styleJudge(i)"
    >
      <img :src="t" :draggable="false" alt="">
    </li>
  </ul>
</template>

<style lang="less" scoped>
@import './index.less';

.turn_egg {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  margin: auto;
  overflow: hidden;
  border-radius: 50%;
  padding: 0;
  img {
    width: 100%;
    height: auto;
  }
}

.turn_li {
  width: calc(20%);
  display: inline-block;
  border-radius: 50%;
  overflow: hidden;
  position: absolute;
  z-index: 1;

  &:nth-child(3) {
    z-index: 2;
  }

  &:last-child {
    z-index: 0;
  }
}
</style>
