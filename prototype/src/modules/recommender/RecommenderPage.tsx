import { useMemo, useState } from "react";
import { useI18n } from "../../i18n";
import { inr } from "../../shared/utils/format";
import { recommend, type ApplicantType, type IProfile } from "./engine";
import { INDIAN_STATES, SCHEMES_BY_ID, type SchemeId } from "./schemes";

const COST_CHIPS = [80_000, 300_000, 800_000, 2_000_000, 4_000_000];

export function RecommenderPage({
  onGotoEmi,
  onGotoLocator,
}: {
  onGotoEmi: (schemeId: SchemeId, principal: number) => void;
  onGotoLocator: (schemeId: SchemeId, stateCode: string) => void;
}) {
  const { t, lang } = useI18n();
  const [profile, setProfile] = useState<IProfile>({
    isSC: true,
    applicantType: "individual",
    annualFamilyIncome: 240_000,
    purpose: "business",
    activity: "Tailoring unit",
    estimatedCost: 80_000,
    courseRecognised: false,
    stateCode: "UP",
  });
  const [submitted, setSubmitted] = useState(false);

  const set = <K extends keyof IProfile>(key: K, value: IProfile[K]) =>
    setProfile((p) => ({ ...p, [key]: value }));

  const result = useMemo(() => (submitted ? recommend(profile) : null), [submitted, profile]);

  const schemeName = (id: SchemeId) => (lang === "hi" ? SCHEMES_BY_ID[id].nameHi : SCHEMES_BY_ID[id].nameEn);

  return (
    <div className="grid-2">
      {/* ---------------- form ---------------- */}
      <section className="card card--form">
        <h2 className="card__title">{t("form.title")}</h2>
        <p className="card__sub">{t("form.subtitle")}</p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
          }}
        >
          <label className="field">
            <span className="field__label">{t("form.applicantType")}</span>
            <select
              className="input"
              value={profile.applicantType}
              onChange={(e) => set("applicantType", e.target.value as ApplicantType)}
            >
              <option value="individual">{t("form.applicant.individual")}</option>
              <option value="partnership">{t("form.applicant.partnership")}</option>
              <option value="cooperative">{t("form.applicant.cooperative")}</option>
            </select>
          </label>

          <label className="check">
            <input type="checkbox" checked={profile.isSC} onChange={(e) => set("isSC", e.target.checked)} />
            <span>{t("form.isSC")}</span>
          </label>

          <label className="field">
            <span className="field__label">{t("form.income")}</span>
            <input
              className="input"
              type="number"
              min={0}
              step={10000}
              value={profile.annualFamilyIncome}
              onChange={(e) => set("annualFamilyIncome", Number(e.target.value))}
            />
            <span className="field__help">{t("form.incomeHelp")}</span>
          </label>

          <fieldset className="field">
            <legend className="field__label">{t("form.purpose")}</legend>
            <div className="segmented">
              {(["business", "education"] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  className={`segmented__btn${profile.purpose === p ? " is-active" : ""}`}
                  onClick={() => set("purpose", p)}
                >
                  {t(`form.purpose.${p}`)}
                </button>
              ))}
            </div>
          </fieldset>

          <label className="field">
            <span className="field__label">{t("form.activity")}</span>
            <input
              className="input"
              type="text"
              value={profile.activity}
              placeholder={t(`form.activityHelp.${profile.purpose}`)}
              onChange={(e) => set("activity", e.target.value)}
            />
          </label>

          <label className="field">
            <span className="field__label">{t("form.cost")}</span>
            <input
              className="input"
              type="number"
              min={0}
              step={10000}
              value={profile.estimatedCost}
              onChange={(e) => set("estimatedCost", Number(e.target.value))}
            />
            <span className="chips">
              {COST_CHIPS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`chip${profile.estimatedCost === c ? " is-active" : ""}`}
                  onClick={() => set("estimatedCost", c)}
                >
                  {inr(c, { compact: true })}
                </button>
              ))}
            </span>
          </label>

          {profile.purpose === "education" && (
            <label className="check">
              <input
                type="checkbox"
                checked={profile.courseRecognised ?? false}
                onChange={(e) => set("courseRecognised", e.target.checked)}
              />
              <span>{t("form.courseRecognised")}</span>
            </label>
          )}

          <label className="field">
            <span className="field__label">{t("form.state")}</span>
            <select className="input" value={profile.stateCode} onChange={(e) => set("stateCode", e.target.value)}>
              {INDIAN_STATES.map((s) => (
                <option key={s.code} value={s.code}>
                  {lang === "hi" ? s.nameHi : s.nameEn}
                </option>
              ))}
            </select>
          </label>

          <div className="form-actions">
            <button type="submit" className="btn btn--primary btn--pill">
              {t("form.check")}
              <span className="btn__icon">→</span>
            </button>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => {
                setSubmitted(false);
                setProfile((p) => ({ ...p }));
              }}
            >
              {t("form.reset")}
            </button>
          </div>
        </form>
      </section>

      {/* ---------------- result ---------------- */}
      <section className="card card--result" aria-live="polite">
        {!result && <EmptyState title={t("result.title")} hint={t("hero.sub")} />}

        {result && result.globalBlockers.length > 0 && (
          <div className="callout callout--warn">
            <h3>{t("result.noMatch")}</h3>
            <ul className="ticks">
              {result.globalBlockers.map((b, i) => (
                <li key={`${b.key}-${i}`}>{t(b.key, b.params)}</li>
              ))}
            </ul>
            <p className="muted">{t("result.noMatchHelp")}</p>
          </div>
        )}

        {result && result.globalBlockers.length === 0 && result.primary && (
          <>
            <div className="result-head">
              <div>
                <span className="eyebrow eyebrow--ok">{t("result.primary")}</span>
                <h2 className="result-scheme">{schemeName(result.primary.scheme.id)}</h2>
                <p className="muted">{lang === "hi" ? result.primary.scheme.descriptionHi : result.primary.scheme.descriptionEn}</p>
              </div>
              <FitDial score={result.primary.fitScore} label={t("result.fit")} />
            </div>

            <div className="stat-row">
              <Stat label={t("result.rate")} value={`${result.primary.scheme.beneficiaryRate}% p.a.`} />
              <Stat label={t("result.loan")} value={inr(result.primary.loanAmount)} />
              <Stat label={t("result.own")} value={inr(result.primary.ownContribution)} />
              <Stat label={t("result.moratorium")} value={`${result.primary.scheme.moratoriumMonths} ${t("result.months")}`} />
            </div>

            <div className="mini-grid">
              <div>
                <h4 className="mini-title">{t("result.why")}</h4>
                <ul className="ticks ticks--why">
                  {result.primary.reasons.map((r, i) => (
                    <li key={`${r.key}-${i}`}>{t(r.key, r.params)}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="mini-title">{t("result.scoreBreakdown")}</h4>
                <div className="bars">
                  {result.scoreBreakdown.map((b) => (
                    <div className="bar" key={b.labelKey}>
                      <div className="bar__top">
                        <span>{t(b.labelKey)}</span>
                        <span className="bar__meta">
                          {Math.round(b.value * 100)}% · {t("result.weight")} {Math.round(b.weight * 100)}%
                        </span>
                      </div>
                      <div className="bar__track">
                        <div className="bar__fill" style={{ width: `${b.value * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn--primary btn--pill"
                onClick={() => onGotoEmi(result.primary!.scheme.id, result.primary!.loanAmount)}
              >
                {t("result.viewEmi")}
                <span className="btn__icon">→</span>
              </button>
              <button
                type="button"
                className="btn btn--outline btn--pill"
                onClick={() => onGotoLocator(result.primary!.scheme.id, profile.stateCode ?? "UP")}
              >
                {t("result.findPartner")}
              </button>
            </div>

            <h4 className="mini-title mini-title--spaced">{t("result.alternatives")}</h4>
            <div className="alt-list">
              {result.recommendations
                .filter((r) => !result.primary || r.scheme.id !== result.primary.scheme.id)
                .map((r) => (
                  <div className="alt" key={r.scheme.id}>
                    <div className="alt__head">
                      <span className="alt__name">{schemeName(r.scheme.id)}</span>
                      <span className={`pill ${r.eligible ? "pill--ok" : "pill--no"}`}>
                        {r.eligible ? `${r.fitScore} · ${t("result.eligible")}` : t("result.ineligible")}
                      </span>
                    </div>
                      {!r.eligible && r.blockers.length > 0 && (
                        <ul className="ticks ticks--block">
                          {r.blockers.map((b, i) => (
                            <li key={`${b.key}-${i}`}>{t(b.key, b.params)}</li>
                          ))}
                        </ul>
                      )}
                    {r.eligible && (
                      <p className="alt__meta">
                        {r.scheme.beneficiaryRate}% p.a. · {inr(r.loanAmount)} · {r.scheme.moratoriumMonths}{" "}
                        {t("result.months")}
                      </p>
                    )}
                  </div>
                ))}
            </div>
          </>
        )}

        {result && result.globalBlockers.length === 0 && !result.primary && (
          <div className="callout callout--warn">
            <h3>{t("result.noMatch")}</h3>
            <p className="muted">{t("result.noMatchHelp")}</p>
            <ul className="ticks">
              {result.recommendations
                .flatMap((r) => r.blockers)
                .slice(0, 4)
                .map((b, i) => (
                  <li key={`${b.key}-${i}`}>{t(b.key, b.params)}</li>
                ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}

function FitDial({ score, label }: { score: number; label: string }) {
  const r = 34;
  const c = 2 * Math.PI * r;
  const dash = (score / 100) * c;
  return (
    <div className="dial" role="img" aria-label={`${label}: ${score} out of 100`}>
      <svg viewBox="0 0 84 84" width="96" height="96">
        <circle cx="42" cy="42" r={r} fill="none" stroke="var(--line)" strokeWidth="8" />
        <circle
          cx="42"
          cy="42"
          r={r}
          fill="none"
          stroke="var(--saffron)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c - dash}`}
          transform="rotate(-90 42 42)"
        />
      </svg>
      <div className="dial__label">
        <strong>{score}</strong>
        <span>{label}</span>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="stat">
      <span className="stat__label">{label}</span>
      <span className="stat__value">{value}</span>
    </div>
  );
}

function EmptyState({ title, hint }: { title: string; hint: string }) {
  const { t } = useI18n();
  return (
    <div className="empty">
      <div className="empty__mark" aria-hidden="true">
        ⇄
      </div>
      <h3>{title}</h3>
      <p>{hint}</p>
      <p className="muted small">{t("result.tip")}</p>
    </div>
  );
}


