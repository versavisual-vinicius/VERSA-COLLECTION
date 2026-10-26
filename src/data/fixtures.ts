import type { GalleryCollection, GalleryPhoto } from '../types/gallery';

const photoSeeds = [
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
];

export const collectionFixture: GalleryCollection = {
  id: 'collection-nat',
  slug: 'nat',
  title: 'OTICAS ELOY – NAT',
  businessName: 'Óticas Eloy',
  businessUrl: 'https://example.com',
  cover: {
    alt: 'Capa editorial da coleção de óculos e estilo.',
    width: 1600,
    height: 1000,
    dominantColor: '#1f2937',
    sources: [{ url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1400&q=80', width: 1400, height: 1000, format: 'jpeg' }],
  },
  coverFocalPoint: { x: 50, y: 28 },
  visibility: 'public',
  passwordRequired: false,
  favoritesEnabled: true,
  downloads: {
    enabled: true,
    individualEnabled: true,
    collectionEnabled: true,
    requiresEmail: false,
    requiresPin: false,
    allowedSizes: ['original', '2048', '1024', '640'],
  },
  sharingEnabled: true,
  slideshowEnabled: true,
  totalItems: 127,
  locale: 'pt-BR',
  theme: {
    headingFont: 'Cormorant Garamond, Georgia, serif',
    bodyFont: 'Inter, Arial, sans-serif',
    foreground: '#f5f5f4',
    background: '#0f172a',
    gridGapDesktop: 6,
    gridGapMobile: 4,
    coverOverlayOpacity: 0.6,
  },
};

const buildGalleryPhotos = (totalItems: number): GalleryPhoto[] =>
  Array.from({ length: totalItems }, (_, index) => {
    const seed = photoSeeds[index % photoSeeds.length];
    const isPortrait = index % 3 === 0;
    const width = 900;
    const height = isPortrait ? 1200 : 900;

    return {
      id: `photo-${String(index + 1).padStart(3, '0')}`,
      fileName: `photo-${String(index + 1).padStart(3, '0')}.jpg`,
      alt: `Fotografia ${index + 1} da coleção`,
      width,
      height,
      dominantColor: '#d4d4d8',
      sources: [{ url: seed, width, height, format: 'jpeg' }],
      downloadUrl: `https://example.com/download/${index + 1}`,
      shareUrl: `https://example.com/g/nat?photo=photo-${String(index + 1).padStart(3, '0')}`,
      caption: index % 4 === 0 ? 'Editorial natural com foco em forma e leveza.' : undefined,
      position: index + 1,
      positionTieBreaker: `photo-${String(index + 1).padStart(3, '0')}`,
    };
  });

export const galleryPhotos = buildGalleryPhotos(collectionFixture.totalItems);
