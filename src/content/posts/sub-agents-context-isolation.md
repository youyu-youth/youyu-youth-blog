---
title: "Sub-Agents：用隔离换取可靠性"
description: "Sub-Agent 不是组织架构模拟，而是上下文隔离的技术手段。本文解析其设计原则与落地模式。"
pubDatetime: 2026-06-16T10:00:00+08:00
modDatetime: 2026-06-16T10:00:00+08:00
author: youyu-youth
featured: false
draft: false
tags:
  - sub-agents
  - context-engineering
  - agent
  - architecture
category: "大语言模型"
timezone: "Asia/Shanghai"
---

2026 年，Sub-Agents 从“可选优化”变为“必备原语”。但多数团队仍误解其本质：把它当作人类角色的映射，而非上下文管理的技术手段。

## Table of contents

## Sub-Agent 的本质：隔离上下文窗口

AI Engineer 报告的观点很明确：

> 不要把 Sub-Agent 设计成“QA Agent”“前端 Agent”，而应视为**隔离与控制上下文窗口**的技术机制。

将探索性阅读推给子 Agent，主 Agent 保持在 40% 阈值以下，是最直接的收益。

```text
单 Agent（膨胀）:
  主上下文：读 20 文件 + 历史 + 工具定义 = 65% 窗口 → 性能下降

Sub-Agent（隔离）:
  主上下文：任务 + 摘要 = 25% 窗口
  子上下文 1：读 10 文件 → 返回 500 token 摘要
  子上下文 2：读 10 文件 → 返回 500 token 摘要
  结果：主上下文干净、可控、可预测
```

## 三大收益

1. **上下文管理**：主对话保持聚焦，子任务隔离计费
2. **专业化**：子 Agent 可定制 Prompt、工具与权限，如只读审查 Agent
3. **并行化**：多 Sub-Agent 并行执行，加速探索

> [!NOTE]
> Claude Code、Cursor、Antigravity 都已将 Sub-Agent 作为一等公民：通过 YAML、`/agents` 命令或自然语言即可派生。

## 权限隔离：安全收益

为 code review 子 Agent 限制为只读，可显著降低误操作风险：

```yaml
# 子 Agent 配置示例
name: code-reviewer
tools: [read, grep, search]  # 无 write/edit
prompt: "你是只读审查员，仅输出问题与建议，不修改文件"
```

## 落地模式

- **探索模式**：主 Agent 派 3 个子 Agent 并行读不同模块，聚合后决策
- **验证模式**：子 Agent 负责跑测试、做安全扫描，主 Agent 仅看结果
- **隔离模式**：不确定性的探索全部在子上下文完成，失败不污染主上下文

```ts
// 主 Agent 伪代码
const summaries = await Promise.all([
  spawnSubAgent({ task: "探索支付模块", files: ["src/pay/**"] }),
  spawnSubAgent({ task: "探索订单模块", files: ["src/order/**"] }),
  spawnSubAgent({ task: "探索库存模块", files: ["src/stock/**"] }),
])
const plan = await makePlan(summaries) // 主上下文仅见摘要
```

## 反模式

- **角色扮演**：给 Sub-Agent 起人类职位名，却用相同上下文与工具
- **过度拆分**：为拆而拆，协调成本超过隔离收益
- **无摘要**：子 Agent 返回全量原文，而非结构化摘要

## 小结

Sub-Agent 的价值不在“多”，而在“隔离”。2026 年的可靠 Agent 系统，都将 Sub-Agent 视为上下文治理的基础设施，而非组织结构的投影。
