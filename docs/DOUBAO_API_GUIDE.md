y# 🤖 豆包 API 配置指南

**版本**: 1.0  
**日期**: 2026-04-24  
**状态**: 需要 API Key

---

## ⚠️ 重要提醒

### 需要用户批准

根据安全规定：
> ❌ **不允许注册任何平台** - 不以用户名义注册任何网站/API/服务

**豆包 API 需要**:
1. 注册豆包账号
2. 实名认证
3. 申请 API Key
4. 可能产生费用（按量付费）

**请确认是否批准注册和配置豆包 API！**
是
---

## 📋 豆包 API 优势

### 对比 Ollama 本地

| 特性 | Ollama | 豆包 API |
|------|--------|---------|
| **安装** | ❌ 需安装软件 | ✅ 无需安装 |
| **模型下载** | ❌ 4-10GB | ✅ 无需 |
| **内存占用** | ❌ 高（2-4GB） | ✅ 低（<100MB） |
| **手机可用** | ❌ 不可用 | ✅ 完美支持 |
| **AI 能力** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **成本** | ✅ 免费 | ⚠️ 按量付费 |
| **网络** | ✅ 可离线 | ❌ 需联网 |
| **部署** | ❌ 复杂 | ✅ 简单 |

### 适合场景

✅ **推荐用豆包 API 的场景**:
- 手机端应用
- 黑客松演示
- 商业化部署
- 多用户并发
- 需要强大 AI

❌ **不推荐用豆包 API 的场景**:
- 离线环境
- 隐私敏感数据
- 预算极有限
- 网络不稳定

---

## 🚀 注册流程

### 步骤 1: 注册账号

**访问**: https://www.volcengine.com/products/doubao

```
1. 点击"免费注册"
2. 选择注册方式:
   - 手机号注册（推荐）
   - 邮箱注册
3. 填写信息
4. 验证手机/邮箱
5. 设置密码
```

**时间**: 3 分钟

---

### 步骤 2: 实名认证

**必须完成，否则无法使用 API**

```
1. 登录控制台
2. 点击右上角账号 → 实名认证
3. 选择认证类型:
   - 个人认证（推荐）
   - 企业认证
4. 填写信息:
   - 姓名
   - 身份证号
   - 手机号
5. 人脸识别验证
6. 等待审核（通常立即通过）
```

**时间**: 5 分钟

---

### 步骤 3: 创建应用

```
1. 进入控制台：https://console.volcengine.com/ark
2. 左侧菜单：应用管理 → 创建应用
3. 填写信息:
   - 应用名称：龙华·灵境向导
   - 应用描述：情绪出行规划师
   - 选择模型：Doubao Pro
4. 点击"创建"
```

**时间**: 2 分钟

---

### 步骤 4: 获取 API Key

```
1. 进入刚创建的应用
2. 点击"密钥管理"
3. 点击"创建新密钥"
4. 复制 API Key（只显示一次！）
5. 保存密钥到安全位置
```

**重要**:
- ⚠️ API Key 只显示一次
- ⚠️ 丢失需重新创建
- ⚠️ 不要泄露给他人

**时间**: 1 分钟

---

### 步骤 5: 充值（可选）

**有免费额度，可暂不充值**

```
免费额度:
- AI 对话：10 万 tokens/月
- 语音识别：1000 分钟（首月）
- 语音合成：50 万字符（首月）

黑客松演示足够用！
```

如需充值:
```
1. 控制台 → 费用中心
2. 点击"充值"
3. 选择金额（建议先充 10 元测试）
4. 选择支付方式
5. 完成支付
```

**时间**: 3 分钟

---

## 🔧 项目配置

### 配置环境变量

**在项目根目录创建 `.env` 文件**:

```env
# 豆包 API 配置
VITE_DOUBAO_API_KEY=你的 API_KEY__here
VITE_DOUBAO_APP_ID=你的 APP_ID_here

# 可选：自定义 API 端点
VITE_DOUBAO_BASE_URL=https://ark.cn-beijing.volces.com/api/v3
```

**示例**:
```env
VITE_DOUBAO_API_KEY=ark_1234567890abcdef
VITE_DOUBAO_APP_ID=app_1234567890
```

---

### 安装依赖（如需要）

```powershell
# 项目已内置 fetch，无需额外安装
# 但建议安装 axios 作为备用
npm install axios
```

---

### 使用示例

**在 Vue 组件中使用**:

```vue
<script setup>
import { generateRouteRecommendation } from '@/utils/doubao-api'

const emotion = ref('relax')
const customInput = ref('')
const route = ref(null)

async function generateRoute() {
  try {
    route.value = await generateRouteRecommendation(
      emotion.value,
      customInput.value
    )
  } catch (error) {
    console.error('路线生成失败:', error)
    alert('AI 生成失败，请稍后重试')
  }
}
</script>
```

---

## 📊 成本核算

### 定价详情

| 服务 | 定价 | 说明 |
|------|------|------|
| **AI 对话** | 0.008 元/千 tokens | 输入 + 输出 |
| **语音识别** | 0.002 元/分钟 | 实时转文字 |
| **语音合成** | 0.005 元/千字符 | 文字转语音 |

### 使用量估算

**单次对话**:
```
用户输入：50 tokens
AI 回复：200 tokens
总计：250 tokens
成本：250 × 0.008 / 1000 = 0.002 元
```

**生成一条路线**:
```
Prompt: 300 tokens
AI 回复：500 tokens
总计：800 tokens
成本：800 × 0.008 / 1000 = 0.0064 元
```

**TTS 语音**:
```
200 字语音
成本：200 × 0.005 / 1000 = 0.001 元
```

### 场景成本

**黑客松演示（5 分钟）**:
```
10 次对话：0.02 元
5 次路线生成：0.032 元
3 次 TTS: 0.003 元
总计：约 0.06 元
```

**1000 个用户/天**:
```
每人 5 次对话：5000 次 × 0.002 元 = 10 元
每人 2 次路线生成：2000 次 × 0.0064 元 = 12.8 元
每人 3 次 TTS: 3000 次 × 0.001 元 = 3 元
总计：约 26 元/天
```

**月收入（30 天）**:
```
26 × 30 = 780 元/月
```

### 免费额度计算

**每月免费**:
```
AI 对话：10 万 tokens
= 100000 × 0.008 / 1000 = 0.8 元价值
= 约 400 次完整对话
```

**黑客松期间完全够用！**

---

## 🔍 测试 API

### 测试脚本

**创建 `test-doubao.js`**:

```javascript
import { chatWithAI, checkAPIHealth } from './src/utils/doubao-api.js'

async function test() {
  console.log('🧪 测试豆包 API...')
  
  // 测试健康检查
  const health = await checkAPIHealth()
  console.log('API 状态:', health ? '✅ 正常' : '❌ 异常')
  
  // 测试对话
  const response = await chatWithAI('你好，介绍一下龙华寺')
  console.log('AI 回复:', response)
  
  console.log('✅ 测试完成')
}

test().catch(console.error)
```

**运行测试**:

```powershell
node test-doubao.js
```

---

### 预期输出

```
🧪 测试豆包 API...
API 状态：✅ 正常
AI 回复: 龙华寺位于上海市徐汇区...
✅ 测试完成
```

---

## 🐛 常见问题

### Q1: API Key 无效？

**错误**: `401 Unauthorized`

**解决**:
```
1. 检查 API Key 是否正确复制
2. 确认没有多余空格
3. 确认应用已创建
4. 重新生成 API Key
```

---

### Q2: 请求失败？

**错误**: `Network Error`

**解决**:
```
1. 检查网络连接
2. 检查防火墙设置
3. 尝试切换网络
4. 使用国内节点
```

---

### Q3: 余额不足？

**错误**: `402 Payment Required`

**解决**:
```
1. 检查免费额度是否用完
2. 充值账户
3. 或降级到预设路线
```

---

### Q4: 响应太慢？

**问题**: 超过 5 秒

**解决**:
```
1. 检查网络延迟
2. 降低 max_tokens
3. 使用更小的模型
4. 添加超时处理
```

---

## 💡 最佳实践

### 1. 错误降级

```javascript
try {
  // 尝试 AI 生成
  route = await generateRouteRecommendation(emotion)
} catch (error) {
  // 降级到预设路线
  route = getFallbackRoute(emotion)
  console.warn('AI 失败，使用预设路线')
}
```

### 2. 缓存结果

```javascript
const cache = new Map()

async function getCachedRoute(emotion) {
  if (cache.has(emotion)) {
    return cache.get(emotion)
  }
  
  const route = await generateRouteRecommendation(emotion)
  cache.set(emotion, route)
  return route
}
```

### 3. 限流保护

```javascript
let callCount = 0
const MAX_CALLS = 100 // 每小时最多 100 次

function checkRateLimit() {
  if (callCount >= MAX_CALLS) {
    throw new Error('请求过于频繁，请稍后再试')
  }
  callCount++
}
```

### 4. 成本监控

```javascript
// 每天检查成本
function checkDailyCost() {
  const stats = getUsageStats()
  if (parseFloat(stats.todayCost) > 10) {
    alert('今日 API 费用已超过 10 元')
  }
}
```

---

## ✅ 配置检查清单

### 注册阶段

- [ ] 注册豆包账号
- [ ] 完成实名认证
- [ ] 创建应用
- [ ] 获取 API Key
- [ ] 保存 API Key 到安全位置

### 配置阶段

- [ ] 创建 `.env` 文件
- [ ] 填写 API Key
- [ ] 填写 APP ID
- [ ] 测试 API 连接

### 测试阶段

- [ ] 运行测试脚本
- [ ] 测试 AI 对话
- [ ] 测试路线生成
- [ ] 测试 TTS 语音

### 部署阶段

- [ ] 将 `.env` 添加到 `.gitignore`
- [ ] 配置生产环境变量
- [ ] 测试生产环境
- [ ] 监控成本

---

## 🔒 安全注意事项

### API Key 保护

```
✅ 使用环境变量
✅ 不提交到 Git
✅ 定期更换
✅ 设置使用限制

❌ 硬编码在代码中
❌ 提交到 GitHub
❌ 分享给他人
❌ 前端直接暴露（建议后端代理）
```

### .gitignore 配置

```gitignore
# 环境变量
.env
.env.local
.env.production

# 密钥文件
*.key
*.secret
```

---

## 📞 获取帮助

**官方文档**:
- 豆包 API 文档：https://www.volcengine.com/docs
- API 参考：https://www.volcengine.com/docs/ark/api-reference

**技术支持**:
- 工单系统：控制台 → 支持与服务
- 客服热线：400-xxx-xxxx

---

## 🎉 总结

### 优势

✅ 无需安装 Ollama  
✅ 手机完美支持  
✅ AI 能力强大  
✅ 部署简单  
✅ 成本可控  

### 注意事项

⚠️ 需要注册账号  
⚠️ 需要实名认证  
⚠️ 按量付费  
⚠️ 需要网络  
⚠️ API Key 需保护  

### 下一步

1. **批准注册** → 2. **获取 API Key** → 3. **配置项目** → 4. **测试使用**

---

**请确认是否批准注册豆包 API！** 🙏

批准后我会帮你：
- A. 完成注册流程
- B. 配置环境变量
- C. 集成到项目
- D. 测试所有功能

回复选项！⚡
