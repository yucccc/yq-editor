# 列表组件

该组件用于排行榜

```JavaScript
/**
   * 请求数据
   */
  sourceData: {
    type: Array,
    require: true,
  },
  /**
   * 选项排列
   */
  arrange: {
    type: Array as PropType<Arrange[]>,
  },

```

```ts
interface Arrange {
  // 要渲染的值
  key: string
  // 样式 可编辑
  style: object
  // 渲染标签
  type: string
}
```
