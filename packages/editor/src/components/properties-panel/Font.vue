<script lang="tsx" setup>
import type { VNode } from 'vue'
import { withDefaults } from 'vue'
import type { Properties } from 'csstype'
import { pxToNumberHandler, toString } from '@/shared'
import RenderVnode from '@/components/RenderVnode'
const props = defineProps<Props>()
const emit = defineEmits(['change'])
interface Props {
  value: {
    text: string
    lineHeight: Properties<number>['lineHeight']
    color: Properties['color']
    fontSize: Properties['fontSize']
    textAlign: Properties['textAlign']
    fontFamily: Properties['fontFamily']
  }
}
const textAlignOptions = [
  { value: 'left', text: '左' },
  { value: 'center', text: '居中' },
  { value: 'right', text: '右' },
]

const fontFamilyArr = [
  { text: '宋体', value: '"SimSun","STSong"' },
  { text: '黑体', value: '"SimHei","STHeiti"' },
  { text: '楷体', value: '"KaiTi","STKaiti"' },
  { text: '仿宋', value: '"FangSong","STFangsong"' },
]
const fontFamilyOptions = fontFamilyArr.map((font) => {
  return {
    value: font.value,
    text: (
      <span style={{ fontFamily: font.value }}>{font.text}</span>
    ) as VNode,
  }
})
const allFontFamilyOptions = [
  { value: 'initial', text: '默认' },
  ...fontFamilyOptions,
]

const onChange = (key: keyof Props['value'], value: InputEvent) => {
  //  俺不知道target类型是啥
  emit('change', { key, value: value.target?.value })
}

const onChangeNumber = (key: keyof Props['value'], value: number) => {
  emit('change', { key, value: pxToNumberHandler.afterTransform(value) })
}
const onChangeString = (key: keyof Props['value'], value: string) => {
  emit('change', { key, value })
}
const onChangeSelect = (key: keyof Props['value'], value: string) => {
  emit('change', { key, value })
}
const onChangeSlider = (key: keyof Props['value'], value: number) => {
  emit('change', { key, value })
}
const onRadioGroup = (key: keyof Props['value'], value: Event) => {
  emit('change', { key, value: value.target?.value })
}
</script>

<template>
  <div class="p-font-box">
    <a-select
      class="component-box"
      style="width: 100%"
      :value="value.fontFamily"
      @change="(v: string) => onChangeSelect('fontFamily', v)"
    >
      <a-select-option v-for="font in allFontFamilyOptions" :key="font.value" :value="font.value">
        <RenderVnode :node="font.text" />
      </a-select-option>
    </a-select>
    <a-textarea
      :rows="2"
      class="component-box"
      :value="toString(value.text)"
      @change="(v: InputEvent) => onChange('text', v)"
    />
    <a-input-number
      style="width: 100%"
      class="component-box"
      :value="pxToNumberHandler.initialTransform(value.fontSize)"
      :formatter="value => `${value} px`"
      @change="(v: number) => onChangeNumber('fontSize', v)"
    />
    <a-radio-group
      class="component-box p-radio-group"
      style="width: 100%"
      :value="value.textAlign"
      @change="(v) => onRadioGroup('textAlign', v)"
    >
      <a-radio-button v-for="font in textAlignOptions" :key="font.value" :value="font.value">
        <RenderVnode :node="font.text" />
      </a-radio-button>
    </a-radio-group>
    <ColorPicker
      :value="value.color"
      @change="(v: string) => onChangeString('color', v)"
    />
  </div>
</template>

<style lang="less">
.p-font-box {

  .component-box {
    margin-bottom: 5px;
  }
  .p-radio-group {
    text-align: center;
  }

}
</style>

