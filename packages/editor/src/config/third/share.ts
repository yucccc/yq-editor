import { fbShareConfig } from './Facebook'
export default {
  facebookShare: {
    text: {
      label: 'Facebook分享',
      isRenderForm: false,
    },
    isUsing: {
      label: '是否启用',
      valueType: 'boolean',
    },
    config: {
      isGroup: true,
      label: '配置',
      group: fbShareConfig,
    },
  },
}
