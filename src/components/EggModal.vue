<template>
  <div v-if="isVisible" class="modal-overlay" @click="handleOverlayClick">
    <div class="modal-content" @click.stop>
      <button class="close-btn" @click="closeModal">×</button>
      
      <div class="modal-header">
        <span class="modal-icon">{{ icon }}</span>
        <h3>{{ title }}</h3>
      </div>
      
      <div class="modal-body">
        <slot name="content">
          <p v-if="message" class="modal-message">{{ message }}</p>
          <div v-if="story" class="modal-story">{{ story }}</div>
          <div v-if="location" class="modal-location">📍 {{ location }}</div>
        </slot>
      </div>
      
      <div v-if="showPoints" class="points-reward">
        <span class="trophy">🏆</span>
        <span class="points">+{{ pointsReward }} 积分</span>
      </div>
      
      <button class="confirm-btn" @click="confirmAction">
        {{ confirmText }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  isVisible?: boolean
  title?: string
  icon?: string
  message?: string
  story?: string
  location?: string
  pointsReward?: number
  showPoints?: boolean
  confirmText?: string
}

const props = withDefaults(defineProps<Props>(), {
  isVisible: false,
  title: '彩蛋',
  icon: '🎁',
  message: '',
  story: '',
  location: '',
  pointsReward: 30,
  showPoints: true,
  confirmText: '继续探索'
})

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'confirm'): void
}>()

const isVisible = ref(props.isVisible)

watch(() => props.isVisible, (newVal) => {
  isVisible.value = newVal
})

function closeModal() {
  isVisible.value = false
  emit('close')
}

function handleOverlayClick() {
  closeModal()
}

function confirmAction() {
  emit('confirm')
  closeModal()
}
</script>

<style scoped>
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

.modal-content {
  background: white;
  width: 85%;
  max-width: 340px;
  border-radius: 36px;
  padding: 32px 28px;
  text-align: center;
  animation: slide-up 0.3s ease;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

@keyframes slide-up {
  from {
    transform: translateY(40px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 20px;
  background: none;
  border: none;
  font-size: 28px;
  color: #b3a097;
  cursor: pointer;
  transition: color 0.2s;
  padding: 0;
  line-height: 1;
}

.close-btn:hover {
  color: #5a4a42;
}

.modal-header {
  margin-bottom: 20px;
}

.modal-icon {
  font-size: 4rem;
  display: block;
  margin-bottom: 12px;
}

.modal-header h3 {
  color: #E87A5D;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

.modal-body {
  margin-bottom: 24px;
}

.modal-message {
  color: #5a4a42;
  font-size: 1rem;
  line-height: 1.6;
  margin: 12px 0;
}

.modal-story {
  background: #fef3e8;
  color: #b77b5c;
  padding: 16px;
  border-radius: 16px;
  font-size: 0.95rem;
  line-height: 1.6;
  margin: 16px 0;
  text-align: left;
}

.modal-location {
  color: #E87A5D;
  font-weight: 500;
  font-size: 0.9rem;
  margin-top: 12px;
  padding: 8px 16px;
  background: #fff5f0;
  border-radius: 20px;
  display: inline-block;
}

.points-reward {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 24px;
  padding: 12px;
  background: linear-gradient(135deg, #fef3e8 0%, #fee6d6 100%);
  border-radius: 20px;
}

.trophy {
  font-size: 1.5rem;
}

.points {
  color: #E87A5D;
  font-weight: 700;
  font-size: 1.2rem;
}

.confirm-btn {
  background: linear-gradient(135deg, #F9B572, #f4a25e);
  border: none;
  padding: 14px 40px;
  border-radius: 40px;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  width: 100%;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(249, 181, 114, 0.3);
}

.confirm-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(249, 181, 114, 0.4);
}

.confirm-btn:active {
  transform: translateY(0);
}
</style>
