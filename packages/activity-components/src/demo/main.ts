import { createApp } from 'vue'
import act from '../index'
import App from './App.vue'
import EditWrapper from './edit-wrapper/index.vue'
const app = createApp(App)
app.use(act)
// 测试使用 注册到全局
app.component(EditWrapper.name, EditWrapper)
app.mount('#app')
