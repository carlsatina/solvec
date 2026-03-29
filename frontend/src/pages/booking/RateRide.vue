<template>
  <div class="app-screen">
    <AppHeader>
      <template #title>Rate your ride</template>
      <template #subtitle>Your feedback improves the service</template>
    </AppHeader>
    <div class="card">
      <div class="section-title">How was your trip?</div>
      <div class="stars">★★★★★</div>
      <input class="input" placeholder="Leave a comment" />
    </div>
    <button class="button button-primary">Submit rating</button>
  </div>
</template>

<script setup lang="ts">
import AppHeader from '../../components/AppHeader.vue'
</script>

<style scoped>
.stars { font-size: 24px; letter-spacing: 4px; color: var(--color-warning); }
</style>
