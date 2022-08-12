<script lang="ts" setup>
import type { PropType } from 'vue'
import { computed } from 'vue'
import type { LayerCommitType } from './layer-set-props'
import DynamicFormVue from '@/components/DynamicForm.vue'
import { useEditorStore } from '@/store/editor'
defineProps({
  value: {
    type: Object as PropType<LayerCommitType>,
    default: () => ({
      status: 'toggle',
      nextStep: { type: '' },
    }),
  },
  // 弹窗显示的时候需要刷新下 bug
  modalVisible: Boolean,
})
const emit = defineEmits(['submit', 'cancel'])
const store = useEditorStore()
const components = computed(() => store.components)

const formConfig = {
  actionCid: {
    label: '组件名称',
    component: 'a-select',
    subComponent: 'a-select-option',
    subComponentOptions: components.value.map(item => ({
      value: item.id,
      text: item.layerName,
    })),
  },
  status: {
    label: '切换状态',
    component: 'a-select',
    subComponent: 'a-select-option',
    subComponentOptions: [{
      value: 'show',
      text: '显示',
    }, {
      value: 'hide',
      text: '隐藏',
    },
    {
      value: 'toggle',
      text: '切换',
    },
    ],
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
      },
    },
  },
}
const onSubmit = (value: LayerCommitType) => {
  emit('submit', value)
}
const onCancel = () => {
  emit('cancel')
}
</script>

<template>
  <DynamicFormVue :form-item-config="formConfig" :value="value" @submit="onSubmit" @cancel="onCancel" />
</template>
