<template>
  <div class="app-screen">
    <AppHeader>
      <template #title>Finding a driver</template>
      <template #subtitle>Matching you with the nearest EV taxi</template>
    </AppHeader>
    <div class="map-wrapper">
      <NativeMap :center="center" />
    </div>
    <div class="card">
      <div class="section-title">Searching</div>
      <p class="text-secondary">Average wait time 2-4 minutes</p>
      <button class="button button-ghost">Cancel</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppHeader from '../../components/AppHeader.vue'
import NativeMap from '../../components/NativeMap.vue'

const center = { lat: 14.5995, lng: 120.9842 }
</script>

<style scoped>
.map-wrapper { height: 320px; }
</style>
