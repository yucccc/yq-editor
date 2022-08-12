export const isDev = import.meta.env.DEV
// 与渲染端差异 渲染端需要判断当前环境 因此这里永远是true
export const isEditor = true

export const subComponentJoinId = '-subid-'

export const previewDomain = isDev ? 'http://localhost' : 'TODO: 需要服务器返回IP'
