import { useState } from "react";
import { compressImage } from "../../lib/image";
import { LinkAdder } from "./ImageField";

/*
  Several photos for one project: upload many at once or paste links,
  add a caption to each, reorder with the arrows. Each photo also shows
  in the public Gallery, linked back to the project.
*/
function PhotosField({ label, hint, value, onChange, maxSide = 1200 }) {
  const photos = value || [];
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");

  const update = (i, patch) => onChange(photos.map((p, n) => (n === i ? { ...p, ...patch } : p)));
  const remove = (i) => onChange(photos.filter((_, n) => n !== i));
  const move = (i, d) => {
    const j = i + d;
    if (j < 0 || j >= photos.length) return;
    const list = [...photos];
    [list[i], list[j]] = [list[j], list[i]];
    onChange(list);
  };

  async function pick(e) {
    const files = [...(e.target.files || [])];
    e.target.value = "";
    if (!files.length) return;
    setError("");
    const added = [];
    try {
      for (let n = 0; n < files.length; n++) {
        setBusy(`Preparing ${n + 1} of ${files.length}...`);
        added.push({ src: await compressImage(files[n], maxSide, 0.72), caption: "" });
      }
    } catch (err) {
      setError(err.message);
    }
    onChange([...photos, ...added]);
    setBusy("");
  }

  return (
    <div className="admin-field wide">
      <span className="admin-label">{label}</span>
      {hint && <span className="admin-small">{hint}</span>}
      {photos.length > 0 && (
        <ul className="photo-set">
          {photos.map((p, i) => (
            <li key={`${i}-${p.src.slice(-24)}`}>
              <img src={p.src} alt="" />
              <input value={p.caption || ""} maxLength={160} placeholder="Caption (optional)" onChange={(e) => update(i, { caption: e.target.value })} />
              <div className="photo-set-actions">
                <button type="button" className="admin-btn icon" aria-label="Move earlier" disabled={i === 0} onClick={() => move(i, -1)}>&larr;</button>
                <button type="button" className="admin-btn icon" aria-label="Move later" disabled={i === photos.length - 1} onClick={() => move(i, 1)}>&rarr;</button>
                <button type="button" className="admin-btn danger" onClick={() => remove(i)}>Remove</button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="admin-actions">
        <label className="admin-btn" aria-disabled={Boolean(busy)}>
          {busy || (photos.length ? "Add more photos" : "Choose photos")}
          <input type="file" accept="image/*" multiple hidden disabled={Boolean(busy)} onChange={pick} />
        </label>
      </div>
      <LinkAdder label="Add link" onAdd={(src) => onChange([...photos, { src, caption: "" }])} />
      {error && <p className="admin-error">{error}</p>}
    </div>
  );
}

export default PhotosField;
