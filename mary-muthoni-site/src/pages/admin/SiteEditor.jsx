import { useState } from "react";
import { useContent } from "../../lib/contentContext";
import { saveSettings } from "../../lib/store";
import ImageField from "./ImageField";

function Field({ label, hint, wide, children }) {
  return (
    <label className={`admin-field ${wide ? "wide" : ""}`}>
      <span className="admin-label">{label}</span>
      {children}
      {hint && <span className="admin-small">{hint}</span>}
    </label>
  );
}

/* A repeating group of small records (stats, education, focus areas, memberships). */
function ListEditor({ title, items, fields, blank, onChange, hint, max = 20 }) {
  const update = (i, key, value) => onChange(items.map((it, n) => (n === i ? { ...it, [key]: value } : it)));
  const move = (i, d) => {
    const list = [...items];
    const j = i + d;
    if (j < 0 || j >= list.length) return;
    [list[i], list[j]] = [list[j], list[i]];
    onChange(list);
  };
  return (
    <>
      {title && <h3 className="admin-sub">{title}</h3>}
      {hint && <p className="admin-small" style={{ marginBottom: 12 }}>{hint}</p>}
      {items.map((it, i) => (
        <fieldset className="admin-fieldset" key={i}>
          <div className="admin-grid">
            {fields.map(([key, label, opts = {}]) => (
              <Field key={key} label={label} wide={opts.wide}>
                {opts.textarea
                  ? <textarea rows={opts.rows || 3} value={it[key] || ""} maxLength={opts.max || 600} onChange={(e) => update(i, key, e.target.value)} />
                  : <input value={it[key] || ""} maxLength={opts.max || 160} onChange={(e) => update(i, key, e.target.value)} />}
              </Field>
            ))}
          </div>
          <div className="admin-actions">
            <button type="button" className="admin-btn icon" aria-label="Move up" disabled={i === 0} onClick={() => move(i, -1)}>&uarr;</button>
            <button type="button" className="admin-btn icon" aria-label="Move down" disabled={i === items.length - 1} onClick={() => move(i, 1)}>&darr;</button>
            <button type="button" className="admin-btn danger" onClick={() => onChange(items.filter((_, n) => n !== i))}>Remove</button>
          </div>
        </fieldset>
      ))}
      {items.length < max && <button type="button" className="admin-btn" onClick={() => onChange([...items, blank])}>+ Add</button>}
    </>
  );
}

function Editor({ initial }) {
  const [s, setS] = useState(() => structuredClone(initial));
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  const set = (key, value) => setS((cur) => ({ ...cur, [key]: value }));
  const setIn = (group, key, value) => setS((cur) => ({ ...cur, [group]: { ...cur[group], [key]: value } }));
  const text = (key, max = 160) => <input value={s[key] || ""} maxLength={max} onChange={(e) => set(key, e.target.value)} />;

  async function onSave(e) {
    e.preventDefault();
    setBusy(true);
    setStatus("");
    try {
      await saveSettings(s);
      setStatus("Saved. The public site is updated.");
    } catch {
      setStatus("Could not save. Check your connection and sign-in. A very large portrait can also be too big: try a smaller one.");
    }
    setBusy(false);
  }

  return (
    <form onSubmit={onSave}>
      <div className="admin-head sticky">
        <div><h1>Profile and settings</h1><p className="admin-small">Press Save all changes when you finish.</p></div>
        <div className="admin-actions">
          {status && <span className="admin-ok" role="status">{status}</span>}
          <button className="admin-btn primary" type="submit" disabled={busy}>{busy ? "Saving..." : "Save all changes"}</button>
        </div>
      </div>

      <div className="admin-panel">
        <h2>Name and office</h2>
        <div className="admin-grid">
          <Field label="Full name">{text("name", 80)}</Field>
          <Field label="Post-nominal letters" hint='e.g. "CBS, HSC"'>{text("postNominals", 40)}</Field>
          <Field label="Current position" hint='e.g. "Principal Secretary". Change it here when it changes.'>{text("role", 100)}</Field>
          <Field label="Ministry (short)" hint="Shown in the top strip and the hero.">{text("ministry", 100)}</Field>
          <Field label="State Department or agency (full)" wide>{text("agency", 200)}</Field>
          <Field label="Also serving as (optional)" wide>{text("alsoServing", 160)}</Field>
          <Field label="Based in">{text("basedIn", 60)}</Field>
          <Field label="In senior public office since">{text("inServiceSince", 20)}</Field>
          <Field label="Opening sentence" wide hint="Shown under her name on the home page and in Google results."><textarea rows={3} value={s.intro} onChange={(e) => set("intro", e.target.value)} maxLength={300} /></Field>
          <ImageField label="Portrait" value={s.heroImage} onChange={(v) => set("heroImage", v)} maxSide={1100} />
        </div>
      </div>

      <div className="admin-panel">
        <h2>Introduction video (home page)</h2>
        <p className="admin-small" style={{ marginBottom: 12 }}>Paste a YouTube, Vimeo or Facebook video link. Leave empty to use the first video in the Gallery.</p>
        <div className="admin-grid">
          <Field label="Video link" wide><input type="url" value={s.introVideo.url} onChange={(e) => setIn("introVideo", "url", e.target.value)} /></Field>
          <Field label="Title"><input value={s.introVideo.title} maxLength={120} onChange={(e) => setIn("introVideo", "title", e.target.value)} /></Field>
          <Field label="Caption under the video" hint="Title · Event · Date"><input value={s.introVideo.caption} maxLength={160} onChange={(e) => setIn("introVideo", "caption", e.target.value)} /></Field>
        </div>
      </div>

      <div className="admin-panel">
        <h2>Headline numbers (home page)</h2>
        <ListEditor items={s.stats} max={4} blank={{ value: "", label: "" }} onChange={(v) => set("stats", v)}
          fields={[["value", "Number", { max: 20 }], ["label", "What it counts", { max: 90 }]]} />
      </div>

      <div className="admin-panel">
        <h2>Profile page</h2>
        <div className="admin-grid">
          <Field label="Page heading" wide>{text("profileHeading", 120)}</Field>
          <Field label="Summary (large text)" wide><textarea rows={3} value={s.profileSummary} maxLength={500} onChange={(e) => set("profileSummary", e.target.value)} /></Field>
          <Field label="Biography" wide hint="Leave an empty line between paragraphs.">
            <textarea rows={12} value={s.bio.join("\n\n")} onChange={(e) => set("bio", e.target.value.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean))} />
          </Field>
          <Field label="Quote" wide hint="Leave empty to hide."><textarea rows={2} value={s.quote} maxLength={300} onChange={(e) => set("quote", e.target.value)} /></Field>
          <Field label="Where and when it was said" wide>{text("quoteBy", 200)}</Field>
          <Field label="Introduction on the Projects page" wide><textarea rows={2} value={s.projectsIntro} maxLength={300} onChange={(e) => set("projectsIntro", e.target.value)} /></Field>
        </div>
        <ListEditor title="Education and training" items={s.education} blank={{ year: "", what: "", where: "" }} onChange={(v) => set("education", v)}
          fields={[["year", "Year", { max: 20 }], ["what", "Qualification", { max: 120 }], ["where", "Institution", { wide: true, max: 140 }]]} />
        <ListEditor title="Areas of expertise" items={s.focus} max={6} blank={{ title: "", text: "" }} onChange={(v) => set("focus", v)}
          fields={[["title", "Title", { wide: true, max: 90 }], ["text", "One or two lines", { wide: true, textarea: true, max: 300 }]]} />
        <ListEditor title="Professional memberships" hint="Boards and committees come from the Positions section." items={s.memberships} blank={{ body: "", detail: "" }} onChange={(v) => set("memberships", v)}
          fields={[["body", "Organisation", { max: 140 }], ["detail", "Membership or role", { max: 100 }]]} />
      </div>

      <div className="admin-panel">
        <h2>Contact and social links</h2>
        <div className="admin-grid">
          <Field label="Office address" wide><input value={s.contact.address} onChange={(e) => setIn("contact", "address", e.target.value)} maxLength={200} /></Field>
          <Field label="Office email"><input type="email" value={s.contact.email} onChange={(e) => setIn("contact", "email", e.target.value)} maxLength={120} /></Field>
          <Field label="Office phone"><input value={s.contact.phone} onChange={(e) => setIn("contact", "phone", e.target.value)} maxLength={40} /></Field>
          <Field label="Office hours" wide><input value={s.contact.hours} onChange={(e) => setIn("contact", "hours", e.target.value)} maxLength={120} /></Field>
          <Field label="Line at the top of the Contact page" wide><input value={s.contact.mediaNote} onChange={(e) => setIn("contact", "mediaNote", e.target.value)} maxLength={200} /></Field>
          {[["x", "X (Twitter)"], ["facebook", "Facebook"], ["instagram", "Instagram"], ["linkedin", "LinkedIn"], ["youtube", "YouTube"]].map(([k, label]) => (
            <Field key={k} label={`${label} link`} hint="Leave empty to hide the icon.">
              <input type="url" value={s.socials[k] || ""} onChange={(e) => setIn("socials", k, e.target.value)} />
            </Field>
          ))}
        </div>
      </div>

      <div className="admin-panel">
        <h2>Gallery</h2>
        <label className="admin-check">
          <input type="checkbox" checked={s.galleryIncludeLinked !== false} onChange={(e) => set("galleryIncludeLinked", e.target.checked)} />
          <span>Also show photos and videos from projects, news stories and awards in the Gallery, each linking back to its page</span>
        </label>
      </div>

      <div className="admin-panel">
        <h2>Colours</h2>
        <p className="admin-small">The main colour should stay dark so light text on it stays readable.</p>
        <div className="admin-grid">
          <Field label="Main (navy)"><input type="color" value={s.theme.primary} onChange={(e) => setIn("theme", "primary", e.target.value)} className="color-input" /></Field>
          <Field label="Accent (amber)"><input type="color" value={s.theme.accent} onChange={(e) => setIn("theme", "accent", e.target.value)} className="color-input" /></Field>
          <Field label="Secondary (teal)"><input type="color" value={s.theme.teal || "#0F5C63"} onChange={(e) => setIn("theme", "teal", e.target.value)} className="color-input" /></Field>
        </div>
      </div>
    </form>
  );
}

function SiteEditor() {
  const { settings, ready } = useContent();
  if (!ready) return <p className="admin-small">Loading...</p>;
  return <Editor initial={settings} />;
}

export default SiteEditor;
