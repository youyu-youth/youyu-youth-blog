---
title: "MCP 协议 2026-07-28 新规范解读"
description: "MCP 迎来发布以来最大修订：无状态化、授权加固与扩展框架。本文逐条解读核心变更与迁移影响。"
pubDatetime: 2025-10-14T10:00:00+08:00
modDatetime: 2025-10-14T10:00:00+08:00
author: youyu-youth
featured: false
draft: false
tags:
  - mcp
  - protocol
  - tool-use
  - agent
category: "编程"
timezone: "Asia/Shanghai"
---

Model Context Protocol（MCP）在 2026-07-28 发布了自问世以来最大的修订。方向很明确：从“证明需要一个通用集成标准”转向“让它在生产环境中存活”。

## Table of contents

## 三大核心变更

### 1. 无状态化：移除握手与会话头

旧版 MCP 在 Streamable HTTP 传输中要求 `initialize` 握手与 `session` 头，新版将其移除：

- 协议版本与客户端能力改为**每请求元数据**携带
- `list` 端点改为可缓存，而非每连接私有

这对部署的影响是直接的：负载均衡与边缘缓存终于可以对 MCP 请求生效，横向扩展成本大幅下降。

```http
# 旧版：有状态
POST /mcp HTTP/1.1
MCP-Session-Id: abc-123
MCP-Protocol-Version: 2024-11-05

# 新版：无状态，每请求自包含
POST /mcp HTTP/1.1
MCP-Protocol-Version: 2026-07-28
MCP-Client-Capabilities: tools,listChanged
```

### 2. 授权加固：关闭混淆攻击面

新规范要求客户端按 RFC 9207 校验 `issuer` 参数，关闭了授权服务器混淆（Authorization Server Mix-up）漏洞。

> [!WARNING]
> 若你的 MCP Client 未升级校验逻辑，在多租户环境中可能被诱导将 token 发送至错误的授权服务器。

### 3. 扩展框架：为 UI 与长任务铺路

新增正式的扩展框架，首批覆盖：

- **Server-rendered UI**：服务端渲染的交互组件
- **Long-running Tasks**：长时任务的状态跟踪与恢复

这让 MCP 从“工具调用协议”向“智能体交互协议”演进。

## 与 Agent Skills 的分工

2026 年最易混淆的一对概念是 MCP 与 Agent Skills：

- **MCP 是连接协议**：改变 Agent 能触及什么（ Reach ）
- **Agent Skills 是知识格式**：一个包含 `SKILL.md` 与脚本的文件夹，教会 Agent 如何做某类工作

2026 年 5 月的论文《Harnessing Agent Skills》将后者形式化。Vercel 的开放规范定义了 Skill 的目录结构，可通过 `npx add-skill` 安装到 Claude Code、Cursor、Opencode 等。

| 维度 | MCP | Agent Skills |
|---|---|---|
| 解决问题 | 能否连接到外部系统 | 是否知道如何正确使用 |
| 计费 | 每轮常驻上下文 | 按需加载 |
| 示例 | 数据库、支付网关 | Code Review 规范、发布流程 |

## 迁移建议

1. **升级传输层**：移除对 `initialize` 会话的假设，改为每请求携带版本与能力。
2. **检查授权**：确保客户端校验 `issuer`，服务端返回正确的 `issuer` 元数据。
3. **审计工具数量**：结合 Context Engineering，原来常驻的 30+ 工具可考虑拆为 Skills 按需加载。

## 小结

MCP 2026-07-28 的修订让协议更接近生产级：无状态化解决了扩展性，授权加固解决了安全性，扩展框架为下一代交互打开了空间。理解 MCP 与 Skills 的分工，是设计 2026 年 Agent Harness 的基础。
