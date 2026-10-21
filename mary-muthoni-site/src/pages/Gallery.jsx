import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Seo from "../components/Seo";
import Photo from "../components/Photo";
import Lightbox from "../components/Lightbox";
import { Play } from "../components/VideoPlayer";
import { CtaBand, Empty, PageHead } from "../components/Blocks";
import { useContent } from "../lib/contentContext";
import { parseVideo } from "../lib/video";

function Gallery() {
  const { displayName, gallery } = useContent();
  const [params, setParams] = useSearchParams();
  const tab = params.get("tab") === "videos" ? "videos" : "photos";
  const [album, setAlbum] = useState("All");
  const [open, setOpen] = useState(-1);

  const items = gallery.filter((g) => (tab === "videos" ? g.kind === "video" : g.kind !== "video"));
  const albums = useMemo(() => ["All", ...new Set(items.map((g) => g.album).filter(Boolean))], [items]);
  const shown = album === "All" ? items : items.filter((g) => g.album === album);
  const move = useCallback((d) => setOpen((i) => (i + d + shown.length) % shown.length), [shown.length]);
  const switchTab = (t) => { setParams(t === "videos" ? { tab: "videos" } : {}); setAlbum("All"); setOpen(-1); };
  const counts = { photos: gallery.filter((g) => g.kind !== "video").length, videos: gallery.filter((g) => g.kind === "video").length };

  return (
    <>
      <Seo title="Gallery" path="/gallery" description={`Photos and videos of ${displayName} at work.`} />
      <PageHead eyebrow="GALLERY" title="Photos and videos." />
      <section>
        <div className="container">
          <div className="tabs" role="tablist" aria-label="Gallery">
            {["photos", "videos"].map((t) => (
              <button key={t} type="button" role="tab" aria-selected={tab === t} className={tab === t ? "is-active" : ""} onClick={() => switchTab(t)}>
                {t === "photos" ? "Photos" : "Videos"} <span className="count">{counts[t]}</span>
              </button>
            ))}
          </div>
          {albums.length > 2 && (
            <div className="chips mb" role="group" aria-label="Filter by album">
              {albums.map((a) => (
                <button key={a} type="button" className={`filter ${album === a ? "is-active" : ""}`} aria-pressed={album === a} onClick={() => setAlbum(a)}>{a}</button>
              ))}
            </div>
          )}
          {shown.length === 0 && <Empty>{tab === "videos" ? "Videos will appear here soon." : "Photos will appear here soon."}</Empty>}
          <div className={tab === "videos" ? "video-grid" : "photo-grid"} key={tab + album}>
            {shown.map((g, i) => {
              const thumb = g.image || (g.kind === "video" ? parseVideo(g.videoUrl)?.thumb : "");
              return (
                <button type="button" className="tile" key={g.id} onClick={() => setOpen(i)} aria-label={`Open ${g.kind === "video" ? "video" : "photo"}: ${g.caption || "untitled"}`}>
                  <Photo src={thumb} label="" tone={i} className={tab === "videos" ? "ratio-16-9" : ""} alt={g.caption}>
                    {g.kind === "video" && <span className="tile-play"><Play size={26} fill="var(--ink)" /></span>}
                  </Photo>
                  <span className="tile-cap">{g.caption}{g.album && <em>{g.album}</em>}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>
      {open >= 0 && shown[open] && <Lightbox items={shown} index={open} onClose={() => setOpen(-1)} onMove={move} />}
      <CtaBand />
    </>
  );
}

export default Gallery;
