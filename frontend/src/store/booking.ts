import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '../services/api'
import { getSocket } from '../services/socket'

export type RideType = 'ECO' | 'COMFORT' | 'XL'
export type PaymentMethod = 'CASH' | 'EWALLET' | 'CARD'

type LocationPoint = {
  address: string
  lat: number
  lng: number
}

export const useBookingStore = defineStore('booking', () => {
  const pickup = ref<LocationPoint | null>(null)
  const dropoff = ref<LocationPoint | null>(null)
  const rideType = ref<RideType>('ECO')
  const paymentMethod = ref<PaymentMethod>('CASH')
  const fareEstimate = ref<{ total: number; currency: string; distanceKm?: number; durationMin?: number } | null>(null)
  const rideId = ref<string | null>(null)
  const rideStatus = ref<string | null>(null)
  const loading = ref(false)

  function setPickup(data: LocationPoint) {
    pickup.value = data
  }

  function setDropoff(data: LocationPoint) {
    dropoff.value = data
  }

  function setRideType(type: RideType) {
    rideType.value = type
  }

  function setPaymentMethod(method: PaymentMethod) {
    paymentMethod.value = method
  }

  async function estimateFare() {
    if (!pickup.value || !dropoff.value) return
    loading.value = true
    try {
      const res = await api.estimateFare({
        pickupLat: pickup.value.lat,
        pickupLng: pickup.value.lng,
        dropoffLat: dropoff.value.lat,
        dropoffLng: dropoff.value.lng
      })
      fareEstimate.value = { total: res.total, currency: res.currency, distanceKm: res.distanceKm, durationMin: res.durationMin }
    } catch (err) {
      console.error('[booking] estimateFare failed', err)
    } finally {
      loading.value = false
    }
  }

  async function createBooking() {
    if (!pickup.value || !dropoff.value) return
    loading.value = true
    try {
      const res = await api.createBooking({
        pickupAddress: pickup.value.address,
        pickupLat: pickup.value.lat,
        pickupLng: pickup.value.lng,
        dropoffAddress: dropoff.value.address,
        dropoffLat: dropoff.value.lat,
        dropoffLng: dropoff.value.lng,
        paymentMethod: paymentMethod.value
      })
      rideId.value = res.rideId
      rideStatus.value = res.status
      subscribeToRideUpdates(res.rideId)
    } finally {
      loading.value = false
    }
  }

  async function cancelBooking() {
    if (!rideId.value) return
    loading.value = true
    try {
      await api.cancelBooking(rideId.value)
      rideStatus.value = 'CANCELLED'
    } finally {
      loading.value = false
    }
  }

  function subscribeToRideUpdates(id: string) {
    const socket = getSocket()
    socket.emit('join', { rideId: id })
    socket.off('ride:status')
    socket.on('ride:status', (payload: { rideId: string; status: string }) => {
      if (payload.rideId !== id) return
      rideStatus.value = payload.status
    })
  }

  return {
    pickup,
    dropoff,
    rideType,
    paymentMethod,
    fareEstimate,
    rideId,
    rideStatus,
    loading,
    setPickup,
    setDropoff,
    setRideType,
    setPaymentMethod,
    estimateFare,
    createBooking,
    cancelBooking
  }
})
