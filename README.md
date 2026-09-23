# Delta Labs

Marketing site for Delta Labs — a Pakistan-based business systems engineering
company. Built with Next.js (App Router) and Tailwind CSS.

## Prerequisites

- Node.js `22.x`

## Quick Start

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`.

## Scripts

- `npm run dev` — start the local dev server
- `npm run build` — production build
- `npm run start` — run the production build locally
- `npm run lint` — run ESLint

## Structure

- `app/page.tsx` — home page (light-theme redesign)
- `app/services/`, `app/methodology/`, `app/contact/` — secondary pages
- `app/components/` — shared UI components
- `app/components/home/` — home-page-only interactive components (header,
  workflow comparison, scroll-tracked method diagram, footer)
- `app/globals.css` — global styles; the home page's design system lives
  under the `.home` scope so it doesn't affect the other pages
- `public/` — static assets (brand marks, hero image, team photos)
