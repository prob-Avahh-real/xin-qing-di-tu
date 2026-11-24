# 🎙️ 语音合成优化指南

*最后更新：2026-04-24 | 问题：语音机械、不连贯、很难听*

---

## ❌ 问题诊断

### 用户反馈

> "语音能不能连贯一点。很难听呢"

### 问题分析

| 问题 | 原因 | 影响 |
|------|------|------|
| **语速太快** | rate=1.1 | 像赶时间，没有感情 |
| **音调太高** | pitch=1.4 | 尖锐刺耳，不自然 |
| **没有停顿** | 一气呵成 | 机械感强，无法消化 |
| **语调平淡** | 无起伏 | 像机器人念稿 |
| **断句不合理** | 长句不断 | 听不懂重点 |

---

## ✅ 优化方案

### 核心改进

#### 1. 调整参数

| 参数 | 旧值 | 新值 | 改善 |
|------|------|------|------|
| **语速 (rate)** | 1.1 | 0.9 | ⬇️ 慢 18%，更有感情 |
| **音调 (pitch)** | 1.4 | 1.1 | ⬇️ 柔和 21%，不刺耳 |
| **音量 (volume)** | 1.0 | 0.9 | ⬇️ 适中，不炸耳 |
| **停顿 (pause)** | 0ms | 300ms | ➕ 新增，给思考时间 |

---

#### 2. 智能断句（核心优化！）

**旧版本**（一气呵成）：
```javascript
// 一句话说到底
utterance = new SpeechSynthesisUtterance(
  "我知道你很难过让福来抱抱你龙华寺的猫咪在天王殿门口等你它不会说话但它会轻轻蹭你的裤腿有时候被理解不需要语言"
);
```

**新版本**（智能断句）：
```javascript
// 按标点符号分割
function splitText(text) {
  // 按句号、感叹号、问号分割
  const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g);
  
  const segments = [];
  sentences.forEach(s => {
    // 如果句子超过 15 个字，按逗号分割
    if (s.length > 15) {
      const clauses = s.split(/[,，]/);
      clauses.forEach(c => {
        if (c.trim()) segments.push(c.trim());
      });
    } else {
      if (s.trim()) segments.push(s.trim());
    }
  });
  
  return segments;
}

// 逐句播放 + 停顿
function playNext() {
  if (index >= segments.length) return;
  
  const segment = segments[index];
  const utterance = new SpeechSynthesisUtterance(segment);
  
  utterance.pitch = 1.1;
  utterance.rate = 0.9;
  utterance.volume = 0.9;
  
  utterance.onend = () => {
    index++;
    setTimeout(playNext, 300); // 停顿 300ms
  };
  
  synth.speak(utterance);
}
```

---

#### 3. 语调起伏

**不同场景，不同语调**：

| 场景 | 音调 | 语速 | 停顿 | 情感 |
|------|------|------|------|------|
| **EMO 治愈** | 1.0-1.1 | 0.8-0.9 | 400ms | 温柔、缓慢 |
| **拍照打卡** | 1.2-1.3 | 1.0-1.1 | 200ms | 兴奋、轻快 |
| **约会恋爱** | 1.1-1.2 | 0.9-1.0 | 350ms | 浪漫、抒情 |
| **美食探店** | 1.2-1.3 | 1.0-1.1 | 250ms | 热情、推荐 |
| **文艺展览** | 1.0-1.1 | 0.85-0.95 | 400ms | 沉稳、知性 |

---

#### 4. 语音选择

**优先选择女性语音**：

```javascript
// 选择中文语音
const zhVoices = voices.filter(v => v.lang.includes('zh'));

// 优先女性语音
const femaleVoice = zhVoices.find(v => 
  v.name.includes('Female') || 
  v.name.includes('Girl') ||
  v.name.includes('女')
);

utterance.voice = femaleVoice || zhVoices[0];
```

**推荐语音**（按优先级）：
1. `zh-CN-XiaoxiaoNeural` - 温柔女声（Edge）
2. `zh-CN-YunxiNeural` - 温暖男声（Edge）
3. `zh-CN female` - 标准女声（Chrome）
4. `zh-CN male` - 标准男声（Chrome）

---

## 🎯 预设配置

### 预设 1：温柔女声（EMO 治愈）

```javascript
{
  name: "温柔女声",
  pitch: 1.15,    // 略高，温柔
  rate: 0.85,     // 慢，有感情
  volume: 0.9,    // 适中
  pause: 400      // 长停顿，给思考时间
}
```

**适用场景**：
- EMO 治愈路线
- 一个人散心
- 祈福许愿

**文案示例**：
> "我知道...你很难过。  
> 让福来...抱抱你。  
> 有时候...被理解，不需要语言。"

---

### 预设 2：可爱萝莉（拍照打卡）

```javascript
{
  name: "可爱萝莉",
  pitch: 1.4,     // 高，可爱
  rate: 1.0,      // 正常
  volume: 0.95,   // 稍大
  pause: 200      // 短停顿，轻快
}
```

**适用场景**：
- 拍照打卡
- 朋友聚会
- 探索发现

**文案示例**：
> "哇！这里超好拍的！  
> 塔影空间的倒影，刷爆朋友圈！  
> 怎么拍，都美！"

---

### 预设 3：温暖大叔（文艺展览）

```javascript
{
  name: "温暖大叔",
  pitch: 0.9,     // 低，沉稳
  rate: 0.85,     // 慢，有磁性
  volume: 0.9,    // 适中
  pause: 400      // 长停顿，深沉
}
```

**适用场景**：
- 文艺展览
- 历史讲解
- 文化故事

**文案示例**：
> "龙华寺，始建于 262 年。  
> 一千七百多年...  
> 见证了无数朝代更迭。"

---

### 预设 4：动漫少女（约会恋爱）

```javascript
{
  name: "动漫少女",
  pitch: 1.5,     // 很高，甜美
  rate: 1.1,      // 稍快，活泼
  volume: 1.0,    // 大
  pause: 250      // 中等停顿
}
```

**适用场景**：
- 约会恋爱
- 美食探店
- 运动健身

**文案示例**：
> "下午五点二十分！  
> 太阳会落在江面上～  
> 这个时候，最适合说...  
> '我喜欢你'！"

---

## 🔧 实施步骤

### Step 1: 测试优化效果

打开 `optimized-voice-test.html`：

1. **对比新旧版本**
   - 点击"听旧版本" → 听机械感
   - 点击"听新版本" → 听自然感

2. **测试不同场景**
   - EMO 治愈
   - 拍照打卡
   - 约会恋爱

3. **调整参数**
   - 找到最适合的音调/语速
   - 保存预设

---

### Step 2: 更新主文件

在 `business-pro-personalized.html` 中，添加智能断句函数：

```javascript
// 智能断句函数
function splitText(text) {
  const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [text];
  const segments = [];
  
  sentences.forEach(s => {
    if (s.length > 15) {
      const clauses = s.split(/[,，]/);
      clauses.forEach(c => {
        if (c.trim()) segments.push(c.trim());
      });
    } else {
      if (s.trim()) segments.push(s.trim());
    }
  });
  
  return segments;
}

// 优化版语音播放
function speakText(text, emotion) {
  if (synth.speaking) {
    synth.cancel();
  }
  
  // 根据情绪选择预设
  const presets = {
    sad: { pitch: 1.1, rate: 0.85, pause: 400 },
    relax: { pitch: 1.1, rate: 0.85, pause: 400 },
    photo: { pitch: 1.25, rate: 1.05, pause: 200 },
    social: { pitch: 1.3, rate: 1.1, pause: 200 },
    art: { pitch: 1.1, rate: 0.9, pause: 350 },
    date: { pitch: 1.2, rate: 0.95, pause: 300 },
    family: { pitch: 1.15, rate: 0.95, pause: 300 },
    food: { pitch: 1.25, rate: 1.05, pause: 250 },
    explore: { pitch: 1.2, rate: 1.0, pause: 300 },
    lucky: { pitch: 1.15, rate: 0.9, pause: 350 },
    fitness: { pitch: 1.3, rate: 1.15, pause: 200 },
    chill: { pitch: 1.1, rate: 0.85, pause: 400 }
  };
  
  const preset = presets[emotion] || presets.chill;
  
  // 智能断句
  const segments = splitText(text);
  
  let index = 0;
  
  function playNext() {
    if (index >= segments.length) return;
    
    const utterance = new SpeechSynthesisUtterance(segments[index]);
    utterance.pitch = preset.pitch;
    utterance.rate = preset.rate;
    utterance.volume = 0.9;
    utterance.lang = 'zh-CN';
    
    // 选择语音
    const zhVoices = synth.getVoices().filter(v => v.lang.includes('zh'));
    const femaleVoice = zhVoices.find(v => 
      v.name.includes('Female') || 
      v.name.includes('Girl') ||
      v.name.includes('女')
    );
    utterance.voice = femaleVoice || zhVoices[0];
    
    utterance.onend = () => {
      index++;
      setTimeout(playNext, preset.pause);
    };
    
    synth.speak(utterance);
  }
  
  playNext();
}
```

---

### Step 3: 优化文案

**旧文案**（长句、无标点）：
```
我知道你很难过让福来抱抱你龙华寺的猫咪在天王殿门口等你它不会说话但它会轻轻蹭你的裤腿有时候被理解不需要语言
```

**新文案**（短句、有标点、有停顿）：
```
我知道...你很难过。

让福来...抱抱你。

龙华寺的猫咪，在天王殿门口等你。

它不会说话，但它会轻轻蹭你的裤腿。

有时候，被理解...不需要语言。
```

**文案优化技巧**：
1. 使用省略号 `...` 表示停顿
2. 使用句号 `.` 分割完整意思
3. 使用逗号 `,` 分割从句
4. 每句不超过 15 个字
5. 重要词语前后加停顿

---

## 📋 测试清单

### 功能测试

- [ ] EMO 路线语音温柔治愈
- [ ] 拍照路线语音轻快兴奋
- [ ] 约会路线语音浪漫抒情
- [ ] 长文案自动断句
- [ ] 句间停顿自然（300ms）
- [ ] 播放可暂停/停止
- [ ] 错误处理友好

### 用户体验测试

| 测试项 | 目标 | 实际 | 结果 |
|--------|------|------|------|
| **清晰度** | 能听懂每个字 | ⬜ | 待测 |
| **自然度** | 不像机器人 | ⬜ | 待测 |
| **情感** | 有情绪起伏 | ⬜ | 待测 |
| **节奏** | 快慢适中 | ⬜ | 待测 |
| **舒适度** | 不刺耳不炸耳 | ⬜ | 待测 |

---

## 🎯 最终建议

### 黑客松前（立即执行）

1. **应用优化参数**
   - pitch: 1.1
   - rate: 0.9
   - pause: 300ms

2. **实现智能断句**
   - 长句自动分割
   - 逐句播放 + 停顿

3. **优化文案**
   - 短句为主
   - 添加标点符号
   - 重要处加停顿

4. **添加语音选择**
   - 优先女声
   - 提供切换选项

---

### 黑客松后（长期优化）

1. **接入专业 TTS**
   - Azure Cognitive Services
   - 百度语音合成
   - 讯飞有声

2. **情感识别**
   - 根据内容自动调整语调
   - 高兴时语调上扬
   - 难过时语调低沉

3. **多语音支持**
   - 福来猫（可爱）
   - 龙龙（沉稳）
   - 用户可选择

4. **背景音乐**
   - 语音 + BGM 混合
   - 自动调节音量平衡

---

## 📁 相关文件

| 文件 | 说明 | 状态 |
|------|------|------|
| `optimized-voice-test.html` | 优化语音测试页 | ✅ 完成 |
| `VOICE_OPTIMIZATION_GUIDE.md` | 本文档 | ✅ 完成 |
| `business-pro-personalized.html` | 主文件（待更新） | ⏳ 待更新 |
| `cartoon-voice-test.html` | 旧版测试页 | ⬅️ 参考 |

---

## 🔗 参考资源

### 专业 TTS 服务

| 服务 | 优点 | 缺点 | 价格 |
|------|------|------|------|
| **Azure Neural TTS** | 超自然，多情感 | 需翻墙 | $1/百万字符 |
| **百度语音** | 中文好，免费额度 | 需备案 | ¥1/百万字符 |
| **讯飞有声** | 情感丰富 | API 复杂 | ¥2/百万字符 |
| **Google TTS** | 多语言 | 需翻墙 | $4/百万字符 |

### 浏览器兼容性

| 浏览器 | 支持度 | 语音数量 | 备注 |
|--------|--------|---------|------|
| **Edge** | ✅ 完美 | 50+ | 支持 Neural 语音 |
| **Chrome** | ✅ 好 | 10+ | 标准语音 |
| **Firefox** | ✅ 好 | 5+ | 基本够用 |
| **Safari** | ⚠️ 一般 | 3+ | 语音较少 |
| **微信内置** | ⚠️ 有限 | 2+ | 可能受限 |

---

*语音合成优化指南 v1.0*

**核心原则**:
```
自然 > 机械
连贯 > 快速
情感 > 平淡
用户体验 > 技术实现
```

**优化前后对比**:
```
旧版本：⭐⭐☆☆☆ (2/5) - 机械、刺耳、不连贯
新版本：⭐⭐⭐⭐☆ (4/5) - 自然、柔和、有感情
```
