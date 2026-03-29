<template>
  <div class="app-screen">
    <AppHeader>
      <template #title>Fare estimate</template>
      <template #subtitle>Transparent pricing in PHP</template>
    </AppHeader>
    <div class="card">
      <div class="section-title">Total</div>
      <div class="h2">PHP 286.00</div>
      <p class="text-secondary">Base fare + distance + time</p>
    </div>
    <div class="card">
      <div class="section-title">Breakdown</div>
      <ul class="list">
        <li>Base fare: PHP 60</li>
        <li>Distance: PHP 146</li>
        <li>Time: PHP 80</li>
      </ul>
    </div>
    <button class="button button-primary">Confirm fare</button>
  </div>
</template>

<script setup lang="ts">
import AppHeader from '../../components/AppHeader.vue'
</script>

<style scoped>
.list { margin: 0; padding-left: 18px; color: var(--color-text-secondary); }
</style>
