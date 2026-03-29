export type AuthOtpSendRequest = { phone: string }
export type AuthOtpVerifyRequest = { phone: string; code: string }
export type AuthOtpVerifyResponse = { ok: boolean; token: string }

export type RegisterRequest = { name: string; phone: string; email?: string; password?: string }
export type RegisterResponse = { ok: boolean; userId: string }

export type UserProfile = { id: string; name: string }

export type FareEstimateRequest = {
  pickupLat: number
  pickupLng: number
  dropoffLat: number
  dropoffLng: number
}

export type FareEstimateResponse = {
  currency: string
  total: number
  breakdown: {
    base: number
    distance: number
    time: number
  }
}

export type CreateBookingRequest = {
  pickupAddress: string
  pickupLat: number
  pickupLng: number
  dropoffAddress: string
  dropoffLat: number
  dropoffLng: number
  paymentMethod: 'CASH' | 'EWALLET' | 'CARD'
}

export type CreateBookingResponse = { ok: boolean; rideId: string; status: string }

export type PlacesAutocompleteResponse = {
  items: Array<{ placeId: string; description: string }>
}

export type PlaceDetailsResponse = {
  placeId: string
  address: string
  name?: string
  lat: number
  lng: number
}
