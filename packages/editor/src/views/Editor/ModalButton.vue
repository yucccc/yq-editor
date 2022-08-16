<script lang="ts">
/**
 * 该组件需要子组件自行实现submit方法
 */
import { defineComponent, reactive, watch } from 'vue'
import CodeSet from '@/views/Editor/CodeSet.vue'
import ActionSet from '@/views/Editor/ActionSet.vue'
import ThirdSet from '@/views/Editor/ThirdSet.vue'
import PageBaseSet from '@/views/Editor/PageBaseSet.vue'
import StateSet from '@/config/componentPanelProps/StateSet.vue'
export default defineComponent({
  name: 'ModalButton',
  components: {
    ActionSet,
    ThirdSet,
    PageBaseSet,
    CodeSet,
    StateSet,
  },
  props: {
    value: {
      type: [Array, Object, String],
      require: true,
    },
    btnProps: {
      type: Object,
      default() {
        return { slot: '设置交互' }
      },
    },
    modalProps: {
      type: Object,
      default() {
        return { slot: 'action-set', componentsProps: {} }
      },
    },
    hasNextStep: Boolean,
  },
  emits: ['change', 'update:value'],
  setup(props, context) {
    const state = reactive({
      modalVisible: false,
      type: props.value ? props.value.type : '',
    })
    watch(
      () => props.value,
      nv => (state.type = nv.type),
    )
    const changeType = (type: string) => (state.type = type)
    const onSubmit = (value: any) => {
      context.emit('change', value)
      context.emit('update:value', value)
      state.modalVisible = false
    }
    const onCancel = () => {
      state.modalVisible = false
    }
    return {
      onSubmit,
      state,
      changeType,
      onCancel,
    }
  },
})
</script>

<template>
  <a-button style="width: 100%" @click="state.modalVisible = true">
    {{ btnProps.slot }}
  </a-button>
  <div v-drag-modal>
    <a-modal
      v-model:visible="state.modalVisible"
      destroy-on-close
      :wrap-class-name="`cus-${state.type}`"
      :title="btnProps.slot"
      :footer="null"
      :width="560"
    >
      <component
        :is="modalProps.slot"
        :value="value"
        :modal-visible="state.modalVisible"
        :components-props="modalProps.componentsProps"
        @submit="onSubmit"
        @cancel="onCancel"
        @change-type="changeType"
      />
    </a-modal>
  </div>
</template>

<style lang="less">
.cus-popup {
  left: 50%;
  > .ant-modal {
    top: 10px;
  }
}
</style>
