import { createApp } from 'vue'
import act from './index'
import EditWrapper from '@/demo/edit-wrapper/index.vue'
import App from '@/demo/App.vue'
const app = createApp(App)
app.use(act)

// 测试使用 注册到全局
app.component(EditWrapper.name, EditWrapper)
app.mount('#app')
