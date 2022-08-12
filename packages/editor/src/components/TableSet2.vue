<script lang="tsx"  setup>
import { computed, nextTick, reactive, ref, toRaw, withDefaults } from 'vue'
import type { VxeGridProps, VxeTableDefines, VxeTableInstance } from 'vxe-table'
import { Tooltip } from 'ant-design-vue'
import { QuestionCircleOutlined } from '@ant-design/icons-vue'
import { cloneDeep } from 'lodash-es'
import { myMergeWith } from '@yq-editor/shared'
import type { FormConfig, FormConfigKv } from '@yq-editor/global-types'
import DynamicForm from './DynamicForm.vue'

import type { Columns } from './tableType'

interface Props {
  gridOptions?: VxeGridProps
  columns: Columns[]
  // 要添加是数据
  addDefaultValue?: Record<string, any>
  // 是否显示操作栏
  hasAction?: boolean
  // 表格数据
  data: VxeGridProps['data']
  // 是否显示序号
  hasIndex?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  gridOptions: () => ({
    showOverflow: true,
    border: true,
    resizable: true,
    rowConfig: {
      isHover: true,
    },
  }),
  columns: () => [],
  data: () => [],
  hasAction: true,
  hasIndex: false,
})
const emits = defineEmits(['update:data'])

const indexDefaultData: VxeTableDefines.ColumnOptions = {
  width: 80, title: '序号',
} as const

const actionDefaultData: VxeTableDefines.ColumnOptions = {
  title: '操作',
  fixed: 'right',
  width: '100px',
  align: 'center',
  slots: {
    default: 'operationTmpl',
  },
} as const

const gridOptions = reactive(props.gridOptions)

const questionSlot = (tips: string, title?: string): VxeTableDefines.ColumnOptions['slots'] => {
  return {
    header() {
      return [
        <div key="tips">
          {title}
          <Tooltip title={tips} class="ml-0.5">
            <QuestionCircleOutlined />
          </Tooltip>
        </div>,
      ]
    },

  }
}
const defaultParams = {
  vModel: 'value',
  component: 'a-input',
  componentProps: {},
}
// 修饰行属性
const columns = computed(() => {
  return [...(props.hasIndex ? [indexDefaultData] : []), ...props.columns, ...(props.hasAction ? [actionDefaultData] : [])].map((item) => {
    const params = myMergeWith(defaultParams, [item.params || {}]) as any
    const slots = item.slots || {}
    // 如果传递了tips 那么出现模板配置问号
    if (params.tips) {
      slots.header = questionSlot(params.tips, item.title)?.header
    }
    return {
      ...item,
      params,
      slots,
    }
  })
})
const formItem = computed(() => {
  const o: FormConfigKv = {}
  props.columns.forEach((item) => {
    if (item.field) {
      o[item.field] = {
        ...item.params,
        label: item.title,
      }
    }
  })
  return o
})

const defaultFormData: any = {}
props.columns.forEach((item) => {
  if (item.field) {
    defaultFormData[item.field] = ''
  }
})

const visible = ref(false)

const operationData = reactive({
  selectRow: null,
  formData: cloneDeep(defaultFormData),
})

const xTable = ref<VxeTableInstance>()

const removeEvent = async (row: any) => {
  emits('update:data', props.data.filter(item => item.name !== row.name))
}
const dynamicForm = ref<InstanceType<typeof DynamicForm>>()
const onOk = () => {
  dynamicForm.value!.submit()
}
const addEvent = () => {
  operationData.selectRow = null
  operationData.formData = props.addDefaultValue || cloneDeep(defaultFormData)
  visible.value = true
}
const editEvent = (row: any) => {
  visible.value = true
  operationData.selectRow = row
  operationData.formData = cloneDeep(row)
}
const cellDblclick = ({ row }) => {
  editEvent(row)
}

const finish = (value: any) => {
  if (operationData.selectRow) {
    // todo: 这里直接修改了源数据
    Object.assign(operationData.selectRow, value)
  }
  else {
    emits('update:data', [value, ...props.data])
  }
  visible.value = false
}
</script>

<template>
  <div class="t-header-op">
    <a-button type="primary" class="editable-add-btn" @click="addEvent">
      添加
    </a-button>
  </div>

  <vxe-grid ref="xTable" v-bind="{ ...gridOptions, columns, data }" @cell-dblclick="cellDblclick">
    <!-- 操作栏插槽 -->
    <template #operationTmpl="{ row }">
      <a class="btn" @click="editEvent(row)">编辑</a>
      <a-popconfirm title="确认删除吗?" @confirm="removeEvent(row)">
        <a>删除</a>
      </a-popconfirm>
    </template>
  </vxe-grid>

  <a-modal
    v-model:visible="visible"
    :z-index="100000"
    :title="operationData.selectRow ? '编辑&保存' : '新增&保存'" ok-text="确定" cancel-text="取消"
    @ok="onOk"
  >
    <DynamicForm
      ref="dynamicForm"
      :value="operationData.formData"
      :use-submit="false"
      :form-item-config="formItem"
      @finish="finish"
    />
  </a-modal>
</template>

<style lang="less">
.t-header-op {
    display: flex;
    justify-content: flex-end;
    margin: 10px 0;
}
</style>