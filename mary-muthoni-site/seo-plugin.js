import fs from "node:fs";
import path from "node:path";
import { loadEnv } from "vite";
import site from "./site.config.js";
import { DEFAULT_SETTINGS, SAMPLE_NEWS, SAMPLE_PROJECTS } from "./src/data/defaults.js";

/*
  After the build, writes one HTML file per public page (including each
  project and news story in src/data/defaults.js) with its own title,
  description, canonical link, share tags and structured data, plus
  sitemap.xml and robots.txt. The admin area is excluded and marked noindex.
  Pages added later in the dashboard still work (the app shell loads them);
  they simply share the site-wide tags until the next build.
*/
export default function seoPlugin() {
  let outDir = "dist";
  let env = {};

  return {
    name: "official-seo",
    apply: "build",
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir);
      env = loadEnv(config.mode, config.root, "VITE_");
    },
    closeBundle() {
      const siteUrl = (env.VITE_SITE_URL || site.siteUrl || "https://example.com").replace(/\/$/, "");
      const name = site.name;
      const full = [site.name, site.postNominals].filter(Boolean).join(", ");
      const role = `${site.role}, ${site.agency}`;
      const intro = DEFAULT_SETTINGS.intro;
      const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

      const pages = [
        { route: "/", title: `${full} | ${site.role}, Ministry of Health`, desc: intro },
        { route: "/profile", title: `Profile | ${name}`, desc: DEFAULT_SETTINGS.profileSummary },
        { route: "/projects", title: `Projects | ${name}`, desc: `Programmes and projects led by ${name}: community health, correctional reform, trade and women’s enterprise.` },
        { route: "/positions", title: `Positions held | ${name}`, desc: `Public offices, board appointments and leadership roles held by ${name}.` },
        { route: "/awards", title: `Awards and honours | ${name}`, desc: `National honours and awards conferred on ${name}, including the CBS and HSC.` },
        { route: "/news", title: `News | ${name}`, desc: `News, statements and updates from ${name}.` },
        { route: "/events", title: `Events | ${name}`, desc: `Conferences, launches, site visits and speaking engagements of ${name}.` },
        { route: "/gallery", title: `Gallery | ${name}`, desc: `Photos and videos of ${name} at work.` },
        { route: "/contact", title: `Contact | ${name}`, desc: `Media, partnership and speaking enquiries for ${name}.` },
        ...SAMPLE_PROJECTS.map((p) => ({ route: `/projects/${p.slug}`, title: `${p.title} | ${name}`, desc: p.summary })),
        ...SAMPLE_NEWS.map((n) => ({ route: `/news/${n.slug}`, title: `${n.title} | ${name}`, desc: n.summary, type: "article" })),
      ];

      const template = fs.readFileSync(path.join(outDir, "index.html"), "utf8");
      const jsonLd = JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          { "@type": "Person", name: full, jobTitle: role, worksFor: { "@type": "GovernmentOrganization", name: "Ministry of Health, Kenya" }, url: siteUrl,
            sameAs: Object.values(DEFAULT_SETTINGS.socials).filter(Boolean) },
          { "@type": "WebSite", name: full, url: siteUrl },
        ],
      });

      for (const p of pages) {
        const url = siteUrl + (p.route === "/" ? "/" : p.route);
        const head = [
          `<title>${esc(p.title)}</title>`,
          `<meta name="description" content="${esc(p.desc)}" />`,
          `<meta name="robots" content="index, follow" />`,
          `<link rel="canonical" href="${url}" />`,
          `<meta property="og:type" content="${p.type || "website"}" />`,
          `<meta property="og:title" content="${esc(p.title)}" />`,
          `<meta property="og:description" content="${esc(p.desc)}" />`,
          `<meta property="og:url" content="${url}" />`,
          `<meta name="twitter:card" content="summary" />`,
          `<script type="application/ld+json">${jsonLd}</script>`,
        ].join("\n    ");
        const html = template.replace(/<title>.*?<\/title>/, head);
        const dir = p.route === "/" ? outDir : path.join(outDir, p.route);
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, "index.html"), html);
      }

      // Admin and unknown paths fall back to the app shell, marked noindex.
      const shell = template.replace(/<title>.*?<\/title>/, `<title>${esc(name)}</title>\n    <meta name="robots" content="noindex, nofollow" />`);
      fs.writeFileSync(path.join(outDir, "404.html"), shell);
      fs.mkdirSync(path.join(outDir, "admin"), { recursive: true });
      fs.writeFileSync(path.join(outDir, "admin", "index.html"), shell);

      const today = new Date().toISOString().slice(0, 10);
      fs.writeFileSync(
        path.join(outDir, "sitemap.xml"),
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages
          .map((p) => `  <url><loc>${siteUrl}${p.route === "/" ? "/" : p.route}</loc><lastmod>${today}</lastmod></url>`)
          .join("\n")}\n</urlset>\n`
      );
      fs.writeFileSync(path.join(outDir, "robots.txt"), `User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: ${siteUrl}/sitemap.xml\n`);
    },
  };
}
