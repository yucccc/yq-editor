<script lang="ts">
/***
 * 多图上传 组件
 */
import { log } from 'console'
import draggable from 'vuedraggable'
import { DeleteOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { computed, defineComponent, reactive, ref, toRaw, watch } from 'vue'
import type { PropType } from 'vue'
import { isString, throttle } from 'lodash-es'
import type { UploadProps } from 'ant-design-vue'
import { useEditorStore } from '@/store/editor'
import type { PreSettingType } from '@/components/PreSetting.vue'
import type { RespData } from '@/api/response'
interface FileItem {
  uid: string
  name?: string
  status?: string
  response?: string
  url?: string
  type?: string
  size: number
  originFileObj: any
}
type UpdateType = RespData<string>

type ValueType = string[] | { src: string }[]
interface FileImg {
  uid: string
  url: string
  status: 'done' | 'uploading' | 'error'
  name: string
}

export default defineComponent({
  name: 'MoreUploader',
  props: {
    // 最多可上传数量
    maxNam: {
      type: Number,
      default: 99,
    },
    // 图大小保持在 XX M以内
    size: {
      type: Number,
      default: 2,
    },
    /**
     * 支持图片数组以及对象包含图片
     */
    value: {
      type: Array as PropType<ValueType>,
      default: () => [],
    },
    commitType: {
      type: String,
      default: 'string',
    },
  },
  components: {
    PlusOutlined,
    EyeOutlined,
    DeleteOutlined,
    Draggable: draggable,
  },
  emits: ['change', 'update:value'],
  setup(props, ctx) {
    const store = useEditorStore()

    const preSetting = computed<PreSettingType>(() => store.preSetting)
    const initFileList = (): UploadProps['fileList'] => {
      return props.value.map((item, index) => {
        return {
          uid: `${index}`,
          url: isString(item) ? item : item.src,
          name: '图片',
          status: 'done',
          // 存储一下原始数据 回传时需要
          sourceValue: item,
        }
      })
    }

    // 将数据处理成所需格式
    const fileList = ref<UploadProps['fileList']>(initFileList())

    const state = reactive({
      previewVisible: false,
      previewImage: '',
      fileList: [] as FileImg[],
    })

    const handlePreview1 = (src: string) => {
      state.previewImage = src
      state.previewVisible = true
    }
    // 将数据原样返回
    const commitValue = function (value: { [key: string]: any; response: UpdateType }[]) {
      let commit = []
      if (value.length) {
        const isObj = props.commitType === 'object'
        // 没删除完
        commit = value.map((item) => {
          // 代表是本次上传的
          const isUpdateUrl = item.response?.data
          const src = isUpdateUrl || item.url
          let res = isObj
            ? {
                position: 'absolute',
                src,
              }
            : src // 原始数据是传递了一个数组
          // 之前存在的数据
          if (!isUpdateUrl && isObj) {
            res = {
              ...item.sourceValue,
              ...res,
            }
          }

          return res
        })
      }

      ctx.emit('change', commit)
      ctx.emit('update:value', commit)
    }

    const handleCancel = () => {
      state.previewVisible = false
    }
    const throttleC = throttle(commitValue, 300, { leading: false })
    watch(fileList, (newValue: any) => {
      throttleC(newValue)
    })

    const beforeUpload = (file: FileItem, fileList: object[]) => {
      const isJpgOrPng
        = file.type === 'image/jpeg'
        || file.type === 'image/png'
        || file.type === 'image/jpg'
        || file.type === 'image/gif'
      if (!isJpgOrPng) {
        message.error('Please upload picture format')
      }
      const maxLength = state.fileList.length + fileList.length <= props.maxNam
      if (!maxLength) {
        message.error(`最多上传${props.maxNam}张图片`)
      }
      const isLt2M = file.size / 1024 / 1024 < props.size
      if (!isLt2M) {
        message.error(`Image must smaller than ${props.size}MB!`)
      }
      return isJpgOrPng && isLt2M && maxLength
    }

    return {
      fileList,
      state,
      beforeUpload,
      handleCancel,
      handlePreview1,
      preSetting,
      isString,
      drag: false,
    }
  },
})
</script>

<template>
  <div class="more-uploader">
    <!-- <draggable
      class="drag_box"
      v-model="fileList"
      group="people"
      @start="drag = true"
      @end="drag = false"
      item-key="index"
    >
      <template #item="{ element }"> -->
    <a-upload
      v-model:file-list="fileList"
      accept="image/*"
      list-type="picture-card"
      :action="`/api/utils/uploader?sn=${preSetting.shortName}`"
      :before-upload="beforeUpload"
    >
      <div>
        <PlusOutlined />
        <div style="margin-top: 8px">
          Upload
        </div>
      </div>
    </a-upload>
    <!-- </template>
    </draggable> -->

    <a-modal :visible="state.previewVisible" :footer="null" @cancel="handleCancel">
      <img alt="example" style="width: 100%" :src="state.previewImage">
    </a-modal>
  </div>
</template>

<style lang="less" scoped>
.tem {
  display: flex;
  flex-wrap: wrap;
  min-width: 85px;
  height: 85px;
}
.drag_box {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}
.drag:not(.last) {
  display: inline-block;
  width: 85px;
  height: 85px;
  padding: 8px;
  box-sizing: border-box;
  border: 1px solid #d9d9d9;
  border-radius: 2px;
  margin: 0 8px 8px 0;
  cursor: move;
  .over {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
  }
  .mask {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    opacity: 0;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    color: #fff;
    font-size: 16px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
  }
  .anticon {
    margin: 0 3px;
    cursor: pointer;
  }
  &:hover {
    .mask {
      opacity: 1;
    }
  }
  img {
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }
}
:deep(.ant-upload-list > div) {
  width: 95px;
  height: 95px;
  margin: 0;
}
:deep(.ant-upload-list-picture-card .ant-upload-list-item) {
  width: 85px;
  height: 85px;
}
:deep(.ant-upload.ant-upload-select-picture-card) {
  width: 85px;
  height: 85px;
  margin: 0;
}
</style>
