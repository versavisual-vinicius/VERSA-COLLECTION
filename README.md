# VERSA-COLLECTION

Galeria digital editorial para clientes com foco em experiência fotográfica imersiva, responsividade extrema, segurança de acesso e alta resolução.

---

## 📸 Visão Geral

O **VERSA-COLLECTION** foi concebido para entrega fotográfica profissional de alto padrão (baseado na especificação editorial `pixieset-gallery-driven-spec.md`). O produto elimina o atrito de galerias tradicionais, entregando:

1. **Capa Editorial em 100dvh**: focalPoint dinâmico, vinheta tipográfica calculada e tipografia autoral da Versa Visual (`Outfit` para títulos e `DM Sans` para leitura/interface).
2. **Masonry Calculado Determinístico**: distribuição de fotos por menor altura acumulada em 4/3/2 colunas com proporção reservada (Zero Layout Shift).
3. **Fotos em Alta Fidelidade (Google Drive CDN)**: integração nativa com o acervo do Google Drive (`lh3.googleusercontent.com`), com fontes responsivas em 640px, 1024px, 2048px, 3600px e original sem compressão destrutiva.
4. **Segurança do Cliente & Desafio de Senha (`GalleryPasswordGate`)**: telas de acesso com senha do cliente e e-mail autorizado, com persistência de sessão de 12 horas.
5. **Painel do Fotógrafo Vini (`AdminPanel`)**: gestão de credenciais das galerias, controle de download (PIN de 4 dígitos, exigência de e-mail), links diretos do Drive, auditoria em tempo real de quem baixou fotos e gerador de mensagem pronta de WhatsApp com 1 clique.
6. **Download Real & Exportações**: suporte a download individual de arquivo em alta resolução e link de pacote completo no Drive/Nuvem.
7. **Lightbox & Slideshow Imersivo**: navegação por teclado (`ArrowLeft`, `ArrowRight`, `Space`, `Escape`), auto-hide de controles e suporte a gestos touch.
8. **Favoritos com Otimismo Reversível**: persistência em `localStorage` e exportação/compartilhamento de fotos selecionadas.

---

## 🗂 Estrutura de Arquivos e Pastas

```text
src/
├── App.tsx                              # Roteamento de coleções (/g/:slug e ?collection=)
├── main.tsx                             # Ponto de entrada React 18
├── index.css                            # Tokens de tema (#050A0D, #5E7F8C, resets)
├── types/
│   └── gallery.ts                       # Contratos canônicos de tipos e interfaces
├── components/
│   ├── GalleryPage.tsx                  # Orquestrador de estado e visualização
│   ├── Admin/
│   │   └── AdminPanel.tsx               # Painel de gestão do Vini (senhas, PIN, exportações, WhatsApp)
│   ├── Security/
│   │   └── GalleryPasswordGate.tsx      # Portão de entrada com desafio de senha e e-mail
│   ├── GalleryHero/                     # Capa editorial em tela cheia (100dvh)
│   │   ├── GalleryHero.tsx
│   │   ├── ResponsiveCoverImage.tsx
│   │   ├── CoverOverlay.tsx
│   │   ├── CollectionTitle.tsx
│   │   ├── BusinessSignature.tsx
│   │   ├── EnterGalleryButton.tsx
│   │   └── PreviewBanner.tsx
│   ├── Header/                          # Cabeçalho persistente com recolhimento inteligente
│   │   ├── AutoHideGalleryHeader.tsx
│   │   ├── CollectionIdentity.tsx
│   │   ├── FavoriteAccess.tsx
│   │   ├── CollectionDownload.tsx
│   │   └── OverflowMenu.tsx
│   ├── Masonry/                         # Grid masonry calculado e carregamento progressivo
│   │   ├── InfiniteMasonryGrid.tsx
│   │   ├── GalleryPhotoCard.tsx
│   │   ├── ResponsivePhoto.tsx
│   │   ├── PhotoActions.tsx
│   │   ├── useMasonryLayout.ts
│   │   └── useGalleryProgressivePhotos.ts
│   ├── Lightbox/                        # Visualizador em tela cheia com lock de foco
│   │   ├── PhotoLightbox.tsx
│   │   ├── MediaStage.tsx
│   │   ├── LightboxToolbar.tsx
│   │   ├── PreviousNextNavigation.tsx
│   │   ├── PhotoCaption.tsx
│   │   └── SlideshowController.tsx
│   ├── Dialogs/                         # Modais acessíveis (WCAG 2.2 AA)
│   │   ├── DownloadDialog.tsx
│   │   ├── FavoritesDialog.tsx
│   │   └── ShareDialog.tsx
│   ├── Feedback/
│   │   └── ToastRegion.tsx
│   └── Footer/
│       └── BrandingFooter.tsx
├── data/
│   ├── collections/                     # Acervos JSON das coleções integradas
│   │   ├── modec-dia-das-criancas-2026.json
│   │   └── index.json
│   ├── collectionsRegistry.ts           # Registro dinâmico e compilação de coleções
│   └── fixtures.ts                      # Fixture base de teste (127 fotos)
├── lib/
│   ├── collectionSettings.ts            # Persistência de senhas, PINs e auditoria de exportações
│   ├── useFavorites.ts                  # Hook de favoritos com otimismo reversível
│   ├── telemetry.ts                     # Telemetria anônima estrita
│   └── gallery.tsx
└── test/                                # 12 suítes de testes automatizados (65 testes)
```

---

## 🛠 Execução Local

```bash
# Instalação de dependências
pnpm install

# Servidor de desenvolvimento
pnpm dev

# Suíte de testes automatizados (Vitest)
pnpm test

# Build de produção (TypeScript + Vite)
pnpm build

# Sincronização automática com Google Drive
pnpm sync:drive
```

---

## 🔐 Acesso Administrativo (Painel do Fotógrafo)

- **URL**: `/?collection=modec-dia-das-criancas-2026&admin=true` (ou rota `/admin`).
- **Atalho de Teclado**: `Shift + A` em qualquer página.
- **Menu**: Opção "Painel do Fotógrafo" no menu superior `⋯` ou no rodapé.
- **Senha Mestra do Estúdio**: `versa2026`.
