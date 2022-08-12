# 编辑器


## 使用须知

- 项目核心依赖于一个组件库 base-components 提供基础的文字 图片组件

- 默认使用了 activity-components 业务组件库 该组件库仅用于演示 需要根据公司不同业务而开发 需要遵循一定的编辑器接入规范

注：



## 启动

`yarn serve`

## 部署

`yarn && yarn build`

## 组件开发接入规范：

### 组件嵌套时 如何编辑子组件

需要在 props 上使用规定字段 subComponent 该字段与父组件类型一致

### 如何接入自己公司业务组件库

1、需要将组件库发布到 npm 然后修改文件导入
2、配置映射的模板 src/config/defaultComponentTemplate.ts
