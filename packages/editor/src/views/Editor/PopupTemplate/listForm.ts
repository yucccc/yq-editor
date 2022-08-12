import type { VxeGridProps } from 'vxe-table'
export const listColumns = [
  {
    title: '渲染值',
    dataIndex: 'key',
    component: 'a-input',
    vModel: 'value',
    width: '100px',
  },
  {
    title: '渲染标签',
    dataIndex: 'type',
    component: 'a-input',
    width: '100px',
    vModel: 'value',
  },
  {
    title: '样式',
    dataIndex: 'style',
    component: 'monaco',
    componentProps: {
      language: 'json',
    },
    width: '300px',
    vModel: 'value',
  },
]

export const table2Clo: VxeGridProps['columns'] = [
  {
    title: '渲染值',
    field: 'key',
  },
  {
    title: '渲染标签',
    field: 'type',
  },
  {
    title: '样式',
    field: 'style',
    params: {
      component: 'monaco',
      componentProps: {
        language: 'json',
      },
    },
  },
]