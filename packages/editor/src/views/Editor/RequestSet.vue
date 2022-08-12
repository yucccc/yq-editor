<script lang="ts">
import type { PropType } from 'vue'
import { computed, defineComponent, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import type { FormConfig, RequestCommitType } from '@yq-editor/global-types'
import DynamicForm from '@/components/DynamicForm.vue'
import { useEditorStore } from '@/store/editor'

const codeConfig = {
  component: 'monaco',
  props: {
    style: {
      height: '150px',
    },
  },
}
const actionSet = {
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

export default defineComponent({
  name: 'RequestSet',
  components: {
    DynamicForm,
  },
  props: {
    value: {
      type: Object as PropType<RequestCommitType>,
      default: () => ({
        apiName: '',
        paramsSf: '',
        resFlowStrToFn: '',
        successFn: { type: '' },
        errorFn: { type: '' },
        finallyFn: { type: '' },
      }),
    },
    hasDataFlow: Boolean,
  },
  emits: ['submit', 'cancel'],

  setup(props, ctx) {
    const store = useEditorStore()
    const apis = computed(() =>
      store.page.apiConfig.apis.map(item => ({
        value: item.name,
        text: item.name,
      })),
    )
    const state = reactive({
      value: props.value,
    })
    const DynamicForm = ref(null)

    const requestConfig: {
      [key in keyof RequestCommitType]: Partial<FormConfig>
    } = {
      apiName: {
        label: '接口名称',
        component: 'a-select',
        subComponent: 'a-select-option',
        subComponentOptions: apis.value,
      },
      paramsSf: {
        label: '请求参数',
        ...codeConfig,
      },
      // 返回流传 决定进入那个状态 必须要又要返回
      // 返回  'successFn' | errorFn
      resFlowStrToFn: {
        label: '执行流传',
        ...codeConfig,
      },
      successFn: {
        label: '成功回调',
        ...actionSet,
      },
      errorFn: {
        label: '失败回调',
        ...actionSet,
      },
      finallyFn: {
        label: '总是回调',
        ...actionSet,
      },
    }

    const onSubmit = (value: RequestCommitType) => {
      ctx.emit('submit', value)
    }
    const onCancel = () => {
      ctx.emit('cancel')
    }
    const request = () => {
      // @ts-expect-error
      const value: RequestCommitType = DynamicForm.value.getValue()
      console.log('%c [ value ]-122-「RequestSet」', 'font-size:13px; background:pink; color:#bf2c9f;', value)
      if (!value.apiName) { return message.info('别搞 选个接口地址先 ~') }
      store.getApiData(`${value.apiName}`, {}).then((res) => {
        message.success(`请求成功: ${res}`)
      }).catch((res) => {
        message.success(`请求失败: ${res}`)
      })
    }
    return {
      onSubmit,
      onCancel,
      requestConfig,
      request,
      state,
      DynamicForm,
    }
  },
})
</script>

<template>
  <DynamicForm ref="DynamicForm" :form-item-config="requestConfig" :value="value" @submit="onSubmit" @cancel="onCancel">
    <a-row class="mb-10">
      <a-col :span="4">
        模拟请求
      </a-col>
      <a-col :span="4">
        <a-button type="primary" @click="request">
          请求
        </a-button>
      </a-col>
    </a-row>
  </DynamicForm>
</template>

<style lang="less"></style>
