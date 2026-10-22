import { useState } from "react";
import { compressImage } from "../../lib/image";

/* Pasted links must be a web address of an image (https://...). */
const isImageLink = (url) => /^https:\/\/\S+$/i.test(String(url || "").trim());

export function LinkAdder({ onAdd, label = "Use link" }) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const add = () => {
    if (!isImageLink(url)) { setError("Paste a full image address starting with https://"); return; }
    setError("");
    onAdd(url.trim());
    setUrl("");
  };
  return (
    <div className="link-adder">
      <input type="url" placeholder="or paste an image link (https://...)" value={url}
        onChange={(e) => setUrl(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }} />
      <button type="button" className="admin-btn" onClick={add}>{label}</button>
      {error && <span className="admin-error">{error}</span>}
    </div>
  );
}

function ImageField({ label, value, onChange, maxSide }) {
  const [error, setError] = useState("");
  async function pick(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      setError("");
      onChange(await compressImage(file, maxSide));
    } catch (err) {
      setError(err.message);
    }
  }
  return (
    <div className="admin-field">
      <span className="admin-label">{label}</span>
      <div className="img-field">
        {value ? <img src={value} alt="" /> : <div className="img-empty">No photo</div>}
        <div className="img-actions">
          <label className="admin-btn">
            {value ? "Replace photo" : "Choose photo"}
            <input type="file" accept="image/*" onChange={pick} hidden />
          </label>
          {value && <button type="button" className="admin-btn danger" onClick={() => onChange("")}>Remove</button>}
        </div>
      </div>
      <LinkAdder onAdd={onChange} />
      {error && <p className="admin-error">{error}</p>}
    </div>
  );
}

export default ImageField;
