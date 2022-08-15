<script lang="ts">
import { defineComponent, reactive, ref, watch } from 'vue'
import { createComponent } from '../../utils/create'
import Runner from './Runner.vue'
import { runnerProps } from './props'
import { defaultProps, stylePropsKey } from '@/components/commonProps'
import { onEmitter } from '@/directives/emitter'
import useComponentCommon from '@/hooks/use-component-common'
import { string2numAndUnit } from '@/utils/pxCheck'

const { create, componentName } = createComponent('magnifier')
const C = defineComponent({
  components: { Runner },
  directives: {
    onEmitter,
  },
  inheritAttrs: false,
  props: { ...runnerProps, ...defaultProps },
  setup(props, ctx) {
    const styleProps = useComponentCommon(ctx.attrs)
    const runner = ref()
    const runner2 = ref()
    const start = (num: number) => {
      runner.value.start(num)
      runner2.value.start(num)
    }
    const transitionend = () => {
      if (typeof props.CALLBACK === 'function') {
        props.CALLBACK && props.CALLBACK()
      }
    }

    const state = reactive({
      iconW: 0,
      unit: 'px',
    })

    watch(
      () => props.iconWidth,
      (nv) => {
        console.log(nv)
        state.iconW = string2numAndUnit(nv.toString())[0]
        state.unit = string2numAndUnit(nv.toString())[1]
      },
    )
    state.iconW = string2numAndUnit(props.iconWidth.toString())[0]
    state.unit = string2numAndUnit(props.iconWidth.toString())[1]

    return {
      state,
      start,
      transitionend,
      styleProps,
      componentName,
      runner,
      runner2,
    }
  },
})
export default create(C)
</script>

<template>
  <div
    :id="id"
    v-onEmitter:[`${id}-start`]="start" class="magnifier-box"
    :class="[componentName]"
    :style="styleProps"
  >
    <Runner
      ref="runner"
      :gift-imgs="giftImgs"
      :icon-w="state.iconW"
      :unit="state.unit"
      :min-turns="minTurns"
      :running-time="runningTime"
      @transitionend="transitionend"
    />
    <div
      class="scale"
      :style="{
        transform: `scale(${scale})`,
        width: `${state.iconW * 1.2 * scale}${state.unit}`,
        height: `${state.iconW * 1.2 * scale}${state.unit}`,
      }"
    >
      <Runner
        ref="runner2"
        :gift-imgs="giftImgs"
        :icon-w="state.iconW"
        :unit="state.unit"
        :min-turns="minTurns"
        :running-time="runningTime"
      />
    </div>
  </div>
</template>

<style lang="less">
.magnifier-box {
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  .scale {
    max-width: 40%;
    height: 280px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    overflow: hidden;
    position: absolute;
  }
}
</style>
