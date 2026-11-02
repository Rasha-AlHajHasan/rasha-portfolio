// src/components/ProjectCard.jsx
import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight, Github, Globe, Images, Laptop, Smartphone, X } from "lucide-react";

import { t } from "../content/text";
import { getProjectImages } from "./projectMedia";
import { ButtonLink, SheetText, SafeImage, Tag } from "./ui";
import { cx, isPlaceholderHref, toList } from "./utils";

const PLATFORM_ICONS = { web: Laptop, mobile: Smartphone, website: Globe };
const MAX_TAGS = 4;

// --------------------------------------------------------------------------
// Gallery viewer
// --------------------------------------------------------------------------

export function GalleryViewer({ title, images, startIndex = 0, onClose }) {
  const [index, setIndex] = useState(startIndex);
  const [failed, setFailed] = useState(() => new Set());
  const dialogRef = useRef(null);
  const count = images.length;

  const go = useCallback((step) => setIndex((i) => (i + step + count) % count), [count]);

  useEffect(() => {
    const opener = document.activeElement;

    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);

      // Keep Tab inside the dialog
      if (e.key === "Tab") {
        const focusable = dialogRef.current?.querySelectorAll("button");
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
      opener?.focus?.();
    };
  }, [go, onClose]);

  const src = images[index];

  return createPortal(
    <motion.div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={t("viewer.dialog", { title })}
      className="fixed inset-0 z-[200] flex flex-col bg-[#0E0E10]/95 p-4 text-white md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-lg font-light">{title}</p>
          <p className="mt-0.5 text-xs tabular-nums text-white/60">
            {t("viewer.position", { i: index + 1, n: count })}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          autoFocus
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
          aria-label={t("viewer.close")}
        >
          <X aria-hidden className="h-5 w-5" />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center py-5">
        <AnimatePresence mode="wait">
          {failed.has(src) ? (
            <p key="failed" className="text-sm text-white/60">
              {t("viewer.unavailable")}
            </p>
          ) : (
            <motion.img
              key={src}
              src={src}
              alt={t("viewer.alt", { title, i: index + 1 })}
              onClick={(e) => e.stopPropagation()}
              onError={() => setFailed((prev) => new Set(prev).add(src))}
              className="max-h-full max-w-full rounded-lg object-contain"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </AnimatePresence>
      </div>

      {count > 1 && (
        <div className="flex justify-center gap-3" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => go(-1)}
            className="grid h-11 w-11 place-items-center rounded-full bg-white text-[#141416] transition-opacity hover:opacity-85"
            aria-label={t("viewer.prev")}
          >
            <ChevronLeft aria-hidden className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            className="grid h-11 w-11 place-items-center rounded-full bg-white text-[#141416] transition-opacity hover:opacity-85"
            aria-label={t("viewer.next")}
          >
            <ChevronRight aria-hidden className="h-5 w-5" />
          </button>
        </div>
      )}
    </motion.div>,
    document.body
  );
}

// --------------------------------------------------------------------------
// Card
// --------------------------------------------------------------------------

function NoScreens({ platform }) {
  const Icon = PLATFORM_ICONS[platform] || Laptop;

  return (
    <div className="flex h-20 items-center gap-3 border-b border-line bg-sunken px-5">
      <Icon aria-hidden className="h-4 w-4 text-wine-text" />
      <span className="text-xs text-ink-faint">{t("projects.noScreens")}</span>
    </div>
  );
}

function Media({ title, images, onOpen, onFail, className }) {
  const [portrait, setPortrait] = useState(false);
  const [cover] = images;

  return (
    <button
      type="button"
      onClick={() => onOpen(0)}
      aria-label={t("projects.openScreens", { title })}
      className={cx("relative block w-full overflow-hidden border-b border-line bg-sunken", className)}
    >
      <SafeImage
        src={cover}
        loading="lazy"
        onFail={onFail}
        onLoad={(e) => setPortrait(e.currentTarget.naturalHeight > e.currentTarget.naturalWidth)}
        className={cx(
          "h-full w-full transition-transform duration-700 ease-editorial group-hover:scale-[1.02]",
          // Phone screenshots sit whole inside the frame instead of being cropped
          portrait ? "object-contain py-[4%] drop-shadow-md" : "object-cover object-top"
        )}
      />

      {images.length > 1 && (
        <span className="absolute start-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-surface/90 px-2.5 py-1 text-[11px] text-ink backdrop-blur">
          <Images aria-hidden className="h-3.5 w-3.5 text-wine-text" />
          {t("projects.screens", { n: images.length })}
        </span>
      )}
    </button>
  );
}

export default function ProjectCard({ project, variant = "default" }) {
  const [viewerIndex, setViewerIndex] = useState(null);
  const [failed, setFailed] = useState(() => new Set());

  const stack = toList(project.stack);
  const images = getProjectImages(project).filter((src) => !failed.has(src));
  // Side-by-side feature layout only when there is a screenshot to show
  const feature = variant === "feature" && images.length > 0;
  const { title } = project;
  const onFail = (src) => setFailed((prev) => new Set(prev).add(src));
  const closeViewer = useCallback(() => setViewerIndex(null), []);

  const live = project.demo_url && !isPlaceholderHref(project.demo_url) ? project.demo_url : "";
  const repo = project.github_url && !isPlaceholderHref(project.github_url) ? project.github_url : "";
  const tags = stack.slice(0, feature ? stack.length : MAX_TAGS);
  const hidden = stack.length - tags.length;

  return (
    <>
      <article
        className={cx(
          "group grid h-full overflow-hidden rounded-md border border-line bg-surface transition-colors duration-300 hover:border-ink/30",
          feature ? "md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]" : "grid-rows-[auto_1fr]"
        )}
      >
        {images.length > 0 ? (
          <Media
            title={title}
            images={images}
            onOpen={setViewerIndex}
            onFail={onFail}
            className={cx("aspect-[16/10]", feature && "md:aspect-auto md:h-full md:min-h-[18rem] md:border-b-0 md:border-e")}
          />
        ) : (
          <NoScreens platform={project.platform} />
        )}

        <div className={cx("flex min-w-0 flex-col p-5", feature && "md:justify-center md:p-8")}>
          <p className="label flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>{t(`projects.platforms.${project.platform || "web"}`)}</span>
            {project.featured && (
              <span className="inline-flex items-center gap-1.5 text-wine-text">
                <span aria-hidden className="h-1 w-1 rounded-full bg-wine" />
                {t("projects.featured")}
              </span>
            )}
          </p>

          <SheetText
            item={project}
            field="title"
            as="h3"
            className={cx("mt-3 font-normal text-ink", feature ? "text-heading" : "text-lg leading-snug")}
          />

          <SheetText
            item={project}
            field="summary"
            as="p"
            className={cx("mt-2 text-sm leading-relaxed text-ink-soft", !feature && "line-clamp-4")}
          />

          {tags.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-1.5" aria-label={t("experience.technologies")}>
              {tags.map((tech) => (
                <li key={tech}>
                  <Tag>{tech}</Tag>
                </li>
              ))}
              {hidden > 0 && (
                <li>
                  <Tag className="border-transparent">+{hidden}</Tag>
                </li>
              )}
            </ul>
          )}

          {(live || repo || images.length > 0) && (
            <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 pt-5">
              {live && (
                <ButtonLink href={live} variant="text" icon={ArrowUpRight}>
                  {t("projects.viewProject")}
                </ButtonLink>
              )}
              {repo && (
                <ButtonLink href={repo} variant="text" icon={Github}>
                  {t("projects.github")}
                </ButtonLink>
              )}
              {images.length > 0 && (
                <ButtonLink variant="text" icon={Images} onClick={() => setViewerIndex(0)}>
                  {t("projects.viewScreens")}
                </ButtonLink>
              )}
            </div>
          )}
        </div>
      </article>

      <AnimatePresence>
        {viewerIndex !== null && images.length > 0 && (
          <GalleryViewer
            title={title}
            images={images}
            startIndex={Math.min(viewerIndex, images.length - 1)}
            onClose={closeViewer}
          />
        )}
      </AnimatePresence>
    </>
  );
}
