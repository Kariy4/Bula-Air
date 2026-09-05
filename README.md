# Bula Air

Static Bula Air website scaffolded into a `pages/` site with shared assets and JSON data.

## How to run locally

From this folder, run:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000/pages/index.html
```

The root `index.html` also redirects to the homepage.

## What changed

- Moved the original root HTML files into `backup/original_root/`.
- Added organized pages in `pages/` with a consistent header, footer, and internal links.
- Added `assets/css/style.css` with responsive styling based on the blue Bula Air aircraft livery.
- Added `assets/js/main.js` for loading JSON, rendering fleet/routes, mock booking, and aircraft-specific seating maps.
- Added `data/fleet.json`, `data/routes.json`, and `data/bookings.json`.
- Added supplied aircraft and logo images under `assets/images/`.
 - Added `data/fleet.json`, `data/routes.json`, and `data/bookings.json`.
 - Fleet flagship and hero imagery reference a high-resolution Fiji image (external link). See `assets/images/README.txt` for details.

## Quick Favicon & Testing Tips

- Place your supplied PNG at `assets/images/branding/hibiscus.png` so browsers prefer a raster favicon.
- If a new favicon doesn't show, hard-refresh (Ctrl+F5) or use an incognito window to bypass cache.
- To generate `favicon.ico` and `apple-touch-icon.png` from the existing SVG, use ImageMagick locally (examples below):

```bash
magick convert assets/images/branding/hibiscus.svg -resize 64x64 assets/images/branding/hibiscus.png
magick convert assets/images/branding/hibiscus.png -define icon:auto-resize=64,48,32,16 assets/images/branding/favicon.ico
```

If you want, tell me and I will add generated PNG/ICO files to the repo so you don't need to run the commands locally.
