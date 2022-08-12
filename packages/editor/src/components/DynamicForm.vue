<script lang="ts" setup>
import { computed, reactive, ref, watch, withDefaults } from 'vue'
import { isUndefined, map, merge } from 'lodash-es'
import type { FormInstance, FormProps } from 'ant-design-vue'
import { Tooltip } from 'ant-design-vue'
import type { FormConfig } from '@yq-editor/global-types'
import { QuestionCircleOutlined } from '@ant-design/icons-vue'

interface Props {
  formProps?: FormProps
  // 表单规则 等待修改为formItemConfig
  formItemConfig: Record<string, FormConfig>
  // 值
  value?: any
  // 是否显示提交
  useSubmit?: boolean
  subText?: string
}

const props = withDefaults(defineProps<Props>(), {
  value: () => ({}),
  formConfig: () => ({}),
  formProps: () => ({
    labelCol: { span: 5 },
    wrapperCol: { span: 19 },
    colon: false,
    autocomplete: 'off',
  }),
  useSubmit: true,
  subText: '保存',
})

const emit = defineEmits(['submit', 'failed', 'finish'])

const formRef = ref<FormInstance | null>(null)
const defaultFormItemConfig = () => ({
  component: 'a-input',
  vModel: 'value',
})

const formState = ref(props.value)

watch(() => props.value, (value) => {
  formState.value = value
})

const fixFormItemConfig = computed(() => {
  const formConfig = props.formItemConfig as Record<string, FormConfig>
  return Object.keys(formConfig).map((key) => {
    return merge(defaultFormItemConfig(), {
      name: key,
      ...formConfig[key],
    })
  })
})

const onFinish = (values: any) => {
  emit('finish', values)
  emit('submit', values)
}

const onFinishFailed = (errorInfo: any) => {
  emit('failed', errorInfo)
}
const resetForm = () => {
  formRef.value!.resetFields()
}

// 供外部调用的提交
defineExpose({
  submit: () => {
    formRef.value!.validateFields().then(onFinish).catch(onFinishFailed)
  },
})
</script>

<template>
  <a-form
    ref="formRef"
    class="dynamic-form"
    v-bind="formProps"
    :model="formState"
    @finish="onFinish"
    @finish-failed="onFinishFailed"
  >
    <a-form-item v-for="(item, i) in fixFormItemConfig" :key="i" v-bind="item.formItemProps" :name="item.name">
      <template #label>
        {{ item.label }}
        <Tooltip v-if="item.tips" :title="item.tips" class="ml-0.5">
          <QuestionCircleOutlined />
        </Tooltip>
      </template>

      <component
        :is="item.component"
        v-bind="item.componentProps"
        v-model:[item.vModel]="formState[item.name]"
      >
        {{ item.componentSlot }}
        <template v-if="item.subComponent">
          <component
            :is="item.subComponent"
            v-for="(option, k) in item.subComponentOptions"
            :key="k"
            :value="option.value"
          >
            {{ option.text }}
          </component>
        </template>
      </component>
    </a-form-item>

    <a-form-item v-if="useSubmit" label="操作">
      <div>
        <a-button type="primary" html-type="submit">
          {{ subText }}
        </a-button>
        <a-button type="danger" class="ml-10px" @click="resetForm">
          重置
        </a-button>
      </div>
    </a-form-item>
  </a-form>
</template>

<style lang="less">
.dynamic-form {
  .ant-form-item-label {
    text-align: left;
  }
}
</style>
