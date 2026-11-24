# 🔐 心情地图 - API 配置指南

**最后更新**: 2026-04-24 22:30  
**安全等级**: ⭐⭐⭐⭐⭐

---

## ⚠️ 重要安全提醒

### 绝对禁止事项 ❌

**不要做的事**:
- ❌ 不要将 API Key 写入代码文件
- ❌ 不要将 API Key 上传到 GitHub
- ❌ 不要将 API Key 截图发给别人
- ❌ 不要在公开场合展示 API Key
- ❌ 不要将配置文件放入演示包

**原因**:
- API Key 泄露 = 别人可以用你的额度
- 可能被用来做恶意事情
- 费用会算在你的账号上

---

## 🎯 演示场景解决方案

### 场景 A：现场演示（推荐）⭐⭐⭐⭐⭐

**策略**: 本地模拟模式 + 口述说明

**优点**:
- ✅ 完全安全（无 API Key）
- ✅ 稳定可靠（不依赖网络）
- ✅ 演示可控（不会出错）

**演示话术**:
```
"福来猫 AI 对话功能，生产环境接入豆包 API。
为了演示稳定性，今天使用本地模拟模式。

评委老师可以扫这个二维码，
在手机上体验完整的 AI 对话功能。"
```

**准备材料**:
1. 本地模拟模式（已内置）
2. API 架构图文档（PPT 中展示）
3. 二维码（评委扫码自测）

---

### 场景 B：使用真实 AI（可选）⭐⭐⭐

**策略**: 现场配置 API Key

**优点**:
- ✅ 展示真实 AI 能力
- ✅ 可以回答任意问题

**风险**:
- ⚠️ 需要现场输入 API Key
- ⚠️ 依赖网络
- ⚠️ 可能出错

**安全措施**:
1. 用 U 盘携带配置文件
2. 演示后立即删除
3. 不保存配置文件
4. 准备 Plan B（本地模拟）

---

## 📦 配置文件管理

### 方案 A：浏览器 localStorage（推荐）⭐⭐⭐⭐⭐

**原理**: API Key 存在浏览器中，不写入文件

**使用方法**:

#### 第 1 步：打开配置页面

**文件**: `fulai-ai-doubao.html`

#### 第 2 步：输入 API Key

在配置面板中输入：
```
豆包 API Key: sk-xxxxxxxxxxxxxxxx
```

#### 第 3 步：开始使用

- 选择"豆包 AI（真实）"模式
- 开始对话测试

#### 第 4 步：演示结束

- 清除浏览器数据
- 或关闭无痕模式窗口

**优点**:
- ✅ 配置文件不落地
- ✅ 关闭浏览器即清除
- ✅ 安全可控

**缺点**:
- ❌ 换电脑需要重新配置
- ❌ 清除缓存会丢失

---

### 方案 B：配置文件（谨慎使用）⭐⭐⭐

**原理**: 将配置保存在单独文件中

**文件名**: `api-config.json`（不要上传到 Git）

**内容示例**:
```json
{
  "doubao": {
    "apiKey": "sk-xxxxxxxxxxxxxxxx",
    "endpoint": "https://ark.cn-beijing.volces.com/api/v3/chat/completions",
    "model": "doubao-pro-32k"
  }
}
```

**安全措施**:

#### 1. Git 忽略配置
```gitignore
# .gitignore 文件
api-config.json
*.env
.env.local
.env.*.local
```

#### 2. 配置文件权限
```bash
# Linux/Mac
chmod 600 api-config.json

# Windows
# 右键 → 属性 → 安全 → 只允许管理员访问
```

#### 3. 演示时处理
- 演示前：从 U 盘加载配置
- 演示后：立即删除配置
- 不将配置文件放入演示包

**优点**:
- ✅ 换电脑可用（U 盘携带）
- ✅ 可版本控制（忽略后）

**风险**:
- ⚠️ 文件可能被复制
- ⚠️ 忘记删除会泄露

---

### 方案 C：环境变量（生产环境）⭐⭐⭐⭐⭐

**原理**: 通过环境变量传递 API Key

**设置方法**:

#### Windows PowerShell
```powershell
# 临时设置（当前会话有效）
$env:DOUBAO_API_KEY="sk-xxxxxxxxxxxxxxxx"

# 永久设置（需要管理员）
setx DOUBAO_API_KEY "sk-xxxxxxxxxxxxxxxx" /M
```

#### Mac/Linux
```bash
# 临时设置
export DOUBAO_API_KEY="sk-xxxxxxxxxxxxxxxx"

# 永久设置（~/.bashrc 或~/.zshrc）
echo 'export DOUBAO_API_KEY="sk-xxxxxxxxxxxxxxxx"' >> ~/.bashrc
source ~/.bashrc
```

**代码读取**:
```javascript
// Node.js 后端
const apiKey = process.env.DOUBAO_API_KEY;

// 浏览器前端（通过后端代理）
const response = await fetch('/api/agent/chat', {
    headers: {
        'Authorization': `Bearer ${process.env.DOUBAO_API_KEY}`
    }
});
```

**优点**:
- ✅ 最安全（配置文件不落地）
- ✅ 生产环境标准做法
- ✅ 与代码分离

**缺点**:
- ❌ 设置复杂
- ❌ 浏览器无法直接使用

---

## 🎯 黑客松演示推荐方案

### 方案选择

**推荐**: **本地模拟模式**（最安全）

**理由**:
1. ✅ 无需 API Key
2. ✅ 稳定可靠
3. ✅ 不会泄露
4. ✅ 评委理解（演示环境）

### 演示流程

```
第 1 步：打开 demo-judge.html
        ↓
第 2 步：默认使用本地模拟模式
        ↓
第 3 步：演示情绪路线生成
        ↓
第 4 步：演示 AI 对话（本地模拟）
        ↓
第 5 步：说明"生产环境接入豆包 API"
        ↓
第 6 步：展示 API 架构图（PPT）
        ↓
第 7 步：提供二维码让评委自测
```

### 评委问答准备

**Q: "为什么 AI 回复这么简单？"**

**A**:
```
"评委老师，当前演示环境使用本地模拟模式，
为了确保演示稳定性。

生产环境我们接入豆包 AI API，
可以实现更智能的对话。

您现在可以扫这个二维码，
在手机上体验完整的 AI 对话功能。"
```

**Q: "API 架构能介绍一下吗？"**

**A**:
```
"我们的 AI 架构采用前后端分离：

前端：Vue 3 + TypeScript
后端：Node.js + Express
AI 服务：豆包大模型（doubao-pro-32k）

通过 RESTful API 通信：
POST /api/agent/chat

API Key 通过环境变量管理，
不写入代码，确保安全。"
```

---

## 📋 安全检查清单

### 演示前检查

- [ ] 代码中没有硬编码 API Key
- [ ] 配置文件已加入.gitignore
- [ ] 演示包中没有配置文件
- [ ] 准备了本地模拟模式
- [ ] 准备了 API 架构图
- [ ] 准备了评委问答话术

### 演示后检查

- [ ] 清除了浏览器配置
- [ ] 删除了临时配置文件
- [ ] 检查了 Git 提交记录
- [ ] 确认 API Key 未泄露

---

## 🔍 API Key 泄露检测

### 检查方法

#### 1. 检查代码
```bash
# 搜索代码中的 API Key
grep -r "sk-" E:\hackathon-travel-experience-main\
```

#### 2. 检查 Git 历史
```bash
# 查看 Git 提交记录
git log --all --full-history -- "*.json"
git log --all --full-history -- "*.env"
```

#### 3. 检查 GitHub
如果已上传 GitHub：
- 访问 https://github.com/yourname/yourrepo/settings/secrets
- 检查是否有敏感信息

#### 4. 检查配置文件
```bash
# 查找可能的配置文件
dir /s /b api-config.json
dir /s /b .env
dir /s /b *config*.json
```

---

## 🛡️ 安全最佳实践

### 开发环境

1. **使用.env.local 文件**
   ```
   DOUBAO_API_KEY=sk-xxx
   ```

2. **加入.gitignore**
   ```
   .env.local
   api-config.json
   ```

3. **使用环境变量**
   ```javascript
   const apiKey = import.meta.env.VITE_DOUBAO_API_KEY;
   ```

### 生产环境

1. **后端代理**
   ```javascript
   // Node.js 后端
   app.post('/api/agent/chat', (req, res) => {
       const apiKey = process.env.DOUBAO_API_KEY;
       // 调用豆包 API
   });
   ```

2. **使用密钥管理服务**
   - AWS Secrets Manager
   - Azure Key Vault
   - 火山引擎密钥管理

3. **定期更换 API Key**
   - 每 3 个月更换一次
   - 发现泄露立即更换

---

## 📞 紧急情况处理

### 如果发现 API Key 泄露

**第 1 步**: 立即更换 API Key
- 登录火山引擎控制台
- 删除泄露的 API Key
- 创建新的 API Key

**第 2 步**: 检查使用记录
- 查看 API 调用日志
- 确认是否有异常调用
- 评估损失

**第 3 步**: 更新配置
- 更新所有使用新 Key 的地方
- 通知团队成员
- 更新文档

**第 4 步**: 加强安全措施
- 审查代码
- 加强权限管理
- 设置使用限额

---

## ✅ 总结

### 推荐做法

| 场景 | 推荐方案 | 安全等级 |
|------|---------|---------|
| **黑客松演示** | 本地模拟模式 | ⭐⭐⭐⭐⭐ |
| **开发测试** | 浏览器 localStorage | ⭐⭐⭐⭐ |
| **生产部署** | 后端代理 + 环境变量 | ⭐⭐⭐⭐⭐ |
| **团队协作** | 密钥管理服务 | ⭐⭐⭐⭐⭐ |

### 绝对禁止

- ❌ 硬编码 API Key 到代码
- ❌ 将配置文件上传 Git
- ❌ 公开分享 API Key
- ❌ 在公开场合展示

### 核心原则

```
安全 > 功能 > 效率
```

**宁可不用，不可泄露！**

---

*文档版本：v1.0.0*  
*更新时间：2026-04-24 22:30*
