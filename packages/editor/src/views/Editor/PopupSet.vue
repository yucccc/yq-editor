<script lang="ts">
import type { PropType } from 'vue'
import { computed, defineComponent, reactive, ref, toRaw } from 'vue'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons-vue'
import TinymceEditor from '@tinymce/tinymce-vue'
import { cloneDeep, pick } from 'lodash-es'
import { message } from 'ant-design-vue'
import { Popup } from 'vant'
import type { FormConfigKv, PopupCommitType } from '@yq-editor/global-types'
import { listColumns, table2Clo } from './PopupTemplate/listForm'
import GiftTemplate from './PopupTemplate/gift-template.vue'
import PhoneView from '@/components/PhoneView.vue'
import TableSet2 from '@/components/TableSet2.vue'
import { strGetSourceData, stringStyleToStyle } from '@/shared'
import { useEditorStore } from '@/store/editor'
import DataFlow from '@/views/Editor/DataFlow.vue'
import DynamicForm from '@/components/DynamicForm.vue'
// 可供选择弹窗模板
const templateList = [
  { key: 'act-list', value: '列表/排行榜' },
  { key: 'gift', value: '礼物🎁' },
  { key: '', value: '默认模板' },
]

const dataSource = [
  { key: 'index', style: '', type: '' },
  { key: '接口key1', style: '', type: '' },
  { key: '接口key2', style: '', type: '' },
]

export interface PopupConfig {
  width: string
  height: string
  title: string
  // 编辑富文本内容
  content: string
  // 背景图地址
  backgroundImage: string
  // 内容盒子自定义样式
  contentStyle: string
  template: string
  // 组件编辑props
  templateProps: any
}

const defaultPropsNo = {
  template: 'act-list',
  content: '',
  width: '340px',
  height: '340px',
  title: '',
  backgroundImage: '',
  contentStyle: '',
  templateProps: {
    list: {
      arrange: dataSource,
    },
  },
}
const popupConfig = {
  // 暂定
  popup1: cloneDeep(defaultPropsNo),
}
const firstKey = Object.keys(popupConfig)[0]

const defaultProps: PopupCommitType = {
  popupConfig,
  currentUsePopupKey: firstKey,
  requestConfig: {
    sourceDataKey: '',
  },
  nextStep: {
    type: '',
  },
}

export default defineComponent({
  name: 'PopupSet',
  components: {
    TinymceEditor,
    PhoneView,
    PlusOutlined,
    DeleteOutlined,
    DataFlow,
    GiftTemplate,
    Popup,
    TableSet2,
    DynamicForm,
  },
  props: {
    value: {

      type: Object as PropType<PopupCommitType>,
    },
    hasDataFlow: Boolean,
  },
  emits: ['submit', 'cancel'],
  setup(props, ctx) {
    const store = useEditorStore()
    // 数据
    const resData = computed(() => store.page.totalResData)

    const currentUseData = computed(() => {
      try {
        return popup.requestConfig.sourceDataKey
          ? strGetSourceData(resData.value, popup.requestConfig.sourceDataKey).map((item: any, index: number) => ({
            index: index + 1,
            ...item,
          }))
          : []
      }
      catch (error) {
        return []
      }
    })

    const visible = ref<boolean>(true)

    const popup = reactive<PopupCommitType>(props.value || cloneDeep(defaultProps))

    // 需要弹窗中显示的样式
    const actStyle = computed(() => {
      return {
        ...popup.popupConfig[popup.currentUsePopupKey],
        ...stringStyleToStyle(popup.popupConfig[popup.currentUsePopupKey].contentStyle),
      }
    })

    const onSubmit = () => {
      ctx.emit('submit', toRaw(popup))
    }
    const onCancel = () => {
      ctx.emit('cancel')
    }
    // 加些弹窗
    const addPopupType = () => {
      const list = Object.keys(popup.popupConfig)
      const len = list.length
      if (len > 2) { return message.info('不要加那么多个啦~') }
      // 取最后一个的长度 + 1 保证不会重复
      const num = list[len - 1].split('popup')[1]
      popup.popupConfig[`popup${+num + 1}`] = cloneDeep(defaultPropsNo)
    }
    // 删除
    const deletePopupType = (key: string) => {
      delete popup.popupConfig[key]
    }
    // const formConfig: FormConfigKv = {
    //   t1: {
    //     component: 'a-divider',
    //     componentSlot: '数据源设置',
    //     formItemProps: {
    //       labelCol: { span: 0 },
    //       wrapperCol: { span: 24 },
    //     },
    //   },
    //   sourceDataKey: {
    //     label: '数据源',
    //     component: 'source-key',
    //   },
    //   sourceDataSf: {
    //     label: '自定义数据',
    //     component: 'monaco',
    //     tips: '某些情况下 你可能需要使用一些自定义的数据源 但是我们建议你模拟一次请求后再使用选择数据源 这样更准确',
    //   },
    //   t2: {
    //     component: 'a-divider',
    //     componentSlot: '数据源设置',
    //     formItemProps: {
    //       labelCol: { span: 0 },
    //       wrapperCol: { span: 24 },
    //     },
    //   },
    //   template: {
    //     label: '渲染模板',
    //     component: 'a-select',
    //     subComponent: 'a-select-option',
    //     subComponentOptions: [],
    //   },
    //   title: {
    //     label: '弹窗标题',
    //   },
    //   width: {
    //     label: '弹窗宽度',
    //   },
    //   height: {
    //     label: '弹窗高度',
    //   },
    //   contentStyle: {
    //     label: '弹窗样式',
    //     component: 'monaco',
    //     componentProps: {
    //       language: 'json',
    //     },
    //   },
    // }

    return {
      popup,
      // formConfig,
      templateList,
      onSubmit,
      onCancel,
      actStyle,
      dataSource,
      resData,
      table2Clo,
      listColumns,
      currentUseData,
      visible,
      addPopupType,
      // popupType,
      deletePopupType,
    }
  },
})
</script>

<template>
  <!-- <DynamicForm :form-item-config="formConfig" /> -->
  <a-divider>数据源设置</a-divider>
  <DataFlow v-model:value="popup.requestConfig" :has-data-flow="hasDataFlow" />
  <a-divider>弹窗设置</a-divider>
  <a-row align="middle" class="mb-10">
    <a-col :span="4">
      <span class="label">弹窗模板</span>
    </a-col>
    <a-col :span="20">
      <a-radio-group v-model:value="popup.currentUsePopupKey">
        <a-radio-button v-for="(key, index) in Object.keys(popup.popupConfig)" :key="key" :value="key" class="type-box">
          <a-button v-if="index" shape="circle" size="small" class="delete-btn" @click.stop="deletePopupType(key)">
            <template #icon>
              <DeleteOutlined />
            </template>
          </a-button>
          {{ key }}
        </a-radio-button>
      </a-radio-group>
      <a-button shape="circle" @click="addPopupType">
        <template #icon>
          <PlusOutlined />
        </template>
      </a-button>
    </a-col>
  </a-row>
  <a-row align="middle" class="mb-10">
    <a-col :span="4">
      <span class="label">渲染模板</span>
    </a-col>
    <a-col :span="20">
      <a-select v-model:value="popup.popupConfig[popup.currentUsePopupKey].template" style="width: 100%">
        <a-select-option v-for="(item, index) in templateList" :key="index" :value="item.key">
          {{ item.value }}
        </a-select-option>
      </a-select>
    </a-col>
  </a-row>
  <a-row align="middle" class="mb-10">
    <a-col :span="4">
      <span class="label">弹窗标题</span>
    </a-col>
    <a-col :span="20">
      <a-input v-model:value="popup.popupConfig[popup.currentUsePopupKey].title" />
    </a-col>
  </a-row>
  <a-row align="middle" class="mb-10">
    <a-col :span="4">
      <span class="label">弹窗宽度</span>
    </a-col>
    <a-col :span="8">
      <a-input v-model:value="popup.popupConfig[popup.currentUsePopupKey].width" />
    </a-col>
    <a-col :span="4">
      <span class="label">弹窗高度</span>
    </a-col>
    <a-col :span="8">
      <a-input v-model:value="popup.popupConfig[popup.currentUsePopupKey].height" />
    </a-col>
  </a-row>
  <a-row align="middle" class="mb-10">
    <a-col :span="4">
      <span class="label">弹窗样式</span>
    </a-col>
    <a-col :span="20">
      <monaco
        v-model:value="popup.popupConfig[popup.currentUsePopupKey].contentStyle" :style="{ height: '100px' }"
        language="json"
      />
    </a-col>
  </a-row>
  <a-row align="middle">
    <a-col :span="4">
      <span class="label">弹窗背景</span>
    </a-col>
    <a-col :span="20">
      <ImageProcessor v-model:value="popup.popupConfig[popup.currentUsePopupKey].backgroundImage" src-to-bg />
    </a-col>
  </a-row>
  <a-row align="middle">
    <a-col :span="4">
      <span class="label">弹窗内容</span>
    </a-col>
    <a-col :span="20">
      <template
        v-if="
          popup.popupConfig[popup.currentUsePopupKey].template === 'act-list'
            || popup.popupConfig[popup.currentUsePopupKey].template === 'gift'
        "
      >
        <TableSet2
          v-model:data="popup.popupConfig[popup.currentUsePopupKey].templateProps.list.arrange"
          :columns="table2Clo"
        />
      </template>
      <!-- qlj8e5yt6fanbh4tged8wbt4lj8io31o2bgq9y8ns87tc6fk 个人key 需要自行申请 -->
      <TinymceEditor
        v-else v-model="popup.popupConfig[popup.currentUsePopupKey].content"
        api-key="qlj8e5yt6fanbh4tged8wbt4lj8io31o2bgq9y8ns87tc6fk" :init="{
          height: 400,
          plugins: [
            'advlist autolink lists link image charmap print preview anchor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table paste code help wordcount',
          ],
          toolbar:
            'undo redo | formatselect | bold italic backcolor | \
                 alignleft aligncenter alignright alignjustify | \
                 bullist numlist outdent indent | removeformat | ',
          language: 'zh_CN',
        }"
      />
    </a-col>
  </a-row>

  <a-divider>流程设置</a-divider>
  <a-row align="middle" class="mb-10">
    <a-col :span="4">
      <span class="label">下一步</span>
    </a-col>
    <a-col :span="20">
      <modal-button
        v-model:value="popup.nextStep" :btn-props="{ slot: '设置交互' }"
        :modal-props="{ slot: 'action-set' }"
      />
    </a-col>
  </a-row>

  <a-row align="middle">
    <a-col :span="4" :offset="4">
      <a-button type="primary" @click="onSubmit">
        保存
      </a-button>
    </a-col>
    <a-col>
      <a-button style="margin-left: 10px" @click="onCancel">
        取消
      </a-button>
    </a-col>
  </a-row>
  <PhoneView
    teleport="body" :style="{
      left: '30%',
    }" :title="popup.popupConfig[popup.currentUsePopupKey].title"
  >
    <!-- 模拟用户操作 -->
    <button v-show="!visible" @click="visible = !visible">
      显示弹窗
    </button>
    <Popup v-model:show="visible" :teleport="null">
      <div :style="actStyle" class="p-popup-class">
        <act-list
          v-if="popup.popupConfig[popup.currentUsePopupKey].template === 'act-list'"
          :source-data="currentUseData"
          :arrange="popup.popupConfig[popup.currentUsePopupKey].templateProps.list.arrange"
        />

        <GiftTemplate
          v-else-if="popup.popupConfig[popup.currentUsePopupKey].template === 'gift' && currentUseData"
          :source-data="currentUseData"
          :arrange="popup.popupConfig[popup.currentUsePopupKey].templateProps.list.arrange"
        />

        <div v-else class="content" v-html="popup.popupConfig[popup.currentUsePopupKey].content" />
      </div>
    </Popup>
  </PhoneView>
</template>

<style lang="less">
.p-popup-class {
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center top;
  padding: 20% 20% 12%;
  font-size: 12px;
  // 排行需要
  .content {
    > * {
      white-space: normal;
      word-wrap: break-word;
      word-break: break-all;
    }
  }
  > ul {
    height: 100%;
    width: 100%;
  }
}
.gift-list {
  display: flex;
  flex-wrap: wrap;
  max-height: 100%;
  align-items: center;
  justify-content: center;
  overflow: auto;
  .item,
  .tep {
    display: inline-block;
  }
  .item {
    margin: 1%;
    img {
      width: 100%;
    }
  }
  .ten {
    flex: 17% 1;
  }
  .one {
    width: 50%;
  }
}
.type-box {
  position: relative;
  .delete-btn {
    position: absolute;
    right: 0;
    top: -15px;
  }
}
</style>
