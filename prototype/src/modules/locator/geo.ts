/**
 * Geo-spatial partner routing.
 *
 * Rank = proximity × fund-health × scheme-authorisation, with stressed
 * partners down-weighted or excluded entirely. The routing weight on
 * `fundHealth` is the differentiator vs. a generic "nearest branch" lookup:
 * a healthy partner 40 km away is a better routing than a high-NPA partner
 * 5 km away, because the latter is more likely to stall disbursement.
 */

import type { IPartner } from "./partners";
import type { SchemeId } from "../recommender/schemes";

export interface IRouteQuery {
  lat: number;
  lng: number;
  schemeId: SchemeId | null;
  /** Exclude partners below this fund-health score (0–100). */
  minHealth: number;
  /** Hard-exclude any partner banded High NPA. */
  excludeHighNpa: boolean;
}

export interface IRouteResult {
  partner: IPartner;
  distanceKm: number;
  /** 0–100 routing score. */
  routeScore: number;
  /** Which scheme authorisation matched. */
  schemeMatched: boolean;
  reasons: string[];
}

const EARTH_RADIUS_KM = 6371;

export function haversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(a));
}

/** Proximity decays smoothly; 0 km → 1.0, 100 km → ~0.5, 500 km → ~0.17. */
function proximity(distanceKm: number): number {
  return 1 / (1 + distanceKm / 100);
}

export function routePartners(
  partners: IPartner[],
  query: IRouteQuery,
): IRouteResult[] {
  const results: IRouteResult[] = [];

  for (const p of partners) {
    if (query.excludeHighNpa && p.npaBand === "High") continue;
    if (p.fundHealth < query.minHealth) continue;

    const schemeMatched = query.schemeId === null || p.schemes.includes(query.schemeId);
    if (query.schemeId !== null && !schemeMatched) continue;

    const distanceKm = haversineKm(query.lat, query.lng, p.lat, p.lng);
    const prox = proximity(distanceKm);
    const health = p.fundHealth / 100;
    const score = 100 * (0.5 * prox + 0.35 * health + 0.15 * (schemeMatched ? 1 : 0));

    const reasons: string[] = [`${distanceKm.toFixed(1)} km from your location`];
    reasons.push(
      p.fundHealth >= 75
        ? `Healthy fund utilisation (${p.fundHealth}/100) — low disbursement risk`
        : p.fundHealth >= 50
          ? `Moderate fund health (${p.fundHealth}/100) — verify current fund position`
          : `Stressed fund position (${p.fundHealth}/100) — expect delays`,
    );
    if (schemeMatched && query.schemeId) reasons.push(`Authorised for ${query.schemeId}`);
    if (p.overduePct >= 5) reasons.push(`Overdue book ${p.overduePct}% — flagged`);

    results.push({
      partner: p,
      distanceKm,
      routeScore: Math.round(score),
      schemeMatched,
      reasons,
    });
  }

  results.sort((a, b) => b.routeScore - a.routeScore);
  return results;
}

/** Nearest partner regardless of health, for a "before vs after" comparison. */
export function nearestPartner(
  partners: IPartner[],
  lat: number,
  lng: number,
  schemeId: SchemeId | null,
): IRouteResult | null {
  let best: IRouteResult | null = null;
  for (const p of partners) {
    if (schemeId !== null && !p.schemes.includes(schemeId)) continue;
    const distanceKm = haversineKm(lat, lng, p.lat, p.lng);
    if (!best || distanceKm < best.distanceKm) {
      best = {
        partner: p,
        distanceKm,
        routeScore: 0,
        schemeMatched: true,
        reasons: [`${distanceKm.toFixed(1)} km (naive nearest match)`],
      };
    }
  }
  return best;
}
