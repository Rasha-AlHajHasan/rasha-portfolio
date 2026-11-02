// src/components/ContactDetails.jsx
// The contact rows, filled from the Contact sheet tab. Used by Home and the Contact page.
import React from "react";
import { ArrowUpRight, Github, Linkedin, Mail, MapPin, MessageCircle, Phone } from "lucide-react";

import { t } from "../content/text";
import { isExternal, isPlaceholderHref } from "./utils";

const ICONS = {
  email: Mail,
  phone: Phone,
  whatsapp: MessageCircle,
  linkedin: Linkedin,
  github: Github,
};

function ChannelRow({ contact }) {
  const Icon = ICONS[contact.type] || ArrowUpRight;

  return (
    <a
      href={contact.href}
      target={isExternal(contact.href) ? "_blank" : undefined}
      rel={isExternal(contact.href) ? "noreferrer" : undefined}
      aria-label={`${t("contact.open", { label: contact.label })}: ${contact.value}`}
      className="group flex min-h-16 items-center gap-4 border-b border-line py-3 transition-colors"
    >
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line text-ink transition-colors group-hover:border-wine group-hover:text-wine-text">
        <Icon aria-hidden className="h-4 w-4" />
      </span>
      <span className="grid min-w-0 flex-1 gap-0.5">
        <span className="label">{contact.label}</span>
        <span className="truncate text-[15px] text-ink">{contact.value}</span>
      </span>
      <ArrowUpRight
        aria-hidden
        className="h-4 w-4 shrink-0 text-ink-faint transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:text-ink"
      />
    </a>
  );
}

// Same row as ChannelRow, but plain text: a location has nothing to open
function LocationRow({ contact }) {
  return (
    <div className="flex min-h-16 items-center gap-4 border-b border-line py-3">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line text-ink">
        <MapPin aria-hidden className="h-4 w-4" />
      </span>
      <span className="grid min-w-0 flex-1 gap-0.5">
        <span className="label">{contact.label}</span>
        <span className="truncate text-[15px] text-ink">{contact.value}</span>
      </span>
    </div>
  );
}

export default function ContactDetails({ contacts, className }) {
  const rows = contacts.filter((c) => c.type === "location" || !isPlaceholderHref(c.href));
  if (rows.length === 0) return null;

  return (
    <ul className={`border-t border-line ${className || ""}`}>
      {rows.map((contact) => (
        <li key={contact.id}>
          {contact.type === "location" ? <LocationRow contact={contact} /> : <ChannelRow contact={contact} />}
        </li>
      ))}
    </ul>
  );
}
