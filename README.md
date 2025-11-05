# Personal Blog – React + Tailwind + Remote API

A clean, responsive blog built with React (Vite), React Router, and Tailwind CSS. The app now integrates with a remote REST API for authentication, posts, and comments.

## Features

- Category tabs (All, Frontend, Backend, DevOps, QA, Others)
- Responsive card grid on the homepage
- Blog details page with hero image and Markdown rendering
- Simple header and footer with social links
- Clean Tailwind-styled UI (mobile-first)
- Remote API integration (Axios):
	- Auth: signup, login
	- Posts: list (with optional search), create, get by id
	- Comments: add comment to a post

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

## API

Base URL: `https://polash-dairy-api.onrender.com/api`

Endpoints used by the app:

- POST `/auth/signup` – `{ name, email, password }`
- POST `/auth/login` – `{ email, password }` → expects `{ token, user }`
- GET `/posts` – optional `?search=query`
- POST `/posts` – `{ title, imageUrl, content, category, author }`
- GET `/posts/:id`
- POST `/posts/:id/comments` – `{ text }`

Axios client is configured in `src/lib/api.js` with a request interceptor that attaches the `Authorization: Bearer <token>` header from localStorage when available.

## Suggestions for future improvements

- Content source
	- Replace JSON with a real API (REST/GraphQL)
	- Static site generation or MDX-based content
- Admin features
	- Backend-powered user management and moderation
	- Edit/delete posts and comments
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

- The details page renders Markdown via `react-markdown` or sanitizes HTML if the content is HTML.
- Search is sent to the backend only when a query is present; category filtering is done client-side.
