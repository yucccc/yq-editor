<script lang="ts">
import { reactive } from 'vue'
import type { PropType } from 'vue'
import type { UrlCommitType } from '@yq-editor/global-types'
import DynamicForm from '@/components/DynamicForm.vue'
const openTypeArr: { value: string; text: string }[] = [
  {
    value: '_self',
    text: '原页面',
  },
  {
    value: '_blank',
    text: '新页面',
  },
  {
    value: 'phone',
    text: '手机拨号',
  },
  {
    value: 'mail',
    text: '邮箱跳转',
  },
]

const urlConfig = {
  to: { label: '跳转地址' },
  target: {
    label: '何处打开',
    component: 'a-select',
    subComponent: 'a-select-option',
    subComponentOptions: openTypeArr,
  },
}

export default {
  name: 'UrlSet',
  components: {
    DynamicForm,
  },
  props: {
    value: {
      type: Object as PropType<UrlCommitType>,
      default: () => ({}),
    },
  },
  emits: ['submit', 'cancel'],
  setup(props: any, ctx: any) {
    const formValue = reactive({
      ...props.value,
    })
    if (!formValue.target) {
      formValue.target = '_self'
    }
    const onSubmit = (value: UrlCommitType) => {
      ctx.emit('submit', value)
    }
    const onCancel = () => {
      ctx.emit('cancel')
    }

    return {
      formValue,
      onCancel,
      onSubmit,
      urlConfig,
    }
  },
}
</script>

<template>
  <DynamicForm
    :form-item-config="urlConfig"
    :value="formValue"
    @submit="onSubmit"
    @cancel="onCancel"
  />
</template>

<style scoped></style>
