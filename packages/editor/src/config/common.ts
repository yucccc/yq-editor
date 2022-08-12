export const actionConfigMap = {
  component: 'modal-button',
  extraProps: {
    btnProps: {
      slot: '设置数据',
      isComponent: false,
    },
    modalProps: {
      slot: 'action-set',
      isComponent: true,
    },
  },
}

export const emitConfigMap = {
  component: 'modal-button',
  extraProps: {
    btnProps: {
      slot: '设置事件监听',
      isComponent: false,
    },
    modalProps: {
      slot: 'code-set',
      isComponent: true,
    },
  },
}

export const requestDataConfigMap = {
  component: 'modal-button',
  extraProps: {
    btnProps: {
      slot: '请求参数',
      isComponent: false,
    },
    modalProps: {
      slot: 'code-set',
      isComponent: true,
    },
  },
}

export const stateMap = {
  component: 'modal-button',
  extraProps: {
    btnProps: {
      slot: '状态配置',
    },
    modalProps: {
      slot: 'state-set',
      isComponent: true,
    },
  },
}
