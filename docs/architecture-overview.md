# Architecture Overview

This document summarizes the architecture of the VERSA-COLLECTION project.

```mermaid
flowchart TD
    Visitor[Gallery visitor] --> App[App.tsx\nCollection routing]
    App --> Page[GalleryPage.tsx\nGallery orchestration]

    subgraph PublicExperience[Public gallery experience]
        Hero[GalleryHero.tsx\nEditorial cover]
        Header[AutoHideGalleryHeader.tsx\nPersistent header]
        Progressive[useGalleryProgressivePhotos.ts\nProgressive loading]
        Masonry[useMasonryLayout.ts\nDeterministic masonry]
        Grid[InfiniteMasonryGrid.tsx\nResponsive photo grid]
        Lightbox[PhotoLightbox.tsx\nLightbox and slideshow]
    end

    subgraph Access[Access & protection]
        Gate[GalleryPasswordGate.tsx\nPassword and email gate]
        API[Node.js 24 Backend\nAuthorization boundary]
        DB[(AlloyDB PostgreSQL 17\nCollections, sessions, export log)]
    end

    subgraph Engagement[Visitor interaction]
        Favorites[useFavorites.ts\nFavorite persistence]
        Share[ShareDialog.tsx]
        Downloads[DownloadDialog.tsx]
        Drive[Google Drive delivery]
        Browser[(Browser local storage)]
    end

    subgraph Admin[Photographer operations]
        AdminPanel[AdminPanel.tsx\nAdmin dashboard]
        Telemetry[telemetry.ts\nAnonymous telemetry]
    end

    Photographer[Photographer] --> AdminPanel
    AdminPanel --> API

    Page --> Hero
    Page --> Header
    Page --> Progressive
    Progressive --> Masonry
    Progressive --> Grid
    Page --> Lightbox
    Lightbox --> Slideshow[SlideshowController.tsx]

    Page -. checks access .-> Gate
    Page --> API
    API --> DB
    Gate --> API

    Page --> Favorites
    Page --> Share
    Page --> Downloads
    Downloads --> API
    Downloads -. delivers .-> Drive
    Favorites --> Browser
    DB -. persists browser settings .-> Browser
    Favorites --> Telemetry

    App -->|routes to /g/:slug| Page
    Visitor -->|opens collection| App
```

## Architectural overview

- The public experience is delivered through a React + Vite frontend, with collection routing handled in `App.tsx` and orchestration in `GalleryPage.tsx`.
- Access control is enforced at the boundary between the gallery UI and the Node.js 24 backend (`server.mjs` / `/api/*`).
- Google Cloud AlloyDB for PostgreSQL 17 stores collection metadata, session state, and export/audit records via native `pg` connection pooling and atomic transactions.
- Photo loading is progressive and optimized for editorial presentation using deterministic masonry layout and responsive asset delivery.
- The photographer/admin module enables gallery management, native `ADMIN_TOKEN` authentication, and file export operations through server-backed logic.
- Browser-local persistence is used for favorites and UI state, while Google Drive CDN supplies high-resolution photo delivery.

## Main layers

- Frontend: React application rendered in the browser.
- API layer: Node.js 24 server (`server.mjs`) enforcing access, `ADMIN_TOKEN` / `scrypt` auth, and export logic.
- Data layer: Google Cloud AlloyDB for PostgreSQL 17 for storage and transactional system state.
- Media layer: Google Drive CDN asset delivery and responsive image presentation.
- Admin layer: photographer studio dashboard (`/dashboard`, `/photos`, `/editor`) for management and operational control.
