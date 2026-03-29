<template>
  <div class="app-screen">
    <AppHeader>
      <template #title>Trip in progress</template>
      <template #subtitle>ETA 18 mins · C5 Route</template>
    </AppHeader>
    <MapPlaceholder />
    <div class="card">
      <div class="section-title">Safety tools</div>
      <p class="text-secondary">Share trip status or call emergency support</p>
      <button class="button button-ghost">Share trip</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppHeader from '../../components/AppHeader.vue'
import MapPlaceholder from '../../components/MapPlaceholder.vue'
</script>
