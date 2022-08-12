import type { KeyHandler } from 'hotkeys-js'
import hotkeys from 'hotkeys-js'
import { onMounted, onUnmounted } from 'vue'

export default function useHotKey(keys: string, callback: KeyHandler) {
  onMounted(() => {
    hotkeys(keys, callback)
  })
  onUnmounted(() => {
    hotkeys.unbind(keys, callback)
  })
}
