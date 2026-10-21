export function parseDate(iso) {
  const d = iso ? new Date(`${iso}T00:00:00`) : null;
  return d && !Number.isNaN(d.getTime()) ? d : null;
}

export function formatDate(iso) {
  const d = parseDate(iso);
  if (!d) return "";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export function dayMonth(iso) {
  const d = parseDate(iso);
  if (!d) return { day: "--", month: "TBC", year: "" };
  return {
    day: String(d.getDate()).padStart(2, "0"),
    month: d.toLocaleDateString("en-GB", { month: "short" }).toUpperCase(),
    year: String(d.getFullYear()),
  };
}

export function slugify(text) {
  return String(text || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70) || "item";
}

export const todayIso = () => new Date().toISOString().slice(0, 10);

/* An event is upcoming until its last day has passed. */
export const isUpcoming = (e) => (e.endDate || e.date || "") >= todayIso();

export const paragraphs = (text) => String(text || "").split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean);
