import type { App } from 'vue'
import Text from '@/components/text/Text.vue'
import Image from '@/components/image/Image.vue'
import Button from '@/components/button/Button.vue'

const components = [
  Text, Image, Button,
]

const install = (app: App): void => {
  Object.entries(components).forEach(([_, value]) => {
    app.component(value.name, value)
  })
}

export { Text, Image, Button }
export default { install }
