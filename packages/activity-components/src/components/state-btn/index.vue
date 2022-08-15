<script lang="ts" setup>
import { computed, useAttrs } from 'vue'

import { pickStyle } from '@yq-editor/shared'
import { Props } from './props'
import { createComponent } from '@/utils/create'

const props = defineProps(Props)

const emit = defineEmits(['biz$HandleActionFn'])

const attrs = useAttrs()

const { componentName } = createComponent('state-btn')

// 当前配置
const currentConfig = computed(() => {
  return (
    props.stateConfig.find(item => `${props.text}` === `${item.key}`)
  )
})

const handleClick = (event: any) => {
  if (props.isEditing) {
    return console.log('%c [ 正在编辑中 ]-32-「index」', 'font-size:13px; background:pink; color:#bf2c9f;')
  }
  if (currentConfig.value) {
    const { actionConfig } = currentConfig.value
    emit('biz$HandleActionFn', { actionConfig, event })
  }
  else {
    console.info('未找到对应配置', currentConfig.value)
  }
}

const styleProps = computed(() => pickStyle(attrs))
</script>

<script lang="ts">
export default {
  name: 'ActStateBtn',
  inheritAttrs: false,
}
</script>

<template>
  <button
    :style="styleProps"
    :class="{
      gray: currentConfig?.isNeedGrayClass,
      [componentName]: true,
    }"
    :disabled="currentConfig?.disabled"
    @click="handleClick"
  >
    <img
      :draggable="false"
      :src="currentConfig?.imgSrc || currentImgSrc"
      :alt="currentConfig?.imgSrc || '当前按钮无图'"
    >
  </button>
</template>

<style lang="less">
.act-state-btn {
  border: none;
  outline: none;
  background-color: transparent;
  cursor: pointer;
  margin: 0;
  padding: 0;

  img:active {
    transform: scale(0.95, 0.95);
    transition: all 0.1s ease;
  }
  &.gray {
    filter: grayscale(100%);
    opacity: 0.9;
  }
  img {
    display: block;
    width: 100%;
    user-select: none;
  }
}
</style>
