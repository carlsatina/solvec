<template>
  <div class="confirm-screen">
    <div class="map-container">
      <NativeMap :center="mapCenter" :zoom="17" :map-id="mapId" />
      <button class="map-back" type="button" @click="goBack" aria-label="Back">
        <span class="back-icon" aria-hidden="true"></span>
      </button>
      <button class="map-gps" type="button" aria-label="Recenter">
        <span class="gps-icon" aria-hidden="true"></span>
      </button>
      <div class="map-pin" aria-hidden="true"></div>
      <div class="map-chip">{{ chipLabel }}</div>
    </div>

    <section class="sheet">
      <div class="sheet-handle"></div>
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
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import NativeMap from '../../components/NativeMap.vue'
import { useBookingStore } from '../../store/booking'

const route = useRoute()
const router = useRouter()
const booking = useBookingStore()

const type = computed(() => (route.params.type === 'dropoff' ? 'dropoff' : 'pickup'))
const current = computed(() => (type.value === 'pickup' ? booking.pickup : booking.dropoff))

const mapCenter = computed(() => current.value ?? { lat: 14.5995, lng: 120.9842 })
const mapId = computed(() => `solvec-map-${type.value}`)
const confirmLabel = computed(() => (type.value === 'pickup' ? 'Confirm Pickup' : 'Confirm drop-off'))
const chipLabel = computed(() =>
  current.value?.address ? `Near ${current.value.address.split(',')[0]}` : 'Select location'
)
const titleText = computed(() => chipLabel.value)
const subtitleText = computed(() => current.value?.address ?? 'Choose a nearby landmark')

const nearbyOptions = computed(() => {
  if (!current.value?.address) return []
  const parts = current.value.address.split(',')
  const area = parts.slice(1).join(',').trim() || current.value.address
  return [
    { title: parts[0], subtitle: area },
    { title: `${parts[0]} Corner`, subtitle: area },
    { title: `${parts[0]} Entrance`, subtitle: area }
  ]
})

function goBack() {
  router.back()
}

function confirmLocation() {
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
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #fff;
}

.map-container {
  position: relative;
  flex: 1;
  min-height: 360px;
}

.map-container :deep(.native-map) {
  border-radius: 0;
  min-height: 360px;
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
}

.back-icon {
  width: 16px;
  height: 16px;
  border-left: 3px solid #1b1f1e;
  border-bottom: 3px solid #1b1f1e;
  transform: rotate(45deg);
}

.map-gps {
  position: absolute;
  right: 16px;
  bottom: 120px;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  border: none;
  background: #fff;
  box-shadow: 0 8px 16px rgba(17, 24, 39, 0.16);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.gps-icon {
  width: 18px;
  height: 18px;
  border: 2px solid #1b1f1e;
  border-radius: 50%;
  position: relative;
}

.gps-icon::after {
  content: '';
  position: absolute;
  inset: 5px;
  border: 2px solid #1b1f1e;
  border-radius: 50%;
}

.map-pin {
  position: absolute;
  left: 50%;
  top: 45%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #111;
  box-shadow: 0 0 0 8px rgba(17, 17, 17, 0.18);
}

.map-pin::after {
  content: '';
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #fff;
  left: 5px;
  top: 5px;
}

.map-chip {
  position: absolute;
  left: 50%;
  top: 30%;
  transform: translateX(-50%);
  background: #fff;
  padding: 10px 16px;
  border-radius: 999px;
  box-shadow: 0 8px 18px rgba(17, 24, 39, 0.16);
  font-weight: 600;
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
