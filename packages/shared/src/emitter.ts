import mitt from 'mitt'
// 只用一个发射器
const emitter = window.emitter = window.emitter || mitt()

export { emitter }