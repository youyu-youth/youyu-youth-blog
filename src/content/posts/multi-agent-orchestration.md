---
title: "多 Agent 编排：Conductor、Vibe Kanban 与 Gas Town"
description: "单 Agent 到多 Agent 协作是 2026 年的跃迁。本文对比三款主流编排工具的设计哲学与适用场景。"
pubDatetime: 2026-06-02T10:00:00+08:00
modDatetime: 2026-06-02T10:00:00+08:00
author: youyu-youth
featured: false
draft: false
tags:
  - multi-agent
  - orchestration
  - gas-town
  - agentic-coding
category: "大语言模型"
timezone: "Asia/Shanghai"
---

2026 年，单 Agent 已能处理数小时任务，多 Agent 协作则让“数天级”交付成为可能。编排（Orchestration）成为新的核心能力。

## Table of contents

## 从单 Agent 到 Agent 团队

Anthropic 2026 趋势报告预测：任务时长从分钟级扩展至天/周级，价值从“写代码”转向“架构设计、Agent 协调与质量评估”。

多 Agent 的三大能力：

- **任务分解**：将复杂需求拆为可并行的子任务
- **专业化**：不同 Agent 承载不同上下文与权限
- **协调协议**：版本控制、状态同步、冲突解决

## 三款编排工具

### Conductor（macOS）

- 为 Claude Code 与 Codex 设计
- 每个 Agent 在独立 Git worktree 中运行，互不干扰
- 中央看板查看进度、Review 与合并 PR

### Vibe Kanban（跨平台 CLI + Web）

- 支持 Claude Code、Codex、Amp、Cursor、Gemini 等
- 看板式任务管理，拖拽式 Review
- 同样基于 worktree 隔离，适合混合模型团队

### Gas Town（Steve Yegge）

- 高吞吐编排引擎，专为数十个 Claude Code 并行设计
- **Mayor** 分发任务，**Deacon** 监控健康
- 口号是“吞吐优于完美”，接受少量冗余以换高速

> [!TIP]
> 三者共同点：都用 Git worktree 隔离，这是 2026 年多 Agent 的标准实践。

## Beads 的启发

Beads 解决了 Agent 的“失忆”与协调问题，其任务系统直接启发了 Claude Code 在 2026 年将 Todos 升级为 Tasks：

- 支持依赖、跨会话持久化（`~/.claude/tasks`）
- 多 Sub-Agent 通过共享 `CLAUDE_CODE_TASK_LIST_ID` 协作

## 何时用多 Agent

| 场景 | 单 Agent | 多 Agent |
|---|---|---|
| 单文件 Bug 修复 | ✅ |  |
| 跨服务重构 |  | ✅ |
| 大规模迁移 |  | ✅（Gas Town） |
| 需快速验证的多方案探索 |  | ✅ |

> [!WARNING]
> 多 Agent 的协调成本不容忽视：任务分解、结果聚合、冲突解决都需要 Harness 支持，切勿为“炫技”而上多 Agent。

## 小结

2026 年的工程角色已从“写代码”转向“编排 Agent”。选择编排工具时，关注 worktree 隔离、任务依赖与可观测性，而非仅看支持的模型数量。
