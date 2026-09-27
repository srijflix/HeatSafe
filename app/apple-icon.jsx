import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', position: 'relative', overflow: 'hidden', borderRadius: 36, background: '#09233f' }}>
        <div style={{ position: 'absolute', left: 68, top: 24, width: 44, height: 44, borderRadius: 999, background: '#f9aa12' }} />
        <div style={{ position: 'absolute', left: 23, top: 99, width: 142, height: 36, borderRadius: '50% 50% 10px 10px', transform: 'rotate(-10deg)', background: '#087a78' }} />
        <div style={{ position: 'absolute', left: 48, top: 139, width: 104, height: 27, borderRadius: '50% 50% 10px 10px', transform: 'rotate(-10deg)', background: '#2f9e93' }} />
      </div>
    ),
    size,
  )
}
