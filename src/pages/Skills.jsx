// src/pages/Skills.jsx
// Skills tab, grouped by area (see getSkillGroups in src/data/content.js).
import React, { useEffect, useState } from "react";

import { getSkillGroups } from "../data/content";
import { t } from "../content/text";
import { EmptyState, LoadingBlock, SheetText, PageHeader, Reveal } from "../components/ui";

export default function Skills() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSkillGroups()
      .then((data) => setGroups(data || []))
      .catch((error) => console.error("Skills fetch failed:", error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="grid gap-4">
      <PageHeader label={t("skills.label")} title={t("skills.title")} script={t("skills.script")} intro={t("skills.intro")} />

      {loading ? (
        <LoadingBlock label={t("skills.loading")} rows={4} />
      ) : groups.length === 0 ? (
        <EmptyState title={t("skills.emptyTitle")} className="mt-6">
          {t("skills.emptyText")}
        </EmptyState>
      ) : (
        <div>
          {groups.map((group, i) => (
            <Reveal
              key={group.key}
              as="section"
              aria-labelledby={`skills-${i}`}
              className="grid gap-4 py-7 md:grid-cols-12 md:gap-8"
            >
              <div className="flex items-baseline gap-3 md:col-span-4">
                <span aria-hidden className="text-xs tabular-nums text-wine-text">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 id={`skills-${i}`} className="text-base font-medium text-ink">
                  {group.label ? <SheetText item={group} field="label" /> : t(`skills.groups.${group.key}`)}
                </h2>
              </div>

              <ul className="flex flex-wrap gap-2 md:col-span-8">
                {group.skills.map((skill) => (
                  <li key={skill.id} className="rounded-full border border-line px-3 py-1 text-sm text-ink">
                    <SheetText item={skill} field="name" />
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
