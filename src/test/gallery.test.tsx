import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { GalleryPageStateDebug } from '../lib/gallery';

describe('GalleryPageStateDebug', () => {
  it('deve renderizar estado da galeria sem quebras', () => {
    render(<GalleryPageStateDebug />);

    expect(screen.getByText('Gallery state')).toBeInTheDocument();
    expect(screen.getByText(/Collection: OTICAS ELOY – NAT/)).toBeInTheDocument();
    expect(screen.getByText(/Items loaded: 127/)).toBeInTheDocument();
    expect(screen.getByText(/Selected photo: none/)).toBeInTheDocument();
  });
});
