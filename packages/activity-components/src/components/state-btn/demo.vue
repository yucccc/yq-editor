<script lang="ts">
import { defineComponent, ref } from 'vue'
import ActStateBtn from './index.vue'
const stateConfig = [
  {
    text: '已签到',
    key: '1',
    imgSrc: 'http://dl.hfrong.cn/osstest/1642402434914-addOff.png',
    disabled: false,
    actionConfig: {
      code: 'function f(){\r\n    console.log(已签到)\r\n}',
      type: 'code',
    },
  },
  {
    text: '可签到',
    key: '0',
    imgSrc: 'http://dl.hfrong.cn/osstest/1642402533398-addOn.png',
    actionConfig: {
      code: 'function f(){\r\n    console.log(可签)\r\n}',
      type: 'code',
    },
    disabled: false,
  },
]
export default defineComponent({
  components: {
    ActStateBtn,
  },
  setup() {
    const handleClick = ({ actionConfig }: any) => {
      console.log(actionConfig)
    }
    const currentKey = ref('1')

    // setTimeout(() => {
    //   currentKey.value = '0'
    // }, 1000)

    return {
      currentKey,
      handleClick,
      stateConfig,
    }
  },
})
</script>

<template>
  <ActStateBtn
    id="1"
    :is-editing="false"
    current-img-src="http://dl.hfrong.cn/osstest/1642477051082-got.png"
    :state-config="stateConfig"
    :text="currentKey"
    @biz$HandleActionFn="handleClick"
  />
</template>

<style lang="less" scoped>
.sign-in {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}
</style>
