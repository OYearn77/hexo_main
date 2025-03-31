---
title: flexblock主题添加功能
toc: true
date: 2025-03-31 21:14:48
subtitle:
categories: hexo内容
tags:
  - hexo
  - flexblock
  - 样式
cover: https://s2.loli.net/2025/03/31/YWF7e3siptSnvg4.png
---
## 增加底部跳转外部网站图标

flexblock主题会自动识别flexblock/layout/_svg中的social开头的图标，再与主题配置中的以下代码匹配。

```apache
social_icon:
  enable: true
  icons:
    ins     :
    zhihu   :
    weibo   : 
    github  : https://github.com/
    twitter : 
```

在对应部分添加代码后即可以在网页下方自动添加跳转icon，如果想要添加新的icon可以先在某些网站下载，以我添加bilibili为例，在代码`twitter :`加上`bilibili :`，先去[https://icons8.com/](https://icons8.com/)下载对应的svg图标，添加到指定路径中修改名称为social-bilibili.svg，如果直接使用会发现图标显示不正确，详细看正确使用的svg和下载的svg代码如下

```apache
<!--下面是正确使用的twitter图标-->
<svg class="icon icon-twitter" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
<path d="M12.997,44.001v-1H9.969  ...... ></path>
</svg>

<!--这个是我的图标-->
<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="800" height="800" viewBox="0 0 50 50">
<path d="M12.997,44.001v-1H9.969    ...... ></path>
</svg>
```

可以发现我们的svg强制规定了高度和宽度`width="800" height="800"`，直接用记事本打开按它的方法修改为下方，注意path不要修改。

```apache
<svg class="icon icon-bilibili" viewBox="0 0 50 50" version="1.1" xmlns="http://www.w3.org/2000/svg">
```

这样在网站下方即可出现新增加的bilibili图标。
![QQ20250331-215115.png](https://s2.loli.net/2025/03/31/zg1o4L57CX9ZJvK.png)

## 增加顶部nav部分的分类、标签、归档

### 添加归档

这个主题在初始状态把这些均删除了，但是归档功能是hexo自带的功能，只需要保证在系统配置_config.yml中`archive_dir: archives`是一样的即可。

在主题配置中的`menu:`中添加`归档: /archives`即可。

### 添加分类、标签

首先在bash中使用`hexo new page "categories"`，可以发现在source中新建了categories文件夹以及里面的index.md，接下来修改index.md内容为

```apache
---
title: 分类
date: 2025-03-30 00:00:00
type: "categories"
layout: "categories"
---
```

在layout文件夹中添加categories.ejs文件，读者可以自行增加里面的内容，自定义页面内容，我也提供我的这部分内容

```apache
<!-- 分类总览页面 -->
<div class="body-container">
    <div class="content-container layout-block">
      <section class="layout-padding">
        <div class="card-container content-padding--large soft-size--large soft-style--box">
          <h2 class="card-text--title" style="margin-bottom: 20px;">所有分类</h2>
  
          <div class="category-cloud-container">
            <% 
              // 获取所有分类
              var categories = site.categories.sort('name').map(function(category){
                return {
                  name: category.name,
                  path: url_for(category.path),
                  count: category.length
                };
              });
  
              // 计算最小和最大文章数
              var min = 1;
              var max = 1;
  
              categories.forEach(function(category){
                min = Math.min(min, category.count);
                max = Math.max(max, category.count);
              });
  
              // 最小和最大值相同时，避免除以零
              if (min === max) {
                max = min + 1;
              }
  
              // 计算每个分类的大小
              categories.forEach(function(category){
                var size = min === max ? 5 : Math.floor(((category.count - min) / (max - min)) * 9) + 1;
                size = Math.min(10, Math.max(1, size)); // 确保范围在1-10之间
  
                // 输出分类项
            %>
              <div class="category-item category-size-<%= size %>">
                <a href="<%= category.path %>">
                  <%= category.name %>
                  <span class="category-count"><%= category.count %></span>
                </a>
              </div>
            <% }); %>
          </div>
        </div>
      </section>
    </div>
  </div>
```

同样的要增加css样式，读者可以自行创建修改，注意要在`menu:`中添加`分类: /categories`。

同样的可以这样创建tags标签总览界面，以下是我的测试tags总览页面。
![Snipaste_2025-03-31_22-30-09.png](https://s2.loli.net/2025/03/31/s3MitIWKNwdgGJa.png)
