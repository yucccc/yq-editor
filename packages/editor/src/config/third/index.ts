// export const thirdList: FormConfig = [
//   { key: '第三方分享', value: 'share' },
//   { key: '第三方登录', value: 'login' },
// ]
// type ThirdList = {
//   [P in keyof Third]: Partial<FormConfig>
// }
export interface SelectOptions {
  value: string
  text: string
}

// export const thirdList: SelectOptions[] = [
//   { value: 'share', text: '第三方分享' },
//   { value: 'login', text: '第三方登录' },
// ]
// export const thirdListMap: { [key: string]: Partial<FormConfig> } = {
//   thirdType: {
//     label: '第三方类型',
//     component: 'a-select',
//     subComponent: 'a-select-option',
//     subComponentOptions: thirdList,
//     value: thirdList[0].value,
//   },
// }

/**
 *
 * 1、分享选择
 * 分享需要可新增 添加多个分享配置 每个分享为唯一
 * 2、选择下对应的内容选项
 */
