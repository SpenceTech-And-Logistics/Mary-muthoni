import Seo from "../components/Seo";
import Photo from "../components/Photo";
import { CtaBand, PageHead } from "../components/Blocks";
import { useContent } from "../lib/contentContext";

function Awards() {
  const { awards, displayName } = useContent();
  const [top, ...rest] = awards.filter((a) => a.citation);
  const others = awards.filter((a) => a !== top);

  return (
    <>
      <Seo title="Awards and honours" path="/awards" description={`National honours and awards conferred on ${displayName}.`} />
      <PageHead eyebrow="AWARDS" title="Awards and honours.">
        <p className="page-intro">National honours conferred by the Head of State, and recognition from public, business and international bodies.</p>
      </PageHead>

      {top && (
        <section>
          <div className="container pt-md">
            <div className="honour">
              <Photo src={top.image} label="" tone={3} className="honour-photo" alt={top.name} />
              <div className="honour-body">
                <div className="honour-year">{top.year}</div>
                <h2>{top.name}</h2>
                {top.body && <div className="kicker">{top.body.toUpperCase()}</div>}
                <p>{top.citation}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      <section>
        <div className="container section-top-sm">
          <div className="award-list">
            {others.map((a) => (
              <article key={a.id} className={`award-row ${rest.includes(a) ? "has-citation" : ""}`}>
                <div className="award-year">{a.year || "—"}</div>
                <div>
                  <h3 className="award-name">{a.name}</h3>
                  {a.body && <div className="muted small">{a.body}</div>}
                  {a.citation && <p className="small mt-xs">{a.citation}</p>}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}

export default Awards;
