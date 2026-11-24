/**
 * 音乐播放工具 - 集成网易云音乐 API
 * 支持情绪匹配的音乐推荐和播放控制
 */

import { MUSIC_MAP, type MusicRecommendation } from '../stores/route'

let currentAudio: HTMLAudioElement | null = null
let isPlaying = false

/**
 * 播放音乐
 * @param emotionType 情绪类型 (sad, relax, photo, social, art, party)
 * @returns 音乐信息
 */
export function playMusic(emotionType: string): { name: string; artist: string } | null {
  const song = MUSIC_MAP[emotionType] || MUSIC_MAP.default
  
  // 停止当前播放
  stopMusic()
  
  try {
    const audio = new Audio(song.url)
    currentAudio = audio
    isPlaying = true
    
    // 处理播放错误
    audio.onerror = () => {
      console.warn('音乐播放失败:', song.name)
      isPlaying = false
      currentAudio = null
    }
    
    audio.onended = () => {
      isPlaying = false
      currentAudio = null
    }
    
    // 尝试播放（可能被浏览器拦截）
    audio.play().catch(err => {
      console.warn('自动播放被拦截，需要用户交互:', err)
      isPlaying = false
    })
    
    return { name: song.name, artist: song.artist }
    
  } catch (err) {
    console.error('音乐播放错误:', err)
    return null
  }
}

/**
 * 停止音乐播放
 */
export function stopMusic() {
  if (currentAudio) {
    currentAudio.pause()
    currentAudio = null
    isPlaying = false
  }
}

/**
 * 暂停音乐
 */
export function pauseMusic() {
  if (currentAudio && isPlaying) {
    currentAudio.pause()
    isPlaying = false
  }
}

/**
 * 恢复播放
 */
export function resumeMusic() {
  if (currentAudio && !isPlaying) {
    currentAudio.play().catch(console.warn)
    isPlaying = true
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
export function getPlayingStatus(): { isPlaying: boolean; currentSong?: MusicRecommendation } {
  return {
    isPlaying,
    currentSong: isPlaying ? MUSIC_MAP.default : undefined
  }
}

/**
 * 设置音量
 * @param volume 0-1 之间的值
 */
export function setVolume(volume: number) {
  if (currentAudio) {
    currentAudio.volume = Math.max(0, Math.min(1, volume))
  }
}

/**
 * 获取推荐歌曲信息
 * @param emotionType 情绪类型
 */
export function getMusicRecommendation(emotionType: string): MusicRecommendation {
  return MUSIC_MAP[emotionType] || MUSIC_MAP.default
}

/**
 * 获取所有情绪的音乐列表
 */
export function getAllMusicRecommendations(): Record<string, MusicRecommendation> {
  return MUSIC_MAP
}
