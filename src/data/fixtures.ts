import type { GalleryCollection, GalleryPhoto, GalleryPageResponse, PageCursor } from '../types/gallery';

const photoSeeds = [
  {
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80',
    dominantColor: '#2d2d2a',
    aspect: 'portrait' as const,
  },
  {
    url: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80',
    dominantColor: '#4f4f46',
    aspect: 'landscape' as const,
  },
  {
    url: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=80',
    dominantColor: '#e0c9a6',
    aspect: 'portrait' as const,
  },
  {
    url: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&q=80',
    dominantColor: '#8a7d71',
    aspect: 'square' as const,
  },
  {
    url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
    dominantColor: '#ecc07d',
    aspect: 'portrait' as const,
  },
  {
    url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80',
    dominantColor: '#785b4b',
    aspect: 'landscape' as const,
  },
  {
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
    dominantColor: '#3d3432',
    aspect: 'portrait' as const,
  },
  {
    url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80',
    dominantColor: '#9c8c83',
    aspect: 'landscape' as const,
  },
];

export const collectionFixture: GalleryCollection = {
  id: 'collection-nat',
  slug: 'nat',
  title: 'OTICAS ELOY – NAT',
  businessName: 'Óticas Eloy',
  businessUrl: 'https://example.com',
  cover: {
    alt: 'Capa editorial da coleção OTICAS ELOY – NAT com óculos e estilo autoral.',
    width: 1600,
    height: 1067,
    dominantColor: '#1f2937',
    sources: [
      {
        url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1600&q=80',
        width: 1600,
        height: 1067,
        format: 'jpeg',
      },
      {
        url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1024&q=80',
        width: 1024,
        height: 683,
        format: 'jpeg',
      },
    ],
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
  sets: [
    {
      id: 'set-destaques',
      title: 'Destaques',
      slug: 'destaques',
      photoCount: 16,
    },
    {
      id: 'set-editorial',
      title: 'Editorial Principal',
      slug: 'editorial',
      photoCount: 60,
    },
    {
      id: 'set-detalhes',
      title: 'Detalhes & Estilo',
      slug: 'detalhes',
      photoCount: 51,
    },
  ],
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

const getDimensionsByAspect = (aspect: 'portrait' | 'landscape' | 'square', index: number) => {
  switch (aspect) {
    case 'portrait':
      return { width: 800, height: 1200 }; // 2:3
    case 'landscape':
      return { width: 1200, height: 800 }; // 3:2
    case 'square':
    default:
      return { width: 900, height: 900 };  // 1:1
  }
};

const buildGalleryPhotos = (totalItems: number, collectionTitle: string): GalleryPhoto[] =>
  Array.from({ length: totalItems }, (_, index) => {
    const seed = photoSeeds[index % photoSeeds.length];
    const { width, height } = getDimensionsByAspect(seed.aspect, index);
    const photoId = `photo-${String(index + 1).padStart(3, '0')}`;
    const focalX = 45 + ((index * 7) % 15); // Variação suave entre 45% e 60%
    const focalY = 30 + ((index * 11) % 25); // Variação suave entre 30% e 55%

    // Atribuição de sub-conjuntos/sets (paridade Pixieset)
    let setId = 'set-destaques';
    if (index >= 16 && index < 76) {
      setId = 'set-editorial';
    } else if (index >= 76) {
      setId = 'set-detalhes';
    }

    return {
      id: photoId,
      fileName: `${photoId}.jpg`,
      alt: `Fotografia ${index + 1} da coleção ${collectionTitle}`,
      width,
      height,
      focalPoint: { x: focalX, y: focalY },
      dominantColor: seed.dominantColor,
      sources: [
        {
          url: seed.url,
          width,
          height,
          format: 'jpeg',
        },
      ],
      downloadUrl: `https://example.com/download/${photoId}`,
      shareUrl: `https://example.com/g/nat?photo=${photoId}`,
      caption: index % 6 === 0 ? `Ensaio editorial fotográfico — Quadro #${index + 1}` : undefined,
      position: index + 1,
      positionTieBreaker: photoId,
      setId,
    };
  });

export const galleryPhotos: GalleryPhoto[] = buildGalleryPhotos(collectionFixture.totalItems, collectionFixture.title);

/**
 * Mock determinístico de paginação de fotografias da galeria com suporte a cursor opaco.
 * Primeira requisição: limit padrão de 16 itens.
 * Requisições subsequentes: limit padrão de 8 itens.
 */
export function getGalleryPageMock(cursor?: PageCursor | null, limit?: number): GalleryPageResponse {
  let startIndex = 0;

  if (cursor) {
    try {
      const parsedIndex = parseInt(cursor.replace(/^cursor_pos_/, ''), 10);
      if (!Number.isNaN(parsedIndex) && parsedIndex >= 0) {
        startIndex = parsedIndex;
      }
    } catch {
      startIndex = 0;
    }
  }

  const effectiveLimit = limit !== undefined ? limit : cursor ? 8 : 16;
  const endIndex = Math.min(startIndex + effectiveLimit, galleryPhotos.length);
  const items = galleryPhotos.slice(startIndex, endIndex);

  const nextCursor: PageCursor | null =
    endIndex < galleryPhotos.length ? `cursor_pos_${endIndex}` : null;

  return {
    items,
    nextCursor,
    totalItems: galleryPhotos.length,
  };
}
