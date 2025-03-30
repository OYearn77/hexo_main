---
title: hexo中配置valine流程以及可能碰到的问题
date: 2025-03-29 23:42:25
subtitle: 
categories: hexo内容
tags:
  - hexo
  - valine
  - 无法提交
cover: https://s2.loli.net/2025/03/30/QltU3DnpebBXjmO.png
toc: true
---
## 前言

在博客中使用的留言功能有很多，在本主题已经内置了两种方式，分别是valine和disqus，为了清晰简洁，本站使用valine。

---

## 使用流程

1. 前往 [https://leancloud.cn/](https://leancloud.cn/)去注册一个账号，如果注册大陆版本，后面要进行实名认证等操作，但是这样就不会碰到后面会遇到的问题，本人在注册时选用国际版，后面的操作均基于国际版，国际版只需要提供一个邮箱进行注册，不需要提供手机号和实名，读者请自行取舍。
2. 创建应用选用开发板。![1743264506949.png](https://s2.loli.net/2025/03/30/iYKawk1ND6PjSnv.png)
3. 在设置->应用凭证中可以看到AppID和AppKey以及REST API服务器。![1743264677348.png](https://s2.loli.net/2025/03/30/7j3tNxB1PCUcf2M.png)
4. 大部分的主题的配置文件中没有位置填写REST API服务器，请先找到主题中关于评论的ejs文件，一般命名为类似comment.ejs找到以下代码，有可能各种其它主题的具体代码有些许不一样，模仿添加 `serverURLs: "<%= valine.serverURLs %>"`即可。

   ```java
   new Valine({
           el: "#valine_thread",
           appId: "<%= valine.appId %>",
           appKey: "<%= valine.appKey %>",
           avatar: "<%= valine.avatar %>",
           placeholder: "<%= valine.placeholder %>",
           notify: <%= valine.notify %>,
           visitor: <%= valine.visitor %>,
           pageSize: <%= valine.pageSize %>,
           serverURLs: "<%= valine.serverURLs %>"  // 增加这一行！！！
   ```
5. 此时即可在主题配置文件中填写以下未填写内容。

   ```apache
   valine:
       appId: 
       appKey: 
       avatar: 'monsterid' # 头像展示方式 Gravatar style : mm/identicon/monsterid/wavatar/retro/hide
       serverURLs: 
       placeholder: 随便说点什么叭～
       notify: true
       visitor: true
       pageSize: 10
       background:  # 评论框背景
   ```

## 遇到问题与解决

这个时候我们尝试到评论中评价发现点击提交后提交按钮变灰，无法看到提交内容，后台也没有收到提交的信息，按照以下步骤进行修改。<br>

在配置文件的severURLs字段直接设置把xxxxxxxx替换为自己AppID的前8位字符。

```apache
serverURLs: https://xxxxxxxx.api.lncldglobal.com # 把xxxxxxxx替换为自己AppID的前8位字符
```

再将\\hexo\\themes\中有关评论(comment)的文件中进行以下修改

```
<script src="//cdn1.lncld.net/static/js/3.0.4/av-min.js"></script>
替换为

<script src="//code.bdstatic.com/npm/leancloud-storage@4.12.0/dist/av-min.js"></script>
```

再进行部署，测试发现可以评论成功。![QQ截图20250330185809.png](https://s2.loli.net/2025/03/30/y4Y8tE6I2sRQ95k.png)

## 管理评论及删除

打开leancloud，在数据存储->结构化数据->comment中，可以发现刚刚所发送的评论![QQ截图20250330190344.png](https://s2.loli.net/2025/03/30/RslnYop7JdQaz14.png)

可以选中要删除的评论进行删除!![Snipaste_2025-03-30_19-04-59.png](https://s2.loli.net/2025/03/30/SVWyBs7H9M8PFn4.png)
