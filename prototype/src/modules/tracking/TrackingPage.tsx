import { useState } from "react";
import { useI18n } from "../../i18n";

const DEMO_ID = "NSFDC-2026-004821";

export function TrackingPage() {
  const { t } = useI18n();
  const [appId, setAppId] = useState("");
  const [checked, setChecked] = useState<string | null>(null);

  const valid = checked !== null && checked.trim().toUpperCase() === DEMO_ID;
  const steps = [t("track.step1"), t("track.step2"), t("track.step3"), t("track.step4"), t("track.step5")];
  const currentIndex = 2; // "Sanction by Channel Partner" is in progress

  return (
    <div className="grid-2 grid-2--single">
      <section className="card card--form">
        <h2 className="card__title">{t("track.title")}</h2>
        <p className="card__sub">{t("track.subtitle")}</p>

        <label className="field">
          <span className="field__label">{t("track.appId")}</span>
          <input
            className="input"
            type="text"
            value={appId}
            placeholder="NSFDC-YYYY-XXXXXX"
            onChange={(e) => setAppId(e.target.value)}
          />
        </label>

        <div className="form-actions">
          <button type="button" className="btn btn--primary btn--pill" onClick={() => setChecked(appId)}>
            {t("track.check")}
          </button>
          <button type="button" className="btn btn--ghost" onClick={() => { setAppId(DEMO_ID); setChecked(DEMO_ID); }}>
            {t("track.demo")}
          </button>
        </div>
      </section>

      <section className="card card--result">
        {checked === null && <p className="muted">{t("track.demo")}</p>}
        {checked !== null && !valid && <p className="callout callout--warn">{t("track.notFound")}</p>}

        {valid && (
          <>
            <div className="track-head">
              <div>
                <span className="eyebrow eyebrow--ok">Application ID</span>
                <h3 className="result-scheme">{DEMO_ID}</h3>
                <p className="muted">Sharma Tailoring Unit · Micro Finance Scheme (MFS) · ₹90,000</p>
              </div>
              <span className="pill pill--mid">{t("track.current")}</span>
            </div>

            <ol className="stepper">
              {steps.map((s, i) => {
                const state = i < currentIndex ? "done" : i === currentIndex ? "current" : "pending";
                return (
                  <li key={s} className={`stepper__item stepper__item--${state}`}>
                    <span className="stepper__dot">{state === "done" ? "✓" : i + 1}</span>
                    <div className="stepper__body">
                      <strong>{s}</strong>
                      <span className="muted small">
                        {state === "done" ? t("track.done") : state === "current" ? t("track.current") : t("track.pending")}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ol>

            <p className="muted small">
              Routed to: <strong>UPSCFDC — Lucknow</strong> (fund health 82/100). Live integration will surface the
              actual partner and disbursement ledger from PM-SURAJ / NSFDC.
            </p>
          </>
        )}
      </section>
    </div>
  );
}
