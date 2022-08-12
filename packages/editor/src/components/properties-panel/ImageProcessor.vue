<script lang="ts">
/***
 * 基于Uploader的二次封装
 */
import { DeleteOutlined, LoadingOutlined, PlusOutlined, ScissorOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { computed, defineComponent, nextTick, ref, watch } from 'vue'
import Cropper from 'cropperjs'
import type { RespData } from '@/api/response'
import { bgUrlToSrc, srcToBgUrl } from '@/shared'
import 'cropperjs/dist/cropper.css'
import { useEditorStore } from '@/store/editor'

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

interface FileInfo {
  file: FileItem
  fileList: FileItem[]
}
interface CropDataProps {
  x: number
  y: number
  width: number
  height: number
}

export default defineComponent({
  name: 'ImageProcessor',
  components: {
    LoadingOutlined,
    PlusOutlined,
    ScissorOutlined,
    DeleteOutlined,
  },
  props: {
    value: {
      type: String,
      default: '',
    },
    srcToBg: {
      type: Boolean,
      default: false,
    },
  },
  // 注意：model的方式不上传宽高
  emits: ['change', 'update:value'],
  setup(props, ctx) {
    const store = useEditorStore()
    const preSetting = computed(() => store.preSetting)
    const fileList = ref([])
    const loading = ref<boolean>(false)
    const showModal = ref<boolean>(false)
    const cropperImg = ref<null | HTMLImageElement>(null)
    const commitValue = (v: string) => (props.srcToBg ? srcToBgUrl(v) : v)

    const handleChange = (info: FileInfo) => {
      if (info.file.status === 'uploading') {
        loading.value = true
        return
      }
      if (info.file.status === 'done') {
        // @ts-expect-error
        const res = info.file.response as RespData<string>
        // TODO:
        // 1、可优化 不上传先 点确定的时候再上次
        // 2、设计大图片上传逻辑 断点续传 切片实现等?
        if (!res.errCode) {
          const img2 = new Image()
          img2.onload = function () {
            const w = this.width
            const h = this.height
            ctx.emit('change', {
              src: commitValue(res.data),
              width: w,
              height: h,
            })
            ctx.emit('update:value', commitValue(res.data))
          }
          img2.src = URL.createObjectURL(info.file.originFileObj)
          message.success('上传成功')
        }
        else {
          message.error(res.message || '上传失败')
        }

        loading.value = false
      }
      if (info.file.status === 'error') {
        loading.value = false
        message.error('upload error')
      }
    }

    const beforeUpload = (file: FileItem) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif'
      if (!isJpgOrPng) {
        message.error('You can only upload JPG file!')
      }
      const isLt10M = file.size / 1024 / 1024 < 10
      if (!isLt10M) {
        message.error('图片太大了 超过 10MB!')
      }
      return isJpgOrPng && isLt10M
    }
    const handleDelete = () => {
      ctx.emit('change', {
        src: '',
        width: 0,
        height: 0,
      })
      ctx.emit('update:value', '')
    }

    let cropper: Cropper
    let cropData: CropDataProps | null = null
    watch(showModal, async (newValue) => {
      if (newValue) {
        await nextTick()
        if (cropperImg.value) {
          cropper = new Cropper(cropperImg.value, {
            crop(event) {
              const { x, y, width, height } = event.detail
              cropData = {
                x: Math.floor(x),
                y: Math.floor(y),
                width: Math.floor(width),
                height: Math.floor(height),
              }
            },
          })
        }
      }
      else {
        if (cropper) {
          cropper.destroy()
        }
      }
    })

    const handleOk = () => {
      // 裁剪后的阿里会携带'?'
      const newSrc = props.value.split('?')[0]
      if (cropData) {
        const { x, y, width, height } = cropData
        const cropperURL = `${newSrc}?x-oss-process=image/crop,x_${x},y_${y},w_${width},h_${height}`
        ctx.emit('change', {
          src: commitValue(cropperURL),
          width,
          height,
        })
        ctx.emit('update:value', commitValue(cropperURL))
      }
      showModal.value = false
    }

    return {
      fileList,
      loading,
      handleChange,
      beforeUpload,
      handleDelete,
      handleOk,
      cropperImg,
      showModal,
      bgUrlToSrc,
      preSetting,
    }
  },
})
</script>

<template>
  <div class="uploader-box">
    <a-upload
      v-model:file-list="fileList" name="avatar" list-type="picture-card" class="avatar-uploader"
      :show-upload-list="false" :action="`/api/utils/uploader?sn=${preSetting.shortName}`" :before-upload="beforeUpload"
      @change="handleChange"
    >
      <img v-if="value" :src="srcToBg ? bgUrlToSrc(value) : value" alt="图片">
      <div v-else>
        <LoadingOutlined v-if="loading" />
        <PlusOutlined v-else />
        <div class="ant-upload-text">
          上传图片
        </div>
      </div>
    </a-upload>
    <div class="options">
      <a-button danger :disabled="!value" @click="showModal = !showModal">
        <template #icon>
          <ScissorOutlined />
        </template>
        裁剪
      </a-button>
      <a-button danger :disabled="!value" @click="handleDelete">
        <template #icon>
          <DeleteOutlined />
        </template>
        删除
      </a-button>
    </div>
    <a-modal
      v-model:visible="showModal" destroy-on-close title="裁剪图片" ok-text="确认" cancel-text="取消" @ok="handleOk"
      @cancel="showModal = false"
    >
      <div class="image-cropper">
        <img id="processed-image" ref="cropperImg" alt="图片裁切" :src="srcToBg ? bgUrlToSrc(value) : value">
      </div>
    </a-modal>
  </div>
</template>

<style lang="less">
.ant-upload-picture-card-wrapper {
  width: auto;
}

.avatar-uploader > .ant-upload {
  overflow: auto;
  width: 128px;
  height: 128px;
  &::-webkit-scrollbar {
    width: 4px;
    height: 1px;
  }

  &::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 10px;
    background: #a3f8a7;
  }

  &::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    border-radius: 10px;
    background: #c9cccb;
  }
  img {
    width: 100%;
  }
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
.uploader-box {
  display: flex;
  .options {
    > button {
      margin-bottom: 10px;
      display: block;
      width: 100%;
    }
  }
}

.image-cropper img {
  display: block;
  /* This rule is very important, please don't ignore this */
  max-width: 100%;
}
</style>
