import { useI18n } from "../../i18n";

export function Disclaimer() {
  const { t } = useI18n();
  return (
    <div className="disclaimer" role="note">
      <span className="disclaimer__dot" aria-hidden="true" />
      <span>{t("disclaimer.short")}</span>
    </div>
  );
}
