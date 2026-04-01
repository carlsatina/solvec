<template>
  <div class="route-screen">
    <div class="map-area">
      <NativeMap
        :map-id="'solvec-route-map'"
        :center="mapCenter"
        :zoom="15"
        :markers="mapMarkers"
        :path="routePath"
      />
      <button class="map-back" type="button" @click="goBack" aria-label="Back">
        <span class="back-icon" aria-hidden="true"></span>
      </button>

      <div class="route-chip">{{ routeSummary }}</div>
      <div class="address-pill pickup-pill">{{ pickupLabel }}</div>
      <div class="address-pill dropoff-pill">{{ dropoffLabel }}</div>

      <button class="for-other" type="button">
        <span class="for-other-icon" aria-hidden="true"></span>
        For other
      </button>

      <div class="warning-banner">
        <span class="warning-icon" aria-hidden="true"></span>
        The Service or Payment method does not currently support insurance.
      </div>
    </div>

    <section class="sheet">
      <div v-if="fareError || routeError" class="debug-errors">
        <div v-if="fareError">Fare error: {{ fareError }}</div>
        <div v-if="routeError">Route error: {{ routeError }}</div>
      </div>

      <div class="car-card">
        <div class="car-visual" aria-hidden="true"></div>
        <div class="car-meta">
          <div class="car-title">Green GSM Car</div>
          <div class="car-seats">4 seats</div>
        </div>
        <div class="car-price">{{ fareRange }}</div>
      </div>

      <div class="payment-row">
        <div class="payment-pill">{{ booking.paymentMethod }}</div>
        <div class="points-pill">Use Green Points to save on your orders.</div>
      </div>

      <button class="invoice-row" type="button">Request invoice & add-ons here</button>

      <div class="bottom-actions">
        <button class="schedule-btn" type="button">Schedule</button>
        <button class="button button-primary book-button" :disabled="booking.loading" @click="bookRide">
          Book
        </button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import NativeMap from '../../components/NativeMap.vue'
import { useBookingStore } from '../../store/booking'
import { api } from '../../services/api'
import { decodePolyline } from '../../utils/polyline'

const router = useRouter()
const booking = useBookingStore()

const pickupAddress = computed(() => booking.pickup?.address || 'No pickup selected')
const dropoffAddress = computed(() => booking.dropoff?.address || 'No destination selected')

const routeDistanceKm = ref<number | null>(null)
const routeDurationMin = ref<number | null>(null)
const routePath = ref<Array<{ lat: number; lng: number }>>([])
const fareError = ref<string | null>(null)
const routeError = ref<string | null>(null)

const mapCenter = computed(() => {
  const loc = booking.pickup
  return loc ? { lat: loc.lat, lng: loc.lng } : { lat: 14.5995, lng: 120.9842 }
})
const mapMarkers = computed(() => {
  const markers: Array<{ lat: number; lng: number; title?: string }> = []
  if (booking.pickup) markers.push({ lat: booking.pickup.lat, lng: booking.pickup.lng, title: 'Pickup' })
  if (booking.dropoff) markers.push({ lat: booking.dropoff.lat, lng: booking.dropoff.lng, title: 'Destination' })
  return markers
})

const routeSummary = computed(() => {
  if (routeDurationMin.value != null && routeDistanceKm.value != null) {
    return `${routeDurationMin.value} mins • ${routeDistanceKm.value.toFixed(2)} km`
  }
  if (booking.fareEstimate?.durationMin != null && booking.fareEstimate?.distanceKm != null) {
    return `${booking.fareEstimate.durationMin} mins • ${booking.fareEstimate.distanceKm.toFixed(2)} km`
  }
  return 'Calculating route...'
})

const fareRange = computed(() => {
  if (!booking.fareEstimate) return 'PHP --'
  const low = booking.fareEstimate.total * 0.9
  const high = booking.fareEstimate.total * 1.12
  return `${booking.fareEstimate.currency} ${low.toFixed(2)} - ${booking.fareEstimate.currency} ${high.toFixed(2)}`
})

const pickupLabel = computed(() => pickupAddress.value.split(',')[0] || pickupAddress.value)
const dropoffLabel = computed(() => dropoffAddress.value.split(',')[0] || dropoffAddress.value)

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
    routeDurationMin.value = Math.max(1, Math.round(route.durationSeconds / 60))
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    routeError.value = msg
    routePath.value = []
  }
}

onMounted(async () => {
  if (!booking.pickup || !booking.dropoff) {
    router.replace('/booking/destination')
    return
  }

  const [fareResult, routeResult] = await Promise.allSettled([booking.estimateFare(), loadRoute()])
  if (fareResult.status === 'rejected') {
    fareError.value = fareResult.reason instanceof Error ? fareResult.reason.message : String(fareResult.reason)
  }
  if (routeResult.status === 'rejected') {
    routeError.value = routeResult.reason instanceof Error ? routeResult.reason.message : String(routeResult.reason)
  }
})

function goBack() {
  router.back()
}

async function bookRide() {
  await booking.createBooking()
  router.push('/booking/finding')
}
</script>

<style scoped>
.debug-errors {
  background: #fee2e2;
  border: 1px solid #ef4444;
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 12px;
  color: #991b1b;
  word-break: break-all;
}

.route-screen {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: transparent;
}

.map-area {
  position: relative;
  flex: 1;
  min-height: 560px;
}

.map-area :deep(.native-map) {
  border-radius: 0;
  min-height: 560px;
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

.route-chip {
  position: absolute;
  top: 152px;
  left: 50%;
  transform: translateX(-50%);
  background: #e8f7ec;
  color: #0f766e;
  border-radius: 12px;
  padding: 8px 12px;
  font-size: 14px;
  font-weight: 700;
  box-shadow: 0 4px 10px rgba(17, 24, 39, 0.14);
  z-index: 5;
}

.address-pill {
  position: absolute;
  background: #fff;
  border-radius: 999px;
  padding: 9px 14px;
  font-size: 14px;
  font-weight: 600;
  max-width: 70%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  box-shadow: 0 4px 10px rgba(17, 24, 39, 0.14);
  z-index: 5;
}

.pickup-pill {
  left: 14px;
  top: 204px;
}

.dropoff-pill {
  right: 14px;
  top: 192px;
}

.for-other {
  position: absolute;
  left: 14px;
  bottom: 80px;
  border: none;
  background: #fff;
  border-radius: 12px;
  padding: 10px 12px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 10px rgba(17, 24, 39, 0.14);
  z-index: 5;
}

.for-other-icon {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, #ff7ab7, #ff4a8f);
}

.warning-banner {
  position: absolute;
  left: 14px;
  right: 14px;
  bottom: 12px;
  background: rgba(235, 235, 235, 0.95);
  border-radius: 12px;
  padding: 10px 12px;
  font-size: 13px;
  color: #2f2f2f;
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 5;
}

.warning-icon {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #9aa0a6;
  flex: 0 0 auto;
}

.sheet {
  background: #fff;
  border-radius: 24px 24px 0 0;
  margin-top: -26px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.car-card {
  background: #eafcfd;
  border: 2px solid #9de5e5;
  border-radius: 18px;
  padding: 10px 12px;
  display: grid;
  grid-template-columns: 72px 1fr auto;
  align-items: center;
  gap: 10px;
}

.car-visual {
  width: 72px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, #33d7d5, #8ae9e7);
}

.car-title {
  font-size: 18px;
  font-weight: 700;
}

.car-seats {
  font-size: 13px;
  color: #4b5563;
}

.car-price {
  font-size: 16px;
  font-weight: 700;
}

.payment-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.payment-pill,
.points-pill {
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  min-height: 46px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  font-size: 14px;
  background: #fff;
}

.invoice-row {
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  min-height: 46px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  background: #fff;
  color: #7b7b7b;
  font-size: 14px;
}

.bottom-actions {
  display: grid;
  grid-template-columns: 110px 1fr;
  gap: 12px;
  align-items: center;
}

.schedule-btn {
  border: none;
  background: transparent;
  font-size: 16px;
  text-align: left;
  color: #374151;
}

.book-button {
  min-height: 54px;
  border-radius: 999px;
  font-size: 22px;
  font-weight: 700;
}

@media (max-width: 420px) {
  .car-title { font-size: 16px; }
  .car-price { font-size: 14px; }
  .payment-pill,
  .points-pill,
  .invoice-row { font-size: 13px; }
}
</style>
