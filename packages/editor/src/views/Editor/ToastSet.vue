<script lang="ts">
import type { PropType } from 'vue'
import { defineComponent, reactive, watch } from 'vue'
import type { ToastCommitType } from '@yq-editor/global-types'
import DynamicForm from '@/components/DynamicForm.vue'
import DataFlow from '@/views/Editor/DataFlow.vue'
import type { ActionSetType } from '@/views/Editor/ActionSet.vue'
export default defineComponent({
  name: 'ToastSet',
  components: {
    DynamicForm,
    DataFlow,
  },
  props: {
    value: {
      type: Object as PropType<ToastCommitType>,
      default: () => ({
        toastConfig: {
          message: '',
        },
        requestConfig: {
          sourceDataKey: '',
        },
        nextStep: { type: '' },
      }),
    },
    hasDataFlow: Boolean,
  },
  emits: ['submit', 'cancel'],
  setup(props, ctx) {
    const formConfig = {
      message: {
        label: '提示',
        component: 'monaco',
        props: {
          style: {
            height: '200px',
          },
        },
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
            componentsProps: { hasDataFlow: false },
          },
        },
      },
    }

    const state = reactive(props.value)

    const onSubmit = (value: Object) => {
      // const
      ctx.emit('submit', {
        toastConfig: value,
        requestConfig: state.requestConfig,
      })
    }
    const onCancel = () => {
      ctx.emit('cancel')
    }

    return {
      formConfig,
      onSubmit,
      onCancel,
      state,
    }
  },
})
</script>

<template>
  <DataFlow
    v-model:value="state.requestConfig"
    :has-data-flow="hasDataFlow"
  />
  <DynamicForm
    :form-item-config="formConfig"
    :value="state.toastConfig"
    @submit="onSubmit"
    @cancel="onCancel"
  />
</template>

<style scoped></style>
