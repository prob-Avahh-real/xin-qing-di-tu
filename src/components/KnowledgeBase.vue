<template>
  <div class="knowledge-base">
    <!-- 顶部导航 -->
    <div class="kb-header">
      <button @click="closeKB" class="back-btn">← 返回</button>
      <h2>📚 龙华知识库</h2>
      <button @click="toggleSearch" class="search-btn">🔍</button>
    </div>

    <!-- 搜索框 -->
    <div v-if="showSearch" class="search-bar">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="搜索龙华历史、美食、打卡点..."
        class="search-input"
      />
    </div>

    <!-- 分类标签 -->
    <div class="kb-tabs">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        :class="['kb-tab', { active: activeTab === tab.id }]"
      >
        {{ tab.icon }} {{ tab.name }}
      </button>
    </div>

    <!-- 内容区域 -->
    <div class="kb-content">
      <!-- 历史时间线 -->
      <div v-if="activeTab === 'history'" class="timeline-section">
        <h3 class="section-title">📜 龙华历史时间线</h3>
        <div class="timeline">
          <div
            v-for="event in timelineEvents"
            :key="event.year"
            class="timeline-item"
          >
            <div class="timeline-marker">
              <span class="timeline-year">{{ event.year }}</span>
            </div>
            <div class="timeline-content">
              <h4>{{ event.title }}</h4>
              <p>{{ event.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 人文故事 -->
      <div v-if="activeTab === 'culture'" class="culture-section">
        <h3 class="section-title">🎭 龙华人文故事</h3>
        
        <!-- 福来猫 -->
        <div class="story-card cat-card">
          <div class="story-icon">🐱</div>
          <div class="story-content">
            <h4>福来猫的故事</h4>
            <p>龙华寺有只大橘猫叫"福来"，已经在寺里住了 8 年。传说摸它左耳招桃花，摸右耳招财运。</p>
            <div class="story-tip">
              <span class="tip-icon">💡</span>
              <span>最佳撸猫时间：上午 9-11 点，地点：天王殿右侧石阶</span>
            </div>
          </div>
        </div>

        <!-- 龙华塔传说 -->
        <div class="story-card">
          <div class="story-icon">🏯</div>
          <div class="story-content">
            <h4>龙华塔的秘密</h4>
            <p>龙华塔不是直立的，塔身微微向东北倾斜，是建造时刻意为之，寓意"镇住东海"。</p>
            <div class="story-tip">
              <span class="tip-icon">💡</span>
              <span>塔影倒影最美时间：下午 3:20-4:40</span>
            </div>
          </div>
        </div>

        <!-- 龙华庙会 -->
        <div class="story-card">
          <div class="story-icon">🎪</div>
          <div class="story-content">
            <h4>龙华庙会</h4>
            <p>每年农历三月初三，龙华庙会已有 400 多年历史，是上海最具影响力的传统庙会。</p>
            <div class="story-tip">
              <span class="tip-icon">📅</span>
              <span>2026 年时间：4 月 18 日（农历三月初三）</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 美食推荐 -->
      <div v-if="activeTab === 'food'" class="food-section">
        <h3 class="section-title">🍜 龙华美食地图</h3>
        
        <div class="food-grid">
          <div
            v-for="food in foodRecommendations"
            :key="food.name"
            class="food-card"
          >
            <div class="food-image">{{ food.icon }}</div>
            <div class="food-info">
              <h4>{{ food.name }}</h4>
              <p class="food-desc">{{ food.description }}</p>
              <div class="food-meta">
                <span class="food-price">💰 {{ food.price }}</span>
                <span class="food-location">📍 {{ food.location }}</span>
              </div>
              <button @click="navigateTo(food)" class="nav-btn">🧭 导航前往</button>
            </div>
          </div>
        </div>
      </div>

      <!-- 拍照打卡 -->
      <div v-if="activeTab === 'photo'" class="photo-section">
        <h3 class="section-title">📸 最佳拍照指南</h3>
        
        <div class="photo-tips">
          <div
            v-for="spot in photoSpots"
            :key="spot.name"
            class="photo-card"
          >
            <div class="photo-header">
              <h4>{{ spot.name }}</h4>
              <span class="photo-score">{{ spot.score }}</span>
            </div>
            <div class="photo-body">
              <p><strong>最佳时间：</strong>{{ spot.bestTime }}</p>
              <p><strong>推荐穿搭：</strong>{{ spot.outfit }}</p>
              <p><strong>机位：</strong>{{ spot.angle }}</p>
            </div>
            <div class="photo-sample">
              <span class="sample-icon">{{ spot.icon }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 隐藏彩蛋 -->
      <div v-if="activeTab === 'secrets'" class="secrets-section">
        <h3 class="section-title">🎁 龙华隐藏彩蛋</h3>
        
        <div class="secrets-list">
          <div
            v-for="secret in secrets"
            :key="secret.title"
            class="secret-card"
            @click="revealSecret(secret)"
          >
            <div class="secret-header">
              <span class="secret-icon">{{ secret.icon }}</span>
              <h4>{{ secret.title }}</h4>
            </div>
            <p class="secret-preview">{{ secret.preview }}</p>
            <div v-if="secret.revealed" class="secret-content">
              <p>{{ secret.full }}</p>
              <span class="reward">🏆 +{{ secret.points }} 积分</span>
            </div>
            <button class="reveal-btn">
              {{ secret.revealed ? '已解锁' : '点击解锁' }}
            </button>
          </div>
        </div>
      </div>

      <!-- 季节活动 -->
      <div v-if="activeTab === 'events'" class="events-section">
        <h3 class="section-title">🎪 季节性活动</h3>
        
        <div class="season-tabs">
          <button
            v-for="season in seasons"
            :key="season.id"
            @click="activeSeason = season.id"
            :class="['season-btn', { active: activeSeason === season.id }]"
          >
            {{ season.icon }} {{ season.name }}
          </button>
        </div>

        <div class="events-list">
          <div
            v-for="event in getCurrentSeasonEvents()"
            :key="event.name"
            class="event-card"
          >
            <div class="event-date">
              <span class="month">{{ event.month }}</span>
              <span class="day">{{ event.day }}</span>
            </div>
            <div class="event-info">
              <h4>{{ event.name }}</h4>
              <p>{{ event.location }}</p>
              <p class="event-desc">{{ event.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 每日冷知识 -->
    <div class="daily-trivia">
      <div class="trivia-card" @click="nextTrivia">
        <span class="trivia-icon">💡</span>
        <div class="trivia-content">
          <p class="trivia-title">龙华冷知识</p>
          <p class="trivia-text">{{ currentTrivia }}</p>
        </div>
        <span class="trivia-hint">点击换一条</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const emit = defineEmits<{
  (e: 'close'): void
}>()

const showSearch = ref(false)
const searchQuery = ref('')
const activeTab = ref('history')
const activeSeason = ref('spring')

// 分类标签
const tabs = [
  { id: 'history', name: '历史', icon: '📜' },
  { id: 'culture', name: '人文', icon: '🎭' },
  { id: 'food', name: '美食', icon: '🍜' },
  { id: 'photo', name: '拍照', icon: '📸' },
  { id: 'secrets', name: '彩蛋', icon: '🎁' },
  { id: 'events', name: '活动', icon: '🎪' }
]

// 历史时间线
const timelineEvents = [
  { year: '242 年', title: '龙华寺始建', description: '三国吴赤乌五年，孙权为孝敬母亲而建寺' },
  { year: '宋代', title: '龙华塔建成', description: '七层八角砖木结构，上海现存最古塔' },
  { year: '明代', title: '龙华庙会兴起', description: '成为沪上著名民俗活动，延续至今' },
  { year: '1927 年', title: '烈士陵园建立', description: '原为淞沪警备司令部旧址' },
  { year: '2000 年', title: '龙华街道成立', description: '隶属上海市徐汇区' },
  { year: '2020 年', title: '西岸艺术区崛起', description: '成为上海文化新高地' }
]

// 美食推荐
const foodRecommendations = [
  {
    name: '龙华寺素面',
    icon: '🍜',
    description: '上海最畅销素面，年售 100 万碗',
    price: '15-25 元',
    location: '龙华寺内'
  },
  {
    name: '老大昌本帮菜',
    icon: '🍲',
    description: '老字号本帮菜，地道上海味',
    price: '80 元',
    location: '龙华西路'
  },
  {
    name: '王家沙小笼',
    icon: '🥟',
    description: '皮薄汁多，现蒸现卖',
    price: '35 元',
    location: '龙华老街'
  },
  {
    name: 'Manner Coffee',
    icon: '☕',
    description: '精品咖啡，塔影空间景观位',
    price: '25 元',
    location: '塔影空间'
  }
]

// 拍照打卡点
const photoSpots = [
  {
    name: '龙华塔',
    icon: '🏯',
    score: '⭐⭐⭐⭐',
    bestTime: '清晨 6-8 点',
    outfit: '白色、米色',
    angle: '天王殿前拍全景'
  },
  {
    name: '塔影空间',
    icon: '✨',
    score: '⭐⭐⭐⭐⭐',
    bestTime: '下午 3-5 点',
    outfit: '白色、红色',
    angle: '水池边拍倒影'
  },
  {
    name: '西岸滨江',
    icon: '🌅',
    score: '⭐⭐⭐⭐',
    bestTime: '傍晚 5-7 点',
    outfit: '亮色、印花',
    angle: '江边栈道拍日落'
  },
  {
    name: '油罐艺术中心',
    icon: '🎨',
    score: '⭐⭐⭐⭐',
    bestTime: '上午 10-12 点',
    outfit: '黑色、灰色',
    angle: '工业风大片'
  }
]

// 隐藏彩蛋
const secrets = ref([
  {
    title: '福来猫的秘密',
    icon: '🐱',
    preview: '龙华寺有只神秘的猫...',
    full: '福来猫在天王殿右侧石阶，摸左耳招桃花，摸右耳招财运。最佳时间：上午 9-11 点',
    points: 30,
    revealed: false
  },
  {
    title: '塔影最佳时间',
    icon: '📸',
    preview: '你知道几点拍倒影最美吗？...',
    full: '下午 3:20-4:40 是塔影倒影最美的时候，穿白色衣服效果最好，无风天气水面最平静',
    points: 20,
    revealed: false
  },
  {
    title: '隐藏咖啡',
    icon: '☕',
    preview: '塔影空间有隐藏菜单...',
    full: '点"塔影特调"（菜单上没有），告诉店员"看塔来的"，会送一块小饼干',
    points: 25,
    revealed: false
  },
  {
    title: '龙华塔倾斜',
    icon: '🏯',
    preview: '龙华塔不是直立的...',
    full: '塔身微微向东北倾斜，是建造时刻意为之，寓意"镇住东海"',
    points: 30,
    revealed: false
  }
])

// 季节活动
const seasons = [
  { id: 'spring', name: '春季', icon: '🌸' },
  { id: 'summer', name: '夏季', icon: '🎵' },
  { id: 'autumn', name: '秋季', icon: '🎨' },
  { id: 'winter', name: '冬季', icon: '🔔' }
]

const seasonEvents: Record<string, any[]> = {
  spring: [
    { name: '龙华庙会', month: '4 月', day: '18', location: '龙华寺', description: '农历三月初三，民俗表演、小吃集市' },
    { name: '樱花季', month: '3 月', day: '20', location: '上海植物园', description: '樱花大道、夜樱观赏' },
    { name: '杜鹃花展', month: '4 月', day: '5', location: '龙华烈士陵园', description: '千株杜鹃盛开' }
  ],
  summer: [
    { name: '西岸音乐节', month: '7 月', day: '15', location: '西岸艺术中心', description: '露天音乐会' },
    { name: '龙舟赛', month: '6 月', day: '10', location: '龙华港', description: '传统龙舟竞渡' },
    { name: '露天电影', month: '每周五', day: '19:00', location: '龙华文化广场', description: '免费电影放映' }
  ],
  autumn: [
    { name: '西岸艺术博览会', month: '11 月', day: '8', location: '西岸艺术中心', description: '国际艺术大展' },
    { name: '桂花节', month: '9 月', day: '20', location: '上海植物园', description: '桂花飘香、品茶' },
    { name: '素斋文化节', month: '10 月', day: '15', location: '龙华寺', description: '素食文化体验' }
  ],
  winter: [
    { name: '除夕撞钟', month: '1 月', day: '28', location: '龙华寺', description: '108 响钟声祈福' },
    { name: '春节庙会', month: '2 月', day: '10', location: '龙华寺', description: '舞龙舞狮、民俗表演' },
    { name: '腊梅展', month: '1 月', day: '15', location: '上海植物园', description: '腊梅飘香' }
  ]
}

// 龙华冷知识
const triviaList = [
  '龙华塔不是直立的，塔身微微向东北倾斜，寓意"镇住东海"',
  '龙华寺有 1700 多年历史，比上海建城还早',
  '龙华烈士陵园曾是刑场，1927-1949 年间数千烈士在此就义',
  '西岸曾经是工业区，20 年前是水泥厂、煤码头',
  '龙华庙会曾中断 30 年（1966-1996），1997 年恢复',
  '油罐艺术中心是亚洲最大，由 5 个航空油罐改造',
  '龙华寺素面年售 100 万碗，是上海最畅销素面',
  '龙华港是上海第一条人工河，开凿于唐代'
]

const currentTriviaIndex = ref(0)
const currentTrivia = ref(triviaList[0])

// 方法
function closeKB() {
  emit('close')
}

function toggleSearch() {
  showSearch.value = !showSearch.value
}

function navigateTo(food: any) {
  // TODO: 调用地图导航
  alert(`🧭 导航前往：${food.name}`)
}

function revealSecret(secret: any) {
  if (!secret.revealed) {
    secret.revealed = true
    // TODO: 添加积分
  }
}

function getCurrentSeasonEvents() {
  return seasonEvents[activeSeason.value] || []
}

function nextTrivia() {
  currentTriviaIndex.value = (currentTriviaIndex.value + 1) % triviaList.length
  currentTrivia.value = triviaList[currentTriviaIndex.value]
}
</script>

<style scoped>
.knowledge-base {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(145deg, #fff9f5 0%, #fef4ed 100%);
  z-index: 2000;
  overflow-y: auto;
  padding-bottom: 100px;
}

.kb-header {
  position: sticky;
  top: 0;
  background: rgba(255, 250, 245, 0.96);
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  border-bottom: 1px solid rgba(255, 180, 140, 0.3);
  backdrop-filter: blur(12px);
}

.back-btn, .search-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: background 0.2s;
}

.back-btn:hover, .search-btn:hover {
  background: #f0e6dd;
}

.kb-header h2 {
  flex: 1;
  color: #E87A5D;
  font-size: 1.4rem;
}

.search-bar {
  padding: 0 20px 16px;
  background: rgba(255, 250, 245, 0.96);
}

.search-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #ffe0d0;
  border-radius: 44px;
  font-size: 1rem;
  background: white;
  transition: all 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #F9B572;
  box-shadow: 0 0 0 3px rgba(249, 181, 114, 0.15);
}

.kb-tabs {
  display: flex;
  gap: 8px;
  padding: 0 20px 16px;
  overflow-x: auto;
}

.kb-tab {
  padding: 10px 18px;
  border: 2px solid #ffe0d0;
  background: white;
  border-radius: 44px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  color: #5a4a42;
}

.kb-tab.active {
  background: #F9B572;
  color: white;
  border-color: #F9B572;
}

.kb-content {
  padding: 0 20px;
}

.section-title {
  font-size: 1.3rem;
  color: #5a4a42;
  margin-bottom: 20px;
  font-weight: 700;
}

/* 时间线 */
.timeline {
  position: relative;
  padding-left: 30px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 8px;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(to bottom, #F9B572, #f4a25e);
  border-radius: 2px;
}

.timeline-item {
  position: relative;
  margin-bottom: 24px;
  padding-left: 20px;
}

.timeline-marker {
  position: absolute;
  left: -30px;
  top: 0;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #F9B572;
  border: 3px solid white;
  box-shadow: 0 2px 8px rgba(249, 181, 114, 0.3);
}

.timeline-year {
  position: absolute;
  left: -65px;
  top: -2px;
  font-size: 0.75rem;
  font-weight: 700;
  color: #E87A5D;
  white-space: nowrap;
}

.timeline-content h4 {
  color: #5a4a42;
  font-size: 1.1rem;
  margin-bottom: 6px;
}

.timeline-content p {
  color: #7f6b5e;
  font-size: 0.9rem;
  line-height: 1.5;
}

/* 故事卡片 */
.story-card {
  background: white;
  border-radius: 28px;
  padding: 20px;
  margin-bottom: 16px;
  display: flex;
  gap: 16px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.04);
  border: 1px solid #fff0e6;
}

.story-icon {
  font-size: 3rem;
  flex-shrink: 0;
}

.story-content h4 {
  color: #E87A5D;
  font-size: 1.1rem;
  margin-bottom: 8px;
}

.story-content p {
  color: #5a4a42;
  font-size: 0.9rem;
  line-height: 1.6;
  margin-bottom: 12px;
}

.story-tip {
  background: #fef3e8;
  color: #b77b5c;
  padding: 10px 14px;
  border-radius: 16px;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 6px;
}

.tip-icon {
  font-size: 1rem;
}

.cat-card {
  background: linear-gradient(135deg, #fff5f0 0%, #fef0e6 100%);
  border: 2px solid #ffd6c0;
}

/* 美食网格 */
.food-grid {
  display: grid;
  gap: 16px;
}

.food-card {
  background: white;
  border-radius: 28px;
  overflow: hidden;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.04);
}

.food-image {
  height: 120px;
  background: linear-gradient(135deg, #fef3e8 0%, #fee6d6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
}

.food-info {
  padding: 16px;
}

.food-info h4 {
  color: #5a4a42;
  font-size: 1.1rem;
  margin-bottom: 6px;
}

.food-desc {
  color: #7f6b5e;
  font-size: 0.9rem;
  margin-bottom: 12px;
}

.food-meta {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
  font-size: 0.85rem;
}

.food-price {
  color: #E87A5D;
  font-weight: 600;
}

.food-location {
  color: #a58468;
}

.nav-btn {
  width: 100%;
  padding: 10px;
  background: #F9B572;
  border: none;
  border-radius: 40px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.nav-btn:hover {
  background: #f4a25e;
  transform: translateY(-2px);
}

/* 拍照卡片 */
.photo-tips {
  display: grid;
  gap: 16px;
}

.photo-card {
  background: white;
  border-radius: 28px;
  padding: 16px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.04);
}

.photo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.photo-header h4 {
  color: #5a4a42;
  font-size: 1.1rem;
}

.photo-score {
  color: #ffb347;
  font-size: 1.1rem;
}

.photo-body {
  background: #faf9f8;
  padding: 12px;
  border-radius: 16px;
  margin-bottom: 12px;
}

.photo-body p {
  color: #5a4a42;
  font-size: 0.85rem;
  margin-bottom: 6px;
}

.photo-body p:last-child {
  margin-bottom: 0;
}

.photo-sample {
  text-align: center;
  font-size: 3rem;
}

/* 隐藏彩蛋 */
.secrets-list {
  display: grid;
  gap: 16px;
}

.secret-card {
  background: white;
  border-radius: 28px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid #ffe0d0;
}

.secret-card:hover {
  border-color: #F9B572;
  transform: translateY(-2px);
}

.secret-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.secret-icon {
  font-size: 2rem;
}

.secret-header h4 {
  color: #5a4a42;
  font-size: 1rem;
}

.secret-preview {
  color: #7f6b5e;
  font-size: 0.9rem;
  margin-bottom: 12px;
}

.secret-content {
  background: #fef3e8;
  color: #b77b5c;
  padding: 12px;
  border-radius: 16px;
  margin-bottom: 12px;
}

.reward {
  display: block;
  margin-top: 8px;
  color: #E87A5D;
  font-weight: 700;
  font-size: 0.9rem;
}

.reveal-btn {
  padding: 8px 20px;
  background: #F9B572;
  border: none;
  border-radius: 40px;
  color: white;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
}

/* 季节活动 */
.season-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.season-btn {
  flex: 1;
  padding: 10px;
  border: 2px solid #ffe0d0;
  background: white;
  border-radius: 44px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.season-btn.active {
  background: #F9B572;
  color: white;
  border-color: #F9B572;
}

.events-list {
  display: grid;
  gap: 12px;
}

.event-card {
  background: white;
  border-radius: 24px;
  padding: 16px;
  display: flex;
  gap: 16px;
  align-items: center;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.04);
}

.event-date {
  background: linear-gradient(135deg, #F9B572, #f4a25e);
  color: white;
  padding: 12px;
  border-radius: 16px;
  text-align: center;
  min-width: 60px;
}

.event-date .month {
  display: block;
  font-size: 0.75rem;
  opacity: 0.9;
}

.event-date .day {
  display: block;
  font-size: 1.3rem;
  font-weight: 700;
}

.event-info h4 {
  color: #5a4a42;
  font-size: 1rem;
  margin-bottom: 4px;
}

.event-info p {
  color: #7f6b5e;
  font-size: 0.85rem;
  margin-bottom: 4px;
}

.event-desc {
  color: #a58468;
  font-size: 0.8rem;
}

/* 每日冷知识 */
.daily-trivia {
  position: fixed;
  bottom: 20px;
  left: 20px;
  right: 20px;
  z-index: 1500;
}

.trivia-card {
  background: linear-gradient(135deg, #F9B572, #f4a25e);
  color: white;
  padding: 16px;
  border-radius: 28px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 8px 24px rgba(249, 181, 114, 0.3);
  cursor: pointer;
  animation: pulse-glow 2s infinite;
}

@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 8px 24px rgba(249, 181, 114, 0.3); }
  50% { box-shadow: 0 8px 32px rgba(249, 181, 114, 0.5); }
}

.trivia-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.trivia-content {
  flex: 1;
}

.trivia-title {
  font-size: 0.75rem;
  opacity: 0.9;
  margin-bottom: 4px;
}

.trivia-text {
  font-size: 0.9rem;
  line-height: 1.4;
}

.trivia-hint {
  font-size: 0.75rem;
  opacity: 0.8;
  white-space: nowrap;
}
</style>
