# TODO — VERSA-COLLECTION (Galeria Digital para Clientes)

> Baseado na especificação canônica `pixieset-gallery-driven-spec.md` (v1.0.0).  
> Status de auditoria inicial: **Base prototípica com quebra de build e gaps de paridade funcional**.

---

## 🚨 Diagnóstico Crítico da Auditoria (Estado Atual)

- [x] **Correção Imediata de Build (TypeScript)**:
  - `src/lib/gallery.ts` renomeado para `.tsx` e build limpo restabelecido sem erros.
- [x] **Saneamento de `docs/architecture.md`**:
  - Arquivo saneado e restaurado com a arquitetura oficial do frontend.
- [x] **Refatoração do Masonry (Violação da Seção 18 da Spec)**:
  - Implementado motor de Masonry calculado em React (`useMasonryLayout.ts` e `InfiniteMasonryGrid.tsx`) com cálculo determinístico por menor altura acumulada, desempate à esquerda, preservação estrita da ordem do DOM e paridade geométrica (274px desktop / 189px mobile). CSS `column-count` legado completamente expurgado.
- [x] **Componentização Monolítica**:
  - `GalleryPage.tsx` modularizado na árvore canônica da Seção 5: `GalleryHero`, `AutoHideGalleryHeader`, `InfiniteMasonryGrid`, `PhotoLightbox`, `ShareDialog`, `DownloadDialog`, `FavoritesDialog`, `ToastRegion` e `BrandingFooter`.

---

## Fase 1: Fundação, Tipos e Saneamento de Build

- [x] Corrigir extensão/conteúdo de `src/lib/gallery.ts` para restabelecer build limpo (`tsc && vite build`).
- [x] Configurar suíte de testes automatizados unitários e de integração (`vitest`, `@testing-library/react`, `jsdom`).
- [x] Restaurar `docs/architecture.md` com arquitetura oficial do frontend.
- [x] Validar e expandir contratos de dados em `src/types/gallery.ts`:
  - Garantir contratos de `GalleryPageResponse`, `PageCursor`, `FavoriteRecord`, `DownloadJob`, `ApiError`, `ImageSource`.
- [x] Atualizar fixtures em `src/data/fixtures.ts`:
  - Garantir as 127 fotografias com dimensões reais, proporções mistas (paisagem/retrato), `positionTieBreaker`, pontos focais e mock de paginação com cursor.

---

## Fase 2: Capa Editorial & Cabeçalho Inteligente

- [x] **RF-002 & RF-003 — Capa Editorial**:
  - Implementado componente modular `GalleryHero` com `ResponsiveCoverImage`, `CoverOverlay`, `CollectionTitle`, `BusinessSignature`, `EnterGalleryButton` e `PreviewBanner`.
  - Altura em `100dvh` dinâmico (descontando 22px da barra do proprietário quando ativa).
  - Ponto focal dinâmico (`coverFocalPoint` em 50% 28%) com `object-fit: cover`.
  - Overlay de gradiente exato do RF-003 (`linear-gradient(transparent 0%, transparent 5%, rgba(0,0,0,0.08) 45%, rgba(0,0,0,0.5) 90%, rgba(0,0,0,0.7) 100%)`).
  - Alinhamento tipográfico centralizado com paridade de escala: Desktop 52px (1154x875), Mobile 39px (390x844).
  - Botão "Entrar na galeria" com foco acessível e scroll suave para a grade.
- [x] **RF-004 — AutoHideGalleryHeader**:
  - Altura desktop de 78px; versão compacta no mobile.
  - Lógica precisa de scroll: ocultar após 24px acumulados de descida; reexibir após 12px acumulados de subida; tolerância de oscilação anti-jitter < 4px; visível sempre com `scrollY < 24`.
  - Exibição fixa no topo da janela com transição de 200ms `ease-in-out`.
  - Conectada navegação completa (identidade com scroll to top, favoritos com contador, download da coleção, menu overflow para slideshow e share).

---

## Fase 3: Infinite Masonry Grid Calculado & Carregamento Progressivo

- [x] **RF-005 — Grade Masonry Calculada em React**:
  - Cálculo de colunas determinístico via `useMasonryLayout`: 4 colunas (>= 900px), 3 colunas (600–899px), 2 colunas (< 600px).
  - Inserção na coluna com menor altura acumulada (empate: coluna mais à esquerda).
  - Preservação estrita da ordem do DOM igual à da API (`position` e `positionTieBreaker`).
  - Tolerância de paridade matemática: Desktop (274px por coluna, gap 6px, margem 20px em 1154px); Mobile (189px por coluna, gap 4px, margem 4px em 390px).
- [x] **RF-006 — Carregamento Progressivo**:
  - Hook `useGalleryProgressivePhotos`: primeiro lote de 16 itens imediatos; lotes subsequentes de 8 itens via cursor opaco.
  - `IntersectionObserver` na sentinela com `rootMargin: 150% 0px` para prefetch antecipado antes do fim visível.
  - Tratamento de estados: `loading-more`, `partial-error` (botão de retry sem duplicar itens), `ready` quando `loadedItems === totalItems`.
  - Cancelamento de requisições pendentes via `AbortController` ao trocar de coleção ou desmontar.
  - Deduplicação estrita por `photo.id`.

---

## Fase 4: Cartão de Fotografia & Ações

- [x] **RF-007 — GalleryPhoto & PhotoActions**:
  - Imagem responsiva com `srcset`, `sizes`, `width`, `height`, `loading="lazy"`, `decoding="async"` (primeiras 4 com `eager`).
  - Posição reservada com proporção conhecida (`aspectRatio`) para evitar Cumulative Layout Shift (CLS).
  - Alvos interativos mínimos de 44x44px no mobile/touch (`min-w-[44px] min-h-[44px]`).
  - Hover/foco no desktop; toque no mobile com barra de ações dedicada.
  - Ações operacionais completas: Favoritar (com indicador visual e `aria-pressed`), Baixar e Compartilhar.

---

## Fase 5: Lightbox & Sincronização de URL

- [x] **RF-008 — Lightbox Completa**:
  - Overlay em tela cheia com lock de scroll no body (`overflow: hidden`).
  - Navegação via teclado (`ArrowLeft`, `ArrowRight`, `Escape`).
  - Focus trap com restauração de foco no elemento de origem ao fechar.
  - Suporte a gestos touch/swipe horizontal para mobile com limiar de 50px.
- [x] **Seção 6 — Contrato de URL e Histórico do Navegador**:
  - Abrir foto: `pushState` adicionando `?photo=:photoId`.
  - Navegar entre fotos (anterior/próxima): `replaceState` para evitar poluição do histórico.
  - Fechar lightbox: restaurar URL base da coleção. Se entrou por deep link direto, remover com `replaceState` sem estourar o histórico do app.
  - Restauração de foco e scroll da grade ao fechar.

---

## Fase 6: Slideshow

- [x] **RF-009 — SlideshowController**:
  - Início a partir da foto ativa na lightbox (`?photo=:photoId&mode=slideshow`).
  - Fundo preto, intervalo padrão de 4 segundos.
  - Pausa automática ao perder visibilidade da aba (`visibilitychange`).
  - Pausa por interação manual do usuário com opção de retomada (tecla `Space` e botão pause/play).
  - Auto-hide dos controles após 2 segundos de inatividade do cursor/toque.
  - Respeito estrito a `prefers-reduced-motion` (remoção de transições espaciais, fade <= 100ms).

---

## Fase 7: Favoritos, Download & Compartilhamento

- [x] **RF-010 — Favoritos**:
  - Ação otimista com reversibilidade e fila de sincronização offline (`useFavorites`).
  - Identificador persistente de visitante anônimo (`visitorId` em `localStorage`).
  - Contador e indicador visual no cabeçalho com sincronização reativa.
  - Modal `FavoritesDialog` com listagem e exportação/compartilhamento dos selecionados.
- [x] **RF-011 — Download Individual e de Coleção**:
  - `DownloadDialog` com seleção de resoluções permitidas (`original`, `3600`, `2048`, `1024`, `640`).
  - Máquina de estados do job: `idle` → `validating` → `preparing` → `ready` → `failed/expired`.
  - Validação de PIN/e-mail quando requerido pela política da coleção.
  - Exibição de link assinado temporário com validade de 15 minutos e botão "Preparar novamente" para links expirados.
- [x] **RF-012 — Compartilhamento**:
  - `ShareDialog` com Web Share API nativa (`navigator.share`) com fallback para WhatsApp, Facebook, X, Pinterest, e-mail e copiar link.
  - Toast de confirmação e região acessível `aria-live="polite"` ao copiar link com feedback visual.

---

## Fase 8: Acessibilidade, Telemetria & Critérios de Aceite

- [x] **Seção 13 — WCAG 2.2 AA**:
  - Auditoria de contraste em todos os estados (normal, hover, foco, lightbox, gradientes).
  - Textos alternativos das imagens com fallback semântico: `Fotografia {position} da coleção {title}`.
  - Modais com `role="dialog"`, `aria-modal="true"`, foco aprisionado e fechamento via `Escape`.
  - Alvos de toque de no mínimo 44x44px.
- [x] **Seção 15 — Telemetria Segura**:
  - Módulo `src/lib/telemetry.ts` de eventos técnicos (`gallery_viewed`, `gallery_batch_loaded`, `photo_opened`, `photo_favorited`, etc.).
  - Filtro estrito: zero dados sensíveis (sem e-mail, PIN, senhas ou nomes de arquivo brutos sanitizados para hash).
- [x] **Seção 16 & 17 — Validação Visual e BDD**:
  - Verificação de paridade geométrica em 1154x875 (desktop) e 390x844 (mobile).
  - Zero scroll horizontal nos limites (599px, 600px, 899px, 900px, 1440px).
  - 100% dos testes Vitest automatizados passando (11 suítes, 57 testes).

---

## Fase 9: Higienização, Segurança do Cliente, Painel do Vini & Exportações Solicitadas

- [x] **Higienização do Projeto & Resíduos**:
  - Expurgo completo de resíduos mortos `.ignored_*` no `node_modules` (>50MB).
  - Remoção limpa de `.devcontainer/devcontainer.json` órfão com snippet inconsistente.
  - Sincronização e integridade de build limpo com pnpm e TypeScript sem warnings críticos.
- [x] **Segurança do Cliente & Desafio de Senha (`GalleryPasswordGate`)**:
  - Desafio editorial de senha de acesso à galeria privada com backdrop desfocado da foto de capa.
  - Validação de senha do cliente e e-mail autorizado com restrição opcional.
  - Sessão persistente por coleção no `sessionStorage` e desbloqueio suave.
- [x] **Painel do Fotógrafo Vini (`AdminPanel`)**:
  - Painel de gestão acessível por URL (`?admin=true`), atalho de teclado (`Shift + A`) e rodapé.
  - Fluxo client-side original preservado apenas como histórico; substituído na Fase 11 por magic link e backend seguro.
  - Configuração dinâmica de senha da galeria, e-mail do cliente, visibilidade, PIN de download e link de entrega do Google Drive / Nuvem.
  - Persistência legada em `localStorage`, migrável de forma idempotente para o backend da Fase 11.
  - Gerador de mensagem pronta de WhatsApp para handoff rápido ao cliente ("Fala, [Nome]...").
- [x] **Exportação Solicitada do Cliente & Download Real**:
  - Suporte a download de arquivo real via link direto/fontes em alta resolução.
  - Suporte a link de pasta direta no Google Drive para entregas volumosas.
  - Registro em tempo real de solicitações de exportação (`ExportRequest`) com e-mail, tipo, resolução e status visíveis no painel de auditoria do Vini.
  - Suíte completa de testes automatizados (`Fase9_Seguranca_Admin_Export.test.tsx`), totalizando 65 testes passando.

---

## Fase 10: Auditoria de Paridade 1.0 (Confronto REA vs. Pixieset Real)

> Levantamento cirúrgico de gaps identificados após engenharia reversa via CDP (`http://[::1]:9222`) da galeria Pixieset (*DEMO — ENGENHARIA REVERSA*).

### 10.1 Navegação e Roteamento
- [x] **Compatibilidade Bidirecional de Deep Linking (`?pid=` e `?photo=`)**:
  - Atualizar `syncFromUrl` e `updateUrl` em `src/components/GalleryPage.tsx` para aceitar `?pid=` (padrão Pixieset) como alias transparente de `?photo=`.
- [x] **Página Inicial Pública do Fotógrafo (`/`)**:
  - Remover hardcode em `src/App.tsx` que redireciona `/` para a primeira coleção.
  - Criar componente `PhotographerHomePage.tsx` exibindo grid editorial com todas as coleções públicas ativas da Versa Visual.
  - Atualizar `CollectionIdentity.tsx` para linkar para `/` (Homepage do fotógrafo) com target opcional.

### 10.2 Apresentação e Grade
- [x] **Navegação Circular no Slideshow (Paridade `Gamma.settings.circular`)**:
  - Em `GalleryPage.tsx`, substituir `clamp()` por wrap circular `(current + direction + total) % total` durante o modo slideshow, evitando travamento na última foto.
  - Ajustar `intervalMs` padrão de 4000ms para 3000ms em `SlideshowController.tsx` (`slideshowSpeed: 3000`).
- [x] **Suporte a Múltiplos Conjuntos / Sets (`allGalleries`)**:
  - Expandir modelo em `src/types/gallery.ts` para suportar `sets?: GallerySet[]` (ex.: *Destaques*, *Cerimônia*, *Recepção*).
  - Adicionar barra de navegação de sub-galerias (`#nav-galleries`) abaixo do cabeçalho com contagem de fotos por set.
- [x] **Ações Rápidas Diretas no Cabeçalho Desktop**:
  - Em `AutoHideGalleryHeader.tsx`, expor botões dedicados de `Apresentação de slides` e `Compartilhar` na viewport desktop (`lg:` / `xl:`), mantendo o `OverflowMenu` (`...`) apenas para mobile e telas compactas.

### 10.3 Engajamento do Cliente (Favoritos, Notas e Privacidade)
- [x] **Anotações do Cliente em Fotos Favoritas (`isNoteOn` / `#sv-note-btn`)**:
  - Expandir `FavoriteRecord` para incluir `note?: string`.
  - Adicionar botão de observação no `PhotoLightbox.tsx` e campo editável no `FavoritesDialog.tsx`.
- [x] **Marcação de Fotos Particulares (`isMarkPrivateOn`)**:
  - Adicionar flag `isPrivate?: boolean` no modelo `GalleryPhoto` e botão de alternância no Lightbox.
  - Ocultar fotos marcadas como particulares quando o visitante acessar via senha geral de convidado.
- [x] **Empacotamento ZIP Client-Side de Favoritos**:
  - Implementar botão "Baixar Meus Favoritos (.ZIP)" no `FavoritesDialog.tsx` utilizando `jszip` para download imediato em lote.

### 10.4 Compartilhamento e Operações
- [x] **QR Code no Modal de Compartilhamento**:
  - Integrar gerador SVG de QR Code no `ShareDialog.tsx` e no `AdminPanel.tsx` para escaneamento rápido presencial via smartphone.
- [x] **Persistência de Configurações Administrativas em Arquivo JSON**:
  - Criar rotina/botão no `AdminPanel` para exportar o JSON atualizado da coleção ou sincronizar via CLI com `src/data/collections/<slug>.json`, evitando dependência exclusiva do `localStorage` do Mac do Vini.

---

## Fase 11: Higienização Completa & Backend Seguro

- [x] Padronizar Node 24 LTS, pnpm 12, lockfile único, lint, typecheck e CI.
- [x] Remover senha administrativa hardcoded e desativar painel local inseguro.
- [x] Implementar magic link Supabase com autorização por `app_metadata.role = owner`.
- [x] Criar migration com RLS, grants fechados, sessões, rate limit e auditoria de exportações.
- [x] Implementar Vercel Functions para coleções, sessão, admin, downloads e migração legada.
- [x] Hash de senha/PIN com `scrypt`; cookies `HttpOnly`, `Secure`, `SameSite=Lax` por 12 horas.
- [x] Preservar e importar configurações/solicitações do navegador sem apagar o backup local.
- [x] Migrar backend de Supabase/Vercel para Google Cloud Run + AlloyDB for PostgreSQL 17.
- [x] Criar servidor unificado `server.mjs`, Dockerfile multi-stage e build de produção.
- [x] Provisionar banco `versa_collection` no AlloyDB, aplicar schema DDL e semente com 158 fotos.
- [x] Configurar Cloud Run (`versa-collection-git`) com acesso público (`allUsers`), SSL seguro e integração Google Drive CDN.

 ## 11 Fase road map
# Roadmap de Implementação (ROADMAP.md)

## Fase 1: Fundação e Galeria Pública
- [x] Implementação da Capa Editorial responsiva (`srcset`, múltiplos breakpoints e animação de scroll suave).
- [x] Implementação da Grade Masonry responsiva com carregamento progressivo assíncrono.
- [x] Implementação do Lightbox em tela cheia com deep linking (URL profunda) e navegação por teclado/touch.
- [x] Implementação do modo Slideshow contínuo (ciclo 3s e interrupção por tecla/gesto).

## Fase 2: Ações do Cliente e Entrega
- [x] Sistema de Favoritos com autenticação sem senha baseada em e-mail (UI otimista, notas, ZIP client-side e endpoint de merge/sync por e-mail implementados).
- [x] Download individual de fotografias e download em lote protegido por PIN (máquina de estados, download individual multirresolução, validação de PIN e entrega de lote volumoso via pasta direta do Google Drive consolidados).
- [x] Composer de compartilhamento social e deep links por imagem.
- [x] Estados de carregamento, galeria vazia e acesso restrito por senha (password gate, loading e componente EmptyGalleryState concluídos).

## Fase 3: Painel Administrativo do Fotógrafo
- [x] Organização por coleções, conjuntos (Sets) e biblioteca de mídia central (navegação de sets pública e CRUD de sets na aba Sets do admin concluídos).
- [x] Upload em lote com extração de metadados e incorporação de vídeos (pipeline oficial consolidado via CLI Google Drive CDN e Service Account, indexando acervos massivos sem limites do navegador).
- [x] Editor visual de capa, tipografia, cores e grade (CoverFocalPicker interativo, tipografia e opacidade de overlay concluídos).
- [x] Configurações de privacidade, expiração automática, loja e atividades/histórico (privacidade por scrypt, tela de expiração automática e histórico concluídos).

  

