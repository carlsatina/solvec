<template>
  <div class="app-screen">
    <AppHeader>
      <template #title>Upload documents</template>
      <template #subtitle>Step 2 of 4 · Verification</template>
    </AppHeader>
    <div class="card">
      <div class="section-title">Driver's license</div>
      <button class="button button-secondary">Upload</button>
    </div>
    <div class="card">
      <div class="section-title">NBI clearance</div>
      <button class="button button-secondary">Upload</button>
    </div>
    <button class="button button-primary">Next</button>
  </div>
</template>

<script setup lang="ts">
import AppHeader from '../../components/AppHeader.vue'
</script>
