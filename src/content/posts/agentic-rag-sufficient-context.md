---
title: "Agentic RAG：Sufficient Context Agent 如何止幻"
description: "Google Gemini 的 Agentic RAG 引入 Sufficient Context Agent，以“是否够回答”为门控，跨库检索准确率提升 34%。本文拆解其多智能体设计。"
pubDatetime: 2026-01-06T10:00:00+08:00
modDatetime: 2026-01-06T10:00:00+08:00
author: youyu-youth
featured: true
draft: false
tags:
  - agentic-rag
  - retrieval
  - gemini
  - multi-agent
category: "人工智能"
timezone: "Asia/Shanghai"
---

传统 RAG 是“检索一次，生成一次”。Agentic RAG 则是“规划、推理、迭代检索，直到够回答为止”。Google 在 2026-06 发布的 Gemini Enterprise Agentic RAG，将这一思想推向了生产级。

## Table of contents

## 为什么需要 Agentic RAG

单次检索的失败模式很典型：医生问“患者的用药、饮食与过敏史”，第一次检索只找到用药与饮食，模型要么幻觉补全，要么直接说“信息不足”——而过敏史其实就在另一个库中，只是没被检索到。

Agentic RAG 的关键区别是**持久性**：知道自己缺什么，并持续搜索直到上下文完整。

> [!NOTE]
> 相比标准 RAG，该框架在事实性数据集上准确率提升高达 34%。

## Gemini 的多智能体设计

```
Root Agent
  ├─ Planner Agent：识别需查询的领域（药房、营养、临床笔记）
  ├─ Query Rewriter：将复杂请求拆为可检索的简单问题
  ├─ RAG Agent：执行检索
  ├─ Sufficient Context Agent：门控（核心创新）
  └─ Synthesis Agent：生成最终答案
```

### Sufficient Context Agent：质检员

这是新框架的核心创新，站在流水线末端的质检员，检查三件事：

1. **片段级**：检索到的文本块是否包含回答所需的句子
2. **草稿级**：对比 Prompt、草稿与片段，判断是否覆盖所有子问题
3. **缺口级**：若不足，生成具体的 Reason 与 Feedback

示例反馈：

```text
不足原因：已找到用药与饮食，缺失过敏史
反馈：请专门搜索 '皮疹' 或 '不良反应'，目标库为临床笔记
```

随后 Query Rewriter 发起新一轮针对性检索，RAG Agent 深挖之前忽略的文件，直到 Sufficient Context Agent 判定“可停止”。

## Cross-Corpus 能力

企业数据常分散在多个团队管理的异构库中。Gemini 在 FramesQA（824 问，2676 份 PDF）上的实验：

- **单库**：仅在 FramesQA 文档中检索
- **跨库**：混入 3 个干扰数据集，Planner 需自行路由

结果：跨库准确率 90.1%，与单库几乎持平，且延迟差异在 3% 以内。这证明 Planner 的路由与 Sufficient Context 的门控在多源场景下依然稳健。

## 与 Mistral Agentic Search 的对比

| 特性 | Gemini Agentic RAG | Mistral Agentic Search |
|---|---|---|
| 核心门控 | Sufficient Context Agent | 迭代检索 + 导航工具 |
| 工具 | 多 Agent 协作 | search/open/navigate/read/grep |
| 跨库 | 原生支持 | 依赖索引配置 |
| 提升 | 事实性 +34% | FinanceBench 26.7%→86% |

二者共同验证了一个趋势：**检索质量随模型推理能力而扩展**，而非被 chunk 策略封顶。

## 落地启示

1. **检索即工具**：让 LLM 自主决定何时检索、如何改写查询，而非固定 Top-K
2. **门控先行**：在生成前加入“是否够回答”的校验，比事后纠错更省 token
3. **反馈具体化**：不要只输出“不足”，要输出“缺什么、去哪找、用什么关键词”

```ts
// 伪代码：Sufficient Context 门控
const draft = llm.draft({ query, snippets })
const check = sufficientAgent.evaluate({ query, draft, snippets })
if (!check.isSufficient) {
  const nextQuery = rewriter.rewrite(check.feedback)
  return rag.search(nextQuery) // 迭代
}
return synthesizer.synthesize({ query, snippets })
```

## 小结

Agentic RAG 的本质是将检索从“一次性操作”变为“可推理的循环”。Sufficient Context Agent 提供了可审计、可追踪的止幻机制，这对企业级知识助手的可靠性至关重要。
