<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Sketch } from '@ckpack/vue-color'
import { vOnClickOutside } from '@vueuse/components'

const props = withDefaults(defineProps<{ value?: string }>(), {
  value: 'initial',
})
const emit = defineEmits<{
  (e: 'change', color: string): void
}>()

const wrapper = ref<null | HTMLElement>(null)

const state = reactive<{
  showColor: boolean
}>({
  showColor: false,
})

const modelValueFn = (color: { hex: string }) => {
  emit('change', color.hex)
}

const showColorFn = () => {
  state.showColor = true
}
const hideColorFn = () => {
  if (state.showColor) {
    state.showColor = false
  }
}
</script>

<template>
  <div ref="wrapper" class="color-picker">
    <button
      class="native-color-container"
      :style="{ backgroundColor: value }"
      @click="showColorFn"
    />

    <div v-if="state.showColor" v-on-click-outside="hideColorFn" class="Sketch">
      <Sketch
        :model-value="value"
        @update:model-value="modelValueFn"
      />
      <a-button style="width: 100%" @click="modelValueFn({ hex: 'initial' })">
        清除
      </a-button>
    </div>
  </div>
</template>

<style>
.native-color-container {
  width: 100%;
  height: 30px;
  border: 1px solid #cccccc;
}
.Sketch {
  position: fixed;
  right: 300px;
  top: 40%;
}
</style>
