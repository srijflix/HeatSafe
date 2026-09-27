import { DM_Sans, Manrope } from 'next/font/google'
import 'leaflet/dist/leaflet.css'
import '../src/styles.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
})

export const metadata = {
  title: 'HeatSafe | Cooler walking routes',
  description: 'Compare live walking routes using current heat, air quality, shade estimates, and water access.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${manrope.variable}`}>
      <body>{children}</body>
    </html>
  )
}
