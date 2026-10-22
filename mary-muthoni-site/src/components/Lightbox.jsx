import { useEffect } from "react";
import { Link } from "react-router-dom";
import Photo from "./Photo";
import VideoPlayer from "./VideoPlayer";

function Lightbox({ items, index, onClose, onMove, hideSource = false }) {
  const item = items[index];
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onMove(1);
      if (e.key === "ArrowLeft") onMove(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, onMove]);
  if (!item) return null;
  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={item.kind === "video" ? "Video viewer" : "Photo viewer"} onClick={onClose}>
      <figure onClick={(e) => e.stopPropagation()}>
        {item.kind === "video"
          ? <VideoPlayer key={item.id} url={item.videoUrl} poster={item.image} title={item.caption} />
          : <Photo src={item.image} label="PHOTO" alt={item.caption} tone={index} className="lightbox-photo" />}
        <figcaption>
          <span className="lb-text">
            {item.caption}
            {item.source && !hideSource && <Link to={item.source.to} className="lb-source" onClick={onClose}>{item.source.type === "page" ? "Open" : `Open the ${item.source.type}`}: {item.source.label} &rarr;</Link>}
          </span>
          <span>{index + 1} / {items.length}</span>
        </figcaption>
      </figure>
      <button type="button" className="lightbox-btn close" onClick={onClose} aria-label="Close">&times;</button>
      {items.length > 1 && (
        <>
          <button type="button" className="lightbox-btn prev" onClick={(e) => { e.stopPropagation(); onMove(-1); }} aria-label="Previous">&larr;</button>
          <button type="button" className="lightbox-btn next" onClick={(e) => { e.stopPropagation(); onMove(1); }} aria-label="Next">&rarr;</button>
        </>
      )}
    </div>
  );
}

export default Lightbox;
