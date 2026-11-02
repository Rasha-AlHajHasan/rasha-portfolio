// src/pages/NotFound.jsx
import React from "react";
import { ArrowLeft } from "lucide-react";

import { useI18n } from "../i18n/context";
import { ButtonLink, Label } from "../components/ui";
import { cx, FLIP_RTL } from "../components/utils";

const BackArrow = (props) => <ArrowLeft {...props} className={cx(props.className, FLIP_RTL)} />;

export default function NotFound() {
  const { t } = useI18n();

  return (
    <section className="grid min-h-[50vh] place-items-center text-center">
      <div className="grid justify-items-center">
        <Label>{t("notFound.label")}</Label>
        <h1 className="mt-5 text-title font-light text-ink">{t("notFound.title")}</h1>
        <p className="mx-auto mt-4 max-w-md text-ink-soft">{t("notFound.text")}</p>
        <ButtonLink to="/" icon={BackArrow} className="mt-7">
          {t("notFound.home")}
        </ButtonLink>
      </div>
    </section>
  );
}
