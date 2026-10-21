import Seo from "../components/Seo";
import { CtaBand, PageHead } from "../components/Blocks";
import { useContent } from "../lib/contentContext";
import { POSITION_KINDS } from "../data/defaults";

function Positions() {
  const { positions, displayName } = useContent();
  const current = positions.filter((p) => p.current);
  const kinds = [...new Set([...POSITION_KINDS, ...positions.map((p) => p.kind).filter(Boolean)])];

  return (
    <>
      <Seo title="Positions held" path="/positions" description={`Public offices, board appointments and leadership roles held by ${displayName}.`} />
      <PageHead eyebrow="POSITIONS" title="Offices and appointments held.">
        <p className="page-intro">Public office, board and committee appointments, and institutional leadership, newest first.</p>
      </PageHead>

      {current.length > 0 && (
        <section>
          <div className="container pt-md">
            <div className="current-grid">
              {current.map((p) => (
                <article key={p.id} className="current-card">
                  <span className="chip-amber">CURRENT</span>
                  <div className="kicker amber mt">{(p.years || "").toUpperCase()}</div>
                  <h2>{p.title}</h2>
                  <div className="current-org">{p.org}</div>
                  {p.mandate && <p>{p.mandate}</p>}
                  {p.highlights?.length > 0 && <ul className="ticks light">{p.highlights.map((h) => <li key={h}>{h}</li>)}</ul>}
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {kinds.map((kind) => {
        const list = positions.filter((p) => p.kind === kind && !p.current);
        if (!list.length) return null;
        return (
          <section key={kind}>
            <div className="container section-top">
              <h2 className="h-mid">{kind}</h2>
              <ol className="timeline">
                {list.map((p) => (
                  <li key={p.id}>
                    <div className="tl-years">{p.years || "—"}</div>
                    <div className="tl-body">
                      <div className="tl-title">{p.title}</div>
                      <div className="muted">{p.org}</div>
                      {p.mandate && <p className="small mt-xs">{p.mandate}</p>}
                      {p.highlights?.length > 0 && <ul className="ticks">{p.highlights.map((h) => <li key={h}>{h}</li>)}</ul>}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        );
      })}

      <CtaBand title="See the work behind each office." to="/projects" label="Explore projects" />
    </>
  );
}

export default Positions;
