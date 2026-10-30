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
        API[Vercel Functions\nAuthorization boundary]
        DB[(Supabase PostgreSQL\nCollections, sessions, export log)]
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
- Access control is enforced at the boundary between the gallery UI and server-side Vercel functions.
- Supabase stores collection metadata, session state, and export/audit records.
- Photo loading is progressive and optimized for editorial presentation using deterministic masonry layout and responsive asset delivery.
- The photographer/admin module enables gallery management, auth flows, and file export operations through server-backed logic.
- Browser-local persistence is used for favorites and UI state, while Google Drive supplies high-resolution photo delivery.

## Main layers

- Frontend: React application rendered in the browser.
- API layer: Vercel Functions enforce access, auth, and export logic.
- Data layer: Supabase PostgreSQL for storage and system state.
- Media layer: Google Drive-based asset delivery and responsive image presentation.
- Admin layer: photographer dashboard for management and operational control.
