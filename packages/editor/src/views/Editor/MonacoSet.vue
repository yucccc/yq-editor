<script lang="ts">
import { defineComponent, reactive, watch } from 'vue'
export default defineComponent({
  name: 'MonacoSet',
  components: {},
  props: {
    value: {
      type: String,
      default: '',
    },
    componentsProps: { type: Object, default: () => ({}) },
    // 弹窗显示的时候需要刷新下 bug
    modalVisible: Boolean,
  },
  emits: ['submit', 'cancel'],

  setup(props, ctx) {
    const state = reactive({
      value: props.value,
    })
    watch(
      () => props.value,
      nv => (state.value = nv),
    )
    const onSubmit = () => {
      ctx.emit('submit', state.value)
    }
    const onCancel = () => {
      ctx.emit('cancel')
    }

    return {
      onSubmit,
      onCancel,
      state,
    }
  },
})
</script>

<template>
  <div class="in-coder-panel">
    <monaco
      v-bind="componentsProps"
      v-model:value="state.value"
      class="mb-10"
    />
    <a-row>
      <a-col :span="4">
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
  </div>
</template>

<style lang="less" scoped></style>
