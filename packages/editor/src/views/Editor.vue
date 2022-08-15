<script lang="ts" setup>
import { computed, nextTick, reactive, ref, watch } from 'vue'

import { useRoute } from 'vue-router'
import { AppstoreOutlined, HomeOutlined, QuestionOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { pickBy } from 'lodash-es'
import { setUrlQuery } from '@yq-editor/shared'
import type { ComponentData } from '@yq-editor/global-types'
import defaultComponentTemplates from '../config/defaultComponentTemplate'
import { downloadApi, previewLocalWorkApi, publishWorkApi, publishWorkTemplateApi } from '../api/index'
import initHotKeys, { hotKeyTips } from '../plugins/hotKeys'
import PageSettings from './Editor/PageSetting.vue'
import PreviewForm from './Editor/PreviewForm.vue'
import ComponentTemplate from '@/components/ComponentTemplate.vue'
import ComponentLayer from '@/components/ComponentLayer.vue'
import PropertiesPanel from '@/components/PropertiesPanel.vue'
import EditWrapper from '@/components/EditWrapper/EditWrapper.vue'
import DataSource from '@/components/DataSource.vue'
import MyHeader from '@/components/Header.vue'
import {
  bgUrlToSrc,
  downloadBlobData,
  generateQRCode,
  getDomScreenshotImg,
  runCodeWithFunction,
  strGetSourceData,
} from '@/shared'
import { subComponentJoinId } from '@/global'
import { useEditorStore } from '@/store/editor'
initHotKeys()
const route = useRoute()
const scrollBox = ref<HTMLLIElement>()
const eStore = useEditorStore()

const preSetting = computed(() => eStore.preSetting)
const components = computed(() => eStore.components)
const page = computed(() => eStore.page)
const apiConfig = computed(() => eStore.page.apiConfig)
const currentElementId = computed(() => eStore.currentElementId)
const pickPageStyle = computed(() => pickBy(eStore.page.props, (val, key) => {
  if (eStore.page.props.isUseBgToImg) {
    return key !== 'backgroundImage'
  }
  return val
}))

const mainCanvasDom = ref(null)
const state = reactive({
  canvasFix: false,
  sourceModalVisible: false,
  dataSourceVisible: false,
  componentActiveKey: '1',
  activeKey: '1',
  apiConfig: apiConfig.value,
  isChangeApi: false,
  previewUrl: 'preview.html',
  previewLocalUrl: '',
  previewVisible: false,
})

// 初始化将sourceDataKey解析一遍 赋值给text
const emitText = (components: ComponentData[], res: any) => {
  components.forEach((component) => {
    const { sourceDataKey, handleSourceData } = component.props
    if (sourceDataKey) {
      let text = strGetSourceData(res, sourceDataKey)
      if (handleSourceData) {
        text = runCodeWithFunction(handleSourceData, text)
      }
      eStore.updateComponent({
        key: 'text',
        value: text,
        id: component.id,
        record: false,
      })
    }
  })
}
// 初始化
eStore.setDefaultWork(route.params.id as string).then(() => {
  eStore.initApiData().then((res) => {
    emitText(components.value, res)
  })
})

const addItem = (component: ComponentData) => {
  const scroll = scrollBox.value
  let targetProps = { ...component }
  const top = scroll ? `${scroll.scrollTop.toFixed(1)}px` : 0
  if (top) {
    targetProps = { ...targetProps, props: { ...targetProps.props, top } }
  }
  eStore.addComponent(targetProps)
}

const handleChange = (e: any) => {
  eStore.updateComponent(e)
}

const setActive = (id: string) => {
  eStore.setActive(id)
}

const updatePosition = (data: { left: number; top: number; id: string }) => {
  const { id } = data
  const updatedData = pickBy<number>(data, (v, k) => k !== 'id')
  const keysArr = Object.keys(updatedData)
  const valuesArr = Object.values(updatedData).map(v => `${v}px`)
  eStore.updateComponent({ key: keysArr, value: valuesArr, id })
}
const updatePositionSubComponent = (data: { left: number; top: number; id: string }) => {
  const { id } = data
  const normalizeId = id.split(subComponentJoinId)
  const originalId = normalizeId[0]
  const arrayIndex = Number(normalizeId[1])

  if (!arrayIndex && arrayIndex !== 0) { return }

  const updatedData = pickBy<number>(data, (v, k) => k !== 'id')
  const updatedDataAndPx: Record<string, string> = {}
  for (const key in updatedData) {
    updatedDataAndPx[key] = `${updatedData[key]}px`
  }

  eStore.updateComponent({
    key: 'subComponent',
    value: updatedDataAndPx,
    arrayIndex,
    id: originalId,
  })
}

const save = async () => {
  const screenshotImgUrl = await getDomScreenshotImg(mainCanvasDom.value as unknown as Node, preSetting.value.shortName)
  await eStore.updatePage('page.props.screenshotImage', screenshotImgUrl)
  await eStore.saveWork(route.params.id as string)
}

const publishWorkModalReact = reactive({
  showPublish: false,
  url: '',
})
const publish = async ({ isTemplate = false }) => {
  await save()
  const key = 'publishing'
  message.loading({ content: '发布中...', duration: 0, key })
  const publicApi = isTemplate ? publishWorkTemplateApi : publishWorkApi
  publicApi(route.params.id as string)
    .then((res) => {
      publishWorkModalReact.showPublish = true
      publishWorkModalReact.url = res.data.url
    })
    .catch((err) => {
      message.success('发布失败', err)
    })
    .finally(() => {
      message.success({ content: '发布成功!', key, duration: 2 })
    })
}

const handleOk = () => {
  publishWorkModalReact.showPublish = false
}

const preview = async (previewApi: any, callback: Function) => {
  await save()
  const key = 'previewing'
  message.loading({ content: '预览页面生成中...', duration: 0, key })
  previewApi(route.params.id as string)
    .then((res: any) => {
      if (res.errCode === 0) {
        callback(res.data)
        return
      }
      throw res
      // publishWorkModalReact.showPublish = true
      // publishWorkModalReact.url = res.data.url
    })
    .catch((err: any) => {
      message.success('预览失败', err)
    })
    .finally(() => {
      message.success({ content: '预览页面生成成功!', key, duration: 2 })
    })
}

const showLocalPreview = async () => {
  console.log('%c [ showLocalPreview ]-189-「Editor」', 'font-size:13px; background:pink; color:#bf2c9f;')
  if (state.previewVisible) { return false }
  preview(previewLocalWorkApi, async (data: any) => {
    console.log('%c [ data ]-191-「Editor」', 'font-size:13px; background:pink; color:#bf2c9f;', data, preSetting)

    if (preSetting.value.userInfo) {
      let userInfo = preSetting.value.userInfo
      userInfo = Object.keys(userInfo).reduce((t, c) => {
        t[c] = encodeURIComponent(userInfo[c])
        return t
      }, {})
      state.previewLocalUrl = setUrlQuery(userInfo, data.url)
    }
    else {
      state.previewLocalUrl = data.url
    }
    state.previewVisible = true
  })
}

watch(
  () => state.previewVisible,
  async (v: boolean) => {
    if (v) {
      await nextTick(() => {
        generateQRCode('preview-barcode-container', state.previewLocalUrl, 120)
      })
    }
  },
)

const downloadSource = async () => {
  await eStore.saveWork(route.params.id as string)
  downloadApi(route.params.id).then((res: any) => {
    downloadBlobData(res, `${route.params.id}-${preSetting.value?.uuid}`)
  })
}
const blur = () => {
  eStore.setActive('')
}
</script>

<template>
  <div class="editor-container">
    <a-layout>
      <MyHeader>
        <template #right>
          <div>
            <a-button size="large" @click="publish">
              发布
            </a-button>
          </div>

          <div>
            <a-button size="large" @click="publish({ isTemplate: true })">
              发布为模板
            </a-button>
          </div>

          <div>
            <a-button size="large" @click="save">
              保存作品
            </a-button>
          </div>
        </template>
      </MyHeader>
    </a-layout>

    <a-layout>
      <a-layout-sider width="400" class="cu-layout-sider bg-color-none component-template-box">
        <a-tabs v-model:activeKey="state.componentActiveKey" tab-position="left">
          <a-tab-pane key="1">
            <template #tab>
              <span>
                <HomeOutlined /> 基础
              </span>
            </template>
            <ComponentTemplate :list="defaultComponentTemplates.base" @on-item-click="addItem" />
          </a-tab-pane>

          <a-tab-pane key="2">
            <template #tab>
              <span>
                <AppstoreOutlined /> 业务
              </span>
            </template>
            <div class="scroll">
              <ComponentTemplate :list="defaultComponentTemplates.business" @on-item-click="addItem" />
            </div>
          </a-tab-pane>

          <!-- <a-tab-pane key="3" tab="我的图库" class="my-imgs-box"> </a-tab-pane> -->
        </a-tabs>
      </a-layout-sider>

      <a-layout class="canvas-content-box">
        <div class="canvas-content-top">
          <div class="edit-preview">
            <a-button size="large" type="primary" @click="state.previewVisible = false">
              编辑
            </a-button>

            <a-button size="large" @click="showLocalPreview">
              预览
            </a-button>

            <a-button size="large" @click="downloadSource">
              下载
            </a-button>
          </div>
        </div>

        <PreviewForm
          :url="state.previewLocalUrl" :visible="state.previewVisible" @update:visible="
            (v) => {
              state.previewVisible = v
            }
          "
        />

        <a-layout-content class="preview-container">
          <div id="canvas-area" ref="scrollBox" class="preview-list" :class="{ 'canvas-fix': state.canvasFix }">
            <div ref="mainCanvasDom">
              <div class="body-container" :style="pickPageStyle" @click.self="blur">
                <img
                  v-if="page.props.isUseBgToImg && bgUrlToSrc(page.props.backgroundImage)" draggable="false"
                  class="bg" :src="bgUrlToSrc(page.props.backgroundImage)" alt="background-image" @click.self="blur"
                >
                <template v-for="component in components" :key="component.id">
                  <EditWrapper
                    v-if="!component.isHidden" :id="component.id" :props="component.props"
                    :is-active="component.id === currentElementId" el="#canvas-area" @set-active="setActive"
                    @update-position="updatePosition"
                  >
                    <!-- 父组件 -->
                    <component :is="component.name" v-bind="component.props" is-editing>
                      <EditWrapper
                        v-for="(subProps, subIndex) in component.props.subComponent"
                        :id="`${component.id}${subComponentJoinId}${subIndex}`" :key="subIndex" el="#canvas-area"
                        :props="subProps"
                        :is-active="`${component.id}${subComponentJoinId}${subIndex}` === currentElementId"
                        :parent-props="component.props" @set-active="setActive"
                        @update-position="updatePositionSubComponent"
                      >
                        <component :is="component.props.subComponentName" v-bind="subProps" is-editing />
                      </EditWrapper>
                    </component>
                  </EditWrapper>
                </template>
              </div>
            </div>
          </div>
        </a-layout-content>

        <a-popover title="快捷键" trigger="click">
          <template #content>
            <a-list bordered :data-source="hotKeyTips">
              <template #renderItem="{ item }">
                <a-list-item>{{ item }}</a-list-item>
              </template>
            </a-list>
          </template>

          <a-button shape="circle" class="help-btn">
            <template #icon>
              <QuestionOutlined />
            </template>
          </a-button>
        </a-popover>
      </a-layout>

      <a-layout-sider width="300" class="cu-layout-sider bg-color-none">
        <a-tabs v-model:activeKey="state.activeKey" centered class="editor-panel">
          <a-tab-pane key="1" class="properties-panel-box" tab="属性设置">
            <a-empty v-if="!eStore.currentElement" description="当前无选择元素" />
            <PropertiesPanel
              v-else :properties="eStore.currentElement.props" :current-element="eStore.currentElement"
              @change="handleChange"
            />
          </a-tab-pane>

          <a-tab-pane key="2" tab="图层设置">
            <ComponentLayer
              :components="components" :current-component-id="currentElementId" @change="handleChange"
              @select-layer="setActive"
            />
          </a-tab-pane>

          <a-tab-pane key="3" tab="页面设置" class="properties-panel-box">
            <PageSettings />
          </a-tab-pane>
        </a-tabs>
      </a-layout-sider>
    </a-layout>

    <div class="affix">
      <a-button
        shape="circle" class="source" size="large" type="primary"
        @click="state.sourceModalVisible = !state.sourceModalVisible"
      >
        数据源
      </a-button>

      <DataSource v-model:visible="state.sourceModalVisible" />
    </div>

    <a-modal v-model:visible="publishWorkModalReact.showPublish" title="发布成功" @ok="handleOk">
      <p>访问地址: <a :href="`http:${publishWorkModalReact.url}`">{{ publishWorkModalReact.url }}</a> </p>
    </a-modal>
  </div>
</template>

<style lang="less">
.header {
  color: #fff;
  display: flex;
  font-size: 16px;
  justify-content: space-between;
}

.editor-container {
  height: 100%;
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
}

.editor-container .preview-container {
  margin: 0;
  min-height: 85vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  user-select: none;
}
.scroll {
  overflow: auto;
  height: calc(100vh - 64px);
}
.editor-container .preview-list {
  box-shadow: 1px 1px 15px rgb(0 0 0 / 20%);
  padding: 0;
  margin: 0px 0px 0px;
  width: 375px;
  background: #fff;
  overflow-x: hidden;
  position: fixed;
  overflow-y: scroll;
  height: calc(100% - 150px);
  > div {
    height: 100%;
  }
  &::-webkit-scrollbar {
    display: none;
  }
}

.component-template-box {
  .ant-tabs-left {
    height: 100%;
  }
}

.my-imgs-box {
  .uploader-btn {
    width: 100%;
  }
}

.canvas-content-box {
  background-color: #f0f1f8;
  position: relative;
  .help-btn {
    position: absolute;
    bottom: 10px;
    right: 10px;
  }
  .canvas-content-top {
    text-align: center;
    padding: 10px;
    .edit-preview {
      > .ant-btn {
        margin: 0 5px;
      }
    }
  }
}
.body-container {
  .bg {
    width: 100%;
    display: block;
  }
}
.source {
  height: 80px;
  width: 80px;
}
.affix {
  position: fixed;
  left: 10px;
  bottom: 10px;
}

.editor-panel {
  .properties-panel-box {
    padding: 10px 16px 24px;
    height: calc(100vh - 120px);
    overflow-y: auto;
    overflow-x: hidden;
    &::-webkit-scrollbar {
      display: none;
    }
  }
}
.ant-tabs-left > .ant-tabs-content-holder > .ant-tabs-content > .ant-tabs-tabpane {
  padding-left: 0px;
}
</style>
