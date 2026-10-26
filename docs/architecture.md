# Arquitetura e estrutura de desenvolvimento

## Objetivo

A base do projeto foi organizada para atender ao fluxo de desenvolvimento de uma galeria digital focada em fotografia, com experiência editorial, responsiva e preparada para lightbox, favoritos, download e compartilhamento.

## Stack escolhida

- React
- Vite
- TypeScript
- Tailwind CSS

## Diretrizes da implementação

1. preservar a experiência visual principal da referência;
2. manter a navegação por URL como parte central do estado;
3. priorizar carregamento progressivo e dimensões conhecidas;
4. manter acessibilidade e estados de erro explícitos;
5. separar contratos de dados da camada visual.

## Estrutura esperada

```text
src/
├── components/
│   └── GalleryPage.tsx
├── data/
│   └── fixtures.ts
├── types/
│   └── gallery.ts
├── App.tsx
├── main.tsx
└── index.css
```

## Próximo passo recomendado

Implementar os módulos em ordem:

1. tipos e fixtures de domínio;
2. capa e header responsivos;
3. masonry e paginação progressiva;
4. lightbox com URL e teclado;
5. favoritos, compartilhamento e download;
6. slideshow e acessibilidade;
7. telemetry e validações finais.

## Observação

Este documento funciona como guia inicial para a organização do repositório e para o andamento do projeto até a primeira versão funcional.
