import { useEffect, useMemo, useState } from "react";
import { useI18n } from "../../i18n";
import { inr } from "../../shared/utils/format";
import { AmortChart } from "./AmortChart";
import { computeEmi, type MoratoriumMode } from "./emi";
import { SCHEMES, SCHEMES_BY_ID, type SchemeId } from "../recommender/schemes";

export function EmiPage({
  initialSchemeId,
  initialPrincipal,
}: {
  initialSchemeId: SchemeId | null;
  initialPrincipal: number | null;
}) {
  const { t, lang } = useI18n();
  const [schemeId, setSchemeId] = useState<SchemeId>(initialSchemeId ?? "TERM");
  const [principal, setPrincipal] = useState<number>(initialPrincipal ?? 300_000);
  const [rate, setRate] = useState<number>(SCHEMES_BY_ID[initialSchemeId ?? "TERM"].beneficiaryRate);
  const [tenure, setTenure] = useState<number>(SCHEMES_BY_ID[initialSchemeId ?? "TERM"].maxTenureMonths);
  const [moratorium, setMoratorium] = useState<number>(SCHEMES_BY_ID[initialSchemeId ?? "TERM"].moratoriumMonths);
  const [mode, setMode] = useState<MoratoriumMode>("interest-only");

  // Keep the inputs in sync when the user arrives from the recommender.
  useEffect(() => {
    if (initialSchemeId) {
      applyScheme(initialSchemeId);
      if (initialPrincipal) setPrincipal(initialPrincipal);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialSchemeId, initialPrincipal]);

  function applyScheme(id: SchemeId) {
    const s = SCHEMES_BY_ID[id];
    setSchemeId(id);
    setRate(s.beneficiaryRate);
    setTenure(s.maxTenureMonths);
    setMoratorium(s.moratoriumMonths);
    setPrincipal((p) => Math.min(p, s.maxLoan));
  }

  const result = useMemo(
    () =>
      computeEmi({
        principal,
        annualRatePct: rate,
        tenureMonths: tenure,
        moratoriumMonths: moratorium,
        mode,
      }),
    [principal, rate, tenure, moratorium, mode],
  );

  const scheme = SCHEMES_BY_ID[schemeId];

  return (
    <div className="grid-2">
      <section className="card card--form">
        <h2 className="card__title">{t("emi.title")}</h2>
        <p className="card__sub">{t("emi.subtitle")}</p>

        <label className="field">
          <span className="field__label">{t("emi.scheme")}</span>
          <select className="input" value={schemeId} onChange={(e) => applyScheme(e.target.value as SchemeId)}>
            {SCHEMES.map((s) => (
              <option key={s.id} value={s.id}>
                {lang === "hi" ? s.nameHi : s.nameEn} · {s.beneficiaryRate}%
              </option>
            ))}
          </select>
        </label>
        <p className="field__help">{lang === "hi" ? scheme.moratoriumNoteHi : scheme.moratoriumNoteEn}</p>

        <label className="field">
          <span className="field__label">{t("emi.principal")}</span>
          <input
            className="input"
            type="number"
            min={0}
            step={10000}
            max={scheme.maxLoan}
            value={principal}
            onChange={(e) => setPrincipal(Number(e.target.value))}
          />
          <input
            className="range"
            type="range"
            min={10_000}
            max={Math.max(10_000, scheme.maxLoan)}
            step={10_000}
            value={Math.min(principal, scheme.maxLoan)}
            onChange={(e) => setPrincipal(Number(e.target.value))}
            aria-label={t("emi.principal")}
          />
        </label>

        <div className="field-row">
          <label className="field">
            <span className="field__label">{t("emi.rate")}</span>
            <input
              className="input"
              type="number"
              min={6.5}
              max={15}
              step={0.5}
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
            />
          </label>
          <label className="field">
            <span className="field__label">{t("emi.tenure")}</span>
            <input
              className="input"
              type="number"
              min={0}
              max={240}
              step={6}
              value={tenure}
              onChange={(e) => setTenure(Number(e.target.value))}
            />
          </label>
          <label className="field">
            <span className="field__label">{t("emi.moratorium")}</span>
            <input
              className="input"
              type="number"
              min={0}
              max={60}
              step={1}
              value={moratorium}
              onChange={(e) => setMoratorium(Number(e.target.value))}
            />
          </label>
        </div>

        <fieldset className="field">
          <legend className="field__label">{t("emi.mode")}</legend>
          <div className="segmented">
            {(["interest-only", "deferred"] as const).map((m) => (
              <button
                key={m}
                type="button"
                className={`segmented__btn${mode === m ? " is-active" : ""}`}
                onClick={() => setMode(m)}
              >
                {t(`emi.mode.${m === "interest-only" ? "interestOnly" : "deferred"}`)}
              </button>
            ))}
          </div>
        </fieldset>
      </section>

      <section className="card card--result">
        <div className="stat-row stat-row--hero">
          <div className="hero-stat">
            <span className="stat__label">{t("emi.emiLabel")}</span>
            <span className="hero-stat__value">{inr(result.emi)}</span>
          </div>
        </div>

        <div className="stat-row">
          <Stat label={t("emi.moratoriumPayment")} value={mode === "interest-only" ? inr(result.moratoriumPayment) : "₹0"} />
          <Stat label={t("emi.totalInterest")} value={inr(result.totalInterest)} />
          <Stat label={t("emi.totalPayable")} value={inr(result.totalPayable)} />
          <Stat
            label={t("emi.effectivePrincipal")}
            value={mode === "deferred" ? inr(result.effectivePrincipal) : inr(principal)}
          />
        </div>

        <h4 className="mini-title">{t("emi.chart")}</h4>
        <AmortChart
          yearly={result.yearly}
          principalLabel={t("emi.principalPaid")}
          interestLabel={t("emi.interestPaid")}
        />

        <h4 className="mini-title mini-title--spaced">{t("emi.schedule")}</h4>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>{t("emi.year")}</th>
                <th>{t("emi.principalPaid")}</th>
                <th>{t("emi.interestPaid")}</th>
                <th>{t("emi.totalPaid")}</th>
                <th>{t("emi.closing")}</th>
              </tr>
            </thead>
            <tbody>
              {result.yearly.map((y) => (
                <tr key={y.year}>
                  <td>Y{y.year}</td>
                  <td>{inr(y.principalPaid)}</td>
                  <td>{inr(y.interestPaid)}</td>
                  <td>{inr(y.totalPaid)}</td>
                  <td>{inr(y.closingBalance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
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
