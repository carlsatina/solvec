import { createRouter, createWebHistory } from 'vue-router'

import SplashScreen from '../pages/auth/SplashScreen.vue'
import WelcomeCarousel from '../pages/auth/WelcomeCarousel.vue'
import LoginScreen from '../pages/auth/LoginScreen.vue'
import OtpScreen from '../pages/auth/OtpScreen.vue'
import RegisterScreen from '../pages/auth/RegisterScreen.vue'
import ForgotPasswordScreen from '../pages/auth/ForgotPasswordScreen.vue'
import PermissionsScreen from '../pages/auth/PermissionsScreen.vue'

import HomeScreen from '../pages/home/HomeScreen.vue'
import LocationSearch from '../pages/booking/LocationSearch.vue'
import DestinationSearch from '../pages/booking/DestinationSearch.vue'
import SavedPlaces from '../pages/booking/SavedPlaces.vue'
import RideOptions from '../pages/booking/RideOptions.vue'
import FareEstimate from '../pages/booking/FareEstimate.vue'
import PromoSelection from '../pages/booking/PromoSelection.vue'
import PaymentMethod from '../pages/booking/PaymentMethod.vue'
import BookingConfirmation from '../pages/booking/BookingConfirmation.vue'
import FindingDriver from '../pages/booking/FindingDriver.vue'
import DriverAssigned from '../pages/booking/DriverAssigned.vue'
import TripInProgress from '../pages/booking/TripInProgress.vue'
import TripCompleted from '../pages/booking/TripCompleted.vue'
import RateRide from '../pages/booking/RateRide.vue'

import TripsList from '../pages/trips/TripsList.vue'
import TripDetails from '../pages/trips/TripDetails.vue'
import RewardsScreen from '../pages/rewards/RewardsScreen.vue'
import NotificationsScreen from '../pages/notifications/NotificationsScreen.vue'
import HelpCenter from '../pages/account/HelpCenter.vue'
import AccountScreen from '../pages/account/AccountScreen.vue'

import DriverLanding from '../pages/driver-apply/DriverLanding.vue'
import DriverBenefits from '../pages/driver-apply/DriverBenefits.vue'
import DriverRequirements from '../pages/driver-apply/DriverRequirements.vue'
import DriverForm from '../pages/driver-apply/DriverForm.vue'
import DriverDocuments from '../pages/driver-apply/DriverDocuments.vue'
import DriverAvailability from '../pages/driver-apply/DriverAvailability.vue'
import DriverReview from '../pages/driver-apply/DriverReview.vue'
import DriverSubmitted from '../pages/driver-apply/DriverSubmitted.vue'
import DriverStatus from '../pages/driver-apply/DriverStatus.vue'
import DriverFaq from '../pages/driver-apply/DriverFaq.vue'

const routes = [
  { path: '/', redirect: '/home' },
  { path: '/auth/splash', component: SplashScreen, meta: { showTabs: false } },
  { path: '/auth/welcome', component: WelcomeCarousel, meta: { showTabs: false } },
  { path: '/auth/login', component: LoginScreen, meta: { showTabs: false } },
  { path: '/auth/otp', component: OtpScreen, meta: { showTabs: false } },
  { path: '/auth/register', component: RegisterScreen, meta: { showTabs: false } },
  { path: '/auth/forgot', component: ForgotPasswordScreen, meta: { showTabs: false } },
  { path: '/auth/permissions', component: PermissionsScreen, meta: { showTabs: false } },

  { path: '/home', component: HomeScreen, meta: { showTabs: true } },
  { path: '/booking/location', component: LocationSearch, meta: { showTabs: false } },
  { path: '/booking/destination', component: DestinationSearch, meta: { showTabs: false } },
  { path: '/booking/saved-places', component: SavedPlaces, meta: { showTabs: false } },
  { path: '/booking/ride-options', component: RideOptions, meta: { showTabs: false } },
  { path: '/booking/fare', component: FareEstimate, meta: { showTabs: false } },
  { path: '/booking/promo', component: PromoSelection, meta: { showTabs: false } },
  { path: '/booking/payment', component: PaymentMethod, meta: { showTabs: false } },
  { path: '/booking/confirm', component: BookingConfirmation, meta: { showTabs: false } },
  { path: '/booking/finding', component: FindingDriver, meta: { showTabs: false } },
  { path: '/booking/driver-assigned', component: DriverAssigned, meta: { showTabs: false } },
  { path: '/booking/in-progress', component: TripInProgress, meta: { showTabs: false } },
  { path: '/booking/completed', component: TripCompleted, meta: { showTabs: false } },
  { path: '/booking/rate', component: RateRide, meta: { showTabs: false } },

  { path: '/trips', component: TripsList, meta: { showTabs: true } },
  { path: '/trips/:id', component: TripDetails, meta: { showTabs: false } },
  { path: '/rewards', component: RewardsScreen, meta: { showTabs: true } },
  { path: '/notifications', component: NotificationsScreen, meta: { showTabs: true } },
  { path: '/help', component: HelpCenter, meta: { showTabs: false } },
  { path: '/account', component: AccountScreen, meta: { showTabs: true } },

  { path: '/driver/apply', component: DriverLanding, meta: { showTabs: false } },
  { path: '/driver/benefits', component: DriverBenefits, meta: { showTabs: false } },
  { path: '/driver/requirements', component: DriverRequirements, meta: { showTabs: false } },
  { path: '/driver/form', component: DriverForm, meta: { showTabs: false } },
  { path: '/driver/documents', component: DriverDocuments, meta: { showTabs: false } },
  { path: '/driver/availability', component: DriverAvailability, meta: { showTabs: false } },
  { path: '/driver/review', component: DriverReview, meta: { showTabs: false } },
  { path: '/driver/submitted', component: DriverSubmitted, meta: { showTabs: false } },
  { path: '/driver/status', component: DriverStatus, meta: { showTabs: false } },
  { path: '/driver/faq', component: DriverFaq, meta: { showTabs: false } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
