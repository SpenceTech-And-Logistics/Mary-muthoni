import { Link, useParams } from "react-router-dom";
import Seo from "../components/Seo";
import Photo from "../components/Photo";
import VideoPlayer from "../components/VideoPlayer";
import { CtaBand, NewsRow, ProjectCard } from "../components/Blocks";
import { useContent } from "../lib/contentContext";
import { paragraphs } from "../lib/format";
import NotFound from "./NotFound";

function ProjectDetail() {
  const { slug } = useParams();
  const { projects, news, ready } = useContent();
  const p = projects.find((x) => x.slug === slug);
  if (!p) return ready ? <NotFound /> : <p className="container section-top">Loading...</p>;

  const stories = news.filter((n) => (n.relatedProjects || []).includes(p.slug));
  const more = projects.filter((x) => x.id !== p.id && x.sector === p.sector).concat(projects.filter((x) => x.id !== p.id && x.sector !== p.sector)).slice(0, 3);
  const facts = [["SECTOR", p.sector], ["PERIOD", p.year], ["WHERE", p.place], ["STATUS", p.status], ["BUDGET", p.budget]].filter(([, v]) => v);

  return (
    <>
      <Seo title={p.title} path={`/projects/${p.slug}`} description={p.summary} image={p.image} />
      <section className="page-head">
        <div className="container">
          <Link to="/projects" className="back-link">&larr; All projects</Link>
          <div className="eyebrow mt">{[p.sector, p.year].filter(Boolean).join(" · ").toUpperCase()}</div>
          <h1 className="narrow">{p.title}</h1>
          <p className="page-intro">{p.summary}</p>
        </div>
      </section>

      <section>
        <div className="container pt-md">
          <Photo src={p.image} label="PROJECT PHOTO" tone={1} className="detail-hero" alt={p.title} />
        </div>
      </section>

      <section>
        <div className="container detail-grid section-top-sm">
          <aside className="detail-side">
            <dl className="kv">{facts.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
          </aside>
          <div className="detail-main">
            {paragraphs(p.body).map((para, i) => <p key={i} className="body-lg">{para}</p>)}
          </div>
        </div>
      </section>

      {p.outcomes?.length > 0 && (
        <section className="band-ink mt-xl">
          <div className="container section-pad">
            <div className="eyebrow amber">OUTCOMES</div>
            <h2>What changed</h2>
            <div className="outcome-grid">
              {p.outcomes.map((o) => <div key={o.label}><div className="num">{o.value}</div><div className="lbl">{o.label}</div></div>)}
            </div>
          </div>
        </section>
      )}

      {p.videoUrl && (
        <section>
          <div className="container section-top narrow-col">
            <div className="eyebrow">WATCH</div>
            <h2 className="h-mid mb">On the ground</h2>
            <VideoPlayer url={p.videoUrl} poster={p.image} title={p.title} />
          </div>
        </section>
      )}

      {stories.length > 0 && (
        <section>
          <div className="container section-top">
            <h2 className="h-mid">Related news</h2>
            <div className="news-list two">{stories.map((n, i) => <NewsRow key={n.id} item={n} index={i} />)}</div>
          </div>
        </section>
      )}

      {more.length > 0 && (
        <section>
          <div className="container section-top">
            <h2 className="h-mid mb">More projects</h2>
            <div className="project-grid">{more.map((x, i) => <ProjectCard key={x.id} project={x} index={i + 2} />)}</div>
          </div>
        </section>
      )}

      <CtaBand />
    </>
  );
}

export default ProjectDetail;
