import { fbLoginConfig } from './Facebook'

export default {
  facebookLogin: {
    text: {
      label: 'Facebook登陆',
      isRenderForm: false,
    },
    isUsing: {
      label: '是否启用',
      valueType: 'boolean',
    },
    config: {
      isGroup: true,
      label: '配置',
      group: fbLoginConfig,
    },
  },
}
