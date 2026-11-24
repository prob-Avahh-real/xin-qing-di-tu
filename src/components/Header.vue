<script setup lang="ts">
import { ref } from 'vue'
import { useRouteStore } from '../stores/route'

const routeStore = useRouteStore()
const isMenuOpen = ref(false)

const handleGenerateRoute = () => {
  console.log('Header按钮点击，当前选中的兴趣类别:', routeStore.selectedCategories)
  routeStore.generateRoute()
}
</script>

<template>
  <header class="sticky top-0 z-40 glass border-b border-gray-200/50">
    <div class="container mx-auto px-4 py-4">
      <div class="flex items-center justify-between">
        <!-- Logo -->
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 
                      flex items-center justify-center shadow-lg">
            <span class="text-white font-bold text-xl">PJ</span>
          </div>
          <div>
            <h1 class="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 
                       bg-clip-text text-transparent">
              PathJoy
            </h1>
            <p class="text-sm text-gray-500">体验优先的出行路径设计</p>
          </div>
        </div>

        <!-- 导航 -->
        <nav class="hidden md:flex items-center space-x-8">
          <a href="#" class="text-gray-700 hover:text-primary-600 font-medium transition-colors">
            首页
          </a>
          <a href="#" class="text-gray-700 hover:text-primary-600 font-medium transition-colors">
            探索路线
          </a>
          <a href="#" class="text-gray-700 hover:text-primary-600 font-medium transition-colors">
            我的收藏
          </a>
          <a href="#" class="text-gray-700 hover:text-primary-600 font-medium transition-colors">
            关于我们
          </a>
        </nav>

        <!-- 用户操作 -->
        <div class="flex items-center space-x-4">
          <button class="btn-secondary flex items-center space-x-2">
            <span>分享</span>
            <span class="text-lg">↗️</span>
          </button>
          <button 
            @click="handleGenerateRoute"
            :disabled="routeStore.isLoading"
            class="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="routeStore.isLoading" class="animate-spin">⏳</span>
            <span v-else>✨</span>
            <span>{{ routeStore.isLoading ? '生成中...' : '生成路线' }}</span>
          </button>
          
          <!-- 移动端菜单按钮 -->
          <button 
            @click="isMenuOpen = !isMenuOpen"
            class="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <span class="text-2xl">☰</span>
          </button>
        </div>
      </div>

      <!-- 移动端菜单 -->
      <div v-if="isMenuOpen" class="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
        <div class="flex flex-col space-y-4">
          <a href="#" class="text-gray-700 hover:text-primary-600 font-medium py-2">
            首页
          </a>
          <a href="#" class="text-gray-700 hover:text-primary-600 font-medium py-2">
            探索路线
          </a>
          <a href="#" class="text-gray-700 hover:text-primary-600 font-medium py-2">
            我的收藏
          </a>
          <a href="#" class="text-gray-700 hover:text-primary-600 font-medium py-2">
            关于我们
          </a>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.glass {
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
</style>