---
title: 上位机数据生成模块[EchoDataGenerate]
toc: true
date: 2025-04-06 17:09:45
subtitle:
categories:
tags:
cover:
mathjax: true
---
## 帧头内存与填充

帧头为文件起始部分内容，数据生成模块最终会生成两个文件，为回波数据文件和轨迹数据文件，命名规则为

```c
//回波数据
strFileName = str + _T("\\MIMO_2T2R_ECHO_") + tm.Format(_T("%Y%m%d_%H%M%S")) + _T(".dat");
//轨迹数据
strFileName = str + _T("\\MIMO_2T2R_TRACE_") + tm.Format(_T("%Y%m%d_%H%M%S")) + _T(".dat");
```

这个部分由以下结构体组成，具体变量名意义见`mwRadarCtrlComm.h`。

```c
typedef struct tagFrameFileHead
{
	tagFrameFileHead(): wHeadId1(0x0000), wHeadId2(0x7777), wHeadId3(0xBC1C), wWorkModeChNum(0), wADChSel(0), wDAChSel(0), dwADf1Check1(0),
		dwADf2Check1(0), dwADf1Check2(0), dwADf2Check2(0), dwADf1Check3(0), dwADf2Check3(0), dwADf1Check4(0), dwADf2Check4(0), dwADf1Check5(0), dwADf2Check5(0),
		dwADf1Check6(0), dwADf2Check6(0), dwADf1Check7(0), dwADf2Check7(0), dwADf1Check8(0), dwADf2Check8(0), dwADf1Check9(0), dwADf2Check9(0), dwADf1Check10(0), dwADf2Check10(0),
		dwADf1Check11(0), dwADf2Check11(0), dwADf1Check12(0), dwADf2Check12(0), wRsv1(0), wRsv2(0), wLRPulsePRTWidth(0), wMRPulsePRTWidth(0), wSRPulsePRTWidth(0), wLLRPulsePRTWidth(0),
		wLRCpiPulseNum(0), wMRCpiPulseNum(0), wSRCpiPulseNum(0), wLLRCpiPulseNum(0), wLRCpiNum(0), wMRCpiNum(0), wSRCpiNum(0),
		wLLRCpiNum(0), wPulsePRTWidthPD(0), wCpiPulseNumPD(0), wCpiSendInterv(0), wCellNum(0), dwDSNR(0), wWinNum(0), wRsv3(0), wRsv4(0)
	{
		memset(wWaveGate, 0, sizeof(WORD) * SERIAL_REPORT_WAVE_GATE_LEN);
	}
```

总共包含27个单独WORD变量和1个由数组组成的变量包含20个WORD，和25个DWORD变量，其中WORD为2Byte、DWORD为4Byte，整个帧头内存大小为194Byte。

其中为了更大程度的存储相关参数将多个参数进行拼合组成1个WORD/DWORD进行存储，如下面通过左移操作存储空/线馈（bit15-14 TRUE为空馈）、波形参数（bit13-12 TRUE为PD 、FALSE为PC）、主从DYT（bit11-10）、PC雷达参数种类（bit9-8）、延时误差（bit7-0）。

```c
FileHead.wRsv1 = (m_SceneParam.bKongXianKui << 14) | (m_SceneParam.bWaveForm << 12) | ((m_SceneParam.iLeadSeeker - 1) << 10) | ((m_SceneParam.iParamNum - 1) << 8) | (INT(m_ErrorParam.fSitaErr) & 0x00ff);
```

以下将单个通道的接收矫正参数的实虚部(short类型)存储在一个DWORD上，f1和f2为雷达1、2。

```c
FileHead.dwADf1Check1 = (m_RecvCheckParam1.iADCheckf1ReParam1 << 16) | m_RecvCheckParam1.iADCheckf1ImParam1;
FileHead.dwADf2Check1 = (m_RecvCheckParam1.iADCheckf2ReParam1 << 16) | m_RecvCheckParam1.iADCheckf2ImParam1;
```

为区分回波文件和轨迹文件，将轨迹文件帧头的`wHeadId1(0x0000)`修改为`wHeadId1(0x0001)`

## 配置相控阵天线

目标：配置了一个4×4的相控阵天线，计算了12个阵元的位置，并根据目标的俯仰角和方位角计算了相位权重

设置阵元间距为半波长，行间距为2倍的波长，阵元将使用行间距进行分列排布，如1与2间的间隔为2λ，计算相位权重实现波束形成。![QQ20250407-094134.png](https://s2.loli.net/2025/04/07/lcThgudiqF8RAy4.png)

## 主要流程

根据信噪比确定编码位深度

```apache
if ((m_WaveParam.iSNR >= -20) && (m_WaveParam.iSNR < -10))  N = 13;
else if ((m_WaveParam.iSNR >= -10) && (m_WaveParam.iSNR < 0))  N = 14;
else if (m_WaveParam.iSNR >= 0)  N = 15;
```

量化编码代码为 `sEncod1 = (SHORT)(ldEcho1 * pow(2.0, N) / 3)`，如果 N = 14，则缩放因子为 2^14 = 16384。
如果 ldEcho1 的值为 0.5，则编码后的值为：0.5 * 16384 / 3 约等于 2731，/3 是因为两个 cos 信号的和加上噪声最大峰值为 3，编码后的值范围在 ±(2^N)/3 左右。

为四种模式(超长、长、中、短)创建时间向量，从 -ldLLRTe/2 （脉冲中心前的半个脉冲宽度）开始，在 ldLLRTr - ldLLRTe/2 - m_ldTs （脉冲重复时间减去半个脉冲宽度）结束，以 m_ldTs （采样周期）递增，计算这四个模式的相关参数

根据目标距离的变化进行模式选择，中短脉冲切换设置为1.65km，长中脉冲切换设置为4.2km，切换时也将相关参数重新赋值进行新的计算

添加位置误差并记录雷达和目标位置-->计算雷达和目标之间的径向速度-->计算四种发射接收组合的延时-->将时间延时转换为采样点延时-->基于延时与相位权重生成信号-->更新位置

## 信号的生成与格式设计

### 计算波门函数

计算有效接收窗口

```apache
if (fabs(m_T0[i] - delay_1t1r) < ldTe / 2) bGate1 = 1; else bGate1 = 0;
if (fabs(m_T0[i] - delay_2t1r) < ldTe / 2) bGate21 = 1; else bGate21 = 0;
```

```apache
                    |<---- ldTe ---->|
                    |                |
                    |                |
时间轴 -------------|----------------|------------------>
                    |                |
          delay_1t1r- ldTe/2      delay_1t1r + ldTe/2

                    |<---有效接收窗口--->|
                    |                   |
bGate1值：    0 ... 0 1 1 1 1 1 1 1 1 1 0 0 0 ...
```

### 接收信号合成

在每个波门内采样点逐点计算2接收信号求和后加噪，对 ldEcho1 进行量化编码

```apache
ldData1 = bGate1 * cos(2 * pi * m_WaveParam.ldCf1 * m_T0[i] + pi * m_ldMu * (m_T0[i] - delay_1t1r) * (m_T0[i] - delay_1t1r) - 2 * pi * m_WaveParam.ldCF1 * delay_1t1r_F + aPw);
ldData21 = bGate21 * cos(2 * pi * m_WaveParam.ldCf2 * m_T0[i] + pi * m_ldMu * (m_T0[i] - delay_2t1r) * (m_T0[i] - delay_2t1r) - 2 * pi * m_WaveParam.ldCF2 * delay_2t1r_F + aPw);
ldEcho1 = ldData1 + ldData21;
dNoise1 = 0.707 * u(e);//归一化噪声
ldEcho1 = ldEcho1 + dNoise1 / dAs_An;//加噪声
```

### 缓存区格式设计

每两个采样点进行一次大循环，一个大循环内有两个小循环。其中每个采样点根据通道得到的回波结果根据特殊奇偶构造填充在缓存区内。在偶数阵元上每次填充完1个short指针向后移动一个short进而填充后面奇数阵元的1个short，之后指针向后移动3个short，这中间有2个short空位留存。按照这个流程填充完1个采样点在12个通道的结果。

```apache
循环1（假设从位置0开始）:
+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+
| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |10 |11 |12 |13 |14 |15 |16 |17 |18 |19 |...
+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+
|E0 |E1 |   |   |E2 |E3 |   |   |E4 |E5 |   |   |E6 |E7 |   |   |E8 |E9 |   |   |...
+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+                                        
```

在填充最后一个采样点后根据flag轮换变换判断指针前进后退，此时还在大循环中，指针向前移动19个short开始填充第二个采样点，此时指针在2号位置前方，按照刚刚的流程填充完成第二个采样点，此时0-23号位均被填充完毕，离开大循环指针向后移动1个short开始新一轮大循环。

```apache
循环2:
+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+
| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |10 |11 |12 |13 |14 |15 |16 |17 |18 |19 |...
+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+
|E0 |E1 | H0| H1|E2 |E3 | H2| H3|E4 |E5 | H4|H5 | E6|E7 | H6| H7|E8 |E9 | H8| H9|...
+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+
```

将上面的过程图示化展示成最终格式样式![上位机波形生成格式.jpg](https://s2.loli.net/2025/04/07/XeIiSKgmholqaWd.jpg)

一个cpi的排列形式如下，主从导引头分别存储一个cpi的回波数据![QQ20250407-112631.png](https://s2.loli.net/2025/04/07/f6cCrRw18yoIhKu.png)

## 回波大小

* DA采样率为400MHz
* 4模式脉冲的开窗倍数均为1.6
* 对于短脉冲，1个prt的采样点为 
  $$
  4\mathrm{us} \times 400\mathrm{MHz} \times 1.6 = 2560\mathrm{点}
  $$
* 则1个prt，中脉冲采样点为6400点，长脉冲采样点为16000点

<br>

* 对于短脉冲一个CPI的大小为
  $$
  2560\mathrm{点} \times 1024\mathrm{(prt)} \times 12\mathrm{(通道数)} \times 2\mathrm{Byte}/\mathrm{点} = 62914560\mathrm{Byte} = 60\mathrm{MB}
  $$
* 同理一个CPI，中脉冲大小为150MB，长脉冲大小为375MB。
