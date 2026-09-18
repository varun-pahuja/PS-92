import { useState } from "react";
import { Header, type TabId } from "./shared/components/Header";
import { Footer } from "./shared/components/Footer";
import { Disclaimer } from "./shared/components/Disclaimer";
import { RecommenderPage } from "./modules/recommender/RecommenderPage";
import { EmiPage } from "./modules/emi/EmiPage";
import { LocatorPage } from "./modules/locator/LocatorPage";
import { TrackingPage } from "./modules/tracking/TrackingPage";
import { useI18n } from "./i18n";
import type { SchemeId } from "./modules/recommender/schemes";

export default function App() {
  const { t } = useI18n();
  const [tab, setTab] = useState<TabId>("recommender");
  const [emiSeed, setEmiSeed] = useState<{ schemeId: SchemeId | null; principal: number | null }>({
    schemeId: null,
    principal: null,
  });
  const [locSeed, setLocSeed] = useState<{ schemeId: SchemeId | null; stateCode: string }>({
    schemeId: null,
    stateCode: "UP",
  });

  const go = (next: TabId) => {
    setTab(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openEmi = (schemeId: SchemeId, principal: number) => {
    setEmiSeed({ schemeId, principal });
    go("emi");
  };

  const openLocator = (schemeId: SchemeId, stateCode: string) => {
    setLocSeed({ schemeId, stateCode });
    go("locator");
  };

  return (
    <div className="app">
      <Header active={tab} onNavigate={go} />
      <Disclaimer />
      <main className="shell main">
        {tab === "recommender" && (
          <>
            <Hero onStart={() => go("recommender")} />
            <RecommenderPage onGotoEmi={openEmi} onGotoLocator={openLocator} />
          </>
        )}
        {tab === "emi" && <EmiPage initialSchemeId={emiSeed.schemeId} initialPrincipal={emiSeed.principal} />}
        {tab === "locator" && <LocatorPage initialSchemeId={locSeed.schemeId} initialStateCode={locSeed.stateCode} />}
        {tab === "track" && <TrackingPage />}
      </main>
      <Footer />
      <A11yBar />
      <span className="sr-only">{t("brand.tag")}</span>
    </div>
  );
}

function Hero({ onStart }: { onStart: () => void }) {
  const { t } = useI18n();
  return (
    <section className="hero">
      <div className="hero__content">
        <span className="eyebrow">{t("hero.badge")}</span>
        <h1 className="hero__title">{t("hero.title")}</h1>
        <p className="hero__sub">{t("hero.sub")}</p>
        <button type="button" className="btn btn--primary btn--pill hero__cta" onClick={onStart}>
          {t("hero.cta")}
          <span className="btn__icon">→</span>
        </button>
        <ul className="hero__trust">
          <li>✓ {t("hero.trust1")}</li>
          <li>✓ {t("hero.trust2")}</li>
          <li>✓ {t("hero.trust3")}</li>
        </ul>
      </div>
      <div className="hero__art" aria-hidden="true">
        <div className="hero__card">
          <div className="hero__card-row">
            <span>MFS</span>
            <strong>6.5%</strong>
          </div>
          <div className="hero__card-row">
            <span>Term Loan</span>
            <strong>8%</strong>
          </div>
          <div className="hero__card-row">
            <span>Udyam Nidhi</span>
            <strong>13%</strong>
          </div>
          <div className="hero__card-row hero__card-row--muted">
            <span>Partner health</span>
            <strong>82/100</strong>
          </div>
        </div>
      </div>
    </section>
  );
}

/** GIGW-style accessibility controls (text size), as seen on govt sites. */
function A11yBar() {
  const bump = (delta: number) => {
    const el = document.documentElement;
    const current = Number(el.dataset.scale ?? 1);
    const next = Math.max(0.9, Math.min(1.3, +(current + delta).toFixed(2)));
    el.dataset.scale = String(next);
    el.style.fontSize = `${next * 100}%`;
  };
  return (
    <div className="a11y" role="group" aria-label="Accessibility: text size">
      <button type="button" onClick={() => bump(-0.05)} aria-label="Decrease text size">
        A−
      </button>
      <button type="button" onClick={() => bump(0.05)} aria-label="Reset text size" className="a11y__mid">
        A
      </button>
      <button type="button" onClick={() => bump(0.05)} aria-label="Increase text size">
        A+
      </button>
    </div>
  );
}
