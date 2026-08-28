---
title: "长上下文 LLM：200K 窗口如何改变架构决策"
description: "上下文窗口从 8K 到 200K，RAG 的时机与必要性被重塑。本文分析长窗口对 Agent 与架构的实质影响。"
pubDatetime: 2026-05-19T10:00:00+08:00
modDatetime: 2026-05-19T10:00:00+08:00
author: youyu-youth
featured: false
draft: false
tags:
  - long-context
  - context-window
  - architecture
  - rag
category: "大语言模型"
timezone: "Asia/Shanghai"
---

一年前，LLM 的限制是“塞不进整个代码库”。2026 年，200K+ token 窗口已成常态，Agent 可以同时理解整个服务、测试、依赖与文档。

## Table of contents

## 窗口变大，RAG 还需要吗

答案是：**需要，但时机变了**。

- **小窗口时代**：RAG 是必需品，不 RAG 就看不见
- **大窗口时代**：RAG 是优化品，用于在“已能看见”时“看得更准、更省”

Agent 现在可以一次性持有大工作上下文，输出质量显著提升，但仍受 40% 阈值约束——超过后性能反而下降。因此，即便窗口变大，Context Engineering 依然关键。

> [!INFO]
> 上下文窗口容量已成为 LLM 选型的关键变量，尤其对 Agent 工作流。

## 架构启示

1. **服务边界**：将服务拆至“可被单次上下文理解”的规模，Agent 友好度大幅提升
2. **命名与类型**：一致的命名、强类型、良好模块化，让大窗口的利用率更高；“靠口口相传的意大利面代码”是 Agent 的死角
3. **RAG 策略**：从“全量检索”转向“按需检索”，仅在跨服务、大仓场景启用

## Lost in the Middle 仍在

即便窗口变大，模型对中间位置信息的利用率仍低于首尾。大窗口并未根治该问题，只是缓解。

应对：

- 将关键指令置于首尾
- 用结构化摘要替代原文堆砌
- 关键信息重复锚定（首尾各一次）

```ts
// 构造大上下文 Prompt 的建议顺序
const prompt = [
  systemInstruction,      // 首部：最重要
  relevantCodeSummary,    // 中部：摘要而非原文
  retrievedDocs,          // 中部：按需
  userQuery,              // 尾部：任务
  systemInstructionRepeat // 尾部：复述关键约束
].join("\n")
```

## 选型建议

- **Agent 场景**：优先大窗口模型，评估“有效上下文”而非“标称窗口”
- **成本**：大窗口按 token 计费，需结合缓存与摘要策略
- **长文问答**：仍需 RAG + 评估，而非直接丢全量文本赌模型能记住

## 小结

200K 窗口改变了“能否看见”的问题，但未改变“如何看得准、看得省”的问题。RAG 从必需品变为优化品，架构设计需围绕“Agent 可理解的边界”重新思考。
