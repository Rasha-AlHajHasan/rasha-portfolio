// src/pages/Experience.jsx

import React, { useEffect, useState } from "react";

import { getExperience } from "../data/content";
import { useI18n } from "../i18n/context";
import { EmptyState, LoadingBlock, Localized, PageHeader, Reveal, Tag } from "../components/ui";
import { toList } from "../components/utils";

function ExperienceItem({ item }) {
  const { t, lang, pick } = useI18n();
  const bullets = pick(item, "bullets");
  const tech = toList(item.tech);

  return (
    <Reveal as="li" className="grid gap-3 border-b border-line py-7 md:grid-cols-12 md:gap-8 md:py-9">
      {/* Period + company: the reference's narrow left column */}
      <div className="flex items-start gap-3 md:col-span-3 md:flex-col md:gap-1.5">
        <span aria-hidden className="mt-2 h-2 w-2 shrink-0 rounded-full border border-wine md:hidden" />
        <div>
          <Localized item={item} field="period" as="p" className="label text-wine-text" />
          {item.company && <Localized item={item} field="company" as="p" className="mt-1 text-sm text-ink-soft" />}
        </div>
      </div>

      <div className="min-w-0 md:col-span-9">
        <Localized item={item} field="title" as="h2" className="text-heading font-normal text-ink" />

        {bullets.value?.length > 0 && (
          <ul
            className="mt-4 grid gap-2"
            lang={bullets.lang !== lang ? bullets.lang : undefined}
            dir={bullets.lang !== lang ? "auto" : undefined}
          >
            {bullets.value.map((bullet, idx) => (
              <li key={idx} className="flex gap-3 text-[15px] leading-relaxed text-ink-soft">
                <span aria-hidden className="mt-[0.7em] h-px w-3 shrink-0 bg-wine" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        )}

        {tech.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-1.5" aria-label={t("experience.technologies")}>
            {tech.map((name) => (
              <li key={name}>
                <Tag>{name}</Tag>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Reveal>
  );
}

export default function Experience() {
  const { t } = useI18n();
  const [experience, setExperience] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getExperience()
      .then((data) => setExperience(data || []))
      .catch((error) => console.error("Error loading experience:", error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="grid gap-4">
      <PageHeader
        label={t("experience.label")}
        title={t("experience.title")}
        script={t("experience.script")}
        intro={t("experience.intro")}
      />

      {loading ? (
        <LoadingBlock label={t("experience.loading")} rows={4} />
      ) : experience.length === 0 ? (
        <EmptyState title={t("experience.emptyTitle")} className="mt-6">
          {t("experience.emptyText")}
        </EmptyState>
      ) : (
        <ol>
          {experience.map((item) => (
            <ExperienceItem key={item.id} item={item} />
          ))}
        </ol>
      )}
    </div>
  );
}
