import { describe, expect, it } from "vitest";
import { PARTNERS } from "./partners";
import { haversineKm, nearestPartner, routePartners } from "./geo";

describe("haversineKm()", () => {
  it("returns ~0 for the same point", () => {
    expect(haversineKm(26.8467, 80.9462, 26.8467, 80.9462)).toBeLessThan(0.001);
  });

  it("computes Delhi→Lucknow at roughly 420 km", () => {
    const d = haversineKm(28.6139, 77.209, 26.8467, 80.9462);
    expect(d).toBeGreaterThan(400);
    expect(d).toBeLessThan(440);
  });
});

describe("routePartners()", () => {
  it("only returns partners authorised for the requested scheme", () => {
    const res = routePartners(PARTNERS, {
      lat: 12.9716,
      lng: 77.5946,
      schemeId: "ELS",
      minHealth: 0,
      excludeHighNpa: false,
    });
    expect(res.length).toBeGreaterThan(0);
    expect(res.every((r) => r.partner.schemes.includes("ELS"))).toBe(true);
  });

  it("excludes High-NPA partners when asked", () => {
    const res = routePartners(PARTNERS, {
      lat: 22.5726,
      lng: 88.3639,
      schemeId: "MFS",
      minHealth: 0,
      excludeHighNpa: true,
    });
    expect(res.every((r) => r.partner.npaBand !== "High")).toBe(true);
  });

  it("results are sorted by route score descending", () => {
    const res = routePartners(PARTNERS, {
      lat: 26.8467,
      lng: 80.9462,
      schemeId: "TERM",
      minHealth: 0,
      excludeHighNpa: false,
    });
    for (let i = 1; i < res.length; i++) {
      expect(res[i - 1].routeScore).toBeGreaterThanOrEqual(res[i].routeScore);
    }
  });

  it("health-aware routing can beat the naive nearest partner", () => {
    // Near Kolkata both ASA (High NPA) and WBSCSTOBCDFC (High NPA) sit close,
    // but a healthy authorised partner should still be reachable.
    const rerouted = routePartners(PARTNERS, {
      lat: 22.5726,
      lng: 88.3639,
      schemeId: "MFS",
      minHealth: 65,
      excludeHighNpa: true,
    });
    const naive = nearestPartner(PARTNERS, 22.5726, 88.3639, "MFS");
    expect(rerouted.length).toBeGreaterThan(0);
    if (naive) {
      expect(rerouted[0].partner.fundHealth).toBeGreaterThanOrEqual(naive.partner.fundHealth);
    }
  });
});
