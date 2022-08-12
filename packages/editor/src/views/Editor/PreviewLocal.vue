<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref } from 'vue'
import { useEditorStore } from '@/store/editor'

export default defineComponent({
  components: {},
  props: {
    // visible: {
    //   type: Boolean,
    //   default: false,
    // },
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
    const rules = reactive({
      title: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
      desc: [{ required: true, message: '描述不能为空', trigger: 'blur' }],
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
      rules,
      onCancel,
      validateAndSave,
    }
  },
})
</script>

<template>
  <iframe frameborder="0" :src="previewURL" width="375" class="iframe-placeholder" height="100%" />
  <!-- <phone-view
    teleport="body"
    :url="previewURL"
    :title="form.title"
  ></phone-view> -->
</template>

<style>
.preview-local {
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
</style>
