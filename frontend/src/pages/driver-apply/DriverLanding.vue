<template>
  <div class="app-screen">
    <AppHeader>
      <template #title>Drive with Solvec</template>
      <template #subtitle>Earn with a premium EV fleet</template>
    </AppHeader>
    <div class="card">
      <div class="section-title">Why drivers choose us</div>
      <p class="text-secondary">Stable bookings, EV training, and city‑wide demand.</p>
    </div>
    <div class="card">
      <div class="section-title">Estimated weekly earnings</div>
      <p class="text-secondary">PHP 18,000 – 28,000 depending on hours.</p>
    </div>
    <button class="button button-primary">Apply now</button>
    <button class="button button-ghost">View requirements</button>
  </div>
</template>

<script setup lang="ts">
import AppHeader from '../../components/AppHeader.vue'
</script>
