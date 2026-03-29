<template>
  <div class="app-screen">
    <AppHeader>
      <template #title>Notifications</template>
      <template #subtitle>Trip updates and promos</template>
    </AppHeader>
    <div class="card">
      <div class="section-title">Driver assigned</div>
      <p class="text-secondary">Juan D. is 3 minutes away.</p>
    </div>
    <div class="card">
      <div class="section-title">Promo unlocked</div>
      <p class="text-secondary">Use GREEN50 on your next ride.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppHeader from '../../components/AppHeader.vue'
</script>
