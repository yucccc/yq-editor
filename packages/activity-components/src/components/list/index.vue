<script lang="ts" setup>
import { computed, useAttrs } from 'vue'
import { pickStyle, stringToJson } from '@yq-editor/shared'
import { isString, isUndefined } from 'lodash-es'
import RenderVnode from '../RenderVnode'
import { Props } from './props'

const props = defineProps(Props)

const attrs = useAttrs()

const styleProps = computed(() => pickStyle(attrs))

const formatArrange = computed(() => {
  return props.arrange.map((item) => {
    return {
      ...item,
      style: isString(item.style) ? stringToJson(item.style) : item.style,
    }
  })
})
</script>

<script lang="ts">
export default {
  name: 'ActList',
  inheritAttrs: false,
}
</script>

<template>
  <ul :style="styleProps" class="act-list">
    <li v-for="(item, index) in sourceData" :key="index">
      <RenderVnode
        v-for="(list, i) in formatArrange" :key="i" :type="list.type || 'span'"
        :props="{ style: list.style }" :children="
          isUndefined(item[list.key]) ? [list.key] : [item[list.key]]
        "
      />
    </li>
  </ul>
</template>

<style lang="less">
.act-list {
  list-style: none;
  padding: 0;
  margin: 0;
  cursor: move;
  li {
    display: flex;
  }
  li > * {
    display: inline-block;
    width: 100%;
  }
  overflow-y: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
