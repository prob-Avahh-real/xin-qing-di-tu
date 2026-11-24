<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouteStore } from '../stores/route'
import html2canvas from 'html2canvas'

const routeStore = useRouteStore()

// 表单数据
const startAddress = ref('北京市天安门广场')
const endAddress = ref('北京市故宫博物院')
const maxDuration = ref(240) // 分钟
const maxDistance = ref(5000) // 米

// 分享状态
const isSharing = ref(false)

// 计算预计时间范围
const timeRange = computed(() => {
  const hours = Math.floor(maxDuration.value / 60)
  const minutes = maxDuration.value % 60
  if (hours > 0) {
    return `${hours}小时${minutes}分钟`
  }
  return `${minutes}分钟`
})

// 处理类别切换
const handleCategoryToggle = (categoryId: string) => {
  routeStore.toggleCategory(categoryId)
}

// 生成路线
const handleGenerateRoute = () => {
  routeStore.generateRoute()
}

// 分享路线
const shareRoute = async () => {
  console.log('开始分享路线，当前路线:', routeStore.currentRoute?.name)
  
  if (!routeStore.currentRoute || isSharing.value) {
    console.log('分享条件不满足: 无路线或正在分享中')
    return
  }
  
  isSharing.value = true
  console.log('分享状态: 开始')
  
  try {
    // 找到路线统计卡片
    console.log('寻找路线卡片元素...')
    const routeCard = document.querySelector('.route-stats-card')
    console.log('找到的元素:', routeCard)
    
    if (!routeCard) {
      throw new Error('未找到路线卡片元素，请确保已生成路线')
    }
    
    // 检查html2canvas是否可用
    if (typeof html2canvas !== 'function') {
      throw new Error('html2canvas库未正确加载')
    }
    
    console.log('开始生成图片...')
    // 生成图片 - 使用简化配置
    const canvas = await html2canvas(routeCard as HTMLElement, {
      backgroundColor: '#ffffff',
      scale: 1, // 标准分辨率，提高兼容性
      useCORS: true,
      logging: true, // 开启日志便于调试
      allowTaint: true,
      foreignObjectRendering: false
    })
    
    console.log('图片生成成功，尺寸:', canvas.width, 'x', canvas.height)
    
    // 转换为Data URL
    const imageUrl = canvas.toDataURL('image/png')
    console.log('Data URL生成成功，长度:', imageUrl.length)
    
    // 创建下载链接
    const link = document.createElement('a')
    link.href = imageUrl
    const fileName = `PathJoy-路线-${routeStore.currentRoute.name}-${Date.now()}.png`
    link.download = fileName
    console.log('准备下载文件:', fileName)
    
    // 添加到DOM并触发点击
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    console.log('下载链接已触发')
    alert(`路线图片已保存: ${fileName}\n可以分享到社交媒体！`)
    
  } catch (error) {
    console.error('分享失败，详细错误:', error)
    console.error('错误类型:', typeof error)
    console.error('错误信息:', error.message)
    console.error('错误堆栈:', error.stack)
    
    // 尝试备用方案：截图整个应用
    try {
      console.log('尝试备用截图方案...')
      const appElement = document.querySelector('#app')
      if (appElement) {
        const canvas = await html2canvas(appElement as HTMLElement, {
          backgroundColor: '#ffffff',
          scale: 0.5
        })
        const link = document.createElement('a')
        link.href = canvas.toDataURL('image/png')
        link.download = `PathJoy-截图-${Date.now()}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        alert('已保存应用截图作为备用方案')
      }
    } catch (fallbackError) {
      console.error('备用方案也失败:', fallbackError)
      alert('分享功能暂时不可用，请手动截图分享。错误详情请查看控制台(F12)。')
    }
  } finally {
    isSharing.value = false
    console.log('分享状态: 结束')
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- 路线设置卡片 -->
    <div class="card">
      <h2 class="text-xl font-bold text-gray-900 mb-6">路线设置</h2>
      
      <!-- 起点终点 -->
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            起点
          </label>
          <div class="relative">
            <input 
              v-model="startAddress"
              type="text" 
              class="input-primary pl-10"
              placeholder="输入起点地址"
            >
            <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              🚩
            </div>
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            终点
          </label>
          <div class="relative">
            <input 
              v-model="endAddress"
              type="text" 
              class="input-primary pl-10"
              placeholder="输入终点地址"
            >
            <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              🎯
            </div>
          </div>
        </div>
      </div>
      
      <!-- 兴趣类别 -->
      <div class="mt-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">兴趣类别</h3>
        <div class="grid grid-cols-2 gap-3">
          <button
            v-for="category in routeStore.categories"
            :key="category.id"
            @click="handleCategoryToggle(category.id)"
            :class="[
              'flex items-center justify-center space-x-2 p-3 rounded-lg border transition-all',
              routeStore.selectedCategories.includes(category.id)
                ? 'border-primary-300 bg-primary-50 text-primary-700 shadow-sm'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700'
            ]"
          >
            <span class="text-xl">{{ category.icon }}</span>
            <span class="font-medium">{{ category.name }}</span>
          </button>
        </div>
      </div>
      
      <!-- 参数设置 -->
      <div class="mt-6 space-y-4">
        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="text-sm font-medium text-gray-700">
              最大时长: {{ timeRange }}
            </label>
            <span class="text-sm text-gray-500">{{ maxDuration }}分钟</span>
          </div>
          <input 
            v-model="maxDuration"
            type="range" 
            min="30" 
            max="480" 
            step="30"
            class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          >
          <div class="flex justify-between text-xs text-gray-500 mt-1">
            <span>30分钟</span>
            <span>8小时</span>
          </div>
        </div>
        
        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="text-sm font-medium text-gray-700">
              最大距离: {{ (maxDistance / 1000).toFixed(1) }}公里
            </label>
            <span class="text-sm text-gray-500">{{ maxDistance }}米</span>
          </div>
          <input 
            v-model="maxDistance"
            type="range" 
            min="500" 
            max="20000" 
            step="500"
            class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          >
          <div class="flex justify-between text-xs text-gray-500 mt-1">
            <span>0.5公里</span>
            <span>20公里</span>
          </div>
        </div>
      </div>
      
      <!-- 生成按钮 -->
      <button
        @click="handleGenerateRoute"
        :disabled="routeStore.isLoading"
        class="mt-8 w-full btn-primary py-3 text-lg font-semibold flex items-center justify-center space-x-3"
      >
        <span v-if="routeStore.isLoading" class="animate-spin">⏳</span>
        <span v-else>✨</span>
        <span>{{ routeStore.isLoading ? '正在生成...' : '生成体验路线' }}</span>
      </button>
    </div>
    
    <!-- 路线统计 -->
    <div v-if="routeStore.currentRoute" class="card route-stats-card">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">路线统计</h3>
      <div class="grid grid-cols-2 gap-4">
        <div class="text-center p-4 rounded-lg bg-primary-50">
          <div class="text-2xl font-bold text-primary-700">
            {{ routeStore.currentRoute.points.length }}
          </div>
          <div class="text-sm text-gray-600 mt-1">兴趣点</div>
        </div>
        <div class="text-center p-4 rounded-lg bg-secondary-50">
          <div class="text-2xl font-bold text-secondary-700">
            {{ (routeStore.currentRoute.totalDistance / 1000).toFixed(1) }}
          </div>
          <div class="text-sm text-gray-600 mt-1">公里</div>
        </div>
        <div class="text-center p-4 rounded-lg bg-amber-50">
          <div class="text-2xl font-bold text-amber-700">
            {{ Math.floor(routeStore.currentRoute.totalDuration / 60) }}
          </div>
          <div class="text-sm text-gray-600 mt-1">小时</div>
        </div>
        <div class="text-center p-4 rounded-lg bg-emerald-50">
          <div class="text-2xl font-bold text-emerald-700">
            {{ routeStore.currentRoute.experienceScore.toFixed(1) }}
          </div>
          <div class="text-sm text-gray-600 mt-1">体验分</div>
        </div>
      </div>
      
      <!-- 分享按钮 -->
      <button 
        @click="shareRoute"
        :disabled="isSharing || !routeStore.currentRoute"
        class="mt-6 w-full btn-secondary py-3 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span v-if="isSharing" class="animate-spin">⏳</span>
        <span v-else>📤</span>
        <span>{{ isSharing ? '生成分享图中...' : '分享路线' }}</span>
      </button>
    </div>
    
    <!-- 提示信息 -->
    <div class="card bg-blue-50 border-blue-200">
      <div class="flex items-start space-x-3">
        <div class="text-2xl text-blue-500">💡</div>
        <div>
          <h4 class="font-medium text-blue-900">使用提示</h4>
          <p class="text-sm text-blue-700 mt-1">
            选择你感兴趣的类别，系统会自动为你规划一条包含这些体验点的最佳路线。
            路线会平衡距离、时间和体验价值，确保旅程既高效又有趣。
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
input[type="range"]::-webkit-slider-thumb {
  @apply appearance-none w-5 h-5 rounded-full bg-primary-500 cursor-pointer;
}

input[type="range"]::-moz-range-thumb {
  @apply w-5 h-5 rounded-full bg-primary-500 cursor-pointer border-0;
}
</style>