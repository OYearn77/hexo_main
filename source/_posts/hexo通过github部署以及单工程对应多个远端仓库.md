---
title: hexo通过github部署以及单工程对应多个远端仓库
toc: true
mathjax: true
date: 2025-04-10 10:07:01
subtitle:
categories: hexo内容
tags: 
  - hexo
  - git
  - 部署
cover: https://s2.loli.net/2025/04/10/tXdQ42sZ3Y9hITA.jpg
---
## github部署上线hexo网页

1. 在github建立一个这种类型名字的仓库`oyearn77.github.io`，最前面的oyearn77改成你的github名(不用在意大小写字母)，后面接上`.github.io`，注意类型要改为public才可以让他人访问。
2. 修改网站部署设置，找到工程配置文件`_config.yml`，修改下方项目发布信息，repo改为你的仓库地址，branch改为云端仓库的根目录分支。

   ```
   deploy: #项目发布
     type: git
     repo: https://github.com/OYearn77/oyearn77.github.io.git
     branch: main
   ```
3. 上传hexo工程到这个云端仓库，这里要使用git命令进行指定，也可以使用vscode操作，这个部分在后面讲
4. 请在setting->pages中确认远端根目录分支正确，基本上vscode上传到github中的根目录分支为`main`，git命令上传的基本是`master`![Snipaste_2025-04-10_10-22-41.png](https://s2.loli.net/2025/04/10/JpzRlrhCNek28HW.png)
5. 在本地git bash中运行命令

   ```apache
   hexo clean //执行此命令后继续下一条
   hexo g //生成博客目录
   hexo s //本地预览
   hexo d //部署项目
   ```
6. 现在可以通过`https://yourname.github.io`访问部署的网站

## 单工程对应多个远端仓库

### git操作

上传**指向ssh地址**，origin换个名字，后面的是新仓库的ssh地址

```apache
git remote add origin git@github.com:OYearn77/git_test.git
```

通过`git remote -v`查看提交的仓库的对应关系，示例如下![QQ20250410-154729.png](https://s2.loli.net/2025/04/10/trq2MHBZlgPL5KO.png)
上传工程至github，`git push <…> origin main`，origin换为你改的名字，main与你仓库的根目录设置对应，<...>可以填-f 强制覆盖，–set-upstream 绑定提交关系

**注意：后期更新网页时可能push不上去，建议使用-f强制覆盖解决**

### vscode操作

在原代码管理中添加远程库，也会让你进行创建仓库，填ssh地址和命名![QQ20250410-155526.png](https://s2.loli.net/2025/04/10/XH6cnmPOkDfTzhr.png)

之后切换远端分支进行操作即可![QQ20250410-160039.png](https://s2.loli.net/2025/04/10/wo6NgtmFvlrTHS1.png)
