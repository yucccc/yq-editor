import { defineStore } from 'pinia'
import { toRaw } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { cloneDeep, debounce, forEach, isArray, isEmpty, isPlainObject } from 'lodash-es'
import { message } from 'ant-design-vue'
import type * as Css from 'csstype'
import type { ApiConfig, ApiType, ComponentData, RequestModules } from '@yq-editor/global-types'
import { getApiData, initApiData } from '@yq-editor/shared'
// import type { AllDefaultProps } from '@/config/componentsPath'
import { getWorkDescApi } from '@/api'
import { insertAt, loadRequestModules, myMergeWith } from '@/shared'
import { patchWorkApi } from '@/api/works'
export type MoveDirection = 'Up' | 'Down' | 'Left' | 'Right'
export type ModifyType = 'undo' | 'redo'
export interface HistoryProps {
  id: string
  componentId: string
  type: 'add' | 'delete' | 'modify'
  // 修改的数据
  data: any
  index?: number
}
export interface PreSettingType {
  uuid?: string
  // 简称
  shortName: string
  // 区服id
  userInfo: Object
  cdnUrl: string
  cdnSn: string
}
export interface GetApiDataType {
  // 请求参数 合并数据源中的列表参数 一个函数字符串
  paramsSf?: string
  // 成功回调 一个函数字符串
  successFn?: string
  // 失败
  errorFn?: string
  // 无论如何都执行
  finallyFn?: string
}
interface MPageProps {
  // 封面图
  screenshotImage: string
  // 使用图片替换背景图片 目的是撑开高度
  isUseBgToImg: boolean
  style?: Css.Properties
}
export type PageProps = Css.Properties & MPageProps
export interface PageData {
  props: PageProps
  // 页面的设置 比如分享
  thirdSetting: SettingType
  // 页面的基础配置 比如标题 描述
  baseSetting: {
    title: string
    description: string
  }
  requestConfig: Record<string, any>
  // 接口描述
  apiConfig: ApiConfig
  // 本地的请求数据返回 在开发阶段只用于测试 渲染端采用相同字段
  totalResData: Record<string, object>
}

export type AllFromProps = any
export interface EditorProps {
  preSetting: PreSettingType
  // 编辑器渲染的组件数组
  components: ComponentData[]
  // 当前编辑的是哪个元素，uuid
  currentElementId: string
  page: PageData
  // 当前被复制的组件
  copiedComponent?: ComponentData
  // 当前操作的历史记录
  histories: HistoryProps[]
  // 当前历史记录的操作位置
  historyIndex: number
  // 开始更新时的缓存值
  cachedOldValues: any
  // 保存最多历史条目记录数
  maxHistoryNumber: number
  requestModules: null | Record<string, RequestModules>
}

export interface SettingTypeItem {
  // 显示的文本
  text: string
  // 只读的key
  readonly key: string
  // 是否开启使用
  isUsing: boolean
  // 配置项
  config: {
    [key: string]: any
  }
}
/**
 * 使其后期可以增删改查
 */
export interface SettingType {
  [key: string]: SettingTypeItem
}

export interface UpdateComponentData {
  // 要更新的key
  key: keyof ComponentData | (keyof ComponentData)[]
  value: any | any[]
  id?: string
  // 修改数组内的某一项
  arrayIndex?: number
  // 是否直接修改根级别的
  isRoot?: boolean
  // 是否需要新增一条操作记录
  record?: boolean
}
const state = {
  components: [],
  currentElementId: '',
  // 请求模块 读取本地的请求配置
  requestModules: null,
  page: {
    // 请求的文件配置 用户填的
    requestConfig: {},
    props: {
      backgroundColor: 'initial',
      backgroundSize: 'cover',
      // 自带属性
      screenshotImage: '',
      isUseBgToImg: true,
    },
    thirdSetting: {},
    baseSetting: {
      title: 'page title',
      description: 'page description',
    },
    // 请求的api列表
    apiConfig: {
      apis: [],
    },
    totalResData: {},
  },
  cachedOldValues: null,
  histories: [],
  // -1 未操作过
  historyIndex: -1,
  maxHistoryNumber: 6,
  preSetting: {
    shortName: '',
    userInfo: null,
    cdnUrl: '',
    cdnSn: '',
  },
}
const modifyHistory = (state: EditorProps, history: HistoryProps, type: ModifyType) => {
  const { componentId, data } = history
  const { key, oldValue, newValue } = data
  const newKey = key
  const updatedComponent = state.components.find(component => component.id === componentId)
  if (updatedComponent) {
    // check if key is array
    if (Array.isArray(newKey)) {
      newKey.forEach((keyName, index) => {
        // @ts-expect-error
        updatedComponent.props[keyName] = type === 'undo' ? oldValue[index] : newValue[index]
      })
    }
    else {
      // @ts-expect-error
      updatedComponent.props[newKey] = type === 'undo' ? oldValue : newValue
    }
  }
}
const pushHistory = (state: EditorProps, historyRecord: HistoryProps) => {
  // 是否移动过指针 每当操作移动过后 再次操作 会将后面的操作删除掉
  if (state.historyIndex !== -1) {
    // 如果已经移动过 就将后面的全部删掉
    state.histories = state.histories.slice(0, state.historyIndex)
    // 设置会没移动过
    state.historyIndex = -1
  }
  if (state.histories.length < state.maxHistoryNumber) {
    state.histories.push(historyRecord)
  }
  else {
    // 超过条目
    state.histories.shift()
    state.histories.push(historyRecord)
  }
}
const pushModifyHistory = (state: EditorProps, { key, id, value }: UpdateComponentData) => {
  // 修改历史记录
  pushHistory(state, {
    id: uuidv4(),
    componentId: id || state.currentElementId,
    type: 'modify',
    data: {
      key,
      oldValue: state.cachedOldValues,
      newValue: value,
    },
  })
  state.cachedOldValues = null
}

const pushHistoryDebounce = debounce(pushModifyHistory, 1000)

export const useEditorStore = defineStore('editor', {
  state: (): EditorProps => (state),
  getters: {
    // 目前没找到子组件上 后期看有什么业务场景再考虑
    currentElement: state => state.components.find(component => component.id === state.currentElementId) || null,
    getIsUsingThirdConfig: (state) => {
      const thirdSetting = state.page.thirdSetting
      return Object.keys(thirdSetting)
        .filter(settingKey => thirdSetting[settingKey].isUsing)
        .map(settingKey => thirdSetting[settingKey])
    },
    requestModulesMapArray: (state) => {
      if (state.requestModules) {
        return Object.keys(state.requestModules).map((key) => {
          const module = state.requestModules![key]
          return {
            // label 和 text 是同一个值 后期直接buyao text
            label: module.label || module.name,
            text: module.name || module.name,
            value: module.value || module.name,
            ...module,
          }
        })
      }
      return []
    },
  },
  actions: {
    // 新增一个组件到画布上
    addComponent(component: ComponentData) {
      component.layerName = `${component.layerName || '未知图层'}${this.components.length + 1}`
      this.components.push(component)
      // 新增一条操作记录
      pushHistory(this, {
        id: uuidv4(),
        componentId: component.id,
        type: 'add',
        data: cloneDeep(component),
      })
    },
    // 设置当前激活ID
    setActive(currentId: string) {
      if (this.currentElementId !== currentId) {
        this.currentElementId = currentId
      }
    },
    moveComponent(data: { direction: MoveDirection; amount: number; id: string }) {
      const currentComponent = this.currentElement
      if (currentComponent) {
        const oldTop = parseInt(currentComponent.props.top || '0', 10)
        const oldLeft = parseInt(currentComponent.props.left || '0', 10)
        const { direction, amount, id } = data
        switch (direction) {
          case 'Up': {
            this.updateComponent({
              key: 'top',
              value: `${oldTop - amount}px`,
              id,
            })
            break
          }
          case 'Down': {
            this.updateComponent({
              key: 'top',
              value: `${oldTop + amount}px`,
              id,
            })
            break
          }
          case 'Left': {
            this.updateComponent({
              key: 'left',
              value: `${oldLeft - amount}px`,
              id,
            })
            break
          }
          case 'Right': {
            this.updateComponent({
              key: 'left',
              value: `${oldLeft + amount}px`,
              id,
            })
            break
          }
          default:
            console.log('%c [ moveComponent 更新异常 ]-358-「editor」', 'font-size:13px; background:pink; color:#bf2c9f;')
            break
        }
      }
    },

    /**
     * 更新组件
     * @param param0
     * 允许传格式 {key: ['left', 'top], value: ['10px', '20px]} 多项同时更新
     * 允许传格式 {key: 'left', value: '10px'} 更新某一值
     * 允许传格式 {key: 'left', value: ['123', '123']} 会直接覆盖原有value值
     * 允许传格式 {key: 'array', arrayIndex: 1, value: {key: 'value'}} 修改数组内的某一项目
     * 允许传格式 {key: 'left', value: {a: 123, b: 123}} 会直接与原有值合并
     */

    updateComponent({ key, value, id, arrayIndex, isRoot = false, record = true }: UpdateComponentData) {
      const updatedComponent = this.currentElement
      if (updatedComponent) {
        // 修改根元素会直接修改
        if (isRoot) {
          if (isArray(key)) {
            key.forEach((k) => {
              updatedComponent[k] = value
            })
          }
          else {
            updatedComponent[key] = value
          }
        }
        else {
          // 被更新前的值
          const oldValue = Array.isArray(key)
            ? key.map(key => updatedComponent.props[key])
            : updatedComponent.props[key]

          if (!this.cachedOldValues) {
            this.cachedOldValues = oldValue
          }

          // 增加历史记录
          record && pushHistoryDebounce(this, { key, value, id })
          // 更新的是一组数据
          if (Array.isArray(key) && Array.isArray(value)) {
            key.forEach((keyName, index) => {
              updatedComponent.props[keyName] = value[index]
            })
          }
          else if (Array.isArray(oldValue) && arrayIndex !== undefined) {
            // 修改数组 并且旧有是有值的
            // 1、如果传递的index 那是修改 否则直接替换
            updatedComponent.props[key][arrayIndex] = oldValue[arrayIndex]
              ? { ...oldValue[arrayIndex], ...value }
              : value
          }
          else if (typeof key === 'string') {
            if (isPlainObject(value)) {
              const v = value as Object
              updatedComponent.props[key] = {
                ...updatedComponent.props[key],
                ...v,
              }
            }
            else {
              updatedComponent.props[key] = value
            }
          }
        }
      }
    },
    // 更新逻辑与更新组件不同 更新页面上的操作目前会被忽略记录进操作历史 后期有需要再加上
    updatePage(key: keyof PageData, value: unknown) {
      // 解析key key可能是 a.b.c 然后给一个数据 解析key 并且深度给数据赋值
      const keys = key.split('.')
      const lastKey = keys.pop()
      const target = keys.reduce((target, key) => {
        return target[key]
      }, this)
      target[lastKey] = value
    },
    setApiResData(data: { [key: string]: any }) {
      this.page.totalResData = { ...this.page.totalResData, ...data }
    },
    deleteComponent(componentId: string) {
      const currentComponent = this.components.find(component => component.id === componentId)
      if (currentComponent) {
        const currentIndex = this.components.findIndex(component => component.id === componentId)
        this.components = this.components.filter(component => component.id !== componentId)
        pushHistory(this, {
          id: uuidv4(),
          componentId: currentComponent.id,
          type: 'delete',
          data: currentComponent,
          index: currentIndex,
        })
        message.success('删除当前图层成功', 1)
      }
    },
    copyComponent(componentId: string) {
      const currentComponent = this.components.find(component => component.id === componentId)
      if (currentComponent) {
        this.copiedComponent = currentComponent
        message.success('已拷贝当前图层', 1)
      }
    },
    pasteCopiedComponent() {
      if (this.copiedComponent) {
        const clone = cloneDeep(this.copiedComponent)
        clone.id = uuidv4()
        clone.layerName = `${clone.layerName}副本`
        this.components.push(clone)
        message.success('已黏贴当前图层', 1)
        // 新增一条操作记录
        pushHistory(this, {
          id: uuidv4(),
          componentId: clone.id,
          type: 'add',
          data: cloneDeep(clone),
        })
      }
    },
    // 更新api
    updateApiConfig(data: ApiConfig) {
      this.page.apiConfig = toRaw(data)
    },
    // 撤销操作
    undo() {
      // 从来没操作过
      if (this.historyIndex === -1) {
        this.historyIndex = this.histories.length - 1
      }
      else {
        this.historyIndex--
      }

      const history = this.histories[this.historyIndex]
      if (history) {
        switch (history.type) {
          case 'add':
            // 如果是新增 那就删除
            this.components = this.components.filter(component => component.id !== history.componentId)
            break
          case 'delete':
            // 如果是删除 那么恢复
            this.components = insertAt(this.components, history.index as number, history.data)
            break
          case 'modify': {
            // 把值恢复
            modifyHistory(this, history, 'undo')
            break
          }
          default:
            break
        }
        message.success('撤销成功', 1)
      }
    },
    redo() {
      // 没操作过
      if (this.historyIndex === -1) {
        return
      }
      const history = this.histories[this.historyIndex]
      if (history) {
        switch (history.type) {
          case 'add':
            this.components.push(history.data)
            break
          case 'delete':
            this.components = this.components.filter(component => component.id !== history.componentId)
            break
          case 'modify': {
            modifyHistory(this, history, 'redo')
            break
          }
          default:
            break
        }
        this.historyIndex++
        message.success('重做成功', 1)
      }
    },

    // // 更新前置信息
    updatePreSetting(data) {
      this.preSetting = toRaw(data)
      this.saveWork(data.workId)
    },
    async setDefaultWork(id: string) {
      const res = await getWorkDescApi(id)
      const data = res.data
      this.components = data.content.components
      // 兼容下 后面提交肯定会有默认数据
      if (!isEmpty(data.content.props)) {
        this.page.props = {
          ...this.page.props,
          ...data.content.props,
        }
      }
      // 服务端有数据 直接覆盖默认数据
      if (data.content.apiConfig && Object.keys(data.content.apiConfig).length) {
        this.page.apiConfig = myMergeWith(this.page.apiConfig, [data.content.apiConfig])
      }
      this.page.requestConfig = data.content.requestConfig || {}

      this.page.thirdSetting = data.content.thirdSetting || {}
      this.page.baseSetting = data.content.baseSetting || {}

      // this.page.title = data.title
      this.preSetting = {
        uuid: data.uuid,
        ...data.content.preSetting,
      }
      return res
    },
    // 请求数据初始化
    async initApiData(apiConfig?: ApiConfig) {
      this.requestModules = await loadRequestModules()
      const res = await initApiData(apiConfig || this.page.apiConfig)
      this.page.totalResData = res
      // 如果本地请求列表没有一条数据 那会用本地的请求 这里有一个问题是当本地设置为空时 下次刷新会为他加上默认请求
      if (this.page.apiConfig.apis.length === 0 && this.requestModules) {
        forEach(this.requestModules, (item) => {
          if (item.initApiConfig) {
            this.page.apiConfig.apis = this.page.apiConfig.apis.concat(item.initApiConfig.apis)
          }
        })
      }
    },
    async getApiData(configOrName: ApiType, config2: GetApiDataType = {}) {
      const res = await getApiData(configOrName, config2)
      this.page.totalResData[res.key] = res
    },
    async saveWork(id: string) {
      if (id) {
        try {
          await patchWorkApi(id, {
            content: {
              components: this.components,
              props: this.page.props,
              thirdSetting: this.page.thirdSetting,
              baseSetting: this.page.baseSetting,
              apiConfig: this.page.apiConfig,
              preSetting: this.preSetting,
              requestConfig: this.page.requestConfig,
            },
          })
          message.success('保存作品成功', 1)
        }
        catch (e) {
          message.error(`保存作品失败${JSON.stringify(e)}`, 2)
        }
      }
    },
    async resetEditorState() {
      this.$reset()
      this.initApiData()
    },
  },

  persist: {
    beforeRestore: () => {
      localStorage.removeItem('editor')
    },
    paths: ['page.totalResData', 'page.requestConfig'],
  },
})
