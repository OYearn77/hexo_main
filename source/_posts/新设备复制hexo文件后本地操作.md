---
title: 新设备复制hexo文件后本地操作
toc: true
date: 2025-04-03 16:34:26
subtitle:
categories: hexo内容
tags:
  - hexo
  - 插件
cover:
---
## 前置条件

确保已下载hexo和node.js

hexo下载内容见

node.js下载与配置，cnpm下载见[https://blog.csdn.net/WHF__/article/details/129362462](https://blog.csdn.net/WHF__/article/details/129362462)

## 尝试本地预览

复制原来的hexo文件夹再本地预览时会发现有以下报错![图片1.png](https://s2.loli.net/2025/04/03/lSUfVz3hjDIQGr5.png)

报错让我们尝试

```apache
rm -rf node\_modules && npm install –force
```

这个没有作用主要是npm的问题无法下载，这里建议使用cnpm即`cnpm install –force`

这下可以运行了![图片2.png](https://s2.loli.net/2025/04/03/IYEqCHOzcf8K9V1.png)

同时建议用cnpm安装 pug 以及 stylus 的渲染器![图片3.png](https://s2.loli.net/2025/04/03/zsSLcYD9a3gMhZb.png)

```apache
cnpm install hexo-renderer-pug hexo-renderer-stylus ––save
```

此时在预览本地网页就没有问题了

## 其他插件的安装

在文件中的package.json中有所有依赖插件，可以尝试安装，建议使用cnpm

```apache
    "hexo": "^7.3.0",
    "hexo-asset-img": "^1.2.0",
    "hexo-generator-archive": "^2.0.0",
    "hexo-generator-category": "^2.0.0",
    "hexo-generator-index": "^4.0.0",
    "hexo-generator-json-content": "^4.2.3",
    "hexo-generator-tag": "^2.0.0",
    "hexo-renderer-ejs": "^2.0.0",
    "hexo-renderer-marked": "^7.0.0",
    "hexo-renderer-pug": "^3.0.0",
    "hexo-renderer-stylus": "^3.0.1",
    "hexo-server": "^3.0.0",
    "hexo-tag-dplayer": "^0.3.3",
    "hexo-theme-landscape": "^1.0.0"
```
