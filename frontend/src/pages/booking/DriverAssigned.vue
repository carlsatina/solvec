<template>
  <div class="app-screen">
    <AppHeader>
      <template #title>Driver assigned</template>
      <template #subtitle>Juan D. is on the way</template>
    </AppHeader>
    <MapPlaceholder />
    <div class="card">
      <div class="section-title">Driver details</div>
      <p class="text-secondary">Toyota EV · ABC 1234 · 4.9 ⭐</p>
      <div class="actions">
        <button class="button button-secondary">Call</button>
        <button class="button button-secondary">Chat</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppHeader from '../../components/AppHeader.vue'
import MapPlaceholder from '../../components/MapPlaceholder.vue'
</script>

<style scoped>
.actions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-3);
}
</style>
