import type { App } from 'vue'
export function createComponent(name: string) {
  const componentName = `act-${name}`
  return {
    componentName,
    create(_component: any) {
      _component.baseName = name
      _component.name = componentName
      _component.install = (vue: App) => {
        vue.component(_component.name as string, _component)
      }
      return _component
    },
  }
}
