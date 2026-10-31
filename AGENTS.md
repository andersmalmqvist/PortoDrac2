# AGENTS.md

Porto Drac is a private, two-language (Swedish/English) family site: seven hand-written HTML pages sharing one stylesheet and two scripts. No framework, build step, npm dependencies, linter, or test suite — keep it that way unless asked. `README.md` is the authoritative content and licensing reference.

## Run and verify

- `npm start` (or `npm run dev`) runs `node server.js` at http://localhost:3000. If the port is busy, it tries the next one; use the URL printed in the terminal.
- Always test through the server, never `file://` — the SVG icon sprite is blocked by browser security rules when opened directly.
- There is no automated check. Verify changes in a browser at 390 / 900 / 1440 px, watch the console, and exercise the language switch.

## Bilingual markup

- Swedish is the default. Every translatable visible string needs both `data-sv` and `data-en`, and the element's visible text should be the Swedish value.
- Put `data-sv`/`data-en` only on elements that contain no child elements. `main.js` replaces `textContent`, so any icon or nested element inside would be destroyed on language switch; wrap the text in an inner `<span>` instead.
- Other language pairs handled by `main.js`:
  - images: `data-sv-alt` / `data-en-alt`
  - aria labels: `data-sv-aria` / `data-en-aria`
  - placeholders: `data-sv-placeholder` / `data-en-placeholder`
  - form fields: `data-label-sv` / `data-label-en` (used in the generated `mailto:` body)
- `<title>`, meta description, and OG tags switch via the same attributes (special handling by ID in `main.js`).
- Gallery captions use `data-caption-sv` / `data-caption-en`; `gallery.js` updates them when the language changes.
- Language preference persists in `localStorage` under `portodrac-lang`; `?lang=en` forces English.

## Structure

- Pages: `index.html`, `lagenheten.html`, `omradet.html`, `galleri.html`, `utflykter.html`, `praktiskt.html`, `kontakt.html`.
- Head, header/nav, and footer are duplicated in every page — there are no includes or partials. Repeat shared edits in all seven pages, and set `aria-current="page"` on the current page's nav link (the CSS styles that attribute).
- `js/main.js` runs on every page; `js/gallery.js` is loaded only by `galleri.html` (filters and lightbox).
- Icons come from the sprite: `<svg class="icon"><use href="bilder/icons.svg#icon-name"></use></svg>`.
- If an image file is renamed, update its `src`, the gallery `data-full`, and `og:image` references, plus `bilder/credits.json` and the license table in `README.md`.

## Content constraints

- Photos are Wikimedia Commons placeholders and most require attribution. Keep `bilder/credits.json` and the README license table accurate.
- Contact data (`portodrac@example.com`, `+46 70 000 00 00`) are deliberate placeholders — do not invent real details. They appear in every footer, the contact page, and the form's `data-mailto`.
- The site is intentionally `noindex, nofollow`, cookie-free, and has no analytics; the contact form is client-side only and opens a `mailto:` link. Preserve these properties.

## Git and deployment

- Repo `andersmalmqvist/PortoDrac2`, branch `main`, is public and publishes via GitHub Pages at https://andersmalmqvist.github.io/PortoDrac2/ on every push to `main` (~1–2 minutes). Treat every push as immediately public.
- `.gitattributes` enforces LF for text files and treats images, fonts, and PDFs as binary; keep LF line endings.
