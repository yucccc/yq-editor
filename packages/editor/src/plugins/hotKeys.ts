import { useRoute } from 'vue-router'
import { computed } from 'vue'
import type { HotkeysEvent, KeyHandler } from 'hotkeys-js'
import useHotKey from '@/hooks/useHotKey'
import { useEditorStore } from '@/store/editor'
import type { MoveDirection } from '@/store/editor'

const wrapper = (callback: KeyHandler) => {
  return (e: KeyboardEvent, event: HotkeysEvent) => {
    e.preventDefault()
    callback(e, event)
  }
}

export const hotKeyTips: string[] = [
  '取消选中  esc',
  '复制图层  ctrl+c, command+c',
  '黏贴图层  ctrl+v, command+v',
  '移动  ← ↑ → ↓',
  '快速移动 shift + ← ↑ → ↓',
  '保存作品 ctrl+s, command+s',
  '删除图层 ←backspace, delete',
  '撤回 ctrl+z, command+z',
  '重做 ctrl+y, command+y',
]

export default function initHotKeys() {
  const eStore = useEditorStore()
  const route = useRoute()
  const currentId = computed(() => eStore.currentElementId)
  useHotKey('backspace, delete', () => {
    eStore.deleteComponent(currentId.value)
  })
  // 复制粘贴
  useHotKey('ctrl+c, command+c', () => {
    eStore.copyComponent(currentId.value)
  })
  useHotKey('ctrl+v, command+v', () => {
    eStore.pasteCopiedComponent()
  })
  useHotKey(
    'ctrl+s, command+s',
    wrapper(() => {
      eStore.saveWork(route.params.id as string)
    }),
  )
  useHotKey(
    'ctrl+z, command+z',
    wrapper(() => {
      eStore.undo()
    }),
  )
  useHotKey(
    'ctrl+y, command+y',
    wrapper(() => {
      eStore.redo()
    }),
  )

  useHotKey('esc', () => {
    eStore.setActive('')
  })

  const movePayload = (direction: MoveDirection, amount = 1) => ({
    direction,
    amount,
    id: currentId.value,
  })
  // 位置
  useHotKey(
    'up',
    wrapper(() => {
      eStore.moveComponent(movePayload('Up'))
    }),
  )

  useHotKey(
    'down',
    wrapper(() => {
      eStore.moveComponent(movePayload('Down'))
    }),
  )

  useHotKey(
    'left',
    wrapper(() => {
      eStore.moveComponent(movePayload('Left'))
    }),
  )

  useHotKey(
    'right',
    wrapper(() => {
      eStore.moveComponent(movePayload('Right'))
    }),
  )
  useHotKey(
    'shift+up',
    wrapper(() => {
      eStore.moveComponent(movePayload('Up', 10))
    }),
  )

  useHotKey(
    'shift+down',
    wrapper(() => {
      eStore.moveComponent(movePayload('Down', 10))
    }),
  )

  useHotKey(
    'shift+left',
    wrapper(() => {
      eStore.moveComponent(movePayload('Left', 10))
    }),
  )

  useHotKey(
    'shift+right',
    wrapper(() => {
      eStore.moveComponent(movePayload('Right', 10))
    }),
  )
}
