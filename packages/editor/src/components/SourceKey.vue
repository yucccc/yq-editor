<script lang="ts">
import { defineComponent, reactive, toRaw, watch } from 'vue'
import { isPlainObject } from 'lodash-es'
import { useEditorStore } from '@/store/editor'

export default defineComponent({
  props: {
    value: {
      type: String,
      default: () => '',
    },
    apiName: {
      type: String,
      default: () => '',
    },
    expandTrigger: {
      type: String,
      default: 'click',
    },
  },
  emits: ['change', 'update:value'],
  setup(props, ctx) {
    const store = useEditorStore()
    const state = reactive({
      val: props.value,
      openKeys: props.value.split('.') || [],
      visible: false,
      apiName: props.apiName,
      options: [],
      targetOption: false,
      totalResData: store.page.totalResData,
    })
    const getOptions = (obj: any) => {
      const arr: any = []
      Object.keys(obj).forEach((key) => {
        const b: any = {}
        b.label = key
        b.value = key
        if (isPlainObject(obj[key])) {
          b.children = getOptions(obj[key])
        }
        if (Array.isArray(obj[key])) {
          b.children = obj[key].map((item: any, index: number) => ({
            label: `第${index}项目`,
            value: `${index}`,
            children: getOptions(obj[key][index]),
          }))
        }
        arr.push(b)
      })
      return arr
    }
    // 初始化
    const init = () => {
      const list: any = toRaw(state.totalResData)
      const name = state.apiName
      const keys = state.openKeys
      const ls = name && list[name] ? list[name] : list

      state.options = getOptions(ls || {})
      state.openKeys = name ? keys.filter((n: string) => n !== name) : keys

      state.targetOption = false
    }
    watch(
      store.page.totalResData,
      (val) => {
        state.totalResData = val
        init()
      },
    )

    init()
    watch(
      () => [props.apiName, props.value],
      ([name, val], [prevName, prevVal]) => {
        state.apiName = name
        state.openKeys = prevName !== name ? [] : val.split('.') || []
        init()
      },
    )
    const handleValChange = (val: any) => {
      if (val === props.value) {
        return
      }
      let str = val
      if (val !== undefined) {
        const arr = [...val]
        if (state.apiName) {
          arr.unshift(state.apiName)
        }
        str = arr.join('.')
      }

      ctx.emit('change', str)
      ctx.emit('update:value', str)
    }
    const loadData = (selectedOptions: any) => {
      state.targetOption = true
    }

    return {
      state,
      handleValChange,
      loadData,
    }
  },
})
</script>

<template>
  <a-cascader
    style="width: 100%"
    :options="state.options"
    placeholder="选择字段"
    :load-data="loadData"
    :expand-trigger="expandTrigger"
    :change-on-select="true"
    :value="state.openKeys"
    placement="bottomRight"
    :dropdown-style="{ zIndex: 9999 }"
    @change="handleValChange"
  />
</template>

<style lang="less">
.ant-cascader-menus {
  display: flex;
  flex-direction: row-reverse;
}
.ant-cascader-menu-item {
  text-align: right;
}
.ant-cascader-menu-item .ant-cascader-menu-item-expand-icon {
  transform: scale(0.83333333) rotate(180deg);
  right: auto;
  left: 12px;
}
</style>
