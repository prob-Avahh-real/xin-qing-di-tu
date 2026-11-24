/**
 * 生动情感 TTS 语音系统 v2.0
 * 使用情感语调 + 智能断句 + 音效，让语音像真人一样生动
 */

let synth: SpeechSynthesis | null = null
let currentUtterance: SpeechSynthesisUtterance | null = null
let isSpeaking = false
let audioContext: AudioContext | null = null

// 🎭 情感预设配置
const EMOTION_PROFILES = {
  // EMO 治愈 - 温柔缓慢，像安慰朋友
  sad: {
    rate: 0.75,      // 慢
    pitch: 0.95,     // 低沉
    volume: 0.8,     // 轻柔
    pauses: 800,     // 长停顿
    tone: 'gentle'   // 温柔
  },
  
  // 散心放松 - 平缓舒适
  relax: {
    rate: 0.8,
    pitch: 1.0,
    volume: 0.75,
    pauses: 600,
    tone: 'calm'
  },
  
  // 拍照打卡 - 欢快兴奋
  photo: {
    rate: 1.0,       // 正常偏快
    pitch: 1.2,      // 高昂
    volume: 0.9,
    pauses: 400,     // 短停顿
    tone: 'excited'
  },
  
  // 聚会玩乐 - 热闹活泼
  social: {
    rate: 1.05,
    pitch: 1.25,
    volume: 0.95,
    pauses: 350,
    tone: 'energetic'
  },
  
  // 文艺之旅 - 知性优雅
  art: {
    rate: 0.85,
    pitch: 1.05,
    volume: 0.8,
    pauses: 700,
    tone: 'elegant'
  },
  
  // 约会浪漫 - 温柔甜蜜
  date: {
    rate: 0.78,
    pitch: 1.15,
    volume: 0.75,
    pauses: 750,
    tone: 'romantic'
  },
  
  // 亲子游 - 活泼亲切
  family: {
    rate: 0.9,
    pitch: 1.2,
    volume: 0.85,
    pauses: 500,
    tone: 'friendly'
  },
  
  // 美食探索 - 兴奋期待
  food: {
    rate: 0.95,
    pitch: 1.18,
    volume: 0.9,
    pauses: 450,
    tone: 'enthusiastic'
  },
  
  // 祈福许愿 - 庄重虔诚
  pray: {
    rate: 0.7,       // 很慢
    pitch: 0.9,      // 低沉
    volume: 0.7,     // 轻柔
    pauses: 1000,    // 很长停顿
    tone: 'reverent'
  },
  
  // 运动健身 - 活力激励
  sport: {
    rate: 1.1,       // 快
    pitch: 1.3,      // 很高
    volume: 1.0,
    pauses: 300,     // 很短停顿
    tone: 'motivational'
  },
  
  // 躺平休闲 - 慵懒随意
  lazy: {
    rate: 0.75,
    pitch: 0.95,
    volume: 0.7,
    pauses: 900,
    tone: 'laidback'
  },
  
  // 探索发现 - 好奇期待
  explore: {
    rate: 0.9,
    pitch: 1.15,
    volume: 0.85,
    pauses: 550,
    tone: 'curious'
  }
}

// 🎵 音效配置（使用 Web Audio API）
const SOUND_EFFECTS = {
  ding: [523.25, 659.25, 783.99],  // 叮～咚～（C 大调和弦）
  sparkle: [880, 987.77, 1046.50, 1174.66], // 闪烁音效
  soft: [440, 523.25], // 柔和提示
  success: [523.25, 659.25, 783.99, 1046.50] // 成功音效
}

/**
 * 智能断句 - 让语音有呼吸感
 */
function smartSplit(text: string): string[] {
  // 按句号、感叹号、问号分割
  const sentences = text.split(/([。！？!?])/g)
    .map(s => s.trim())
    .filter(s => s.length > 0)
  
  const result: string[] = []
  for (let i = 0; i < sentences.length; i += 2) {
    const sentence = sentences[i] + (sentences[i+1] || '')
    if (sentence.length > 0) {
      result.push(sentence)
    }
  }
  
  return result
}

/**
 * 为文本添加情感标记（用于调整语调）
 */
function addEmotionMarkers(text: string, emotion: string): string {
  const profile = EMOTION_PROFILES[emotion as keyof typeof EMOTION_PROFILES]
  
  if (!profile) return text
  
  // 根据情感添加语气词
  const prefixes = {
    sad: '嗯... ',
    relax: '呼～ ',
    photo: '哇！',
    social: '嘿！',
    art: '你看，',
    date: '亲爱的，',
    family: '小朋友们，',
    food: '哇塞！',
    pray: '阿弥陀佛，',
    sport: '加油！',
    lazy: '嗯～',
    explore: '你知道吗？'
  }
  
  const prefix = prefixes[emotion as keyof typeof prefixes] || ''
  return prefix + text
}

/**
 * 播放简单的音效（使用 Web Audio API）
 */
function playSoundEffect(effectName: keyof typeof SOUND_EFFECTS) {
  try {
    if (!audioContext) {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    
    const frequencies = SOUND_EFFECTS[effectName]
    const now = audioContext.currentTime
    
    frequencies.forEach((freq, index) => {
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.value = freq
      oscillator.type = 'sine'
      
      const startTime = now + index * 0.15
      gainNode.gain.setValueAtTime(0.1, startTime)
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3)
      
      oscillator.start(startTime)
      oscillator.stop(startTime + 0.3)
    })
  } catch (err) {
    console.warn('音效播放失败:', err)
  }
}

/**
 * 播放生动情感 TTS
 * @param text 要播报的文本
 * @param emotion 情感类型（sad, relax, photo, etc.）
 * @param options 额外选项
 */
export function playEmotionalTTS(
  text: string,
  emotion: string = 'relax',
  options: {
    withSoundEffect?: boolean
    withPrefix?: boolean
    emphasize?: string[] // 需要强调的词
  } = {}
) {
  const synthesis = window.speechSynthesis
  if (!synthesis) {
    console.warn('浏览器不支持语音合成')
    return false
  }
  
  // 停止当前播报
  stopTTS()
  
  // 获取情感配置
  const profile = EMOTION_PROFILES[emotion as keyof typeof EMOTION_PROFILES] || EMOTION_PROFILES.relax
  
  // 播放开场音效
  if (options.withSoundEffect) {
    playSoundEffect('ding')
  }
  
  // 添加情感前缀
  const fullText = options.withPrefix ? addEmotionMarkers(text, emotion) : text
  
  // 智能断句
  const sentences = smartSplit(fullText)
  
  // 创建语音序列
  let delay = 0
  sentences.forEach((sentence, index) => {
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(sentence)
      utterance.lang = 'zh-CN'
      utterance.rate = profile.rate
      utterance.pitch = profile.pitch
      utterance.volume = profile.volume
      
      // 选择适合的语音
      const voices = synthesis.getVoices()
      const preferredVoice = voices.find(voice => 
        voice.lang === 'zh-CN' && 
        (voice.name.includes('Tingting') || 
         voice.name.includes('Xiaoxiao') || 
         voice.name.includes('Huihui') ||
         voice.name.includes('女性'))
      )
      
      if (preferredVoice) {
        utterance.voice = preferredVoice
      }
      
      // 强调特定词汇（通过提高音调）
      if (options.emphasize) {
        options.emphasize.forEach(word => {
          if (sentence.includes(word)) {
            utterance.pitch = profile.pitch + 0.2
          }
        })
      }
      
      synthesis.speak(utterance)
    }, delay)
    
    // 计算下一句的延迟（根据句子长度和情感）
    const sentenceLength = sentence.length
    const baseDelay = sentenceLength * 100 // 每个字 100ms
    const pauseTime = profile.pauses
    delay += baseDelay + pauseTime
  })
  
  // 播放结束音效
  setTimeout(() => {
    if (options.withSoundEffect) {
      playSoundEffect('soft')
    }
  }, delay)
  
  return true
}

/**
 * 讲故事的语音模式（更生动）
 */
export function tellStory(
  story: string,
  options: {
    emotion?: string
    character?: string // '龙龙' or '福来'
    withEffects?: boolean
  } = {}
) {
  const emotion = options.emotion || 'relax'
  const character = options.character || '龙龙'
  
  // 开场白
  const intro = character === '龙龙' 
    ? '你好呀，我是龙龙～让我给你讲讲这里的故事吧。'
    : '喵～我是福来，让我告诉你一个秘密哦。'
  
  // 播放开场音效
  if (options.withEffects) {
    playSoundEffect('sparkle')
  }
  
  // 先播报开场白
  playEmotionalTTS(intro, emotion, {
    withSoundEffect: false,
    withPrefix: true
  })
  
  // 延迟后播报故事
  setTimeout(() => {
    playEmotionalTTS(story, emotion, {
      withSoundEffect: false,
      withPrefix: false
    })
  }, 3000)
}

/**
 * 景点介绍（生动版）
 */
export function announcePOI(
  poiName: string,
  description: string,
  emotion: string = 'relax'
) {
  const text = `${poiName}。${description}`
  
  return playEmotionalTTS(text, emotion, {
    withSoundEffect: true,
    withPrefix: true,
    emphasize: [poiName]
  })
}

/**
 * 停止 TTS
 */
export function stopTTS() {
  const synthesis = window.speechSynthesis
  if (synthesis) {
    synthesis.cancel()
  }
}

/**
 * 暂停 TTS
 */
export function pauseTTS() {
  const synthesis = window.speechSynthesis
  if (synthesis && synthesis.speaking && !synthesis.paused) {
    synthesis.pause()
  }
}

/**
 * 恢复 TTS
 */
export function resumeTTS() {
  const synthesis = window.speechSynthesis
  if (synthesis && synthesis.paused) {
    synthesis.resume()
  }
}

/**
 * 测试不同情感的语音
 */
export function testAllEmotions() {
  const emotions = Object.keys(EMOTION_PROFILES)
  let delay = 0
  
  emotions.forEach((emotion, index) => {
    setTimeout(() => {
      const text = `这是${emotion}情感的语音测试。你觉得好听吗？`
      playEmotionalTTS(text, emotion, {
        withSoundEffect: index === 0,
        withPrefix: true
      })
    }, delay)
    
    delay += 4000 // 每个情感 4 秒
  })
  
  return {
    totalEmotions: emotions.length,
    estimatedDuration: delay / 1000
  }
}

/**
 * 获取情感配置
 */
export function getEmotionProfile(emotion: string) {
  return EMOTION_PROFILES[emotion as keyof typeof EMOTION_PROFILES] || EMOTION_PROFILES.relax
}

/**
 * 获取所有可用情感
 */
export function getAllEmotions(): string[] {
  return Object.keys(EMOTION_PROFILES)
}
