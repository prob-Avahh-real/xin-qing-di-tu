<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import Header from './components/Header.vue'
import MapContainer from './components/MapContainer.vue'
import Sidebar from './components/Sidebar.vue'
import ARScanner from './components/ARScanner.vue'
import EggModal from './components/EggModal.vue'
import KnowledgeBase from './components/KnowledgeBase.vue'
import { useRouteStore } from './stores/route'
import { playMusic, stopMusic, pauseMusic, resumeMusic, getMusicRecommendation } from './utils/music'
import { playTTS, stopTTS, announcePOI, announceRouteStart } from './utils/tts'
import { quickShare, createPKChallenge, generatePKInvitation, generateShareText } from './utils/share'

const routeStore = useRouteStore()
const isLoading = ref(false)

// 新功能状态
const showARScanner = ref(false)
const showEggModal = ref(false)
const showKnowledgeBase = ref(false)
const eggModalConfig = ref({
  title: '',
  icon: '',
  story: '',
  location: '',
  pointsReward: 30
})
const isPlaying = ref(false)
const currentEmotion = ref('relax')
const collectedStamps = ref<number>(0)

// 自定义输入
const customQuery = ref('')

onMounted(() => {
  console.log('🐉 龙华·灵境向导 应用已启动')
  
  // 自动播放欢迎语音
  setTimeout(() => {
    playTTS('欢迎来到龙华·灵境向导，让我为你规划一条治愈路线吧', {
      rate: 0.85,
      pitch: 1.1
    })
  }, 1000)
})

onUnmounted(() => {
  // 清理资源
  stopMusic()
  stopTTS()
})

// 生成路线（带音乐和语音）
const generateRouteWithEffects = async (emotion?: string) => {
  isLoading.value = true
  
  try {
    await routeStore.generateRoute(emotion || currentEmotion.value)
    
    // 播放对应情绪的音乐
    const emotionType = emotion || currentEmotion.value
    playMusic(emotionType)
    isPlaying.value = true
    currentEmotion.value = emotionType
    
    // 语音播报路线开始
    if (routeStore.currentRoute) {
      const duration = routeStore.routeDuration
      announceRouteStart(routeStore.currentRoute.theme, duration)
    }
    
    // 显示第一个景点的彩蛋（如果有）
    if (routeStore.currentRoute?.points[0]?.hiddenTip) {
      setTimeout(() => {
        showEgg({
          title: '✨ 隐藏彩蛋',
          icon: '🎁',
          story: routeStore.currentRoute!.points[0].hiddenTip!,
          location: routeStore.currentRoute!.points[0].name,
          pointsReward: 20
        })
      }, 2000)
    }
    
  } catch (error) {
    console.error('生成路线失败:', error)
  } finally {
    isLoading.value = false
  }
}

// 智能生成路线（AI Agent）
const smartGenerateRoute = async () => {
  if (!customQuery.value.trim()) {
    playTTS('请先告诉我你的心情或需求吧', { rate: 0.9 })
    return
  }
  
  isLoading.value = true
  
  try {
    await routeStore.smartGenerateRoute(customQuery.value)
    
    // 播放音乐
    playMusic('relax')
    isPlaying.value = true
    
    // 语音确认
    playTTS('好的，我已经为你规划了一条专属路线', {
      rate: 0.85,
      pitch: 1.1
    })
    
    customQuery.value = ''
    
  } catch (error) {
    console.error('智能推荐失败:', error)
    playTTS('抱歉，推荐失败了，请再试一次')
  } finally {
    isLoading.value = false
  }
}

// 切换音乐播放
const toggleMusic = () => {
  if (isPlaying.value) {
    pauseMusic()
    isPlaying.value = false
  } else {
    resumeMusic()
    isPlaying.value = true
  }
}

// 停止音乐
const stopMusicAction = () => {
  stopMusic()
  isPlaying.value = false
}

// TTS 播报景点
const announcePOIAction = (point: any) => {
  const text = `${point.name}。${point.whyItHeals || point.description}`
  playTTS(text, {
    rate: 0.8,
    pitch: 1.05
  })
}

// 分享功能
const handleShare = async () => {
  if (!routeStore.currentRoute) return
  
  const shareText = generateShareText(routeStore.currentRoute, {
    includeScore: true,
    includeLink: true
  })
  
  try {
    await navigator.clipboard.writeText(shareText)
    
    // 显示分享成功提示
    showEgg({
      title: '📤 分享成功',
      icon: '✅',
      story: '文案已复制到剪贴板，快去朋友圈发布吧！',
      location: '',
      pointsReward: 10
    })
    
  } catch (error) {
    console.error('分享失败:', error)
  }
}

// PK 挑战
const handlePK = () => {
  if (!routeStore.currentRoute) return
  
  const pk = createPKChallenge(routeStore.currentRoute, '好友')
  const invitation = generatePKInvitation(pk, '好友')
  
  // 复制 PK 邀请
  navigator.clipboard.writeText(invitation)
  
  showEgg({
    title: pk.title,
    icon: '🏆',
    story: `${pk.description}\n\n${pk.rules.join('\n')}`,
    location: pk.reward,
    pointsReward: 15
  })
}

// 显示彩蛋
const showEgg = (config: typeof eggModalConfig.value) => {
  eggModalConfig.value = config
  showEggModal.value = true
}

// 查看猫彩蛋
const showCatEgg = () => {
  showEgg({
    title: '🐱 龙华寺猫彩蛋',
    icon: '🐱',
    story: '寺里有只大橘猫叫"福来"，摸它耳朵会有好运。摸左耳招桃花，摸右耳招财运。',
    location: '龙华寺天王殿右侧石阶',
    pointsReward: 30
  })
}

// AR 印章收集
const handleStampCollected = (stamp: any) => {
  collectedStamps.value += 1
  
  showEgg({
    title: '🎉 印章收集成功',
    icon: stamp.icon,
    story: `获得【${stamp.name}】印章`,
    location: stamp.description || '',
    pointsReward: 30
  })
  
  // 检查是否收集完成（10 个印章）
  if (collectedStamps.value >= 10) {
    setTimeout(() => {
      showEgg({
        title: '🏆 收集大师',
        icon: '👑',
        story: '恭喜集齐所有 10 枚印章！获得"龙华探索者"荣誉称号！',
        location: '奖励：西岸美式咖啡免费券 + 龙华寺素面券',
        pointsReward: 100
      })
    }, 1000)
  }
}

// 选择情绪类别
const selectEmotion = (emotion: string) => {
  currentEmotion.value = emotion
  routeStore.selectedCategories = [emotion]
}
</script>

<template>
  <div class="app-container">
    <Header />
    
    <main class="container mx-auto px-4 py-6">
      <!-- 欢迎标语 -->
      <div class="welcome-banner mb-6">
        <h2 class="text-2xl font-bold text-primary-700 mb-2">
          🐉 龙华·灵境向导
        </h2>
        <p class="text-gray-600">懂你心情的龙华出行搭子，AI 生成情绪治愈路线</p>
      </div>
      
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- 左侧控制面板 -->
        <div class="lg:col-span-1">
          <div class="card p-6">
            <h3 class="text-lg font-semibold mb-4">🎯 选择心情</h3>
            
            <!-- 情绪按钮 -->
            <div class="emotion-buttons mb-4">
              <button
                v-for="cat in routeStore.categories.slice(0, 5)"
                :key="cat.id"
                @click="selectEmotion(cat.id)"
                :class="['emotion-btn', { active: currentEmotion === cat.id }]"
              >
                {{ cat.icon }} {{ cat.name }}
              </button>
            </div>
            
            <!-- 自定义输入 -->
            <div class="custom-input mb-4">
              <input
                v-model="customQuery"
                type="text"
                placeholder="或者告诉我你的心情..."
                class="w-full px-4 py-3 border-2 border-primary-200 rounded-2xl focus:border-primary-500 focus:outline-none"
                @keyup.enter="smartGenerateRoute"
              />
            </div>
            
            <!-- 生成按钮 -->
            <button
              @click="generateRouteWithEffects()"
              class="w-full py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all mb-3"
            >
              ✨ 生成我的情绪路线
            </button>
            
            <button
              @click="smartGenerateRoute"
              class="w-full py-3 bg-gradient-to-r from-secondary-500 to-secondary-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              🤖 AI 智能推荐
            </button>
            
            <!-- 功能入口 -->
            <div class="mt-6 pt-6 border-t border-gray-200">
              <h4 class="text-sm font-semibold text-gray-700 mb-3">🎮 更多玩法</h4>
              
              <div class="space-y-2">
                <button
                  @click="showKnowledgeBase = true"
                  class="w-full py-2 bg-blue-100 text-blue-700 rounded-xl font-medium hover:bg-blue-200 transition-colors flex items-center justify-center gap-2"
                >
                  📚 龙华知识库
                </button>
                
                <button
                  @click="showARScanner = true"
                  class="w-full py-2 bg-primary-100 text-primary-700 rounded-xl font-medium hover:bg-primary-200 transition-colors flex items-center justify-center gap-2"
                >
                  🔍 AR 印章收集
                </button>
                
                <button
                  @click="handleShare"
                  class="w-full py-2 bg-green-100 text-green-700 rounded-xl font-medium hover:bg-green-200 transition-colors flex items-center justify-center gap-2"
                >
                  📤 分享朋友圈
                </button>
                
                <button
                  @click="handlePK"
                  class="w-full py-2 bg-orange-100 text-orange-700 rounded-xl font-medium hover:bg-orange-200 transition-colors flex items-center justify-center gap-2"
                >
                  👥 发起 PK 挑战
                </button>
                
                <button
                  @click="showCatEgg"
                  class="w-full py-2 bg-pink-100 text-pink-700 rounded-xl font-medium hover:bg-pink-200 transition-colors flex items-center justify-center gap-2"
                >
                  🐱 寻找福来猫
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 右侧地图和路线区域 -->
        <div class="lg:col-span-2">
          <!-- 地图容器 -->
          <div class="card h-[500px] overflow-hidden mb-6">
            <MapContainer />
          </div>
          
          <!-- 音乐播放器 -->
          <div v-if="routeStore.currentRoute" class="card mb-6 bg-gradient-to-r from-primary-50 to-secondary-50">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <span class="text-2xl">🎵</span>
                <div>
                  <p class="font-semibold text-gray-900">
                    {{ getMusicRecommendation(currentEmotion).name }}
                  </p>
                  <p class="text-sm text-gray-600">
                    {{ getMusicRecommendation(currentEmotion).artist }}
                  </p>
                </div>
              </div>
              
              <div class="flex items-center gap-2">
                <button
                  @click="toggleMusic"
                  class="px-4 py-2 bg-white rounded-full shadow hover:shadow-md transition-all"
                >
                  {{ isPlaying ? '⏸ 暂停' : '▶ 播放' }}
                </button>
                <button
                  @click="stopMusicAction"
                  class="px-4 py-2 bg-white rounded-full shadow hover:shadow-md transition-all"
                >
                  ⏹ 停止
                </button>
              </div>
            </div>
          </div>
          
          <!-- 路线详情 -->
          <div v-if="routeStore.currentRoute" class="card animate-slide-up">
            <!-- 路线头部 -->
            <div class="route-header mb-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-xl font-bold text-primary-700">
                  {{ routeStore.currentRoute.theme }}
                </h3>
                <div class="flex items-center gap-2">
                  <span class="text-2xl">⭐</span>
                  <span class="text-2xl font-bold text-primary-600">
                    {{ routeStore.currentRoute.experienceScore.toFixed(1) }}
                  </span>
                  <span class="text-gray-500">/10</span>
                </div>
              </div>
              
              <p class="text-gray-600 mb-4">{{ routeStore.currentRoute.emotionMatch }}</p>
              
              <!-- 统计数据 -->
              <div class="stats-grid grid grid-cols-3 gap-4">
                <div class="stat-card bg-primary-50 rounded-xl p-3 text-center">
                  <div class="text-2xl mb-1">📸</div>
                  <div class="text-sm text-gray-600">出片点</div>
                  <div class="font-bold text-primary-700">
                    {{ routeStore.currentRoute.photoSpots }}个
                  </div>
                </div>
                <div class="stat-card bg-green-50 rounded-xl p-3 text-center">
                  <div class="text-2xl mb-1">💰</div>
                  <div class="text-sm text-gray-600">预估省</div>
                  <div class="font-bold text-green-700">
                    {{ routeStore.currentRoute.totalSavings }}元
                  </div>
                </div>
                <div class="stat-card bg-orange-50 rounded-xl p-3 text-center">
                  <div class="text-2xl mb-1">🏆</div>
                  <div class="text-sm text-gray-600">获得积分</div>
                  <div class="font-bold text-orange-700">
                    {{ routeStore.currentRoute.pointsEarned }}分
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 路线点列表 -->
            <div class="space-y-4">
              <div
                v-for="(point, index) in routeStore.currentRoute.points"
                :key="point.id"
                class="poi-card"
              >
                <div class="flex items-start gap-4">
                  <!-- 序号 -->
                  <div class="flex-shrink-0 w-10 h-10 rounded-full bg-primary-100 text-primary-600 
                              flex items-center justify-center font-bold text-lg">
                    {{ index + 1 }}
                  </div>
                  
                  <!-- 内容 -->
                  <div class="flex-1">
                    <div class="flex items-center justify-between mb-2">
                      <h4 class="text-lg font-bold text-gray-900">{{ point.name }}</h4>
                      <span class="badge badge-primary">{{ point.photoScore || '⭐⭐⭐' }}</span>
                    </div>
                    
                    <p class="text-gray-600 mb-2">{{ point.whyItHeals || point.description }}</p>
                    
                    <!-- 商家优惠 -->
                    <div v-if="point.businessHook" class="mb-2">
                      <span class="inline-block px-3 py-1 bg-orange-100 text-orange-700 
                                   rounded-full text-sm font-medium">
                        🎫 {{ point.businessHook }}
                      </span>
                    </div>
                    
                    <!-- 隐藏彩蛋 -->
                    <div v-if="point.hiddenTip" class="mb-3">
                      <p class="text-sm text-primary-600 bg-primary-50 px-3 py-2 rounded-lg">
                        ✨ {{ point.hiddenTip }}
                      </p>
                    </div>
                    
                    <!-- 操作按钮 -->
                    <div class="flex items-center gap-2">
                      <button
                        @click="announcePOIAction(point)"
                        class="px-3 py-1.5 bg-primary-100 text-primary-700 rounded-full 
                               text-sm font-medium hover:bg-primary-200 transition-colors flex items-center gap-1"
                      >
                        🔊 语音导览
                      </button>
                      <span class="text-sm text-gray-500">
                        预计停留 {{ point.duration }}分钟
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 加载状态 -->
    <div v-if="isLoading" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-3xl p-10 shadow-2xl text-center">
        <div class="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 
                    border-t-primary-600 mx-auto mb-4"></div>
        <p class="text-lg text-gray-700 font-medium">
          🐉 正在召唤福来...
        </p>
        <p class="text-sm text-gray-500 mt-2">
          正在生成最佳情绪路线
        </p>
      </div>
    </div>

    <!-- AR 印章收集 -->
    <ARScanner
      v-if="showARScanner"
      @close="showARScanner = false"
      @stampCollected="handleStampCollected"
    />

    <!-- 知识库 -->
    <KnowledgeBase
      v-if="showKnowledgeBase"
      @close="showKnowledgeBase = false"
    />

    <!-- 彩蛋弹窗 -->
    <EggModal
      :isVisible="showEggModal"
      :title="eggModalConfig.title"
      :icon="eggModalConfig.icon"
      :story="eggModalConfig.story"
      :location="eggModalConfig.location"
      :pointsReward="eggModalConfig.pointsReward"
      @close="showEggModal = false"
      @confirm="showEggModal = false"
    />
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  background: linear-gradient(145deg, #fff9f5 0%, #fef4ed 100%);
  padding-bottom: 40px;
}

.container {
  max-width: 1400px;
}

.welcome-banner {
  background: rgba(255, 250, 245, 0.96);
  padding: 24px;
  border-radius: 28px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(255, 180, 140, 0.3);
}

.card {
  background: white;
  border-radius: 28px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.04);
  border: 1px solid #fff0e6;
}

.emotion-buttons {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.emotion-btn {
  padding: 12px;
  border: 2px solid #ffe0d0;
  background: white;
  border-radius: 44px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  color: #5a4a42;
}

.emotion-btn.active {
  background: #F9B572;
  color: white;
  border-color: #F9B572;
  box-shadow: 0 4px 12px rgba(249, 181, 114, 0.3);
  transform: translateY(-2px);
}

.emotion-btn:hover:not(.active) {
  border-color: #F9B572;
  transform: translateY(-2px);
}

.poi-card {
  background: #faf9f8;
  padding: 20px;
  border-radius: 24px;
  border-left: 5px solid #F9B572;
  transition: all 0.2s;
}

.poi-card:hover {
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transform: translateX(4px);
}

.badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.badge-primary {
  background: #fef3e8;
  color: #E87A5D;
}

.route-header {
  background: linear-gradient(135deg, #fef3e8 0%, #fee6d6 100%);
  padding: 24px;
  border-radius: 24px;
}

.stat-card {
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-4px);
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-up {
  animation: slide-up 0.4s ease-out;
}
</style>
