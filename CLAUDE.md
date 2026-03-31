# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Solvec EV Taxi is a ride-hailing platform (similar to Uber/Grab) with:
- **Backend**: Express.js + Socket.io API on port 4000
- **Frontend**: Vue 3 + Vite web app, deployable to Android via Capacitor
- **Database**: PostgreSQL via Prisma ORM

## Commands

### Backend (`cd backend`)
```bash
npm run dev               # Start dev server with hot reload (tsx watch)
npm run build             # Compile TypeScript to dist/
npm start                 # Run production build
npm run prisma:generate   # Regenerate Prisma client after schema changes
npm run prisma:migrate    # Apply pending migrations
npm run prisma:seed       # Seed the database
```

### Frontend (`cd frontend`)
```bash
npm run dev               # Vite dev server at http://localhost:5173
npm run build             # Build web distribution to dist/
npm run android:sync      # Sync web build to Android project (runs build first)
npm run android:apk:debug # Build debug APK
```

### Environment Setup
Copy `.env.example` to `.env` in both `backend/` and `frontend/`. The frontend uses `http://10.0.2.2:4000` instead of `localhost` when running on the Android emulator.

## Architecture

### Backend (`backend/src/`)

- **`index.ts`** — HTTP server, Socket.io init, port binding
- **`app.ts`** — Express app, route mounting, CORS/JSON middleware
- **`socket.ts`** — Real-time event handlers (driver matching, ride tracking, notifications)
- **`db.ts`** — Prisma client singleton
- **`routes/`** — One file per domain: `auth`, `users`, `bookings`, `rides`, `payments`, `drivers`, `driver-applications`, `geo`, `promos`, `rewards`, `notifications`, `admin`, `support`
- **`routes/geo.ts`** — Proxies Google Maps API (autocomplete, reverse geocode, routing); requires `GOOGLE_MAPS_API_KEY`

Validation uses **Zod** schemas defined inline within route files. No separate validation layer.

### Frontend (`frontend/src/`)

- **`services/api.ts`** — All HTTP calls to the backend, typed with interfaces from `services/types.ts`
- **`services/socket.ts`** — Socket.io client connection
- **`store/`** — Pinia stores: `auth.ts` (user session), `booking.ts` (active ride state), `driverApplication.ts` (multi-step form state)
- **`composables/`** — `useCurrentLocation.ts` (device geolocation), `usePlacesSearch.ts` (autocomplete logic)
- **`components/NativeMap.vue`** — Capacitor Google Maps plugin; falls back to web map on non-native platforms
- **`layouts/AppShell.vue`** — Root layout with `AppHeader`, `BottomTabBar`, and `<router-view>`

**Routing**: Vue Router with lazy-loaded pages. Route `meta` controls auth guards and bottom tab visibility.

**Pages by flow:**
- `pages/auth/` — Splash → Welcome → Login → OTP → Registration
- `pages/booking/` — Full ride booking funnel: location search → destination → confirm → ride options → fare estimate → promo → payment → confirmation → finding driver → driver assigned → in-progress → completed → rating
- `pages/driver-apply/` — Multi-step driver onboarding form (10+ steps)

### Data Model (Prisma)

Key ride status progression: `REQUESTED → FINDING_DRIVER → ASSIGNED → ARRIVING → IN_PROGRESS → COMPLETED/CANCELLED`

Driver application status: `DRAFT → SUBMITTED → UNDER_REVIEW → INTERVIEW → APPROVED/REJECTED`

Payment methods: `CASH | EWALLET | CARD`

### Native (Android)

Capacitor bridges the Vue web app to Android. After frontend changes that affect native behavior (maps, permissions, geolocation), run `npm run android:sync` in `frontend/`. The Android app ID is `com.solvec.evtaxi`. Native plugin setup instructions are in `docs/native-maps-setup.md`.
