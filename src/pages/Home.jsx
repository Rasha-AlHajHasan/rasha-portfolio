// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Mail } from "lucide-react";

import {
  getAbout,
  getContacts,
  getExperience,
  getProfile,
  getProjects,
  getSkillGroups,
  getStats,
} from "../data/content";
import { t } from "../content/text";
import ContactDetails from "../components/ContactDetails";
import DeviceShowcase from "../components/DeviceShowcase";
import ProjectCard from "../components/ProjectCard";
import { ButtonLink, LoadingBlock, SheetText, Reveal, SectionRule } from "../components/ui";
import { EASE } from "../components/utils";

const SELECTED_PROJECTS = 3;
const SUMMARY_ROWS = 3;

// Settled promise -> value, or `fallback` (and a console note) when it failed
function settled(result, fallback, label) {
  if (result.status === "fulfilled") return result.value ?? fallback;
  console.error(`${label} fetch failed:`, result.reason);
  return fallback;
}

function Hero({ profile }) {
  // Negative bottom margin: the hero sits closer to the Introduction than sections do to each other
  return (
    <section className="-mb-6 grid items-center gap-8 md:-mb-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-14">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="min-w-0"
      >
        <h1 className="text-hero font-light text-ink">{t("meta.site")}</h1>
        <p aria-hidden className="script mt-1 text-[clamp(1.9rem,1.5rem+1.6vw,2.75rem)] text-ink-soft">
          {t("home.script")}
        </p>

        {profile?.tagline ? (
          <SheetText item={profile} field="tagline" as="p" className="mt-5 max-w-md text-lead text-ink-soft" />
        ) : (
          <p className="mt-5 max-w-md text-lead text-ink-soft">{t("home.introFallback")}</p>
        )}

        <div className="mt-7 flex flex-wrap gap-3">
          <ButtonLink to="/projects">{t("home.ctaProjects")}</ButtonLink>
          <ButtonLink to="/contact" variant="outline" icon={null}>
            {t("home.ctaContact")}
          </ButtonLink>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
        className="min-w-0"
      >
        <DeviceShowcase />
      </motion.div>
    </section>
  );
}

function Stats({ stats }) {
  return (
    <section aria-label={t("home.stats")}>
      <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.id} className="flex flex-col-reverse gap-1 bg-canvas p-4 sm:p-5">
            <dt className="label">
              <SheetText item={stat} field="title" />
            </dt>
            <dd className="text-2xl font-light text-ink">{stat.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function Section({ index, id, title, action, children }) {
  return (
    <Reveal as="section" aria-labelledby={id} className="grid gap-6">
      <SectionRule index={index} id={id} title={title} action={action} />
      {children}
    </Reveal>
  );
}

function ContactInfo({ contacts }) {
  const email = contacts.find((c) => c.type === "email");
  const linkedin = contacts.find((c) => c.type === "linkedin");

  return (
    <div className="grid gap-8 md:grid-cols-12 md:gap-10">
      <div className="md:col-span-5">
        <p className="max-w-md text-lead text-ink-soft">{t("home.contact.text")}</p>

        <div className="mt-6 flex flex-wrap gap-3">
          {email ? (
            <ButtonLink href={email.href} icon={Mail}>
              {t("home.contact.email")}
            </ButtonLink>
          ) : (
            <ButtonLink to="/contact">{t("home.contact.cta")}</ButtonLink>
          )}
          {linkedin && (
            <ButtonLink href={linkedin.href} variant="outline" icon={ArrowUpRight}>
              {t("home.contact.linkedin")}
            </ButtonLink>
          )}
        </div>
      </div>

      <ContactDetails contacts={contacts} className="min-w-0 md:col-span-7" />
    </div>
  );
}

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function loadHomeData() {
      const [profile, about, projects, experience, skillGroups, contacts, stats] = await Promise.allSettled([
        getProfile(),
        getAbout(),
        getProjects(),
        getExperience(),
        getSkillGroups(),
        getContacts(),
        getStats(),
      ]);

      setData({
        profile: settled(profile, null, "Profile"),
        about: settled(about, null, "About"),
        projects: settled(projects, [], "Projects"),
        experience: settled(experience, [], "Experience"),
        skillGroups: settled(skillGroups, [], "Skills"),
        contacts: settled(contacts, [], "Contacts"),
        stats: settled(stats, [], "Stats"),
      });
    }

    loadHomeData();
  }, []);

  if (!data) {
    return <LoadingBlock rows={4} />;
  }

  const { profile, about, projects, experience, skillGroups, contacts, stats } = data;
  const focus = about?.focus || [];
  const selected = [...projects.filter((p) => p.featured), ...projects.filter((p) => !p.featured)].slice(
    0,
    SELECTED_PROJECTS
  );
  const hasBio = Boolean(profile?.bio);

  // Section numbers follow whichever sections are shown
  const sections = [
    (hasBio || focus.length > 0) && "about",
    selected.length > 0 && "projects",
    "experience",
    skillGroups.length > 0 && "skills",
    "contact",
  ].filter(Boolean);
  const number = (id) => String(sections.indexOf(id) + 1).padStart(2, "0");

  const more = (to, key) => (
    <ButtonLink to={to} variant="text" className="shrink-0 text-xs">
      {t(key)}
    </ButtonLink>
  );

  return (
    <div className="grid gap-16 md:gap-20">
      <Hero profile={profile} />

      {stats.length > 0 && <Stats stats={stats} />}

      {sections.includes("about") && (
        <Section index={number("about")} id="home-about" title={t("home.sections.about")} action={more("/about", "home.about.more")}>
          <div className="grid gap-8 md:grid-cols-12 md:gap-10">
            {hasBio && (
              <SheetText
                item={profile}
                field="bio"
                as="p"
                className="whitespace-pre-line text-lead text-ink-soft md:col-span-7"
              />
            )}
            {focus.length > 0 && (
              <dl className="grid content-start md:col-span-5">
                {focus.map((area) => (
                  <div key={area.id} className="grid gap-1 border-t border-line py-3 first:border-t-0 first:pt-0">
                    <dt className="text-sm font-medium text-ink">
                      <SheetText item={area} field="title" />
                    </dt>
                    <dd className="text-sm text-ink-faint">
                      <SheetText item={area} field="text" />
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </Section>
      )}

      {sections.includes("projects") && (
        <Section
          index={number("projects")}
          id="home-projects"
          title={t("home.sections.projects")}
          action={more("/projects", "home.projects.all")}
        >
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {selected.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </Section>
      )}

      <Section
        index={number("experience")}
        id="home-experience"
        title={t("home.sections.experience")}
        action={more("/experience", "home.experience.more")}
      >
        {experience.length > 0 ? (
          <ol className="grid">
            {experience.slice(0, SUMMARY_ROWS).map((item) => (
              <li
                key={item.id}
                className="grid gap-1 border-t border-line py-4 first:border-t-0 first:pt-0 sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-6"
              >
                <SheetText item={item} field="period" as="p" className="label pt-1" />
                {/* col-start-2: stays in the title column when the period is blank */}
                <p className="min-w-0 text-ink sm:col-start-2">
                  <SheetText item={item} field="title" className="font-medium" />
                  {item.company && (
                    <>
                      <span className="mx-2 text-ink-faint">·</span>
                      <SheetText item={item} field="company" className="text-ink-soft" />
                    </>
                  )}
                </p>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-sm text-ink-faint">{t("home.experience.empty")}</p>
        )}
      </Section>

      {sections.includes("skills") && (
        <Section index={number("skills")} id="home-skills" title={t("home.sections.skills")} action={more("/skills", "home.skills.more")}>
          <dl className="grid gap-x-10 sm:grid-cols-2">
            {skillGroups.map((group) => (
              <div key={group.key} className="grid gap-1 border-b border-line py-3">
                <dt className="text-sm font-medium text-ink">
                  {group.label ? <SheetText item={group} field="label" /> : t(`skills.groups.${group.key}`)}
                </dt>
                <dd className="text-sm text-ink-faint">
                  {group.skills.map((s) => s.name).join(" · ")}
                </dd>
              </div>
            ))}
          </dl>
        </Section>
      )}

      <Section index={number("contact")} id="home-contact" title={t("home.sections.contact")}>
        <ContactInfo contacts={contacts} />
      </Section>
    </div>
  );
}
