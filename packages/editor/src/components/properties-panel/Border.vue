<script lang="ts" setup>
import type { Properties } from 'csstype'
import { computed } from 'vue'
import { pxToNumberHandler } from '@/shared'

interface Props {
  value: {
    borderStyle: Properties['borderStyle']
    borderWidth: Properties['borderStyle']
    borderColor: Properties['borderStyle']
    borderRadius: Properties['borderRadius']
  }
}
const props = defineProps<Props>()
const emit = defineEmits(['change'])

const onChange = (key: keyof Props['value'], value: number) => {
  emit('change', { key, value: pxToNumberHandler.afterTransform(value) })
}
const onChangeSelect = (key: keyof Props['value'], value: string) => {
  emit('change', { key, value })
}
const onChangeString = (key: keyof Props['value'], value: string) => {
  emit('change', { key, value })
}
const onChangeSlider = (key: keyof Props['value'], value: number) => {
  emit('change', { key, value: pxToNumberHandler.afterTransform(value) })
}

const borderOptions = [
  { value: 'none', text: '无' },
  { value: 'solid', text: '实线' },
  { value: 'dashed', text: '破折线' },
  { value: 'dotted', text: '点状线' },
]
const formatter = (v: number) => `${v} px`
</script>

<template>
  <div class="p-border-box">
    <a-select
      class="component-box"
      style="width: 100%"
      :value="value.borderStyle"
      @change="(v: string) => onChangeSelect('borderStyle', v)"
    >
      <a-select-option v-for="item in borderOptions" :key="item.value" :value="item.value">
        {{ item.text }}
      </a-select-option>
    </a-select>

    <a-input-number
      style="width: 100%"
      :formatter="formatter"
      class="component-box"
      :value="pxToNumberHandler.initialTransform(value.borderWidth)"
      @change="(v: number) => onChange('borderWidth', v)"
    />

    <ColorPicker
      :value="value.borderColor"
      @change="(v: string) => onChangeString('borderColor', v)"
    />
    <a-slider
      :min="0"
      :max="200"
      :value="value.borderRadius"
      @change="(v: number) => onChangeSlider('borderRadius', v)"
    />
  </div>
</template>

<style lang="less">
.p-border-box {
    .component-box {
        display: block;
    }
      .component-box {
    margin-bottom: 5px;
  }
}
</style>

