import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { collectionFixture, galleryPhotos } from '../data/fixtures';

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const getPhotoById = (photoId: string | null) =>
  photoId ? galleryPhotos.find((photo) => photo.id === photoId) ?? null : null;

export function GalleryPage() {
  const [activePhotoId, setActivePhotoId] = useState<string | null>(null);
  const [headerVisible, setHeaderVisible] = useState(true);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const selectedPhoto = useMemo(() => getPhotoById(activePhotoId), [activePhotoId]);
  const currentIndex = selectedPhoto ? galleryPhotos.findIndex((photo) => photo.id === selectedPhoto.id) : -1;

  const syncFromUrl = useCallback(() => {
    const params = new URLSearchParams(window.location.search);
    const nextPhotoId = params.get('photo');
    setActivePhotoId(nextPhotoId && galleryPhotos.some((photo) => photo.id === nextPhotoId) ? nextPhotoId : null);
  }, []);

  useEffect(() => {
    syncFromUrl();
    const listener = () => syncFromUrl();
    window.addEventListener('popstate', listener);
    return () => window.removeEventListener('popstate', listener);
  }, [syncFromUrl]);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;

      if (Math.abs(delta) < 4) return;
      setHeaderVisible(delta <= 0 || currentScrollY < 24);
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!selectedPhoto) {
      document.body.style.overflow = '';
      return;
    }

    const previous = document.activeElement as HTMLElement | null;
    previousFocusRef.current = previous;
    document.body.style.overflow = 'hidden';

    const focusTimer = window.setTimeout(() => {
      dialogRef.current?.focus();
    }, 40);

    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = '';
      previousFocusRef.current?.focus();
    };
  }, [selectedPhoto]);

  const updatePhotoInUrl = useCallback((photoId: string | null, mode: 'push' | 'replace') => {
    const nextUrl = new URL(window.location.href);
    if (photoId) {
      nextUrl.searchParams.set('photo', photoId);
    } else {
      nextUrl.searchParams.delete('photo');
      nextUrl.searchParams.delete('mode');
    }

    if (mode === 'push') {
      window.history.pushState({}, '', `${nextUrl.pathname}${nextUrl.search}`);
    } else {
      window.history.replaceState({}, '', `${nextUrl.pathname}${nextUrl.search}`);
    }
  }, []);

  const openPhoto = useCallback((photoId: string) => {
    setActivePhotoId(photoId);
    updatePhotoInUrl(photoId, 'push');
  }, [updatePhotoInUrl]);

  const closePhoto = useCallback(() => {
    setActivePhotoId(null);
    updatePhotoInUrl(null, 'replace');
  }, [updatePhotoInUrl]);

  const navigatePhoto = useCallback(
    (direction: number) => {
      if (!selectedPhoto) return;
      const current = galleryPhotos.findIndex((photo) => photo.id === selectedPhoto.id);
      const next = clamp(current + direction, 0, galleryPhotos.length - 1);
      const targetPhoto = galleryPhotos[next];
      if (!targetPhoto) return;
      openPhoto(targetPhoto.id);
    },
    [openPhoto, selectedPhoto],
  );

  useEffect(() => {
    if (!selectedPhoto) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closePhoto();
        return;
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        navigatePhoto(1);
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        navigatePhoto(-1);
      }

      if (event.key === 'Tab' && dialogRef.current) {
        const focusable = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'),
        ).filter((element) => !element.hasAttribute('disabled'));

        if (focusable.length === 0) {
          event.preventDefault();
          return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [closePhoto, navigatePhoto, selectedPhoto]);

  const scrollToGallery = () => {
    document.getElementById('gallery-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="gallery-app">
      <header className={`gallery-header ${headerVisible ? 'header-visible' : 'header-hidden'}`}>
        <div className="header-inner">
          <div className="brand-block">
            <span className="brand-kicker">VERSA</span>
            <span className="brand-name">COLLECTION</span>
          </div>

          <nav className="header-nav" aria-label="Navegação principal">
            <button type="button">Galeria</button>
            <button type="button">Favoritos</button>
            <button type="button">Download</button>
          </nav>
        </div>
      </header>

      <main>
        <section
          className="gallery-cover"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.1) 45%, rgba(0,0,0,0.52) 90%, rgba(0,0,0,0.7)), url(${collectionFixture.cover.sources[0].url})`,
          }}
        >
          <div className="cover-overlay" />
          <div className="cover-content">
            <p className="eyebrow">Coleção editorial</p>
            <h1 className="cover-title" style={{ fontFamily: collectionFixture.theme.headingFont }}>
              {collectionFixture.title}
            </h1>
            <p className="cover-subtitle">
              por <strong>{collectionFixture.businessName}</strong>
            </p>

            <button type="button" className="cover-cta" onClick={scrollToGallery}>
              Entrar na galeria
            </button>
          </div>
        </section>

        <section id="gallery-grid" className="gallery-shell">
          <div className="gallery-meta">
            <span>{collectionFixture.totalItems} fotos</span>
            <span>modo editorial</span>
          </div>

          <div className="masonry-grid" aria-live="polite">
            {galleryPhotos.map((photo) => (
              <article key={photo.id} className="masonry-item">
                <button type="button" className="photo-card" onClick={() => openPhoto(photo.id)} aria-label={`Abrir foto ${photo.position}`}>
                  <img src={photo.sources[0].url} alt={photo.alt} loading="lazy" decoding="async" />
                  <span className="photo-gradient" />
                </button>

                <div className="photo-actions" aria-label="Ações da foto">
                  <button type="button" aria-label="Favoritar foto">♥</button>
                  <button type="button" aria-label="Baixar foto">↓</button>
                  <button type="button" aria-label="Compartilhar foto">⇪</button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      {selectedPhoto && (
        <div className="lightbox-backdrop" role="dialog" aria-modal="true" aria-label="Visualização da foto">
          <div ref={dialogRef} tabIndex={-1} className="lightbox-panel">
            <button type="button" className="lightbox-close" onClick={closePhoto} aria-label="Fechar visualização">
              Fechar
            </button>

            <button type="button" className="lightbox-nav left" onClick={() => navigatePhoto(-1)} aria-label="Foto anterior">
              ‹
            </button>

            <div className="lightbox-media-wrap">
              <img src={selectedPhoto.sources[0].url} alt={selectedPhoto.alt} className="lightbox-image" />
            </div>

            <button type="button" className="lightbox-nav right" onClick={() => navigatePhoto(1)} aria-label="Próxima foto">
              ›
            </button>

            <div className="lightbox-footer">
              <span>{currentIndex + 1}</span>
              <span>/</span>
              <span>{galleryPhotos.length}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
