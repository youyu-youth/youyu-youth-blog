---
title: "Spec-Driven Development：把规格当源码"
description: "Vibe Coding 之后，Spec-Driven 成为 2026 年最受严肃团队推崇的范式。本文对比两种路径，拆解规格驱动的落地步骤。"
pubDatetime: 2025-09-23T10:00:00+08:00
modDatetime: 2025-09-23T10:00:00+08:00
author: youyu-youth
featured: false
draft: false
tags:
  - spec-driven
  - software-engineering
  - vibe-coding
  - agentic-coding
category: "编程"
timezone: "Asia/Shanghai"
---

如果说 2025 年的关键词是 Vibe Coding——“先跑起来再说”，那么 2026 年的修正就是 Spec-Driven Development——“先定义清楚再生成”。

## Table of contents

## Vibe Coding 的边界

Vibe Coding 极大降低了从 0 到 1 的门槛：全栈应用构建器（Lovable、V0 等）让产品经理、设计师通过一句话生成可部署的产品。但在真实仓库、复杂业务中，Vibe 的问题逐渐暴露：

- 计划薄弱导致实现漂移
- Review 时噪音大于信号
- 整个 Agent 循环的可信度下降

2026 年的行业共识是：**如果计划很弱，构建就会漂移，Review 就会更累，整个循环就更难信任。**

## Spec-Driven：把规格视为制品

Spec-Driven 的核心主张是：**将书面规格视为制品，代码视为可再生输出**。

这与 Harness 六层技术中的最高层一致：最具颠覆性，但也最彻底。

典型流程：

```md
1. 需求澄清
   - 将模糊 prompt 转化为需求、验收标准、设计备注

2. 任务分解
   - 生成可执行的实现任务清单，含依赖与优先级

3. 计划 Review
   - 人工确认规格，类似传统需求评审

4. Agent 执行
   - 按规格生成代码，每步通过 Verification Gate

5. 规格回归
   - 代码变更后，回写规格，保持单向真源
```

> [!INFO]
> 这不是回到瀑布。规格是轻量的、由 Agent 辅助生成的，且与代码同仓、持续演进。

## 两种规格工具形态

2026 年出现了两类规格工具：

1. **独立的 Spec 工具**：如 Spec-Kit、BMAD，将规划作为独立实践，产出结构化文档。
2. **构建工具内置的 Plan 模式**：如 Claude Code 的 `plan`、Cursor 的 `ask` 模式，在动手前强制只读分析。

后者是更强的信号：规划已成为 Agent 循环的一部分，而非外挂。

## 与 Context Engineering 的协同

Spec-Driven 本身也是一种上下文治理：

- 规格文档成为主上下文的“索引”，替代直接读取大量源码
- 实现阶段 Agent 只需读取规格 + 相关模块，而非全仓
- 评审时对照规格，而非逐行猜意图

```ts
// 传统：Agent 直接读 15 个文件后开写
// 上下文：~30k token，含大量无关代码

// Spec-Driven：Agent 读 1 份规格 + 3 个关键文件
// 上下文：~5k token，信息密度更高
// 结果：更快、更准、更易 Review
```

## 何时用 Vibe，何时用 Spec

| 场景 | 推荐 | 原因 |
|---|---|---|
| 0-1 原型、营销页、内部工具 | Vibe Coding | 速度优先，抛弃成本低 |
| 核心业务、长期维护、团队协作 | Spec-Driven | 可维护性与可审查性优先 |
| 重构、迁移、大批量改动 | Spec + Ralph Loop | 需要可编码的完成标准 |

> [!TIP]
> 团队引入 Spec-Driven 的最小可行步骤：要求任何 Agent 任务在修改文件前，先输出 300 字以内的计划（含改动文件、风险、回滚方案），人工确认后再执行。

## 小结

Spec-Driven 不是对 AI 能力的否定，而是对“代码免费”时代的应对——当实现不再稀缺，**定义“做什么”与“做到什么算完成”** 才是稀缺能力。2026 年的赢家团队，都是先把规格写清楚，再让 Agent 去执行的团队。
