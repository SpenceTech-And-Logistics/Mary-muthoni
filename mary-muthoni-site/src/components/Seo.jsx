import { useEffect } from "react";
import { useContent } from "../lib/contentContext";
import site from "../../site.config.js";

const SITE_URL = (import.meta.env.VITE_SITE_URL || site.siteUrl || "").replace(/\/$/, "");

function setMeta(selector, attr, name, content) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

/* Updates the tab title and share tags when the page changes.
   The build step also writes these into each page's HTML for crawlers. */
function Seo({ title, description, path = "/", noindex = false, image = "" }) {
  const { settings, fullName } = useContent();
  useEffect(() => {
    const base = `${fullName} | ${settings.role}, ${settings.ministry}`;
    const full = title ? `${title} | ${settings.name}` : base;
    const desc = description || settings.intro;
    document.title = full;
    setMeta('meta[name="description"]', "name", "description", desc);
    setMeta('meta[property="og:title"]', "property", "og:title", full);
    setMeta('meta[property="og:description"]', "property", "og:description", desc);
    if (image && /^https?:/.test(image)) setMeta('meta[property="og:image"]', "property", "og:image", image);
    setMeta('meta[name="robots"]', "name", "robots", noindex ? "noindex, nofollow" : "index, follow");
    if (SITE_URL) {
      let link = document.head.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement("link");
        link.rel = "canonical";
        document.head.appendChild(link);
      }
      link.href = SITE_URL + path;
    }
  }, [title, description, path, noindex, image, settings, fullName]);
  return null;
}

export default Seo;
