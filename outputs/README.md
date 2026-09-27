# HeatSafe

HeatSafe is a Next.js App Router hackathon prototype for comparing real walking routes using current heat, air quality, estimated shade, and water access.

It uses only free, keyless services:

- OpenStreetMap for continuously loaded map tiles.
- Nominatim for address and landmark search.
- OSRM's public pedestrian router for real walkable route geometry.
- Open-Meteo for current weather, feels-like temperature, humidity, wind, and US AQI.

## Run locally

From the project directory:

```bash
npm install --cache ./work/npm-cache
npm run dev
```

Then open the local URL shown by Vite.

## Included interactions

- Select between coolest, balanced, and fastest routes.
- Compare travel time, distance, heat exposure, shade, and water stops.
- Toggle the temperature layer.
- Pan, zoom, recenter, and refresh the live map.
- Swap origin and destination.
- Search for real addresses and landmarks.
- Use browser geolocation as the starting point.
- Change departure time.
- Re-run route comparison with real pedestrian routing.
- Dismiss the heat advisory.
- Refresh conditions automatically every five minutes.
- Responsive mobile navigation and layout.

## Build

```bash
npm run build
```

The production build is emitted to `dist/`.

## Verification

`npm run build` passes with Next.js and Turbopack. The `/` route is statically generated, while the Leaflet map loads through a client-only boundary to avoid server-rendering browser APIs. Live integration checks returned real route geometry and current Baltimore weather/AQI. Browser-based visual verification was not completed because local browser access was denied by the app's security permission prompt.

## Prototype note

Map, geocoding, routing, weather, and AQI are live. Shade and water-stop values are clearly labeled prototype estimates; production deployment should replace those estimates with a maintained local tree-canopy and public-water dataset.
