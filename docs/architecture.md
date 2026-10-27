# Arquitetura — VERSA-COLLECTION

> **Status:** Canônico  
> **Versão:** 1.0.0  
> **Data:** 27/10/2026  
> **Base:** `pixieset-gallery-driven-spec.md` (v1.0.0)  
> **Stack:** React 18, Vite, TypeScript, Tailwind CSS, Vitest & Testing Library.

---

## 1. Visão Geral

O **VERSA-COLLECTION** é uma aplicação cliente SPA projetada para entrega editorial de fotografias em alta resolução. O produto oferece imersão fotográfica sem atrito, suportando coleções com mais de uma centena de fotos por meio de layout masonry calculado determinístico, paginação progressiva baseada em cursor e sincronização bidirecional do estado da URL.

Elimina o acoplamento herdado de bibliotecas legadas (jQuery/Bootstrap 3) em favor de uma arquitetura modular, previsível, tipada e com acessibilidade WCAG 2.2 AA.

---

## 2. Árvore Modular de Componentes

A estrutura de interface é decomposta em módulos independentes com responsabilidades bem delimitadas:

```text
GalleryPage (Container Principal & Orquestrador de Sessão)
├── PreviewBanner                      # Alerta não invasivo para visualização do fotógrafo
├── GalleryHero                        # Capa editorial em 100dvh
│   ├── ResponsiveCoverImage           # Renderização com focalPoint e srcset responsivo
│   ├── CoverOverlay                   # Gradiente escuro calculado para contraste tipográfico
│   ├── CollectionTitle                # Tipografia editorial principal
│   ├── EnterGalleryButton             # Gatilho com scroll suave acessível para a grade
│   └── BusinessSignature              # Assinatura autoral do fotógrafo / estúdio
├── AutoHideGalleryHeader              # Cabeçalho persistente com recolhimento inteligente
│   ├── CollectionIdentity             # Identidade visual compacta da galeria
│   ├── FavoriteAccess                 # Contador dinâmico e gatilho do diálogo de favoritos
│   ├── CollectionDownload             # Gatilho de download do acervo completo
│   └── OverflowMenu                   # Compartilhamento, slideshow e metadados
├── InfiniteMasonryGrid                # Grade balanceada por menor altura acumulada
│   └── GalleryPhoto                   # Cartão individual de foto com proporção reservada
│       ├── ResponsivePhoto            # Imagem com srcset, tamanhos e lazy loading
│       └── PhotoActions               # Overlay interativo (favoritar, baixar, compartilhar)
├── PhotoLightbox                      # Overlay imersivo com focus trap e body scroll lock
│   ├── MediaStage                     # Exibição da foto ativa com suporte a swipe e gestos
│   ├── LightboxToolbar                # Controles superiores (fechar, download, favoritar, compartilhar)
│   ├── PreviousNextNavigation         # Setas com alvos táteis mínimos de 44x44px
│   ├── PhotoCaption                   # Legenda da foto e indicador de posição (ex: 12 / 127)
│   └── SlideshowController            # Apresentação automática com respeita a prefers-reduced-motion
├── ShareDialog                        # Diálogo de compartilhamento com Web Share e links sociais
├── DownloadDialog                     # Diálogo de solicitação de download e polling de job
├── FavoritesDialog                    # Diálogo de gestão e exportação dos favoritos do visitante
├── ToastRegion                        # Região acessível de anúncios aria-live="polite"
└── BrandingFooter                     # Rodapé discreto de encerramento
```

---

## 3. Contratos de Dados e Tipos

Todos os contratos canônicos estão formalizados em `src/types/gallery.ts`:

- `GalleryCollection`: Metadados completos da coleção, políticas de download, favoritos, visibilidade e tokens de tema.
- `GalleryPhoto`: Dados de exibição de cada fotografia, dimensões nativas (`width` e `height`), `focalPoint`, `position`, `positionTieBreaker`, `sources` e URLs de ação.
- `PageCursor`: Identificador opaco de paginação gerado no servidor.
- `GalleryPageResponse`: Envelope de paginação contendo lista de itens, cursor subsequente e total de itens da coleção.
- `DownloadJob` & `DownloadJobStatus`: Máquina de estados assíncrona para geração e validação de pacotes ZIP com URLs assinadas temporárias.
- `FavoriteRecord`: Registro idempotente de foto favoritada por visitante anônimo ou autenticado.
- `ApiError`: Envelope padronizado de erro com códigos determinísticos (`NOT_FOUND`, `PASSWORD_REQUIRED`, etc.).

---

## 4. Estado de URL e Histórico do Navegador

O navegador opera como reflexo transparente do estado da galeria:

| Rota / Parâmetro | Estado da Interface | Ação no Histórico |
|---|---|---|
| `/g/:slug` | Capa ou grade da coleção | Navegação padrão |
| `/g/:slug?photo=:photoId` | Lightbox aberta na foto especificada | `pushState` ao abrir da grade |
| `/g/:slug?photo=:nextId` | Foto seguinte/anterior na lightbox | `replaceState` (evita poluição do histórico) |
| `/g/:slug?photo=:photoId&mode=slideshow` | Slideshow em execução | `replaceState` |
| Fechar Lightbox | Grade reexibida na posição anterior | Restaura URL base; remove query param com `replaceState` se entrada foi por deep link |

---

## 5. Arquitetura do Masonry Calculado

Em conformidade com a Seção 18 da especificação, rejeitou-se o uso de CSS `column-count` puro pelos seguintes motivos:

1. **Ordem de Leitura e Acessibilidade**: O CSS `column-count` agrupa itens verticalmente por coluna, gerando ordem visual que diverge da ordem semântica do DOM (leitura em "zigue-zague" vs leitura por colunas).
2. **Distribuição Determinística**: O algoritmo em React insere cada imagem na coluna que possuir a menor altura acumulada no momento (`minHeightColumnIndex`), utilizando a coluna mais à esquerda como critério de desempate.
3. **Paridade Geométrica**:
   - **Desktop (>= 900px)**: 4 colunas (largura alvo ~274px, gap 6px, margens 20px em viewport 1154px).
   - **Tablet (600px - 899px)**: 3 colunas.
   - **Mobile (< 600px)**: 2 colunas (largura alvo ~189px, gap 4px, margens 4px em viewport 390px).
4. **Prevenção de Layout Shift (CLS)**: As proporções de aspecto (`aspectRatio = width / height`) são reservadas no contêiner antes do carregamento dos pixels da imagem.

---

## 6. Paginação Progressiva & Resiliência

- **Lote Inicial**: 16 fotografias carregadas no primeiro lote para preencher a primeira dobra sem sobrecarregar a rede.
- **Lotes Incrementais**: 8 fotografias por requisição via cursor opaco.
- **Prefetch Otimizado**: `IntersectionObserver` configurado com `rootMargin: '150% 0px'` em sentinela posicionado no final da grade.
- **Deduplicação**: Itens recebidos são indexados por `photo.id` para impedir duplicações em cenários de re-tentativa.
- **Cancelamento Ativo**: Instâncias de `AbortController` cancelam requisições pendentes se a coleção for desmontada ou trocada.

---

## 7. Acessibilidade (WCAG 2.2 AA)

- **Foco e Modais**: Focus trap nas janelas modais (`PhotoLightbox`, `ShareDialog`, `DownloadDialog`, `FavoritesDialog`) com devolução de foco ao elemento acionador ao fechar.
- **Navegação por Teclado**: `ArrowLeft` e `ArrowRight` navegam entre fotos; `Escape` fecha modais e lightbox; `Space` pausa/retoma slideshow.
- **Movimento Reduzido**: A media query `prefers-reduced-motion` desativa transições espaciais e restringe durações de fade a <= 100ms.
- **Áreas de Toque**: Todos os controles interativos possuem dimensões mínimas de 44x44px.
