import { emitter } from '@yq-editor/shared'
// 自定义指令

export const onEmitter = {
  mounted(el: HTMLElement, binding: any) {
    const name = binding.arg
    if (name) {
      const fn = binding.value
      emitter.on(name, (params: any) => {
        fn(params)
      })
    }
  },
}

export const vEmitter = {
  mounted(el: HTMLElement, binding: any) {
    const name = binding.arg
    if (name) {
      const fn = binding.value
      emitter.on(name, (params: any) => {
        fn(params)
      })
    }
  },
}
