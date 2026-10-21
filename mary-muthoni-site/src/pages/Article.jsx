import { Link, useParams } from "react-router-dom";
import Seo from "../components/Seo";
import Photo from "../components/Photo";
import VideoPlayer from "../components/VideoPlayer";
import { CtaBand, NewsRow } from "../components/Blocks";
import { useContent } from "../lib/contentContext";
import { formatDate, paragraphs } from "../lib/format";
import NotFound from "./NotFound";

function Article() {
  const { slug } = useParams();
  const { news, projects, ready } = useContent();
  const n = news.find((x) => x.slug === slug);
  if (!n) return ready ? <NotFound /> : <p className="container section-top">Loading...</p>;

  const relProjects = (n.relatedProjects || []).map((s) => projects.find((p) => p.slug === s)).filter(Boolean);
  const relNews = (n.relatedNews || []).map((s) => news.find((x) => x.slug === s)).filter(Boolean);
  const links = (n.relatedLinks || []).filter((l) => l.url);
  const latest = news.filter((x) => x.id !== n.id && !relNews.includes(x)).slice(0, 3);

  return (
    <>
      <Seo title={n.title} path={`/news/${n.slug}`} description={n.summary} image={n.image} />
      <article>
        <header className="page-head">
          <div className="container narrow-col">
            <Link to="/news" className="back-link">&larr; All news</Link>
            <div className="eyebrow mt">{[formatDate(n.date), n.category].filter(Boolean).join(" · ").toUpperCase()}</div>
            <h1 className="article-title">{n.title}</h1>
            <p className="page-intro">{n.summary}</p>
          </div>
        </header>

        <div className="container narrow-col pt-md">
          {n.videoUrl
            ? <VideoPlayer url={n.videoUrl} poster={n.image} title={n.title} />
            : <Photo src={n.image} label="STORY PHOTO" tone={1} className="ratio-16-9" alt="" />}
        </div>

        <div className="container article-grid section-top-sm">
          <div className="article-body">
            {paragraphs(n.body).map((para, i) => <p key={i}>{para}</p>)}
            {n.sourceUrl && (
              <p className="source">Source: <a href={n.sourceUrl} target="_blank" rel="noopener noreferrer">{n.sourceName || "original article"} &#8599;</a></p>
            )}
          </div>
          {(relProjects.length > 0 || relNews.length > 0 || links.length > 0) && (
            <aside className="related-box" aria-label="Related">
              <div className="label">RELATED</div>
              {relProjects.map((p) => <Link key={p.id} to={`/projects/${p.slug}`} className="related-item"><span className="kicker">PROJECT</span>{p.title}</Link>)}
              {relNews.map((x) => <Link key={x.id} to={`/news/${x.slug}`} className="related-item"><span className="kicker">EARLIER STORY</span>{x.title}</Link>)}
              {links.map((l) => <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" className="related-item"><span className="kicker">ELSEWHERE</span>{l.label || l.url} &#8599;</a>)}
            </aside>
          )}
        </div>
      </article>

      {latest.length > 0 && (
        <section>
          <div className="container section-top">
            <h2 className="h-mid">More news</h2>
            <div className="news-list three">{latest.map((x, i) => <NewsRow key={x.id} item={x} index={i} />)}</div>
          </div>
        </section>
      )}

      <CtaBand />
    </>
  );
}

export default Article;
