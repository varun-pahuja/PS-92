import { useI18n } from "../../i18n";

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="site-footer">
      <div className="shell site-footer__inner">
        <div>
          <strong>{t("brand.name")}</strong>
          <p>{t("footer.owned")}</p>
        </div>
        <div className="site-footer__links">
          <span>{t("footer.helpline")}</span>
          <a href="https://pmsuraj.dosje.gov.in/" target="_blank" rel="noreferrer">
            {t("footer.portal")} ↗
          </a>
        </div>
      </div>
    </footer>
  );
}
