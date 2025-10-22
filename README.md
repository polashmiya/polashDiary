# Personal Blog – React + Tailwind

A clean, responsive blog built with React (Vite), React Router, and Tailwind CSS. Posts are loaded from a local JSON file and rendered with optional Markdown support.

## Features

- Category tabs (All, Frontend, Backend, DevOps, QA, Others)
- Responsive card grid on the homepage
- Blog details page with hero image and Markdown rendering
- Simple header and footer with social links
- Clean Tailwind-styled UI (mobile-first)

## Tech stack

- React (Vite)
- React Router DOM
- Tailwind CSS v4 via `@tailwindcss/vite`
- react-markdown (optional Markdown rendering)

## Project structure

```
src/
	components/
		BlogCard.jsx
		BlogList.jsx
		CategoryFilter.jsx
		Footer.jsx
		Header.jsx
	pages/
		BlogDetails.jsx
		Home.jsx
	data/
		blogs.json
	assets/
	App.jsx
	main.jsx
	index.css
```

## Tailwind setup (already configured)

This project uses Tailwind v4 with the Vite plugin:

- `vite.config.js` includes `@tailwindcss/vite`
- `src/index.css` imports Tailwind via `@import "tailwindcss";`

If you want to customize Tailwind (colors, fonts, plugins), add a `tailwind.config.js` and extend as needed.

## Run locally

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

## Data model

Each blog post in `src/data/blogs.json` looks like this:

```json
{
	"id": 1,
	"slug": "react-hooks-best-practices",
	"title": "React Hooks: Best Practices for Clean Components",
	"category": "Frontend",
	"date": "2025-09-20",
	"author": "Jane Developer",
	"featuredImage": "https://...",
	"description": "Short preview text...",
	"content": "# Markdown body here..."
}
```

## Suggestions for future improvements

- Content source
	- Replace JSON with a real API (REST/GraphQL)
	- Static site generation or MDX-based content
- Admin features
	- Secure login, create/edit posts, upload images
	- Drafts, scheduled publishing, categories/tags management
- UX/UI
	- Search, pagination/infinite scroll
	- Tag system in addition to categories
	- Dark mode toggle and theme customization
	- Related posts and breadcrumbs
- Performance/SEO
	- Image optimization (responsive images)
	- Sitemap, meta tags, Open Graph, RSS feed
	- Analytics (privacy-friendly)
- Testing & quality
	- Unit/integration tests (Vitest, React Testing Library)
	- Linting/formatting and CI workflow

## Notes

- The details page renders Markdown via `react-markdown`. You can store long-form content as Markdown in the JSON file for convenience.
- Category filters also sync with the URL (`?category=...`) for shareable filtered views.
