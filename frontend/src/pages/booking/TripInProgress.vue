<template>
  <div class="app-screen">
    <AppHeader>
      <template #title>Trip in progress</template>
      <template #subtitle>ETA 18 mins · C5 Route</template>
    </AppHeader>
    <div class="map-wrapper">
      <NativeMap :center="center" />
    </div>
    <div class="card">
      <div class="section-title">Safety tools</div>
      <p class="text-secondary">Share trip status or call emergency support</p>
      <button class="button button-ghost">Share trip</button>
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
    if (status === 'COMPLETED') router.push('/booking/completed')
  }
)
</script>

<style scoped>
.map-wrapper { height: 320px; }
</style>
