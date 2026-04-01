<template>
  <div class="confirm-screen">
    <div class="map-container">
      <button class="map-back" type="button" @click="goBack" aria-label="Back">
        <span class="back-icon" aria-hidden="true"></span>
      </button>
      <NativeMap
        :center="mapCenter"
        :zoom="17"
        :map-id="mapId"
        :markers="noMarkers"
        :interactive="true"
        @camera-idle="onCameraIdle"
      />
      <!-- CSS pin fixed at map center — stays put while the map pans beneath it -->
      <div class="map-pin-wrap" aria-hidden="true">
        <div class="map-pin-head" :class="{ geocoding }"></div>
        <div class="map-pin-shadow"></div>
      </div>
    </div>

    <section class="sheet">
      <div class="sheet-handle"></div>
      <div class="sheet-chip">{{ chipLabel }}</div>
      <div class="sheet-list">
        <div class="sheet-item">
          <div class="sheet-icon"></div>
          <div class="sheet-copy">
            <div class="sheet-title">{{ titleText }}</div>
            <div class="sheet-subtitle">{{ subtitleText }}</div>
          </div>
          <button class="sheet-edit" type="button" aria-label="Edit"></button>
        </div>
        <div class="sheet-item muted" v-for="option in nearbyOptions" :key="option.title">
          <div class="sheet-icon"></div>
          <div class="sheet-copy">
            <div class="sheet-title">{{ option.title }}</div>
            <div class="sheet-subtitle">{{ option.subtitle }}</div>
          </div>
        </div>
      </div>

      <button class="note-row" type="button">
        <span class="note-icon" aria-hidden="true"></span>
        Enter note for driver.
      </button>

      <button class="button button-primary confirm-button" type="button" @click="confirmLocation">
        {{ confirmLabel }}
      </button>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import NativeMap from '../../components/NativeMap.vue'
import { useBookingStore } from '../../store/booking'
import { api } from '../../services/api'

const route = useRoute()
const router = useRouter()
const booking = useBookingStore()

const type = computed(() => (route.params.type === 'dropoff' ? 'dropoff' : 'pickup'))
const current = computed(() => (type.value === 'pickup' ? booking.pickup : booking.dropoff))

// Static initial center — does not react to store changes so the map
// doesn't re-pan after the user drags the marker.
const mapCenter = ref(
  current.value
    ? { lat: current.value.lat, lng: current.value.lng }
    : { lat: 14.5995, lng: 120.9842 }
)
const mapId = computed(() => `solvec-map-${type.value}`)

// No native markers — we use a CSS pin fixed at the screen center instead.
// Stable reference prevents the NativeMap watcher from re-panning the camera.
const noMarkers: Array<{ lat: number; lng: number }> = []

const resolvedAddress = ref(current.value?.address ?? '')
const geocoding = ref(false)

const confirmLabel = computed(() => (type.value === 'pickup' ? 'Confirm Pickup' : 'Confirm drop-off'))
const chipLabel = computed(() =>
  geocoding.value
    ? 'Finding address…'
    : resolvedAddress.value
      ? `Near ${resolvedAddress.value.split(',')[0]}`
      : 'Move map to select location'
)
const titleText = computed(() =>
  geocoding.value ? '…' : resolvedAddress.value.split(',')[0] || 'Select location'
)
const subtitleText = computed(() =>
  geocoding.value ? '' : resolvedAddress.value || 'Choose a nearby landmark'
)

const nearbyOptions = computed(() => {
  if (!resolvedAddress.value || geocoding.value) return []
  const parts = resolvedAddress.value.split(',')
  const area = parts.slice(1).join(',').trim() || resolvedAddress.value
  return [
    { title: parts[0], subtitle: area },
    { title: `${parts[0]} Corner`, subtitle: area },
    { title: `${parts[0]} Entrance`, subtitle: area }
  ]
})

// Track latest camera center so confirmLocation uses up-to-date coords
// even if the user taps confirm right after panning (before geocode finishes).
const latestCoords = ref({ lat: mapCenter.value.lat, lng: mapCenter.value.lng })
let geocodeTimer: ReturnType<typeof setTimeout> | null = null

function onCameraIdle(coords: { lat: number; lng: number }) {
  latestCoords.value = coords
  if (geocodeTimer) clearTimeout(geocodeTimer)
  // Debounce to avoid a geocode call on every intermediate camera position
  geocodeTimer = setTimeout(async () => {
    geocoding.value = true
    try {
      const result = await api.reverseGeocode(coords.lat, coords.lng)
      resolvedAddress.value = result.address
      const location = { address: result.address, lat: coords.lat, lng: coords.lng }
      if (type.value === 'pickup') {
        booking.setPickup(location)
      } else {
        booking.setDropoff(location)
      }
    } catch {
      // keep existing address on error
    } finally {
      geocoding.value = false
    }
  }, 600)
}

function goBack() {
  router.back()
}

function confirmLocation() {
  // If geocode hasn't settled yet, commit the current camera center with the
  // last known address so the user isn't blocked.
  if (geocodeTimer) {
    clearTimeout(geocodeTimer)
    geocodeTimer = null
    const location = { address: resolvedAddress.value, lat: latestCoords.value.lat, lng: latestCoords.value.lng }
    if (type.value === 'pickup') booking.setPickup(location)
    else booking.setDropoff(location)
  }

  if (type.value === 'pickup') {
    if (booking.dropoff) {
      router.push('/booking/ride-options')
      return
    }
    router.push('/booking/destination')
    return
  }
  router.push('/booking/ride-options')
}
</script>

<style scoped>
.confirm-screen {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: transparent;
}

.map-back {
  position: absolute;
  top: 16px;
  left: 16px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  background: #fff;
  box-shadow: 0 8px 16px rgba(17, 24, 39, 0.16);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  z-index: 5;
}

.back-icon {
  width: 16px;
  height: 16px;
  border-left: 3px solid #1b1f1e;
  border-bottom: 3px solid #1b1f1e;
  transform: rotate(45deg);
}

.map-container {
  flex: 1;
  position: relative;
  background: transparent;
}

.map-container :deep(.native-map) {
  border-radius: 0;
  height: 100%;
}

/* Center pin — sits over the transparent WebView, always at map center */
.map-pin-wrap {
  position: absolute;
  top: 50%;
  left: 50%;
  /* Translate so the tip of the rotated-square pin points to exact center */
  transform: translate(-50%, -100%) translateY(6px);
  pointer-events: none;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.map-pin-head {
  width: 36px;
  height: 36px;
  border-radius: 50% 50% 50% 0;
  background: #37c6c5;
  transform: rotate(-45deg);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.28);
  position: relative;
  transition: background 0.2s;
}

/* Inner white circle (counter-rotate to undo the parent -45deg) */
.map-pin-head::after {
  content: '';
  position: absolute;
  inset: 9px;
  border-radius: 50%;
  background: #fff;
  transform: rotate(45deg);
}

.map-pin-head.geocoding {
  background: #94a3b8;
}

.map-pin-shadow {
  width: 12px;
  height: 4px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.15);
}


.sheet {
  background: #eaf8f8;
  border-radius: 24px 24px 0 0;
  padding: 12px 18px 24px;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.sheet-handle {
  width: 42px;
  height: 4px;
  border-radius: 999px;
  background: #cfe3e3;
  margin: 0 auto;
}

.sheet-chip {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-secondary);
  text-align: center;
}

.sheet-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.sheet-item {
  display: grid;
  grid-template-columns: 40px 1fr auto;
  gap: var(--space-3);
  align-items: center;
  padding: 8px 0;
}

.sheet-item.muted {
  opacity: 0.7;
}

.sheet-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #fff;
  position: relative;
  box-shadow: 0 6px 12px rgba(17, 24, 39, 0.08);
}

.sheet-icon::after {
  content: '';
  position: absolute;
  top: 9px;
  left: 12px;
  width: 12px;
  height: 12px;
  border: 2px solid #1b1f1e;
  border-radius: 50% 50% 50% 0;
  transform: rotate(-45deg);
}

.sheet-title {
  font-size: 16px;
  font-weight: 600;
}

.sheet-subtitle {
  font-size: 13px;
  color: var(--color-text-secondary);
}

.sheet-edit {
  width: 20px;
  height: 20px;
  border: none;
  background: transparent;
  position: relative;
}

.sheet-edit::before {
  content: '';
  position: absolute;
  width: 14px;
  height: 2px;
  background: #1b1f1e;
  transform: rotate(-45deg);
  top: 9px;
  left: 3px;
}

.sheet-edit::after {
  content: '';
  position: absolute;
  width: 8px;
  height: 8px;
  border: 2px solid #1b1f1e;
  border-radius: 2px;
  top: 1px;
  right: 1px;
  transform: rotate(-45deg);
}

.note-row {
  border: none;
  background: #fff;
  padding: 12px 16px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: var(--space-3);
  color: #1f6ad8;
  font-weight: 600;
}

.note-icon {
  width: 22px;
  height: 22px;
  border: 2px solid #1f6ad8;
  border-radius: 6px;
  position: relative;
}

.note-icon::after {
  content: '';
  position: absolute;
  width: 8px;
  height: 2px;
  background: #1f6ad8;
  right: 2px;
  bottom: -4px;
  transform: skewX(-20deg);
}

.confirm-button {
  background: #5ad7d5;
  color: #fff;
  font-size: 16px;
  font-weight: 700;
}
</style>
