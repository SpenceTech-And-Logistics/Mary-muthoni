import Seo from "../components/Seo";
import Photo from "../components/Photo";
import { CtaBand } from "../components/Blocks";
import { useContent } from "../lib/contentContext";

function Profile() {
  const { settings, fullName, positions } = useContent();
  const boards = positions.filter((p) => p.kind === "Boards and committees");
  return (
    <>
      <Seo title="Profile" path="/profile" description={settings.profileSummary} />
      <section className="page-head">
        <div className="container">
          <div className="eyebrow">PROFILE</div>
          <h1 className="narrow">{settings.profileHeading}</h1>
        </div>
      </section>

      <section>
        <div className="container profile-grid">
          <div className="profile-side">
            <Photo src={settings.heroImage} label="PORTRAIT PHOTO" tone={4} className="ratio-4-5" alt={`Portrait of ${fullName}`} />
            <dl className="kv">
              <div><dt>CURRENT OFFICE</dt><dd>{settings.role}</dd></div>
              <div><dt>AGENCY</dt><dd>{settings.agency}</dd></div>
              {settings.alsoServing && <div><dt>ALSO</dt><dd>{settings.alsoServing}</dd></div>}
              <div><dt>IN SENIOR PUBLIC OFFICE SINCE</dt><dd>{settings.inServiceSince}</dd></div>
              <div><dt>BASED IN</dt><dd>{settings.basedIn}</dd></div>
            </dl>
          </div>
          <div className="profile-main">
            <p className="profile-summary">{settings.profileSummary}</p>
            {settings.bio.map((para, i) => <p key={i} className="body-lg">{para}</p>)}

            <h2 className="h-sub">Education and training</h2>
            <div className="rule-list">
              {settings.education.map((e, i) => (
                <div key={i} className="edu-row">
                  <div className="edu-year">{e.year || "—"}</div>
                  <div><div className="strong">{e.what}</div><div className="muted">{e.where}</div></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {settings.focus.length > 0 && (
        <section className="band-ink mt-xl">
          <div className="container section-pad">
            <div className="eyebrow amber">AREAS OF EXPERTISE</div>
            <h2>Where the work has focused</h2>
            <div className="focus-grid">
              {settings.focus.map((f, i) => (
                <div key={i} className="focus-card">
                  <div className="focus-num">{String(i + 1).padStart(2, "0")}</div>
                  <div className="focus-title">{f.title}</div>
                  <p>{f.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section>
        <div className="container two-col section-top">
          <div>
            <h2 className="h-mid">Boards and committees</h2>
            <div className="rule-list">
              {boards.map((b) => (
                <div key={b.id} className="rule-item"><div className="strong">{b.org}</div><div className="muted small">{[b.title, b.years].filter(Boolean).join(" · ")}</div></div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="h-mid">Professional memberships</h2>
            <div className="rule-list">
              {settings.memberships.map((m, i) => (
                <div key={i} className="rule-item"><div className="strong">{m.body}</div><div className="muted small">{m.detail}</div></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {settings.quote && (
        <section>
          <div className="container section-top">
            <blockquote className="pull-quote">
              <p>&ldquo;{settings.quote}&rdquo;</p>
              <footer>{fullName}{settings.quoteBy && <span> &middot; {settings.quoteBy}</span>}</footer>
            </blockquote>
          </div>
        </section>
      )}

      <CtaBand title="See the work behind the profile." to="/projects" label="Explore projects" />
    </>
  );
}

export default Profile;
