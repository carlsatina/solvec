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
  PlaceDetailsResponse
} from './types'

export const api = {
  sendOtp: (payload: AuthOtpSendRequest) => request<{ ok: boolean; message: string }>('/auth/otp/send', { method: 'POST', body: payload }),
  verifyOtp: (payload: AuthOtpVerifyRequest) => request<AuthOtpVerifyResponse>('/auth/otp/verify', { method: 'POST', body: payload }),
  register: (payload: RegisterRequest) => request<RegisterResponse>('/auth/register', { method: 'POST', body: payload }),
  me: () => request<UserProfile>('/users/me'),
  estimateFare: (payload: FareEstimateRequest) => request<FareEstimateResponse>('/bookings/estimate', { method: 'POST', body: payload }),
  createBooking: (payload: CreateBookingRequest) => request<CreateBookingResponse>('/bookings', { method: 'POST', body: payload }),
  placesAutocomplete: (input: string) => request<PlacesAutocompleteResponse>(`/geo/autocomplete?input=${encodeURIComponent(input)}`),
  placeDetails: (placeId: string) => request<PlaceDetailsResponse>(`/geo/details?placeId=${encodeURIComponent(placeId)}`)
}
