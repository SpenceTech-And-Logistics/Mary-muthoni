/* A real photo when one exists, otherwise the striped placeholder from the design. */
const TONES = ["teal", "slate", "sage", "sand", "mist"];

function Photo({ src, label = "PHOTO", alt = "", className = "", tone = 0, children }) {
  const t = TONES[Math.abs(tone) % TONES.length];
  if (src) {
    return (
      <div className={`photo ${className}`}>
        <img src={src} alt={alt} loading="lazy" decoding="async" />
        {children}
      </div>
    );
  }
  return (
    <div className={`photo stripes-${t} ${className}`} role="img" aria-label={alt || `Placeholder: ${label.toLowerCase()}`}>
      {label && <span className="photo-label">[{label}]</span>}
      {children}
    </div>
  );
}

export default Photo;
