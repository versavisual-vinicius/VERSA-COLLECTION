# VERSA-COLLECTION

Galeria digital editorial para clientes com foco em experiência imersiva, responsividade e foco em fotografia.

## Visão geral

Este repositório foi reestruturado para seguir uma arquitetura de módulos mais clara, com separação entre:

- tipos de domínio e contratos;
- fixtures e dados de coleção;
- componentes de apresentação;
- lógica de estado e sincronização de URL;
- estilos globais e layout responsivo.

## Arquitetura atual

```text
src/
├── App.tsx
├── components/
│   └── GalleryPage.tsx
├── data/
│   └── fixtures.ts
├── index.css
├── main.tsx
├── types/
│   └── gallery.ts
└── lib/
    └── gallery.ts
```

## Objetivo da base

A estrutura atual foi organizada para apoiar:

- cobertura inicial da especificação funcional;
- capa editorial em tela cheia;
- grid masonry responsivo;
- URL state com `photo` em query string;
- lightbox com navegação por teclado;
- arquitetura pronta para expansão em favoritos, downloads, slideshow e autenticação.

## Execução local

```bash
npm install
npm run dev -- --host
```

## Observaç��o

A reestruturação foi feita no mesmo repositório principal (`main`) conforme solicitado, com foco em manter a base funcional evoluindo de forma contínua em uma única linha de trabalho.
