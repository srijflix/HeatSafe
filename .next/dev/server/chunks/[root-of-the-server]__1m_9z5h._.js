module.exports = [
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/runtime-reacts.external.js [external] (next/dist/server/runtime-reacts.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/runtime-reacts.external.js", () => require("next/dist/server/runtime-reacts.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/node:stream [external] (node:stream, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:stream", () => require("node:stream"));

module.exports = mod;
}),
"[project]/app/api/conditions/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2d$data$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/server-data.js [app-route] (ecmascript)");
;
async function GET(request) {
    const lat = Number(request.nextUrl.searchParams.get('lat'));
    const lng = Number(request.nextUrl.searchParams.get('lng'));
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
        return Response.json({
            error: 'Valid coordinates are required.'
        }, {
            status: 400
        });
    }
    try {
        return Response.json(await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$server$2d$data$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["findConditions"])(lat, lng));
    } catch (error) {
        return Response.json({
            error: error.message || 'Conditions could not be loaded.'
        }, {
            status: 502
        });
    }
}
}),
"[project]/src/server-data.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "fetchUpstream",
    ()=>fetchUpstream,
    "findConditions",
    ()=>findConditions,
    "findPlaces",
    ()=>findPlaces,
    "findWalkingRoutes",
    ()=>findWalkingRoutes,
    "normalizePlace",
    ()=>normalizePlace,
    "reversePlace",
    ()=>reversePlace
]);
const NOMINATIM_URL = 'https://nominatim.openstreetmap.org';
const ROUTER_URL = 'https://routing.openstreetmap.de/routed-foot/route/v1/driving';
const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';
const AIR_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality';
const upstreamHeaders = {
    Accept: 'application/json',
    'User-Agent': 'HeatSafe route planner'
};
const fetchUpstream = async (url, options = {})=>{
    const response = await fetch(url, {
        ...options,
        cache: 'no-store',
        headers: {
            ...upstreamHeaders,
            ...options.headers
        }
    });
    if (!response.ok) throw new Error(`Live service returned ${response.status}`);
    return response.json();
};
const compactLabel = (place)=>{
    const address = place.address || {};
    const street = address.house_number && address.road ? [
        address.house_number,
        address.road
    ].filter(Boolean).join(' ') : address.road || address.neighbourhood || address.suburb;
    const primary = place.name || street;
    const locality = address.city || address.town || address.village || address.county;
    const region = address.state;
    const concise = [
        primary,
        locality,
        region
    ].filter(Boolean);
    return concise.length >= 2 ? concise.join(', ') : place.display_name.split(',').slice(0, 4).join(',');
};
const distanceMiles = (from, to)=>{
    const toRadians = (value)=>value * Math.PI / 180;
    const earthRadiusMiles = 3958.8;
    const latDelta = toRadians(to.lat - from.lat);
    const lngDelta = toRadians(to.lng - from.lng);
    const startLat = toRadians(from.lat);
    const endLat = toRadians(to.lat);
    const haversine = Math.sin(latDelta / 2) ** 2 + Math.cos(startLat) * Math.cos(endLat) * Math.sin(lngDelta / 2) ** 2;
    return earthRadiusMiles * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
};
const normalizePlace = (place, near)=>{
    const normalized = {
        id: String(place.place_id),
        lat: Number(place.lat),
        lng: Number(place.lon),
        label: compactLabel(place),
        fullLabel: place.display_name
    };
    return near ? {
        ...normalized,
        distanceMiles: distanceMiles(near, normalized)
    } : normalized;
};
async function findPlaces(query, limit = 5, near) {
    const resultLimit = near ? Math.min(40, Math.max(16, limit * 4)) : limit;
    const center = near || {
        lat: 39.29,
        lng: -76.61
    };
    const latitudeSpan = near ? 0.3 : 0.09;
    const longitudeSpan = near ? 0.4 : 0.14;
    const looksLikeSpecificAddress = /\d|,/.test(query);
    const params = new URLSearchParams({
        q: query,
        format: 'jsonv2',
        limit: String(resultLimit),
        addressdetails: '1',
        countrycodes: 'us',
        viewbox: `${center.lng - longitudeSpan},${center.lat - latitudeSpan},${center.lng + longitudeSpan},${center.lat + latitudeSpan}`,
        bounded: near && !looksLikeSpecificAddress ? '1' : '0'
    });
    const results = await fetchUpstream(`${NOMINATIM_URL}/search?${params}`);
    const normalized = results.map((place)=>normalizePlace(place, near));
    if (near) normalized.sort((first, second)=>first.distanceMiles - second.distanceMiles);
    return normalized.slice(0, limit);
}
async function reversePlace(lat, lng) {
    const params = new URLSearchParams({
        lat: String(lat),
        lon: String(lng),
        format: 'jsonv2',
        zoom: '18',
        addressdetails: '1'
    });
    const place = await fetchUpstream(`${NOMINATIM_URL}/reverse?${params}`);
    return compactLabel(place) || 'Current location';
}
const routeUrl = (points)=>{
    const coordinates = points.map(({ lng, lat })=>`${lng},${lat}`).join(';');
    return `${ROUTER_URL}/${coordinates}?steps=true&geometries=geojson&overview=full`;
};
const routeVariant = async (points)=>{
    const data = await fetchUpstream(routeUrl(points));
    if (data.code !== 'Ok' || !data.routes?.[0]) throw new Error('No walkable route was found between these places.');
    return data.routes[0];
};
const makeWaypoint = (origin, destination, direction)=>{
    const midLat = (origin.lat + destination.lat) / 2;
    const midLng = (origin.lng + destination.lng) / 2;
    const latDelta = destination.lat - origin.lat;
    const lngDelta = destination.lng - origin.lng;
    const length = Math.hypot(latDelta, lngDelta) || 1;
    const offset = Math.min(0.0038, Math.max(0.0012, length * 0.2)) * direction;
    return {
        lat: midLat - lngDelta / length * offset,
        lng: midLng + latDelta / length * offset
    };
};
async function findWalkingRoutes(origin, destination) {
    const variants = [
        [
            origin,
            destination
        ],
        [
            origin,
            makeWaypoint(origin, destination, 1),
            destination
        ],
        [
            origin,
            makeWaypoint(origin, destination, -1),
            destination
        ]
    ];
    const settled = await Promise.allSettled(variants.map(routeVariant));
    const unique = settled.filter((result)=>result.status === 'fulfilled').map((result)=>result.value).filter((route, index, routes)=>routes.findIndex((item)=>Math.round(item.distance) === Math.round(route.distance)) === index);
    if (!unique.length) throw new Error('The free walking router is temporarily unavailable. Please try again.');
    while(unique.length < 3)unique.push({
        ...unique[unique.length - 1]
    });
    const byDistance = [
        ...unique
    ].sort((a, b)=>a.distance - b.distance);
    const definitions = [
        {
            id: 'coolest',
            name: 'Coolest route',
            color: '#087a78',
            exposure: 'Low',
            shade: 68,
            water: 2,
            source: unique[1] || unique[0]
        },
        {
            id: 'balanced',
            name: 'Balanced',
            color: '#e6a320',
            exposure: 'Medium',
            shade: 44,
            water: 1,
            source: unique[2] || unique[0]
        },
        {
            id: 'fastest',
            name: 'Fastest',
            color: '#f2665b',
            exposure: 'High',
            shade: 22,
            water: 0,
            source: byDistance[0]
        }
    ];
    return definitions.map(({ source, ...definition })=>({
            ...definition,
            time: Math.max(1, Math.round(source.duration / 60)),
            distance: (source.distance / 1609.344).toFixed(1),
            geometry: source.geometry.coordinates.map(([lng, lat])=>[
                    lat,
                    lng
                ]),
            steps: source.legs?.flatMap((leg)=>leg.steps || []) || []
        }));
}
async function findConditions(lat, lng) {
    const weatherParams = new URLSearchParams({
        latitude: String(lat),
        longitude: String(lng),
        current: 'temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code,is_day',
        temperature_unit: 'fahrenheit',
        wind_speed_unit: 'mph',
        timezone: 'auto'
    });
    const airParams = new URLSearchParams({
        latitude: String(lat),
        longitude: String(lng),
        current: 'us_aqi',
        timezone: 'auto'
    });
    const [weather, air] = await Promise.all([
        fetchUpstream(`${WEATHER_URL}?${weatherParams}`),
        fetchUpstream(`${AIR_URL}?${airParams}`).catch(()=>({
                current: {}
            }))
    ]);
    return {
        temperature: Math.round(weather.current.temperature_2m),
        feelsLike: Math.round(weather.current.apparent_temperature),
        humidity: Math.round(weather.current.relative_humidity_2m),
        wind: Math.round(weather.current.wind_speed_10m),
        weatherCode: weather.current.weather_code,
        isDay: Boolean(weather.current.is_day),
        aqi: air.current?.us_aqi == null ? null : Math.round(air.current.us_aqi),
        updatedAt: weather.current.time
    };
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1m_9z5h._.js.map