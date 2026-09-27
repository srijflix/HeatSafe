import { ImageResponse } from 'next/og'

export const alt = 'HeatSafe — compare cooler walking routes using live conditions'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

function BrandMark() {
  return (
    <div style={{ position: 'relative', width: 74, height: 74, display: 'flex' }}>
      <div style={{ position: 'absolute', left: 27, top: 4, width: 30, height: 30, borderRadius: 999, background: '#f9aa12' }} />
      <div style={{ position: 'absolute', left: 1, top: 39, width: 68, height: 17, borderRadius: '50% 50% 8px 8px', transform: 'rotate(-10deg)', background: '#087a78' }} />
      <div style={{ position: 'absolute', left: 17, top: 57, width: 50, height: 13, borderRadius: '50% 50% 8px 8px', transform: 'rotate(-10deg)', background: '#2f9e93' }} />
    </div>
  )
}

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', position: 'relative', overflow: 'hidden', color: '#09233f', background: '#f7f9f8', fontFamily: 'Arial, sans-serif' }}>
        <div style={{ position: 'absolute', right: -85, top: -95, width: 430, height: 430, borderRadius: 999, background: '#fff0cf' }} />
        <div style={{ position: 'absolute', right: 30, top: 40, width: 205, height: 205, borderRadius: 999, background: '#f9aa12' }} />
        <div style={{ position: 'absolute', right: -95, bottom: 65, width: 620, height: 128, borderRadius: '50% 0 0 50%', transform: 'rotate(-8deg)', background: '#087a78' }} />
        <div style={{ position: 'absolute', right: -70, bottom: -10, width: 500, height: 105, borderRadius: '50% 0 0 50%', transform: 'rotate(-8deg)', background: '#2f9e93' }} />

        <div style={{ width: 790, padding: '72px 0 64px 76px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <BrandMark />
            <div style={{ fontSize: 48, fontWeight: 800, letterSpacing: -2 }}>HeatSafe</div>
          </div>
          <div style={{ marginTop: 75, display: 'flex', flexDirection: 'column', fontSize: 72, lineHeight: 1.02, fontWeight: 800, letterSpacing: -3.2 }}>
            <span>Walk cooler.</span>
            <span>Arrive safer.</span>
          </div>
          <div style={{ marginTop: 30, maxWidth: 680, color: '#405a70', fontSize: 28, lineHeight: 1.35 }}>
            Compare routes using live heat, shade, air quality, water access, and travel time.
          </div>
        </div>
      </div>
    ),
    size,
  )
}
