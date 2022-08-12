import { createPinia } from 'pinia'
import piniaPluginPersist from 'pinia-plugin-persistedstate'
import { PiniaLogger } from 'pinia-logger'
import { isDev } from '@/global/index'
// 数据持久化

const store = createPinia().use(PiniaLogger({
  expanded: false,
  disabled: !isDev,
})).use(piniaPluginPersist)

export default store