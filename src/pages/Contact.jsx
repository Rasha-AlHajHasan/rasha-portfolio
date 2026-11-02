// src/pages/Contact.jsx
import React, { useEffect, useState } from "react";
import { Check, Copy, Mail } from "lucide-react";

import { getContacts } from "../data/content";
import { t } from "../content/text";
import ContactDetails from "../components/ContactDetails";
import { ButtonLink, EmptyState, LoadingBlock, PageHeader, Reveal } from "../components/ui";
import { cx, isPlaceholderHref } from "../components/utils";

function CopyButton({ value }) {
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

export default function Contact() {
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
  const details = contacts.filter((c) => c !== email);

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
              className="mt-3 block break-words text-[clamp(1.25rem,1rem+1.6vw,2rem)] font-light text-ink decoration-wine decoration-1 underline-offset-8 hover:underline"
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

        {details.length > 0 && (
          <Reveal
            as="section"
            aria-labelledby="contact-details"
            delay={0.05}
            className={cx("min-w-0", email ? "md:col-span-5" : "md:col-span-7")}
          >
            <p id="contact-details" className="label">
              {t("contact.details")}
            </p>
            <ContactDetails contacts={details} className="mt-2" />
          </Reveal>
        )}
      </div>
    </div>
  );
}
