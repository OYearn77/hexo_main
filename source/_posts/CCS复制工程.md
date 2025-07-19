---
title: CCS复制工程
toc: true
mathjax: true
date: 2025-07-16 10:56:36
subtitle:
categories:
tags:
cover:
---
## 前言

如果单纯的将外部DSP工程复制改名导入CCS会发现工程名一样，且更改复制后的工程复制前的工程也会更改，所以CCS中工程复制必须遵照以下方法进行复制。

## 操作

1. 首先要将改的程序在**文件夹**中复制粘贴一份![1.png](https://s2.loli.net/2025/07/16/G3FKIfxtEvJnAwl.png)
2. 将该项目在CCS中重命名**rename**，将名字由MIMO\_V5\_0724改为MIMO\_V5\_0724111![2.png](https://s2.loli.net/2025/07/16/zcZEU2HYfjltRhe.png)
3. 将复制的程序在CCS中导入![4.png](https://s2.loli.net/2025/07/16/qvNxtOfCAri29eF.png)
4. 如有报错请勾选![5.png](https://s2.loli.net/2025/07/16/7Yeir2XBJgTdI4Z.png)
5. 导入后，将导入的项目改名，将名字由MIMO\_V5\_0724改为MIMO\_V6\_0725![6.png](https://s2.loli.net/2025/07/16/C1GdlbyYJqsvKME.png)
6. 将原程序名称改回来，将名字由MIMO\_V5\_0724111改回MIMO\_V5\_0724![7.png](https://s2.loli.net/2025/07/16/QKXReJokIUW4uyV.png)
7. 将文件夹中的副本删除![8.png](https://s2.loli.net/2025/07/16/h3SadW8CcrsIyJF.png)
8. 进入新工程的Debug文件夹内，将老文件编译生成的三个文件删除`.map .out .xml`
