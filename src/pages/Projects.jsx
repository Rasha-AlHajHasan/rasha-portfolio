// src/pages/Projects.jsx

import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { getProjects } from "../data/content";
import { useI18n } from "../i18n/context";
import { EmptyState, LoadingBlock, PageHeader } from "../components/ui";
import { cx, EASE, toList } from "../components/utils";
import ProjectCard from "../components/ProjectCard";

const ALL = "__all__";

function FilterBar({ options, active, onChange }) {
  const { t } = useI18n();

  return (
    <div role="group" aria-label={t("projects.filter")} className="flex flex-wrap gap-2">
      {options.map((option) => {
        const selected = option === active;

        return (
          <button
            key={option}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(option)}
            dir={option === ALL ? undefined : "ltr"}
            className={cx(
              "min-h-9 rounded-full border px-3.5 text-xs font-medium transition-colors duration-300",
              selected
                ? "border-ink bg-ink text-canvas"
                : "border-line text-ink-soft hover:border-wine hover:text-ink"
            )}
          >
            {option === ALL ? t("projects.all") : option}
          </button>
        );
      })}
    </div>
  );
}

export default function Projects() {
  const { t } = useI18n();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [filter, setFilter] = useState(ALL);

  useEffect(() => {
    getProjects()
      .then((data) => setProjects(data || []))
      .catch((error) => {
        console.error("Projects fetch failed:", error);
        setFailed(true);
      })
      .finally(() => setLoading(false));
  }, []);

  const technologies = useMemo(() => {
    const counts = new Map();
    projects.forEach((p) => toList(p.stack).forEach((tech) => counts.set(tech, (counts.get(tech) || 0) + 1)));
    // Most-used technologies first; keep the bar short
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([tech]) => tech);
  }, [projects]);

  const visible = filter === ALL ? projects : projects.filter((p) => toList(p.stack).includes(filter));

  // The first featured project (in display order) leads; the rest keep their order
  const lead = visible.find((p) => p.featured);
  const rest = visible.filter((p) => p !== lead);

  const count = projects.length === 1 ? t("projects.countOne") : t("projects.count", { n: projects.length });

  return (
    <div className="grid gap-8 md:gap-10">
      <PageHeader
        label={projects.length ? `${t("projects.label")} · ${count}` : t("projects.label")}
        title={t("projects.title")}
        script={t("projects.script")}
        intro={t("projects.intro")}
      />

      {loading ? (
        <LoadingBlock label={t("projects.loading")} />
      ) : failed ? (
        <EmptyState title={t("projects.errorTitle")}>{t("projects.errorText")}</EmptyState>
      ) : projects.length === 0 ? (
        <EmptyState title={t("projects.emptyTitle")}>{t("projects.emptyText")}</EmptyState>
      ) : (
        <>
          {technologies.length > 1 && <FilterBar options={[ALL, ...technologies]} active={filter} onChange={setFilter} />}

          <AnimatePresence mode="wait">
            <motion.div
              key={filter}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="grid gap-5"
            >
              {visible.length === 0 && <EmptyState title={t("projects.noMatch")} />}

              {lead && <ProjectCard project={lead} variant="feature" />}

              {rest.length > 0 && (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
