import { request } from './http'
import type {
  AuthOtpSendRequest,
  AuthOtpVerifyRequest,
  AuthOtpVerifyResponse,
  RegisterRequest,
  RegisterResponse,
  UserProfile,
  FareEstimateRequest,
  FareEstimateResponse,
  CreateBookingRequest,
  CreateBookingResponse,
  PlacesAutocompleteResponse,
  PlaceDetailsResponse,
  ReverseGeocodeResponse,
  RouteResponse,
  DriverApplication,
  DriverApplicationCreate,
  DriverApplicationUpdate,
  DriverDocumentCreate,
  DriverAvailabilityCreate
} from './types'

export const api = {
  sendOtp: (payload: AuthOtpSendRequest) => request<{ ok: boolean; message: string }>('/auth/otp/send', { method: 'POST', body: payload }),
  verifyOtp: (payload: AuthOtpVerifyRequest) => request<AuthOtpVerifyResponse>('/auth/otp/verify', { method: 'POST', body: payload }),
  register: (payload: RegisterRequest) => request<RegisterResponse>('/auth/register', { method: 'POST', body: payload }),
  me: () => request<UserProfile>('/users/me'),
  estimateFare: (payload: FareEstimateRequest) => request<FareEstimateResponse>('/bookings/estimate', { method: 'POST', body: payload }),
  createBooking: (payload: CreateBookingRequest) => request<CreateBookingResponse>('/bookings', { method: 'POST', body: payload }),
  placesAutocomplete: (input: string) => request<PlacesAutocompleteResponse>(`/geo/autocomplete?input=${encodeURIComponent(input)}`),
  placeDetails: (placeId: string) => request<PlaceDetailsResponse>(`/geo/details?placeId=${encodeURIComponent(placeId)}`),
  reverseGeocode: (lat: number, lng: number) =>
    request<ReverseGeocodeResponse>(`/geo/reverse?lat=${encodeURIComponent(String(lat))}&lng=${encodeURIComponent(String(lng))}`),
  route: (originLat: number, originLng: number, destinationLat: number, destinationLng: number) =>
    request<RouteResponse>(
      `/geo/route?originLat=${encodeURIComponent(String(originLat))}&originLng=${encodeURIComponent(String(originLng))}&destinationLat=${encodeURIComponent(String(destinationLat))}&destinationLng=${encodeURIComponent(String(destinationLng))}`
    ),
  createDriverApplication: (payload: DriverApplicationCreate) =>
    request<{ ok: boolean; application: DriverApplication }>('/driver-applications', { method: 'POST', body: payload }),
  updateDriverApplication: (id: string, payload: DriverApplicationUpdate) =>
    request<{ ok: boolean; application: DriverApplication }>(`/driver-applications/${id}`, { method: 'PUT', body: payload }),
  submitDriverApplication: (id: string) =>
    request<{ ok: boolean; application: DriverApplication }>(`/driver-applications/${id}/submit`, { method: 'POST' }),
  uploadDriverDocument: (id: string, payload: DriverDocumentCreate) =>
    request<{ ok: boolean }>(`/driver-applications/${id}/documents`, { method: 'POST', body: payload }),
  setDriverAvailability: (id: string, payload: DriverAvailabilityCreate) =>
    request<{ ok: boolean }>(`/driver-applications/${id}/availability`, { method: 'POST', body: payload }),
  getDriverApplication: (id: string) => request<DriverApplication>(`/driver-applications/${id}`)
}
