<script lang="ts" setup>
import { pickStyle } from '@yq-editor/shared'
import { computed, useAttrs, useSlots, withDefaults } from 'vue'
// import type { CommonProps } from '../../common/commonProps'

interface Props {
  text?: string
  // 是否正在编辑中 用于区分一些场景 默认false
  isEditing?: boolean
  // 组件的唯一idt
  cid: string | number
}

withDefaults(defineProps<Props>(), {})

const attrs = useAttrs()
const styles = computed(() => pickStyle(attrs))
</script>

<script lang="ts">
export default {
  name: 'YButton',
}
</script>

<template>
  <button :style="styles" class="y-button-component">
    {{ text }}
  </button>
</template>

<style lang="less">
.y-button-component {
  cursor: pointer;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>