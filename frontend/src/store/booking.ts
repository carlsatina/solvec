import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '../services/api'

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
  const fareEstimate = ref<{ total: number; currency: string } | null>(null)
  const rideId = ref<string | null>(null)
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
      fareEstimate.value = { total: res.total, currency: res.currency }
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
    } finally {
      loading.value = false
    }
  }

  return {
    pickup,
    dropoff,
    rideType,
    paymentMethod,
    fareEstimate,
    rideId,
    loading,
    setPickup,
    setDropoff,
    setRideType,
    setPaymentMethod,
    estimateFare,
    createBooking
  }
})
