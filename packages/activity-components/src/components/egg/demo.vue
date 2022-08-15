<script lang="ts">
import { defineComponent, ref } from 'vue'
import dealProps from '../../utils/test'
import e from '../../utils/emit'
import ActDemo from './index.vue'

export default defineComponent({
  components: {
    ActDemo,
  },
  setup() {
    const egg = ref(null)

    const obj = {
      id: 'afc5fc1f-5e2f-45ff-a3c7-f8252b598372',
      name: 'act-egg',
      left: '10px',
      top: '200px',
      width: '150px',
      height: '150px',
      eggImgAry: [
        'http://dl.hfrong.cn/osstest/1638519276393-c1-0bd05bcc59.png',
        'http://dl.hfrong.cn/osstest/1638519293912-c2-6506b08801.png',
        'http://dl.hfrong.cn/osstest/1638519314078-c3-e81abfa2c2.png',
        'http://dl.hfrong.cn/osstest/1638519334811-c4-5448cb87bc.png',
        'http://dl.hfrong.cn/osstest/1638519354267-c5-0c78cdbcb3.png',
        'http://dl.hfrong.cn/osstest/1638519293912-c2-6506b08801.png',
      ],
      CALLBACK: {
        type: 'code',
        code: 'function fn(props) {\r\n    console.log(props)\r\n}',
      },
    }

    const targetProps = dealProps(obj)

    const cb = () => {
      e.emit(`${targetProps.id}-start`)
    }

    return {
      egg,
      cb,
      targetProps,
    }
  },
})
</script>

<template>
  <div class="turn_egg_box">
    <ActDemo ref="egg" v-bind="targetProps" />
  </div>
  <br>
  <button @click="cb()">
    扭蛋动画
  </button>
</template>

<style lang="less" scoped></style>
