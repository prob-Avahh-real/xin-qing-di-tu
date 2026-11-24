# 心情地图 (MoodMap · 实验原型)

LYCC 2026 龙华黑客松青年情感化出行指南 Web/PWA 实验项目（Vue 3 + TypeScript + Vite + 高德地图）。

## 用途与 Target 判定

| 平台 | 需要? | 方式 |
|------|-------|------|
| 移动端 | 可选 | 移动浏览器 / PWA 添加主屏幕体验（黑客松实验版，原生壳可选） |
| 智能硬件 | 不适用 | 情绪路线推荐与景区打卡 Web 应用，无穿戴传感器需求 |

## 命令

```bash
npm install
npm run dev
npm run type-check
npm run build
```

## Harness / Loop（助手）

- 遵循根 `/Users/skat/AGENTS.md`：**Harness Engineering** + **Loop Engineering**
- Guide = 本文件；Sensor = `tests/` 校验与 `npm run build`
- 同类失误第二次 → 沉淀规则或测试（棘轮）

## 验证环 / Done

```bash
npm run type-check
npm run build
```

**Done 示例**：类型检查与 Vite 构建通过，导航中心与核心情绪路线页可正常访问。
