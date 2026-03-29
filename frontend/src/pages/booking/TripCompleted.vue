<template>
  <div class="app-screen">
    <AppHeader>
      <template #title>Trip completed</template>
      <template #subtitle>Thank you for riding electric</template>
    </AppHeader>
    <div class="card">
      <div class="section-title">Total paid</div>
      <div class="h2">PHP 286.00</div>
      <p class="text-secondary">Receipt sent to your email</p>
    </div>
    <button class="button button-primary">Rate your ride</button>
  </div>
</template>

<script setup lang="ts">
import AppHeader from '../../components/AppHeader.vue'
</script>
