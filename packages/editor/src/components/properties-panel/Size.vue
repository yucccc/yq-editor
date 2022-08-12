<script lang="ts" setup>
import type { Properties } from 'csstype'
import { pxToNumberHandler } from '@/shared'

interface Props {
  value: {
    width: Properties['width']
    height: Properties['height']
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
      addon-before="宽"
      :value="pxToNumberHandler.initialTransform(value.width)"
      @change="(v: number) => onChange('width', v)"
    />
    <a-input-number
      class="component-box"
      addon-before="高"
      :value="pxToNumberHandler.initialTransform(value.height)"
      @change="(v: number) => onChange('height', v)"
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

