<template>
  <div class="app-screen">
    <AppHeader>
      <template #title>Drop-off destination</template>
      <template #subtitle>Search by address or landmark</template>
    </AppHeader>
    <input v-model="query" class="input" placeholder="Where to?" />
    <div class="card">
      <div class="section-title">Recent trips</div>
      <ul class="list">
        <li>NAIA Terminal 3</li>
        <li>UP Town Center</li>
        <li>Rockwell Center</li>
      </ul>
    </div>
    <button class="button button-primary" @click="useLocation">Use this drop-off</button>
  </div>
</template>

<script setup lang="ts">
import AppHeader from '../../components/AppHeader.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useBookingStore } from '../../store/booking'

const query = ref('BGC High Street, Taguig City')
const router = useRouter()
const booking = useBookingStore()

function useLocation() {
  booking.setDropoff({ address: query.value, lat: 14.5528, lng: 121.0514 })
  router.push('/booking/ride-options')
}
</script>

<style scoped>
.list { margin: 0; padding-left: 18px; color: var(--color-text-secondary); }
</style>
