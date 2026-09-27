import { findPlaces, reversePlace } from '../../../src/server-data'

const jsonError = (message, status = 400) => Response.json({ error: message }, { status })

export async function GET(request) {
  const { searchParams } = request.nextUrl
  const numberParam = (name) => {
    const value = searchParams.get(name)
    return value == null || value === '' ? Number.NaN : Number(value)
  }
  const query = searchParams.get('q')?.trim()
  const lat = numberParam('lat')
  const lng = numberParam('lng')
  const nearLat = numberParam('nearLat')
  const nearLng = numberParam('nearLng')

  try {
    if (query) {
      if (query.length < 3) return Response.json({ results: [] })
      const limit = Math.min(6, Math.max(1, Number(searchParams.get('limit')) || 5))
      const near = Number.isFinite(nearLat) && Number.isFinite(nearLng) ? { lat: nearLat, lng: nearLng } : undefined
      return Response.json({ results: await findPlaces(query, limit, near) })
    }
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      return Response.json({ label: await reversePlace(lat, lng) })
    }
    return jsonError('Enter an address to search.')
  } catch (error) {
    return jsonError(error.message || 'The address service is unavailable.', 502)
  }
}
