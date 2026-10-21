import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import Photo from "../components/Photo";
import VideoPlayer, { Play } from "../components/VideoPlayer";
import { AwardCard, CtaBand, EventCard, NewsRow, SectionHead } from "../components/Blocks";
import { useContent } from "../lib/contentContext";
import { formatDate, isUpcoming } from "../lib/format";
import { parseVideo } from "../lib/video";

function ProjectCarousel({ projects }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = projects.length;
  const go = (k) => setI(((k % n) + n) % n);

  // Moves on every 8 seconds unless the visitor is interacting with it.
  useEffect(() => {
    if (paused || n < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => setI((x) => (x + 1) % n), 8000);
    return () => clearTimeout(t);
  }, [i, paused, n]);

  if (!n) return null;
  const p = projects[Math.min(i, n - 1)];
  const pad = (x) => String(x).padStart(2, "0");

  return (
    <section className="band-ink" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)}>
      <div className="container carousel">
        <div className="section-head">
          <div><div className="eyebrow amber">PROJECTS</div><h2>Featured projects</h2></div>
          <div className="carousel-ctrl">
            <span className="counter" aria-live="polite">{pad(i + 1)} / {pad(n)}</span>
            <button type="button" className="round round-outline" onClick={() => go(i - 1)} aria-label="Previous project">&larr;</button>
            <button type="button" className="round round-amber" onClick={() => go(i + 1)} aria-label="Next project">&rarr;</button>
          </div>
        </div>

        <div className="slide" key={p.id}>
          <Photo src={p.image} label="PROJECT PHOTO" tone={i} className="slide-photo" alt={p.title} />
          <div className="slide-body">
            <div>
              <div className="slide-meta"><span className="chip-amber">{(p.sector || "").toUpperCase()}</span><span>{[p.year, p.place].filter(Boolean).join(" · ").toUpperCase()}</span></div>
              <h3>{p.title}</h3>
              <p>{p.summary}</p>
            </div>
            <div>
              {p.outcomes?.length > 0 && (
                <div className="slide-stats">
                  {p.outcomes.slice(0, 3).map((o) => (
                    <div key={o.label}><div className="num">{o.value}</div><div className="lbl">{o.label}</div></div>
                  ))}
                </div>
              )}
              <Link to={`/projects/${p.slug}`} className="amber-link">View the project &rarr;</Link>
            </div>
          </div>
        </div>

        <div className="filmstrip">
          {projects.map((q, k) => (
            <button type="button" key={q.id} onClick={() => go(k)} className={k === i ? "is-active" : ""} aria-label={`Show project ${k + 1}: ${q.title}`} aria-current={k === i}>
              <span className="bar" />
              <Photo src={q.image} label="" tone={k} className="ratio-16-9" />
              <span className="film-title">{q.title}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function Home() {
  const { settings, fullName, projects, news, events, awards, gallery } = useContent();
  const featured = projects.filter((p) => p.featured);
  const carousel = (featured.length ? featured : projects).slice(0, 6);
  const upcoming = events.filter(isUpcoming).slice(0, 3);
  const recent = events.filter((e) => !isUpcoming(e)).reverse().slice(0, 3);
  const shownEvents = upcoming.length ? upcoming : recent;
  const videos = gallery.filter((g) => g.kind === "video");
  const photos = gallery.filter((g) => g.kind !== "video").slice(0, 5);
  const intro = settings.introVideo || {};
  const mainVideo = intro.url ? { url: intro.url, title: intro.title, caption: intro.caption } : videos[0] ? { url: videos[0].videoUrl, title: videos[0].caption, poster: videos[0].image, caption: videos[0].caption } : { url: "", title: "", caption: "" };
  const moreVideos = (intro.url ? videos : videos.slice(1)).slice(0, 3);
  const [lead, ...rest] = news;
  const nameParts = settings.name.split(" ");
  const relatedFor = (n) => [
    ...(n.relatedProjects || []).map((s) => projects.find((p) => p.slug === s)).filter(Boolean).map((p) => ({ to: `/projects/${p.slug}`, label: p.title })),
    ...(n.relatedNews || []).map((s) => news.find((x) => x.slug === s)).filter(Boolean).map((x) => ({ to: `/news/${x.slug}`, label: x.title })),
  ].slice(0, 2);

  return (
    <>
      <Seo path="/" />
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-text">
            <div className="eyebrow">{settings.role.toUpperCase()} &middot; {settings.ministry.toUpperCase()}</div>
            <h1>{nameParts.slice(0, -1).join(" ")}<br />{nameParts.slice(-1)}</h1>
            {settings.postNominals && <div className="post-nominals">{settings.postNominals}</div>}
            <p className="hero-lead">{settings.intro}</p>
            <div className="hero-actions">
              <Link to="/projects" className="pill pill-teal pill-lg">Explore projects</Link>
              {intro.url
                ? <a href="#watch" className="pill pill-outline pill-lg"><Play size={16} />Watch the introduction</a>
                : <Link to="/profile" className="pill pill-outline pill-lg">Read the profile</Link>}
            </div>
            <dl className="facts">
              <div><dt>CURRENT OFFICE</dt><dd>{settings.role}, {settings.agency.split(",")[0]}</dd></div>
              {settings.alsoServing && <div><dt>ALSO SERVING AS</dt><dd>{settings.alsoServing}</dd></div>}
              <div><dt>BASED IN</dt><dd>{settings.basedIn}</dd></div>
            </dl>
          </div>
          <div className="hero-portrait">
            <div className="frame" aria-hidden="true" />
            <Photo src={settings.heroImage} label="PORTRAIT PHOTO" tone={4} className="ratio-4-5" alt={`Portrait of ${fullName}`} />
          </div>
        </div>
      </section>

      <ProjectCarousel projects={carousel} />

      <section>
        <div className="container stats">
          {settings.stats.map((s) => (
            <div key={s.label}><div className="stat-num">{s.value}</div><div className="muted small">{s.label}</div></div>
          ))}
        </div>
      </section>

      <section className="band-sand" id="watch">
        <div className="container watch">
          <div className="watch-main">
            <div className="eyebrow">WATCH</div>
            <h2>Hear it first-hand</h2>
            <VideoPlayer url={mainVideo.url} poster={mainVideo.poster} title={mainVideo.title || "Video"} />
            <p className="caption-serif">{mainVideo.caption || "[Video title] · [Event or programme] · [Date]"}</p>
          </div>
          <div className="watch-side">
            <div className="label">MORE VIDEOS</div>
            {moreVideos.map((v, k) => {
              const pv = parseVideo(v.videoUrl);
              return (
                <Link key={v.id} to="/gallery?tab=videos" className="mini-video">
                  <Photo src={v.image || pv?.thumb} label="" tone={k + 1} className="mini-thumb"><span className="mini-play"><Play size={22} fill="#fff" /></span></Photo>
                  <div><div className="strong">{v.caption}</div><div className="muted small">{v.album}</div></div>
                </Link>
              );
            })}
            <Link to="/gallery?tab=videos" className="underline-link">All videos &rarr;</Link>
          </div>
        </div>
      </section>

      {lead && (
        <section className="section">
          <div className="container">
            <SectionHead title="Latest news" to="/news" linkLabel="All news" />
            <div className="news-split">
              <div className="news-lead">
                <Link to={`/news/${lead.slug}`} className="plain">
                  <Photo src={lead.image} label="LEAD STORY PHOTO" tone={1} className="ratio-16-9" />
                  <div className="kicker mt">{[formatDate(lead.date), lead.category].filter(Boolean).join(" · ").toUpperCase()}</div>
                  <h3 className="lead-title">{lead.title}</h3>
                  <p className="muted">{lead.summary}</p>
                </Link>
                {relatedFor(lead).length > 0 && (
                  <div className="related-chips"><span className="label">RELATED</span>{relatedFor(lead).map((r) => <Link key={r.to} to={r.to} className="chip">{r.label}</Link>)}</div>
                )}
              </div>
              <div className="news-list">
                {rest.slice(0, 3).map((n, k) => <NewsRow key={n.id} item={n} index={k} />)}
              </div>
            </div>
          </div>
        </section>
      )}

      {shownEvents.length > 0 && (
        <section className="section">
          <div className="container">
            <SectionHead title={upcoming.length ? "Upcoming events" : "Recent engagements"} to="/events" linkLabel="All events" />
            <div className="event-grid">
              {shownEvents.map((e) => <EventCard key={e.id} event={e} past={!upcoming.length} />)}
            </div>
          </div>
        </section>
      )}

      {awards.length > 0 && (
        <section className="section">
          <div className="container">
            <SectionHead title="Awards and honours" to="/awards" linkLabel="All awards" />
            <div className="award-grid">{awards.slice(0, 4).map((a) => <AwardCard key={a.id} award={a} />)}</div>
          </div>
        </section>
      )}

      {photos.length > 0 && (
        <section className="section">
          <div className="container">
            <SectionHead title="In the field" to="/gallery" linkLabel="Photos and videos" />
            <div className="mosaic">
              {photos.map((g, k) => (
                <Link key={g.id} to="/gallery" className={k === 0 ? "big" : ""} aria-label={g.caption || "Gallery photo"}>
                  <Photo src={g.image} label="" tone={k} alt={g.caption} />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBand />
    </>
  );
}

export default Home;
