<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import ActDemo from './index.vue'
import e from '@/utils/emit'
import dealProps from '@/utils/test'
const stopIndex = 3
export default defineComponent({
  components: {
    ActDemo,
  },
  // https://yq-editor-oss.oss-cn-guangzhou.aliyuncs.com/hd_activities/1660284946218-apple-touch-icon.png
  setup() {
    // 是否在编辑子项目
    const currentSubId = ref<number | string | null>(null)
    const currentElementId = ref<any>('')

    const setActive = (id: string) => {
      currentElementId.value = id
    }
    const obj = {
      name: 'act-track',
      layerName: '轨道组件1',
      id: '3333',
      subComponentName: 'act-base-image',
      props: {
        id: '3333',
        name: 'act-track',
        layerName: '轨道组件',
        position: 'absolute',
        left: '58px',
        top: '165px',
        width: '266px',
        height: '330.3125px',
        circle: 3,
        direction: 'observe',
        CALLBACK_END: {
          type: 'popup',
          code: 'function fn(props) {\r\n    console.log(props)\r\n}',
          popup: {
            popupConfig: {
              popup1: {
                template: 'gift',
                content: '',
                width: '300px',
                title: '',
                backgroundImage:
                  'url(\'https://yq-editor-oss.oss-cn-guangzhou.aliyuncs.com/hd_activities/1660284946218-apple-touch-icon.png\')',
                contentStyle: '{\r\n    "paddingTop":"70px"\r\n}',
                templateProps: {
                  list: {
                    arrange: [
                      {
                        key: 'imgUrl',
                        style: '',
                        type: 'img',
                        _key: 'd5365ffa-1d97-4af1-bc99-0966bc65fe5f',
                      },
                    ],
                  },
                },
              },
            },
            currentUsePopupKey: 'popup1',
            requestConfig: {
              apiName: 'luck',
              isClickRequest: false,
              sourceDataKey: 'luck.data.giftList',
              useCache: false,
              successPopupKey: 'popup1',
              errorPopupKey: '',
              finallyPopupKey: '',
            },
          },
        },
        activeImage: 'http://dl.hfrong.cn/osstest/1648460777724-活動 規則 .png',
        subComponent: [
          {
            width: '40px',
            height: '40px',
            position: 'absolute',
            left: '0px',
            top: '0px',
            src: 'http://wework.qpic.cn/wwhead/duc2TvpEgSQO4BpE0WZSZ86K1VgkiayADxCOA4fOyEGCIUSR4G5ZO4np3T1qkNibprrYdngY5BbsE/100',
          },
          {
            width: '40px',
            height: '40px',
            position: 'absolute',
            left: '229.5px',
            top: '-31px',
          },
          {
            width: '40px',
            height: '40px',
            position: 'absolute',
            left: '170.5px',
            top: '312px',
          },
          {
            width: '40px',
            height: '40px',
            position: 'absolute',
            left: '109px',
            top: '-35.296875px',
          },
          {
            width: '40px',
            height: '40px',
            position: 'absolute',
            left: '250px',
            top: '170px',
          },
          {
            width: '40px',
            height: '40px',
            position: 'absolute',
            left: '64px',
            top: '300.369375px',
          },
          {
            width: '40px',
            height: '40px',
            position: 'absolute',
            left: '0px',
            top: '170px',
          },
          {
            width: '40px',
            height: '40px',
            position: 'absolute',
            left: '0px',
            top: '80px',
          },
        ],
      },
    }

    const testComponent = reactive(dealProps(obj))

    const handleClick = () => {
      e.emit('3333-start', stopIndex)
    }

    return {
      stopIndex,
      handleClick,
      testComponent,
      currentSubId,
      currentElementId,
      setActive,
    }
  },
})
</script>

<template>
  <div class="act-demo-track">
    <h2>正常使用</h2>

    <ActDemo v-bind="testComponent.props" is-editing />
    <button @click="handleClick">
      正常使用触发九宫格
    </button>

    <h2>使用编辑器</h2>

    <!-- 问题(已解决)1、 用户不想感知应该传递什么字段下去 因此最好subComponent就是所需
      但是通常有些公共配置 合并到子级 进行覆盖  -->
    <edit-wrapper
      :id="testComponent.id"
      :props="testComponent.props"
      :active="testComponent.id === currentElementId"
      @set-active="setActive"
    >
      <ActDemo v-bind="testComponent.props" is-editing>
        <edit-wrapper
          v-for="(subProps, subIndex) in testComponent.props.subComponent"
          :id="`${testComponent.id}-sub-${subIndex}`"
          :key="subIndex"
          :props="subProps"
          :active="`${testComponent.id}-sub-${subIndex}` === currentElementId"
          @set-active="setActive"
        >
          <component
            :is="testComponent.subComponentName"
            v-bind="subProps"
          />
        </edit-wrapper>
      </ActDemo>
    </edit-wrapper>

    <button @click="handleClick">
      使用编辑器触发九宫格
    </button>
  </div>
</template>

<style>
.act-demo-track {
  position: relative;
  height: 500px;
}
</style>
