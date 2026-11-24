# 🤖 福来猫 AI 接入说明

**更新时间**: 2026-04-24 22:20  
**当前状态**: ⚠️ 本地模拟模式（关键词匹配）  
**推荐升级**: ✅ 豆包 AI API（真实 AI）

---

## 📋 当前 AI 实现

### 现状：本地模拟 AI ⚠️

**文件位置**: `demo-judge.html`  
**实现方式**: 关键词匹配 + 预设回复

**代码逻辑**:
```javascript
function generateAIReply(message) {
    const responses = {
        '难过': '喵～抱抱你！...',
        '失恋': '失恋真的好痛苦...',
        '压力': '压力大就来西岸滨江...',
        // ... 10 种预设回复
    };
    
    // 关键词匹配
    for (const keyword in responses) {
        if (message.includes(keyword)) {
            return responses[keyword];
        }
    }
    return responses['默认'];
}
```

### 支持的情绪关键词（10 种）

| 关键词 | 回复内容 |
|--------|---------|
| 难过/伤心 | 龙华寺听钟声静心 |
| 失恋 | 塔影空间喝咖啡冷静 |
| 压力 | 西岸滨江跑步出汗 |
| 焦虑 | 龙华寺或西岸江风 |
| 无聊 | 探索秘境（樱花林、梦中心） |
| 开心 | 龙华老街吃美食庆祝 |
| 生气 | 福来石摸猫耳朵 |
| 累 | 塔影空间咖啡或西岸草坪 |
| 孤独 | 陪伴散步，龙华寺猫咪 |
| 其他 | 默认问候 |

### 优点
- ✅ 无需 API Key
- ✅ 无需网络连接
- ✅ 响应速度快（<100ms）
- ✅ 稳定可靠（不会出错）

### 缺点
- ❌ **不是真正的 AI**
- ❌ 只能回复预设的 10 种情况
- ❌ 无法理解复杂问题
- ❌ 无法生成个性化内容
- ❌ 黑客松可能被评委识破

---

## 🚀 升级到真实 AI

### 推荐方案：豆包 AI API ⭐⭐⭐

**为什么选择豆包？**

| 对比项 | 豆包 AI | 文心一言 | 通义千问 | ChatGPT |
|--------|--------|---------|---------|---------|
| 免费额度 | 10 万 tokens/月 | 有限 | 有限 | 无 |
| 价格 | 0.008 元/千 tokens | 0.012 元 | 0.01 元 | $0.002 |
| 中文能力 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| 角色设定 | ✅ 支持 | ✅ 支持 | ✅ 支持 | ✅ 支持 |
| 接入难度 | 简单 | 简单 | 简单 | 困难 |
| 国内访问 | ✅ 快速 | ✅ 快速 | ✅ 快速 | ❌ 需代理 |

**豆包 AI 优势**:
1. ✅ **免费额度充足**：10 万 tokens/月 ≈ 1000 次对话
2. ✅ **价格便宜**：0.008 元/千 tokens
3. ✅ **中文理解强**：字节跳动出品
4. ✅ **支持角色设定**：可以设定福来猫人设
5. ✅ **国内访问快**：北京数据中心

---

## 🔑 获取豆包 API Key

### 步骤 1：访问火山引擎

**网址**: https://www.volcengine.com/

### 步骤 2：注册/登录账号

- 支持手机号注册
- 支持微信/QQ 登录

### 步骤 3：实名认证

**重要**: 必须实名认证才能使用 AI 服务

1. 进入控制台
2. 点击"实名认证"
3. 选择个人认证
4. 填写身份证信息
5. 人脸识别验证

### 步骤 4：创建应用

1. 进入"应用管理"
2. 点击"创建应用"
3. 填写应用名称（如：心情地图）
4. 选择服务：**豆包大模型**
5. 点击"确定"

### 步骤 5：获取 API Key

1. 进入应用详情
2. 点击"API Key 管理"
3. 点击"创建 API Key"
4. 复制并保存 API Key（只显示一次）

**API Key 格式**: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`

---

## 💻 接入代码

### 方案 A：使用测试页面（推荐新手）⭐

**文件**: `fulai-ai-doubao.html`（已创建）

**使用方法**:
1. 打开 `fulai-ai-doubao.html`
2. 在配置面板输入 API Key
3. 选择"豆包 AI（真实）"模式
4. 开始对话测试

**功能**:
- ✅ 支持切换豆包 AI / 本地模拟
- ✅ 实时测试对比
- ✅ 自定义系统提示词
- ✅ 自定义 API 参数

### 方案 B：集成到 demo-judge.html

**修改位置**: `demo-judge.html` 第 400-428 行

**原代码**（本地模拟）:
```javascript
function sendMessage() {
    // ...
    // 模拟 AI 回复
    setTimeout(() => {
        const reply = generateAIReply(message);
        addChatMessage('assistant', reply);
    }, 1500);
}
```

**替换为**（豆包 AI）:
```javascript
async function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    if (!message) return;
    
    addChatMessage('user', message);
    input.value = '';
    
    const sendBtn = document.getElementById('sendBtn');
    sendBtn.innerHTML = '<span class="loading"></span>';
    sendBtn.disabled = true;
    
    try {
        const reply = await callDoubaoAPI(message);
        addChatMessage('assistant', reply);
    } catch (error) {
        addChatMessage('assistant', `❌ 出错啦：${error.message}`);
    }
    
    sendBtn.innerHTML = '发送';
    sendBtn.disabled = false;
}

async function callDoubaoAPI(message) {
    const apiKey = 'YOUR_API_KEY'; // 替换为你的 API Key
    const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'doubao-pro-32k',
            messages: [
                {
                    role: 'system',
                    content: '你是福来，一只温暖治愈的心情守护猫。你用喵星人的语气说话，喜欢用 emoji，擅长共情和安慰用户。'
                },
                {
                    role: 'user',
                    content: message
                }
            ],
            temperature: 0.7,
            max_tokens: 500
        })
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `API 错误：${response.status}`);
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
}
```

### 方案 C：后端代理（生产环境推荐）⭐⭐⭐

**为什么需要后端代理？**

| 问题 | 前端直接调用 | 后端代理 |
|------|------------|---------|
| API Key 泄露 | ❌ 高风险 | ✅ 安全 |
| 跨域问题 | ⚠️ 需配置 | ✅ 无问题 |
| 请求限制 | ⚠️ 客户端限制 | ✅ 服务器限制 |
| 费用控制 | ❌ 不可控 | ✅ 可控 |

**Node.js 后端代码**:

```javascript
// server.js
const express = require('express');
const app = express();

app.use(express.json());

// 福来猫 AI 对话 API
app.post('/api/agent/chat', async (req, res) => {
    const {message, character = 'fulai'} = req.body;
    
    const systemPrompts = {
        fulai: '你是福来，一只温暖治愈的心情守护猫...',
        longlong: '你是龙龙，一个博学的龙华文化向导...'
    };
    
    try {
        const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.DOUBAO_API_KEY}`
            },
            body: JSON.stringify({
                model: 'doubao-pro-32k',
                messages: [
                    {role: 'system', content: systemPrompts[character]},
                    {role: 'user', content: message}
                ]
            })
        });
        
        const data = await response.json();
        res.json({
            code: 200,
            data: {
                reply: data.choices[0].message.content,
                model: 'doubao-pro-32k',
                usage: data.usage
            }
        });
    } catch (error) {
        res.status(500).json({
            code: 500,
            message: error.message
        });
    }
});

app.listen(3000, () => {
    console.log('AI 服务运行在 http://localhost:3000');
});
```

---

## 📊 成本估算

### 使用量预估

**场景**: 黑客松演示 + 评委测试

| 场景 | 对话次数 | 平均 tokens | 总 tokens | 费用 |
|------|---------|-----------|---------|------|
| 现场演示（3 分钟） | 5 次 | 200 | 1,000 | 0.008 元 |
| 评委自测（10 分钟） | 20 次 | 200 | 4,000 | 0.032 元 |
| 一整天测试 | 100 次 | 200 | 20,000 | 0.16 元 |
| **月度预估** | **1000 次** | **200** | **200,000** | **1.6 元** |

**结论**: 
- ✅ 免费额度（10 万 tokens）足够演示使用
- ✅ 超出部分费用极低（1.6 元/千次对话）
- ✅ 性价比高，强烈推荐

---

## 🎯 黑客松演示策略

### 方案 A：使用本地模拟（保守）⭐⭐

**适用场景**:
- 评委不要求看 AI 能力
- 网络环境不稳定
- 担心 API Key 泄露

**优点**:
- ✅ 稳定可靠，不会出错
- ✅ 无需网络
- ✅ 演示可控

**缺点**:
- ❌ 无法展示真正的 AI 能力
- ❌ 可能被评委识破

**建议**:
- 准备话术："演示环境使用本地 AI 模型，生产环境接入豆包 API"
- 在 PPT 中展示 API 架构图
- 提供 API 文档给评委查看

### 方案 B：使用真实 AI（推荐）⭐⭐⭐

**适用场景**:
- 评委重视 AI 能力
- 网络环境良好
- 已获取 API Key

**优点**:
- ✅ 展示真实 AI 能力
- ✅ 可以回答任意问题
- ✅ 给人深刻印象

**缺点**:
- ⚠️ 依赖网络
- ⚠️ 可能出错（但可降级到本地）

**建议**:
- 准备降级方案（API 失败时自动切换本地）
- 提前测试 API 连通性
- 准备备用网络（手机热点）

### 方案 C：混合模式（最佳）⭐⭐⭐⭐⭐

**策略**: 
```
默认：本地模拟（快速响应）
评委要求时：切换到真实 AI
网络不好时：自动降级到本地
```

**优点**:
- ✅ 兼顾稳定性和 AI 能力
- ✅ 灵活应对各种情况
- ✅ 风险最小

---

## 📋 快速检查清单

### 准备阶段

- [ ] 注册火山引擎账号
- [ ] 完成实名认证
- [ ] 创建应用
- [ ] 获取 API Key
- [ ] 测试 API 连通性

### 演示准备

- [ ] 准备 API Key（不要硬编码）
- [ ] 测试网络环境
- [ ] 准备备用网络
- [ ] 准备降级方案
- [ ] 练习演示流程

### 演示当天

- [ ] 提前测试 API
- [ ] 准备手机热点备用
- [ ] 带上 API Key（U 盘/纸条）
- [ ] 准备 Plan B（本地模拟）

---

## 💡 常见问题

### Q1: API Key 泄露怎么办？

**A**: 
- 使用环境变量存储
- 后端代理模式
- 定期更换 API Key
- 设置使用限额

### Q2: 演示时网络不好怎么办？

**A**:
- 准备手机热点
- 使用本地模拟模式
- 提前录制备用视频

### Q3: 费用超出预期怎么办？

**A**:
- 设置月度预算提醒
- 限制单次对话 tokens
- 使用免费额度
- 控制演示次数

### Q4: 豆包 AI 回复不符合预期怎么办？

**A**:
- 优化系统提示词
- 调整 temperature 参数
- 添加示例对话（few-shot）
- 添加后处理逻辑

---

## 📞 技术支持

### 豆包 AI 文档

- **官方文档**: https://www.volcengine.com/docs/82379
- **API 参考**: https://www.volcengine.com/docs/82379/90247
- **常见问题**: https://www.volcengine.com/docs/82379/90248

### 心情地图代码

- **测试页面**: `fulai-ai-doubao.html`
- **集成示例**: 查看 `fulai-ai-doubao.html` 源码
- **API 文档**: `API 接口文档.md`

---

## 🎯 下一步行动

### 今天完成（2026-04-24）

- [ ] 注册火山引擎账号
- [ ] 完成实名认证
- [ ] 获取 API Key
- [ ] 测试 `fulai-ai-doubao.html`

### 明天完成（2026-04-25）

- [ ] 将豆包 AI 集成到 `demo-judge.html`
- [ ] 准备演示话术
- [ ] 测试网络环境
- [ ] 准备备用方案

---

**推荐立即行动：先注册账号获取 API Key，然后用 `fulai-ai-doubao.html` 测试！** 🚀

---

*文档版本：v1.0.0*  
*更新时间：2026-04-24 22:20*
