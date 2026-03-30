<template>
  <div class="finding-screen">
    <div class="map-container">
      <NativeMap :center="mapCenter" :markers="mapMarkers" :path="routePath" :zoom="15" />
      <button class="map-back" type="button" @click="goBack" aria-label="Back">
        <span class="back-icon" aria-hidden="true"></span>
      </button>
      <div class="pickup-chip">{{ pickupLabel }}</div>
    </div>

    <section
      ref="sheetRef"
      class="sheet"
      :style="sheetStyle"
    >
      <div
        class="sheet-grabber"
        @pointerdown="onDragStart"
        @pointermove="onDragMove"
        @pointerup="onDragEnd"
        @pointercancel="onDragEnd"
      >
        <div class="sheet-handle"></div>
      </div>
      <div
        class="sheet-drag-zone"
        @pointerdown="onDragStart"
        @pointermove="onDragMove"
        @pointerup="onDragEnd"
        @pointercancel="onDragEnd"
      >
        <h2 class="sheet-title">Green is looking for a driver nearby. A moment please!</h2>

        <div class="avatar-row" aria-hidden="true">
          <div class="avatar-card">🙂</div>
          <div class="avatar-card">👩</div>
          <div class="avatar-card">😄</div>
        </div>
      </div>

      <button
        class="trip-card"
        :class="{ expanded }"
        type="button"
        @click="toggleDetails"
      >
        <div class="trip-head">
          <div class="trip-name">Green GSM Car</div>
          <div class="trip-code-wrap">
            <div class="trip-code">{{ plateCode }}</div>
            <span class="copy-icon" aria-hidden="true"></span>
          </div>
        </div>
        <div class="trip-time">Time <span>{{ bookingTime }}</span></div>

        <transition name="details">
          <div v-if="expanded" class="trip-details">
            <div class="route-lines">
              <div class="location-line">
                <span class="line-dot pickup"></span>
                <div>
                  <div class="line-title">{{ pickupLabel }}</div>
                  <div class="line-subtitle">{{ booking.pickup?.address }}</div>
                </div>
              </div>
              <div class="location-line">
                <span class="line-dot dropoff"></span>
                <div>
                  <div class="line-title">{{ dropoffLabel }}</div>
                  <div class="line-subtitle">{{ distanceLabel }} · {{ booking.dropoff?.address }}</div>
                </div>
              </div>
            </div>
            <div class="payment-row">
              <span>{{ booking.paymentMethod }}</span>
              <strong>{{ fareRange }}</strong>
              <span class="payment-chevron">›</span>
            </div>
          </div>
        </transition>
      </button>

      <transition name="details">
        <button v-if="expanded" class="support-row" type="button">
          <span class="support-icon" aria-hidden="true"></span>
          <span>Service information support</span>
          <span class="support-chevron">›</span>
        </button>
      </transition>

      <transition name="details">
        <button v-if="expanded" class="cancel-btn" type="button">Cancel Booking</button>
      </transition>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import NativeMap from '../../components/NativeMap.vue'
import { useBookingStore } from '../../store/booking'
import { api } from '../../services/api'

const router = useRouter()
const booking = useBookingStore()
const expanded = ref(false)
const routePath = ref<Array<{ lat: number; lng: number }>>([])
const routeDistanceKm = ref<number | null>(null)
const sheetRef = ref<HTMLElement | null>(null)
const sheetOffset = ref(0)
const maxSheetOffset = ref(0)
const snapPoints = ref([0, 0, 0])
const activeSnap = ref(2)
const dragging = ref(false)
const dragPrimed = ref(false)
const pointerId = ref<number | null>(null)
const dragStartY = ref(0)
const dragStartOffset = ref(0)
const lastY = ref(0)
const lastTime = ref(0)
const dragVelocity = ref(0)
const justDraggedUntil = ref(0)
const collapsedPeek = 280
const pendingOffset = ref(0)
const rafId = ref<number | null>(null)

const mapCenter = computed(() => booking.pickup || { lat: 14.5995, lng: 120.9842 })
const mapMarkers = computed(() => {
  const markers: Array<{ lat: number; lng: number; title?: string }> = []
  if (booking.pickup) markers.push({ lat: booking.pickup.lat, lng: booking.pickup.lng, title: 'Pickup' })
  if (booking.dropoff) markers.push({ lat: booking.dropoff.lat, lng: booking.dropoff.lng, title: 'Drop-off' })
  return markers
})

const pickupLabel = computed(() => shortLabel(booking.pickup?.address || 'Pickup'))
const dropoffLabel = computed(() => shortLabel(booking.dropoff?.address || 'Drop-off'))
const plateCode = computed(() => `${booking.rideId?.slice(0, 10) || '01KMZ90SW8'}...`)
const bookingTime = computed(() => {
  const now = new Date()
  const hm = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
  const dmy = now.toLocaleDateString('en-GB')
  return `${hm} • ${dmy}`
})

const distanceLabel = computed(() => {
  const km = routeDistanceKm.value ?? booking.fareEstimate?.distanceKm
  return km != null ? `${km.toFixed(2)} km` : '-- km'
})

const fareRange = computed(() => {
  if (!booking.fareEstimate) return 'PHP --'
  const low = booking.fareEstimate.total * 0.9
  const high = booking.fareEstimate.total * 1.12
  return `${booking.fareEstimate.currency} ${low.toFixed(2)} - ${booking.fareEstimate.currency} ${high.toFixed(2)}`
})

const sheetStyle = computed(() => ({
  transform: `translateY(${sheetOffset.value}px)`,
  transition: dragging.value ? 'none' : 'transform 260ms cubic-bezier(0.22, 1, 0.36, 1)'
}))

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function recalcSheetBounds() {
  const height = sheetRef.value?.scrollHeight ?? 0
  const peek = window.innerWidth <= 480 ? 220 : collapsedPeek
  maxSheetOffset.value = Math.max(0, height - peek)
  const mid = Math.round(maxSheetOffset.value * 0.5)
  snapPoints.value = [0, mid, maxSheetOffset.value]
  snapTo(activeSnap.value)
}

function setSheetOffset(next: number) {
  pendingOffset.value = next
  if (rafId.value != null) return
  rafId.value = window.requestAnimationFrame(() => {
    sheetOffset.value = pendingOffset.value
    rafId.value = null
  })
}

function nearestSnapIndex(value: number) {
  let best = 0
  let min = Number.POSITIVE_INFINITY
  snapPoints.value.forEach((point, idx) => {
    const distance = Math.abs(point - value)
    if (distance < min) {
      min = distance
      best = idx
    }
  })
  return best
}

function snapTo(index: number) {
  const clamped = Math.min(snapPoints.value.length - 1, Math.max(0, index))
  activeSnap.value = clamped
  expanded.value = clamped < 2
  setSheetOffset(snapPoints.value[clamped] ?? 0)
}

function onDragStart(event: PointerEvent) {
  if (event.pointerType === 'mouse' && event.button !== 0) return
  const target = event.currentTarget as HTMLElement | null
  target?.setPointerCapture?.(event.pointerId)
  dragging.value = true
  dragPrimed.value = false
  pointerId.value = event.pointerId
  dragStartY.value = event.clientY
  dragStartOffset.value = sheetOffset.value
  lastY.value = event.clientY
  lastTime.value = event.timeStamp
  dragVelocity.value = 0
}

function onDragMove(event: PointerEvent) {
  if (!dragging.value || pointerId.value !== event.pointerId) return
  const delta = event.clientY - dragStartY.value
  if (!dragPrimed.value && Math.abs(delta) < 8) return
  dragPrimed.value = true

  event.preventDefault()

  const nextOffset = clamp(dragStartOffset.value + delta, 0, maxSheetOffset.value)
  setSheetOffset(nextOffset)

  const dt = Math.max(1, event.timeStamp - lastTime.value)
  const instantVelocity = (event.clientY - lastY.value) / dt
  dragVelocity.value = dragVelocity.value * 0.7 + instantVelocity * 0.3
  lastY.value = event.clientY
  lastTime.value = event.timeStamp
}

function onDragEnd(event: PointerEvent) {
  if (!dragging.value || pointerId.value !== event.pointerId) return
  const target = event.currentTarget as HTMLElement | null
  target?.releasePointerCapture?.(event.pointerId)
  dragging.value = false
  pointerId.value = null

  if (!dragPrimed.value) return

  let targetIndex = nearestSnapIndex(sheetOffset.value)
  if (dragVelocity.value <= -0.45) {
    targetIndex = Math.max(0, targetIndex - 1)
  } else if (dragVelocity.value >= 0.45) {
    targetIndex = Math.min(snapPoints.value.length - 1, targetIndex + 1)
  }

  justDraggedUntil.value = Date.now() + 200
  snapTo(targetIndex)
}

function toggleDetails() {
  if (Date.now() < justDraggedUntil.value) return
  if (expanded.value) {
    snapTo(2)
    return
  }
  snapTo(1)
}

function shortLabel(address: string) {
  return address.split(',')[0]?.trim() || address
}

function decodePolyline(encoded: string) {
  const points: Array<{ lat: number; lng: number }> = []
  let index = 0
  let lat = 0
  let lng = 0

  while (index < encoded.length) {
    let result = 0
    let shift = 0
    let byte = 0

    do {
      byte = encoded.charCodeAt(index++) - 63
      result |= (byte & 0x1f) << shift
      shift += 5
    } while (byte >= 0x20)

    lat += (result & 1) !== 0 ? ~(result >> 1) : result >> 1
    result = 0
    shift = 0

    do {
      byte = encoded.charCodeAt(index++) - 63
      result |= (byte & 0x1f) << shift
      shift += 5
    } while (byte >= 0x20)

    lng += (result & 1) !== 0 ? ~(result >> 1) : result >> 1
    points.push({ lat: lat / 1e5, lng: lng / 1e5 })
  }

  return points
}

async function loadRoute() {
  if (!booking.pickup || !booking.dropoff) return

  try {
    const route = await api.route(
      booking.pickup.lat,
      booking.pickup.lng,
      booking.dropoff.lat,
      booking.dropoff.lng
    )
    routePath.value = route.polyline ? decodePolyline(route.polyline) : []
    routeDistanceKm.value = route.distanceMeters / 1000
  } catch {
    routePath.value = [
      { lat: booking.pickup.lat, lng: booking.pickup.lng },
      { lat: booking.dropoff.lat, lng: booking.dropoff.lng }
    ]
  }
}

onMounted(async () => {
  if (!booking.pickup || !booking.dropoff) {
    router.replace('/booking/destination')
    return
  }

  if (!booking.fareEstimate) {
    await booking.estimateFare()
  }

  await loadRoute()
  await nextTick()
  recalcSheetBounds()
  snapTo(2)
  window.addEventListener('resize', recalcSheetBounds)
})

function goBack() {
  router.back()
}

onBeforeUnmount(() => {
  window.removeEventListener('resize', recalcSheetBounds)
  if (rafId.value != null) {
    window.cancelAnimationFrame(rafId.value)
  }
})
</script>

<style scoped>
.finding-screen {
  position: relative;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #fff;
  overflow: hidden;
}

.map-container {
  position: absolute;
  inset: 0;
}

.map-container :deep(.native-map) {
  border-radius: 0;
  min-height: 100vh;
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

.pickup-chip {
  position: absolute;
  left: 50%;
  bottom: 22px;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.95);
  border-radius: 999px;
  padding: 10px 18px;
  box-shadow: 0 8px 16px rgba(17, 24, 39, 0.14);
  font-size: 18px;
  font-weight: 700;
}

.sheet {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 20;
  margin-top: -10px;
  border-radius: 24px 24px 0 0;
  padding: 12px 16px 22px;
  background: #f9f9f9;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  will-change: transform;
  max-height: min(88vh, calc(100vh - 12px));
  overflow-y: auto;
  overscroll-behavior: contain;
}

.sheet-grabber {
  padding-top: 2px;
  padding-bottom: 4px;
  touch-action: none;
}

.sheet-drag-zone {
  touch-action: none;
}

.sheet-handle {
  width: 44px;
  height: 4px;
  border-radius: 999px;
  background: #d7d7d7;
  margin: 0 auto;
}

.sheet-title {
  margin: 0;
  font-size: 24px;
  line-height: 1.2;
}

.avatar-row {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.avatar-card {
  width: 72px;
  height: 92px;
  border-radius: 16px;
  background: linear-gradient(180deg, #fff4ea, #e8f8f4);
  display: grid;
  place-items: center;
  font-size: 28px;
}

.trip-card {
  border: 1px solid #e6e6e6;
  border-radius: 18px;
  background: #fff;
  text-align: left;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: box-shadow 200ms ease, border-color 200ms ease;
}

.trip-card.expanded {
  border-color: #cfe9e8;
  box-shadow: 0 10px 20px rgba(17, 24, 39, 0.08);
}

.trip-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.trip-name {
  font-size: 20px;
  font-weight: 700;
}

.trip-code {
  color: #6b7280;
  font-size: 18px;
}

.trip-code-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
}

.copy-icon {
  width: 22px;
  height: 22px;
  border: 2px solid #22b8b5;
  border-radius: 6px;
  position: relative;
}

.copy-icon::after {
  content: '';
  position: absolute;
  width: 12px;
  height: 12px;
  border: 2px solid #22b8b5;
  border-radius: 4px;
  left: 5px;
  top: 5px;
  background: #fff;
}

.trip-time {
  font-size: 14px;
  color: #111827;
  display: flex;
  justify-content: space-between;
}

.trip-details {
  border-top: 1px solid #ececec;
  padding-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.route-lines {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.route-lines::before {
  content: '';
  position: absolute;
  left: 5px;
  top: 18px;
  bottom: 34px;
  width: 2px;
  background: #dddddd;
}

.location-line {
  display: grid;
  grid-template-columns: 20px 1fr;
  gap: 8px;
}

.line-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-top: 8px;
}

.line-dot.pickup { background: #111827; }
.line-dot.dropoff { background: #eab308; }

.line-title {
  font-size: 16px;
  font-weight: 700;
}

.line-subtitle {
  color: #6b7280;
  font-size: 12px;
  line-height: 1.3;
}

.payment-row {
  border-top: 1px solid #ececec;
  padding-top: 10px;
  align-items: center;
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 8px;
  justify-content: unset;
  font-size: 14px;
}

.payment-row strong {
  justify-self: end;
}

.payment-chevron {
  color: #6b7280;
  font-size: 20px;
}

.support-row {
  border: 1px solid #e6e6e6;
  border-radius: 16px;
  background: #fff;
  padding: 14px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  font-size: 16px;
}

.support-icon {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, #9fe9e7, #2bbab6);
  position: relative;
}

.support-icon::after {
  content: '';
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #fff;
  left: 11px;
  top: 8px;
}

.support-chevron {
  color: #6b7280;
}

.cancel-btn {
  border: none;
  background: transparent;
  color: #22b8b5;
  font-size: 28px;
  font-weight: 700;
  justify-self: center;
  text-align: center;
}

.details-enter-active,
.details-leave-active {
  transition: max-height 220ms ease, opacity 220ms ease, transform 220ms ease;
  overflow: hidden;
}

.details-enter-from,
.details-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-6px);
}

.details-enter-to,
.details-leave-from {
  max-height: 700px;
  opacity: 1;
  transform: translateY(0);
}

@media (max-width: 480px) {
  .sheet-title { font-size: 20px; }
  .trip-name { font-size: 18px; }
  .trip-code { font-size: 16px; }
  .cancel-btn { font-size: 22px; width: 100%; }
  .copy-icon { width: 16px; height: 16px; }
  .copy-icon::after { width: 9px; height: 9px; left: 3px; top: 3px; }
  .support-icon { width: 22px; height: 22px; }
  .support-icon::after { width: 8px; height: 8px; left: 7px; top: 5px; }
}
</style>
