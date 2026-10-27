import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin: string = '';
  readonly thresholds: ReadonlyArray<number> = [];

  constructor(private callback: IntersectionObserverCallback) {}

  observe = (target: Element) => {};
  unobserve = () => {};
  disconnect = () => {};
  takeRecords = (): IntersectionObserverEntry[] => [];
}

globalThis.IntersectionObserver = MockIntersectionObserver;

if (typeof navigator !== 'undefined') {
  Object.defineProperty(navigator, 'clipboard', {
    value: {
      writeText: vi.fn().mockResolvedValue(undefined),
    },
    configurable: true,
  });
}
