<!-- TODO: 待开发 -->
<script lang="ts">
import TinymceEditor from '@tinymce/tinymce-vue'
import { effect } from 'vue'
export default {
  name: 'Tinymce',
  components: {
    TinymceEditor,
  },
  props: {
    value: String,
  },
  setup(props) {
    return {}
  },
}
</script>

<template>
  <popup-editor
    api-key="qlj8e5yt6fanbh4tged8wbt4lj8io31o2bgq9y8ns87tc6fk"
    :init="{
      height: 400,
      plugins: [
        'advlist autolink lists link image charmap print preview anchor',
        'searchreplace visualblocks code fullscreen',
        'insertdatetime media table paste code help wordcount',
      ],
      toolbar:
        'undo redo | formatselect | bold italic backcolor | \
                 alignleft aligncenter alignright alignjustify | \
                 bullist numlist outdent indent | removeformat | ',
      language: 'zh_CN',
    }"
  />
</template>

<style scoped></style>
