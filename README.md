<!--
 * @Author: your name
 * @Date: 2021-07-26 10:27:19
 * @LastEditTime: 2021-07-26 20:06:23
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /cloud-media-web/README.md
-->
# cloud-media-web

# 目录结构
```
├── .vscode                    # vscode 配置 自动保存格式化
├── dist                       # 打包目录
├── public                     # 静态资源
│   │── favicon.ico            # favicon图标
│   └── index.html             # html模板
├── src                        # 源代码
│   ├── assets                 # 主题 字体等静态资源
│   └── axios                  # 请求封装
│        │── api               # 所有请求
│        │── http.js           # 请求方法封装
│        └── index.js          # 基础封装
│   ├── components             # 全局公用组件
│   ├── layout                 # 全局 layout
│   ├── router                 # 路由
│   ├── store                  # 全局 store管理
│   ├── styles                 # 全局样式
│   ├── utils                  # 公用方法
│   ├── views                  # views 所有页面
│   ├── App.vue                # 入口页面
│   ├── main.js                # 入口文件 加载组件 初始化等
│   └── permission.js          # 权限管理
├── .env.xxx                   # 环境变量配置
├── .eslintrc.js               # eslint 配置项
├── .babelrc                   # babel-loader 配置
├── vue.config.js              # vue-cli 配置
├── postcss.config.js          # postcss 配置
└── package.json               # package.json
```
# Vue 项目代码规范
https://juejin.cn/post/6987349513836953607