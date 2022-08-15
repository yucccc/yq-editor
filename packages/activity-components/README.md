# activity-components

vue3 活动组件

## 开发

yarn serve

## 开发规范

1、所有的 style 都需要支持 json string 因为编辑器编辑后的都是 string 因此需要组件内部支持转为 object
例子:

```vue
<render-vnode
  v-for="(iitem, i) in arrange"
  :key="i"
  :type="iitem.type || 'span'"
  :props="{ style: stringStyleToStyle(iitem.style) }"
  :children="isUndefined(item[iitem.key]) ? [iitem.key] : [item[iitem.key]]"
></render-vnode>
```

2、组件内需要监听 props 变化 因为编辑器需要所见即所得

3、事件机制

采用的是 event bus 机制 见 `utils/emit.ts` 供其他项目使用

触发事件

- emit('id+事件名', 参数)

监听事件

- 事件监听由 props 传递的 编辑器中编辑传入的是一个字符串函数

4、接口数据字段 sourceData

- 接口传入的数据 在编辑器编辑时传递的为 sourceDataKey 渲染端会被解析为真实数据

## 调试

## 文档

## 发布

npm publish

## 发布权限

npm owner add (name) activity-components
