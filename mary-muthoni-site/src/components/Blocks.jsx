import { Link } from "react-router-dom";
import Photo from "./Photo";
import { Play } from "./VideoPlayer";
import { dayMonth, formatDate } from "../lib/format";

/* Small building blocks shared by several pages. */

export function PageHead({ eyebrow, title, children }) {
  return (
    <section className="page-head">
      <div className="container">
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        {children}
      </div>
    </section>
  );
}

export function SectionHead({ title, to, linkLabel, eyebrow }) {
  return (
    <div className="section-head">
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h2>{title}</h2>
      </div>
      {to && <Link className="underline-link" to={to}>{linkLabel} &rarr;</Link>}
    </div>
  );
}

export function CtaBand({ title = "Media, partnership or speaking enquiries are welcome.", to = "/contact", label = "Contact the office" }) {
  return (
    <section className="cta-band">
      <div className="container cta-inner">
        <h2>{title}</h2>
        <Link to={to} className="pill pill-amber pill-lg">{label}</Link>
      </div>
    </section>
  );
}

export function ProjectCard({ project: p, index = 0 }) {
  return (
    <Link to={`/projects/${p.slug}`} className="project-card">
      <Photo src={p.image} label="" tone={index + 1} className="ratio-16-10">
        {p.videoUrl && <span className="play-badge"><Play size={16} fill="var(--ink)" /></span>}
      </Photo>
      <div className="project-card-body">
        <div className="kicker">{[p.sector, p.year].filter(Boolean).join(" · ")}</div>
        <h3>{p.title}</h3>
        <p className="muted">{p.summary}</p>
        <div className="project-card-foot">
          <span className="brass">{p.status}</span>
          <span>{p.budget}</span>
        </div>
      </div>
    </Link>
  );
}

export function NewsRow({ item: n, index = 0 }) {
  return (
    <Link to={`/news/${n.slug}`} className="news-row">
      <Photo src={n.image} label="" tone={index + 3} className="news-row-thumb" />
      <div>
        <div className="kicker">{[formatDate(n.date), n.category].filter(Boolean).join(" · ").toUpperCase()}</div>
        <div className="news-row-title">{n.title}</div>
      </div>
    </Link>
  );
}

export function EventCard({ event: e, past = false }) {
  const d = dayMonth(e.date);
  return (
    <Link to={`/events#${e.id}`} className={`event-card ${past ? "is-past" : ""}`}>
      <div className="date-chip"><div className="dd">{d.day}</div><div className="mon">{d.month} {past && d.year.slice(2)}</div></div>
      <div>
        <div className="kicker">{(e.type || "").toUpperCase()}</div>
        <div className="event-card-title">{e.title}</div>
        <div className="muted small">{[[e.venue, e.town].filter(Boolean).join(", "), e.time].filter(Boolean).join(" · ")}</div>
      </div>
    </Link>
  );
}

export function AwardCard({ award: a }) {
  return (
    <div className="award-card">
      <div className="award-year">{a.year || "—"}</div>
      <div className="award-name">{a.name}</div>
      {a.body && <div className="muted small">{a.body}</div>}
    </div>
  );
}

export function Empty({ children }) {
  return <p className="empty">{children}</p>;
}
