<script lang="tsx">
import { computed, defineAsyncComponent, defineComponent, reactive, ref, toRaw } from 'vue'

import { message } from 'ant-design-vue'
import { useRoute } from 'vue-router'
import type { ApiType } from '@yq-editor/global-types'
import type { Columns } from './tableType'
import TableSet2 from '@/components/TableSet2.vue'
import { useEditorStore } from '@/store/editor'
import DynamicForm from '@/components/DynamicForm.vue'

export default defineComponent({
  name: 'DataSource',
  components: {
    TableSet2,
    DynamicForm,
  },
  props: {
    sourceModalVisible: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:visible'],
  setup(props, context) {
    const eStore = useEditorStore()
    const route = useRoute()
    const apiConfig = computed(() => eStore.page.apiConfig)
    const requestConfig = computed(() => eStore.page.requestConfig)

    const state = reactive({
      sourceModalVisible: props.sourceModalVisible,
    })
    const requestModulesMapArray = computed(() => eStore.requestModulesMapArray)
    const handleSend = (val: ApiType) => {
      eStore.getApiData(val)
    }
    const addDefaultValue = {
      method: 'GET',
      requestConfigName: '网页活动请求',
      isUseMock: false,
      isUseLoading: false,
    }
    const columns: Columns[] = [
      {
        title: '接口名称',
        field: 'name',
        width: '100px',
        params: {
          component: 'a-input',
          vModel: 'value',
          tips: '具有唯一性 用于用户选择备注',
          formItemProps: {
            required: true,
          },
        },
      },
      {
        title: '请求接口',
        field: 'url',
        minWidth: '100px',
        params: {
          formItemProps: {
            required: true,
          },
        },
      },
      {
        title: '请求方式',
        field: 'method',
        width: '90px',
        params: {
          formItemProps: {
            required: true,
          },
          component: 'a-select',
          subComponent: 'a-select-option',
          subComponentOptions: [
            {
              text: 'GET',
              value: 'GET',
            },
            {
              text: 'POST',
              value: 'POST',
            },
            {
              text: 'PUT',
              value: 'PUT',
            },
            {
              text: 'DELETE',
              value: 'DELETE',
            },
            {
              text: 'PATCH',
              value: 'PATCH',
            },

          ],
          componentProps: {
          },
        },
      },
      {
        title: '使用配置',
        field: 'requestConfigName',
        width: '100px',
        params: {
          formItemProps: {
            required: true,
          },
          component: 'a-select',
          subComponent: 'a-select-option',
          subComponentOptions: requestModulesMapArray,
        },
      },
      {
        title: '优先级',
        field: 'index',
        width: '80px',
        params: {
          component: 'a-input-number',
          tips: '请求的优先级 0为不发送请求 1为最高优先级 数字越小优先级越高 有依赖关系 并非并发',
          componentProps: {
            min: 0,
          },
        },
      },
      {
        title: '使用Mock',
        field: 'isUseMock',
        width: '120px',
        params: {
          component: 'a-switch',
          vModel: 'checked',
          tips: '生产环境忽略',
        },
        formatter: ({ cellValue }) => {
          return cellValue ? '是' : '否'
        },
      },
      {
        title: 'loading',
        field: 'isUseLoading',
        width: '120px',
        params: {
          component: 'a-switch',
          vModel: 'checked',
          tips: '请求的是是否启动loading',
        },
        formatter: ({ cellValue }) => {
          return cellValue ? '是' : '否'
        },
      },
      {
        title: '请求参数',
        field: 'paramsSf',
        width: '100px',
        params: {
          component: 'monaco',
          vModel: 'value',
          componentProps: {
            language: 'javascript',
          },
        },
      },
      {
        title: '请求头参数',
        field: 'headersSf',
        width: '100px',
        params: {
          component: 'monaco',
          vModel: 'value',
          componentProps: {
            language: 'javascript',
          },
        },
      },
      {
        title: '发送请求',
        fixed: 'right',
        width: '100px',
        params: {
          component: 'a-button',
          tips: '通常用于测试接口是否正常',
        },
        slots: {
          default: ({ row }) => {
            // bug 点击会弹出表单编辑
            return (
              [<a-button
                key="1"
                size="small"
                type="primary"
                class="editable-add-btn"
                onClick={(e: Event) => {
                  // e.stopPropagation()
                  // e.preventDefault()
                  handleSend(row)
                }}
              >
                发送请求
              </a-button>]
            )
          },
        },
      },
    ]

    const handleApiOk = () => {
      // 更新下最新的请求
      eStore.initApiData()
      // 保存数据
      eStore.saveWork(route.params.id as string)
      context.emit('update:visible', false)
    }
    const handleCancel = () => {
      context.emit('update:visible', false)
    }
    const handleSubmit = (name: string, value: any) => {
      message.success('提交成功')
      eStore.page.requestConfig[name] = value
    }

    return {
      eStore,
      columns: ref(columns),
      requestConfig,
      state,
      apiConfig,
      handleCancel,
      handleApiOk,
      activeKey: ref(0),
      handleSubmit,
      addDefaultValue,
    }
  },
})
</script>

<template>
  <a-modal
    v-model:visible="state.sourceModalVisible"
    :mask-closable="false"
    title="数据源"
    width="1200px"
    @ok="handleApiOk"
    @cancel="handleCancel"
  >
    <div class="data-source">
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane v-for="(item, index) in eStore.requestModulesMapArray" :key="index" :tab="item.name">
          <DynamicForm
            :value="requestConfig[item.name] || item.defaultParams"
            :form-item-config="item.getFormConfig()"
            @submit="(v) => handleSubmit(item.name, v)"
          />
        </a-tab-pane>
      </a-tabs>

      <TableSet2 v-model:data="apiConfig.apis" :columns="columns" :add-default-value="addDefaultValue" />
    </div>
  </a-modal>
</template>

<style lang="less">
.data-source {
  .btn {
    margin-right: 10px;
  }
  .item {
    margin-bottom: 20px;
    display: flex;
    width: 100%;
    span {
      display: inline-block;
      line-height: 2;
    }
    .control {
      display: inline-block;
      flex: 1;
      vertical-align: middle;
    }
  }
  .monaco-editor {
    width: 100%;
    height: 200px;
  }
}
</style>
