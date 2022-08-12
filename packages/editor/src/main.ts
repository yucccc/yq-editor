import type { App as VueApp } from 'vue'
import { createApp, defineAsyncComponent } from 'vue'
import Antd from 'ant-design-vue'
import VXETable from 'vxe-table'

import BaseComponents from '@yq-editor/base-components'
import ActivityComponents from '@yq-editor/activity-components'
import App from './App.vue'
import router from './router'
import store from './store'
import 'ant-design-vue/dist/antd.css'
import './styles/global.less'
import EditWrapper from './components/EditWrapper/EditWrapper.vue'
import { dragModal } from './directive/dragModal'
import Monaco from '@/components/Monaco.vue'
import MonacoSet from '@/views/Editor/MonacoSet.vue'
import ToastSet from '@/views/Editor/ToastSet.vue'
import ModalButton from '@/views/Editor/ModalButton.vue'
import DataFlow from '@/views/Editor/DataFlow.vue'

import CodeSet from '@/views/Editor/CodeSet.vue'
import PopupSet from '@/views/Editor/PopupSet.vue'
import LayerSet from '@/views/Editor/layer-set/LayerSet.vue'
import MoreUploader from '@/components/MoreUploader.vue'
import SourceKey from '@/components/SourceKey.vue'
import DynamicForm from '@/components/DynamicForm.vue'
import 'xe-utils'
import 'vxe-table/lib/style.css'
import 'uno.css'

import '@yq-editor/base-components/style.css'
import '@yq-editor/activity-components/style.css'

const app = createApp(App)
app.use(BaseComponents).use(ActivityComponents)

// 动态注册全局组件
const components = import.meta.glob('./components/properties-panel/*.vue') // 异步方式
function install(app: VueApp) {
  for (const [key, value] of Object.entries(components)) {
    // 文件名即为组件名
    const name = key.slice(key.lastIndexOf('/') + 1, key.lastIndexOf('.'))
    console.log('%c [ 注册全局组件 ]-67-「main」', 'font-size:13px; background:pink; color:#bf2c9f;', name)
    app.component(name, defineAsyncComponent(value))
  }
}
app.use(install)

// 注册全局组件
app.component(Monaco.name, Monaco)
app.component(ToastSet.name, ToastSet)
app.component(ModalButton.name, ModalButton)
app.component(MonacoSet.name, MonacoSet)
app.component(DataFlow.name, DataFlow)
app.component(EditWrapper.name, EditWrapper)

app.component(CodeSet.name, CodeSet)
app.component(PopupSet.name, PopupSet)
app.component('LayerSet', LayerSet)
app.component('MoreUploader', MoreUploader)
app.component('SourceKey', SourceKey)
app.component('DynamicForm', DynamicForm)

app.directive('drag-modal', dragModal)
app.use(Antd)
app.use(router)
app.use(store)
app.config.errorHandler = (err, vv, info) => {
  console.error('拦截到全局错误 请马上处理！', vv, info, err)
}
app.use(VXETable)

app.mount('#app')
