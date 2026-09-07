# Ayush Nautiyal — upgraded portfolio

## Quick start

Keep the `assets` folder beside `index.html`, then open the folder with a local server:

```bash
cd portfolio-upgraded
python3 -m http.server 8080
```

Open `http://localhost:8080` in a browser. A local server is recommended because browsers can block video and audio when an HTML file is opened directly from disk.

## What changed

- Rebuilt the layout with a responsive mobile-first grid and safer spacing.
- Corrected the broken `assets/...` references by including a matching asset structure.
- Removed the unused Three.js dependency and the incomplete video drawer for faster loading.
- Added one looping reel with a centered, accessible play/pause control.
- Added keyboard-friendly navigation, `Escape` handling, lightbox focus return, reduced-motion support, lazy-loaded project images, and visible focus states.
- Kept the dark glassmorphism direction, background video, ambient audio toggle, filters, project lightbox, and contact links.

The three files to edit are `index.html`, `style.css`, and `script.js`.