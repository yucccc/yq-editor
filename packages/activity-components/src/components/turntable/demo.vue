<script lang="ts">
import { defineComponent } from 'vue'
import ActDemo from './index.vue'
import dealProps from '@/utils/test'
import e from '@/utils/emit'

export default defineComponent({
  components: {
    ActDemo,
  },
  setup() {
    const demoProps = {
      id: '转盘id',
      name: 'act-turntable',
      position: 'absolute',
      left: '50px',
      top: '10px',
      width: '350px',
      height: '350px',
      coronaImg:
        'http://dl.hfrong.cn/osstest/1638253687910-turntable-bg.77e19392.png',
      pointerImg: 'http://dl.hfrong.cn/osstest/1646970424929-1.png',
      CALLBACK: {
        type: 'code',
        code: `
        function fn(props) {
           console.log(props)
        }
        `,
      },
      num: 8,
      isPointerRotate: 1,
      direction: 0,
      pointerWidth: '120px',
      pointerLeft: '',
      pointerTop: '',
    }

    const targetProps = dealProps(demoProps)

    const cb = (index: Number) => {
      e.emit(`${targetProps.id}-start`, index)
    }

    return {
      cb,
      targetProps,
    }
  },
})
</script>

<template>
  <button @click="cb(3)">
    转盘抽奖
  </button>
  <div class="corona-box2 corona-box">
    <ActDemo v-bind="targetProps" />
  </div>
  <br>
</template>

<style lang="less" scoped>
.corona-box2 {
  position: relative;
}
</style>
