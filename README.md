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
