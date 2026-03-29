<template>
  <div class="app-screen">
    <AppHeader>
      <template #title>Pick-up location</template>
      <template #subtitle>Use landmarks and barangay names</template>
    </AppHeader>
    <input v-model="query" class="input" placeholder="Search pickup" />
    <div class="card">
      <div class="section-title">Nearby</div>
      <ul class="list">
        <li>SM Mall of Asia</li>
        <li>Ayala Triangle Gardens</li>
        <li>Bonifacio Global City</li>
      </ul>
    </div>
    <button class="button button-primary" @click="useLocation">Use this pickup</button>
  </div>
</template>

<script setup lang="ts">
import AppHeader from '../../components/AppHeader.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useBookingStore } from '../../store/booking'

const query = ref('Ayala Avenue, Makati City')
const router = useRouter()
const booking = useBookingStore()

function useLocation() {
  booking.setPickup({ address: query.value, lat: 14.5547, lng: 121.0244 })
  router.push('/booking/destination')
}
</script>

<style scoped>
.list { margin: 0; padding-left: 18px; color: var(--color-text-secondary); }
</style>
