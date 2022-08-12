<script lang="ts" setup>
import type { Properties } from 'csstype'
import { pxToNumberHandler } from '@/shared'

interface Props {
  value: {
    left: Properties['left']
    top: Properties['top']
  }
}
const props = defineProps<Props>()
const emit = defineEmits(['change'])
const onChange = (key: keyof Props['value'], value: number) => {
  emit('change', { key, value: pxToNumberHandler.afterTransform(value) })
}
</script>

<template>
  <div class="p-position-box">
    <a-input-number
      class="component-box"
      addon-before="x"
      :value="pxToNumberHandler.initialTransform(value.left)"
      @change="(v: number) => onChange('left', v)"
    />
    <a-input-number
      class="component-box"
      addon-before="y"
      :value="pxToNumberHandler.initialTransform(value.top)"
      @change="(v: number) => onChange('top', v)"
    />
  </div>
</template>

<style lang="less">
.p-position-box {
  display: flex;
  .component-box {
    flex: 1;
  }
  .component-box + .component-box {
    margin-left: 8px;
  }

}
</style>

