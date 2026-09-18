import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export interface IMapPoint {
  id: string;
  lat: number;
  lng: number;
  kind: "you" | "recommended" | "nearest" | "partner";
  title: string;
}

const COLOUR: Record<IMapPoint["kind"], string> = {
  you: "#0a2a5e",
  recommended: "#138808",
  nearest: "#c0392b",
  partner: "#8a93a8",
};

/**
 * Imperative Leaflet wrapper. Uses circle markers so we never depend on
 * Leaflet's bundled marker PNGs (which break under most bundlers) and works
 * without any paid map key — tiles come from OpenStreetMap.
 */
export function MapView({
  center,
  points,
  onPick,
}: {
  center: [number, number];
  points: IMapPoint[];
  onPick?: (lat: number, lng: number) => void;
}) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);
  const pickRef = useRef(onPick);
  pickRef.current = onPick;

  useEffect(() => {
    if (!hostRef.current || mapRef.current) return;
    const map = L.map(hostRef.current, { scrollWheelZoom: true }).setView(center, 6);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(map);
    map.on("click", (e: L.LeafletMouseEvent) => pickRef.current?.(e.latlng.lat, e.latlng.lng));
    mapRef.current = map;
    layerRef.current = L.layerGroup().addTo(map);
    return () => {
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Pan whenever the centre changes.
  useEffect(() => {
    mapRef.current?.setView(center, mapRef.current.getZoom() < 5 ? 6 : mapRef.current.getZoom());
  }, [center]);

  // Redraw points.
  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;
    layer.clearLayers();
    for (const p of points) {
      const marker = L.circleMarker([p.lat, p.lng], {
        radius: p.kind === "you" ? 9 : p.kind === "recommended" ? 8 : 6,
        color: "#ffffff",
        weight: 2,
        fillColor: COLOUR[p.kind],
        fillOpacity: 0.95,
      });
      marker.bindPopup(`<strong>${escapeHtml(p.title)}</strong>`);
      marker.addTo(layer);
    }
  }, [points]);

  return <div className="map" ref={hostRef} role="application" aria-label="Channel partner map" />;
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}
