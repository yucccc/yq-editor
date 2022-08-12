<script lang="ts" setup>
import { cloneDeep } from 'lodash-es'
import { v4 } from 'uuid'
// import type { TextComponentPropTypes } from '@/config/componentsPath'

// 增加到画布中
interface TList {
  layerName: string
  [key: string]: any
  __showComponent: {
    // 显示的图片
    src: string
  }
}
const props = defineProps<{
  list: TList[]
}>()

const emit = defineEmits(['onItemClick'])

const onItemClick = (item: any & Partial<TList>) => {
  const n = cloneDeep(item)
  // 将不必须的信息删除
  delete n.__showComponent

  const id = v4()
  const componentData = {
    name: item.name,
    id,
    layerName: item.layerName,
    props: { id, ...n },
  }
  emit('onItemClick', componentData)
}
</script>

<template>
  <div class="component-template">
    <div v-for="(item, i) in list" :key="i" class="component-item" @click="onItemClick(item)">
      <template v-if="item.__showComponent">
        <div class="img-box">
          <img :src="item.__showComponent.src" alt="11">
        </div>
        <div class="label">
          {{ item.layerName }}
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="less">
.component-template {
  display: grid;
  grid-template-columns: 1fr 1fr;
}
.component-item {
  border: 1px solid #3662ec4d;
  margin: 10px;
  cursor: pointer;
  color: #9da3ac;
  &:hover {
    border: 1px solid #3662ec4d;
  }
}

.component-item {
  box-sizing: border-box;
  .img-box {
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  img {
    max-width: 100px;
    display: block;
  }
  text-align: center;
  .label {
    line-height: 30px;
    height: 30px;
  }
}
</style>
