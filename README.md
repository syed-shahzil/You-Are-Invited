# Royal Mughal Wedding Invitation

A mobile-first, single-page wedding invitation built with **React + Vite** (frontend only, no backend).
It opens with a long-press animation (191 frames, 24 fps) with background music, then scrolls through the couple,
Barat and its live countdown, Walima and its live countdown, the family invitation and the footer.

## Quick start

```bash
npm install
npm run dev        # local development at http://localhost:5173
npm run build      # production build into ./dist
npm run preview    # preview the production build locally
```

Requires Node.js 18 or newer.

## Where to edit things

| What | Where |
| --- | --- |
| Names, dates, times, venues, Google Maps links, developer credit | `src/data/wedding.js` |
| Countdown targets (Pakistan Standard Time, UTC+5) | `target` fields in `src/data/wedding.js` |
| Colours, fonts, spacing, 3D timeline styling | `src/styles/index.css` |
| Animation frames | `public/frames/frame_0001.webp` … `frame_0191.webp` |
| Frame count / FPS | `src/lib/frames.js` (`FRAME_COUNT`, `FPS`) |
| Opening long-press logic (hold time 1.2 s) and music playback | `src/components/Opening.jsx` |
| Background music (10 s clip, loops) | `src/assets/music.m4a` |

To replace the animation, drop new frames into `public/frames/` using the same
`frame_0001.webp` naming, and update `FRAME_COUNT` / `FPS` if they differ.

## Background music

- Keep the clip at **`src/assets/music.m4a`**. The build embeds it inside the JavaScript
  (see `assetsInlineLimit` in `vite.config.js`), so playback never depends on a separate
  file request, a wrong path or caching.
- To use a different clip, replace that file and keep the same name.
- Browsers only allow sound after a real tap. The music starts when the guest lifts their
  finger after the long press, retries on the next tap if the browser blocked it, and a gold
  speaker button (top-right, shown once the animation starts) lets guests start or mute it.
- Debugging: add `#audio-debug` to the end of the page address to show a small status
  panel at the top-left of the screen.
- If the music is silent on a phone, check the media volume and that Bluetooth is not
  routing sound to another device.

## Deploy to GitHub Pages

1. Create a new GitHub repository and push this folder to the `main` branch.
   Make sure the hidden `.github` folder is included.
2. In the repository go to **Settings → Pages** and set **Source** to **GitHub Actions**.
3. Push to `main` (or run the workflow manually from the **Actions** tab).
   `.github/workflows/deploy.yml` installs dependencies, runs `npm run build`
   and publishes `dist/`.
4. Your site appears at `https://<your-username>.github.io/<repository-name>/`.

All asset paths are **relative** (`base: './'` in `vite.config.js`), so the site works
under the `/<repository-name>/` sub-path and on a custom domain without changes.
If you prefer absolute paths, build with `VITE_BASE=/<repository-name>/ npm run build`.

### Manual deployment (without Actions)

Run `npm run build`, then upload the contents of `dist/` to the `gh-pages` branch
or to any static host (Netlify, Cloudflare Pages, Vercel, an S3 bucket, etc.).

## Optional: single-file build

```bash
npm run build:single
```

Creates `dist-single/index.html`, one self-contained HTML file (about 4.6 MB) with the
JavaScript, CSS and all frames embedded. Useful for hosts that accept a single file.

## Project structure

```
.
├── .github/workflows/deploy.yml   GitHub Pages workflow
├── public/
│   ├── frames/                    191 animation frames (WebP)
│   ├── favicon.svg
│   └── .nojekyll
├── scripts/build-single.mjs       optional single-file build
├── src/
│   ├── assets/
│   │   ├── rose.webp              floral ornament used beside headings
│   │   └── music.m4a              background music (embedded at build time)
│   ├── components/                Opening, Couple, Countdowns, EventCard, Family, Footer, Icons
│   ├── data/wedding.js            all wedding content
│   ├── hooks/                     useCountdown, useReveal
│   ├── lib/frames.js              frame loading and cache warming
│   ├── styles/index.css           all styling
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

## Notes

- Countdowns use fixed UTC+5 timestamps (`2026-12-19T11:00:00+05:00` and
  `2026-12-20T13:00:00+05:00`), so they are correct in any visitor time zone.
- Fonts (Cinzel, Cormorant Garamond) load from Google Fonts; the page falls back to
  Georgia/Times if they are unavailable.
- No API keys, environment variables or backend are required.
