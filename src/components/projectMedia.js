// src/components/projectMedia.js
import { toList } from "./utils";

// Cover first, then the remaining screenshots (no duplicates, no blanks)
export function getProjectImages(project) {
  const gallery = toList(project.gallery);
  const cover = project.cover_url?.trim();
  const all = cover ? [cover, ...gallery.filter((img) => img !== cover)] : gallery;
  return all.filter((img) => img && img.trim() !== "");
}
