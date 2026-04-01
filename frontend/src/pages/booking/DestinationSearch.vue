<template>
  <div class="search-screen">
    <header class="search-header">
      <button class="back-button" type="button" @click="goBack" aria-label="Back">
        <span class="back-icon" aria-hidden="true"></span>
      </button>
      <span class="header-title">Plan your ride</span>
    </header>

    <!-- Route card -->
    <div class="route-card">
      <!-- Pickup row -->
      <div class="route-row" @click="activatePickup">
        <span class="route-dot pickup-dot" aria-hidden="true"></span>
        <div class="route-field">
          <input
            v-if="editingPickup"
            ref="pickupInputRef"
            v-model="pickupSearch.query.value"
            class="route-input"
            placeholder="Search pickup location"
            autocomplete="off"
            @focus="activeField = 'pickup'"
          />
          <span v-else class="route-value" :class="{ muted: locating }">
            {{ locating ? 'Getting your location…' : (booking.pickup?.address || 'Set pickup location') }}
          </span>
        </div>
        <span v-if="!editingPickup" class="route-edit-icon" aria-hidden="true">✎</span>
      </div>

      <div class="route-divider"></div>

      <!-- Destination row -->
      <div class="route-row">
        <span class="route-dot dest-dot" aria-hidden="true"></span>
        <div class="route-field">
          <input
            ref="destInputRef"
            v-model="destSearch.query.value"
            class="route-input"
            placeholder="Where to?"
            autocomplete="off"
            @focus="activeField = 'destination'"
          />
        </div>
      </div>
    </div>

    <!-- Search results -->
    <div v-if="activeField" class="results-area">
      <div v-if="activeSearch.loading.value" class="status-row">Searching…</div>

      <ul v-else-if="activeSearch.results.value.length" class="place-list">
        <li
          v-for="place in activeSearch.results.value"
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

      <div
        v-else-if="activeSearch.query.value.length >= 3"
        class="status-row"
      >No results found</div>

      <div v-else class="status-row">Type at least 3 characters</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useBookingStore } from '../../store/booking'
import { usePlacesSearch } from '../../composables/usePlacesSearch'
import { getCurrentLocationPoint } from '../../composables/useCurrentLocation'

const router = useRouter()
const booking = useBookingStore()

const pickupSearch = usePlacesSearch()
const destSearch = usePlacesSearch()

const locating = ref(false)
const editingPickup = ref(false)
const activeField = ref<'pickup' | 'destination' | null>(null)

const pickupInputRef = ref<HTMLInputElement | null>(null)
const destInputRef = ref<HTMLInputElement | null>(null)

const activeSearch = computed(() =>
  activeField.value === 'pickup' ? pickupSearch : destSearch
)

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

async function activatePickup() {
  editingPickup.value = true
  activeField.value = 'pickup'
  await nextTick()
  pickupInputRef.value?.focus()
}

async function pick(placeId: string) {
  const details = await activeSearch.value.selectPlace(placeId)
  if (!details) return

  const location = { address: details.address, lat: details.lat, lng: details.lng }

  if (activeField.value === 'pickup') {
    booking.setPickup(location)
    editingPickup.value = false
    pickupSearch.query.value = ''
    activeField.value = 'destination'
    await nextTick()
    destInputRef.value?.focus()
  } else {
    booking.setDropoff(location)
    router.push('/booking/confirm-location/pickup')
  }
}

onMounted(async () => {
  // Auto-fetch GPS and set as pickup immediately
  locating.value = true
  try {
    const location = await getCurrentLocationPoint()
    booking.setPickup(location)
  } catch {
    // GPS unavailable — leave pickup empty so user can search manually
  } finally {
    locating.value = false
  }

  // Focus destination after location resolves
  await nextTick()
  destInputRef.value?.focus()
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

/* Route card */
.route-card {
  background: #f9fafb;
  border: 1.5px solid #e5e7eb;
  border-radius: 18px;
  padding: 4px 0;
  display: flex;
  flex-direction: column;
}

.route-row {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: 14px 16px;
  cursor: pointer;
}

.route-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.pickup-dot {
  background: #37c6c5;
  box-shadow: 0 0 0 3px rgba(55, 198, 197, 0.2);
}

.dest-dot {
  background: #f4a601;
  box-shadow: 0 0 0 3px rgba(244, 166, 1, 0.2);
  border-radius: 3px;
}

.route-divider {
  height: 1px;
  background: #e5e7eb;
  margin: 0 16px;
}

.route-field {
  flex: 1;
  min-width: 0;
}

.route-value {
  font-size: 15px;
  font-weight: 600;
  color: #1b1f1e;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}

.route-value.muted {
  color: #9ca3af;
  font-weight: 400;
}

.route-input {
  width: 100%;
  border: none;
  background: transparent;
  font-size: 15px;
  font-weight: 600;
  color: #1b1f1e;
}

.route-input:focus { outline: none; }

.route-input::placeholder {
  color: #9ca3af;
  font-weight: 400;
}

.route-edit-icon {
  font-size: 16px;
  color: #9ca3af;
  flex-shrink: 0;
}

/* Results */
.results-area {
  flex: 1;
  display: flex;
  flex-direction: column;
}

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
  padding: 12px 0;
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
</style>
