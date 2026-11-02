// src/pages/Contact.jsx
import React, { useEffect, useState } from "react";
import { ArrowUpRight, Check, Copy, Github, Linkedin, Mail, MapPin, MessageCircle, Phone } from "lucide-react";

import { getContacts } from "../data/content";
import { useI18n } from "../i18n/context";
import { ButtonLink, EmptyState, LoadingBlock, Localized, PageHeader, Reveal } from "../components/ui";
import { cx, FLIP_RTL, isExternal, isPlaceholderHref } from "../components/utils";

const ICONS = {
  email: Mail,
  phone: Phone,
  whatsapp: MessageCircle,
  linkedin: Linkedin,
  github: Github,
  location: MapPin,
};

function CopyButton({ value }) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard unavailable (e.g. insecure context) — the mailto button still works
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex min-h-11 items-center gap-2 rounded-full border border-ink/25 px-5 text-sm font-medium text-ink transition-colors hover:border-ink"
    >
      {copied ? <Check aria-hidden className="h-4 w-4" /> : <Copy aria-hidden className="h-4 w-4" />}
      <span aria-live="polite">{copied ? t("contact.copied") : t("contact.copy")}</span>
    </button>
  );
}

// English: the sheet label. Arabic: label_ar, else our translation of a known type, else the sheet label.
function useContactLabel() {
  const { t, lang } = useI18n();
  return (contact) => {
    if (lang !== "ar") return contact.label;
    if (contact.label_ar) return contact.label_ar;
    return contact.type in ICONS ? t(`contact.types.${contact.type}`) : contact.label;
  };
}

function ChannelRow({ contact }) {
  const { t } = useI18n();
  const labelFor = useContactLabel();
  const Icon = ICONS[contact.type] || ArrowUpRight;
  const label = labelFor(contact);

  return (
    <a
      href={contact.href}
      target={isExternal(contact.href) ? "_blank" : undefined}
      rel={isExternal(contact.href) ? "noreferrer" : undefined}
      aria-label={`${t("contact.open", { label })}: ${contact.value}`}
      className="group flex min-h-16 items-center gap-4 border-b border-line py-3 transition-colors"
    >
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line text-ink transition-colors group-hover:border-wine group-hover:text-wine-text">
        <Icon aria-hidden className="h-4 w-4" />
      </span>
      <span className="grid min-w-0 flex-1 gap-0.5">
        <span className="label">{label}</span>
        <span dir="ltr" className="truncate text-start text-[15px] text-ink">
          {contact.value}
        </span>
      </span>
      <ArrowUpRight
        aria-hidden
        className={cx(
          "h-4 w-4 shrink-0 text-ink-faint transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:text-ink",
          FLIP_RTL
        )}
      />
    </a>
  );
}

// Same row as ChannelRow, but plain text: a location has nothing to open
function LocationRow({ contact }) {
  const labelFor = useContactLabel();

  return (
    <div className="flex min-h-16 items-center gap-4 border-b border-line py-3">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line text-ink">
        <MapPin aria-hidden className="h-4 w-4" />
      </span>
      <span className="grid min-w-0 flex-1 gap-0.5">
        <span className="label">{labelFor(contact)}</span>
        <Localized item={contact} field="value" className="truncate text-start text-[15px] text-ink" />
      </span>
    </div>
  );
}

export default function Contact() {
  const { t } = useI18n();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getContacts()
      .then((data) => setContacts(data || []))
      .catch((error) => console.error("Contact fetch failed:", error))
      .finally(() => setLoading(false));
  }, []);

  const header = (
    <PageHeader label={t("contact.label")} title={t("contact.title")} script={t("contact.script")} intro={t("contact.intro")} />
  );

  if (loading) {
    return (
      <div className="grid gap-8">
        {header}
        <LoadingBlock label={t("contact.loading")} rows={4} />
      </div>
    );
  }

  // Only usable channels: the content layer already drops rows without a link
  const usable = contacts.filter((c) => !isPlaceholderHref(c.href));
  const email = usable.find((c) => c.type === "email");
  const channels = usable.filter((c) => c !== email);
  const location = contacts.find((c) => c.type === "location");

  if (usable.length === 0) {
    return (
      <div className="grid gap-8">
        {header}
        <EmptyState title={t("contact.emptyTitle")}>{t("contact.emptyText")}</EmptyState>
      </div>
    );
  }

  return (
    <div className="grid gap-10">
      {header}

      <div className="grid gap-10 md:grid-cols-12 md:gap-12">
        {email && (
          <Reveal as="section" aria-labelledby="contact-email" className="min-w-0 md:col-span-7">
            <p id="contact-email" className="label">
              {t("contact.email")}
            </p>
            <a
              href={email.href}
              dir="ltr"
              className="mt-3 block break-words text-start text-[clamp(1.25rem,1rem+1.6vw,2rem)] font-light text-ink decoration-wine decoration-1 underline-offset-8 hover:underline"
            >
              {email.value}
            </a>
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink href={email.href} icon={Mail}>
                {t("contact.sendEmail")}
              </ButtonLink>
              <CopyButton value={email.value} />
            </div>
          </Reveal>
        )}

        {(channels.length > 0 || location) && (
          <Reveal
            as="section"
            aria-labelledby="contact-channels"
            delay={0.05}
            className={cx("min-w-0", email ? "md:col-span-5" : "md:col-span-7")}
          >
            <p id="contact-channels" className="label">
              {email ? t("contact.channels") : t("contact.label")}
            </p>
            <ul className="mt-2 border-t border-line">
              {channels.map((contact) => (
                <li key={contact.id}>
                  <ChannelRow contact={contact} />
                </li>
              ))}
              {location && (
                <li>
                  <LocationRow contact={location} />
                </li>
              )}
            </ul>
          </Reveal>
        )}
      </div>
    </div>
  );
}
