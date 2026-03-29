<template>
  <div class="app-screen">
    <AppHeader>
      <template #title>Application status</template>
      <template #subtitle>Tracking your progress</template>
    </AppHeader>
    <div class="card">
      <div class="section-title">Status</div>
      <p class="text-secondary">Under review · Estimated 2 days</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppHeader from '../../components/AppHeader.vue'
</script>
