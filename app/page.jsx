'use client'

import dynamic from 'next/dynamic'

const HeatSafe = dynamic(() => import('../src/App'), {
  ssr: false,
  loading: () => (
    <main className="app-loading" aria-label="Loading HeatSafe">
      <span className="brand">HeatSafe</span>
      <span className="spinner dark" />
    </main>
  ),
})

export default function HomePage() {
  return <HeatSafe />
}
