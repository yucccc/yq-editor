<script>
import { defineComponent, reactive } from 'vue'
import magnifier from './index.vue'
import e from '@/utils/emit'

import dealProps from '@/utils/test'

export default defineComponent({
  components: { Magnifier: magnifier },
  setup() {
    const obj = {
      id: 'cd7aff26-362e-4271-997f-050728e68baa',
      name: 'act-magnifier',
      // position: 'absolute',
      left: '50px',
      top: '10px',
      width: '350px',
      height: '350px',
      giftImgs: [
        'https://yq-editor-oss.oss-cn-guangzhou.aliyuncs.com/logo.png',
        'https://yq-editor-oss.oss-cn-guangzhou.aliyuncs.com/logo.png',
        'https://yq-editor-oss.oss-cn-guangzhou.aliyuncs.com/logo.png',
        'https://yq-editor-oss.oss-cn-guangzhou.aliyuncs.com/logo.png',
        'https://yq-editor-oss.oss-cn-guangzhou.aliyuncs.com/logo.png',
        'https://yq-editor-oss.oss-cn-guangzhou.aliyuncs.com/logo.png',
        'https://yq-editor-oss.oss-cn-guangzhou.aliyuncs.com/logo.png',
        'https://yq-editor-oss.oss-cn-guangzhou.aliyuncs.com/logo.png',
      ],
      iconWidth: '40px',
      runningTime: 4,
      minTurns: 5,
      scale: 1.4,
      viewportWidth: 750,
      CALLBACK: {
        type: 'code',
        code: 'function fn(props) {\r\n    console.log(334545)\r\n}',
      },
    }

    const state = reactive(obj)
    const targetProps = dealProps(obj)
    const start = (index) => {
      // const _corona = corona.value as any
      // _corona.start(index)
      // e.emit(`${targetProps.id}-start`, index)
      e.emit(`${targetProps.id}-start`, index)
      // magnifier.value.start(index)
    }

    return {
      state,
      start,
      targetProps,
    }
  },
})
</script>

<template>
  <div class="box" style="width: 500px">
    <Magnifier ref="magnifier" v-bind="targetProps" />
    <button @click="start(2)">
      开始
    </button>
  </div>
</template>

<style scoped>
.box {
  height: 500px;
}
</style>
