<script lang="ts">
import type { PropType } from 'vue'
import { computed, defineComponent, reactive, watch } from 'vue'
import DynamicForm from '@/components/DynamicForm.vue'
import type { SettingType } from '@/store/editor'
const baseConfig = {
  // 页面基础配置
  title: { label: '标题' },
  description: { label: '描述' },
}

// TODO: 待考虑
export default defineComponent({
  name: 'PageBaseSet',
  components: {
    DynamicForm,
  },
  props: {
    value: {
      type: Object as PropType<SettingType>,
      require: true,
    },
    modalVisible: Boolean,
  },
  emits: ['submit', 'cancel', 'change-type'],
  setup(props, ctx) {
    const state = reactive({
      currentKey: 'pageBaseConfig',
    })

    const submit = (e: any) => {
      // 保存时候只保存页面当前停留的设置
      ctx.emit('submit', e)
    }
    const cancel = () => {
      ctx.emit('cancel')
    }
    return {
      state,
      baseConfig,
      submit,
      cancel,
    }
  },
})
</script>

<template>
  <div v-if="state.currentKey">
    <DynamicForm :form-item-config="baseConfig" :value="value" @submit="submit" @cancel="cancel" />
  </div>
</template>

<style scoped></style>
