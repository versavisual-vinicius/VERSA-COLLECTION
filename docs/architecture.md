@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  font-family: Inter, system-ui, sans-serif;
  line-height: 1.5;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.95);
  background-color: #0a0a0a;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
  background: #0a0a0a;
}

img {
  display: block;
  max-width: 100%;
}

button {
  cursor: pointer;
}

#root {
  min-height: 100vh;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 4px;
}

@media (min-width: 600px) {
  .gallery-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 6px;
  }
}

@media (min-width: 900px) {
  .gallery-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 6px;
  }
}

.gallery-item {
  position: relative;
  overflow: hidden;
}

.gallery-item .photo-actions {
  position: absolute;
  inset-inline: 0;
  bottom: 0;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 0.75rem;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.72), transparent);
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 200ms ease-out, transform 200ms ease-out;
}

.gallery-item:hover .photo-actions,
.gallery-item:focus-within .photo-actions {
  opacity: 1;
  transform: translateY(0);
}

.action-button {
  display: inline-flex;
  height: 2.5rem;
  width: 2.5rem;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(0, 0, 0, 0.34);
  color: white;
  backdrop-filter: blur(6px);
  transition: transform 200ms ease-out, background-color 200ms ease-out;
}

.action-button:hover,
.action-button:focus-visible {
  transform: translateY(-1px);
  background: rgba(0, 0, 0, 0.52);
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
