<template>
  <div class="app-screen">
    <AppHeader>
      <template #title>Confirm booking</template>
      <template #subtitle>Review your trip details</template>
    </AppHeader>
    <div class="card">
      <div class="section-title">Pickup</div>
      <p class="text-secondary">Ayala Avenue, Makati City</p>
      <div class="section-title">Drop-off</div>
      <p class="text-secondary">BGC High Street, Taguig</p>
    </div>
    <div class="card">
      <div class="section-title">Estimated fare</div>
      <div class="h2">PHP 286.00</div>
      <p class="text-secondary">Eco · Cash</p>
    </div>
    <button class="button button-primary">Book now</button>
  </div>
</template>

<script setup lang="ts">
import AppHeader from '../../components/AppHeader.vue'
</script>
