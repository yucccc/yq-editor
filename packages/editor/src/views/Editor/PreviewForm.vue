<script lang="ts">
import { computed, defineComponent, onMounted, reactive } from 'vue'
import { sleep } from '@yq-editor/shared'
import { useEditorStore } from '@/store/editor'
import { generateQRCode } from '@/shared'
import PhoneView from '@/components/PhoneView.vue'
export default defineComponent({
  components: { PhoneView },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    url: {
      type: String,
      default: '',
    },
  },
  emits: ['update:visible'],
  setup(props, { emit }) {
    const store = useEditorStore()
    const pageState = computed(() => store.page)
    const previewURL = computed(() => props.url)
    const form = reactive({
      ...pageState.value,
    })

    onMounted(async () => {
      try {
        await sleep(100)
        await generateQRCode('preview-barcode-container', previewURL.value)
      }
      catch (e) {}
    })

    const validateAndSave = async () => {
      emit('update:visible', false)
    }

    const onCancel = () => {
      emit('update:visible', false)
    }
    return {
      pageState,
      previewURL,
      form,
      onCancel,
      validateAndSave,
    }
  },
})
</script>

<template>
  <div v-if="visible" class="preview-form">
    <div class="final-preview">
      <PhoneView teleport="body" :url="previewURL" :title="form.title" />
    </div>

    <a-drawer
      title="页面信息"
      placement="right"
      width="400"
      :mask-closable="false"
      closable
      :visible="visible"
      @close="onCancel"
    >
      <div class="publish-form-container">
        <a-row type="flex" align="middle" :style="{ marginBottom: '20px' }">
          <a-col :span="6">
            扫码预览：
          </a-col>
          <a-col :span="10">
            <canvas id="preview-barcode-container" />
          </a-col>
        </a-row>
        <a-row type="flex" align="middle" :style="{ marginBottom: '20px' }">
          <a-col :span="6">
            页面链接：
          </a-col>
          <a-col :span="18">
            <a :href="url" target="_blank">{{ url }}</a>
          </a-col>
        </a-row>
      </div>
    </a-drawer>
  </div>
</template>

<style>
.final-preview {
  position: absolute;
  width: calc(100% - 400px);
  height: 100%;
  background: transparent;
  top: 0;
  left: 0;
  z-index: 19;
  display: flex;
  align-items: center;
  justify-content: center;
}

.publish-form-container .file-upload-container {
  height: 130px;
}
.publish-form-container .ant-form-item-label {
  text-align: left;
}
#preview-barcode-container {
  border: 2px dotted #efefef;
  padding: 10px;
}
</style>
