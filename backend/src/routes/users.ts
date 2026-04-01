import { Router } from 'express'
import prisma from '../db'

const router = Router()

// Stub: returns the seeded passenger user so the real DB ID flows through
// to bookings and other relations. Replace with real JWT-based lookup when
// proper auth is implemented.
router.get('/me', async (_req, res) => {
  const user = await prisma.user.findFirst({ where: { role: 'PASSENGER' } })
  if (!user) return res.status(404).json({ error: 'No passenger user found — run npm run prisma:seed' })
  res.json({ id: user.id, name: user.name })
})

router.put('/me', (_req, res) => {
  res.json({ ok: true })
})

router.get('/me/saved-places', (_req, res) => {
  res.json({ items: [] })
})

router.post('/me/saved-places', (_req, res) => {
  res.json({ ok: true })
})

export default router
