<template>
  <div class="app-screen">
    <AppHeader>
      <template #title>Availability</template>
      <template #subtitle>Step 3 of 4 · Schedule</template>
    </AppHeader>
    <div class="card">
      <div class="section-title">Preferred city</div>
      <p class="text-secondary">Makati, Taguig, Quezon City</p>
    </div>
    <div class="card">
      <div class="section-title">Working hours</div>
      <p class="text-secondary">Weekdays 7:00 AM - 9:00 PM</p>
    </div>
    <button class="button button-primary">Next</button>
  </div>
</template>

<script setup lang="ts">
import AppHeader from '../../components/AppHeader.vue'
</script>
