<template>
  <div class="app-screen search-screen">
    <header class="search-header">
      <button class="back-button" type="button" @click="goBack" aria-label="Back">
        <span class="back-icon" aria-hidden="true"></span>
      </button>
      <button class="location-pill" type="button" :disabled="locating" @click="useCurrentLocation">
        <span class="location-dot" aria-hidden="true"></span>
        <span>{{ locating ? 'Getting current location...' : 'Use my current location' }}</span>
      </button>
    </header>

    <div class="destination-bar">
      <span class="pin-icon" aria-hidden="true"></span>
      <input v-model="query" class="destination-input" placeholder="Enter pickup" />
      <button class="add-button" type="button" aria-label="Add">
        <span class="add-icon">+</span>
      </button>
    </div>

    <div class="chip-row">
      <button class="chip active" type="button">Suggested</button>
      <button class="chip" type="button">Saved</button>
    </div>

    <div v-if="loading" class="card loading-card">
      <div class="section-title">Searching...</div>
      <p class="text-secondary">Fetching nearby places</p>
    </div>

    <ul v-else class="place-list">
      <li
        v-for="place in results"
        :key="place.placeId"
        class="place-item"
        @click="pick(place.placeId)"
      >
        <div class="place-icon" aria-hidden="true"></div>
        <div class="place-body">
          <div class="place-title">{{ toTitle(place.description) }}</div>
          <div class="place-subtitle">{{ toSubtitle(place.description) }}</div>
        </div>
        <div class="place-actions" aria-hidden="true">
          <span class="bookmark"></span>
          <span class="more"></span>
        </div>
      </li>
      <li v-if="!results.length" class="empty-state">
        <div class="text-secondary">Type at least 3 characters</div>
      </li>
    </ul>

    <button class="button button-primary" :disabled="!selected" @click="useLocation">
      Use this pickup
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useBookingStore } from '../../store/booking'
import { usePlacesSearch } from '../../composables/usePlacesSearch'
import { getCurrentLocationPoint } from '../../composables/useCurrentLocation'

const router = useRouter()
const booking = useBookingStore()
const { query, results, loading, selectPlace } = usePlacesSearch()
const selected = ref<{ address: string; lat: number; lng: number } | null>(null)
const locating = ref(false)

function goBack() {
  router.back()
}

function toTitle(description: string) {
  return description.split(',')[0] || description
}

function toSubtitle(description: string) {
  const parts = description.split(',')
  const subtitle = parts.slice(1).join(',').trim()
  return subtitle || description
}

async function pick(placeId: string) {
  const details = await selectPlace(placeId)
  if (!details) return
  selected.value = { address: details.address, lat: details.lat, lng: details.lng }
  query.value = details.address
  booking.setPickup(selected.value)
  router.push('/booking/confirm-location/pickup')
}

function useLocation() {
  if (!selected.value) return
  booking.setPickup(selected.value)
  router.push('/booking/confirm-location/pickup')
}

async function useCurrentLocation() {
  if (locating.value) return
  locating.value = true
  try {
    const current = await getCurrentLocationPoint()
    selected.value = current
    query.value = current.address
    booking.setPickup(current)
    router.push('/booking/confirm-location/pickup')
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to fetch current location'
    window.alert(message)
  } finally {
    locating.value = false
  }
}
</script>

<style scoped>
.search-screen {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.search-header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.back-button {
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.back-icon {
  width: 18px;
  height: 18px;
  border-left: 3px solid #1b1f1e;
  border-bottom: 3px solid #1b1f1e;
  transform: rotate(45deg);
}

.location-pill {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-weight: 600;
  border: none;
  background: transparent;
  padding: 0;
}

.location-pill:disabled {
  opacity: 0.6;
}

.location-dot {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 4px solid #1b1f1e;
  background: #fff;
}

.destination-bar {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border-radius: 16px;
  background: #f1f2f3;
}

.pin-icon {
  width: 22px;
  height: 22px;
  border-radius: 50% 50% 50% 0;
  transform: rotate(-45deg);
  background: #f4a601;
}

.destination-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 16px;
  font-weight: 600;
  color: #1b1f1e;
}

.destination-input:focus { outline: none; }

.add-button {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  border: none;
  background: #37c6c5;
  color: #fff;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.add-icon { font-size: 18px; line-height: 1; }

.chip-row {
  display: flex;
  gap: var(--space-3);
}

.chip {
  padding: 8px 16px;
  border-radius: 999px;
  border: none;
  background: #f1f2f3;
  font-weight: 600;
  color: #1b1f1e;
}

.chip.active {
  background: #2f2f2f;
  color: #fff;
}

.place-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.place-item {
  display: grid;
  grid-template-columns: 40px 1fr auto;
  gap: var(--space-3);
  align-items: center;
}

.place-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f1f2f3;
  position: relative;
}

.place-icon::after {
  content: '';
  position: absolute;
  top: 10px;
  left: 14px;
  width: 12px;
  height: 12px;
  border: 2px solid #1b1f1e;
  border-radius: 50% 50% 50% 0;
  transform: rotate(-45deg);
}

.place-title {
  font-size: 16px;
  font-weight: 600;
}

.place-subtitle {
  font-size: 13px;
  color: var(--color-text-secondary);
}

.place-actions {
  display: flex;
  gap: var(--space-3);
  color: #737373;
}

.bookmark,
.more {
  width: 18px;
  height: 18px;
  display: inline-block;
  border: 2px solid #737373;
  border-radius: 4px;
}

.bookmark { border-radius: 3px 3px 0 0; }

.more {
  border: none;
  position: relative;
}

.more::before,
.more::after {
  content: '';
  position: absolute;
  left: 8px;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #737373;
}

.more::before { top: 3px; }

.more::after { top: 11px; }

.empty-state {
  padding: var(--space-4);
  background: #f1f2f3;
  border-radius: 12px;
}

.loading-card {
  background: #f1f2f3;
  border: none;
  box-shadow: none;
}
</style>
