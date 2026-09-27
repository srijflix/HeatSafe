import Link from 'next/link'
import { AlertTriangle, ArrowRight, Clock3, Droplets, HeartPulse, PhoneCall, Shirt, Trees } from 'lucide-react'
import SiteHeader from '../../src/SiteHeader'

export const metadata = {
  title: 'Heat Tips',
  description: 'Practical tips for planning a walk, staying cool and hydrated, and recognizing heat-related illness.',
}

const tips = [
  { icon: Clock3, title: 'Choose a cooler time', text: 'When possible, walk during the cooler parts of the day or evening and check the forecast before leaving.' },
  { icon: Droplets, title: 'Carry water', text: 'Drink regularly throughout the day. Do not wait until you feel thirsty to start hydrating.' },
  { icon: Trees, title: 'Use shade and take breaks', text: 'Choose shaded streets, slow your pace, and rest in a cool place whenever you need to recover.' },
  { icon: Shirt, title: 'Dress for the heat', text: 'Wear lightweight, loose-fitting clothing and use sun protection for exposed skin.' },
]

export default function HeatTipsPage() {
  return (
    <div className="info-shell">
      <SiteHeader active="tips" />
      <main>
        <section className="info-hero tips-hero">
          <div className="info-hero-copy">
            <h1>Small choices can make a hot walk safer.</h1>
            <p>Plan ahead, listen to your body, and know when it is time to stop. Use these practical steps whenever the heat is high.</p>
            <Link className="info-cta" href="/">Check a route now <ArrowRight size={18} /></Link>
          </div>
          <div className="heat-gauge" aria-label="Heat safety reminder: water, rest, and shade">
            <span className="gauge-sun" aria-hidden="true" />
            <div><Droplets size={25} /><strong>Water</strong><small>Drink regularly</small></div>
            <div><HeartPulse size={25} /><strong>Rest</strong><small>Listen to your body</small></div>
            <div><Trees size={25} /><strong>Shade</strong><small>Cool down often</small></div>
          </div>
        </section>

        <section className="info-section tips-section" aria-labelledby="before-title">
          <div className="section-intro"><h2 id="before-title">Before and during your walk</h2><p>Build these habits into every trip on a hot day.</p></div>
          <div className="tip-grid">
            {tips.map(({ icon: Icon, title, text }) => <article key={title}><span><Icon size={25} /></span><h3>{title}</h3><p>{text}</p></article>)}
          </div>
        </section>

        <section className="symptoms-band" aria-labelledby="symptoms-title">
          <div className="symptoms-heading"><AlertTriangle size={28} /><div><h2 id="symptoms-title">Know the warning signs</h2><p>Heat illness can get worse quickly. Stop walking and move to a cooler place if symptoms begin.</p></div></div>
          <div className="symptom-columns">
            <article><h3>Possible heat exhaustion</h3><p>Heavy sweating, headache, dizziness, weakness, nausea, shortness of breath, or muscle cramps.</p><strong>Cool down, rest, and get help if symptoms do not improve.</strong></article>
            <article className="emergency"><h3>Heat stroke is an emergency</h3><p>Confusion, fainting, slurred speech, seizures, or very hot skin can be signs of heat stroke.</p><strong><PhoneCall size={17} /> Call 911 right away and begin cooling the person.</strong></article>
          </div>
        </section>

        <section className="info-section source-section"><div><h2>Use extra care</h2><p>Heat can affect anyone. Older adults, infants and children, pregnant people, outdoor workers, and people with some chronic conditions may face greater risk. Check on people who live alone, and talk with a healthcare professional about a personal heat plan when needed.</p></div><div className="source-links"><span>Official guidance</span><a href="https://www.cdc.gov/disasters/extremeheat/" target="_blank" rel="noreferrer">CDC Heat &amp; Health <ArrowRight size={15} /></a><a href="https://www.osha.gov/heat-exposure/water-rest-shade" target="_blank" rel="noreferrer">OSHA: Water. Rest. Shade. <ArrowRight size={15} /></a></div></section>

        <section className="info-bottom-cta"><div><h2>Plan for the conditions outside.</h2><p>Compare heat, shade, water access, and walking time before you go.</p></div><Link className="info-cta light" href="/">Plan a safer route <ArrowRight size={18} /></Link></section>
      </main>
    </div>
  )
}
