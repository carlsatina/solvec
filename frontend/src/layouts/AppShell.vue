<template>
  <div class="app-shell">
    <router-view />
    <BottomTabBar v-if="showTabs" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import BottomTabBar from '../components/BottomTabBar.vue'

const route = useRoute()
const showTabs = computed(() => route.meta.showTabs !== false)
</script>

<style scoped>
.app-shell {
  min-height: 100vh;
  padding-bottom: 72px;
}
</style>
