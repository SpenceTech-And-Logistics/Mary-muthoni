/*
  One video field everywhere: paste a YouTube link, a Vimeo link,
  a Facebook video link or a direct .mp4 address. This works out how to play it.
*/
export function parseVideo(url) {
  const u = String(url || "").trim();
  if (!u) return null;
  let m = u.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/);
  if (m) {
    return { type: "embed", embed: `https://www.youtube-nocookie.com/embed/${m[1]}?autoplay=1&rel=0`, thumb: `https://i.ytimg.com/vi/${m[1]}/hqdefault.jpg` };
  }
  m = u.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (m) return { type: "embed", embed: `https://player.vimeo.com/video/${m[1]}?autoplay=1`, thumb: "" };
  if (/facebook\.com\/.+\/videos\/|fb\.watch\//.test(u)) {
    return { type: "embed", embed: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(u)}&autoplay=1`, thumb: "" };
  }
  if (/\.(mp4|webm|ogg)(\?|$)/i.test(u)) return { type: "file", src: u, thumb: "" };
  return { type: "link", href: u, thumb: "" };
}
