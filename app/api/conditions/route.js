import { findConditions } from '../../../src/server-data'

export async function GET(request) {
  const lat = Number(request.nextUrl.searchParams.get('lat'))
  const lng = Number(request.nextUrl.searchParams.get('lng'))
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return Response.json({ error: 'Valid coordinates are required.' }, { status: 400 })
  }
  try {
    return Response.json(await findConditions(lat, lng))
  } catch (error) {
    return Response.json({ error: error.message || 'Conditions could not be loaded.' }, { status: 502 })
  }
}
