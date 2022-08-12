<script lang="ts">
import * as monaco from 'monaco-editor'
// import { IStandaloneEditorConstructionOptions } from 'monaco-editor'
import { defineComponent, getCurrentInstance, h, onMounted, watch } from 'vue'
export default defineComponent({
  name: 'Monaco',
  props: {
    // 编辑的代码
    value: String,
    language: {
      type: String,
      default: 'javascript',
    },
    theme: {
      type: String,
      default: 'vs-dark',
    },
    // monaco options
    options: Object,
    style: Object,
  },
  emits: ['update:value'],
  setup(props, ctx) {
    let editor: any = null
    watch(
      () => props.value,
      (nv) => {
        if (nv !== getValue()) {
          editor.setValue(nv)
        }
      },
    )
    watch(
      () => props.options,
      (nv) => {
        editor && editor.updateOptions(nv)
      },
    )

    const getValue = () => editor.getValue()

    const _initMonaco = () => {
      const { value, language, theme, options } = props
      const internalInstance: any = getCurrentInstance()
      // https://microsoft.github.io/monaco-editor/api/modules/monaco.editor.html#create
      editor = monaco.editor.create(internalInstance.vnode.el as HTMLElement, {
        value: value as string,
        language,
        theme,
        // 禁用小地图
        minimap: {
          enabled: false,
        },
        // 禁用行号
        // lineNumbers: 'off',
        ...options,
      })

      editor.onDidChangeModelContent((e: any) => {
        const v = getValue()
        if (props.value !== v) {
          ctx.emit('update:value', v, e)
        }
      })
    }

    onMounted(() => {
      _initMonaco()
    })

    return {
      getValue,
    }
  },
  render(props: any) {
    return h('div', {
      class: 'monaco-editor-container',
      style: props.style,
    })
  },
})
</script>

<style scoped>
.monaco-editor-container {
  min-height: 200px;
}
</style>
