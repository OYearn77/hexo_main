---
title: readme
date: 2025-03-29 22:19:47
subtitle: 新导引头追击目标MATLAB仿真程序
categories: 
tags: 
cover:
toc: true
---
# 新导引头追击目标MATLAB仿真程序

基于SDL程序(此程序来源于zby)，将回波处理改为实部和虚部，添加了抽取因子，改变噪声选取使得SNR增益。

---

## 程序版本说明

***multi_cpi_gap*** 老版本仿真程序

***multi_cpi_v2*** 新版本仿真程序，基于SDL，添加了抽取因子改变了噪声选取

***multi_cpi_v3*** 基于V2,修改了匹配滤波为失配滤波

***multi_cpi_v4*** 基于V2将2维升到3维

***multi_cpi_v5*** 基于V3 无大修改 使用了quanxiangcan文件生成的全相参SNR增益的数据进行绘图

***quanxiangcan_tosave*** 全相参数据生成，生成100个CPI对应全相参信噪比增益，只用于生成第一个prt数据绘图和snr增益绘图

***multi_cpi_v6*** 基于老V3，添加了相干积累，只用1个CPI，用于毕设，现在的信噪比非常大脉压无法显示出目标，所以用相干积累，尽量不要再修改任何参数了

***multi_cpi_v7*** 基于V6，添加了质心凝聚

***multi_cpi_v8*** V8基于V7和V3，添加了抽取功能,减少计算时间,系质心凝聚完美形态，解决了很多问题

***multi_cpi_v9*** V9基于V8，添加了cfar检测，用于和质心凝聚做对比

***multi_cpi_v10*** V10基于以上所有，有抽取，添加了3D处理能力,可以相干积累，cfar检测，质心凝聚，4模式回波峰值对比，合并用于毕设，也可当作集成仿真程序

## 平滑数据处理相关程序

***multi_cpi_v100_1*** 用于平滑MIMO,MISO增益————这个部分内容仿照CZH,OYW的写

***multi_cpi_v100_2*** 用于平滑全相参数据生成

***multi_cpi_v100_3*** 使用了v100_2文件生成的全相参SNR增益的数据进行绘图，注意两边CPI值要一样

***multi_cpi_v100_4*** 老版本V3，有点问题，降低SNR用于生成震荡幅度较大的SNR增益图

## 距离检测相关程序

***multi_cpi_v3.5_rangecomb*** 基于老v3添加了3种距离检测方式传'统峰值检测''联合搜索''SFT搜索'，运算量大较耗时间

***multi_cpi_v3.8_rangecomb*** 基于v3.5为'SFT搜索'添加激增限制

***multi_cpi_v3.9_rangecomb*** 基于v3.8为'SFT搜索'简化算法，减少时间消耗但性能也相应减少

***multi_cpi_DEerror_simple*** 是sft算法的一个简易测试模型，于添加到正式代码之前测试，现已无

***multi_cpi_v200_1*** 基于V2和V3_8,由于曾经的距离测量和现在的距离测量算法不一样了曾经5m左右的误差现在有40m左右误差，不清楚怎么回事

***multi_cpi_v200_2*** 基于V200_1改进stf算法(时间并无太多减少)，用于高抽取因子情况。<br>

<div align="left" cursor="pointer">
  <b><a href="#top">↥ 返回顶部</a></b>
</div>
