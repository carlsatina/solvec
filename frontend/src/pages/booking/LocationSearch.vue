<template>
  <div class="search-screen">
    <header class="search-header">
      <button class="back-button" type="button" @click="goBack" aria-label="Back">
        <span class="back-icon" aria-hidden="true"></span>
      </button>
      <span class="header-title">Set pickup</span>
    </header>

    <!-- Current location pill (tap to switch to search input) -->
    <div v-if="!isEditing" class="location-pill" @click="startEditing">
      <span class="pulse-dot" :class="{ locating }" aria-hidden="true"></span>
      <span class="pill-text">
        {{ locating ? 'Getting your location…' : (currentLocation?.address || 'Tap to search pickup') }}
      </span>
      <span class="pill-chevron" aria-hidden="true">›</span>
    </div>

    <!-- Search input (shown after tapping the pill) -->
    <div v-else class="destination-bar">
      <span class="pin-icon" aria-hidden="true"></span>
      <input
        ref="inputRef"
        v-model="query"
        class="destination-input"
        placeholder="Search pickup location"
        autocomplete="off"
      />
      <button class="clear-button" type="button" aria-label="Cancel search" @click="cancelEditing">
        <span class="clear-icon" aria-hidden="true"></span>
      </button>
    </div>

    <!-- Results list (visible while editing) -->
    <template v-if="isEditing">
      <div v-if="loading" class="status-row">Searching…</div>
      <ul v-else-if="results.length" class="place-list">
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
        </li>
      </ul>
      <div v-else-if="query.length >= 3" class="status-row">No results found</div>
      <div v-else class="status-row">Type at least 3 characters to search</div>
    </template>

    <!-- Confirm current location (visible while not editing) -->
    <template v-else>
      <button
        class="button button-primary confirm-button"
        :disabled="!currentLocation || locating"
        @click="confirmCurrentLocation"
      >
        {{ locating ? 'Getting location…' : 'Use current location' }}
      </button>
    </template>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useBookingStore } from '../../store/booking'
import { usePlacesSearch } from '../../composables/usePlacesSearch'
import { getCurrentLocationPoint } from '../../composables/useCurrentLocation'

const router = useRouter()
const booking = useBookingStore()
const { query, results, loading, selectPlace } = usePlacesSearch()

const currentLocation = ref<{ address: string; lat: number; lng: number } | null>(null)
const locating = ref(false)
const isEditing = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)

function goBack() {
  router.back()
}

function toTitle(description: string) {
  return description.split(',')[0] || description
}

function toSubtitle(description: string) {
  const parts = description.split(',')
  return parts.slice(1).join(',').trim() || description
}

async function startEditing() {
  isEditing.value = true
  await nextTick()
  inputRef.value?.focus()
}

function cancelEditing() {
  isEditing.value = false
  query.value = ''
}

async function pick(placeId: string) {
  const details = await selectPlace(placeId)
  if (!details) return
  const location = { address: details.address, lat: details.lat, lng: details.lng }
  booking.setPickup(location)
  router.push('/booking/confirm-location/pickup')
}

function confirmCurrentLocation() {
  if (!currentLocation.value) return
  booking.setPickup(currentLocation.value)
  router.push('/booking/confirm-location/pickup')
}

onMounted(async () => {
  locating.value = true
  try {
    const location = await getCurrentLocationPoint()
    currentLocation.value = location
    booking.setPickup(location)
  } catch {
    // Permission denied or GPS unavailable — let user search manually
    isEditing.value = true
    await nextTick()
    inputRef.value?.focus()
  } finally {
    locating.value = false
  }
})
</script>

<style scoped>
.search-screen {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding: var(--space-5);
  min-height: 100vh;
  background: #fff;
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
  flex-shrink: 0;
}

.back-icon {
  width: 18px;
  height: 18px;
  border-left: 3px solid #1b1f1e;
  border-bottom: 3px solid #1b1f1e;
  transform: rotate(45deg);
}

.header-title {
  font-size: 18px;
  font-weight: 700;
  color: #1b1f1e;
}

/* Current location pill */
.location-pill {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: 14px 16px;
  background: #f1f8f8;
  border: 2px solid #37c6c5;
  border-radius: 16px;
  cursor: pointer;
}

.pulse-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #37c6c5;
  flex-shrink: 0;
  transition: background 200ms;
}

.pulse-dot.locating {
  animation: pulse 1.2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.8); }
}

.pill-text {
  flex: 1;
  font-size: 15px;
  font-weight: 600;
  color: #1b1f1e;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pill-chevron {
  font-size: 22px;
  color: #37c6c5;
  line-height: 1;
}

/* Search input bar */
.destination-bar {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: 14px 16px;
  border-radius: 16px;
  background: #f1f2f3;
  border: 2px solid transparent;
  transition: border-color 200ms;
}

.destination-bar:focus-within {
  border-color: #37c6c5;
  background: #fff;
}

.pin-icon {
  width: 18px;
  height: 18px;
  border-radius: 50% 50% 50% 0;
  transform: rotate(-45deg);
  background: #f4a601;
  flex-shrink: 0;
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

.clear-button {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  background: #d1d5db;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.clear-icon {
  width: 10px;
  height: 10px;
  position: relative;
  display: block;
}

.clear-icon::before,
.clear-icon::after {
  content: '';
  position: absolute;
  width: 10px;
  height: 2px;
  background: #fff;
  border-radius: 1px;
  top: 4px;
  left: 0;
}

.clear-icon::before { transform: rotate(45deg); }
.clear-icon::after { transform: rotate(-45deg); }

/* Results */
.place-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.place-item {
  display: grid;
  grid-template-columns: 40px 1fr;
  gap: var(--space-3);
  align-items: center;
  padding: var(--space-3) 0;
  border-bottom: 1px solid #f1f2f3;
  cursor: pointer;
}

.place-item:active { background: #f9fafb; }

.place-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f1f2f3;
  position: relative;
  flex-shrink: 0;
}

.place-icon::after {
  content: '';
  position: absolute;
  top: 10px;
  left: 14px;
  width: 12px;
  height: 12px;
  border: 2px solid #6b7280;
  border-radius: 50% 50% 50% 0;
  transform: rotate(-45deg);
}

.place-title {
  font-size: 15px;
  font-weight: 600;
  color: #1b1f1e;
}

.place-subtitle {
  font-size: 13px;
  color: var(--color-text-secondary);
  margin-top: 2px;
}

.status-row {
  font-size: 14px;
  color: var(--color-text-secondary);
  padding: var(--space-3) 0;
}

.confirm-button {
  margin-top: auto;
}
</style>
