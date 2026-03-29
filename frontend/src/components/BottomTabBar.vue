<template>
  <nav class="tab-bar">
    <RouterLink v-for="tab in tabs" :key="tab.path" :to="tab.path" class="tab-item" :class="{ active: route.path === tab.path }">
      <span class="tab-icon"></span>
      <span>{{ tab.label }}</span>
    </RouterLink>
  </nav>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

const tabs = [
  { label: 'Home', path: '/home' },
  { label: 'Trips', path: '/trips' },
  { label: 'Rewards', path: '/rewards' },
  { label: 'Alerts', path: '/notifications' },
  { label: 'Account', path: '/account' }
]
</script>

<style scoped>
.tab-icon {
  width: 20px;
  height: 20px;
  border-radius: 6px;
  background: currentColor;
  opacity: 0.24;
}
.tab-item.active .tab-icon { opacity: 1; }
</style>
