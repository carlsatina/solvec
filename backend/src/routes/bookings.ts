import { Router } from 'express'

const router = Router()

router.post('/estimate', (_req, res) => {
  res.json({
    currency: 'PHP',
    total: 286,
    breakdown: {
      base: 60,
      distance: 146,
      time: 80
    }
  })
})

router.post('/', (_req, res) => {
  res.json({ ok: true, rideId: 'ride_123', status: 'FINDING_DRIVER' })
})

router.post('/:id/cancel', (_req, res) => {
  res.json({ ok: true, status: 'CANCELLED' })
})

export default router
