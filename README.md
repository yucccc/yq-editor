
<p align="center">
  <img alt="" src="https://yq-editor-oss.oss-cn-guangzhou.aliyuncs.com/hd_activities/1659699032391-yq-editor(3).png">
</p>
<h1 align="center">愉快-编辑器</h1>
<p align="center">一个网页活动低代码平台，适用于具备数据、逻辑交互的营销活动、网页活动、落地页、推广页等自动生成.</p>


## ✨ 亮点

- 🐂  支持无限嵌套自定义交互逻辑，可适配任何复杂交互逻辑
- 🐂  支持定制化后端请求
- 🐂  支持可变性业务


## 🚀 如何启用

1. 项目数据库使用MongoDB 以及 Redis 因此启动前需要先启动MongoDB 与 Redis
2. 常用命令 ``pnpm run dev`` 启动项目 默认会开启本地服务器 初次启动可能稍慢
3. 其他使用命令见 ``package.json`` 文件 


## 🎟️ 如何接入使用(二次开发)

因为各个企业间业务不同，请求不同，活动类型不同，因此在这一块项目已经做好了可扩展性 

1、实现公司请求实现(通常需要)  

你很可能需要根据后端接口而进行一系列的请求配置，因此你需要根据后端修改```packages/shared/src/business/request```下的请求拦截实现，如不需要，请忽略此项

2、增加业务组件(通常需要)  
很大情况下你需要自行实现部分公司业务的组件，改项目仅提供了一些常用基础的组件，因此你很可能需要根据业务需求增加组件，如不需要，请忽略此项

3、如何配置组件映射模板(通常需要)  
一旦您自行开发了业务组件，那么本项也需要修改映射配置，见```src/config/defaultComponentTemplate.ts```文件，如不需要请忽略

就这样 ✨✨


## 🌋 技术栈

```Vue3.x```    ```vite3.x```    ```Typescript``` ``pinia``   ``Koa``   

## 常见问题

- 上传图片失败，由于项目内带有个人的osskey 因此在提交代码时做了屏蔽，您需要自行申请后填写 修改文件地址 ```/packages/server/common/cdn.js```


## 💁 建议与帮助

本项目需要您宝贵的改进建议，欢迎提交issue与pr

- 需要帮助页面进行美化以及合理的排版设计
- 需要帮助项目提供无法符合预期的业务需求



## 💖 支持我
开发本项目耗费了我大量的头发和泡妹时间，您的赞助决定该项目的持续维护，如果本项目帮助到您请支持我，谢谢！

## 🐰 项目逻辑图
<p align="center">

  <img alt="" src="https://yq-editor-oss.oss-cn-guangzhou.aliyuncs.com/%E4%BD%8E%E4%BB%A3%E7%A0%81%E9%80%BB%E8%BE%91.drawio.png">
</p>


## 🙇 感谢

- [logo](https://github.com/djyde/Picas)
- [vue3](https://github.com/vuejs/core)