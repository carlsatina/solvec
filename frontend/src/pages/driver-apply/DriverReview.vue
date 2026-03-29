<template>
  <div class="app-screen">
    <AppHeader>
      <template #title>Review</template>
      <template #subtitle>Step 4 of 4 · Confirm details</template>
    </AppHeader>
    <div class="card">
      <div class="section-title">Summary</div>
      <p class="text-secondary">Personal details and uploaded documents</p>
    </div>
    <button class="button button-primary">Submit application</button>
  </div>
</template>

<script setup lang="ts">
import AppHeader from '../../components/AppHeader.vue'
</script>
