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
  applicationName: 'HeatSafe',
  title: {
    default: 'HeatSafe — Walk cooler. Arrive safer.',
    template: '%s | HeatSafe',
  },
  description: 'Compare live walking routes using current heat, air quality, shade estimates, water access, and travel time.',
  keywords: [
    'heat-safe walking routes',
    'cooler walking routes',
    'walking route planner',
    'heat safety',
    'shade map',
    'Baltimore walking routes',
  ],
  category: 'navigation',
  referrer: 'origin-when-cross-origin',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'HeatSafe',
    title: 'HeatSafe — Walk cooler. Arrive safer.',
    description: 'Compare walking routes using live heat, shade estimates, air quality, water access, and travel time.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HeatSafe — Walk cooler. Arrive safer.',
    description: 'Compare walking routes using live heat, shade estimates, air quality, water access, and travel time.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
}

export const viewport = {
  themeColor: '#087a78',
  colorScheme: 'light',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${manrope.variable}`}>
      <body>{children}</body>
    </html>
  )
}
