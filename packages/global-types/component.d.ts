import { Properties } from 'csstype'
import { ApiConfig, FormConfig } from '@yq-editor/global-types'
import { HRequest } from '@yq-editor/shared'
export interface ComponentData {
    // 每个组件由uuid生产的唯一id 用于操作
    id: string
    // 组件名称
    name: string
    // 组件props
    props: PropsKeyType
    // 组件是否隐藏
    isHidden?: boolean
    // 是否被锁定
    isLocked?: boolean
    // 图层名称
    layerName?: string
    [propName: string]: any
}


export type PropsKeyType = Properties & {
    // 是否正在编辑中
    isEditing?: boolean
    // 数据字段 最终会被解析成 text字段
    sourceDataKey?: string
    // 处理sourceDataKey返回的数据
    handleSourceData?: string
    // 子组件 和 父组件类型相同
    subComponent: ComponentData[]
    // style 之前样式全作为props 后期写在style里面
    style?: Properties
    // 会有额外的属性
    [propName: string]: any
}

export interface RequestModules { 
    request: HRequest; 
    getFormConfig: () => Record<string, FormConfig>;
    name: string;
    [key: string]: any
    // 默认参数
    defaultParams?: Record<string, any>
    initApiConfig?: ApiConfig
}
