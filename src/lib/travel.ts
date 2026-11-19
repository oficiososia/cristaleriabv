import { site } from "@/content/site";

/**
 * Coste de desplazamiento para la visita técnica / toma de medidas.
 * Política: gratis dentro del término municipal de Crevillente; fuera,
 * 10 € por cada 10 km (o fracción) desde el taller (C/ Pío XII, 5).
 */
export const TRAVEL_RATE_EUR = 10;
export const TRAVEL_BLOCK_KM = 10;

export type Town = { name: string; km: number; free?: boolean };

/** Distancias por carretera desde el taller (OpenStreetMap/OSRM, calculadas en nov. 2026). */
export const towns: Town[] = [
  { name: "Crevillente", km: 1.0, free: true },
  { name: "El Realengo (Crevillente)", km: 6.2, free: true },
  { name: "San Felipe Neri (Crevillente)", km: 9.7, free: true },
  { name: "Albatera", km: 9.6 },
  { name: "Alicante", km: 33.9 },
  { name: "Almoradí", km: 20.7 },
  { name: "Aspe", km: 14.6 },
  { name: "Benidorm", km: 79.3 },
  { name: "Callosa de Segura", km: 17.4 },
  { name: "Catral", km: 10.8 },
  { name: "Cox", km: 15.0 },
  { name: "Daya Nueva", km: 21.6 },
  { name: "Dolores", km: 20.7 },
  { name: "El Altet (Elche)", km: 29.4 },
  { name: "Elche", km: 11.0 },
  { name: "Elda", km: 33.5 },
  { name: "Formentera del Segura", km: 24.4 },
  { name: "Gran Alacant (Santa Pola)", km: 36.1 },
  { name: "Granja de Rocamora", km: 13.6 },
  { name: "Guardamar del Segura", km: 32.9 },
  { name: "La Marina (Elche)", km: 24.6 },
  { name: "Monforte del Cid", km: 20.4 },
  { name: "Murcia", km: 56.4 },
  { name: "Novelda", km: 19.2 },
  { name: "Orihuela", km: 31.9 },
  { name: "Petrer", km: 34.3 },
  { name: "Rafal", km: 21.4 },
  { name: "Redován", km: 20.7 },
  { name: "Rojales", km: 26.4 },
  { name: "San Fulgencio", km: 26.3 },
  { name: "San Isidro", km: 12.2 },
  { name: "San Vicente del Raspeig", km: 36.1 },
  { name: "Santa Pola", km: 26.4 },
  { name: "Torrellano (Elche)", km: 22.7 },
  { name: "Torrevieja", km: 38.8 },
];

/** Coste en € para una distancia (solo ida) fuera de Crevillente. */
export function travelCost(km: number, free = false): number {
  if (free || km <= 0) return 0;
  return Math.ceil(km / TRAVEL_BLOCK_KM) * TRAVEL_RATE_EUR;
}

/** Distancia en línea recta (km) entre dos coordenadas. */
export function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Factor medio entre la distancia en línea recta y la distancia por carretera en la zona. */
const ROAD_FACTOR = 1.3;
/** Radio (línea recta) considerado dentro de Crevillente al usar la geolocalización. */
const FREE_RADIUS_KM = 4;

/** Estimación por carretera desde la ubicación del cliente (geolocalización). */
export function estimateFromCoords(lat: number, lon: number): { km: number; free: boolean } {
  const straight = haversineKm(site.address.lat, site.address.lon, lat, lon);
  return { km: Math.round(straight * ROAD_FACTOR * 10) / 10, free: straight <= FREE_RADIUS_KM };
}
