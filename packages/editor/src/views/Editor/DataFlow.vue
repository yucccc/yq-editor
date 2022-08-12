<script lang="ts">
import { computed, defineComponent, reactive, ref } from 'vue'
import { useEditorStore } from '@/store/editor'
import SourceKey from '@/components/SourceKey.vue'

export default defineComponent({
  name: 'DataFlow',
  components: {
    SourceKey,
  },
  props: {
    hasDataFlow: {
      type: Boolean,
      default: false,
    },
    value: {
      type: Object,
      default: () => ({ sourceDataKey: '' }),
    },
  },
  emits: ['update:value', 'change'],
  setup(props, ctx) {
    const store = useEditorStore()
    const apis = computed(() =>
      store.page.apiConfig.apis.map(item => ({
        value: item.name,
        text: item.name,
      })),
    )
    const showMore = ref(false)
    const state = reactive(props.value)

    const handleChange = () => {
      ctx.emit('change', state)
      ctx.emit('update:value', state)
    }

    return {
      state,
      showMore,
      apis,
      handleChange,
    }
  },
})
</script>

<template>
  <a-row align="middle" class="mb-10">
    <a-col :span="4">
      <span class="label">数据字段</span>
    </a-col>
    <a-col :span="20">
      <SourceKey v-model:value="state.sourceDataKey" @change="handleChange" />
    </a-col>
  </a-row>
  <a-row align="middle" class="mb-10">
    <a-col :span="4">
      <span class="label">自定义</span>
    </a-col>
    <a-col :span="20">
      <a-input
        v-model:value="state.sourceDataKey"
        placeholder="接口名.数据a.数据b"
        @change="handleChange"
        @pressEnter="handleChange"
      />
    </a-col>
  </a-row>
  <a-row>
    <a-button type="link" block @click="showMore = !showMore">
      {{
        showMore ? '收起' : '展开自定义数据(通常用于测试 优先级最高)'
      }}
    </a-button>
  </a-row>
  <template v-if="showMore">
    <a-row align="middle" class="mb-10">
      <a-col :span="4">
        <span class="label">自定数据</span>
      </a-col>
      <a-col :span="20">
        <monaco v-model:value="state.customStrFnToParams" :style="{ height: '160px' }" />
      </a-col>
    </a-row>
  </template>
</template>

<style scoped></style>
