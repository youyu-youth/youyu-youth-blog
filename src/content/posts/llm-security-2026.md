---
title: "AI 生成代码安全：45% 样本含 OWASP 漏洞"
description: "Veracode 2026 研究显示，无安全指导时 45% 的 AI 生成代码含 OWASP Top 10 漏洞。本文解读数据、差异与治理对策。"
pubDatetime: 2026-03-31T10:00:00+08:00
modDatetime: 2026-03-31T10:00:00+08:00
author: youyu-youth
featured: false
draft: false
tags:
  - ai-security
  - owasp
  - code-review
  - secure-coding
category: "人工智能"
timezone: "Asia/Shanghai"
---

AI 写代码很快，但安全的账单往往在事后才到。Veracode 2026 年 3 月发布的 GenAI 代码安全研究，给出了迄今最全面的数据。

## Table of contents

## 45%：无指导时的漏洞率

研究在 Java、JavaScript、C#、Python 上执行 80 个编码任务，未给予显式安全指导时，**约 45% 的生成样本引入了 OWASP Top 10 漏洞**。

更关键的是分布不均：

| 漏洞类型 | 安全处理率 |
|---|---|
| SQL 注入 | 82% 安全 |
| 不安全加密 | 86% 安全 |
| XSS | 仅 15% 安全 |
| 日志注入 | 仅 13% 安全 |

> [!WARNING]
> 模型在“常见、模式化”的漏洞上表现好，在“上下文相关、需理解业务”的漏洞上表现极差。

语言差异同样显著：Java 仅 29% 安全通过，Python 62%。这与训练数据与框架防护有关，而非模型“更懂”某语言。

## 模型越大越安全？否

令人担忧的发现是：**更新、更大的模型几乎没有安全提升**，唯一例外是 OpenAI 的推理模型（70-72% 安全率）。而 2025 年的另一项研究《Security Degradation in Iterative AI Code Generation》发现，**对生成代码反复迭代会让安全性进一步恶化**。

这意味着“等模型变强就安全了”是错误假设。

## 治理对策

2026 年的实践已从“依赖模型”转向“依赖体系”：

1. **显式安全指导**：在 Prompt/Skill 中明确要求“遵循 OWASP，使用参数化查询，转义输出”
2. **验证门**：将 SAST、依赖扫描、秘密扫描作为 Harness 的 Verification Gate，AI 代码必须通过才能提交
3. **AI Review**：用 AI 做第一轮安全 Review，但需人工复核高危路径
4. **迭代熔断**：限制对同一块 AI 生成代码的无约束迭代，超过阈值强制人工介入

```ts
// Skill 示例：安全生成约束
// SKILL.md
// 生成数据库查询时：
// - 必须使用参数化查询，禁止字符串拼接
// - 输出到 HTML 时必须转义
// - 记录失败时不得记录敏感信息
```

## 成本视角

Uber 与 Walmart 已开始对**每位开发者的 AI 支出设限**，而非整体议价。原因在于：Token 成本之外，Review 与返工的隐形成本更高。安全漏洞的修复成本随阶段指数上升，在生成时拦截比在生产中修复便宜数十倍。

## 小结

45% 不是危言耸听，而是无护栏时的基准线。2026 年的安全策略是：不信任模型的“自觉”，信任体系的“强制”。将安全约束编码为 Skill、将扫描编码为 Gate，才能让 AI 的速度与安全的底线并存。
