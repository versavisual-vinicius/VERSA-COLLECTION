export type CullingFlag = 'pick' | 'reject' | 'none';

export interface CullingRecord {
  flag: CullingFlag;
  rating: number; // 0 a 5
  colorLabel?: 'red' | 'yellow' | 'green' | 'blue';
  updatedAt: string;
}

export type CullingStateMap = Record<string, CullingRecord>;

export type EditorialStyleId = 'none' | 'versa-teal' | 'bw-noir' | 'warm-golden' | 'clean-natural';

export interface EditorialStylePreset {
  id: EditorialStyleId;
  name: string;
  description: string;
  cssFilter: string;
}

export const EDITORIAL_STYLES: EditorialStylePreset[] = [
  {
    id: 'none',
    name: 'Original (Neutro)',
    description: 'Sem tratamento de estilo adicional, renderização fidedigna.',
    cssFilter: 'none',
  },
  {
    id: 'versa-teal',
    name: 'Versa Editorial Teal',
    description: 'Sombras azul-petróleo (#5E7F8C) com contraste editorial aveludado.',
    cssFilter: 'contrast(1.08) saturate(0.92) hue-rotate(-5deg) brightness(0.98)',
  },
  {
    id: 'bw-noir',
    name: 'B&W Noir 35mm',
    description: 'Monocromático de alto contraste com textura inspirada em filme analógico.',
    cssFilter: 'grayscale(100%) contrast(1.22) brightness(0.96)',
  },
  {
    id: 'warm-golden',
    name: 'Warm Golden Hour',
    description: 'Aquecimento suave de tons de pele com realces âmbar e transição suave.',
    cssFilter: 'sepia(0.22) contrast(1.05) saturate(1.1) brightness(1.02)',
  },
  {
    id: 'clean-natural',
    name: 'Clean Natural Light',
    description: 'Iluminação arejada, sombras abertas e brancos cristalinos.',
    cssFilter: 'brightness(1.04) contrast(1.02) saturate(0.98)',
  },
];
