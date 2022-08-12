<script lang="ts" setup>
// import { cid } from '@/common/global'
import { computed, useAttrs } from 'vue'
import { pickStyle } from '@yq-editor/shared'
interface Props {
  // 是否正在编辑中 用于区分一些场景 默认false
  isEditing?: boolean
  // 组件的唯一id
  cid?: string | number
  src: string
  alt?: string
}
withDefaults(defineProps<Props>(), {
  alt: 'Image loading failed',
})
const attrs = useAttrs()
const styles = computed(() => pickStyle(attrs))
</script>

<script lang="ts">
export default {
  name: 'YImage',
}
</script>

<template>
  <!--  在编辑状态下总是显示 -->
  <img
    v-if="isEditing ? true : src"
    class="y-image-component"
    :style="styles"
    :src="src"
    :alt="alt "
    :draggable="false"
  >
</template>

<style lang="less">
.y-image-component {
  max-width: 100%;
  display: block;
}
</style>
