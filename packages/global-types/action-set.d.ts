// 设置交互类型
export type ActionType = 
| 'request' 
| 'code' 
| 'url' 
| 'toast' 
| 'popup' 
| 'component'
| 'facebookShare' 
| 'twitterShare' 
| 'layer'


// 请求填写提交数据
export interface RequestCommitType {
    // 请求地址 这个在列表中选择
    apiName: string
    // 请求参数 合并数据源中的列表参数 一个函数字符串
    paramsSf?: string
    // 返回流传 不传就是按数据
    resFlowStrToFn?: string
    // 成功回调 一个函数字符串
    successFn?: ActionSetType
    // 失败
    errorFn?: ActionSetType
    // 无论如何都执行
    finallyFn?: ActionSetType
  }
// 自定义代码提交
export interface CodeCommitType {
    code: string
    // 下一步执行
    nextStep: ActionSetType
}
  

export interface UrlCommitType {
    to: string
    target: '_self' | '_blank' | '_parent' | '_top'
  }

  export interface ToastCommitType {
    toastConfig: {
      // 是个字符串函数或者文字
      message?: string
      // 后期可能要扩展时长类型之类的
      // [key: string]: any
      // 放在里面的原因是数据在一起了 需要再处理才能放外面 暂时这样
      nextStep?: ActionSetType
    }
    // 数据源
    requestConfig: {
      // 取返回值的某个字段 默认请求完的完整返回
      sourceDataKey?: string
    }
  }
  
  export interface PopupConfig {
    width: string
    height: string
    title: string
    // 编辑富文本内容
    content: string
    // 背景图地址
    backgroundImage: string
    // 内容盒子自定义样式
    contentStyle: string
    template: string
    // 组件编辑props
    templateProps: any
  }


  export interface PopupCommitType {
    popupConfig: {
      [key: string]: PopupConfig
    }
    // 当前使用的key
    // 1、仅当没有选择api的时候生效
    // 2、没有选择回调的弹窗的时候 这种情况在设计上没做  因此此条大概率不会出现
    currentUsePopupKey: string
    // 数据源
    requestConfig: {
      // 取返回值的某个字段 默认请求完的完整返回
      sourceDataKey?: string
    }
    nextStep: ActionSetType
  }

  export interface DataFlowCommitType {
    sourceDataKey: string
    // 被执行的函数
    sourceDataSf?: string
  }
  
export interface ComponentCommitType {
    // 触发的组件ID
    id: string
    // 触发的事件
    eventName: string
    // 传递给组件的参数
    sourceDataKey: string
    // 被执行的函数
    sourceDataSf?: string
    // 执行回调
    callback: ActionSetType
  }
  export interface facebookShareCommitType {
    shareUrl: string
    nextStep: ActionSetType
    code: string
  }


export interface twitterShareCommitType {
    url: string
    target: string
    text: string
    hashtags: string
    via: string
    nextStep: ActionSetType
  }

  export interface LayerCommitType {
    status: 'show' | 'hide' | 'toggle'
    actionCid: string
    nextStep: ActionSetType
  }
export interface ActionSetType {
    type: ActionType 
    request?: RequestCommitType
    code?: CodeCommitType
    url?: UrlCommitType
    toast?: ToastCommitType
    popup?: PopupCommitType
    component?: ComponentCommitType
    facebookShare?: facebookShareCommitType
    twitterShare?: twitterShareCommitType
    layer?: LayerCommitType
  }


  
  export interface twCommitType {
    url: string
    target: string
    text: string
    hashtags: string
    via: string
    nextStep: ActionSetType
  }

export interface ActionMap {
  request: (v: RequestCommitType) => void
  code: (v: CodeCommitType) => void
  url: (v: UrlCommitType) => void
  layer: (v: LayerCommitType) => void
  toast: (v: ToastCommitType) => void
  popup: (v: PopupCommitType) => void
  component: (v: ComponentCommitType) => void
  facebookShare: (v: facebookShareCommitType) => void
  twitterShare: (v: twitterShareCommitType) => void
}