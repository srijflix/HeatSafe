import { findWalkingRoutes } from '../../../src/server-data'

const isPoint = (point) => Number.isFinite(point?.lat) && Number.isFinite(point?.lng)

export async function POST(request) {
  try {
    const { origin, destination } = await request.json()
    if (!isPoint(origin) || !isPoint(destination)) {
      return Response.json({ error: 'Choose a valid start and destination.' }, { status: 400 })
    }
    return Response.json(await findWalkingRoutes(origin, destination))
  } catch (error) {
    return Response.json({ error: error.message || 'Routes could not be loaded.' }, { status: 502 })
  }
}
