<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'
import { useRouteStore } from '../stores/route'
import AMapLoader from '@amap/amap-jsapi-loader'

const routeStore = useRouteStore()
const mapContainer = ref<HTMLDivElement | null>(null)
const isMapLoaded = ref(false)
const mapInstance = ref<any>(null)
const AMap = ref<any>(null)

// 高德地图加载函数
const loadAMap = async () => {
  try {
    console.log('开始加载高德地图，Key:', import.meta.env.VITE_AMAP_KEY)
    
    const AMapLib = await AMapLoader.load({
      key: import.meta.env.VITE_AMAP_KEY,
      version: '2.0',
      plugins: [] // 先不加载任何插件，测试基本地图
    })
    
    AMap.value = AMapLib
    
    const map = new AMapLib.Map(mapContainer.value, {
      zoom: 15,
      center: [116.397428, 39.90923],
      viewMode: '3D'
    })
    
    mapInstance.value = map
    isMapLoaded.value = true
    console.log('高德地图加载成功')
    
    // 监听路线变化
    watch(() => routeStore.currentRoute, (newRoute) => {
      if (newRoute && mapInstance.value) {
        drawRouteOnMap(newRoute)
      }
    }, { immediate: true })
    
    return map
  } catch (error) {
    console.error('高德地图加载失败:', error)
    // 降级到模拟地图
    setTimeout(() => {
      isMapLoaded.value = true
    }, 1000)
    return null
  }
}

// 在地图上绘制路线
const drawRouteOnMap = (route: any) => {
  if (!mapInstance.value || !AMap.value) return
  
  // 清除之前的覆盖物
  mapInstance.value.clearMap()
  
  // 添加兴趣点标记
  route.points.forEach((point: any, index: number) => {
    const marker = new AMap.value.Marker({
      position: point.location,
      title: point.name,
      content: createMarkerContent(point, index + 1),
      offset: new AMap.value.Pixel(-15, -15)
    })
    
    // 信息窗口
    const infoWindow = new AMap.value.InfoWindow({
      content: createInfoWindowContent(point),
      offset: new AMap.value.Pixel(0, -30)
    })
    
    marker.on('click', () => {
      infoWindow.open(mapInstance.value, marker.getPosition())
    })
    
    mapInstance.value.add(marker)
  })
  
  // 添加路线
  if (route.points.length > 1) {
    const path = route.points.map((point: any) => point.location)
    const polyline = new AMap.value.Polyline({
      path: path,
      strokeColor: '#0ea5e9',
      strokeWeight: 4,
      strokeStyle: 'dashed',
      strokeDasharray: [5, 5]
    })
    
    mapInstance.value.add(polyline)
    
    // 调整地图视野
    mapInstance.value.setFitView([polyline])
  }
}

// 创建标记内容
const createMarkerContent = (point: any, index: number) => {
  const icon = point.category === 'photo' ? '📸' : 
               point.category === 'coffee' ? '☕' : 
               point.category === 'food' ? '🍜' : 
               point.category === 'book' ? '📚' : 
               point.category === 'sports' ? '⚽' : '📍'
  
  return `
    <div class="relative">
      <div class="w-8 h-8 rounded-full bg-white border-2 border-primary-500 
                  flex items-center justify-center shadow-lg animate-pulse-slow">
        <span class="text-sm font-bold text-primary-600">${index}</span>
      </div>
      <div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 
                  text-lg">${icon}</div>
    </div>
  `
}

// 创建信息窗口内容
const createInfoWindowContent = (point: any) => {
  const icon = point.category === 'photo' ? '📸' : 
               point.category === 'coffee' ? '☕' : 
               point.category === 'food' ? '🍜' : 
               point.category === 'book' ? '📚' : 
               point.category === 'sports' ? '⚽' : '📍'
  
  return `
    <div class="bg-white rounded-lg shadow-lg p-3 min-w-[200px]">
      <div class="flex items-start space-x-2">
        <div class="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 
                    flex items-center justify-center">
          <span class="text-primary-600">${icon}</span>
        </div>
        <div>
          <h4 class="font-semibold text-gray-900">${point.name}</h4>
          <p class="text-sm text-gray-600 mt-1">${point.description}</p>
          <div class="flex items-center mt-2">
            <span class="text-xs px-2 py-1 rounded-full bg-primary-100 text-primary-700">
              体验分: ${point.experienceScore}
            </span>
            <span class="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 ml-2">
              ${point.duration}分钟
            </span>
          </div>
        </div>
      </div>
    </div>
  `
}

onMounted(() => {
  loadAMap()
})

// 处理地图点击
const handleMapClick = (event: MouseEvent) => {
  if (!mapInstance.value) return
  
  const rect = mapContainer.value?.getBoundingClientRect()
  if (!rect) return
  
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  
  // 将屏幕坐标转换为地图坐标
  const lnglat = mapInstance.value.containerToLngLat(new AMap.value.Pixel(x, y))
  console.log('地图点击位置:', lnglat)
}
</script>

<template>
  <div class="h-full relative">
    <!-- 地图容器 -->
    <div 
      ref="mapContainer"
      @click="handleMapClick"
      class="w-full h-full bg-gradient-to-br from-blue-50 to-emerald-50 rounded-lg overflow-hidden relative"
    >
      <!-- 模拟地图背景（仅在地图加载失败时显示） -->
      <div v-if="!mapInstance" class="absolute inset-0">
        <!-- 模拟街道网格 -->
        <div class="absolute inset-0 opacity-20">
          <div class="h-full w-full" style="
            background-image: 
              linear-gradient(to right, #94a3b8 1px, transparent 1px),
              linear-gradient(to bottom, #94a3b8 1px, transparent 1px);
            background-size: 40px 40px;
          "></div>
        </div>
        
        <!-- 模拟河流/道路 -->
        <div class="absolute top-1/4 left-1/4 w-1/2 h-1 bg-blue-300 transform -rotate-12"></div>
        <div class="absolute top-1/2 left-1/4 w-1/3 h-1 bg-gray-400"></div>
        <div class="absolute top-2/3 left-1/3 w-1/4 h-1 bg-gray-400 transform rotate-45"></div>
        
        <!-- 模拟路线（当有路线时显示） -->
        <svg v-if="routeStore.currentRoute && routeStore.currentRoute.points.length > 1" 
             class="absolute inset-0 w-full h-full pointer-events-none">
          <path 
            d="M 30% 40% L 45% 55% L 60% 40%"
            fill="none" 
            stroke="#0ea5e9" 
            stroke-width="3"
            stroke-dasharray="5,5"
            class="animate-pulse"
          />
          <circle cx="30%" cy="40%" r="4" fill="#0ea5e9" />
          <circle cx="45%" cy="55%" r="4" fill="#0ea5e9" />
          <circle cx="60%" cy="40%" r="4" fill="#0ea5e9" />
        </svg>
      </div>
      
      <!-- 地图加载状态 -->
      <div v-if="!isMapLoaded" class="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p class="mt-4 text-gray-700">正在加载地图...</p>
        </div>
      </div>
      
      <!-- 地图加载失败提示 -->
      <div v-if="isMapLoaded && !mapInstance" class="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
        <div class="text-center max-w-md p-8 rounded-2xl bg-white shadow-2xl">
          <div class="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 to-red-500 
                      flex items-center justify-center mx-auto mb-6">
            <span class="text-3xl text-white">⚠️</span>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-3">地图加载失败</h3>
          <p class="text-gray-600 mb-6">
            无法加载高德地图，正在使用模拟地图展示。
            请检查网络连接或API Key配置。
          </p>
          <div class="flex items-center justify-center space-x-2 text-gray-500">
            <span>💡</span>
            <span class="text-sm">模拟地图已启用，基本功能可用</span>
          </div>
        </div>
      </div>
      
      <!-- 地图控件 -->
      <div class="absolute top-4 right-4 flex flex-col space-y-2 z-20">
        <button 
          v-if="mapInstance"
          @click="mapInstance.setZoom(mapInstance.getZoom() + 1)"
          class="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center 
                hover:bg-gray-50 transition-colors"
        >
          <span class="text-xl">➕</span>
        </button>
        <button 
          v-if="mapInstance"
          @click="mapInstance.setZoom(mapInstance.getZoom() - 1)"
          class="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center 
                hover:bg-gray-50 transition-colors"
        >
          <span class="text-xl">➖</span>
        </button>
        <button 
          v-if="mapInstance && routeStore.currentRoute"
          @click="mapInstance.setFitView()"
          class="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center 
                hover:bg-gray-50 transition-colors"
        >
          <span class="text-xl">📍</span>
        </button>
      </div>
      
      <!-- 地图图例 -->
      <div class="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg z-20">
        <div class="flex items-center space-x-4">
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 rounded-full bg-primary-500"></div>
            <span class="text-sm text-gray-700">兴趣点</span>
          </div>
          <div class="flex items-center space-x-2">
            <div class="w-6 h-1 bg-primary-500"></div>
            <span class="text-sm text-gray-700">推荐路线</span>
          </div>
          <div v-if="!mapInstance" class="flex items-center space-x-2">
            <div class="w-3 h-3 rounded-full bg-gray-400"></div>
            <span class="text-sm text-gray-700">模拟道路</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 地图提示（无路线时显示） -->
    <div v-if="!routeStore.currentRoute" class="absolute inset-0 flex items-center justify-center z-30">
      <div class="text-center max-w-md p-8 rounded-2xl bg-white/90 backdrop-blur-sm shadow-2xl">
        <div class="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 
                    flex items-center justify-center mx-auto mb-6">
          <span class="text-3xl text-white">🗺️</span>
        </div>
        <h3 class="text-2xl font-bold text-gray-900 mb-3">开始规划你的体验之旅</h3>
        <p class="text-gray-600 mb-6">
          选择起点、终点和兴趣类别，点击"生成体验路线"按钮，
          系统将为你规划一条充满惊喜的个性化路线。
        </p>
        <div class="flex items-center justify-center space-x-2 text-gray-500">
          <span>💡</span>
          <span class="text-sm">提示：多选几个兴趣类别，发现更多精彩</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 模拟地图动画 */
@keyframes pulse-dash {
  0% {
    stroke-dashoffset: 0;
  }
  100% {
    stroke-dashoffset: 10;
  }
}

.animate-pulse {
  animation: pulse-dash 1s linear infinite;
}
</style>