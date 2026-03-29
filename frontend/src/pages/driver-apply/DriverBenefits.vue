<template>
  <div class="app-screen">
    <AppHeader>
      <template #title>Benefits</template>
      <template #subtitle>Why drivers choose Solvec</template>
    </AppHeader>
    <div class="card">
      <div class="section-title">Guaranteed demand</div>
      <p class="text-secondary">Priority dispatch during peak hours.</p>
    </div>
    <div class="card">
      <div class="section-title">Incentives</div>
      <p class="text-secondary">Weekly bonuses for top performers.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppHeader from '../../components/AppHeader.vue'
</script>
