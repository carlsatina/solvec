import { Router } from 'express'

const router = Router()

router.post('/', (_req, res) => {
  res.json({ ok: true, applicationId: 'app_123', status: 'SUBMITTED' })
})

router.get('/:id', (req, res) => {
  res.json({ id: req.params.id, status: 'UNDER_REVIEW' })
})

router.post('/:id/documents', (_req, res) => {
  res.json({ ok: true })
})

router.post('/:id/availability', (_req, res) => {
  res.json({ ok: true })
})

export default router
