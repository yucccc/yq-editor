<script lang="ts" setup>
import type { PropType } from 'vue'
import { computed, defineComponent, withDefaults } from 'vue'
import type { ComponentCommitType, FormConfig } from '@yq-editor/global-types'
import DynamicForm from '@/components/DynamicForm.vue'
import { useEditorStore } from '@/store/editor'
interface Props {
  value: ComponentCommitType
}

const props = withDefaults(defineProps<Props>(), {
  value: () => ({
    id: '',
    eventName: '',
    // 传递给组件的参数
    sourceDataKey: '',
    // 自定义数据源
    sourceDataSf: '',
    // 执行回调
    callback: {
      type: '',
    },
  }),
})
const emit = defineEmits(['submit', 'cancel'])

const store = useEditorStore()
const components = computed(() => store.components)
const componentFormConfig: { [key in keyof ComponentCommitType]: FormConfig } = {
  id: {
    label: '组件名称',
    component: 'a-select',
    subComponent: 'a-select-option',
    subComponentOptions: components.value.map(item => ({
      value: item.id,
      text: item.layerName,
    })),
    formItemProps: {
      required: true,
    },
  },
  eventName: {
    label: '事件名称',
    formItemProps: {
      required: true,
    },
  },
  sourceDataKey: {
    label: '数据源',
    component: 'source-key',
  },
  sourceDataSf: {
    label: '自定义数据',
    component: 'monaco',
    tips: '某些情况下 你可能需要使用一些自定义的数据源 但是我们建议你模拟一次请求后再使用选择数据源 这样更准确',
    componentProps: {
    },
  },
  callback: {
    label: '执行回调',
    component: 'modal-button',
    componentProps: {
      btnProps: {
        slot: '设置交互',
      },
      modalProps: {
        slot: 'action-set',
        isComponent: true,
        componentsProps: { hasDataFlow: false },
      },
    },
  },
}

const onSubmit = (value: ComponentCommitType) => {
  emit('submit', value)
}
const onCancel = () => {
  emit('cancel')
}
</script>

<template>
  <DynamicForm :form-item-config="componentFormConfig" :value="value" @submit="onSubmit" @cancel="onCancel" />
</template>

<style lang="less" scoped></style>
