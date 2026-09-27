'use client'

export default function GlobalError({ reset }) {
  return (
    <main className="error-screen">
      <h1>HeatSafe needs a quick reset.</h1>
      <p>The live map could not start. Check your connection and try again.</p>
      <button className="primary-button" onClick={reset}>Try again</button>
    </main>
  )
}
