# Traffic Is Lava — Website

Single-page brand site for TIL, Vienna's off-road cycling community.
No build step. No CMS. Open `index.html` in any browser and it works.

---

## File structure

```
lava/
├── index.html            Main page (all sections)
├── styles/
│   └── main.css          All styles (table of contents at top)
├── scripts/
│   └── main.js           Nav, mobile menu, animations, year
├── assets/
│   ├── fonts/            Brand font files (.woff2) go here
│   ├── images/           Photography goes here
│   └── logo/             Logo files go here
└── README.md             This file
```

---

## How to update ride dates

Open `index.html`. Find the comment `<!-- SECTION 3: RIDES -->`.

Each ride is an `<article class="ride-item">` block. To update one:

1. Change the `datetime` attribute on `<time>` — use `YYYY-MM-DD` format
2. Change the visible date text inside `<time>` — e.g. `Mon, 06 Apr 2026`
3. Update the title `<h3>`, description `<p>`, and the three spec rows:
   - `TIME` — e.g. `6:30 — 8:30`
   - `MEET` — meeting point
   - `DISTANCE` — approximate distance

**To add a new ride:** copy an entire `<article class="ride-item">` block (from `<article>` to `</article>`) and paste it below the last one.

**To remove a ride:** delete the entire `<article class="ride-item">` block.

---

## How to swap images

Images are currently placeholder boxes. Each is marked with a comment showing the filename and recommended size.

### Option A — Replace the `<figure>` element

Find the placeholder `<figure>` in `index.html` and replace it:

```html
<!-- Before -->
<figure class="hero__image img-placeholder" data-slot="hero" aria-hidden="true">
  ...
</figure>

<!-- After -->
<figure class="hero__image">
  <img src="assets/images/hero.jpg" alt="Cyclist riding through Vienna's forest at dawn">
</figure>
```

### Option B — CSS background (keep existing HTML)

Add the image as a CSS background on the element:

```css
.hero__image {
  background-image: url(assets/images/hero.jpg);
  background-size: cover;
  background-position: center;
}
```

### Image slots

| Section | Class | File | Size | Notes |
|---------|-------|------|------|-------|
| Hero | `.hero__image` | `assets/images/hero.jpg` | ~800 × 1100px | Portrait, motion blur preferred |
| About | `.about__image` | `assets/images/about.jpg` | ~1600 × 900px | Landscape, group or scenery |

---

## Where assets go

### Logo

Place files in `assets/logo/`:

| File | Use |
|------|-----|
| `til-mark.svg` | Logo symbol / blob mark (for nav) |
| `til-logo.svg` | Full wordmark |
| `til-logo.png` | PNG fallback |

To swap the nav logo mark, find `<svg class="nav__logo-mark">` in `index.html` and replace it:

```html
<img src="assets/logo/til-mark.svg" alt="" width="28" height="28" aria-hidden="true">
```

### Brand fonts

1. Place `.woff2` files in `assets/fonts/`
2. Add `@font-face` blocks at the top of `styles/main.css` (see section 2 in that file):

```css
@font-face {
  font-family: 'YourFont';
  src: url('../assets/fonts/YourFont-Light.woff2') format('woff2');
  font-weight: 300;
  font-style: normal;
  font-display: swap;
}
```

3. Update the font variables in `styles/main.css`:

```css
:root {
  --font-sans: 'YourFont', system-ui, sans-serif;
  --font-mono: 'YourMonoFont', 'IBM Plex Mono', monospace;
}
```

4. Remove the Google Fonts `<link>` tags from `index.html`

---

## Social links

Find the `<!-- SECTION 4: JOIN -->` section in `index.html`.

Update the `href` on each `<a class="join__card">`:

| Platform | What to change |
|----------|---------------|
| Strava | `href="https://www.strava.com/clubs/YOUR-CLUB"` |
| Signal | `href="https://signal.group/#YOUR-INVITE-CODE"` |
| Instagram | `href="https://www.instagram.com/YOUR-HANDLE"` and the `@handle` text |

---

## Running locally

No server required — open `index.html` directly in a browser.

For live-reload during editing:

```bash
npx serve .
```

Or use the **Live Server** extension in VS Code (right-click `index.html` → Open with Live Server).

---

## Color & type reference

| Token | Value | Where used |
|-------|-------|-----------|
| Background | `#F8F7F5` | Page background |
| Text | `#0B0B0A` | Body copy, headings |
| Muted | `#6A6A64` | Secondary text, captions |
| Accent | `#B1E300` | Lime green — ride type badges, hover accents (on dark bg) |
| Dark bg | `#0B0B0A` | Join section, footer |
| Font sans | Space Grotesk | Body, nav, headings |
| Font mono | IBM Plex Mono | Labels, data, spec rows |

---

## Weekly maintenance checklist

- [ ] Update ride dates if a new month has started (5 min)
- [ ] Update Strava link if the club URL changes
- [ ] Swap in new hero/about images as better ones are available
