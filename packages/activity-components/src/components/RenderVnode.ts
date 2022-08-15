import { defineComponent, h } from 'vue'

const RenderVnode = defineComponent({
  props: {
    type: {
      type: String,
      required: true,
    },
    props: {
      type: Object,
      default: () => ({}),
    },
    children: {
      type: [String, Array, Object],
    },
  },
  render(props: any) {
    return h(props.type as any, props.props, props.children)
  },
})

export default RenderVnode
