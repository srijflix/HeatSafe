'use client'

import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { Circle, CircleMarker, MapContainer, Polyline, TileLayer, Tooltip, useMap } from 'react-leaflet'
import {
  AlertTriangle, Check, ChevronDown, Clock3, CloudSun, Droplets, LocateFixed,
  MapPin, Minus, Navigation, Plus, RefreshCw, Search, ThermometerSun,
  Wind, X,
} from 'lucide-react'
import { getConditions, getWalkingRoutes, reversePlace, searchPlace, searchPlaces } from './api'
import SiteHeader from './SiteHeader'

const DEFAULT_ORIGIN = { lat: 39.2896, lng: -76.6240, label: 'University of Maryland Medical Center' }
const DEFAULT_DESTINATION = { lat: 39.2919, lng: -76.6227, label: 'Lexington Market' }
const formatTime = (date) => new Intl.DateTimeFormat([], { hour: 'numeric', minute: '2-digit' }).format(date)

function AddressInput({ kind, label, value, onChange, onChoose, icon, locationAction, near }) {
  const listId = useId()
  const [suggestions, setSuggestions] = useState([])
  const [open, setOpen] = useState(false)
  const [searching, setSearching] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [edited, setEdited] = useState(false)

  useEffect(() => {
    if (!edited || value.trim().length < 3) {
      setSuggestions([])
      setOpen(false)
      return undefined
    }
    const controller = new AbortController()
    const timer = window.setTimeout(async () => {
      setSearching(true)
      try {
        const results = await searchPlaces(value, controller.signal, 5, near)
        setSuggestions(results)
        setOpen(true)
        setActiveIndex(-1)
      } catch (error) {
        if (error.name !== 'AbortError') setSuggestions([])
      } finally {
        if (!controller.signal.aborted) setSearching(false)
      }
    }, 350)
    return () => { window.clearTimeout(timer); controller.abort() }
  }, [edited, value, near?.lat, near?.lng])

  const choose = (place) => {
    onChoose(place)
    setEdited(false)
    setOpen(false)
    setSuggestions([])
  }

  const handleKeyDown = (event) => {
    if (!open || !suggestions.length) return
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((index) => Math.min(index + 1, suggestions.length - 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((index) => Math.max(index - 1, 0))
    } else if (event.key === 'Enter' && activeIndex >= 0) {
      event.preventDefault()
      choose(suggestions[activeIndex])
    } else if (event.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div className={`address-control address-${kind}`}>
      <label className="field address-field">
        {icon}
        <span className="field-text"><small>{label}</small><input value={value} onChange={(event) => { setEdited(true); onChange(event.target.value) }} onFocus={() => suggestions.length && setOpen(true)} onBlur={() => window.setTimeout(() => setOpen(false), 120)} onKeyDown={handleKeyDown} placeholder={kind === 'origin' ? 'Enter a starting address' : 'Enter a destination'} autoComplete="off" role="combobox" aria-autocomplete="list" aria-expanded={open} aria-controls={listId} aria-activedescendant={activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined} required /></span>
        {searching && <span className="spinner dark address-spinner" aria-label="Searching addresses" />}
      </label>
      {locationAction}
      {open && <div className="address-suggestions" id={listId} role="listbox" aria-label={`${label} suggestions`}>
        {suggestions.length ? suggestions.map((place, index) => (
          <button key={place.id} id={`${listId}-${index}`} type="button" role="option" aria-selected={index === activeIndex} className={index === activeIndex ? 'active' : ''} onMouseDown={(event) => event.preventDefault()} onClick={() => choose(place)}>
            <MapPin size={16} /><span><strong>{place.label}</strong><small>{place.distanceMiles == null ? place.fullLabel : `${place.distanceMiles < 0.1 ? '<0.1' : place.distanceMiles.toFixed(1)} mi from start · ${place.fullLabel}`}</small></span>
          </button>
        )) : <span className="no-suggestions">No matching addresses found</span>}
      </div>}
    </div>
  )
}

function Planner({ originText, destinationText, origin, setOriginText, setDestinationText, onFind, onLocate, onChooseOrigin, onChooseDestination, loading }) {
  const swap = () => { setOriginText(destinationText); setDestinationText(originText) }
  return (
    <form className="planner-form" onSubmit={(event) => { event.preventDefault(); onFind() }}>
      <div className="field-pair">
        <AddressInput kind="origin" label="Start" value={originText} onChange={setOriginText} onChoose={onChooseOrigin} icon={<span className="field-icon origin-icon" aria-hidden="true" />} locationAction={<button className="use-location" type="button" onClick={onLocate} aria-label="Use my current location" title="Use my current location"><LocateFixed size={17} /></button>} />
        <span className="route-stem" aria-hidden="true" />
        <AddressInput kind="destination" label="End" value={destinationText} onChange={setDestinationText} onChoose={onChooseDestination} near={originText === origin.label ? origin : undefined} icon={<MapPin className="field-pin" size={21} fill="currentColor" />} />
        <button className="swap-button" type="button" onClick={swap} aria-label="Swap start and destination"><span>↑</span><span>↓</span></button>
      </div>
      <label className="field time-field"><Clock3 size={21} /><span className="sr-only">Departure time</span><select defaultValue="now"><option value="now">Now · {formatTime(new Date())}</option><option value="thirty">In 30 minutes</option><option value="hour">In 1 hour</option></select><ChevronDown size={18} aria-hidden="true" /></label>
      <button className="primary-button" disabled={loading}>{loading ? <span className="spinner" /> : <Search size={22} />}{loading ? 'Checking live routes…' : 'Find safer routes'}</button>
    </form>
  )
}

function RouteOption({ route, selected, onSelect }) {
  return (
    <button className={`route-option ${selected ? 'selected' : ''}`} style={{ '--route-color': route.color }} onClick={() => onSelect(route.id)} aria-pressed={selected}>
      <span className="radio">{selected && <Check size={15} strokeWidth={3} />}</span>
      <span className="route-summary"><strong>{route.name}</strong><span>{route.time} min <b>·</b> {route.distance} mi</span></span>
      <span className="route-stat"><small>Heat exposure</small><strong className={`exposure ${route.exposure.toLowerCase()}`}>{route.exposure}</strong></span>
      <span className="route-stat"><small>Est. shade</small><strong>{route.shade}%</strong></span>
      <span className="route-stat"><small>Water stops</small><strong>{route.water}</strong></span>
    </button>
  )
}

function ConditionsStrip({ conditions }) {
  if (!conditions) return <div className="conditions-strip loading-strip">Loading current weather…</div>
  return (
    <div className="conditions-strip" aria-label="Current live weather">
      <span><ThermometerSun size={16} /><b>{conditions.feelsLike}°</b> feels like</span><span><Droplets size={16} /><b>{conditions.humidity}%</b> humidity</span><span><Wind size={16} /><b>{conditions.wind}</b> mph</span><span><CloudSun size={16} /><b>{conditions.aqi ?? '—'}</b> AQI</span>
    </div>
  )
}

function Sidebar({ routes, selected, setSelected, plannerProps, conditions, error }) {
  const [alertVisible, setAlertVisible] = useState(true)
  const isHot = conditions?.feelsLike >= 90
  return (
    <aside className="sidebar" id="planner">
      <section className="intro"><h1>Walk cooler.<br />Arrive safer.</h1><p>Compare live walking routes using current heat, shade estimates, air quality, and water access.</p></section>
      <Planner {...plannerProps} />
      {error && <div className="error-message" role="alert">{error}</div>}
      <ConditionsStrip conditions={conditions} />
      <section className="routes" id="route-options">
        <div className="section-heading"><h2>Live route options</h2><span><span className="live-dot" /> Updated now</span></div>
        <div className="route-list">{routes.map((route) => <RouteOption key={route.id} route={route} selected={selected === route.id} onSelect={setSelected} />)}</div>
      </section>
      {alertVisible && conditions && <aside className={`heat-alert ${isHot ? '' : 'mild'}`} id="heat-advisory"><AlertTriangle size={26} fill="currentColor" /><div><strong>{isHot ? 'High heat caution' : 'Current walking conditions'}</strong><span>Feels like {conditions.feelsLike}°F. {isHot ? 'Carry water and take breaks.' : 'Stay hydrated and check conditions en route.'}</span></div><button onClick={() => setAlertVisible(false)} aria-label="Dismiss advisory"><X size={17} /></button></aside>}
    </aside>
  )
}

function MapViewport({ routes, selected, origin, destination }) {
  const map = useMap()
  const active = routes.find((route) => route.id === selected)
  const signature = `${origin.lat},${origin.lng},${destination.lat},${destination.lng},${selected},${active?.geometry?.length}`
  useEffect(() => {
    const points = active?.geometry?.length ? active.geometry : [[origin.lat, origin.lng], [destination.lat, destination.lng]]
    map.fitBounds(points, { padding: [70, 70], maxZoom: 16, animate: true })
  }, [map, signature]) // eslint-disable-line react-hooks/exhaustive-deps
  return null
}

function LiveMapControls({ heatLayer, setHeatLayer, onLocate, refreshing, onRefresh }) {
  const map = useMap()
  return (
    <div className="map-controls leaflet-ui">
      <button className={heatLayer ? 'layer-button active' : 'layer-button'} onClick={() => setHeatLayer(!heatLayer)} aria-pressed={heatLayer}><ThermometerSun size={19} /><span>Live heat layer</span></button>
      <div className="zoom-controls"><button onClick={() => map.zoomIn()} aria-label="Zoom in"><Plus /></button><button onClick={() => map.zoomOut()} aria-label="Zoom out"><Minus /></button><button onClick={onLocate} aria-label="Center on my location"><LocateFixed /></button><button onClick={onRefresh} aria-label="Refresh live data"><RefreshCw className={refreshing ? 'rotating' : ''} /></button></div>
    </div>
  )
}

function RouteDetail({ route, conditions }) {
  const [visible, setVisible] = useState(true)
  useEffect(() => setVisible(true), [route?.id])
  if (!route || !visible) return null
  const delta = route.id === 'coolest' ? 'Lower estimated sun exposure' : route.id === 'balanced' ? 'A practical heat / time balance' : 'Shortest live walking path'
  return (
    <div className="route-detail" style={{ '--route-color': route.color }}><button onClick={() => setVisible(false)} aria-label="Close route details"><X size={17} /></button><div className="detail-title"><span /><div><strong>{route.name}</strong><small>{delta}</small></div></div><div className="detail-divider" /><span className="profile-label">Estimated sun exposure along route</span><div className="shade-profile" aria-hidden="true">{[38, 32, 36, 45, 53, 60, 55, 46].map((height, index) => <i key={index} style={{ height: route.id === 'coolest' ? height : height + (route.id === 'fastest' ? 18 : 8) }} />)}</div><div className="profile-scale"><span>More shade</span><span>{conditions?.feelsLike ?? '—'}° feels like</span></div></div>
  )
}

function Legend() {
  return <div className="legend leaflet-ui"><div><i className="line teal" />Coolest route</div><div><i className="line amber" />Balanced route</div><div><i className="line coral" />Fastest route</div><div><i className="heat-key" />Live heat overlay</div></div>
}

function HeatTimeline({ route, conditions }) {
  if (!route) return null
  const start = new Date(); const end = new Date(start.getTime() + route.time * 60_000)
  return <div className="timeline leaflet-ui"><div className="timeline-top"><strong>Expected heat along selected route</strong><span><Navigation size={15} fill="currentColor" /> {formatTime(start)}</span><span>{formatTime(end)}</span></div><div className="heat-strip" style={{ filter: `saturate(${conditions?.feelsLike >= 90 ? 1.2 : .78})` }}><i className="start-tick" /><i className="end-tick" /></div><div className="timeline-scale"><span>Shaded</span><span>Exposed</span></div></div>
}

function MapPanel({ routes, selected, origin, destination, conditions, heatLayer, setHeatLayer, onLocate, refreshing, onRefresh }) {
  const activeRoute = useMemo(() => routes.find((route) => route.id === selected), [routes, selected])
  const heatRadius = Math.max(240, Math.min(680, ((conditions?.feelsLike || 80) - 55) * 15))
  return (
    <main className="map-panel">
      <MapContainer center={[39.291, -76.622]} zoom={15} zoomControl={false} className="live-map">
        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" maxZoom={19} />
        <MapViewport routes={routes} selected={selected} origin={origin} destination={destination} />
        {heatLayer && activeRoute?.geometry.filter((_, index) => index % Math.max(1, Math.floor(activeRoute.geometry.length / 7)) === 0).map((position, index) => <Circle key={`${position}-${index}`} center={position} radius={heatRadius} pathOptions={{ color: 'transparent', fillColor: index % 2 ? '#ff9b3f' : '#f35a55', fillOpacity: .12 }} interactive={false} />)}
        {routes.map((route) => <Polyline key={route.id} positions={route.geometry} pathOptions={{ color: route.color, weight: selected === route.id ? 8 : 4, opacity: selected === route.id ? 1 : .55, dashArray: route.id === 'fastest' ? '10 8' : undefined, lineCap: 'round', lineJoin: 'round' }} />)}
        <CircleMarker center={[origin.lat, origin.lng]} radius={9} pathOptions={{ color: '#087a78', weight: 4, fillColor: '#fff', fillOpacity: 1 }}><Tooltip direction="top">{origin.label}</Tooltip></CircleMarker>
        <CircleMarker center={[destination.lat, destination.lng]} radius={10} pathOptions={{ color: '#fff', weight: 3, fillColor: '#ef4136', fillOpacity: 1 }}><Tooltip direction="top">{destination.label}</Tooltip></CircleMarker>
        <LiveMapControls heatLayer={heatLayer} setHeatLayer={setHeatLayer} onLocate={onLocate} refreshing={refreshing} onRefresh={onRefresh} />
      </MapContainer>
      {refreshing && <div className="map-loading"><span className="spinner dark" /> Updating live data…</div>}
      <RouteDetail route={activeRoute} conditions={conditions} /><Legend /><HeatTimeline route={activeRoute} conditions={conditions} />
    </main>
  )
}

export default function App() {
  const [originText, setOriginText] = useState(DEFAULT_ORIGIN.label)
  const [destinationText, setDestinationText] = useState(DEFAULT_DESTINATION.label)
  const [origin, setOrigin] = useState(DEFAULT_ORIGIN)
  const [destination, setDestination] = useState(DEFAULT_DESTINATION)
  const [routes, setRoutes] = useState([])
  const [selected, setSelected] = useState('coolest')
  const [conditions, setConditions] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [heatLayer, setHeatLayer] = useState(true)
  const requestRef = useRef(null)

  const loadLiveData = useCallback(async (nextOrigin = origin, nextDestination = destination, withRoutes = true) => {
    requestRef.current?.abort()
    const controller = new AbortController(); requestRef.current = controller
    setLoading(true); setError('')
    try {
      const midpoint = { lat: (nextOrigin.lat + nextDestination.lat) / 2, lng: (nextOrigin.lng + nextDestination.lng) / 2 }
      const [nextRoutes, nextConditions] = await Promise.all([withRoutes ? getWalkingRoutes(nextOrigin, nextDestination, controller.signal) : Promise.resolve(routes), getConditions(midpoint.lat, midpoint.lng, controller.signal)])
      setRoutes(nextRoutes); setConditions(nextConditions); if (withRoutes) setSelected('coolest')
    } catch (reason) {
      if (reason.name !== 'AbortError') setError(reason.message || 'Live data could not be loaded. Please try again.')
    } finally { if (!controller.signal.aborted) setLoading(false) }
  }, [origin, destination, routes])

  useEffect(() => { loadLiveData(DEFAULT_ORIGIN, DEFAULT_DESTINATION) }, []) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { const timer = window.setInterval(() => loadLiveData(origin, destination, false), 5 * 60_000); return () => window.clearInterval(timer) }, [origin, destination, loadLiveData])

  const findRoutes = async () => {
    setLoading(true); setError('')
    try {
      const controller = new AbortController()
      const nextOrigin = originText === origin.label ? origin : await searchPlace(originText, controller.signal)
      const nextDestination = destinationText === destination.label
        ? destination
        : await searchPlace(destinationText, controller.signal, nextOrigin)
      setOrigin(nextOrigin); setDestination(nextDestination); setOriginText(nextOrigin.label); setDestinationText(nextDestination.label)
      await loadLiveData(nextOrigin, nextDestination)
    } catch (reason) { setError(reason.message || 'Those places could not be found.'); setLoading(false) }
  }

  const locateMe = () => {
    if (!navigator.geolocation) { setError('Location is not supported by this browser.'); return }
    setLoading(true); setError('')
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      const nextOrigin = { lat: coords.latitude, lng: coords.longitude, label: 'Current location' }
      try { nextOrigin.label = await reversePlace(nextOrigin.lat, nextOrigin.lng) } catch { /* keep fallback */ }
      setOrigin(nextOrigin); setOriginText(nextOrigin.label); await loadLiveData(nextOrigin, destination)
    }, () => { setError('Location access was not allowed. You can still type an address.'); setLoading(false) }, { enableHighAccuracy: true, timeout: 10_000 })
  }

  const chooseOrigin = (place) => { setOrigin(place); setOriginText(place.label) }
  const chooseDestination = (place) => { setDestination(place); setDestinationText(place.label) }
  const plannerProps = { originText, destinationText, origin, setOriginText, setDestinationText, onFind: findRoutes, onLocate: locateMe, onChooseOrigin: chooseOrigin, onChooseDestination: chooseDestination, loading }
  return <div className="app-shell"><SiteHeader conditions={conditions} /><div className="workspace"><Sidebar routes={routes} selected={selected} setSelected={setSelected} plannerProps={plannerProps} conditions={conditions} error={error} /><MapPanel routes={routes} selected={selected} origin={origin} destination={destination} conditions={conditions} heatLayer={heatLayer} setHeatLayer={setHeatLayer} onLocate={locateMe} refreshing={loading} onRefresh={() => loadLiveData(origin, destination)} /></div></div>
}
