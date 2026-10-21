import { useState } from "react";
import { parseVideo } from "../lib/video";

const Play = ({ size = 30, fill = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" fill={fill} /></svg>
);

export { Play };

/*
  Shared video player used on Home, project pages, news stories and the gallery.
  Nothing loads from YouTube or Facebook until the visitor presses play.
*/
function VideoPlayer({ url, poster = "", title = "Video", tone = "teal" }) {
  const [playing, setPlaying] = useState(false);
  const v = parseVideo(url);
  const thumb = poster || v?.thumb;

  if (v && playing && v.type === "embed") {
    return (
      <div className="video">
        <iframe src={v.embed} title={title} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen />
      </div>
    );
  }
  if (v && v.type === "file") {
    return (
      <div className="video">
        <video src={v.src} poster={thumb || undefined} controls preload="metadata" aria-label={title} />
      </div>
    );
  }

  const placeholder = !v;
  const inner = (
    <>
      {thumb && <img src={thumb} alt="" loading="lazy" />}
      {placeholder && <span className="video-tag">[VIDEO]</span>}
      <span className="video-play"><Play fill="var(--ink)" /></span>
      <span className="video-bar">
        <span>{placeholder ? "Video coming soon" : title}</span>
      </span>
    </>
  );

  if (v?.type === "link") {
    return (
      <a className={`video video-cover stripes-${tone}`} href={v.href} target="_blank" rel="noopener noreferrer" aria-label={`Watch: ${title} (opens in a new tab)`}>{inner}</a>
    );
  }
  return (
    <button
      type="button"
      className={`video video-cover stripes-${tone}`}
      onClick={() => v && setPlaying(true)}
      disabled={placeholder}
      aria-label={placeholder ? "Video placeholder" : `Play: ${title}`}
    >
      {inner}
    </button>
  );
}

export default VideoPlayer;
