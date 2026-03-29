<template>
  <div class="app-screen">
    <AppHeader>
      <template #title>Payment method</template>
      <template #subtitle>Choose how you want to pay</template>
    </AppHeader>
    <div class="card">
      <div class="section-title">Cash</div>
      <p class="text-secondary">Pay directly to driver</p>
    </div>
    <div class="card">
      <div class="section-title">E-wallet</div>
      <p class="text-secondary">GCash or Maya</p>
    </div>
    <div class="card">
      <div class="section-title">Card</div>
      <p class="text-secondary">Visa / Mastercard</p>
    </div>
    <button class="button button-primary">Continue</button>
  </div>
</template>

<script setup lang="ts">
import AppHeader from '../../components/AppHeader.vue'
</script>
