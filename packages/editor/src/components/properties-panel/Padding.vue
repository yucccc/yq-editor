<script lang="ts" setup>
import type { Properties } from 'csstype'
import { pxToNumberHandler } from '@/shared'
interface Props {
  value: {
    paddingLeft: Properties['paddingLeft']
    paddingRight: Properties['paddingRight']
    paddingTop: Properties['paddingTop']
    paddingBottom: Properties['paddingBottom']
  }
}
const props = defineProps<Props>()
const emit = defineEmits(['change'])
const onChange = (key: keyof Props['value'], value: number) => {
  emit('change', { key, value: pxToNumberHandler.afterTransform(value) })
}
</script>

<template>
  <div class="p-padding-box">
    <a-input-number
      class="component-box  top"
      :value="pxToNumberHandler.initialTransform(value.paddingTop)"
      @change="(v: number) => onChange('paddingTop', v)"
    />
    <div class="center  mb-10px">
      <a-input-number
        class="component-box "
        :value="pxToNumberHandler.initialTransform(value.paddingLeft)"
        @change="(v: number) => onChange('paddingLeft', v)"
      />
      <a-input-number
        class="component-box"
        :value="pxToNumberHandler.initialTransform(value.paddingRight)"
        @change="(v: number) => onChange('paddingRight', v)"
      />
    </div>
    <a-input-number
      class="component-box bottom"
      :value="pxToNumberHandler.initialTransform(value.paddingBottom)"
      @change="(v: number) => onChange('paddingBottom', v)"
    />
  </div>
</template>

<style lang="less">
// 样式随便写的
.p-padding-box {
  .component-box {
    display: block;
    &.top {
        margin:0  auto 10px;
    }
    &.bottom {
         margin: 0 auto;
    }
  }
  .center {
        display: flex;
         .component-box {
            flex: 1;
        }
    }
  .component-box + .component-box {
    margin-left: 8px;
  }

}
</style>

