<template>
  <div class="app-screen">
    <AppHeader>
      <template #title>Driver assigned</template>
      <template #subtitle>Juan D. is on the way</template>
    </AppHeader>
    <div class="map-wrapper">
      <NativeMap :center="center" />
    </div>
    <div class="card">
      <div class="section-title">Driver details</div>
      <p class="text-secondary">Toyota EV · ABC 1234 · 4.9 ⭐</p>
      <p class="text-secondary">Status: {{ booking.rideStatus ?? 'ASSIGNED' }}</p>
      <div class="actions">
        <button class="button button-secondary">Call</button>
        <button class="button button-secondary">Chat</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppHeader from '../../components/AppHeader.vue'
import NativeMap from '../../components/NativeMap.vue'
import { useBookingStore } from '../../store/booking'
import { watch } from 'vue'
import { useRouter } from 'vue-router'

const center = { lat: 14.5995, lng: 120.9842 }
const booking = useBookingStore()
const router = useRouter()

watch(
  () => booking.rideStatus,
  (status) => {
    if (status === 'IN_PROGRESS') router.push('/booking/in-progress')
    if (status === 'COMPLETED') router.push('/booking/completed')
  }
)
</script>

<style scoped>
.actions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-3);
}
.map-wrapper { height: 320px; }
</style>
