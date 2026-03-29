import { Router } from 'express'

const router = Router()

const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY

router.get('/autocomplete', async (req, res) => {
  const input = String(req.query.input ?? '').trim()
  if (!input) return res.status(400).json({ error: 'input required' })
  if (!GOOGLE_API_KEY) return res.status(500).json({ error: 'missing api key' })

  const url = new URL('https://maps.googleapis.com/maps/api/place/autocomplete/json')
  url.searchParams.set('input', input)
  url.searchParams.set('key', GOOGLE_API_KEY)
  url.searchParams.set('components', 'country:ph')
  url.searchParams.set('types', 'geocode')
  url.searchParams.set('language', 'en')

  let data: any
  try {
    const response = await fetch(url)
    data = await response.json()
  } catch (err) {
    return res.status(502).json({ error: 'upstream_error', message: String(err) })
  }

  if (data.status !== 'OK') {
    return res.status(502).json({ error: data.status, message: data.error_message })
  }

  const items = (data.predictions ?? []).map((p: any) => ({
    placeId: p.place_id,
    description: p.description
  }))

  return res.json({ items })
})

router.get('/details', async (req, res) => {
  const placeId = String(req.query.placeId ?? '').trim()
  if (!placeId) return res.status(400).json({ error: 'placeId required' })
  if (!GOOGLE_API_KEY) return res.status(500).json({ error: 'missing api key' })

  const url = new URL('https://maps.googleapis.com/maps/api/place/details/json')
  url.searchParams.set('place_id', placeId)
  url.searchParams.set('key', GOOGLE_API_KEY)
  url.searchParams.set('fields', 'formatted_address,geometry/location,name')

  let data: any
  try {
    const response = await fetch(url)
    data = await response.json()
  } catch (err) {
    return res.status(502).json({ error: 'upstream_error', message: String(err) })
  }

  if (data.status !== 'OK') {
    return res.status(502).json({ error: data.status, message: data.error_message })
  }

  const result = data.result
  return res.json({
    placeId,
    address: result.formatted_address,
    name: result.name,
    lat: result.geometry.location.lat,
    lng: result.geometry.location.lng
  })
})

export default router
