/**
 * TTS 语音导览工具 - 使用 Web Speech API
 * 支持自然语音播报景点介绍
 */

let synth: SpeechSynthesis | null = null
let currentUtterance: SpeechSynthesisUtterance | null = null
let isSpeaking = false

/**
 * 初始化语音合成
 */
function initSynth() {
  if (!synth) {
    synth = window.speechSynthesis
  }
  return synth
}

/**
 * 播放自然语音 TTS
 * @param text 要播报的文本
 * @param options 语音选项
 */
export function playTTS(
  text: string,
  options: {
    lang?: string
    rate?: number
    pitch?: number
    volume?: number
    preferFemale?: boolean
  } = {}
) {
  const synthesis = initSynth()
  
  if (!synthesis) {
    console.warn('浏览器不支持语音合成')
    return false
  }
  
  // 停止当前播报
  stopTTS()
  
  const utterance = new SpeechSynthesisUtterance(text)
  currentUtterance = utterance
  isSpeaking = true
  
  // 设置参数
  utterance.lang = options.lang || 'zh-CN'
  utterance.rate = options.rate || 0.85  // 稍慢一点更温柔
  utterance.pitch = options.pitch || 1.1  // 稍高一点更亲切
  utterance.volume = options.volume || 1
  
  // 尝试选择自然的女声
  const setVoice = () => {
    const voices = synthesis.getVoices()
    
    if (options.preferFemale !== false) {
      // 优先选择中文女声
      const preferredVoice = voices.find(voice => 
        voice.lang === 'zh-CN' && 
        (voice.name.includes('Tingting') || 
         voice.name.includes('Xiaoxiao') || 
         voice.name.includes('Huihui') ||
         voice.name.includes('女性') ||
         voice.name.includes('Female'))
      )
      
      if (preferredVoice) {
        utterance.voice = preferredVoice
      }
    }
    
    // 开始播报
    synthesis.speak(utterance)
  }
  
  // 处理语音列表加载（部分浏览器需要异步）
  const voices = synthesis.getVoices()
  if (voices.length === 0) {
    synthesis.onvoiceschanged = () => {
      setVoice()
    }
  } else {
    setVoice()
  }
  
  // 播报结束回调
  utterance.onend = () => {
    isSpeaking = false
    currentUtterance = null
  }
  
  // 播报错误回调
  utterance.onerror = (event) => {
    console.error('TTS 播报错误:', event)
    isSpeaking = false
    currentUtterance = null
  }
  
  return true
}

/**
 * 停止 TTS 播报
 */
export function stopTTS() {
  const synthesis = initSynth()
  if (synthesis) {
    synthesis.cancel()
    isSpeaking = false
    currentUtterance = null
  }
}

/**
 * 暂停 TTS 播报
 */
export function pauseTTS() {
  const synthesis = initSynth()
  if (synthesis && synthesis.speaking && !synthesis.paused) {
    synthesis.pause()
  }
}

/**
 * 恢复 TTS 播报
 */
export function resumeTTS() {
  const synthesis = initSynth()
  if (synthesis && synthesis.paused) {
    synthesis.resume()
  }
}

/**
 * 切换播放/暂停
 */
export function toggleTTS(text: string): boolean {
  if (isSpeaking) {
    stopTTS()
    return false
  } else {
    return playTTS(text)
  }
}

/**
 * 获取当前播报状态
 */
export function getSpeakingStatus(): { isSpeaking: boolean; isPaused: boolean } {
  const synthesis = initSynth()
  return {
    isSpeaking: isSpeaking || (synthesis?.speaking ?? false),
    isPaused: synthesis?.paused ?? false
  }
}

/**
 * 获取可用的语音列表
 */
export function getAvailableVoices(): SpeechSynthesisVoice[] {
  const synthesis = initSynth()
  if (synthesis) {
    return synthesis.getVoices()
  }
  return []
}

/**
 * 语音播报景点介绍（简化版本）
 * @param poiName 景点名称
 * @param description 景点描述
 */
export function announcePOI(poiName: string, description: string) {
  const text = `${poiName}。${description}`
  return playTTS(text, {
    rate: 0.8,
    pitch: 1.05
  })
}

/**
 * 语音播报路线开始
 */
export function announceRouteStart(routeName: string, duration: string) {
  const text = `欢迎开启${routeName}，预计用时${duration}。让我们一起出发吧！`
  return playTTS(text, {
    rate: 0.85,
    pitch: 1.1
  })
}

/**
 * 语音播报到达提示
 */
export function announceArrival(poiName: string, stayDuration: number) {
  const text = `已到达${poiName}，建议停留${stayDuration}分钟。`
  return playTTS(text, {
    rate: 0.8,
    pitch: 1.05
  })
}
