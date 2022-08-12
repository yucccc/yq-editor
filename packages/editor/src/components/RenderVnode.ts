/**
 * 将组件按vnode方式渲染
 */
import { defineComponent } from 'vue'

const RenderVnode = defineComponent({
  props: {
    node: {
      type: [Object, String],
      required: true,
    },
  },
  render() {
    return this.node
  },
})

export default RenderVnode
