import Link from 'next/link'
import { ArrowRight, CloudSun, Droplets, MapPin, Route, ShieldCheck, Sparkles, Trees } from 'lucide-react'
import SiteHeader from '../../src/SiteHeader'

export const metadata = {
  title: 'How It Works',
  description: 'Learn how HeatSafe compares walking routes using live heat, air quality, shade estimates, water access, and travel time.',
}

const steps = [
  {
    number: '01',
    icon: MapPin,
    title: 'Tell us where you are going',
    text: 'Enter a start and destination, or use your current location. HeatSafe looks for practical walking options between both points.',
  },
  {
    number: '02',
    icon: CloudSun,
    title: 'We check current conditions',
    text: 'Live temperature, feels-like conditions, humidity, wind, and air quality help describe what the walk may feel like right now.',
  },
  {
    number: '03',
    icon: Route,
    title: 'Routes are compared',
    text: 'Each option balances estimated sun exposure and shade with distance, walking time, and nearby water access.',
  },
  {
    number: '04',
    icon: ShieldCheck,
    title: 'You choose what fits',
    text: 'Pick the coolest, balanced, or fastest route. The map and route summary make the tradeoffs easy to see before you leave.',
  },
]

const signals = [
  { icon: CloudSun, title: 'Live heat', text: 'Temperature and feels-like conditions near the route.' },
  { icon: Trees, title: 'Estimated shade', text: 'A route-level estimate of protection from direct sun.' },
  { icon: Sparkles, title: 'Air quality', text: 'Current AQI adds context when heat is not the only concern.' },
  { icon: Droplets, title: 'Water access', text: 'Known water stops along or close to the walking route.' },
]

export default function HowItWorksPage() {
  return (
    <div className="info-shell">
      <SiteHeader active="how" />
      <main>
        <section className="info-hero how-hero">
          <div className="info-hero-copy">
            <h1>A walking route is more than a line on a map.</h1>
            <p>HeatSafe helps you compare the conditions along the way, so you can make a more informed choice before stepping outside.</p>
            <Link className="info-cta" href="/">Plan a safer route <ArrowRight size={18} /></Link>
          </div>
          <div className="route-visual" aria-label="Illustration comparing three walking routes">
            <span className="visual-sun" />
            <div className="route-map-lines" aria-hidden="true"><i /><i /><i /></div>
            <span className="route-pin start">A</span>
            <span className="route-pin finish">B</span>
            <div className="route-visual-key"><span><i className="teal" /> Cooler</span><span><i className="amber" /> Balanced</span><span><i className="coral" /> Fastest</span></div>
          </div>
        </section>

        <section className="info-section steps-section" aria-labelledby="steps-title">
          <div className="section-intro"><h2 id="steps-title">From address to route</h2><p>Four clear steps turn live conditions into useful route choices.</p></div>
          <div className="step-list">
            {steps.map(({ number, icon: Icon, title, text }) => (
              <article className="step-row" key={number}>
                <span className="step-number">{number}</span><span className="step-icon"><Icon size={23} /></span><div><h3>{title}</h3><p>{text}</p></div>
              </article>
            ))}
          </div>
        </section>

        <section className="info-section signals-section" aria-labelledby="signals-title">
          <div className="section-intro"><h2 id="signals-title">What HeatSafe looks at</h2><p>No single number tells the whole story. These signals work together to make route differences visible.</p></div>
          <div className="signal-grid">
            {signals.map(({ icon: Icon, title, text }) => <article key={title}><Icon size={24} /><h3>{title}</h3><p>{text}</p></article>)}
          </div>
          <p className="info-note"><strong>Good to know:</strong> Shade and water access are estimates based on available map data. Conditions can change, so stay aware of your surroundings and follow local advisories.</p>
        </section>

        <section className="info-bottom-cta"><div><h2>See your options side by side.</h2><p>Compare the cooler, balanced, and fastest ways to walk.</p></div><Link className="info-cta light" href="/">Open the route planner <ArrowRight size={18} /></Link></section>
      </main>
    </div>
  )
}
