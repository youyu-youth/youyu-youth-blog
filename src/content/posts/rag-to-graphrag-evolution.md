---
title: "从 Naive RAG 到 GraphRAG：为什么需要图"
description: "向量 RAG 在生产中撞上天花板，GraphRAG 带来 3 倍准确率提升。本文对比演进路径、适用场景与落地成本。"
pubDatetime: 2025-12-16T10:00:00+08:00
modDatetime: 2025-12-16T10:00:00+08:00
author: youyu-youth
featured: true
draft: false
tags:
  - rag
  - graphrag
  - knowledge-graph
  - retrieval
category: "人工智能"
timezone: "Asia/Shanghai"
---

RAG（Retrieval-Augmented Generation）是 2023-2024 年最热的架构，但到 2026 年，严肃的企业知识助手几乎都已转向 GraphRAG 或 Agentic RAG。原因并非 RAG 不好，而是 Naive RAG 的天花板太低。

## Table of contents

## Naive RAG 的三宗罪

基于纯向量的 RAG 依赖“高维空间中的余弦相似度”来决定相关性。在原型中表现不错，但在生产中暴露三个问题：

1. **低精度**：Top-K 检索到大量无关 chunk，更多 token ≠ 更高性能
2. **低召回**：关键信息分散在多个不相连文件中，单次检索无法拼出全貌
3. **Lost in the Middle**：即使塞入大窗口，模型对中间位置的信息利用率显著下降

Jerry Liu（LlamaIndex）的警告很直接：“More retrieved tokens does not always equate to higher performance.”

## GraphRAG：用显式关系补向量盲区

GraphRAG 的核心是将**确定性知识图**与**向量检索**结合：

- 向量负责语义近邻（“这段话在说什么”）
- 图负责显式关系（“谁与谁相关、谁引用谁、谁从属于谁”）

来自 data.world、LinkedIn、Microsoft 的研究显示，该组合可带来**约 3 倍（~77%）的准确率提升**。

> [!TIP]
> 向量空间对人类是不透明的，图是显式、确定、可视的。这对企业所需的治理与可解释性至关重要。

```text
Naive RAG:
  Query -> 向量检索 Top-K -> 拼接 -> 生成
  问题：跨文档、多跳推理时崩溃

GraphRAG:
  Query -> 向量初筛 -> 图遍历（实体-关系-社区）-> 重排 -> 生成
  优势：可追踪、可审计、支持多跳
```

## 架构对比

| 维度 | Naive RAG | GraphRAG | EnSI-RAG（实体结构索引） |
|---|---|---|---|
| 索引 | 固定 chunk | 实体-关系-社区 | 实体中心 passage |
| 检索 | 单次 Top-K | 多步图遍历 | 结构化 handle + 原文 |
| 可解释性 | 低 | 高（路径可视） | 中（保留原文溯源） |
| 成本 | 低 | 高（建图） | 中 |

## 何时需要上图

- **跨文档聚合**：财务、法律、学术场景，需拼凑多文件证据
- **多跳推理**：答案需经 2-3 跳关系才能到达
- **治理要求**：需回答“为什么给出这个答案”的审计链

反之，单文档问答、FAQ 场景，Naive RAG 仍是性价比之选。

## 落地建议

1. **先用好 RAG 再上图**：优化 chunk 策略、重排、查询改写，往往能先提升 20-30%
2. **增量建图**：从核心实体（人、项目、产品）开始，而非全量建图
3. **评估先行**：用 FinanceBench、OfficeQA Pro 等基准量化“是否值得为图付费”

```ts
// 伪代码：GraphRAG 查询
const entities = extractEntities(query) // ["Q3 营收", "A 产品"]
const community = graph.findCommunity(entities)
const passages = vector.search(query, { filter: { community } })
const answer = llm.generate({ query, passages, trace: community.path })
```

## 小结

RAG 的演进不是“抛弃向量”，而是“用图给向量补课”。GraphRAG 用显式关系解决了向量盲区，代价是更高的建图与维护成本。2026 年的选型应基于**问题类型**而非技术潮流：简单问题用 RAG，复杂、多跳、需审计的问题用 GraphRAG。
