const fetchJson = async (url, signal, options = {}) => {
  const response = await fetch(url, {
    ...options,
    signal,
    headers: { Accept: 'application/json', ...options.headers },
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.error || `Live service returned ${response.status}`)
  return data
}

export async function searchPlace(query, signal, near) {
  const results = await searchPlaces(query, signal, 1, near)
  if (!results.length) throw new Error(`We couldn't find “${query}”. Try a street address or landmark.`)
  return results[0]
}

export async function searchPlaces(query, signal, limit = 5, near) {
  const params = new URLSearchParams({ q: query.trim(), limit: String(limit) })
  if (Number.isFinite(near?.lat) && Number.isFinite(near?.lng)) {
    params.set('nearLat', String(near.lat))
    params.set('nearLng', String(near.lng))
  }
  const data = await fetchJson(`/api/places?${params}`, signal)
  return data.results || []
}

export async function reversePlace(lat, lng, signal) {
  const params = new URLSearchParams({ lat: String(lat), lng: String(lng) })
  const place = await fetchJson(`/api/places?${params}`, signal)
  return place.label || 'Current location'
}

export async function getWalkingRoutes(origin, destination, signal) {
  return fetchJson('/api/routes', signal, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ origin, destination }),
  })
}

export async function getConditions(lat, lng, signal) {
  const params = new URLSearchParams({ lat: String(lat), lng: String(lng) })
  return fetchJson(`/api/conditions?${params}`, signal)
}
