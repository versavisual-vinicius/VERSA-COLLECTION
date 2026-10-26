# VERSA-COLLECTION

Galeria digital para clientes, inspirada em experiências editoriais de fotos com capa imersiva, grade responsiva e lightbox.

## Visão geral

Este repositório inicia a implementação do produto descrito na especificação funcional do projeto: uma galeria de fotos pública com suporte a coleção, favoritos, download, compartilhamento, autenticação por senha, slideshow e navegação por URL.

## Stack

- React
- Vite
- TypeScript
- Tailwind CSS

## Requisitos

- Node.js 18+
- npm 9+

## Começando

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Inicie o ambiente de desenvolvimento:
   ```bash
   npm run dev -- --host
   ```
3. Acesse a aplicação em:
   ```bash
   http://localhost:5173
   ```
4. Para gerar build de produção:
   ```bash
   npm run build
   ```

## Estrutura inicial

```text
.
├── README.md
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├���─ tsconfig.node.json
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
└── docs/
    └── architecture.md
```

## Progresso esperado

A estrutura atual serve como base para:

- definições de tipos e contratos de dados;
- fixtures de coleção para desenvolvimento e testes visuais;
- capa editorial e header;
- grade masonry responsiva;
- lightbox e estado por URL;
- paginação progressiva e gerenciamento de favoritos;
- preparação para hooks, contextos e integração com API.

## Referência documental

A especificação funcional completa está no contexto do projeto e deve ser usada como guia de implementação e critérios de aceite.

## Observações

O projeto foi montado para permitir evolução incremental sem perder a compatibilidade com a proposta de desenho editorial, acessibilidade e performance da galeria.
