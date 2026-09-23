# Delta Labs — complete frontend

Latest published frontend, exported 22 September 2026. Plain HTML, CSS and JavaScript; no npm installation or build required.

## Open
Extract the ZIP and open index.html in your browser. For a local server, run `python3 -m http.server 8000` in this folder and visit http://localhost:8000. Clipboard support depends on browser permissions and a secure context (HTTPS or localhost).

## Included
- index.html: complete page, inline header/footer logos and SVG favicon.
- styles.css: base design and responsive layout.
- refinement.css: updated hero, projects and mobile refinements.
- experience.css: interactive workflow, process diagrams, menu and animation styles.
- app.js: workflow toggle, scroll navigation, process stages, expandable details, email draft and copy enquiry.
- assets/shift-delta.svg: approved logo mark.
- assets/delta-labs-logo.svg: reusable logo with wordmark.
- assets/shift-art.webp: current branded hero image.
- assets/delta-hero.webp: earlier hero image, retained as an optional asset.

## Hosting and dependencies
Upload the folder contents to any static web host. Keep relative paths unchanged. Google Fonts (DM Sans and Manrope) load over the internet; the page falls back to system fonts offline. No backend, database, credentials or hosting-account configuration is included.

## Contact form
The form creates an email draft to hello@deltalabs.com or copies the enquiry. It does not submit to a server or send email automatically. Verify the receiving email before production use. Change it in both index.html and app.js if needed.

Project visuals are illustrative, not live product screenshots. Projects are labelled in development. The approved charcoal Shift Delta logo and all current animations are included. SVG wordmarks contain editable text using system fonts.
