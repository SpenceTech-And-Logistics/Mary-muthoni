# PS Mary Muthoni Muriuki, CBS, HSC: official profile site

Built on the officials design (Fraunces + Public Sans; ink, teal, sand, amber) and the same
React 19 / Vite / Firebase structure as the Gachoki and Wangui sites.

Pages: Home (featured-project carousel, stats, video, news, events, awards, photos), Profile, Projects,
Project detail, Positions, Awards, News, Article, Events (add to calendar), Gallery (photos and videos), Contact.
Private dashboard at `/admin` edits all of it.

## Run it
```
npm install
npm run dev        # http://localhost:5173
npm run build      # output in dist/
```
Without Firebase the site shows the built-in content from `src/data/defaults.js`.

## 1. Connect the dashboard (Firebase, free plan)
1. console.firebase.google.com: Add project. Build > Firestore Database > Create (production mode).
2. Build > Authentication > Email/Password > enable. Users tab: add the office's email and a password.
3. Project settings > Your apps > Web (`</>`). Copy `apiKey`, `authDomain`, `projectId`, `appId` into `firebase` in `site.config.js`.
4. Firestore > Rules: paste `firestore.rules`, Publish.
5. Firestore > Start collection `admins`. Document ID = the user's UID (Authentication > Users). Add any field, e.g. `ok = true`.
6. Open `/admin`, sign in. In each section press **Load the starting content** once to copy the built-in projects, positions, awards, news, events and gallery into the database. Then open **Profile and settings** and press **Save all changes** once.

## 2. What the dashboard edits
- **Projects**: photo, video link, sector, status, year, place, budget, outcomes (`number | label` per line), full text. Tick "Show in the home page carousel".
- **Positions**: grouped (Public office, Boards and committees, Institutional leadership, Earlier career); "current" ones show on top.
- **Awards**: ordered list; the first with a citation is shown large.
- **News**: photo or video, link to the original, related projects, earlier stories and outside links.
- **Events**: upcoming ones get Google Calendar and .ics buttons, and move to Past by themselves.
- **Gallery**: bulk photo upload; videos by pasting a YouTube, Vimeo, Facebook or .mp4 link.
- **Profile and settings**: name, office, portrait, intro video, headline numbers, biography, education, expertise, memberships, quote, contact, social links, colours.
- **Messages**: contact form submissions.

## 3. Before going live
- Set `siteUrl` in `site.config.js`. Host on Cloudflare Pages, Netlify or Firebase Hosting (build `npm run build`, output `dist`).
- Add the portrait and photos in /admin. All photo spaces show striped placeholders until then.
- Add the office email and phone in /admin > Profile and settings > Contact (left blank on purpose; the CV's personal numbers were not published).

## Facts used and what to confirm
Sources: her executive CV; World Health Summit, CPHIA 2024 and Kukha speaker pages; Ministry of Health; Capital FM, The Star,
People Daily, County Government of Nandi (links on each news story).
Confirm with the office: the year she moved to Public Health (CPHIA says May 2023), the Instinct Women's Award (2026) and
SDGs Award (2025) names and bodies (from the WHS page only), the Global Fund mechanism role (WHS: Chair; CPHIA: Co-chair),
the Afya House office address, and the profile quote.
