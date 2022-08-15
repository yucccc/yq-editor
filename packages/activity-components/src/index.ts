import type { App } from 'vue'
import List from './components/list/index.vue'
import StateBtn from './components/state-btn/index.vue'
import Track from './components/track/index.vue'
import Turntable from './components/turntable/index.vue'
import Egg from './components/egg/index.vue'
import Magnifier from './components/magnifier/index.vue'
import BaseImage from './components/base-image/index.vue'
import { __DEV__ } from './shared'
export type { StateConfigType } from './components/state-btn/props'

const components = [
  List,
  StateBtn,
  Track,
  Turntable,
  Egg,
  Magnifier,
  BaseImage,
]

const install = (app: App): void => {
  Object.entries(components).forEach(([_, value]) => {
    __DEV__ && console.log('%c [ 挂载组件 ]-24-「index」', 'font-size:13px; background:pink; color:#bf2c9f;', value)
    app.component(value.name, value)
  })
}

export {
  List,
  StateBtn,
  Track,
  Turntable,
  Egg,
  Magnifier,
  BaseImage,
}
export default { install }
