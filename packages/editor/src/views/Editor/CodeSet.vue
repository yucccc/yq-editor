<script lang="ts">
// 流程设置
import { PropType, defineComponent } from 'vue'
import type { ActionSetType, FormConfig } from '@yq-editor/global-types'
import DynamicFormVue from '@/components/DynamicForm.vue'
export interface CodeCommitType {
  code: string
  // 下一步执行
  nextStep: ActionSetType
}

const defaultValue: CodeCommitType = {
  code: '',
  nextStep: { type: '' },
}

export default defineComponent({
  name: 'CodeSet',
  components: {
    DynamicFormVue,
  },
  props: {
    value: {
      type: Object,
    },
    componentsProps: {
      type: Object,
      default: () => ({}),
    },
    hasNextStep: {
      type: Boolean,
      default: true,
    },

    // 弹窗显示的时候需要刷新下 bug
    modalVisible: Boolean,
  },
  emits: ['submit', 'cancel'],

  setup(props, ctx) {
    const codeFormConfig: {
      [key in keyof CodeCommitType]: Partial<FormConfig>
    } = {
      code: {
        label: '代码',
        component: 'monaco',
        props: {
          style: {
            height: '300px',
          },
          ...props.componentsProps,
        },
      },
      nextStep: {
      },
    }

    if (props.hasNextStep) {
      codeFormConfig.nextStep = {
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
      }
    }

    const onSubmit = (value: CodeCommitType) => {
      console.log('%c [  ]-78', 'font-size:13px; background:pink; color:#bf2c9f;', value)
      ctx.emit('submit', value)
    }
    const onCancel = () => {
      ctx.emit('cancel')
    }

    return {
      onSubmit,
      onCancel,
      codeFormConfig,
    }
  },
})
</script>

<template>
  <DynamicFormVue :form-item-config="codeFormConfig" :value="value" @submit="onSubmit" @cancel="onCancel" />
</template>

<style lang="less" scoped>
</style>
