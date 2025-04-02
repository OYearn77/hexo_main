---
title: git操作与VSCODE操作
toc: true
date: 2025-04-02 11:01:39
subtitle:
categories: git基本操作
tags:
  - git
cover: https://s2.loli.net/2025/04/02/kDgnZ9hVdtvCasT.png
---
## 基本配置

### 设置用户信息

在引号内填写需要的信息

```apache
git config –global user.name “yourname”
git config –global user.email “youremail”
```

查看用户信息

```apache
git config –global user.name
git config –global user.email
```

### .bashrc修改

#### 命令缩写

创建打开gitbash执行，使用vi编辑器修改

```apache
cd ~
touch .bashrc
vi .bashrc
```

vi编辑器中按【ESC】跳到命令模式，i为insert插入。要退出先在命令模式按【:】,再输入【wq】，按enter即可保存并退出vi编辑器。

【推荐】在.bashrc中进行修改命令缩写

```apache
alias git-log='git log --pretty=oneline --all --graph --abbrev-commit'
alias ll='ls -al'
```

#### 解决中文乱码问题

先不对 0x80 以上的字符进行转义

```apache
git config –global core.quotepath false
```

再到.bashrc最后添加

```apache
export LANG=”zh_CN.UTF-8”
export LC_ALL=”zh_CN.UTF-8”
```

### gitbash修改字体

右键 option，也可修改界面语言
![Snipaste_2025-04-02_11-37-46.png](https://s2.loli.net/2025/04/02/xldkaK1vGXWmTQ2.png)

## 本地仓库操作

### 创建本地仓库

任意位置创建文件夹，右键git bush here，输入 `git init`，此时文件夹内创建了.git隐藏文件夹。

### 提交本地仓库

`git add .` 将文件输入暂存区(注：git add +文件名 或 git add . 提交所有)

`git  commit -m “注释信息”` 将暂存区提交到本地仓库
![图片1.png](https://s2.loli.net/2025/04/02/XsOhbNpZWA1Hz5i.png)

`git status` 查看状态，下面是提交前后状态
![图片2.png](https://s2.loli.net/2025/04/02/LrcMnj3FbIx6TR2.png)

`git log` 查看提交文件
![图片3.png](https://s2.loli.net/2025/04/02/RT31mcKIBxQGgJh.png)

修改文件后再提交
![图片4.png](https://s2.loli.net/2025/04/02/1Zx6iHopcXy3C8s.png)

使用简化代码`git-log`
![图片5.png](https://s2.loli.net/2025/04/02/tny6dEuNxlFcDqR.png)

### 版本回退/前进

`git reset --hard [commit值]`间2将版本跳转到对应哈希值的版本，commit值只需要填写简化后的哈希值前面7位就行。
![图片6.png](https://s2.loli.net/2025/04/02/AxHE4rgjKaYB3hy.png)

`git reflog`查看历史操作记录，版本回退后再git-log将看不到后退中间的版本，可以通过查看历史记录再进行版本前进
![图片7.png](https://s2.loli.net/2025/04/02/N8Lo2slZHriaJbD.png)

### 某些文件忽略提交

创建.gitignore在里面写忽略文件

```apache
touch .gitignore
```

## 分支操作

### 创建分支

`git branch [dev01]`，创建名为dev01的分支；`git branch -d dev01`，删除dev01分支；`git checkout dev01`，切换分支位dev01，则会在工程中创建名为dev01的指针，dev01改变内容不会影响master与其他分支。
![图片8.png](https://s2.loli.net/2025/04/02/hLzHiS3CYeVswlZ.png)
![图片9.png](https://s2.loli.net/2025/04/02/NnysX5IZdTeGz1i.png)

切换回master后try_diff.a消失
![图片10.png](https://s2.loli.net/2025/04/02/XZvYfN6AMVEbThq.png)
![图片11.png](https://s2.loli.net/2025/04/02/PaqSvBWVeb1sIQL.png)

推荐使用`git checkout -b dev02`，如果没有则创建dev02并切换到dev02

### 合并分支与冲突

分支各修改提交结果，其中div01创建.a文件，master创建.b文件
![图片14.png](https://s2.loli.net/2025/04/02/pUHSum4JA81r2Pg.png)

`git merge dev01`，在master中合并dev01
![图片15.png](https://s2.loli.net/2025/04/02/i6ec37HY9SmtQhk.png)

此时所有文件都有了
![图片16.png](https://s2.loli.net/2025/04/02/gy142AXOZWc89qw.png)

### 分支冲突

当多分支均修改一个文件时会引起冲突
![图片17.png](https://s2.loli.net/2025/04/02/7GycA1Qq34T2aXO.png)![图片18.png](https://s2.loli.net/2025/04/02/CSmGsLitTUnO9EZ.png)

文件里面显示了每个分支在修改部分不同的修改
![图片19.png](https://s2.loli.net/2025/04/02/BzQJwIaHWnOSNdb.png)

修改冲突文件再提交
![图片20.png](https://s2.loli.net/2025/04/02/m2xtj6vrfkVI9RC.png)![图片21.png](https://s2.loli.net/2025/04/02/AIJyNwEvdDjFeup.png)

## 配置SSH公钥并上传下载

### 公钥设置

`ssh-keygen -t rsa`，生成一个公钥，不需要填写什么；`cat \~/.ssh/id\_rsa.pub`，获取公钥

在github中添加这个公钥![Snipaste_2025-04-02_15-51-24.png](https://s2.loli.net/2025/04/02/Li6TBMlHG7IgVX4.png)

测试是否配对`ssh -T git@github.com`![图片22.png](https://s2.loli.net/2025/04/02/CArQSRjkuHfeYoJ.png)

### 上传

在GitHub中建立仓库，上传指向ssh地址

```apache
git remote add origin git@github.com:OYearn77/git_test.git
```

![图片23.png](https://s2.loli.net/2025/04/02/ahBfzWoscmlIu5X.png)

上传工程至github`git push <…> origin master`，-f 强制覆盖，--set-upstream 绑定提交关系

将master分支提交到origin![图片25.png](https://s2.loli.net/2025/04/02/JImRWrStcowQHLs.png)![图片24.png](https://s2.loli.net/2025/04/02/LQTt2EIUqkDRduz.png)

### 克隆至本地

hi \_git为文件夹名，不填写则默认和仓库名一样，此时两边内容会一模一样

```apache
git clone git@github.com:OYearn77/git\_test.git hi\_git
```

## 提交更新与抓取

### 推送

本地增加文件![图片26.png](https://s2.loli.net/2025/04/02/UVQWrDSIajtfuFY.png)

提交后origin/master进行了同步![图片27.png](https://s2.loli.net/2025/04/02/b18RqjlYLivNnWu.png)

### 抓取

`git fetch`，进行拉取可以发现远端的master更新，可用merge合并分支。![图片28.png](https://s2.loli.net/2025/04/02/EaLom2vDeCRdzFZ.png)

合并远端分支`git merge origin/master`![图片29.png](https://s2.loli.net/2025/04/02/MpRIh3jLJzF81ad.png)

### 拉取

`git pull`，拉取并合并更新

## VSCODE中git使用

详见[https://blog.csdn.net/weixin_48024605/article/details/136037857](https://blog.csdn.net/weixin_48024605/article/details/136037857)

## clone 提速

前面加上`git clone https://gitclone.com/`

```apache
git clone https://gitclone.com/github.com/tendermint/tendermint.git
```
