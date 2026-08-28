---
title: "LLM 安全护栏：Prompt 注入与数据外泄防护"
description: "Prompt 注入、数据外泄与输出操纵是 2026 年真实攻击面。本文给出输入清洗、输出校验与审计的工程化方案。"
pubDatetime: 2026-06-30T10:00:00+08:00
modDatetime: 2026-06-30T10:00:00+08:00
author: youyu-youth
featured: false
draft: false
tags:
  - prompt-injection
  - security
  - guardrail
  - llm
category: "大语言模型"
timezone: "Asia/Shanghai"
---

2026 年，安全团队终于开始将 AI 视为**系统边界**，而非内部工具。Prompt 注入、数据外泄、输出操纵不再是论文中的概念，而是生产中的真实攻击向量。

## Table of contents

## 三大攻击面

1. **Prompt 注入**：攻击者通过用户输入覆盖系统指令
2. **数据外泄**：模型被诱导泄露上下文中的敏感信息
3. **输出操纵**：模型输出被用于触发下游不安全操作

> [!DANGER]
> 将 AI 层视为与其他系统边界同等重要的安全边界，是 2026 年的安全基线。

## 防护四件套

### 1. 输入清洗

```ts
function sanitizeInput(input: string) {
  // 移除/转义潜在的指令覆盖
  return input
    .replace(/\[SYSTEM\]/gi, "")
    .replace(/ignore previous instructions/gi, "[filtered]")
    .slice(0, 8000) // 长度限制
}
```

### 2. 上下文权限控制

- Agent 能看见的上下文应受访问控制约束
- 敏感数据（密钥、PII）不应进入 Prompt，或需脱敏

### 3. 输出校验

```ts
function validateOutput(output: string) {
  if (containsSecrets(output)) throw new Error("输出含敏感信息")
  if (isOffPolicy(output)) return fallbackResponse()
  return output
}
```

### 4. 审计日志

- 记录所有模型交互：输入、构造的 Prompt、输出、后处理
- 用于事后追溯与合规审计

## 架构建议

```text
User Input -> 清洗 -> 权限过滤的上下文 -> LLM -> 输出校验 -> 审计 -> 返回
                                      ↘ 异常时触发护栏与告警
```

将护栏做在 Harness 层，而非依赖模型的“自觉”。模型的“对齐”会随版本变化，工程化的护栏才是稳定防线。

## 与代码安全的协同

此处的防护与“AI 生成代码安全”（45% 漏洞率）形成互补：

- 前者防**运行时**的恶意输入与泄露
- 后者防**构建时**的漏洞引入

二者需同时纳入 CI/CD 与运行时监控。

## 小结

2026 年的 LLM 安全不是“加个过滤器”，而是系统化工程：输入、上下文、输出、审计四层缺一不可。将 AI 层按外部边界治理，才能在享受能力的同时守住底线。
