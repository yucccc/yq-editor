<script lang="ts" setup>
import { computed, useAttrs, withDefaults } from 'vue'
// import type { CommonProps } from '../../common/commonProps'
import { pickStyle } from '@yq-editor/shared'
interface Props {
  tag?: string
  text?: string
  // 是否正在编辑中 用于区分一些场景 默认false
  isEditing?: boolean
  // 组件的唯一id
  cid: string | number
}

withDefaults(defineProps<Props>(), {
  tag: 'div',
})
const attrs = useAttrs()
const styles = computed(() => pickStyle(attrs))
</script>

<script lang="ts">
export default {
  name: 'YText',
}
</script>

<template>
  <component :is="tag" :style="styles" class="y-text-component">
    {{ text }}
  </component>
</template>

<style lang="less">
.y-text-component {
  box-sizing: border-box;
  white-space: pre-wrap;
  margin: 0;
  padding: 0;
}
</style>