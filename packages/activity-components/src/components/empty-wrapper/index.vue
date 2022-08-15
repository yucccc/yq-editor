<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'EmptyWrapper',
  props: {
    id: {
      type: [String, Number],
    },
    /**
     * 父级信息 子级位置需要加上父级的定位信息
     */
    parentProps: {
      type: Object,
      default: () => ({}),
    },
    // 子id 如果是子项目的话需要传递
    subId: {
      type: [String, Number],
    },
    props: {
      type: Object,
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
})
</script>

<template>
  <!-- 空渲染 -->
  <slot />
</template>
