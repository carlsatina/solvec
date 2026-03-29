<template>
  <div class="app-screen">
    <AppHeader>
      <template #title>Pick-up location</template>
      <template #subtitle>Use landmarks and barangay names</template>
    </AppHeader>
    <input class="input" placeholder="Search pickup" />
    <div class="card">
      <div class="section-title">Nearby</div>
      <ul class="list">
        <li>SM Mall of Asia</li>
        <li>Ayala Triangle Gardens</li>
        <li>Bonifacio Global City</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppHeader from '../../components/AppHeader.vue'
</script>

<style scoped>
.list { margin: 0; padding-left: 18px; color: var(--color-text-secondary); }
</style>
