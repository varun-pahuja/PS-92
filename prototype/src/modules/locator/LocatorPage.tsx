import { useMemo, useState } from "react";
import { useI18n } from "../../i18n";
import { inr } from "../../shared/utils/format";
import { SCHEMES, INDIAN_STATES, type SchemeId } from "../recommender/schemes";
import { PARTNERS, PARTNER_TYPE_LABEL } from "./partners";
import { nearestPartner, routePartners } from "./geo";
import { MapView, type IMapPoint } from "./MapView";

/** Approximate state/UT centroids — used when geolocation is unavailable. */
const STATE_CENTROID: Record<string, [number, number]> = {
  UP: [26.8467, 80.9462],
  MH: [19.076, 72.8777],
  MP: [23.2599, 77.4126],
  BR: [25.5941, 85.1376],
  KA: [12.9716, 77.5946],
  RJ: [26.9124, 75.7873],
  TN: [13.0827, 80.2707],
  AP: [16.5062, 80.648],
  GJ: [23.2156, 72.6369],
  WB: [22.5726, 88.3639],
  DL: [28.7041, 77.1025],
  KL: [10.5276, 76.2144],
  PB: [30.7333, 76.7794],
  HR: [30.7333, 76.7794],
  AS: [26.1445, 91.7362],
  JH: [23.3441, 85.3096],
  CG: [21.2514, 81.6296],
  OD: [20.2961, 85.8245],
  UK: [30.3165, 78.0322],
  TS: [17.385, 78.4867],
};

export function LocatorPage({
  initialSchemeId,
  initialStateCode,
}: {
  initialSchemeId: SchemeId | null;
  initialStateCode: string;
}) {
  const { t, lang } = useI18n();
  const [stateCode, setStateCode] = useState(initialStateCode || "UP");
  const [schemeId, setSchemeId] = useState<SchemeId>(initialSchemeId ?? "MFS");
  const [center, setCenter] = useState<[number, number]>(STATE_CENTROID[initialStateCode] ?? STATE_CENTROID.UP);
  const [minHealth, setMinHealth] = useState(0);
  const [excludeHighNpa, setExcludeHighNpa] = useState(true);
  const [geoNote, setGeoNote] = useState("");

  function pickState(code: string) {
    setStateCode(code);
    setCenter(STATE_CENTROID[code] ?? STATE_CENTROID.UP);
  }

  function useMyLocation() {
    if (!navigator.geolocation) {
      setGeoNote("Geolocation not available — pick your state instead.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCenter([pos.coords.latitude, pos.coords.longitude]);
        setGeoNote("Using your device location.");
      },
      () => setGeoNote("Location permission denied — pick your state instead."),
      { timeout: 6000 },
    );
  }

  const [lat, lng] = center;

  const results = useMemo(
    () => routePartners(PARTNERS, { lat, lng, schemeId, minHealth, excludeHighNpa }),
    [lat, lng, schemeId, minHealth, excludeHighNpa],
  );
  const naive = useMemo(() => nearestPartner(PARTNERS, lat, lng, schemeId), [lat, lng, schemeId]);

  const points: IMapPoint[] = useMemo(() => {
    const pts: IMapPoint[] = [{ id: "you", lat, lng, kind: "you", title: lang === "hi" ? "आपका स्थान" : "Your location" }];
    if (naive) pts.push({ id: `near-${naive.partner.id}`, lat: naive.partner.lat, lng: naive.partner.lng, kind: "nearest", title: `${t("loc.nearest")}: ${naive.partner.name}` });
    results.slice(0, 8).forEach((r, i) =>
      pts.push({
        id: r.partner.id,
        lat: r.partner.lat,
        lng: r.partner.lng,
        kind: i === 0 ? "recommended" : "partner",
        title: `${r.partner.name} · ${r.partner.fundHealth}/100`,
      }),
    );
    return pts;
  }, [lat, lng, results, naive, lang, t]);

  return (
    <div className="locator">
      <section className="card card--form locator__controls">
        <h2 className="card__title">{t("loc.title")}</h2>
        <p className="card__sub">{t("loc.subtitle")}</p>

        <div className="field-row">
          <label className="field">
            <span className="field__label">{t("loc.state")}</span>
            <select className="input" value={stateCode} onChange={(e) => pickState(e.target.value)}>
              {Object.keys(STATE_CENTROID).map((c) => {
                const s = INDIAN_STATES.find((x) => x.code === c);
                return (
                  <option key={c} value={c}>
                    {s ? (lang === "hi" ? s.nameHi : s.nameEn) : c}
                  </option>
                );
              })}
            </select>
          </label>
          <label className="field">
            <span className="field__label">{t("loc.scheme")}</span>
            <select className="input" value={schemeId} onChange={(e) => setSchemeId(e.target.value as SchemeId)}>
              {SCHEMES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.id} · {lang === "hi" ? s.nameHi : s.nameEn}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="field">
          <span className="field__label">
            {t("loc.minHealth")}: <strong>{minHealth}</strong>
          </span>
          <input
            className="range"
            type="range"
            min={0}
            max={90}
            step={5}
            value={minHealth}
            onChange={(e) => setMinHealth(Number(e.target.value))}
          />
        </label>

        <label className="check">
          <input type="checkbox" checked={excludeHighNpa} onChange={(e) => setExcludeHighNpa(e.target.checked)} />
          <span>{t("loc.excludeHighNpa")}</span>
        </label>

        <div className="form-actions">
          <button type="button" className="btn btn--outline btn--pill" onClick={useMyLocation}>
            📍 {t("loc.useMyLocation")}
          </button>
        </div>
        <p className="field__help">{geoNote || t("loc.selectPoint")}</p>

        {/* before vs after */}
        {naive && results[0] && (
          <div className="versus">
            <h4 className="mini-title">{t("loc.beforeAfter")}</h4>
            <div className="versus__grid">
              <div className="versus__col versus__col--bad">
                <span className="versus__tag">{t("loc.nearest")}</span>
                <strong>{naive.partner.name}</strong>
                <span className="muted">
                  {naive.distanceKm.toFixed(1)} km · {t("loc.health")} {naive.partner.fundHealth}/100 · NPA{" "}
                  {naive.partner.npaBand}
                </span>
              </div>
              <div className="versus__arrow" aria-hidden="true">
                →
              </div>
              <div className="versus__col versus__col--good">
                <span className="versus__tag">{t("loc.recommended")}</span>
                <strong>{results[0].partner.name}</strong>
                <span className="muted">
                  {results[0].distanceKm.toFixed(1)} km · {t("loc.health")} {results[0].partner.fundHealth}/100 · NPA{" "}
                  {results[0].partner.npaBand}
                </span>
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="card locator__map-card">
        <MapView center={center} points={points} onPick={(la, ln) => setCenter([la, ln])} />
        <p className="field__help">{t("loc.mapHint")}</p>
      </section>

      <section className="card locator__results">
        <h3 className="card__title">{t("loc.results")} · {results.length}</h3>
        {results.length === 0 && <p className="callout callout--warn">{t("loc.noResults")}</p>}
        <div className="partner-list">
          {results.slice(0, 12).map((r, i) => (
            <article className="partner" key={r.partner.id}>
              <div className="partner__rank">{i + 1}</div>
              <div className="partner__body">
                <div className="partner__head">
                  <strong>{r.partner.name}</strong>
                  <span className={`pill pill--${r.partner.npaBand === "Low" ? "ok" : r.partner.npaBand === "Medium" ? "mid" : "no"}`}>
                    NPA {r.partner.npaBand}
                  </span>
                </div>
                <div className="partner__meta">
                  {PARTNER_TYPE_LABEL[r.partner.type]} · {r.partner.city}, {r.partner.stateCode} · {t("loc.branches")}{" "}
                  {r.partner.branches}
                </div>
                <div className="partner__scores">
                  <Score label={t("loc.distance")} value={`${r.distanceKm.toFixed(1)} km`} />
                  <Score label={t("loc.routeScore")} value={`${r.routeScore}/100`} good />
                  <Score label={t("loc.health")} value={`${r.partner.fundHealth}/100`} good={r.partner.fundHealth >= 60} />
                  <Score label="Overdue" value={`${r.partner.overduePct}%`} good={r.partner.overduePct < 5} />
                </div>
                <ul className="ticks ticks--compact">
                  {r.reasons.map((reason) => (
                    <li key={reason}>{reason}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
        <p className="muted small">
          {t("loc.health")} / {t("loc.npa")} / overdue values are <strong>illustrative mock data</strong>. Partner names &
          types are real (NSFDC channel-partner lists). Max eligible loan at this scheme:{" "}
          {inr(SCHEMES.find((s) => s.id === schemeId)?.maxLoan ?? 0, { compact: true })}.
        </p>
      </section>
    </div>
  );
}

function Score({ label, value, good }: { label: string; value: string; good?: boolean }) {
  return (
    <div className={`mini-score${good ? " mini-score--good" : ""}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
