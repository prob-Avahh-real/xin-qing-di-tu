<template>
  <div v-if="isOpen" class="ar-scanner">
    <!-- 顶部导航栏 -->
    <div class="scanner-header">
      <button @click="closeScanner" class="back-btn">← 返回</button>
      <h3>🔍 AR 印章收集</h3>
    </div>

    <!-- 摄像头预览区域 -->
    <div class="camera-preview">
      <div class="scan-mask"></div>
      <div class="scan-target">
        <p>📍 对准目标区域</p>
        <p class="hint">将龙华塔/地标放入框内自动识别</p>
      </div>
      
      <!-- 扫描线动画 -->
      <div class="scan-line"></div>
    </div>

    <!-- 附近印章列表 -->
    <div class="stamp-list">
      <h4>📍 附近印章</h4>
      
      <div v-if="nearbyStamps.length === 0" class="no-stamps">
        <p>暂无附近印章</p>
        <p class="hint">移动到景点附近试试</p>
      </div>
      
      <div v-else class="stamps-container">
        <div 
          v-for="(stamp, index) in nearbyStamps" 
          :key="stamp.id"
          class="stamp-item"
          :class="{ collected: stamp.collected }"
        >
          <div class="stamp-info">
            <span class="stamp-icon">{{ stamp.icon }}</span>
            <div class="stamp-details">
              <span class="stamp-name">{{ stamp.name }}</span>
              <span class="stamp-distance">{{ stamp.distance }}米</span>
            </div>
          </div>
          
          <button 
            v-if="!stamp.collected"
            @click="scanStamp(stamp)"
            class="scan-btn"
          >
            扫描
          </button>
          <span v-else class="collected-badge">✓ 已收集</span>
        </div>
      </div>
    </div>

    <!-- 扫描成功弹窗 -->
    <div v-if="showSuccessModal" class="modal-overlay" @click="closeSuccessModal">
      <div class="success-modal" @click.stop>
        <div class="success-icon">🎉</div>
        <h3>AR 印章收集成功！</h3>
        <p class="stamp-name-large">{{ currentStamp?.name }}</p>
        <div class="stamp-preview">{{ currentStamp?.icon }}</div>
        <p class="points-reward">🏆 +{{ pointsReward }} 积分</p>
        <button @click="closeSuccessModal" class="continue-btn">继续探索</button>
      </div>
    </div>

    <!-- 收集进度 -->
    <div class="collection-progress">
      <div class="progress-header">
        <span>收集进度</span>
        <span>{{ collectedCount }}/{{ totalStamps }}</span>
      </div>
      <div class="progress-bar">
        <div 
          class="progress-fill"
          :style="{ width: `${(collectedCount / totalStamps) * 100}%` }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

// 印章数据
interface Stamp {
  id: string
  name: string
  icon: string
  distance: number
  collected: boolean
  location: [number, number]
  description?: string
}

//  Props
defineProps<{
  userLocation?: [number, number]
}>()

// Emits
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'stampCollected', stamp: Stamp): void
}>()

// 状态
const isOpen = ref(true)
const showSuccessModal = ref(false)
const currentStamp = ref<Stamp | null>(null)
const pointsReward = ref(30)

// 印章数据（龙华地区）
const nearbyStamps = ref<Stamp[]>([
  {
    id: 'stamp_longhua_temple',
    name: '龙华塔影',
    icon: '🏯',
    distance: 3,
    collected: false,
    location: [121.4500, 31.1830],
    description: '千年龙华塔的绝美倒影'
  },
  {
    id: 'stamp_shadow_space',
    name: '塔影空间',
    icon: '✨',
    distance: 15,
    collected: false,
    location: [121.4512, 31.1815],
    description: '水下金色穹顶'
  },
  {
    id: 'stamp_oil_tank',
    name: '油罐艺术',
    icon: '🎨',
    distance: 28,
    collected: false,
    location: [121.4550, 31.1790],
    description: '工业风艺术空间'
  },
  {
    id: 'stamp_west_museum',
    name: '龙美术馆',
    icon: '🖼️',
    distance: 35,
    collected: false,
    location: [121.4580, 31.1800],
    description: '工业风文艺场馆'
  },
  {
    id: 'stamp_west_bund',
    name: '西岸滨江',
    icon: '🌅',
    distance: 50,
    collected: false,
    location: [121.4600, 31.1720],
    description: '黄浦江畔日落美景'
  },
  {
    id: 'stamp_martyr_park',
    name: '龙华烈士',
    icon: '🕊️',
    distance: 18,
    collected: false,
    location: [121.4475, 31.1850],
    description: '缅怀先烈的红色教育基地'
  },
  {
    id: 'stamp_longhua_park',
    name: '龙华公园',
    icon: '🌳',
    distance: 12,
    collected: false,
    location: [121.4510, 31.1825],
    description: '城市绿肺，居民休闲好去处'
  },
  {
    id: 'stamp_cultural_plaza',
    name: '文化广场',
    icon: '🎭',
    distance: 10,
    collected: false,
    location: [121.4495, 31.1835],
    description: '龙华文化活动中心'
  },
  {
    id: 'stamp_west_bund_green',
    name: '滨江绿地',
    icon: '🚴',
    distance: 45,
    collected: false,
    location: [121.4620, 31.1750],
    description: '黄浦江畔生态绿地'
  },
  {
    id: 'stamp_poly_west_bank',
    name: '保利西岸',
    icon: '🛍️',
    distance: 40,
    collected: false,
    location: [121.4570, 31.1710],
    description: '滨江商业综合体'
  }
])

// 计算属性
const collectedCount = computed(() => {
  return nearbyStamps.value.filter(s => s.collected).length
})

const totalStamps = computed(() => nearbyStamps.value.length)

// 扫描印章
function scanStamp(stamp: Stamp) {
  // 模拟扫描过程
  setTimeout(() => {
    stamp.collected = true
    currentStamp.value = stamp
    showSuccessModal.value = true
    
    // 发送收集事件
    emit('stampCollected', stamp)
  }, 800)
}

// 关闭扫描器
function closeScanner() {
  isOpen.value = false
  emit('close')
}

// 关闭成功弹窗
function closeSuccessModal() {
  showSuccessModal.value = false
  currentStamp.value = null
}

// 模拟定位更新（实际应该用 GPS）
function updateNearbyStamps() {
  // 这里可以接入真实 GPS 定位
  // 根据距离排序，显示最近的印章
  nearbyStamps.value.sort((a, b) => a.distance - b.distance)
}

// 生命周期
onMounted(() => {
  updateNearbyStamps()
  
  // 模拟定期更新附近印章
  const interval = setInterval(updateNearbyStamps, 5000)
  
  onUnmounted(() => {
    clearInterval(interval)
  })
})
</script>

<style scoped>
.ar-scanner {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #fef4ef;
  z-index: 1100;
  display: flex;
  flex-direction: column;
}

.scanner-header {
  padding: 20px;
  background: rgba(249, 181, 114, 0.95);
  color: white;
  display: flex;
  align-items: center;
  gap: 16px;
  border-radius: 0 0 28px 28px;
}

.back-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
}

.scanner-header h3 {
  flex: 1;
  font-size: 1.2rem;
}

.camera-preview {
  width: 100%;
  height: 55%;
  background: repeating-linear-gradient(
    45deg,
    #f2e3d8 0px,
    #f2e3d8 20px,
    #f8ede3 20px,
    #f8ede3 40px
  );
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.scan-mask {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
  border: 3px solid #F9B572;
  border-radius: 28px;
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5);
  animation: pulse-border 2s infinite;
}

@keyframes pulse-border {
  0%, 100% { border-color: #F9B572; }
  50% { border-color: #ffb347; }
}

.scan-line {
  position: absolute;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, transparent, #F9B572, transparent);
  animation: scan-move 2s linear infinite;
}

@keyframes scan-move {
  0% { top: 0%; }
  100% { top: 100%; }
}

.scan-target {
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  text-align: center;
  color: #a58468;
}

.scan-target p {
  margin: 4px 0;
}

.hint {
  font-size: 0.85rem;
  opacity: 0.8;
}

.stamp-list {
  background: white;
  margin: 20px;
  border-radius: 32px;
  padding: 20px;
  flex: 1;
  overflow-y: auto;
}

.stamp-list h4 {
  margin-bottom: 16px;
  color: #5a4a42;
  font-size: 1.1rem;
}

.no-stamps {
  text-align: center;
  padding: 40px 20px;
  color: #a58468;
}

.no-stamps .hint {
  font-size: 0.85rem;
  margin-top: 8px;
  opacity: 0.7;
}

.stamps-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.stamp-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #fee3d0;
}

.stamp-item.collected {
  opacity: 0.6;
}

.stamp-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.stamp-icon {
  font-size: 1.8rem;
}

.stamp-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stamp-name {
  font-weight: 600;
  color: #5a4a42;
}

.stamp-distance {
  font-size: 0.8rem;
  color: #a58468;
}

.scan-btn {
  background: #F9B572;
  border: none;
  padding: 6px 16px;
  border-radius: 40px;
  font-size: 0.85rem;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.scan-btn:hover {
  background: #f4a25e;
  transform: scale(1.05);
}

.collected-badge {
  color: #7EAA92;
  font-weight: 600;
  font-size: 0.85rem;
}

/* 成功弹窗 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1200;
  animation: fade-in 0.3s ease;
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.success-modal {
  background: white;
  width: 85%;
  max-width: 320px;
  border-radius: 36px;
  padding: 32px 24px;
  text-align: center;
  animation: slide-up 0.3s ease;
}

@keyframes slide-up {
  from { transform: translateY(40px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.success-icon {
  font-size: 4rem;
  margin-bottom: 16px;
}

.success-modal h3 {
  color: #E87A5D;
  font-size: 1.4rem;
  margin-bottom: 12px;
}

.stamp-name-large {
  font-size: 1.2rem;
  font-weight: 600;
  color: #5a4a42;
  margin-bottom: 16px;
}

.stamp-preview {
  font-size: 5rem;
  margin: 20px 0;
}

.points-reward {
  color: #F9B572;
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 24px;
}

.continue-btn {
  background: #F9B572;
  border: none;
  padding: 12px 32px;
  border-radius: 40px;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  width: 100%;
}

/* 收集进度 */
.collection-progress {
  background: white;
  margin: 0 20px 20px;
  border-radius: 24px;
  padding: 16px 20px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 0.9rem;
  color: #5a4a42;
  font-weight: 600;
}

.progress-bar {
  height: 8px;
  background: #fee3d0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #F9B572, #f4a25e);
  transition: width 0.5s ease;
}
</style>
