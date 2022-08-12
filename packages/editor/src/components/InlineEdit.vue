<script lang="ts">
import { computed, defineComponent, nextTick, ref, watch } from 'vue'
import useKeyPress from '@/hooks/useKeyPress'
export default defineComponent({
  name: 'InlineEdit',
  props: {
    value: {
      type: String,
      required: true,
    },
  },
  emits: ['change'],
  setup(props, context) {
    const innerValue = ref(props.value)
    watch(
      () => props.value,
      (newValue) => {
        innerValue.value = newValue
      },
    )
    const wrapper = ref<null | HTMLElement>(null)
    const inputRef = ref<null | HTMLInputElement>(null)
    let cachedOldValue = ''
    const isEditing = ref(false)
    const handleClick = () => {
      isEditing.value = true
    }
    const validateCheck = computed(() => innerValue.value.trim() !== '')
    watch(isEditing, async (isEditing) => {
      if (isEditing) {
        cachedOldValue = innerValue.value
        await nextTick()
        if (inputRef.value) {
          inputRef.value.focus()
        }
      }
    })

    useKeyPress('Enter', () => {
      if (!validateCheck.value) {
        return
      }
      if (isEditing.value) {
        isEditing.value = false
        context.emit('change', innerValue.value)
      }
    })

    useKeyPress('Escape', () => {
      if (isEditing.value) {
        isEditing.value = false
        innerValue.value = cachedOldValue
      }
    })

    const onBlur = () => {
      isEditing.value = false
      if (innerValue.value === '') {
        innerValue.value = '未命名图层'
      }
    }

    return {
      onBlur,
      handleClick,
      innerValue,
      isEditing,
      wrapper,
      inputRef,
      validateCheck,
    }
  },
})
</script>

<template>
  <div ref="wrapper" class="inline-edit" @dblclick.stop="handleClick">
    <input
      v-if="isEditing"
      ref="inputRef"
      v-model="innerValue"
      placeholder="文本不能为空"
      :class="{ 'input-error': !validateCheck }"
      class="ant-input"
      @blur="onBlur"
    >

    <span v-else>{{ innerValue }}</span>
  </div>
</template>

<style lang="less" scoped>
.inline-edit {
  cursor: pointer;
}
.ant-input.input-error {
  border: 1px solid #f5222d;
}
.ant-input.input-error:focus {
  border-color: #f5222d;
}
.ant-input.input-error::placeholder {
  color: #f5222d;
}
</style>
