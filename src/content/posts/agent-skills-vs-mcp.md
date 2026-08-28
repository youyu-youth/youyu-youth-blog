---
title: "Agent Skills 与 MCP：能力与连接的分工"
description: "MCP 负责连接，Skills 负责知识。二者常被混淆，实则解决不同问题。本文厘清分工、成本与实战选型。"
pubDatetime: 2025-11-04T10:00:00+08:00
modDatetime: 2025-11-04T10:00:00+08:00
author: youyu-youth
featured: false
draft: false
tags:
  - agent-skills
  - mcp
  - harness
  - ai-programming
category: "编程"
timezone: "Asia/Shanghai"
---

2026 年，几乎每个团队都在同时讨论 MCP 与 Agent Skills，但能清晰区分二者的人并不多。混淆的代价是：上下文浪费、工具过载、Agent 行为不可预测。

## Table of contents

## 一句话区分

- **MCP**：让 Agent 能**触及**外部系统（数据库、API、文件系统之外的世界）
- **Agent Skills**：让 Agent 知道**如何**正确地完成某类工作（流程、规范、脚本）

论文《Harnessing Agent Skills: Architectural Patterns and a Reference Architecture for Skill-Mediated LLM Agents》（2026-05）给出了形式化定义：Skill 是**可加载的知识包**，而非连接。

## Agent Skills 的结构

Vercel 开放规范定义的 Skill 是一个文件夹：

```
my-skill/
├── SKILL.md          # 自然语言指令，描述何时、如何使用该技能
├── scripts/          # 可选，辅助脚本
└── references/       # 可选，参考文档
```

安装方式统一：

```bash
npx add-skill vercel-labs/agent-skills --agent claude-code
# 支持 opencode、codex、cursor 等
```

> [!TIP]
> Skill 是“按需加载”的——只有当任务匹配时，才会被注入上下文，成本远低于常驻 MCP 工具。

## MCP 的成本：常驻上下文税

MCP 的每个工具定义都会在**每一轮请求**中被读取。Capital & Compute 的分析指出，超过约 40 个工具后，部分客户端会直接停止向模型提供工具定义。

这意味着：

- 安装 50 个 MCP Server ≠ 更强，而是更慢、更贵、更容易触发截断
- 低频工具常驻是浪费，高频工具才值得常驻

## 实战选型矩阵

| 需求 | 选 MCP | 选 Skill | 示例 |
|---|---|---|---|
| 读取生产数据库 | ✅ |  | `postgres-mcp` |
| 代码 Review 规范 |  | ✅ | `code-review-skill` |
| 调用支付网关 | ✅ |  | `stripe-mcp` |
| 发布流程 Checklist |  | ✅ | `release-skill` |
| 搜索企业知识库 | ✅ | ✅ | MCP 提供检索，Skill 提供“如何写好检索查询” |

最佳实践是**组合**：MCP 提供触达能力，Skill 提供使用方法。

```md
# SKILL.md 示例（节选）
---
name: api-review
description: 适用于所有 API 变更的 Review 规范
---

当检测到 `src/api/` 下有改动时：
1. 检查是否更新了 OpenAPI 规范
2. 运行 `scripts/check-breaking-change.sh`
3. 要求至少一个集成测试覆盖
```

## 反模式

- **把所有文档都做成 MCP**：应做成 Skill，按需加载
- **把流程知识硬编码进 Prompt**：应打包为 Skill，可版本化、可复用
- **无差别安装 MCP**：应审计使用频率，超过 40 工具时做减法

## 小结

2026 年的 Harness 设计原则是：**用 MCP 扩展边界，用 Skills 沉淀知识**。前者按“连接”计费，后者按“知识”复用。理解这一分工，才能在上下文预算有限的前提下，让 Agent 既“够得着”又“做得对”。
