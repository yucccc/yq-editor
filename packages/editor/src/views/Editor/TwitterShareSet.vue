<script lang="ts">
import type { PropType } from 'vue'
import { computed, reactive } from 'vue'
import type { twitterShareCommitType } from '@yq-editor/global-types'
import DynamicForm from '@/components/DynamicForm.vue'
import { useEditorStore } from '@/store/editor'

const openTypeArr: { value: string; text: string }[] = [
  {
    value: '_self',
    text: '原页面',
  },
  {
    value: '_blank',
    text: '新页面',
  },
]

const urlConfig = {
  url: { label: 'url' },
  text: { label: 'text' },
  hashtags: {
    label: 'hashtags',
    props: {
      placeholder: '标签,多个标签中间用英文逗号隔开。如good,excellent,super',
    },
  },
  via: { label: 'via' },
  target: {
    label: '何处打开',
    component: 'a-select',
    subComponent: 'a-select-option',
    subComponentOptions: openTypeArr,
  },
  nextStep: {
    label: '下一步',
    component: 'modal-button',
    props: {
      btnProps: {
        slot: '设置交互',
      },
      modalProps: {
        slot: 'action-set',
        isComponent: true,
        componentsProps: { hasDataFlow: true },
      },
    },
  },
}

export default {
  name: 'TwitterShareSet',
  components: {
    DynamicForm,
  },
  props: {
    value: {
      type: Object as PropType<twitterShareCommitType>,
      default: () => ({}),
    },
  },
  emits: ['submit', 'cancel'],
  setup(props: any, ctx: any) {
    const store = useEditorStore()
    const preSetting = computed(() => store.preSetting)
    const formValue = reactive({
      ...props.value,
    })

    if (!formValue.url) { formValue.url = `${preSetting.value.cdnUrl}/osstest/${preSetting.value.workId}-${preSetting.value.uuid}/` }

    if (!formValue.target) {
      formValue.target = '_blank'
    }
    const onSubmit = (value: twitterShareCommitType) => {
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
  <DynamicForm :form-item-config="urlConfig" :value="formValue" @submit="onSubmit" @cancel="onCancel" />
</template>

<style scoped></style>
