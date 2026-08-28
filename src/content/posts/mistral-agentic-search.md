---
title: "Mistral Agentic Search：用导航替代重复检索"
description: "Mistral 的 Agentic Search 通过 search/open/navigate/read/grep 五工具，将 FinanceBench 准确率从 26.7% 提升至 86%，同时降低 33% token 消耗。"
pubDatetime: 2026-01-27T10:00:00+08:00
modDatetime: 2026-01-27T10:00:00+08:00
author: youyu-youth
featured: false
draft: false
tags:
  - agentic-search
  - mistral
  - retrieval
  - rag
category: "人工智能"
timezone: "Asia/Shanghai"
---

One-shot RAG 在复杂文档上会失效：答案分散在多份报告的表格、脚注与条款中，单次 Top-K 检索无法拼出真相。Mistral 在 2026-08 发布的 Agentic Search，给出了“检索即导航”的解法。

## Table of contents

## One-shot RAG 的三处断裂

1. **检索无推理**：模型只能基于首次检索的 chunk 回答，即使它们不完整
2. **Chunk 级限制**：信息在多模态复杂文档中，索引找到文档却无法“打开、定位、验证”
3. **无迭代**：需多轮检索的问题，单次检索无法通过“再搜一次、换个关键词、跟进引用”来修正

## Agentic Search：五工具的检索循环

Mistral 在既有索引上叠加五工具，模拟文件系统操作：

- `search`：语义搜索
- `open`：打开文档
- `navigate`：定位章节/表格
- `read`：读取上下文
- `grep`：关键词精确定位

模型不再被动接受 Top-K，而是**主动决定**：需要哪份文档、哪个章节、多少上下文，并在需要时换路线。

> [!TIP]
> 这套工具无需微调，模型推理能力越强，检索质量自动提升——检索质量不再被 chunk 策略封顶。

## 基准结果：质量与效率双升

在 FinanceBench（金融财报）与 OfficeQA Pro（表密集、多文档）上的对比，使用默认分块与排序，未做调优：

**FinanceBench：**

- 单次 RAG：26.7%
- + 搜索循环：~74%（+47pp）
- + 导航工具：86%（再 +8-9pp）

**OfficeQA Pro：**

- 单次 RAG：6.3%
- 全循环：51.9%（+45.6pp）

**效率：**

- Token 消耗降低 23.9%（Mistral Medium 3.5）至 33.7%（GLM-5.2）
- P90 延迟 255s → 154s（-39.6%）
- 轮次减少 2-7%

> [!NOTE]
> 导航不是额外开销，而是替代了大量无效的重复广域搜索，用精准定位换效率。

## 为什么“导航”比“再搜”更有效

- 重复搜索是在“猜关键词”
- 导航是在“验证证据”：打开已命中的文档，读表、看脚注、比对多源

```text
One-shot:
  Q -> 检索 Top-5 -> 生成（缺证据 → 幻觉）

Agentic Search:
  Q -> 检索 -> 打开 Top-1 -> 发现缺表 -> navigate 到表格 -> read 上下文 -> 仍不足 -> grep 关键词 -> 再检索 -> 验证 -> 生成
```

## 落地建议

1. **索引仍是基础**：先做好 chunk、重排、混合检索，再叠 Agentic 循环
2. **用导航工具替代重试**：当首次检索未命中，优先 `open/navigate` 而非盲目换查询
3. **评估工具成本**：每增加一个工具定义都会增加上下文税，需平衡

## 小结

Agentic Search 验证了 2026 年的核心转向：检索从“算法”变为“智能体的行为”。模型越强，检索越好，这让检索系统的投资具备了随模型升级而自动增值的属性。
