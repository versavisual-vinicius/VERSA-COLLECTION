# VERSA-COLLECTION

Galeria digital para clientes com foco em fotografia editorial, responsividade e experiência imersiva.

## Visão geral

Este repositório passou a concentrar uma base funcional de galeria digital para clientes, com:

- capa editorial em tela cheia;
- cabeçalho contextual com comportamento responsivo;
- grid de imagens adaptável em colunas;
- lightbox com navegação por teclado e URL;
- ações de favorite, compartilhamento e download;
- estrutura preparada para evolução em direção à especificação completa do projeto.

## Stack

- React
- Vite
- TypeScript
- Tailwind CSS

## Requisitos

- Node.js 18+
- npm 9+

## Como rodar

```bash
npm install
npm run dev -- --host
```

Acesse a aplicação em `http://localhost:5173`.

## Estrutura atual

```text
.
├── README.md
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── .gitignore
├── public/
│   └── favicon.svg
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   ├── components/
│   │   └── GalleryPage.tsx
│   ├── data/
│   │   └── fixtures.ts
│   └── types/
│       └── gallery.ts
├── docs/
│   └── architecture.md
└── .editorconfig
```

## Status do desenvolvimento

A implementação atual já entrega uma versão funcional inicial de apresentação da coleção e navegação de imagens, servindo como base para os próximos módulos:

1. masonry refinado e paginação progressiva;
2. favoritos persistentes;
3. download e compartilhamento;
4. slideshow e acessibilidade;
5. integração com API e autenticação.

## Observação

A estrutura foi organizada para atender à especificação funcional descrita para a galeria digital e pode ser evoluída de forma incremental sem quebrar a base visual e de UX estabelecida.
