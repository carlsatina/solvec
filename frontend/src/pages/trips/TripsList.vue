<template>
  <div class="app-screen">
    <AppHeader>
      <template #title>Trips</template>
      <template #subtitle>Your recent rides</template>
    </AppHeader>
    <div class="card">
      <div class="section-title">Makati → BGC</div>
      <p class="text-secondary">Aug 12 · PHP 286</p>
    </div>
    <div class="card">
      <div class="section-title">Ortigas → MOA</div>
      <p class="text-secondary">Aug 10 · PHP 320</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppHeader from '../../components/AppHeader.vue'
</script>
