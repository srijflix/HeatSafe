'use client'

import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

export function Brand() {
  return (
    <Link className="brand" href="/" aria-label="HeatSafe home">
      <span className="brand-mark" aria-hidden="true">
        <span className="sun" />
        <span className="road road-one" />
        <span className="road road-two" />
      </span>
      <span>HeatSafe</span>
    </Link>
  )
}

export default function SiteHeader({ active = 'plan', conditions = null }) {
  const [open, setOpen] = useState(false)
  const links = [
    { id: 'plan', href: '/', label: 'Plan route' },
    { id: 'how', href: '/how-it-works', label: 'How it works' },
    { id: 'tips', href: '/heat-tips', label: 'Heat tips' },
  ]

  return (
    <header className="topbar">
      <Brand />
      <button className="menu-button" onClick={() => setOpen(!open)} aria-label="Toggle navigation" aria-expanded={open}>
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>
      <nav className={open ? 'nav open' : 'nav'} aria-label="Primary navigation">
        {links.map((link) => (
          <Link key={link.id} className={active === link.id ? 'active' : undefined} href={link.href} aria-current={active === link.id ? 'page' : undefined} onClick={() => setOpen(false)}>
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="live-weather" aria-live="polite">
        <span className="live-dot" />
        <span>{conditions ? `${conditions.temperature}° Baltimore` : 'Heat-aware guidance'}</span>
      </div>
      <div className="avatar" aria-label="HeatSafe profile">HS</div>
    </header>
  )
}
