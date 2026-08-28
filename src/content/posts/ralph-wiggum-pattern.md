---
title: "Ralph Wiggum 模式：让 Agent 自主循环到完成"
description: "由 Geoffrey Huntley 在 2025 年中提出的 Ralph 循环，让 Agent 自主迭代直到测试通过。本文拆解其原理、适用边界与工程化要点。"
pubDatetime: 2025-11-25T10:00:00+08:00
modDatetime: 2025-11-25T10:00:00+08:00
author: youyu-youth
featured: false
draft: false
tags:
  - agent-loop
  - automation
  - claude-code
  - agentic-coding
category: "编程"
timezone: "Asia/Shanghai"
---

在 2026 年的 Agentic Coding 趋势中，Ralph Wiggum Pattern 是一个绕不开的名字。它以《辛普森一家》角色命名，却解决了最实际的问题：如何让 Agent 在无人值守的情况下，持续工作直到真正完成。

## Table of contents

## 什么是 Ralph Wiggum Pattern

由 Geoffrey Huntley 在 2025 年中提出，核心思想极简：

> 将 AI 编码 Agent 置于自主循环中，直到预定义的完成标准被满足。

而非传统的“单次 Prompt → 单次响应”。流程如下：

```text
while (!isDone()) {
  prompt = feedProjectPromptWithUpdatedContext()
  response = agent.run(prompt)
  if (agent.triesToStop()) {
    if (checkCompletionCriteria()) break
    else interceptAndRefeed() // 拦截停止，重新注入上下文
  }
}
```

完成标准通常是**测试通过**或**检测到完成标签**（如 `RALPH_DONE`）。

## 为什么需要 Ralph

传统 Agent 需要人类不断 babysitting：每轮都要看输出、给下一指令。Ralph 通过编码“完成的定义”，移除了人类瓶颈：

- **批量任务**：一次性处理 50 个 backlog issue
- **夜间重构**：下班前启动，次日验收
- **质量内建**：未通过测试就不能停止，避免“看似完成”的幻觉

> [!NOTE]
> 团队用 Ralph 循环跑过夜重构与大规模迁移，关键在于“完成的定义”必须可被机器校验。

## 完成标准的三种形态

```ts
// 1. 测试门：最可靠
const isDone = () => runTests().every(t => t.passed)

// 2. 标签门：适合开放任务
const isDone = () => lastOutput.includes("<promise>RALPH_DONE</promise>")

// 3. 混合门：测试 + 人工检查点
const isDone = () => testsPassed && hasHumanApproval("critical-path")
```

> [!WARNING]
> Ralph 不适合创意或安全关键型工作——这些场景需要持续的人类判断，而非自动循环。

## 与 Harness 的关系

Ralph 本质上是 Harness 中的**循环**与**验证关卡**的组合：

- 循环：拦截停止、重喂 Prompt
- 验证：测试、类型检查、安全扫描

2026 年的编排工具（Conductor、Vibe Kanban、Gas Town）都内置了类似 Ralph 的持久循环，只是封装得更友好。

## 工程化要点

1. **隔离执行**：每个循环在独立的 Git worktree 中运行，避免污染主分支
2. **上下文刷新**：每轮重喂时只注入增量上下文，而非全量历史
3. **熔断机制**：设置最大迭代次数（如 20 次），防止无限循环烧 token
4. **可观测性**：记录每轮的输入、输出、测试结果，便于回溯

```bash
# 概念脚本
for i in {1..20}; do
  claude-code --prompt "continue from last state, check tests" \
    || echo "iteration $i failed, retry with updated context"
  if grep -q "RALPH_DONE" output.md; then break; fi
done
```

## 小结

Ralph Wiggum Pattern 的价值在于把“人的耐心”转化为“机器的循环”。它不提升单次生成质量，但通过**迭代与校验**，将批量、低-中复杂度的任务从“需要人盯”变为“可委托”。在 2026 年，它已是所有严肃 Agentic 工作流的默认组件之一。
