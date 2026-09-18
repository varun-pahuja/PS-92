import { GovtCrest } from "./GovtCrest";
import { useI18n, locales } from "../../i18n";

export type TabId = "recommender" | "emi" | "locator" | "track";

const TABS: TabId[] = ["recommender", "emi", "locator", "track"];

export function Header({
  active,
  onNavigate,
}: {
  active: TabId;
  onNavigate: (t: TabId) => void;
}) {
  const { t, lang, setLang } = useI18n();

  return (
    <header className="site-header">
      <div className="topbar">
        <div className="topbar__inner">
          <span className="topbar__badge">🇮🇳 {t("hero.badge")}</span>
          <span className="topbar__helpline">{t("header.helpline")}</span>
        </div>
      </div>

      <div className="shell header-main">
        <div className="brand">
          <GovtCrest size={42} />
          <div>
            <div className="brand__name">{t("brand.name")}</div>
            <div className="brand__tag">{t("brand.tag")}</div>
          </div>
        </div>

        <div className="lang-toggle" role="group" aria-label={t("header.lang")}>
          {locales.map((l) => (
            <button
              key={l.code}
              type="button"
              className={`lang-toggle__btn${lang === l.code ? " is-active" : ""}`}
              aria-pressed={lang === l.code}
              onClick={() => setLang(l.code)}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      <nav className="shell tabs" aria-label="Primary">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            className={`tabs__item${active === tab ? " is-active" : ""}`}
            aria-current={active === tab ? "page" : undefined}
            onClick={() => onNavigate(tab)}
          >
            {t(`nav.${tab}`)}
          </button>
        ))}
      </nav>
    </header>
  );
}
