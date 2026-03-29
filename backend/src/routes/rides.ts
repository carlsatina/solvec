import { Router } from 'express'

const router = Router()

router.get('/:id', (req, res) => {
  res.json({ id: req.params.id, status: 'ASSIGNED' })
})

router.post('/:id/status', (req, res) => {
  res.json({ id: req.params.id, status: req.body?.status ?? 'UPDATED' })
})

router.post('/:id/events', (req, res) => {
  res.json({ id: req.params.id, event: req.body?.type ?? 'EVENT' })
})

router.get('/', (_req, res) => {
  res.json({ items: [] })
})

export default router
