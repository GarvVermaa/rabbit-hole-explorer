# 🐇 Rabbit Hole Explorer

An interactive knowledge graph explorer powered by **live Wikipedia data**.

## Quick Start (frontend only — no backend needed)

```bash
cd frontend
npm install
npm run dev
# Open http://localhost:3000
```

That's it. The app fetches real data directly from Wikipedia's public API — no backend, no API key, no database.

## How it works

- **Search** any topic → Wikipedia is queried for the best matching article
- **Nodes** are real Wikipedia articles with live descriptions, thumbnails, and categories
- **Edges** are genuine links between Wikipedia pages
- **Click** any node → it becomes the new centre, its Wikipedia links become children
- **Back button** → floats on canvas after first navigation, retrieves previous view
- **Side panel** shows the real Wikipedia extract with a direct link to the full article

## Features

- Live Wikipedia summaries, thumbnails, and descriptions
- Automatic category detection (Science, Technology, History, etc.)
- Smooth animated node transitions (lerp-based)
- Flowing particles on exploration path edges
- Keywords shown directly on nodes
- Navigation history with one-click back

## Stack

- Next.js 14 + React 18
- HTML5 Canvas 2D (no WebGL)
- Wikipedia REST API + Action API (no auth required)
