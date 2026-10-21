import { useState } from "react";
import { useContent } from "../../lib/contentContext";
import { removeItem, saveItem, saveOrder, seedSamples } from "../../lib/store";
import { compressImage } from "../../lib/image";
import { slugify } from "../../lib/format";
import ImageField from "./ImageField";

/*
  A generic add / edit / delete / reorder screen, used for projects, positions,
  awards, news, events and the gallery. Each screen only describes its fields.

  Field types: text (default), textarea, date, url, select, combo, checkbox, image,
  lines (one per line -> list), pairs (one "A | B" per line -> list of objects),
  refs (tick boxes pointing at projects or stories by their web address).
*/

const toLines = (text) => text.split("\n").map((s) => s.trim()).filter(Boolean);

function pairsToText(list, [a, b]) {
  return (list || []).map((o) => [o[a], o[b]].filter(Boolean).join(" | ")).join("\n");
}
function textToPairs(text, [a, b]) {
  return toLines(text).map((line) => {
    const [x, ...rest] = line.split("|");
    return { [a]: x.trim(), [b]: rest.join("|").trim() };
  });
}

function PairsInput({ field, value, onChange }) {
  // Keep the raw text while typing so a half-typed "|" is not lost.
  const [text, setText] = useState(() => pairsToText(value, field.keys));
  return (
    <textarea rows={4} value={text} placeholder={field.placeholder}
      onChange={(e) => { setText(e.target.value); onChange(textToPairs(e.target.value, field.keys)); }} />
  );
}

function LinesInput({ value, onChange, placeholder }) {
  const [text, setText] = useState(() => (value || []).join("\n"));
  return <textarea rows={4} value={text} placeholder={placeholder} onChange={(e) => { setText(e.target.value); onChange(toLines(e.target.value)); }} />;
}

function RefsInput({ field, value, onChange, content, selfSlug }) {
  const options = (content[field.from] || []).filter((o) => o.slug !== selfSlug);
  const chosen = new Set(value || []);
  const toggle = (slug) => {
    const next = new Set(chosen);
    if (next.has(slug)) next.delete(slug); else next.add(slug);
    onChange([...next]);
  };
  if (!options.length) return <span className="admin-small">Nothing to link yet.</span>;
  return (
    <div className="refs">
      {options.map((o) => (
        <label key={o.id} className="ref"><input type="checkbox" checked={chosen.has(o.slug)} onChange={() => toggle(o.slug)} /><span>{o.title}</span></label>
      ))}
    </div>
  );
}

function Crud({ name, title, intro, fields, describe, sortable = false, samples = [], singular = "item", bulk = null, slugFrom = null }) {
  const content = useContent();
  const items = content[name];
  const [editing, setEditing] = useState(null); // null | item object (id may be undefined)
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState("");

  const blank = () => Object.fromEntries(fields.map((f) => [f.key, f.default ?? (["lines", "pairs", "refs"].includes(f.type) ? [] : f.type === "checkbox" ? false : "")]));

  async function onSave(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const item = { ...editing };
      if (slugFrom) {
        // A stable web address: made from the title once, unique among the others.
        let slug = slugify(item.slug || item[slugFrom]);
        const taken = new Set(items.filter((i) => i.id !== item.id).map((i) => i.slug));
        for (let n = 2; taken.has(slug); n++) slug = `${slugify(item.slug || item[slugFrom])}-${n}`;
        item.slug = slug;
      }
      if (!item.id && sortable) {
        const lowest = Math.min(0, ...items.map((i) => i.order ?? 0));
        item.order = lowest - 1; // new items go to the top
      }
      await saveItem(name, item);
      setEditing(null);
    } catch {
      setError("Could not save. Check your connection and that you are signed in as an administrator. Very large photos can also be too big.");
    }
    setBusy(false);
  }

  async function onDelete(item) {
    if (!window.confirm(`Delete this ${singular}? This cannot be undone.`)) return;
    try {
      await removeItem(name, item.id);
    } catch {
      setError("Could not delete.");
    }
  }

  async function move(index, dir) {
    const ids = items.map((i) => i.id);
    const j = index + dir;
    if (j < 0 || j >= ids.length) return;
    [ids[index], ids[j]] = [ids[j], ids[index]];
    try {
      await saveOrder(name, ids);
    } catch {
      setError("Could not reorder.");
    }
  }

  // Bulk upload: pick many photos at once; each becomes its own record.
  async function onBulk(e) {
    const files = [...(e.target.files || [])];
    e.target.value = "";
    if (!files.length) return;
    setBusy(true);
    setError("");
    let done = 0;
    try {
      const lowest = Math.min(0, ...items.map((i) => i.order ?? 0));
      for (let n = 0; n < files.length; n++) {
        const image = await compressImage(files[n], bulk.maxSide || 1400);
        await saveItem(name, { ...bulk.defaults, image, order: lowest - files.length + n });
        done++;
        setProgress(`Uploaded ${done} of ${files.length}`);
      }
      setProgress(`Added ${done} photo${done === 1 ? "" : "s"}. Open each to add a caption.`);
    } catch (err) {
      setError(`Stopped after ${done} of ${files.length}: ${err.message || "could not save"}`);
    }
    setBusy(false);
  }

  const set = (key, value) => setEditing((cur) => ({ ...cur, [key]: value }));

  function input(f) {
    const v = editing[f.key];
    switch (f.type) {
      case "textarea":
        return <textarea rows={f.rows || 4} value={v ?? ""} required={f.required} maxLength={f.max || 6000} placeholder={f.placeholder} onChange={(e) => set(f.key, e.target.value)} />;
      case "select":
        return <select value={v ?? ""} onChange={(e) => set(f.key, e.target.value)}>{f.options.map((o) => <option key={o}>{o}</option>)}</select>;
      case "combo":
        return (
          <>
            <input list={`opts-${name}-${f.key}`} value={v ?? ""} required={f.required} maxLength={f.max || 60} onChange={(e) => set(f.key, e.target.value)} />
            <datalist id={`opts-${name}-${f.key}`}>{f.options.map((o) => <option key={o} value={o} />)}</datalist>
          </>
        );
      case "lines":
        return <LinesInput value={v} placeholder={f.placeholder} onChange={(val) => set(f.key, val)} />;
      case "pairs":
        return <PairsInput field={f} value={v} onChange={(val) => set(f.key, val)} />;
      case "refs":
        return <RefsInput field={f} value={v} content={content} selfSlug={editing.slug} onChange={(val) => set(f.key, val)} />;
      default:
        return <input type={f.type || "text"} value={v ?? ""} required={f.required} maxLength={f.max || 200} placeholder={f.placeholder} onChange={(e) => set(f.key, e.target.value)} />;
    }
  }

  return (
    <div>
      <div className="admin-head">
        <div>
          <h1>{title}</h1>
          {intro && <p className="admin-small">{intro}</p>}
        </div>
        {!editing && (
          <div className="admin-actions">
            {bulk && (
              <label className={`admin-btn ${busy ? "" : "primary"}`} aria-disabled={busy}>
                {busy ? "Uploading..." : "Upload several photos"}
                <input type="file" accept="image/*" multiple hidden disabled={busy} onChange={onBulk} />
              </label>
            )}
            <button className="admin-btn" onClick={() => setEditing(blank())}>+ Add {singular}</button>
          </div>
        )}
      </div>

      {error && <p className="admin-error" role="alert">{error}</p>}
      {progress && !error && <p className="admin-ok" role="status">{progress}</p>}

      {editing && (
        <form className="admin-panel" onSubmit={onSave} key={editing.id || "new"}>
          <h2>{editing.id ? `Edit ${singular}` : `New ${singular}`}</h2>
          <div className="admin-grid">
            {fields.map((f) => {
              if (f.showIf && !f.showIf(editing)) return null;
              if (f.type === "image") {
                return <ImageField key={f.key} label={f.label} value={editing[f.key]} onChange={(v) => set(f.key, v)} maxSide={f.maxSide} />;
              }
              if (f.type === "checkbox") {
                return (
                  <label key={f.key} className="admin-check">
                    <input type="checkbox" checked={Boolean(editing[f.key])} onChange={(e) => set(f.key, e.target.checked)} />
                    <span>{f.label}{f.hint && <span className="admin-small"> {f.hint}</span>}</span>
                  </label>
                );
              }
              return (
                <label key={f.key} className={`admin-field ${f.wide ? "wide" : ""}`}>
                  <span className="admin-label">{f.label}{f.required && " *"}</span>
                  {input(f)}
                  {f.hint && <span className="admin-small">{f.hint}</span>}
                </label>
              );
            })}
          </div>
          <div className="admin-actions">
            <button className="admin-btn primary" type="submit" disabled={busy}>{busy ? "Saving..." : "Save"}</button>
            <button className="admin-btn" type="button" onClick={() => setEditing(null)}>Cancel</button>
          </div>
        </form>
      )}

      {items.length === 0 && !editing && (
        <div className="admin-empty">
          <p>Nothing here yet.</p>
          {samples.length > 0 && (
            <button className="admin-btn" onClick={() => seedSamples(name, samples).catch(() => setError("Could not load the starting content."))}>Load the starting content</button>
          )}
        </div>
      )}

      <ul className="admin-list">
        {items.map((item, i) => {
          const { title: t, sub, image } = describe(item);
          return (
            <li key={item.id} className="admin-row">
              {image ? <img src={image} alt="" /> : <div className="row-thumb" />}
              <div className="row-main">
                <strong>{t}</strong>
                <span className="admin-small">{sub}</span>
              </div>
              <div className="row-actions">
                {sortable && (
                  <>
                    <button className="admin-btn icon" aria-label="Move up" disabled={i === 0} onClick={() => move(i, -1)}>&uarr;</button>
                    <button className="admin-btn icon" aria-label="Move down" disabled={i === items.length - 1} onClick={() => move(i, 1)}>&darr;</button>
                  </>
                )}
                <button className="admin-btn" onClick={() => setEditing({ ...blank(), ...item })}>Edit</button>
                <button className="admin-btn danger" onClick={() => onDelete(item)}>Delete</button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Crud;
