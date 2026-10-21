import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import Photo from "../components/Photo";
import { CtaBand, Empty, PageHead } from "../components/Blocks";
import { useContent } from "../lib/contentContext";
import { formatDate } from "../lib/format";

function News() {
  const { news, displayName } = useContent();
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const cats = useMemo(() => ["All", ...new Set(news.map((n) => n.category).filter(Boolean))], [news]);
  const term = q.trim().toLowerCase();
  const shown = news.filter((n) => (cat === "All" || n.category === cat) && (!term || `${n.title} ${n.summary}`.toLowerCase().includes(term)));
  const [lead, ...rest] = shown;

  return (
    <>
      <Seo title="News" path="/news" description={`News, statements and updates from ${displayName}.`} />
      <PageHead eyebrow="NEWS" title="News and statements." />

      <section>
        <div className="container">
          <div className="filter-bar">
            <div className="chips" role="group" aria-label="Filter by category">
              {cats.map((c) => (
                <button key={c} type="button" className={`filter ${cat === c ? "is-active" : ""}`} aria-pressed={cat === c} onClick={() => setCat(c)}>{c}</button>
              ))}
            </div>
            <label className="search">
              <span className="sr-only">Search news</span>
              <input type="search" placeholder="Search news" value={q} onChange={(e) => setQ(e.target.value)} />
            </label>
          </div>
        </div>
      </section>

      <section>
        <div className="container pt-md">
          {!lead && <Empty>No stories match.</Empty>}
          {lead && (
            <Link to={`/news/${lead.slug}`} className="news-feature">
              <Photo src={lead.image} label="LEAD STORY PHOTO" tone={1} className="ratio-16-9" alt="" />
              <div>
                <div className="kicker">{[formatDate(lead.date), lead.category].filter(Boolean).join(" · ").toUpperCase()}</div>
                <h2>{lead.title}</h2>
                <p className="muted">{lead.summary}</p>
                <span className="underline-link">Read the story &rarr;</span>
              </div>
            </Link>
          )}
          <div className="news-grid">
            {rest.map((n, i) => (
              <Link key={n.id} to={`/news/${n.slug}`} className="news-card">
                <Photo src={n.image} label="" tone={i + 2} className="ratio-3-2" alt="" />
                <div className="kicker mt">{[formatDate(n.date), n.category].filter(Boolean).join(" · ").toUpperCase()}</div>
                <h3>{n.title}</h3>
                <p className="muted small">{n.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}

export default News;
