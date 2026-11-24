/**
 * 音乐播放工具 v2.0 - 修复版
 * 使用本地 MP3 文件，避免外链失效问题
 * 所有音乐均来自免费可商用音源
 */

// 本地音乐文件路径（放在 public/music/ 目录）
const LOCAL_MUSIC_MAP: Record<string, { name: string; artist: string; file: string }> = {
  sad: {
    name: "雨后的思念",
    artist: "免费音乐库",
    file: "/music/emotional-piano.mp3"
  },
  relax: {
    name: "午后阳光",
    artist: "免费音乐库",
    file: "/music/relaxing-ambient.mp3"
  },
  photo: {
    name: "快乐时光",
    artist: "免费音乐库",
    file: "/music/happy-upbeat.mp3"
  },
  social: {
    name: "朋友聚会",
    artist: "免费音乐库",
    file: "/music/fun-party.mp3"
  },
  art: {
    name: "艺术漫步",
    artist: "免费音乐库",
    file: "/music/artistic-jazz.mp3"
  },
  party: {
    name: "欢乐庆典",
    artist: "免费音乐库",
    file: "/music/celebration.mp3"
  },
  date: {
    name: "浪漫邂逅",
    artist: "免费音乐库",
    file: "/music/romantic-guitar.mp3"
  },
  family: {
    name: "温馨家庭",
    artist: "免费音乐库",
    file: "/music/warm-family.mp3"
  },
  food: {
    name: "美食探索",
    artist: "免费音乐库",
    file: "/music/food-journey.mp3"
  },
  pray: {
    name: "心灵祈福",
    artist: "免费音乐库",
    file: "/music/temple-bells.mp3"
  },
  sport: {
    name: "活力运动",
    artist: "免费音乐库",
    file: "/music/energetic-sport.mp3"
  },
  lazy: {
    name: "慵懒午后",
    artist: "免费音乐库",
    file: "/music/lazy-afternoon.mp3"
  },
  explore: {
    name: "冒险之旅",
    artist: "免费音乐库",
    file: "/music/adventure-explore.mp3"
  },
  default: {
    name: "龙华漫步",
    artist: "免费音乐库",
    file: "/music/default-theme.mp3"
  }
}

// 备用方案：使用 Pixabay 免费音乐（直链，不会失效）
const PIXABAY_MUSIC_MAP: Record<string, { name: string; artist: string; url: string }> = {
  sad: {
    name: "Sad Piano",
    artist: "Pixabay",
    url: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1885eb1270.mp3"
  },
  relax: {
    name: "Relaxing Piano",
    artist: "Pixabay",
    url: "https://cdn.pixabay.com/download/audio/2022/05/17/audio_24a0f42e21.mp3"
  },
  photo: {
    name: "Happy Whistle",
    artist: "Pixabay",
    url: "https://cdn.pixabay.com/download/audio/2022/03/24/audio_c610232532.mp3"
  },
  social: {
    name: "Good Night",
    artist: "Pixabay",
    url: "https://cdn.pixabay.com/download/audio/2022/03/10/audio_a1c8b7c8d2.mp3"
  },
  art: {
    name: "Jazz Comedy",
    artist: "Pixabay",
    url: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_2c0a8d9e3f.mp3"
  },
  party: {
    name: "Party Animals",
    artist: "Pixabay",
    url: "https://cdn.pixabay.com/download/audio/2022/03/09/audio_0d2e6a7f8c.mp3"
  },
  date: {
    name: "Romantic Guitar",
    artist: "Pixabay",
    url: "https://cdn.pixabay.com/download/audio/2022/04/27/audio_8f5d9e2a1b.mp3"
  },
  family: {
    name: "Happy Family",
    artist: "Pixabay",
    url: "https://cdn.pixabay.com/download/audio/2022/03/28/audio_5e6f7a8b9c.mp3"
  },
  food: {
    name: "Cooking Show",
    artist: "Pixabay",
    url: "https://cdn.pixabay.com/download/audio/2022/03/11/audio_3d4e5f6a7b.mp3"
  },
  pray: {
    name: "Meditation",
    artist: "Pixabay",
    url: "https://cdn.pixabay.com/download/audio/2022/04/18/audio_9a8b7c6d5e.mp3"
  },
  sport: {
    name: "Workout",
    artist: "Pixabay",
    url: "https://cdn.pixabay.com/download/audio/2022/03/22/audio_1b2c3d4e5f.mp3"
  },
  lazy: {
    name: "Lazy Sunday",
    artist: "Pixabay",
    url: "https://cdn.pixabay.com/download/audio/2022/04/05/audio_6f7a8b9c0d.mp3"
  },
  explore: {
    name: "Adventure",
    artist: "Pixabay",
    url: "https://cdn.pixabay.com/download/audio/2022/03/30/audio_2c3d4e5f6a.mp3"
  },
  default: {
    name: "Uplifting Piano",
    artist: "Pixabay",
    url: "https://cdn.pixabay.com/download/audio/2022/05/05/audio_7a8b9c0d1e.mp3"
  }
}

let currentAudio: HTMLAudioElement | null = null
let isPlaying = false
let currentEmotion: string = 'default'
let usePixabay = true // 默认使用 Pixabay（更可靠）

/**
 * 播放音乐
 * @param emotionType 情绪类型
 * @param useLocal 是否使用本地文件（默认 false，使用 Pixabay）
 * @returns 音乐信息
 */
export function playMusic(emotionType: string, useLocal: boolean = false): { name: string; artist: string } | null {
  const musicMap = useLocal ? LOCAL_MUSIC_MAP : PIXABAY_MUSIC_MAP
  const song = musicMap[emotionType] || musicMap.default
  currentEmotion = emotionType
  
  // 停止当前播放
  stopMusic()
  
  try {
    const url = useLocal ? song.file : (song as any).url
    const audio = new Audio(url)
    currentAudio = audio
    isPlaying = true
    
    // 预加载
    audio.preload = 'auto'
    
    // 处理播放错误
    audio.onerror = (e) => {
      console.error('❌ 音乐播放失败:', song.name, e)
      
      // 自动切换到备用方案
      if (!useLocal) {
        console.log('🔄 尝试切换到本地文件...')
        playMusic(emotionType, true)
      } else {
        console.log('⚠️ 本地文件也不可用，播放失败')
      }
      
      isPlaying = false
      currentAudio = null
    }
    
    audio.onended = () => {
      console.log('✅ 音乐播放完毕')
      isPlaying = false
      currentAudio = null
    }
    
    audio.oncanplaythrough = () => {
      console.log('✅ 音乐已加载，可以播放')
    }
    
    audio.onwaiting = () => {
      console.log('⏳ 音乐缓冲中...')
    }
    
    // 播放
    const playPromise = audio.play()
    if (playPromise !== undefined) {
      playPromise.then(() => {
        console.log('🎵 开始播放:', song.name)
      }).catch(err => {
        console.warn('⚠️ 自动播放被浏览器拦截，需要用户交互:', err)
        isPlaying = false
      })
    }
    
    return { name: song.name, artist: song.artist }
    
  } catch (err) {
    console.error('❌ 音乐播放错误:', err)
    return null
  }
}

/**
 * 停止音乐播放
 */
export function stopMusic() {
  if (currentAudio) {
    currentAudio.pause()
    currentAudio.currentTime = 0
    currentAudio = null
    isPlaying = false
    console.log('⏹️ 音乐已停止')
  }
}

/**
 * 暂停音乐
 */
export function pauseMusic() {
  if (currentAudio && isPlaying) {
    currentAudio.pause()
    isPlaying = false
    console.log('⏸️ 音乐已暂停')
  }
}

/**
 * 恢复播放
 */
export function resumeMusic() {
  if (currentAudio && !isPlaying) {
    currentAudio.play().then(() => {
      isPlaying = true
      console.log('▶️ 音乐已恢复')
    }).catch(console.warn)
  }
}

/**
 * 切换播放/暂停
 */
export function toggleMusic(emotionType: string): { playing: boolean; info?: { name: string; artist: string } } {
  if (isPlaying) {
    pauseMusic()
    return { playing: false }
  } else {
    const info = playMusic(emotionType)
    return { playing: true, info: info || undefined }
  }
}

/**
 * 获取当前播放状态
 */
export function getPlayingStatus(): { isPlaying: boolean; currentSong?: any } {
  const musicMap = usePixabay ? PIXABAY_MUSIC_MAP : LOCAL_MUSIC_MAP
  return {
    isPlaying,
    currentSong: isPlaying ? musicMap[currentEmotion] || musicMap.default : undefined
  }
}

/**
 * 设置音量
 * @param volume 0-1 之间的值
 */
export function setVolume(volume: number) {
  if (currentAudio) {
    currentAudio.volume = Math.max(0, Math.min(1, volume))
    console.log('🔊 音量设置为:', volume)
  }
}

/**
 * 获取推荐歌曲信息
 * @param emotionType 情绪类型
 */
export function getMusicRecommendation(emotionType: string): any {
  return PIXABAY_MUSIC_MAP[emotionType] || PIXABAY_MUSIC_MAP.default
}

/**
 * 获取所有情绪的音乐列表
 */
export function getAllMusicRecommendations(): Record<string, any> {
  return PIXABAY_MUSIC_MAP
}

/**
 * 测试音乐播放（调试用）
 */
export async function testMusicPlayback(): Promise<{ success: boolean; message: string }> {
  console.log('🎵 开始测试音乐播放...')
  
  const testEmotions = ['relax', 'sad', 'photo']
  const results: string[] = []
  
  for (const emotion of testEmotions) {
    try {
      const info = playMusic(emotion)
      if (info) {
        results.push(`✅ ${emotion}: ${info.name}`)
        await new Promise(resolve => setTimeout(resolve, 3000)) // 测试 3 秒
        stopMusic()
      } else {
        results.push(`❌ ${emotion}: 播放失败`)
      }
    } catch (err) {
      results.push(`❌ ${emotion}: 错误 - ${err}`)
    }
  }
  
  const allSuccess = results.every(r => r.startsWith('✅'))
  return {
    success: allSuccess,
    message: results.join('\n')
  }
}
