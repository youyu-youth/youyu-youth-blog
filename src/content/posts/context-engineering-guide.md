---
title: "Context Engineering：把上下文当接口来设计"
description: "模型失效往往不是能力问题，而是上下文问题。本文系统解析 40% 窗口阈值、RPI 模式与 Sub-Agent 隔离的实战要领。"
pubDatetime: 2025-09-02T10:00:00+08:00
modDatetime: 2025-09-02T10:00:00+08:00
author: youyu-youth
featured: false
draft: false
tags:
  - context-engineering
  - llm
  - prompt-optimization
  - agent
category: "编程"
timezone: "Asia/Shanghai"
---

当 Agent 在复杂老项目中失败，开发者的第一反应往往是“往上下文里塞更多文件、更多文档、更多规则”。但 2026 年的生产数据显示，这恰恰是错误的方向。

## Table of contents

## 40% 阈值：上下文的性能悬崖

来自生产 Agent 运行的统计：当上下文使用超过窗口的约 40% 时，模型的推理与工具调用性能会显著下降。原因是注意力稀释——模型在海量样板代码与日志中难以定位关键指令。

这意味着 Context Engineering 的核心不是“如何塞更多”，而是“如何少塞、塞对”。

> [!NOTE]
> 稀缺资源不是指令质量，而是窗口空间。每多一个工具定义、每多一次文件读取，都会在后续的每一轮请求中持续计费。

## 反直觉：不要把 Agent 组织成人类的样子

早期团队喜欢把 Sub-Agent 设计成“QA Agent”“前端 Agent”“后端 Agent”，模仿人类组织架构。AI Engineer 2026 报告明确指出这是错误抽象。

Sub-Agent 的真正价值是**隔离与控制上下文窗口**，而非角色扮演。将探索性阅读推给子 Agent，让主 Agent 保持干净，是成本最低的优化之一。

```ts
// 主 Agent：保持 30% 上下文，专注决策
// - 接收任务：修复支付模块的并发问题
// - 派生子 Agent 去读 10 个文件、总结关键路径
// - 子 Agent 返回 300 token 的摘要，而非 20k token 的原文

// 成本对比
// 直接读 10 文件：~25k token 常驻主上下文
// 子 Agent 摘要：~0.3k token 进入主上下文
// 节省 98% 的常驻上下文
```

## RPI 模式：研究-计划-实现

为系统性地将上下文控制在 40% 以下，2026 年最流行的结构化工作流是 **Research-Plan-Implement (RPI)**：

1. **Research**：只读阶段，子 Agent 并行探索代码库，产出结构化摘要
2. **Plan**：基于摘要生成实现计划，人工 Review
3. **Implement**：按计划执行，每步通过 Verification Gate

这种“离散、无状态”的步骤切分，避免了单 Agent 同时读、想、写的上下文膨胀。

## MCP 工具数量的隐形税

每个 MCP Server 的工具定义都会在每一轮请求中被读取。超过约 40 个工具后，部分客户端甚至会停止向模型提供工具定义。

这意味着“安装越多 MCP 越好”是错觉。2026 年的实践是：只安装真正高频的 MCP，低频能力通过 Agent Skills 按需加载。

| 策略 | 上下文成本 | 适用场景 |
|---|---|---|
| 常驻 MCP | 每轮计费 | 高频、关键工具 |
| Agent Skills | 按需加载 | 流程知识、领域规范 |
| Sub-Agent | 隔离计费 | 探索性、一次性任务 |

> [!TIP]
> 评估你的 Harness：统计主上下文的平均 token 数与工具数量，若常驻超过 35%，优先做减法而非加法。

## 小结

Context Engineering 在 2026 年已成为一门独立学科。它要求我们把上下文视为版本化、受控的接口，而非随意堆砌的文本。RPI 与 Sub-Agent 是目前性价比最高的两项实践，值得在任何 Agent 工作流中优先落地。
