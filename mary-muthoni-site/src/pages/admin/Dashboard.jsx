import { useEffect, useState } from "react";
import { NavLink, Route, Routes } from "react-router-dom";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useContent } from "../../lib/contentContext";
import {
  ALBUMS, EVENT_TYPES, NEWS_CATEGORIES, POSITION_KINDS, SECTORS, STATUSES,
  SAMPLE_AWARDS, SAMPLE_EVENTS, SAMPLE_GALLERY, SAMPLE_NEWS, SAMPLE_POSITIONS, SAMPLE_PROJECTS,
} from "../../data/defaults";
import { formatDate } from "../../lib/format";
import Crud from "./Crud";
import SiteEditor from "./SiteEditor";
import Messages from "./Messages";

const VIDEO_HINT = "Paste a YouTube, Vimeo or Facebook video link, or a direct .mp4 address.";

const projectFields = [
  { key: "title", label: "Project name", required: true, max: 140, wide: true },
  { key: "sector", label: "Sector", type: "combo", options: SECTORS, default: SECTORS[0], hint: "Pick one or type a new one. Sectors become filters." },
  { key: "status", label: "Status", type: "combo", options: STATUSES, default: STATUSES[0] },
  { key: "year", label: "Year or period", max: 40, placeholder: "2023 – present" },
  { key: "place", label: "Where", max: 120, placeholder: "County, region or National" },
  { key: "budget", label: "Budget (optional)", max: 40, placeholder: "KES 120M" },
  { key: "featured", label: "Show in the home page carousel", type: "checkbox" },
  { key: "summary", label: "One-line summary", type: "textarea", rows: 2, max: 400, wide: true, required: true },
  { key: "body", label: "Full description", type: "textarea", rows: 9, max: 8000, wide: true, hint: "Leave an empty line between paragraphs." },
  { key: "outcomes", label: "Outcomes", type: "pairs", keys: ["value", "label"], wide: true, placeholder: "12,000 | households reached\n85% | of facilities linked", hint: "One per line: number | what it measures. The first three show on the carousel." },
  { key: "videoUrl", label: "Video (optional)", type: "url", max: 400, wide: true, hint: VIDEO_HINT },
  { key: "slug", label: "Web address (optional)", max: 70, hint: "Made from the name if left empty, e.g. /projects/one-bed-one-mattress. Changing it breaks old links." },
  { key: "image", label: "Main photo", type: "image", maxSide: 1600 },
];

const positionFields = [
  { key: "title", label: "Position", required: true, max: 120, wide: true },
  { key: "org", label: "Institution", required: true, max: 160, wide: true },
  { key: "kind", label: "Group", type: "combo", options: POSITION_KINDS, default: POSITION_KINDS[0], hint: "Boards and committees also show on the Profile page." },
  { key: "years", label: "Years", max: 40, placeholder: "2023 – present" },
  { key: "current", label: "Currently held (shown at the top)", type: "checkbox" },
  { key: "mandate", label: "Mandate or one-line description", type: "textarea", rows: 3, max: 600, wide: true },
  { key: "highlights", label: "Highlights", type: "lines", wide: true, hint: "One per line." },
];

const awardFields = [
  { key: "name", label: "Award or honour", required: true, max: 140, wide: true },
  { key: "year", label: "Year", max: 20 },
  { key: "body", label: "Conferred by", max: 140 },
  { key: "citation", label: "Citation (optional)", type: "textarea", rows: 3, max: 600, wide: true, hint: "The first award with a citation is shown large on the Awards page." },
  { key: "image", label: "Photo (optional)", type: "image" },
];

const newsFields = [
  { key: "title", label: "Headline", required: true, max: 180, wide: true },
  { key: "category", label: "Category", type: "combo", options: NEWS_CATEGORIES, default: NEWS_CATEGORIES[0] },
  { key: "date", label: "Date", type: "date", required: true },
  { key: "summary", label: "Summary", type: "textarea", rows: 2, max: 400, wide: true, required: true },
  { key: "body", label: "Story", type: "textarea", rows: 10, max: 12000, wide: true, hint: "Leave an empty line between paragraphs." },
  { key: "videoUrl", label: "Video (optional)", type: "url", max: 400, wide: true, hint: `${VIDEO_HINT} Replaces the photo at the top of the story.` },
  { key: "sourceName", label: "Original source name (optional)", max: 80, placeholder: "e.g. Capital FM" },
  { key: "sourceUrl", label: "Link to the original (optional)", type: "url", max: 400 },
  { key: "relatedProjects", label: "Related projects", type: "refs", from: "projects", wide: true },
  { key: "relatedNews", label: "Earlier stories", type: "refs", from: "news", wide: true },
  { key: "relatedLinks", label: "Other links", type: "pairs", keys: ["label", "url"], wide: true, placeholder: "Ministry statement | https://...", hint: "One per line: title | link." },
  { key: "slug", label: "Web address (optional)", max: 70, hint: "Made from the headline if left empty." },
  { key: "image", label: "Photo", type: "image", maxSide: 1600 },
];

const eventFields = [
  { key: "title", label: "Event", required: true, max: 160, wide: true },
  { key: "type", label: "Type", type: "combo", options: EVENT_TYPES, default: EVENT_TYPES[0] },
  { key: "role", label: "Her role (optional)", max: 80, placeholder: "Keynote speaker" },
  { key: "date", label: "Date", type: "date", required: true },
  { key: "endDate", label: "Last day (if more than one day)", type: "date" },
  { key: "time", label: "Time (optional)", max: 40, placeholder: "09:00 – 12:30" },
  { key: "venue", label: "Venue", max: 120 },
  { key: "town", label: "Town or city", max: 80 },
  { key: "summary", label: "One-line description", type: "textarea", rows: 2, max: 400, wide: true },
  { key: "url", label: "Event page link (optional)", type: "url", max: 400, wide: true },
];

const galleryFields = [
  { key: "kind", label: "Type", type: "select", options: ["photo", "video"], default: "photo" },
  { key: "album", label: "Album", type: "combo", options: ALBUMS, default: ALBUMS[0], hint: "Albums become filters on the Gallery page." },
  { key: "caption", label: "Caption or video title", max: 160, wide: true, placeholder: "Event, place, date" },
  { key: "videoUrl", label: "Video link", type: "url", max: 400, wide: true, hint: VIDEO_HINT, showIf: (g) => g.kind === "video" },
  { key: "image", label: "Photo (for videos: optional cover image)", type: "image", maxSide: 1600 },
];

const SECTIONS = [
  { path: "projects", label: "Projects", name: "projects", singular: "project", fields: projectFields, sortable: true, samples: SAMPLE_PROJECTS, slugFrom: "title",
    intro: "Use the arrows to set the order. Tick “Show in the home page carousel” for the projects to feature.",
    describe: (p) => ({ title: `${p.featured ? "★ " : ""}${p.title}`, sub: [p.sector, p.status, p.year].filter(Boolean).join(" · "), image: p.image }) },
  { path: "positions", label: "Positions", name: "positions", singular: "position", fields: positionFields, sortable: true, samples: SAMPLE_POSITIONS,
    intro: "Newest first within each group. Positions marked current appear at the top of the page.",
    describe: (p) => ({ title: `${p.title}, ${p.org}`, sub: [p.kind, p.years, p.current && "Current"].filter(Boolean).join(" · ") }) },
  { path: "awards", label: "Awards", name: "awards", singular: "award", fields: awardFields, sortable: true, samples: SAMPLE_AWARDS,
    intro: "The first four show on the home page.",
    describe: (a) => ({ title: a.name, sub: [a.year, a.body].filter(Boolean).join(" · "), image: a.image }) },
  { path: "news", label: "News", name: "news", singular: "story", fields: newsFields, samples: SAMPLE_NEWS, slugFrom: "title",
    intro: "Newest first. Link each story to projects and earlier stories so readers can follow the thread.",
    describe: (n) => ({ title: n.title, sub: [formatDate(n.date), n.category, n.videoUrl && "Video"].filter(Boolean).join(" · "), image: n.image }) },
  { path: "events", label: "Events", name: "events", singular: "event", fields: eventFields, samples: SAMPLE_EVENTS,
    intro: "Events move from Upcoming to Past automatically after their last day.",
    describe: (e) => ({ title: e.title, sub: [formatDate(e.date), e.type, e.town].filter(Boolean).join(" · ") }) },
  { path: "gallery", label: "Gallery", name: "gallery", singular: "photo or video", fields: galleryFields, sortable: true, samples: SAMPLE_GALLERY,
    bulk: { maxSide: 1600, defaults: { kind: "photo", caption: "", album: ALBUMS[0], videoUrl: "" } },
    intro: "Photos and videos. The first five photos show on the home page; the first videos appear under “Hear it first-hand”.",
    describe: (g) => ({ title: g.caption || "No caption yet", sub: [g.kind === "video" ? "Video" : "Photo", g.album].filter(Boolean).join(" · "), image: g.image }) },
];

function Overview() {
  const content = useContent();
  return (
    <div>
      <div className="admin-head"><div><h1>Welcome back</h1><p className="admin-small">Changes to {content.settings.name}&rsquo;s site appear straight away.</p></div></div>
      <div className="admin-cards">
        {SECTIONS.map((s) => (
          <NavLink key={s.path} to={`/admin/${s.path}`} className="admin-stat"><strong>{content[s.name].length}</strong><span>{s.label}</span></NavLink>
        ))}
      </div>
      <div className="admin-panel">
        <h2>What you can do here</h2>
        <ul className="admin-small steps">
          <li><b>Projects</b>: add programmes with photos, a video, outcomes and a full description. Ticked projects rotate in the home page carousel.</li>
          <li><b>News</b>: write stories with a photo or video, a link to the original, and links to related projects and earlier stories.</li>
          <li><b>Events</b>: upcoming events get &ldquo;Add to calendar&rdquo; buttons and move to Past on their own.</li>
          <li><b>Gallery</b>: &ldquo;Upload several photos&rdquo; adds many at once; add videos by pasting a YouTube or Facebook link.</li>
          <li><b>Profile and settings</b>: name, office, portrait, introduction video, biography, headline numbers, education, focus areas, quote, contact and social links.</li>
        </ul>
        <a className="admin-btn" href="/" target="_blank" rel="noopener noreferrer">Open the public site</a>
      </div>
    </div>
  );
}

function Dashboard({ user, onSignOut }) {
  const [unread, setUnread] = useState(0);
  useEffect(
    () => onSnapshot(collection(db, "messages"), (snap) => setUnread(snap.docs.filter((d) => !d.data().read).length), () => {}),
    []
  );
  const links = [["/admin", "Overview", true], ...SECTIONS.map((s) => [`/admin/${s.path}`, s.label]), ["/admin/settings", "Profile and settings"], ["/admin/messages", "Messages"]];
  return (
    <div className="admin-shell">
      <aside className="admin-side">
        <div className="admin-brand">Office dashboard</div>
        <nav aria-label="Admin">
          {links.map(([to, label, end]) => (
            <NavLink key={to} to={to} end={end} className="admin-nav">
              {label}
              {label === "Messages" && unread > 0 && <span className="badge">{unread}</span>}
            </NavLink>
          ))}
        </nav>
        <div className="admin-user">
          <span className="admin-small">{user.email}</span>
          <button className="admin-btn" onClick={onSignOut}>Sign out</button>
        </div>
      </aside>
      <section className="admin-main">
        <Routes>
          <Route index element={<Overview />} />
          {SECTIONS.map(({ path, label, ...s }) => (
            <Route key={path} path={path} element={<Crud key={path} title={label} {...s} />} />
          ))}
          <Route path="settings" element={<SiteEditor />} />
          <Route path="messages" element={<Messages />} />
          <Route path="*" element={<Overview />} />
        </Routes>
      </section>
    </div>
  );
}

export default Dashboard;
