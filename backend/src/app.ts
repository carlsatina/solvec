import express from 'express'
import cors from 'cors'

import authRoutes from './routes/auth'
import userRoutes from './routes/users'
import bookingRoutes from './routes/bookings'
import rideRoutes from './routes/rides'
import paymentRoutes from './routes/payments'
import promoRoutes from './routes/promos'
import rewardRoutes from './routes/rewards'
import notificationRoutes from './routes/notifications'
import supportRoutes from './routes/support'
import driverAppRoutes from './routes/driver-applications'
import geoRoutes from './routes/geo'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/health', (_req, res) => res.json({ ok: true }))

app.use('/auth', authRoutes)
app.use('/users', userRoutes)
app.use('/bookings', bookingRoutes)
app.use('/rides', rideRoutes)
app.use('/payments', paymentRoutes)
app.use('/promos', promoRoutes)
app.use('/rewards', rewardRoutes)
app.use('/notifications', notificationRoutes)
app.use('/support', supportRoutes)
app.use('/driver-applications', driverAppRoutes)
app.use('/geo', geoRoutes)

export default app
