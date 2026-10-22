import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import Photo from "../components/Photo";
import { CtaBand, Empty, PageHead, ProjectCard } from "../components/Blocks";
import { useContent } from "../lib/contentContext";

const PER_PAGE = 6;

function Projects() {
  const { settings, projects, displayName } = useContent();
  const [sector, setSector] = useState("All");
  const [status, setStatus] = useState("Any");
  const [page, setPage] = useState(1);

  const sectors = useMemo(() => ["All", ...new Set(projects.map((p) => p.sector).filter(Boolean))], [projects]);
  const statuses = useMemo(() => ["Any", ...new Set(projects.map((p) => p.status).filter(Boolean))], [projects]);
  const filtered = projects.filter((p) => (sector === "All" || p.sector === sector) && (status === "Any" || p.status === status));
  const feature = filtered.find((p) => p.featured) || filtered[0];
  const grid = filtered.filter((p) => p !== feature);
  const pages = Math.max(1, Math.ceil(grid.length / PER_PAGE));
  const current = Math.min(page, pages);
  const shown = grid.slice((current - 1) * PER_PAGE, current * PER_PAGE);
  const choose = (fn) => (v) => { fn(v); setPage(1); };

  return (
    <>
      <Seo title="Projects" path="/projects" description={`Programmes and projects led by ${displayName}.`} />
      <PageHead eyebrow="PROJECTS" title="Programmes and projects delivered.">
        <p className="page-intro">{settings.projectsIntro}</p>
      </PageHead>

      <section>
        <div className="container">
          <div className="filter-bar">
            <div className="chips" role="group" aria-label="Filter by sector">
              {sectors.map((s) => (
                <button key={s} type="button" className={`filter ${sector === s ? "is-active" : ""}`} aria-pressed={sector === s} onClick={() => choose(setSector)(s)}>{s}</button>
              ))}
            </div>
            <label className="select-wrap">
              <span className="sr-only">Status</span>
              <select value={status} onChange={(e) => choose(setStatus)(e.target.value)}>
                {statuses.map((s) => <option key={s} value={s}>Status: {s}</option>)}
              </select>
            </label>
          </div>
        </div>
      </section>

      {feature && current === 1 && (
        <section>
          <div className="container pt-md">
            <Link to={`/projects/${feature.slug}`} className="feature-card">
              <Photo src={feature.cover} label="" tone={0} className="feature-photo"><span className="chip-amber abs-tl">FEATURED</span></Photo>
              <div className="feature-body">
                <div className="kicker amber">{[feature.sector, feature.year, feature.place].filter(Boolean).join(" · ").toUpperCase()}</div>
                <h2>{feature.title}</h2>
                <p>{feature.summary}</p>
                <span className="amber-link">View the project &rarr;</span>
              </div>
            </Link>
          </div>
        </section>
      )}

      <section>
        <div className="container pt-sm">
          {filtered.length === 0 && <Empty>No projects match these filters.</Empty>}
          <div className="project-grid">
            {shown.map((p, i) => <ProjectCard key={p.id} project={p} index={i} />)}
          </div>
          {pages > 1 && (
            <nav className="pager" aria-label="Pages">
              {Array.from({ length: pages }, (_, k) => (
                <button key={k} type="button" className={current === k + 1 ? "is-active" : ""} aria-current={current === k + 1 ? "page" : undefined} onClick={() => setPage(k + 1)}>{k + 1}</button>
              ))}
              <button type="button" disabled={current === pages} onClick={() => setPage(current + 1)} aria-label="Next page">&rarr;</button>
            </nav>
          )}
        </div>
      </section>

      <CtaBand />
    </>
  );
}

export default Projects;
