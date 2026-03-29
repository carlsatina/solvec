<template>
  <div class="app-screen">
    <AppHeader>
      <template #title>Drop-off destination</template>
      <template #subtitle>Search by address or landmark</template>
    </AppHeader>
    <input v-model="query" class="input" placeholder="Where to?" />
    <div v-if="loading" class="card">
      <div class="section-title">Searching...</div>
      <p class="text-secondary">Fetching nearby places</p>
    </div>
    <div v-else class="card">
      <div class="section-title">Results</div>
      <ul class="list">
        <li v-for="place in results" :key="place.placeId" @click="pick(place.placeId)">
          {{ place.description }}
        </li>
      </ul>
      <p v-if="!results.length" class="text-secondary">Type at least 3 characters</p>
    </div>
    <button class="button button-primary" :disabled="!selected" @click="useLocation">Use this drop-off</button>
  </div>
</template>

<script setup lang="ts">
import AppHeader from '../../components/AppHeader.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useBookingStore } from '../../store/booking'
import { usePlacesSearch } from '../../composables/usePlacesSearch'

const router = useRouter()
const booking = useBookingStore()
const { query, results, loading, selectPlace } = usePlacesSearch()
const selected = ref<{ address: string; lat: number; lng: number } | null>(null)

async function pick(placeId: string) {
  const details = await selectPlace(placeId)
  if (!details) return
  selected.value = { address: details.address, lat: details.lat, lng: details.lng }
  query.value = details.address
}

function useLocation() {
  if (!selected.value) return
  booking.setDropoff(selected.value)
  router.push('/booking/ride-options')
}
</script>

<style scoped>
.list { margin: 0; padding-left: 18px; color: var(--color-text-secondary); }
</style>
