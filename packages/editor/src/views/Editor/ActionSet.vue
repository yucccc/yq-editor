<script lang="ts">
import type { PropType } from 'vue'
import { computed, defineComponent, reactive, watch } from 'vue'
import type { ActionType } from '@yq-editor/global-types'
import ComponentSet from './ComponentSet.vue'
import FacebookShareSet from './FacebookShareSet.vue'
import TwitterShareSet from './TwitterShareSet.vue'
import PopupSet from '@/views/Editor/PopupSet.vue'
import CodeSet from '@/views/Editor/CodeSet.vue'
import RequestSet from '@/views/Editor/RequestSet.vue'
import UrlSet from '@/views/Editor/UrlSet.vue'

export const interType: { key: ActionType; value: string }[] = [
  { key: '', value: '无' },
  { key: 'request', value: '🚀 🚀 请求接口' },
  { key: 'toast', value: '🍞 🍞 弹出提示' },
  { key: 'popup', value: '💻 💻 弹出弹窗' },
  { key: 'component', value: '🐷 🐷 触发组件事件' },
  { key: 'code', value: '🔞 🔞 自定义代码' },
  { key: 'url', value: '🔗 🔗 跳转链接' },
  { key: 'facebookShare', value: '📢 📢 调起facebook分享弹窗' },
  { key: 'twitterShare', value: '🔈 🔈 跳转推特分享页面' },
  { key: 'layer', value: '🧩🧩 触发图层状态' },
]

export default defineComponent({
  name: 'ActionSet',
  components: {
    PopupSet,
    UrlSet,
    CodeSet,
    RequestSet,
    ComponentSet,
    FacebookShareSet,
    TwitterShareSet,
  },
  props: {
    value: {
      type: Object,
      default: () => ({
        type: '',
        url: { to: '' },
        popup: {},
        code: { code: '', nextStep: { type: '' } },
        toast: {},
        component: {},
        facebookShare: {},
        twitterShare: {},
        layer: {},
      }),
    },
    modalVisible: Boolean,
    componentsProps: Object,
  },
  emits: ['submit', 'cancel', 'changeType'],
  setup(props, ctx) {
    const state = reactive({
      properties: { ...props.value },
    })

    watch(
      () => props.value,
      (nv) => {
        state.properties = { ...nv }
      },
    )
    watch(
      () => state.properties.type,
      (nv) => {
        ctx.emit('changeType', nv)
      },
    )

    const onSubmit = (newValue: { [key: string]: any }) => {
      const n: any = {
        type: state.properties.type,
      }
      if (newValue) {
        n[state.properties.type] = newValue
      }
      ctx.emit('submit', n)
    }
    const onCancel = () => {
      ctx.emit('cancel')
    }
    return {
      interType: [...interType],
      state,
      onSubmit,
      onCancel,
    }
  },
})
</script>

<template>
  <!--  TODO： 待重写 -->
  <a-row align="middle" class="mb-10">
    <a-col :span="4">
      <span class="label">事件类型</span>
    </a-col>
    <a-col :span="20">
      <a-select v-model:value="state.properties.type" :list-height="400" style="width: 100%" placeholder="选择事件类型">
        <a-select-option v-for="item in interType" :key="item.key" :value="item.key">
          {{ item.value }}
        </a-select-option>
      </a-select>
    </a-col>
  </a-row>
  <div v-if="state.properties.type === 'popup'">
    <PopupSet
      :value="state.properties[state.properties.type]" v-bind="componentsProps" @submit="onSubmit"
      @cancel="onCancel"
    />
  </div>
  <CodeSet
    v-else-if="state.properties.type === 'code'" :value="state.properties[state.properties.type]"
    :modal-visible="modalVisible" v-bind="componentsProps" @submit="onSubmit" @cancel="onCancel"
  />
  <UrlSet
    v-else-if="state.properties.type === 'url'" :value="state.properties[state.properties.type]"
    @submit="onSubmit" @cancel="onCancel"
  />
  <RequestSet
    v-else-if="state.properties.type === 'request'" :value="state.properties[state.properties.type]"
    v-bind="componentsProps" @submit="onSubmit" @cancel="onCancel"
  />
  <ToastSet
    v-else-if="state.properties.type === 'toast'" :value="state.properties[state.properties.type]"
    v-bind="componentsProps" @submit="onSubmit" @cancel="onCancel"
  />

  <ComponentSet
    v-else-if="state.properties.type === 'component'" :value="state.properties[state.properties.type]"
    v-bind="componentsProps" @submit="onSubmit" @cancel="onCancel"
  />

  <FacebookShareSet
    v-else-if="state.properties.type === 'facebookShare'"
    :value="state.properties[state.properties.type]" @submit="onSubmit" @cancel="onCancel"
  />

  <TwitterShareSet
    v-else-if="state.properties.type === 'twitterShare'" :value="state.properties[state.properties.type]"
    @submit="onSubmit" @cancel="onCancel"
  />
  <LayerSet
    v-else-if="state.properties.type === 'layer'"
    :value="state.properties[state.properties.type]" @submit="onSubmit" @cancel="onCancel"
  />
  <div v-else>
    <a-row>
      <a-button type="primary" @click="onSubmit(null)">
        保存
      </a-button>
      <a-button style="margin-left: 10px" @click="onCancel">
        取消
      </a-button>
    </a-row>
  </div>
</template>

<style scoped>
</style>
