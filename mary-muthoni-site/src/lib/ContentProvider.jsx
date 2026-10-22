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

// A project's cover is its main photo, or else the first of its extra photos.
const withCover = (p) => ({ ...p, cover: p.image || (p.photos || []).find((x) => x?.src)?.src || "" });

/*
  Photos and videos attached to projects, news stories and awards also appear
  in the public Gallery, each linking back to the page it came from.
  The same picture is only shown once.
*/
function linkedMedia(projects, news, awards) {
  const out = [];
  const seen = new Set();
  const add = (item) => {
    const key = item.kind === "video" ? item.videoUrl : item.image;
    if (!key || seen.has(key)) return;
    seen.add(key);
    out.push(item);
  };
  projects.forEach((p) => {
    const source = { to: `/projects/${p.slug}`, label: p.title, type: "project" };
    if (p.image) add({ id: `lp-${p.id}`, kind: "photo", image: p.image, caption: p.title, album: "Projects", source });
    (p.photos || []).forEach((ph, k) => ph?.src && add({ id: `lp-${p.id}-${k}`, kind: "photo", image: ph.src, caption: ph.caption || p.title, album: "Projects", source }));
    if (p.videoUrl) add({ id: `lpv-${p.id}`, kind: "video", videoUrl: p.videoUrl, image: p.cover, caption: p.title, album: "Projects", source });
  });
  news.forEach((n) => {
    const source = { to: `/news/${n.slug}`, label: n.title, type: "story" };
    if (n.image) add({ id: `ln-${n.id}`, kind: "photo", image: n.image, caption: n.title, album: "News", source });
    if (n.videoUrl) add({ id: `lnv-${n.id}`, kind: "video", videoUrl: n.videoUrl, image: n.image, caption: n.title, album: "News", source });
  });
  awards.forEach((a) => {
    if (a.image) add({ id: `la-${a.id}`, kind: "photo", image: a.image, caption: [a.name, a.year].filter(Boolean).join(", "), album: "Awards", source: { to: "/awards", label: "Awards and honours", type: "page" } });
  });
  return out;
}

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
    const projects = pick("projects").map(withSlug).map(withCover);
    const news = pick("news").map(withSlug);
    const awards = pick("awards");
    const gallery = pick("gallery");
    const media = settings.galleryIncludeLinked === false ? gallery : [...gallery, ...linkedMedia(projects, news, awards)];
    return {
      ready,
      isLive: isConfigured,
      settings,
      displayName: settings.name,
      fullName: [settings.name, settings.postNominals].filter(Boolean).join(", "),
      projects,
      positions: pick("positions"),
      awards,
      news,
      events: pick("events"),
      gallery, // only what was added in /admin > Gallery (the dashboard edits this)
      media, // what the public Gallery shows: the above plus photos and videos from projects, news and awards
    };
  }, [live, settings, ready]);

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export default ContentProvider;
