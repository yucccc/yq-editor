<script lang="ts">
import { defineComponent } from 'vue'
import { cloneDeep } from 'lodash-es'
import TableSet from '@/components/TableSet.vue'
const columns = [
  {
    title: '位置',
    dataIndex: 'activeImageStyle',
    component: 'monaco',
    vModel: 'value',
    componentProps: {
      language: 'json',
    },
  },
]
export default defineComponent({

  name: 'SourceSet',
  components: {
    TableSet,
  },
  props: {
    value: {
      type: Array,
      require: true,
    },
    modalVisible: Boolean,
  },
  emits: ['submit', 'cancel'],
  setup(props, ctx) {
    let data = cloneDeep(props.value)
    const handleChange = (e: any) => {
      data = e
    }

    const onSubmit = () => {
      ctx.emit('submit', data)
    }
    const onCancel = () => {
      ctx.emit('cancel')
    }

    return {
      columns,
      handleChange,
      onCancel,
      onSubmit,
    }
  },
})
</script>

<template>
  <TableSet
    :columns="columns"
    :data-source="value"
    @change="handleChange"
  />
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
</template>

<style scoped></style>
