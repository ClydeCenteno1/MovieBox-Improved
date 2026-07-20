# Movie Box

A dark-themed show discovery app with a hero spotlight, curated rows for popular and top-rated titles, and a modal search — built on the TVMaze API and written in TypeScript.

**Live demo:** [https://clydecenteno1.github.io/MovieBox-Improved/)

## Overview

Land on the page and you're greeted with a full hero banner for a featured title, followed by two scrollable rows — Popular and Top Rated — each pulling live ratings and artwork from the TVMaze API. Search any title from the navbar and results open in a modal grid without leaving the page.

## Features

- **Hero spotlight** — fetches a specific featured show on load and renders its title, rating, premiere info, summary, and poster into a full banner section
- **Popular Movies row** — pulls the full TVMaze show catalog, filters out anything without a rating, sorts by rating descending, and takes the top 8
- **Top Rated Movies row** — pulls the same catalog and filters for anything rated above 8.5
- **Modal search** — submitting the search form fetches matching shows and opens them in a native `<dialog>` grid, styled consistently with the rest of the app
- **Responsive nav** — collapsible hamburger menu on mobile, full nav bar on desktop, with a toggleable search input
- **Graceful fallbacks** — missing ratings render as `"N/A"` and missing titles as `"Untitled"` instead of breaking the layout

## Tech Stack

| Layer | Technology |
|---|---|
| Markup | HTML5, native `<dialog>` element |
| Styling | [Tailwind CSS](https://tailwindcss.com/) (via CDN) |
| Icons | [Font Awesome 6.5](https://fontawesome.com/) |
| Language | **TypeScript** — compiled to a `<script type="module">` output |
| HTTP requests | [Axios](https://axios-http.com/) (via CDN) |
| Data | [TVMaze API](https://www.tvmaze.com/api) |
| Hosting | GitHub Pages |

## How it works

**Typed DOM queries** — since `axios` is loaded globally via CDN rather than imported as a module, it's declared manually so TypeScript knows about it, and every DOM element grabbed with `querySelector` is cast to its real element type so properties like `.value` or `.showModal()` are available with full type-checking:

```ts
declare const axios: any

const userInput = document.querySelector("#userInput") as HTMLInputElement
const dialog = document.querySelector("#dialog") as HTMLDialogElement
```

**Interfaces for API shape** — rather than treating API responses as untyped blobs, `MovieItem` and `topRated` interfaces describe the fields actually used (name, rating, image), so the compiler catches typos or missing-field access before they become runtime bugs.

**Optional chaining + nullish coalescing everywhere API data is rendered** — since TVMaze entries don't always have a rating or image, every render function reaches for the field defensively:

```ts
<h4>${item.rating?.average ?? "N/A"}</h4>
<img src="${item.image?.medium || item.image?.original || ""}" alt="${item.name || ""}">
```

**Native `<dialog>` for search results** — search results open via `.showModal()` / `.close()` rather than a custom overlay component, matching the same pattern used in the Expense Tracker project.

## Project Structure

```
Movie-Box/
├── index.html      # Page markup, hero container, nav, and search dialog
└── app.ts          # TypeScript source (compiles to app.js as an ES module)
```

## Running Locally

1. Clone the repo:
   ```
   git clone https://github.com/ClydeCenteno1/Movie-Box.git
   ```
2. If working from the TypeScript source, compile it (`tsc app.ts`) or run it through your bundler/dev server of choice.
3. Open `index.html` directly in a browser, or serve it locally (e.g. with the VS Code "Live Server" extension).

## Known Limitations & Notes

- **"Movies" is actually TV shows** — TVMaze is a TV show database, so the "Popular Movies" and "Top Rated Movies" sections both render TV shows, not films. Labels could be updated to "Popular Shows" / "Top Rated Shows" for accuracy.
- **`getPopularMovies()` and `getTopRatedMovies()` both fetch the entire `/shows` catalog independently** — since both need the same base dataset, this could be reduced to a single fetch and filtered/sorted twice on the client instead of hitting the API twice.
- **`getTopRatedMovies()` has no `.slice()` limit** — if the catalog contains many shows rated above 8.5, this row has no cap on how many render, unlike the Popular row which is explicitly capped at 8.
- An earlier plain-JS version of this app is also present in the project history; the TypeScript rewrite added defensive `innerHTML = ""` resets before each render (preventing duplicate cards on re-render) and typed interfaces that weren't in the original.

## Credits

Built by [Clyde Centeno](https://github.com/ClydeCenteno1) as a TypeScript + third-party API integration practice project.
