<script lang="ts" setup>
import type * as Css from 'csstype'
import { ref } from 'vue'
import { bgUrlToSrc } from '@yq-editor/shared'
import { srcToBgUrl } from '@/shared'
import type { ImageType } from '@/config/propsMap'
interface Props {
  value: Pick<Css.Properties, 'backgroundColor' | 'backgroundImage' | 'backgroundSize'>
}
const props = defineProps<Props>()
const emit = defineEmits(['change'])
const backgroundSizeList = [
  { value: 'auto auto', text: '默认值' },
  { value: 'contain', text: 'contain' },
  { value: 'cover', text: 'cover' },
]

const onChangeColor = (key: keyof Props['value'], value: string) => {
  emit('change', { key, value })
}
const onChangeBgImage = (key: keyof Props['value'], value: ImageType) => {
  emit('change', { key, value: srcToBgUrl(value.src) })
}

const onChangeSelect = (key: keyof Props['value'], value: string) => {
  emit('change', { key, value })
}
const activeKey = ref('backgroundColor')
</script>

<template>
  <a-tabs v-model:activeKey="activeKey" centered style="width: 100%" type="card">
    <a-tab-pane key="backgroundColor" tab="颜色">
      <ColorPicker :value="value.backgroundColor" @change="(v: string) => onChangeColor('backgroundColor', v)" />
    </a-tab-pane>
    <a-tab-pane key="backgroundImage" tab="图片">
      <image-processor
        :value="bgUrlToSrc(value.backgroundImage)"
        @change="(v: string) => onChangeBgImage('backgroundImage', v)"
      />
      <a-select
        class="component-box" style="width: 100%" :value="value.backgroundSize"
        @change="(v: string) => onChangeSelect('backgroundSize', v)"
      >
        <a-select-option v-for="item in backgroundSizeList" :key="item.value" :value="item.value">
          {{ item.text }}
        </a-select-option>
      </a-select>
    </a-tab-pane>
  </a-tabs>
</template>