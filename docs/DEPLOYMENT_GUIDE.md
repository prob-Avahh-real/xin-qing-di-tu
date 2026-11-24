# 📦 龙华·灵境向导 部署指南

**版本**: 1.0  
**日期**: 2026-04-24  
**适用**: 黑客松提交、演示部署

---

## ⚠️ 重要说明：Ollama 功能

### Ollama 不打包！

**原因**:
- Ollama 是独立软件（类似 Chrome）
- 模型文件很大（4-10GB）
- 需要在每台电脑单独安装

**影响的功能**:
| 功能 | 无 Ollama 时 |
|------|------------|
| 🎙️ 语音对话 | ❌ 不可用（降级为普通 TTS） |
| 🤖 AI 智能推荐 | ⚠️ 使用预设路线（非 AI 生成） |
| 其他功能 | ✅ 全部正常 |

---

## 📦 一、项目打包（前端）

### 1.1 构建生产版本

```powershell
# 在项目目录执行
cd E:\hackathon-travel-experience-main

# 安装依赖
npm install

# 构建
npm run build
```

**输出位置**: `dist/` 文件夹

### 1.2 打包文件清单

**需要打包的文件**:

```
hackathon-travel-experience/
├── dist/                    # 构建输出（必须）
├── package.json             # 项目信息（必须）
├── README.md                # 说明文档（必须）
├── ollama-setup-guide.md    # Ollama 安装指南（必须）
├── demo-guide.md            # 演示说明（建议）
└── knowledge-base/          # 知识库（可选）
```

### 1.3 压缩打包

```powershell
# 方法 1: 右键压缩
# 选中上述文件 → 右键 → 发送到 → 压缩文件夹

# 方法 2: 使用 7-Zip
# 安装 7-Zip 后右键压缩为 .7z 或 .zip
```

**压缩包名称**: `longhua-voice-guide-v1.0.zip`

**预计大小**: 50-100MB

---

## 💻 二、目标电脑部署

### 2.1 基础部署（无 Ollama）

**步骤**:

1. **解压文件**
   ```
   解压到任意位置，如：D:\hackathon-demo\
   ```

2. **安装依赖**
   ```powershell
   cd D:\hackathon-demo
   npm install
   ```

3. **启动服务**
   ```powershell
   npm run dev
   ```

4. **访问应用**
   ```
   浏览器打开：http://localhost:5174/
   ```

**功能状态**:
| 功能 | 状态 |
|------|------|
| 情绪路线生成 | ✅ 正常 |
| 龙华知识库 | ✅ 正常 |
| AR 印章收集 | ✅ 正常 |
| 音乐播放 | ✅ 正常 |
| TTS 语音 | ✅ 正常 |
| 分享/PK | ✅ 正常 |
| 语音对话 | ❌ 不可用 |
| AI 智能推荐 | ⚠️ 降级 |

---

### 2.2 完整部署（带 Ollama）

**额外步骤**:

#### 步骤 1: 安装 Ollama

```powershell
# 下载
访问：https://ollama.com/download/windows

# 或使用 winget
winget install Ollama.Ollama

# 安装后自动运行
```

#### 步骤 2: 下载 AI 模型

```powershell
# 推荐模型（中文好）
ollama pull qwen2.5:7b

# 或轻量模型（快速）
ollama pull llama3.2:3b

# 查看已下载
ollama list
```

**下载时间**: 5-15 分钟（取决于网速）  
**文件大小**: 4-10GB

#### 步骤 3: 验证 Ollama

```powershell
# 测试对话
ollama run qwen2.5:7b "你好，介绍一下龙华寺"

# 检查服务
curl http://localhost:11434/api/tags
```

#### 步骤 4: 启动应用

```powershell
cd D:\hackathon-demo
npm install
npm run dev
```

**功能状态**:
| 功能 | 状态 |
|------|------|
| 所有功能 | ✅ 全部正常 |

---

## 🎯 三、黑客松演示方案

### 方案 A: 本地演示（推荐）

**准备**:
```
1. 提前在自己电脑安装 Ollama
2. 下载好模型
3. 测试所有功能正常
4. 带着笔记本到现场演示
```

**优点**:
- ✅ 功能完整
- ✅ 无需网络
- ✅ 响应快速

**缺点**:
- 只能用你的电脑

---

### 方案 B: 现场部署

**准备**:
```
1. 准备 U 盘（含项目压缩包）
2. 准备 Ollama 安装器（离线版）
3. 准备模型文件（可选，很大）
4. 打印安装指南
```

**流程**:
```
1. 解压项目（1 分钟）
2. 安装 Ollama（3 分钟）
3. 下载模型（10 分钟，需网络）
4. 启动应用（1 分钟）
5. 演示（5 分钟）
```

**总时间**: 约 15-20 分钟

**风险**:
- ⚠️ 现场网络可能慢
- ⚠️ 可能出意外问题

---

### 方案 C: 录屏备份（必须！）

**建议**:
```
提前录制完整演示视频（5 分钟）

内容:
1. 打开应用（10 秒）
2. 生成路线（30 秒）
3. 展示知识库（1 分钟）
4. AR 印章收集（1 分钟）
5. 语音对话演示（1 分钟）
6. 分享/PK 功能（30 秒）
7. 音乐/TTS（1 分钟）
8. 商业模式介绍（1 分钟）

格式：MP4 1080p
大小：< 100MB
```

**用途**:
- 现场出问题时播放
- 提交给评委
- 线上传播

---

## 📝 四、提交材料清单

### 4.1 黑客松提交

**必须提交**:
- [ ] 项目源代码（GitHub 链接）
- [ ] 演示视频（5 分钟）
- [ ] 商业计划书（PPT）
- [ ] 项目文档（README）

**可选提交**:
- [ ] 海报（110cm × 65cm）
- [ ] 用户手册
- [ ] 安装指南

### 4.2 GitHub 仓库结构

```
github-username/hackathon-travel-experience/
├── README.md              # 项目说明
├── package.json           # 依赖配置
├── src/                   # 源代码
│   ├── App.vue
│   ├── components/
│   ├── stores/
│   └── utils/
├── knowledge-base/        # 知识库
├── docs/                  # 文档
│   ├── BUSINESS_MODEL.md
│   ├── OLLAMA_GUIDE.md
│   └── TEST_CHECKLIST.md
└── demo/                  # 演示材料
    ├── demo-video.mp4
    └── demo-ppt.pptx
```

---

## 🔧 五、常见问题

### Q1: 没有 Ollama 能演示吗？

**A**: 可以！90% 功能正常：
- ✅ 情绪路线生成
- ✅ 知识库
- ✅ AR 印章
- ✅ 音乐/TTS
- ✅ 分享/PK
- ❌ 语音对话（用文字对话代替）

---

### Q2: Ollama 安装失败怎么办？

**解决方案**:
```powershell
# 1. 检查是否被防火墙拦截
# 暂时关闭防火墙测试

# 2. 检查端口占用
netstat -ano | findstr :11434

# 3. 重启 Ollama 服务
ollama serve

# 4. 重新安装
winget uninstall Ollama
winget install Ollama
```

---

### Q3: 模型下载太慢怎么办？

**解决方案**:
```powershell
# 使用国内镜像
export OLLAMA_MIRROR=https://ollama.flybird.cn

# 或下载更小的模型
ollama pull llama3.2:1b  # 只有 1GB
```

---

### Q4: 部署到服务器可以吗？

**A**: 可以，但需要配置：

```bash
# 服务器部署
npm run build
npm install -g serve
serve -s dist -l 3000

# Ollama 需要同样的服务器
# 或调用云端 Ollama API
```

---

## 📊 六、部署时间估算

| 步骤 | 时间 | 备注 |
|------|------|------|
| **解压项目** | 1 分钟 | - |
| **安装依赖** | 2-5 分钟 | 首次需要 |
| **安装 Ollama** | 3 分钟 | 可选 |
| **下载模型** | 5-15 分钟 | 可选，看网速 |
| **启动应用** | 30 秒 | - |
| **测试功能** | 5 分钟 | - |
| **总计** | **16-29 分钟** | 含 Ollama |
| **总计** | **8 分钟** | 不含 Ollama |

---

## ✅ 七、快速部署命令

### 一键部署脚本（PowerShell）

```powershell
# deploy.ps1

Write-Host "🚀 开始部署龙华·灵境向导..." -ForegroundColor Green

# 1. 检查 Node.js
if (-not (node -v)) {
    Write-Host "❌ 未检测到 Node.js，请先安装" -ForegroundColor Red
    exit 1
}

# 2. 安装依赖
Write-Host "📦 安装依赖..." -ForegroundColor Yellow
npm install

# 3. 检查 Ollama
Write-Host "🤖 检查 Ollama..." -ForegroundColor Yellow
if (-not (ollama --version)) {
    Write-Host "⚠️ Ollama 未安装，部分功能不可用" -ForegroundColor Yellow
    Write-Host "💡 安装指南：查看 ollama-setup-guide.md" -ForegroundColor Cyan
} else {
    Write-Host "✅ Ollama 已安装" -ForegroundColor Green
    
    # 检查模型
    $models = ollama list
    if (-not $models) {
        Write-Host "⚠️ 未检测到模型，建议下载 qwen2.5:7b" -ForegroundColor Yellow
        Write-Host "   运行：ollama pull qwen2.5:7b" -ForegroundColor Cyan
    }
}

# 4. 启动应用
Write-Host "🎯 启动应用..." -ForegroundColor Green
npm run dev

Write-Host "✅ 部署完成！" -ForegroundColor Green
Write-Host "🌐 访问：http://localhost:5174/" -ForegroundColor Cyan
```

**使用方法**:
```powershell
# 保存为 deploy.ps1
# 右键 → 使用 PowerShell 运行
```

---

## 🎉 八、演示检查清单

### 演示前检查

- [ ] 应用正常启动
- [ ] 所有按钮有响应
- [ ] 路线生成功能正常
- [ ] 知识库可以打开
- [ ] AR 印章可以收集
- [ ] 音乐可以播放
- [ ] TTS 语音正常
- [ ] Ollama 已安装（如需要）
- [ ] 语音对话正常（如需要）
- [ ] 演示视频已准备（备份）

### 演示流程

```
1. 开场介绍（30 秒）
   - 项目名称、团队
   - 解决的问题

2. 功能演示（3 分钟）
   - 生成情绪路线
   - 展示知识库
   - AR 印章收集
   - 语音对话（如有）

3. 商业模式（1 分钟）
   - 6 大收入来源
   - 市场规模

4. 结尾（30 秒）
   - 愿景
   - 谢谢
```

**总时间**: 5 分钟

---

## 📞 九、技术支持

### 遇到问题？

**GitHub Issues**:
```
https://github.com/your-repo/issues
```

**联系方式**:
```
邮箱：your-email@example.com
微信：your-wechat
```

### 紧急救援

```powershell
# 重置项目
rm -rf node_modules
rm package-lock.json
npm install
npm run dev

# 重置 Ollama
ollama serve --debug
```

---

## 🎯 十、总结

### 打包清单

**必须**:
- ✅ 项目代码（dist/ + package.json）
- ✅ README.md
- ✅ Ollama 安装指南

**建议**:
- ✅ 演示视频
- ✅ 商业计划书
- ✅ 测试清单

### Ollama 保证

| 场景 | Ollama 状态 | 功能 |
|------|-----------|------|
| **你的电脑** | ✅ 已安装 | 100% 正常 |
| **演示电脑** | ⚠️ 需安装 | 安装后 100% |
| **评委电脑** | ❌ 未安装 | 90% 正常 |
| **线上版本** | ❌ 无 | 90% 正常 |

### 最佳实践

```
1. 自己电脑：完整功能演示
2. 现场演示：提前安装 Ollama
3. 提交材料：包含安装指南
4. 备份方案：演示视频
```

---

**祝黑客松顺利！** 🏆

需要我帮你：
- A. 创建一键部署脚本
- B. 录制演示视频脚本
- C. 准备 GitHub 仓库
- D. 创建演示 PPT

回复选项！⚡
