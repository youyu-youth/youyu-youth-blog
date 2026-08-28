---
title: "RLVR 与 GRPO：让小模型拥有推理能力"
description: "2026 年的突破不在参数规模，而在后训练。通过 RLVR、GRPO 与 On-Policy DPO，小推理模型已能媲美专有系统。"
pubDatetime: 2026-05-05T10:00:00+08:00
modDatetime: 2026-05-05T10:00:00+08:00
author: youyu-youth
featured: true
draft: false
tags:
  - rlvr
  - grpo
  - reasoning
  - training
category: "大语言模型"
timezone: "Asia/Shanghai"
---

2026 年，AI 工程的叙事从“更大参数”转向“更强后训练”。前沿推理能力不再被巨型闭源模型垄断，开源小模型通过精巧的后训练已能接近甚至媲美。

## Table of contents

## 三大后训练支柱

### 1. RLVR：可验证奖励的强化学习

Reinforcement Learning with Verifiable Rewards（RLVR）将奖励从“开放式自然语言”转向**程序化、可验证的标尺**：编译器、正则、单元测试。

- 奖励可被机器判定，无需人工偏好标注
- 适合代码、数学、格式化等有明确对错的任务
- 让 Agent 在与环境的交互中**从反馈学习**，而非仅模仿

### 2. GRPO：组相对策略优化

Group Relative Policy Optimization（GRPO）是 2026 年最受关注的强化学习算法：

- 对同一 Prompt 采样一组输出，按组内相对优劣更新策略
- 无需独立的价值网络，训练更稳定、资源更省
- 与动态量化结合，将前沿推理压缩至消费级可运行足迹

### 3. On-Policy DPO：根治 Doom Looping

小推理模型曾被“doom looping”（重复循环）困扰。On-Policy DPO 数据生成管线刻意**将成功生成与贪心循环生成配对**，让模型学会主动打破重复。

> [!NOTE]
> 这三者的组合，让开源社区在消费级硬件上复刻了此前仅闭源可达的推理稳定性。

## 效果：小模型的大推理

AI Engineer 2026 报告指出，真正的差异化在后训练对齐。社区通过上述管线，已构建出“自纠正”模型，在编程与推理基准上接近专有系统。

```text
预训练（通用能力）
  ↓
后训练（RLVR + GRPO + DPO）
  ↓
消费级推理模型（可本地运行、稳定、抗循环）
```

## 对开发者的启示

- **选型**：不必盲目追最大模型，关注后训练质量与推理稳定性
- **应用**：在代码生成、Agent 规划等需“可验证”的场景，优先考虑经 RLVR 训练的模型
- **成本**：小推理模型 + 良好 Harness，往往比大模型 + 粗糙 Harness 更优

## 小结

2026 年的模型进步是“工程化的进步”。参数规模的红利放缓，后训练的精耕细作成了主战场。理解 RLVR 与 GRPO，有助于在模型选型与微调策略上做出更理性的决策。
