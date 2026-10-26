import { collectionFixture, photosFixture } from '../data/fixtures';

export function GalleryPage() {
  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-stone-950/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-stone-400">VERSA</p>
            <h1 className="text-sm font-medium tracking-widest text-white">COLLECTION</h1>
          </div>
          <nav className="hidden items-center gap-6 text-sm text-stone-300 md:flex">
            <span>Galeria</span>
            <span>Favoritos</span>
            <span>Download</span>
          </nav>
        </div>
      </header>

      <main>
        <section
          className="relative flex min-h-[100dvh] items-end justify-center overflow-hidden"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.45)), url(${collectionFixture.cover.sources[0].url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
          <div className="relative z-10 mx-auto w-full max-w-5xl px-6 pb-16 text-center md:pb-20">
            <p className="mb-3 text-[10px] uppercase tracking-[0.5em] text-stone-200/80">Coleção editorial</p>
            <h2
              className="mx-auto max-w-4xl font-serif text-5xl leading-none text-white md:text-[76px]"
              style={{ fontFamily: collectionFixture.theme.headingFont }}
            >
              {collectionFixture.title}
            </h2>
            <p className="mt-6 text-base text-stone-200 md:text-lg">
              por <span className="font-medium text-white">{collectionFixture.businessName}</span>
            </p>
            <button className="mt-10 inline-flex items-center justify-center rounded-full border border-white/40 bg-white/10 px-8 py-3 text-sm font-medium uppercase tracking-[0.2em] text-white transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/80">
              Entrar na galeria
            </button>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-2 py-6 md:px-6">
          <div className="mb-5 flex items-center justify-between px-2 text-xs uppercase tracking-[0.2em] text-stone-400">
            <span>{collectionFixture.totalItems} fotos</span>
            <span>modo editorial</span>
          </div>

          <div className="grid grid-cols-2 gap-1 md:grid-cols-3 md:gap-2 lg:grid-cols-4 lg:gap-2">
            {photosFixture.map((photo) => (
              <article
                key={photo.id}
                className="group overflow-hidden rounded-[18px] border border-white/10 bg-white/5"
              >
                <div className="relative aspect-[3/4]">
                  <img
                    src={photo.sources[0].url}
                    alt={photo.alt}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                    loading="lazy"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-3 opacity-0 transition duration-200 group-hover:opacity-100 group-focus-within:opacity-100">
                    <button className="rounded-full bg-black/40 p-2 text-white backdrop-blur-sm">♥</button>
                    <button className="rounded-full bg-black/40 p-2 text-white backdrop-blur-sm">↓</button>
                    <button className="rounded-full bg-black/40 p-2 text-white backdrop-blur-sm">⇪</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default function App() {
  return <GalleryPage />;
}
