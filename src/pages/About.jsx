// src/pages/About.jsx
import React, { useEffect, useState } from "react";

import { getAbout, getBackground, getProfile } from "../data/content";
import { t } from "../content/text";
import { ButtonLink, EmptyState, LoadingBlock, SheetText, PageHeader, Reveal, SectionRule } from "../components/ui";

function settled(result, label) {
  if (result.status === "fulfilled") return result.value;
  console.error(`${label} fetch failed:`, result.reason);
  return null;
}

export default function About() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchAbout() {
      const [about, profile, background] = await Promise.allSettled([getAbout(), getProfile(), getBackground()]);
      setData({
        about: settled(about, "About"),
        profile: settled(profile, "Profile"),
        background: settled(background, "Background") || [],
      });
    }

    fetchAbout();
  }, []);

  const header = <PageHeader label={t("about.label")} title={t("about.title")} script={t("about.script")} />;

  if (!data) {
    return (
      <div className="grid gap-8">
        {header}
        <LoadingBlock label={t("about.loading")} rows={4} />
      </div>
    );
  }

  const { about, profile, background } = data;
  const highlights = about?.highlights || [];
  const focus = about?.focus || [];
  const paragraphs = (profile?.bio || "").split(/\n+/).filter(Boolean);

  if (!profile && !about) {
    return (
      <div className="grid gap-8">
        {header}
        <EmptyState title={t("about.emptyTitle")}>{t("about.emptyText")}</EmptyState>
      </div>
    );
  }

  return (
    <div className="grid gap-14 md:gap-16">
      {header}

      {/* Introduction + at a glance */}
      <section aria-labelledby="about-intro" className="grid gap-8 md:grid-cols-12 md:gap-10">
        <div className="min-w-0 md:col-span-7">
          <h2 id="about-intro" className="sr-only">
            {t("about.intro")}
          </h2>
          {about?.headline && (
            <SheetText item={about} field="headline" as="p" className="mb-5 text-heading font-light text-ink" />
          )}
          {!about?.headline && profile?.tagline && (
            <SheetText item={profile} field="tagline" as="p" className="mb-5 text-heading font-light text-ink" />
          )}
          <div className="grid gap-4 border-s border-wine ps-5">
            {paragraphs.map((p, i) => (
              <p key={i} className="text-lead text-ink-soft">
                {p}
              </p>
            ))}
          </div>
        </div>

        {highlights.length > 0 && (
          <aside aria-labelledby="about-glance" className="md:col-span-5">
            <p id="about-glance" className="label">
              {t("about.glance")}
            </p>
            <dl className="mt-3 border-t border-line">
              {highlights.map((h) => (
                <div key={h.id} className="flex items-baseline justify-between gap-6 border-b border-line py-3">
                  <dt className="text-sm text-ink-faint">
                    <SheetText item={h} field="title" />
                  </dt>
                  <dd className="text-end text-sm font-medium text-ink">
                    <SheetText item={h} field="text" />
                  </dd>
                </div>
              ))}
            </dl>
          </aside>
        )}
      </section>

      {/* Areas of expertise */}
      {focus.length > 0 && (
        <Reveal as="section" aria-labelledby="about-expertise" className="grid gap-6">
          <SectionRule index="01" id="about-expertise" title={t("about.expertise")} />
          <ol className="grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-3">
            {focus.map((area, i) => (
              <li key={area.id} className="grid content-start gap-2 bg-canvas p-5">
                <span aria-hidden className="text-xs tabular-nums text-wine-text">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <SheetText item={area} field="title" as="h3" className="text-base font-medium text-ink" />
                <SheetText item={area} field="text" as="p" className="text-sm leading-relaxed text-ink-faint" />
              </li>
            ))}
          </ol>
        </Reveal>
      )}

      {/* Education & background */}
      {background.length > 0 && (
        <Reveal as="section" aria-labelledby="about-background" className="grid gap-6">
          <SectionRule index={focus.length > 0 ? "02" : "01"} id="about-background" title={t("about.background")} />
          <ol>
            {background.map((entry) => (
              <li key={entry.id} className="grid gap-1 border-b border-line py-4 first:pt-0 md:grid-cols-12 md:gap-8">
                <SheetText item={entry} field="period" as="p" className="label pt-1 md:col-span-3" />
                <div className="min-w-0 md:col-span-9">
                  <p className="text-ink">
                    <SheetText item={entry} field="name" className="font-medium" />
                    {entry.role && (
                      <>
                        <span className="mx-2 text-ink-faint">·</span>
                        <SheetText item={entry} field="role" className="text-ink-soft" />
                      </>
                    )}
                  </p>
                  <SheetText item={entry} field="notes" as="p" className="mt-1 text-sm text-ink-faint" />
                </div>
              </li>
            ))}
          </ol>
        </Reveal>
      )}

      {/* Continue */}
      <nav aria-label={t("about.next")} className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-line pt-6">
        <span className="label">{t("about.next")}</span>
        <ButtonLink to="/skills" variant="text">
          {t("about.toSkills")}
        </ButtonLink>
        <ButtonLink to="/experience" variant="text">
          {t("about.toExperience")}
        </ButtonLink>
      </nav>
    </div>
  );
}
