<template>
  <div class="app-screen">
    <AppHeader>
      <template #title>Finding a driver</template>
      <template #subtitle>Matching you with the nearest EV taxi</template>
    </AppHeader>
    <MapPlaceholder />
    <div class="card">
      <div class="section-title">Searching</div>
      <p class="text-secondary">Average wait time 2-4 minutes</p>
      <button class="button button-ghost">Cancel</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppHeader from '../../components/AppHeader.vue'
import MapPlaceholder from '../../components/MapPlaceholder.vue'
</script>
