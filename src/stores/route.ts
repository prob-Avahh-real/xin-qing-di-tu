import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface ExperiencePoint {
  id: string
  name: string
  location: [number, number] // [lng, lat]
  category: string
  description: string
  whyItHeals: string // 治愈理由
  experienceScore: number // 1-10
  popularity: number // 1-10
  duration: number // 预计停留时间（分钟）
  imageUrl?: string
  photoScore?: string // ⭐⭐⭐
  businessHook?: string // 商家优惠券
  hiddenTip?: string // 隐藏彩蛋
  emotionMatch?: string // 匹配的情绪
}

export interface RouteSegment {
  from: ExperiencePoint
  to: ExperiencePoint
  distance: number // 米
  duration: number // 分钟
  mode: 'walking' | 'cycling' | 'driving'
}

export interface ExperienceRoute {
  id: string
  name: string
  theme: string // 路线主题
  emotionMatch: string // 情绪匹配说明
  points: ExperiencePoint[]
  segments: RouteSegment[]
  totalDistance: number // 米
  totalDuration: number // 分钟
  experienceScore: number // 1-10
  photoSpots: number // 出片点数量
  totalSavings: number // 预估省钱
  pointsEarned: number // 获得积分
  shareable: boolean
  createdAt: Date
}

// 音乐推荐数据
export interface MusicRecommendation {
  name: string
  artist: string
  url: string
}

export const MUSIC_MAP: Record<string, MusicRecommendation> = {
  sad: {
    name: "一定会",
    artist: "林俊杰",
    url: "https://music.163.com/song/media/outer/url?id=2090525189.mp3"
  },
  relax: {
    name: "一定会",
    artist: "林俊杰",
    url: "https://music.163.com/song/media/outer/url?id=2090525189.mp3"
  },
  photo: {
    name: "Super Shy",
    artist: "NewJeans",
    url: "https://music.163.com/song/media/outer/url?id=2083430083.mp3"
  },
  social: {
    name: "Ditto",
    artist: "NewJeans",
    url: "https://music.163.com/song/media/outer/url?id=2083430084.mp3"
  },
  art: {
    name: "Waltz For Debby",
    artist: "Bill Evans",
    url: "https://music.163.com/song/media/outer/url?id=1898412.mp3"
  },
  party: {
    name: "Ditto",
    artist: "NewJeans",
    url: "https://music.163.com/song/media/outer/url?id=2083430084.mp3"
  },
  default: {
    name: "一定会",
    artist: "林俊杰",
    url: "https://music.163.com/song/media/outer/url?id=2090525189.mp3"
  }
}

// 龙华/西岸地区真实地标数据
export const LONGHUA_POI_DATA: Record<string, ExperiencePoint> = {
  longhuaTemple: {
    id: 'longhua_temple',
    name: '龙华寺',
    location: [121.4500, 31.1830],
    category: 'art',
    description: '千年古刹，上海最古老的寺庙之一',
    whyItHeals: '这里的猫比人更懂治愈，一碗热素面暖进心里',
    experienceScore: 9,
    popularity: 10,
    duration: 45,
    photoScore: '⭐⭐⭐',
    businessHook: '领 5 元素面券',
    hiddenTip: '寺里有只大橘猫叫'福来'，摸它耳朵会有好运',
    imageUrl: 'https://example.com/longhua-temple.jpg'
  },
  shadowSpace: {
    id: 'shadow_space',
    name: '塔影空间',
    location: [121.4512, 31.1815],
    category: 'photo',
    description: '临水静谧空间，龙华塔倒影绝美',
    whyItHeals: '水下倒影 + 金色穹顶，9 张图都不够发',
    experienceScore: 9,
    popularity: 9,
    duration: 30,
    photoScore: '⭐⭐⭐⭐⭐',
    businessHook: '领咖啡 8 折券',
    hiddenTip: '穿白色衣服倒影效果最好',
    imageUrl: 'https://example.com/shadow-space.jpg'
  },
  westBund: {
    id: 'west_bund',
    name: '西岸滨江',
    location: [121.4600, 31.1720],
    category: 'nature',
    description: '黄浦江畔，日落观景绝佳地',
    whyItHeals: '看着日落慢慢呼吸，难过也是风景',
    experienceScore: 8,
    popularity: 8,
    duration: 40,
    photoScore: '⭐⭐⭐⭐',
    businessHook: '咖啡车买一赠一',
    hiddenTip: '下午 5:20-5:40 江面最蓝',
    imageUrl: 'https://example.com/west-bund.jpg'
  },
  westBundDream: {
    id: 'west_bund_dream',
    name: '西岸梦中心',
    location: [121.4580, 31.1700],
    category: 'social',
    description: '水泥厂变身潮人食堂，夜生活满分',
    whyItHeals: '工业风建筑 + 美食聚集地，朋友聚会首选',
    experienceScore: 8,
    popularity: 9,
    duration: 60,
    photoScore: '⭐⭐⭐⭐',
    businessHook: '精酿买一送一券',
    hiddenTip: '每周五六日有露天电影',
    imageUrl: 'https://example.com/west-bund-dream.jpg'
  },
  oilTankArt: {
    id: 'oil_tank_art',
    name: '油罐艺术中心',
    location: [121.4550, 31.1790],
    category: 'art',
    description: '由航空油罐改造的艺术空间',
    whyItHeals: '工业风与艺术的完美碰撞，看展散心好去处',
    experienceScore: 9,
    popularity: 8,
    duration: 50,
    photoScore: '⭐⭐⭐⭐',
    businessHook: '展览门票 9 折',
    hiddenTip: '周一闭馆，其他日子人少好拍',
    imageUrl: 'https://example.com/oil-tank-art.jpg'
  },
  westArtMuseum: {
    id: 'west_art_museum',
    name: '龙美术馆 (西岸馆)',
    location: [121.4580, 31.1800],
    category: 'art',
    description: '工业风文艺场馆，环境安静高级',
    whyItHeals: '在艺术里独处，与温柔相遇',
    experienceScore: 9,
    popularity: 8,
    duration: 70,
    photoScore: '⭐⭐⭐⭐⭐',
    businessHook: '会员免费参观',
    hiddenTip: '周三人最少，适合静静看展',
    imageUrl: 'https://example.com/west-art-museum.jpg'
  },
  botanicGarden: {
    id: 'botanic_garden',
    name: '上海植物园',
    location: [121.4430, 31.1780],
    category: 'nature',
    description: '绿植繁茂、花香弥漫',
    whyItHeals: '误入绿意森林，与自然相拥，缓解压力',
    experienceScore: 8,
    popularity: 7,
    duration: 80,
    photoScore: '⭐⭐⭐',
    businessHook: '学生票半价',
    hiddenTip: '3-4 月樱花季最美',
    imageUrl: 'https://example.com/botanic-garden.jpg'
  },
  oldStreet: {
    id: 'old_street',
    name: '龙华老街',
    location: [121.4490, 31.1840],
    category: 'food',
    description: '充满烟火气的老街，地道小吃聚集地',
    whyItHeals: '一碗馄饨，一笼汤包，治愈所有疲惫',
    experienceScore: 8,
    popularity: 9,
    duration: 40,
    photoScore: '⭐⭐',
    businessHook: '老街小吃 8 折券',
    hiddenTip: '早上 7-9 点最热闹',
    imageUrl: 'https://example.com/old-street.jpg'
  },
  martyrPark: {
    id: 'martyr_park',
    name: '龙华烈士陵园',
    location: [121.4475, 31.1850],
    category: 'art',
    description: '缅怀先烈的红色教育基地，园林式纪念公园',
    whyItHeals: '在肃穆中沉思，感受和平的珍贵，心灵得到净化',
    experienceScore: 9,
    popularity: 8,
    duration: 50,
    photoScore: '⭐⭐⭐',
    businessHook: '免费参观',
    hiddenTip: '清明时节杜鹃花盛开，景色最美',
    imageUrl: 'https://example.com/martyr-park.jpg'
  },
  longhuaPark: {
    id: 'longhua_park',
    name: '龙华公园',
    location: [121.4510, 31.1825],
    category: 'nature',
    description: '龙华街道中心的城市绿肺，居民休闲好去处',
    whyItHeals: '绿树成荫，鸟语花香，城市中的宁静角落',
    experienceScore: 7,
    popularity: 7,
    duration: 30,
    photoScore: '⭐⭐',
    businessHook: '免费开放',
    hiddenTip: '清晨来这里有老人打太极，很有生活气息',
    imageUrl: 'https://example.com/longhua-park.jpg'
  },
  culturalPlaza: {
    id: 'cultural_plaza',
    name: '龙华文化广场',
    location: [121.4495, 31.1835],
    category: 'social',
    description: '龙华街道的文化活动中心，经常举办各类演出',
    whyItHeals: '感受社区文化活力，偶遇街头表演惊喜',
    experienceScore: 7,
    popularity: 8,
    duration: 25,
    photoScore: '⭐⭐',
    businessHook: '周末免费演出',
    hiddenTip: '周六晚上常有露天电影',
    imageUrl: 'https://example.com/cultural-plaza.jpg'
  },
  westBundGreen: {
    id: 'west_bund_green',
    name: '徐汇滨江绿地',
    location: [121.4620, 31.1750],
    category: 'nature',
    description: '黄浦江畔的生态绿地，跑步骑行好去处',
    whyItHeals: '江风拂面，绿意盎然，运动释放所有烦恼',
    experienceScore: 8,
    popularity: 9,
    duration: 45,
    photoScore: '⭐⭐⭐⭐',
    businessHook: '共享单车免费骑',
    hiddenTip: '傍晚时分夕阳最美，很多新人来拍婚纱照',
    imageUrl: 'https://example.com/west-bund-green.jpg'
  },
  polyWestBank: {
    id: 'poly_west_bank',
    name: '保利·西岸中心',
    location: [121.4570, 31.1710],
    category: 'shopping',
    description: '滨江商业综合体，购物餐饮娱乐一站式',
    whyItHeals: '逛吃逛吃，购物解压，美食治愈一切',
    experienceScore: 7,
    popularity: 8,
    duration: 60,
    photoScore: '⭐⭐⭐',
    businessHook: '消费满 200 减 30',
    hiddenTip: '5 楼露台可以看江景',
    imageUrl: 'https://example.com/poly-west-bank.jpg'
  },
  longhuaMetro: {
    id: 'longhua_metro',
    name: '龙华地铁站商圈',
    location: [121.4520, 31.1810],
    category: 'food',
    description: '地铁 11/12 号线交汇处，便捷交通枢纽',
    whyItHeals: '便捷出行，快速到达，节省时间就是省钱',
    experienceScore: 6,
    popularity: 9,
    duration: 20,
    photoScore: '⭐',
    businessHook: '地铁周边美食 9 折',
    hiddenTip: '3 号口出来有家本帮菜很正宗',
    imageUrl: 'https://example.com/longhua-metro.jpg'
  }
}

// 情绪路线配置
export const EMOTION_ROUTES: Record<string, {
  theme: string
  emotionMatch: string
  poiIds: string[]
  photoSpots: number
  savings: number
}> = {
  relax: {
    theme: '🍃 自我疗愈线',
    emotionMatch: '安静 + 美食 + 独处，让心灵慢慢放松',
    poiIds: ['longhuaTemple', 'shadowSpace', 'westBund'],
    photoSpots: 3,
    savings: 8
  },
  photo: {
    theme: '📸 出片打卡线',
    emotionMatch: '想出片 → 视觉炸裂机位，张张大片',
    poiIds: ['shadowSpace', 'oilTankArt', 'westArtMuseum'],
    photoSpots: 5,
    savings: 15
  },
  social: {
    theme: '🎉 潮人社交线',
    emotionMatch: '和朋友 → 看展 + 晚饭 + 夜生活，嗨翻天',
    poiIds: ['westBundDream', 'oilTankArt', 'longhuaTemple'],
    photoSpots: 4,
    savings: 20
  },
  art: {
    theme: '🎨 艺术灵感线',
    emotionMatch: '文艺灵感 → 艺术浸润，感受创造力',
    poiIds: ['westArtMuseum', 'oilTankArt', 'shadowSpace'],
    photoSpots: 4,
    savings: 12
  },
  party: {
    theme: '🎊 欢聚狂欢线',
    emotionMatch: '团体出游 → 吃喝玩乐一站式',
    poiIds: ['westBundDream', 'westBund', 'oldStreet'],
    photoSpots: 3,
    savings: 25
  }
}

export const useRouteStore = defineStore('route', () => {
  // 状态
  const currentRoute = ref<ExperienceRoute | null>(null)
  const savedRoutes = ref<ExperienceRoute[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  
  // 兴趣点类别
  const categories = ref([
    { id: 'relax', name: '散心放空', icon: '🍃', color: 'bg-emerald-100 text-emerald-800' },
    { id: 'photo', name: '拍照打卡', icon: '📸', color: 'bg-purple-100 text-purple-800' },
    { id: 'social', name: '结伴游玩', icon: '🎉', color: 'bg-pink-100 text-pink-800' },
    { id: 'art', name: '文艺慢游', icon: '🎨', color: 'bg-indigo-100 text-indigo-800' },
    { id: 'party', name: '聚会狂欢', icon: '🎊', color: 'bg-orange-100 text-orange-800' },
    { id: 'food', name: '美食探索', icon: '🍜', color: 'bg-red-100 text-red-800' },
    { id: 'nature', name: '自然风光', icon: '🌳', color: 'bg-green-100 text-green-800' },
  ])

  // 选中的类别
  const selectedCategories = ref<string[]>(['relax'])

  // 起点 (龙华地区中心)
  const startPoint = ref<[number, number] | null>([121.4500, 31.1830]) // 龙华寺
  const customQuery = ref<string>('') // 自定义输入

  // 计算属性
  const totalExperienceScore = computed(() => {
    if (!currentRoute.value) return 0
    return currentRoute.value.experienceScore
  })

  const routeDuration = computed(() => {
    if (!currentRoute.value) return '0 分钟'
    const hours = Math.floor(currentRoute.value.totalDuration / 60)
    const minutes = currentRoute.value.totalDuration % 60
    if (hours > 0) {
      return `${hours}小时${minutes}分钟`
    }
    return `${minutes}分钟`
  })

  // 根据情绪类型生成路线
  const generateRoute = async (emotionType?: string, query?: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      // 模拟 AI Agent 处理延迟
      await new Promise(resolve => setTimeout(resolve, 1300))
      
      // 确定情绪类型
      const emotion = emotionType || selectedCategories.value[0] || 'relax'
      const routeConfig = EMOTION_ROUTES[emotion] || EMOTION_ROUTES['relax']
      
      // 构建路线点
      const points: ExperiencePoint[] = []
      routeConfig.poiIds.forEach((poiId, index) => {
        const poi = LONGHUA_POI_DATA[poiId]
        if (poi) {
          points.push({
            ...poi,
            emotionMatch: index === 0 ? routeConfig.emotionMatch : undefined
          })
        }
      })
      
      // 生成路线段
      const segments: RouteSegment[] = []
      for (let i = 0; i < points.length - 1; i++) {
        segments.push({
          from: points[i],
          to: points[i + 1],
          distance: 300 + (i * 150), // 模拟距离
          duration: 8 + (i * 3), // 模拟步行时间
          mode: 'walking' as const
        })
      }
      
      // 计算总距离和时间
      const totalDistance = segments.reduce((sum, seg) => sum + seg.distance, 0)
      const totalDuration = points.reduce((sum, point) => sum + point.duration, 0) +
                           segments.reduce((sum, seg) => sum + seg.duration, 0)
      
      // 计算平均体验分
      const avgExperienceScore = points.length > 0 
        ? points.reduce((sum, point) => sum + point.experienceScore, 0) / points.length
        : 8.0
      
      // 生成路线
      const route: ExperienceRoute = {
        id: `route_${Date.now()}`,
        name: routeConfig.theme,
        theme: routeConfig.theme,
        emotionMatch: routeConfig.emotionMatch,
        points,
        segments,
        totalDistance,
        totalDuration,
        experienceScore: parseFloat(avgExperienceScore.toFixed(1)),
        photoSpots: routeConfig.photoSpots,
        totalSavings: routeConfig.savings,
        pointsEarned: 50,
        shareable: true,
        createdAt: new Date()
      }
      
      currentRoute.value = route
      savedRoutes.value.push(route)
      console.log('生成的路线:', route.name, '包含', points.length, '个兴趣点')
      
    } catch (err) {
      error.value = '生成路线时出错，请稍后重试'
      console.error('Route generation error:', err)
    } finally {
      isLoading.value = false
    }
  }

  // 智能推荐路线 (AI Agent 核心)
  const smartGenerateRoute = async (userQuery: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      // 简单的关键词匹配（模拟 AI 理解）
      const query = userQuery.toLowerCase()
      let emotion = 'relax'
      
      if (query.includes('拍照') || query.includes('出片') || query.includes('打卡')) {
        emotion = 'photo'
      } else if (query.includes('朋友') || query.includes('聚会') || query.includes('一起')) {
        emotion = 'social'
      } else if (query.includes('艺术') || query.includes('展览') || query.includes('文艺')) {
        emotion = 'art'
      } else if (query.includes('散心') || query.includes('一个人') || query.includes('安静')) {
        emotion = 'relax'
      } else if (query.includes('吃') || query.includes('美食')) {
        emotion = 'food'
      }
      
      return await generateRoute(emotion, userQuery)
      
    } catch (err) {
      error.value = '智能推荐失败，请稍后重试'
      console.error('Smart route generation error:', err)
      isLoading.value = false
    }
  }

  const saveRoute = (route: ExperienceRoute) => {
    savedRoutes.value.push(route)
  }

  const deleteRoute = (routeId: string) => {
    savedRoutes.value = savedRoutes.value.filter(route => route.id !== routeId)
    if (currentRoute.value?.id === routeId) {
      currentRoute.value = null
    }
  }

  const clearCurrentRoute = () => {
    currentRoute.value = null
  }

  const toggleCategory = (categoryId: string) => {
    const index = selectedCategories.value.indexOf(categoryId)
    if (index > -1) {
      selectedCategories.value.splice(index, 1)
    } else {
      selectedCategories.value.push(categoryId)
    }
  }

  return {
    // 状态
    currentRoute,
    savedRoutes,
    isLoading,
    error,
    categories,
    selectedCategories,
    startPoint,
    customQuery,
    
    // 计算属性
    totalExperienceScore,
    routeDuration,
    
    // 动作
    generateRoute,
    smartGenerateRoute,
    saveRoute,
    deleteRoute,
    clearCurrentRoute,
    toggleCategory,
  }
})
