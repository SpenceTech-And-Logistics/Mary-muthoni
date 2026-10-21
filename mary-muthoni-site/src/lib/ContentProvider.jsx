import { useEffect, useMemo, useState } from "react";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { db, isConfigured } from "./firebase";
import { ContentContext } from "./contentContext";
import { slugify } from "./format";
import {
  DEFAULT_SETTINGS, SAMPLE_AWARDS, SAMPLE_EVENTS, SAMPLE_GALLERY, SAMPLE_NEWS, SAMPLE_POSITIONS, SAMPLE_PROJECTS,
} from "../data/defaults";

/*
  One place that supplies all site content.
  - Firebase not connected: the built-in content from src/data/defaults.js.
  - Firebase connected: live data, updated instantly when the admin saves.
*/

const COLLECTIONS = {
  projects: SAMPLE_PROJECTS,
  positions: SAMPLE_POSITIONS,
  awards: SAMPLE_AWARDS,
  news: SAMPLE_NEWS,
  events: SAMPLE_EVENTS,
  gallery: SAMPLE_GALLERY,
};

function mergeSettings(saved) {
  if (!saved) return DEFAULT_SETTINGS;
  return {
    ...DEFAULT_SETTINGS,
    ...saved,
    contact: { ...DEFAULT_SETTINGS.contact, ...(saved.contact || {}) },
    socials: { ...DEFAULT_SETTINGS.socials, ...(saved.socials || {}) },
    theme: { ...DEFAULT_SETTINGS.theme, ...(saved.theme || {}) },
    introVideo: { ...DEFAULT_SETTINGS.introVideo, ...(saved.introVideo || {}) },
  };
}

const byOrder = (a, b) => (a.order ?? 9999) - (b.order ?? 9999) || (b.createdAt ?? 0) - (a.createdAt ?? 0);
const byDateDesc = (a, b) => String(b.date || "").localeCompare(String(a.date || "")) || (b.createdAt ?? 0) - (a.createdAt ?? 0);
const byDateAsc = (a, b) => String(a.date || "").localeCompare(String(b.date || ""));
const SORTERS = { projects: byOrder, positions: byOrder, awards: byOrder, news: byDateDesc, events: byDateAsc, gallery: byOrder };

// Every project and story gets a web address from its title if none was saved.
const withSlug = (item) => (item.slug ? item : { ...item, slug: slugify(item.title) });

function ContentProvider({ children }) {
  const [live, setLive] = useState({});
  const [saved, setSaved] = useState(null);
  const [ready, setReady] = useState(!isConfigured);

  useEffect(() => {
    if (!isConfigured) return;
    const unsubs = Object.keys(COLLECTIONS).map((name) =>
      onSnapshot(
        collection(db, name),
        (snap) => setLive((prev) => ({ ...prev, [name]: snap.docs.map((d) => ({ id: d.id, ...d.data() })) })),
        () => setLive((prev) => ({ ...prev, [name]: [] }))
      )
    );
    unsubs.push(
      onSnapshot(
        doc(db, "settings", "site"),
        (snap) => { setSaved(snap.exists() ? snap.data() : null); setReady(true); },
        () => setReady(true)
      )
    );
    return () => unsubs.forEach((u) => u());
  }, []);

  const settings = useMemo(() => mergeSettings(saved), [saved]);

  useEffect(() => {
    const root = document.documentElement.style;
    root.setProperty("--ink", settings.theme.primary);
    root.setProperty("--amber", settings.theme.accent);
    if (settings.theme.teal) root.setProperty("--teal", settings.theme.teal);
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", settings.theme.primary);
  }, [settings.theme]);

  const value = useMemo(() => {
    const pick = (name) => [...(isConfigured ? live[name] ?? [] : COLLECTIONS[name])].sort(SORTERS[name]);
    const projects = pick("projects").map(withSlug);
    const news = pick("news").map(withSlug);
    return {
      ready,
      isLive: isConfigured,
      settings,
      displayName: settings.name,
      fullName: [settings.name, settings.postNominals].filter(Boolean).join(", "),
      projects,
      positions: pick("positions"),
      awards: pick("awards"),
      news,
      events: pick("events"),
      gallery: pick("gallery"),
    };
  }, [live, settings, ready]);

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export default ContentProvider;
