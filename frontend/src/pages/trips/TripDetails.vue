<template>
  <div class="app-screen">
    <AppHeader>
      <template #title>Trip details</template>
      <template #subtitle>Receipt and route</template>
    </AppHeader>
    <MapPlaceholder />
    <div class="card">
      <div class="section-title">Fare</div>
      <p class="text-secondary">PHP 286 · Cash</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppHeader from '../../components/AppHeader.vue'
import MapPlaceholder from '../../components/MapPlaceholder.vue'
</script>
