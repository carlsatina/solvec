<template>
  <div class="app-screen home">
    <AppHeader>
      <template #title>Good afternoon</template>
      <template #subtitle>Where are you headed today?</template>
    </AppHeader>
    <div class="map-wrapper">
      <NativeMap :center="center" />
    </div>
    <div class="service-row">
      <div class="card service-card">
        <div class="section-title">Eco</div>
        <p class="text-secondary">Affordable electric ride</p>
      </div>
      <div class="card service-card">
        <div class="section-title">Comfort</div>
        <p class="text-secondary">More space, quieter ride</p>
      </div>
    </div>
    <BookingCard />
  </div>
</template>

<script setup lang="ts">
import AppHeader from '../../components/AppHeader.vue'
import NativeMap from '../../components/NativeMap.vue'
import BookingCard from '../../components/BookingCard.vue'

const center = { lat: 14.5995, lng: 120.9842 }
</script>

<style scoped>
.home { padding-bottom: 120px; }
.map-wrapper { height: 320px; }
.service-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-3);
}
.service-card { min-height: 96px; }
</style>
