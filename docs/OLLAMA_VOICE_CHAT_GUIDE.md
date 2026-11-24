# 🤖 Ollama 语音对话集成指南

**最后更新**: 2026-04-24 17:35  
**状态**: 等待安装

---

## 📥 一、安装 Ollama

### 1.1 Windows 安装

**下载地址**: https://ollama.com/download/windows

**安装步骤**:
1. 下载 `OllamaSetup.exe`
2. 双击运行安装
3. 安装完成后自动运行

**验证安装**:
```powershell
ollama --version
```

### 1.2 下载模型

**推荐模型** (选择一个):

| 模型 | 大小 | 速度 | 质量 | 推荐度 |
|------|------|------|------|--------|
| **qwen2.5:7b** | 4.7GB | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ 首选 |
| **llama3.2:3b** | 2GB | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **mistral:7b** | 4.1GB | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **qwen2.5:14b** | 9GB | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |

**下载命令**:
```powershell
# 推荐：通义千问 2.5（中文效果好）
ollama pull qwen2.5:7b

# 或者：Llama 3.2（轻量快速）
ollama pull llama3.2:3b
```

**查看已下载模型**:
```powershell
ollama list
```

---

## 🎤 二、语音对话功能

### 2.1 功能特性

| 功能 | 说明 |
|------|------|
| **语音输入** | 浏览器原生语音识别 |
| **AI 对话** | Ollama 本地模型 |
| **语音输出** | Web Speech API TTS |
| **对话历史** | 本地存储上下文 |
| **龙华知识** | 自动融入龙华相关内容 |

### 2.2 使用场景

```
用户："我想去龙华寺，怎么走？"
  ↓
AI："从你当前位置到龙华寺，建议乘坐地铁 11 号线..."
  ↓
语音播报给用户听
```

---

## 🔧 三、代码实现

### 3.1 Ollama API 工具

**文件**: `src/utils/ollama.ts`

```typescript
// Ollama API 配置
const OLLAMA_BASE_URL = 'http://localhost:11434'
const MODEL_NAME = 'qwen2.5:7b' // 可配置

// 对话上下文
let conversationHistory: Array<{
  role: 'user' | 'assistant'
  content: string
}> = []

// 发送消息到 Ollama
export async function chatWithOllama(message: string): Promise<string> {
  try {
    // 添加用户消息到历史
    conversationHistory.push({
      role: 'user',
      content: message
    })

    const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: [
          {
            role: 'system',
            content: `你是龙华·灵境向导的 AI 助手，熟悉上海徐汇龙华地区的历史、文化、美食、景点。
请用友好、亲切的语气回答，融入龙华本地特色。
如果用户问的是龙华相关问题，详细解答；如果是其他问题，也尽力帮助。
回答简洁明了，适合语音播报。`
          },
          ...conversationHistory
        ],
        stream: false
      })
    })

    if (!response.ok) {
      throw new Error(`Ollama API 错误：${response.status}`)
    }

    const data = await response.json()
    const assistantMessage = data.message?.content || '抱歉，我没有理解'

    // 添加 AI 回复到历史
    conversationHistory.push({
      role: 'assistant',
      content: assistantMessage
    })

    // 保持历史记录不要太长
    if (conversationHistory.length > 20) {
      conversationHistory = conversationHistory.slice(-20)
    }

    return assistantMessage

  } catch (error) {
    console.error('Ollama 对话失败:', error)
    throw error
  }
}

// 清空对话历史
export function clearConversationHistory() {
  conversationHistory = []
}

// 检查 Ollama 是否可用
export async function checkOllamaStatus(): Promise<boolean> {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`)
    return response.ok
  } catch {
    return false
  }
}

// 获取已安装的模型
export async function getInstalledModels(): Promise<string[]> {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`)
    const data = await response.json()
    return data.models?.map((m: any) => m.name) || []
  } catch {
    return []
  }
}
```

### 3.2 语音识别工具

**文件**: `src/utils/voiceRecognition.ts`

```typescript
// 语音识别配置
interface VoiceRecognitionConfig {
  language?: string
  continuous?: boolean
  interimResults?: boolean
}

// 语音识别类
class VoiceRecognizer {
  private recognition: any = null
  private isListening = false
  private onResultCallback?: (text: string) => void
  private onErrorCallback?: (error: string) => void
  private onEndCallback?: () => void

  constructor(config: VoiceRecognitionConfig = {}) {
    // 检查浏览器支持
    const SpeechRecognition = (window as any).SpeechRecognition || 
                              (window as any).webkitSpeechRecognition
    
    if (!SpeechRecognition) {
      console.error('浏览器不支持语音识别')
      return
    }

    this.recognition = new SpeechRecognition()
    this.recognition.lang = config.language || 'zh-CN'
    this.recognition.continuous = config.continuous || false
    this.recognition.interimResults = config.interimResults || false

    // 识别结果
    this.recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      this.onResultCallback?.(transcript)
    }

    // 识别错误
    this.recognition.onerror = (event: any) => {
      console.error('语音识别错误:', event.error)
      this.onErrorCallback?.(event.error)
      this.isListening = false
    }

    // 识别结束
    this.recognition.onend = () => {
      this.isListening = false
      this.onEndCallback?.()
    }
  }

  // 开始监听
  start(): void {
    if (!this.recognition || this.isListening) return
    
    try {
      this.recognition.start()
      this.isListening = true
    } catch (error) {
      console.error('启动语音识别失败:', error)
    }
  }

  // 停止监听
  stop(): void {
    if (!this.recognition || !this.isListening) return
    this.recognition.stop()
    this.isListening = false
  }

  // 设置回调
  onResult(callback: (text: string) => void): void {
    this.onResultCallback = callback
  }

  onError(callback: (error: string) => void): void {
    this.onErrorCallback = callback
  }

  onEnd(callback: () => void): void {
    this.onEndCallback = callback
  }

  // 是否正在监听
  isListeningStatus(): boolean {
    return this.isListening
  }
}

// 创建单例
export const voiceRecognizer = new VoiceRecognizer({
  language: 'zh-CN',
  continuous: false,
  interimResults: false
})

// 便捷函数
export function startVoiceListening(
  onText: (text: string) => void,
  onError?: (error: string) => void,
  onEnd?: () => void
): void {
  voiceRecognizer.onResult(onText)
  voiceRecognizer.onError(onError || console.error)
  voiceRecognizer.onEnd(onEnd || (() => {}))
  voiceRecognizer.start()
}

export function stopVoiceListening(): void {
  voiceRecognizer.stop()
}

export function isListening(): boolean {
  return voiceRecognizer.isListeningStatus()
}
```

### 3.3 语音对话管理器

**文件**: `src/utils/voiceChat.ts`

```typescript
import { chatWithOllama, checkOllamaStatus } from './ollama'
import { startVoiceListening, stopVoiceListening, isListening } from './voiceRecognition'
import { playTTS, stopTTS } from './tts'

// 语音对话状态
interface VoiceChatState {
  isInitialized: boolean
  isListening: boolean
  isProcessing: boolean
  isSpeaking: boolean
  error: string | null
}

const state: VoiceChatState = {
  isInitialized: false,
  isListening: false,
  isProcessing: false,
  isSpeaking: false,
  error: null
}

// 初始化检查
export async function initVoiceChat(): Promise<boolean> {
  // 检查 Ollama
  const ollamaAvailable = await checkOllamaStatus()
  if (!ollamaAvailable) {
    state.error = 'Ollama 未运行，请先启动 Ollama'
    return false
  }

  // 检查语音识别
  const SpeechRecognition = (window as any).SpeechRecognition || 
                            (window as any).webkitSpeechRecognition
  if (!SpeechRecognition) {
    state.error = '浏览器不支持语音识别'
    return false
  }

  state.isInitialized = true
  state.error = null
  return true
}

// 开始语音对话
export async function startVoiceConversation(
  onStatusChange: (state: VoiceChatState) => void
): Promise<void> {
  if (!state.isInitialized) {
    const success = await initVoiceChat()
    if (!success) {
      onStatusChange(state)
      return
    }
  }

  // 开始录音
  state.isListening = true
  onStatusChange(state)

  startVoiceListening(
    async (userText) => {
      // 用户说完话
      state.isListening = false
      state.isProcessing = true
      onStatusChange(state)

      try {
        // 调用 Ollama
        const aiResponse = await chatWithOllama(userText)
        
        state.isProcessing = false
        state.isSpeaking = true
        onStatusChange(state)

        // TTS 播放回复
        playTTS(aiResponse, {
          rate: 0.9,
          pitch: 1.0
        }, () => {
          state.isSpeaking = false
          onStatusChange(state)
        })

      } catch (error) {
        console.error('对话失败:', error)
        state.isProcessing = false
        state.error = '对话失败，请重试'
        onStatusChange(state)
      }
    },
    (error) => {
      console.error('语音识别错误:', error)
      state.isListening = false
      state.error = `语音识别错误：${error}`
      onStatusChange(state)
    },
    () => {
      // 录音结束（用户取消）
      state.isListening = false
      onStatusChange(state)
    }
  )
}

// 停止语音对话
export function stopVoiceConversation(): void {
  stopVoiceListening()
  stopTTS()
  state.isListening = false
  state.isProcessing = false
  state.isSpeaking = false
}

// 获取状态
export function getVoiceChatState(): VoiceChatState {
  return state
}

// 清空对话
export function clearVoiceChatHistory(): void {
  import('./ollama').then(({ clearConversationHistory }) => {
    clearConversationHistory()
  })
}
```

---

## 🎨 四、UI 组件

### 4.1 语音对话按钮组件

**文件**: `src/components/VoiceChatButton.vue`

```vue
<template>
  <div class="voice-chat-container">
    <!-- 语音按钮 -->
    <button
      @click="toggleVoiceChat"
      :class="['voice-btn', {
        listening: state.isListening,
        processing: state.isProcessing,
        speaking: state.isSpeaking,
        error: !!state.error
      }]"
      :title="buttonTitle"
    >
      <span class="voice-icon">
        {{ currentStateIcon }}
      </span>
      <span class="voice-text">{{ currentStateText }}</span>
    </button>

    <!-- 错误提示 -->
    <div v-if="state.error" class="error-toast">
      ⚠️ {{ state.error }}
      <button @click="dismissError" class="dismiss-btn">×</button>
    </div>

    <!-- 初始化提示 -->
    <div v-if="showInitModal" class="init-modal">
      <div class="modal-content">
        <h3>🤖 语音对话设置</h3>
        <div class="init-steps">
          <div class="step">
            <span class="step-icon">1️⃣</span>
            <p>安装 Ollama：<a href="https://ollama.com" target="_blank">ollama.com</a></p>
          </div>
          <div class="step">
            <span class="step-icon">2️⃣</span>
            <p>下载模型：<code>ollama pull qwen2.5:7b</code></p>
          </div>
          <div class="step">
            <span class="step-icon">3️⃣</span>
            <p>运行 Ollama（后台自动运行）</p>
          </div>
          <div class="step">
            <span class="step-icon">4️⃣</span>
            <p>点击"开始对话"按钮</p>
          </div>
        </div>
        <div class="modal-actions">
          <button @click="checkAndInit" class="primary-btn">
            🔍 检查 Ollama 状态
          </button>
          <button @click="closeInitModal" class="secondary-btn">
            稍后再说
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { 
  initVoiceChat, 
  startVoiceConversation, 
  stopVoiceConversation,
  getVoiceChatState,
  clearVoiceChatHistory
} from '../utils/voiceChat'

const emit = defineEmits<{
  (e: 'chatStart', message: string): void
  (e: 'chatEnd'): void
}>()

const state = ref(getVoiceChatState())
const showInitModal = ref(false)

// 状态图标
const currentStateIcon = computed(() => {
  if (state.value.error) return '⚠️'
  if (state.value.isListening) return '🎤'
  if (state.value.isProcessing) return '⏳'
  if (state.value.isSpeaking) return '🔊'
  return '🎙️'
})

// 状态文字
const currentStateText = computed(() => {
  if (state.value.error) return '错误'
  if (state.value.isListening) return '正在听...'
  if (state.value.isProcessing) return '思考中...'
  if (state.value.isSpeaking) return '说话中...'
  return '语音对话'
})

// 按钮标题
const buttonTitle = computed(() => {
  if (state.value.error) return state.value.error!
  if (state.value.isListening) return '点击停止'
  return '点击开始语音对话'
})

// 切换语音对话
async function toggleVoiceChat() {
  if (state.value.isListening || state.value.isProcessing || state.value.isSpeaking) {
    stopVoiceConversation()
    emit('chatEnd')
  } else {
    if (!state.value.isInitialized) {
      await initVoiceChat()
      if (!state.value.isInitialized) {
        showInitModal.value = true
        return
      }
    }
    await startVoiceConversation((newState) => {
      state.value = { ...newState }
    })
  }
}

// 检查并初始化
async function checkAndInit() {
  const success = await initVoiceChat()
  if (success) {
    showInitModal.value = false
    toggleVoiceChat()
  } else {
    alert('初始化失败，请确保 Ollama 已安装并运行')
  }
}

// 关闭初始化弹窗
function closeInitModal() {
  showInitModal.value = false
}

// 关闭错误提示
function dismissError() {
  state.value.error = null
}

// 组件挂载时检查
onMounted(async () => {
  await initVoiceChat()
})
</script>

<style scoped>
.voice-chat-container {
  position: relative;
}

.voice-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: linear-gradient(135deg, #F9B572, #f4a25e);
  border: none;
  border-radius: 44px;
  color: white;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 14px rgba(249, 181, 114, 0.3);
}

.voice-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(249, 181, 114, 0.4);
}

.voice-btn.listening {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  animation: pulse-red 1.5s infinite;
}

.voice-btn.processing {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  animation: pulse-orange 1.5s infinite;
}

.voice-btn.speaking {
  background: linear-gradient(135deg, #10b981, #059669);
  animation: pulse-green 1.5s infinite;
}

.voice-btn.error {
  background: linear-gradient(135deg, #ef4444, #dc2626);
}

.voice-icon {
  font-size: 1.3rem;
}

@keyframes pulse-red {
  0%, 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
  50% { box-shadow: 0 0 0 15px rgba(239, 68, 68, 0); }
}

@keyframes pulse-orange {
  0%, 100% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.4); }
  50% { box-shadow: 0 0 0 15px rgba(245, 158, 11, 0); }
}

@keyframes pulse-green {
  0%, 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
  50% { box-shadow: 0 0 0 15px rgba(16, 185, 129, 0); }
}

.error-toast {
  position: absolute;
  top: 60px;
  left: 50%;
  transform: translateX(-50%);
  background: #fee2e2;
  color: #dc2626;
  padding: 12px 20px;
  border-radius: 16px;
  font-size: 0.9rem;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 12px;
  animation: slide-down 0.3s ease-out;
}

.dismiss-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #dc2626;
  padding: 0 4px;
}

@keyframes slide-down {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

.init-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
}

.modal-content {
  background: white;
  border-radius: 28px;
  padding: 32px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-content h3 {
  color: #E87A5D;
  font-size: 1.5rem;
  margin-bottom: 24px;
  text-align: center;
}

.init-steps {
  margin-bottom: 24px;
}

.step {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 16px;
}

.step-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.step p {
  color: #5a4a42;
  font-size: 0.95rem;
  line-height: 1.5;
  margin: 0;
}

.step code {
  background: #f5f5f5;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 0.85rem;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.primary-btn {
  padding: 12px 24px;
  background: #F9B572;
  border: none;
  border-radius: 40px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.primary-btn:hover {
  background: #f4a25e;
  transform: translateY(-2px);
}

.secondary-btn {
  padding: 12px 24px;
  background: #f5f5f5;
  border: none;
  border-radius: 40px;
  color: #5a4a42;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.secondary-btn:hover {
  background: #e5e5e5;
}
</style>
```

---

## ✅ 五、快速开始

### 5.1 安装步骤

```powershell
# 1. 安装 Ollama
# 访问 https://ollama.com 下载安装

# 2. 下载模型
ollama pull qwen2.5:7b

# 3. 验证
ollama list

# 4. 运行（自动后台运行）
ollama serve
```

### 5.2 测试对话

```powershell
# 命令行测试
ollama run qwen2.5:7b "你好，介绍一下龙华寺"
```

### 5.3 应用集成

**添加到 App.vue**:

```vue
<template>
  <!-- 在合适位置添加语音对话按钮 -->
  <VoiceChatButton
    @chatStart="handleChatStart"
    @chatEnd="handleChatEnd"
  />
</template>

<script setup>
import VoiceChatButton from './components/VoiceChatButton.vue'

function handleChatStart(message) {
  console.log('用户说:', message)
}

function handleChatEnd() {
  console.log('对话结束')
}
</script>
```

---

## 🎯 六、效果演示

### 对话流程

```
用户点击"🎙️ 语音对话"按钮
  ↓
按钮变红"🎤 正在听..."
  ↓
用户说话："我想去龙华寺，怎么走？"
  ↓
按钮变橙"⏳ 思考中..."
  ↓
Ollama 处理并回复
  ↓
按钮变绿"🔊 说话中..."
  ↓
播放语音："从你当前位置到龙华寺..."
  ↓
恢复默认"🎙️ 语音对话"
```

---

## 📊 七、性能优化

### 7.1 响应时间

| 阶段 | 时间 | 优化 |
|------|------|------|
| 语音识别 | 0.5-1 秒 | 浏览器原生 |
| Ollama 处理 | 1-3 秒 | 本地模型 |
| TTS 播放 | 即时 | 浏览器原生 |
| **总计** | **2-5 秒** | ✅ 可接受 |

### 7.2 模型选择建议

**快速优先**:
- `llama3.2:3b` (2GB, 最快)
- `qwen2.5:7b` (4.7GB, 平衡)

**质量优先**:
- `qwen2.5:14b` (9GB, 中文更好)
- `llama3.1:8b` (5GB, 均衡)

---

## ⚠️ 八、注意事项

### 8.1 浏览器要求

| 浏览器 | 语音识别 | TTS | 推荐度 |
|--------|---------|-----|--------|
| Chrome | ✅ | ✅ | ⭐⭐⭐⭐⭐ |
| Edge | ✅ | ✅ | ⭐⭐⭐⭐⭐ |
| Safari | ⚠️ 部分 | ✅ | ⭐⭐⭐ |
| Firefox | ❌ | ⚠️ 部分 | ⭐ |

**推荐**: Chrome 90+ 或 Edge 90+

### 8.2 硬件要求

| 配置 | 最低 | 推荐 |
|------|------|------|
| 内存 | 8GB | 16GB |
| CPU | i5 | i7/Ryzen 7 |
| 存储 | 10GB | 20GB SSD |
| 麦克风 | 需要 | 需要 |

### 8.3 常见问题

**Q: Ollama 启动失败？**
```powershell
# 检查端口是否被占用
netstat -ano | findstr :11434

# 重启 Ollama
ollama serve
```

**Q: 语音识别不工作？**
- 检查浏览器权限（麦克风）
- 使用 Chrome/Edge
- 确保 HTTPS 或 localhost

**Q: 对话太慢？**
- 换用小模型（llama3.2:3b）
- 关闭其他占用 CPU 的程序
- 确保 SSD 硬盘

---

## 🎉 九、总结

### 优势

✅ **免费**: 无需 API Key，完全免费  
✅ **本地**: 数据不出本地，隐私保护  
✅ **快速**: 本地模型，延迟低  
✅ **离线**: 无网络也能用  
✅ **中文**: Qwen 中文效果好  

### 功能

✅ **语音输入**: 浏览器原生识别  
✅ **AI 对话**: Ollama 本地模型  
✅ **语音输出**: TTS 播放  
✅ **龙华知识**: 自动融入本地特色  
✅ **对话历史**: 上下文记忆  

### 下一步

1. 安装 Ollama
2. 下载模型
3. 集成到应用
4. 测试对话

---

**准备好开始了吗？** 🚀

需要我帮你：
- A. 创建所有工具文件
- B. 集成到 App.vue
- C. 测试对话功能
- D. 先安装 Ollama 试试

回复选项！⚡
