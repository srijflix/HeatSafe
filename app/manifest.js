export default function manifest() {
  return {
    name: 'HeatSafe — Cooler Walking Routes',
    short_name: 'HeatSafe',
    description: 'Compare live walking routes using current heat, shade estimates, air quality, water access, and travel time.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#f7f9f8',
    theme_color: '#087a78',
    orientation: 'any',
    categories: ['navigation', 'health', 'travel'],
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/apple-icon',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  }
}
