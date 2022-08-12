<script lang="ts">
import { defineComponent } from 'vue'
import { FileImageOutlined, LoadingOutlined } from '@ant-design/icons-vue'
import Uploader from './Uploader.vue'
import { commonUploadCheck } from '@/shared'
export default defineComponent({
  components: {
    Uploader,
    FileImageOutlined,
    LoadingOutlined,
  },
  props: {
    text: {
      type: String,
      default: '上传图片',
    },
    showUploaded: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['success'],
  setup(props, { emit }) {
    const handleUploadSuccess = (resp: any, file: File) => {
      emit('success', { resp, file })
    }
    return {
      commonUploadCheck,
      handleUploadSuccess,
    }
  },
})
</script>

<template>
  <Uploader
    class="styled-uploader"
    action="/api/utils/uploader"
    :show-upload-list="false"
    :before-upload="commonUploadCheck"
    @success="
      (data) => {
        handleUploadSuccess(data.resp, data.file.raw)
      }
    "
  >
    <div class="uploader-container">
      <FileImageOutlined />
      <h4>{{ text }}</h4>
    </div>
    <template #loading>
      <div class="uploader-container">
        <LoadingOutlined spin />
        <h4>上传中</h4>
      </div>
    </template>
    <template #uploaded="dataProps">
      <div class="uploader-container">
        <img v-if="showUploaded" :src="dataProps.uploadedData.data.urls[0]">
        <template v-else>
          <FileImageOutlined />
          <h4>{{ text }}</h4>
        </template>
      </div>
    </template>
  </Uploader>
</template>

<style lang="less">
.styled-uploader {
  .uploader-container {
    width: 100px;
    padding: 10px;
    color: #ffffff;
    background: #1890ff;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  }
  .uploader-container:hover {
    background: #40a9ff;
  }
  .uploader-container h4 {
    color: #ffffff;
    margin-bottom: 0;
    margin-left: 10px;
  }
  .uploader-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
