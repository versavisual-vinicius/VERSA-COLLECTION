# SPEC — Galeria Digital para Clientes

**Status:** Draft executável  
**Versão:** 1.0.0  
**Data:** 26/10/2026  
**Referência funcional:** galeria Pixieset “OTICAS ELOY – NAT”  
**Stack-alvo proposta:** React, Vite, TypeScript e Tailwind CSS  

---

## 1. Intenção

Construir uma galeria digital de entrega fotográfica com experiência editorial, responsiva e focada no cliente. O produto deve preservar a imersão visual da referência analisada, permitir exploração fluida de coleções grandes e oferecer favoritos, download, compartilhamento e slideshow sem desviar a atenção das imagens.

A especificação usa comportamento observado na galeria de referência como contrato de paridade. Onde a referência apresenta limitações técnicas ou de acessibilidade, esta especificação define uma implementação melhor, sem alterar a experiência visual central.

## 2. Resultado esperado

O visitante deve conseguir:

1. Abrir a coleção por uma URL pública exclusiva.
2. Entender imediatamente o nome da coleção e a autoria.
3. Entrar na galeria a partir de uma capa em tela cheia.
4. Explorar todas as fotos sem paginação manual.
5. Abrir qualquer foto em visualização ampliada.
6. Navegar entre imagens por toque, gesto, mouse e teclado.
7. Favoritar, baixar ou compartilhar fotos individuais.
8. Baixar a coleção quando autorizado.
9. Iniciar e pausar uma apresentação automática.
10. Compartilhar a coleção por link ou aplicativos externos.

## 3. Escopo

### 3.1 Incluído

- Página pública da coleção.
- Capa editorial responsiva.
- Cabeçalho contextual com recolhimento automático.
- Grade masonry responsiva.
- Carregamento progressivo da coleção.
- Ações por fotografia.
- Lightbox com URL profunda.
- Slideshow.
- Favoritos.
- Download individual e da coleção.
- Compartilhamento.
- Estados de carregamento, vazio, erro e acesso restrito.
- Acessibilidade por teclado e leitores de tela.
- Instrumentação mínima de eventos do produto.

### 3.2 Fora do escopo desta versão

- Painel administrativo completo.
- Upload e processamento de originais.
- Loja de impressões.
- Cobrança e assinatura.
- Editor de temas para o fotógrafo.
- CRM e envio de campanhas.
- Edição ou tratamento de imagens.

## 4. Princípios do produto

1. **A fotografia ocupa o primeiro plano.** Elementos de interface devem desaparecer quando não forem necessários.
2. **Sem perda de contexto.** Abrir, fechar ou compartilhar uma foto deve preservar a posição na coleção.
3. **Progressivo por padrão.** A primeira tela deve carregar rapidamente; o restante entra conforme a navegação.
4. **Paridade entre dispositivos.** Desktop e mobile oferecem as mesmas ações, adaptadas ao método de entrada.
5. **URL como estado.** Coleção e foto aberta devem ser recuperáveis por link e histórico do navegador.
6. **Ações reversíveis.** Favoritos podem ser desmarcados; fechar a lightbox retorna ao ponto anterior.

## 5. Estrutura da interface

```text
GalleryPage
├── PreviewBanner                     opcional; apenas para proprietário
├── GalleryHero
│   ├── ResponsiveCoverImage
│   ├── CoverOverlay
│   ├── CollectionTitle
│   ├── EnterGalleryButton
│   └── BusinessSignature
├── AutoHideGalleryHeader
│   ├── CollectionIdentity
│   ├── FavoriteAccess
│   ├── CollectionDownload
│   └── OverflowMenu
├── InfiniteMasonryGrid
│   └── GalleryPhoto
│       ├── ResponsivePhoto
│       └── PhotoActions
├── PhotoLightbox
│   ├── MediaStage
│   ├── LightboxToolbar
│   ├── PreviousNextNavigation
│   ├── PhotoCaption
│   └── SlideshowController
├── ShareDialog
├── DownloadDialog
├── FavoritesDialog
├── ToastRegion
└── BrandingFooter
```

## 6. Rotas e estado de URL

| Rota | Estado |
|---|---|
| `/g/:collectionSlug` | Capa ou grade da coleção |
| `/g/:collectionSlug?photo=:photoId` | Lightbox aberta na foto indicada |
| `/g/:collectionSlug?photo=:photoId&mode=slideshow` | Slideshow iniciado |
| `/g/:collectionSlug/favorites` | Lista de favoritos do visitante |
| `/g/:collectionSlug/download` | Autorização e preparação do download |

Regras:

- Abrir uma foto executa `pushState`.
- Fechar a lightbox restaura a URL da coleção.
- Se a sessão começou por uma URL profunda com `photo`, fechar remove `photo` e `mode` com `replaceState`; nunca executa `history.back()` para fora do produto.
- Avançar ou voltar entre fotos usa `replaceState` para evitar poluir o histórico.
- Atualizar a página com `photo` válido reabre a lightbox.
- `photo` inexistente remove o parâmetro e exibe aviso não bloqueante.
- A posição da grade deve ser restaurada ao fechar a lightbox ou usar o botão Voltar.

## 7. Contratos de dados

```ts
type CollectionVisibility = 'public' | 'password' | 'client-only' | 'hidden';

type PageCursor = string;

interface ResponsiveImage {
  alt: string;
  width: number;
  height: number;
  dominantColor?: string;
  blurDataUrl?: string;
  sources: ImageSource[];
}

interface GalleryCollection {
  id: string;
  slug: string;
  title: string;
  businessName: string;
  businessUrl?: string;
  cover: ResponsiveImage;
  coverFocalPoint: { x: number; y: number };
  visibility: CollectionVisibility;
  passwordRequired: boolean;
  favoritesEnabled: boolean;
  downloads: DownloadPolicy;
  sharingEnabled: boolean;
  slideshowEnabled: boolean;
  totalItems: number;
  locale: string;
  theme: GalleryTheme;
}

interface GalleryPhoto {
  id: string;
  fileName: string;
  alt: string;
  width: number;
  height: number;
  dominantColor?: string;
  blurDataUrl?: string;
  sources: ImageSource[];
  downloadUrl?: string;
  shareUrl: string;
  caption?: string;
  position: number;
  positionTieBreaker: string;
}

interface ImageSource {
  url: string;
  width: number;
  height: number;
  format: 'avif' | 'webp' | 'jpeg';
}

interface GalleryPageResponse {
  items: GalleryPhoto[];
  nextCursor: PageCursor | null;
  totalItems: number;
}

interface FavoriteRecord {
  photoId: string;
  selected: boolean;
  updatedAt: string;
}

interface DownloadPolicy {
  enabled: boolean;
  individualEnabled: boolean;
  collectionEnabled: boolean;
  requiresEmail: boolean;
  requiresPin: boolean;
  allowedSizes: Array<'original' | '3600' | '2048' | '1024' | '640'>;
}

interface GalleryTheme {
  headingFont: string;
  bodyFont: string;
  foreground: string;
  background: string;
  gridGapDesktop: number;
  gridGapMobile: number;
  coverOverlayOpacity: number;
}
```

`foreground` é aplicado a textos e controles sobre `background`. Sobre a capa e a lightbox, os controles usam tokens próprios de alto contraste validados nos estados normal, hover, foco e desabilitado.

### 7.1 Ordenação

- Ordenação primária: `position` crescente.
- Desempate obrigatório: `positionTieBreaker` crescente e estável.
- A API nunca deve depender da ordem física do banco.

### 7.2 API mínima

| Método e rota | Resultado |
|---|---|
| `GET /api/gallery/:slug` | Metadados públicos ou desafio de acesso |
| `POST /api/gallery/:slug/session/password` | Cria sessão após validar senha |
| `POST /api/gallery/:slug/session/email` | Envia código ou magic link quando necessário |
| `POST /api/gallery/:slug/session/verify` | Verifica código e vincula contato |
| `GET /api/gallery/:slug/photos?cursor=&limit=` | `GalleryPageResponse` |
| `PUT /api/gallery/:slug/favorites/:photoId` | Marca favorito de forma idempotente |
| `DELETE /api/gallery/:slug/favorites/:photoId` | Remove favorito de forma idempotente |
| `POST /api/gallery/:slug/favorites/merge` | Une visitante anônimo ao contato autenticado |
| `POST /api/gallery/:slug/downloads` | Cria job de download individual ou completo |
| `GET /api/gallery/:slug/downloads/:jobId` | Retorna estado do job e URL assinada quando pronta |
| `POST /api/gallery/:slug/share-links` | Cria link curto da coleção ou fotografia |

Envelope de erro:

```ts
interface ApiError {
  code:
    | 'NOT_FOUND'
    | 'HIDDEN'
    | 'PASSWORD_REQUIRED'
    | 'INVALID_PASSWORD'
    | 'CLIENT_AUTH_REQUIRED'
    | 'INVALID_PIN'
    | 'DOWNLOAD_DISABLED'
    | 'SIZE_UNAVAILABLE'
    | 'RATE_LIMITED'
    | 'TEMPORARILY_UNAVAILABLE';
  message: string;
  retryAfterSeconds?: number;
  requestId: string;
}
```

Paginação:

- Cursor opaco, nunca calculado pelo cliente.
- `limit=16` na primeira requisição e `limit=8` nas seguintes.
- Respostas repetidas devem ser deduplicadas por `photo.id`.
- Requisições em andamento devem ser canceladas ao trocar de coleção ou desmontar a página.

### 7.3 Sessão e identidade

- Visitante anônimo recebe `visitorId` aleatório em cookie `SameSite=Lax`, `Secure` em produção, com duração de 30 dias.
- Sessão de senha é armazenada em cookie `HttpOnly`, `Secure`, `SameSite=Lax`, com duração de 12 horas.
- Sessão de contato autenticado dura 30 dias ou até revogação pelo servidor.
- Cinco senhas inválidas em 15 minutos bloqueiam novas tentativas por 15 minutos para a combinação visitante/coleção.
- Favoritos anônimos são sincronizados no servidor pelo `visitorId`.
- Após autenticação, a fusão usa união dos conjuntos; um favorito existente nunca é apagado silenciosamente.

### 7.4 Job de download

```ts
type DownloadJobStatus = 'validating' | 'queued' | 'preparing' | 'ready' | 'failed' | 'expired';

interface DownloadJob {
  id: string;
  status: DownloadJobStatus;
  progress?: number;
  expiresAt?: string;
  signedUrl?: string;
  errorCode?: string;
}
```

- Criação retorna `202 Accepted` e o `DownloadJob`.
- Consulta usa polling com backoff de 2, 4, 8 e máximo de 15 segundos.
- A URL final expira em 15 minutos.
- O job pode permanecer consultável por 24 horas.
- Notificação por e-mail é opcional e não substitui a consulta de estado.

### 7.5 Link curto

- O backend cria um identificador opaco e redireciona para a URL canônica.
- O link não expira enquanto a coleção estiver publicada.
- Se o serviço de link curto falhar, a interface copia a URL canônica e informa o fallback.

## 8. Requisitos funcionais

### RF-001 — Carregar coleção

- O sistema deve resolver a coleção pelo `collectionSlug`.
- Deve exibir skeleton apenas na região ainda sem dimensões conhecidas.
- Deve apresentar estados separados para coleção inexistente, oculta, protegida por senha e indisponível.
- A quantidade final renderizada deve ser igual a `totalItems`.

**Aceite:** uma coleção com 127 itens termina com exatamente 127 fotos navegáveis, sem duplicatas ou lacunas.

### RF-002 — Capa editorial

- A capa deve ocupar `100dvh` menos a barra de proprietário, quando presente.
- A imagem usa `object-fit: cover` e respeita o ponto focal configurado.
- Deve conter título, botão de entrada e assinatura da empresa.
- O botão leva ao início da grade e preserva foco acessível.

**Aceite desktop:** título centralizado, 52 px no viewport de 1154 × 875.  
**Aceite mobile:** título centralizado, 39 px no viewport de 390 × 844.

### RF-003 — Overlay da capa

A capa deve combinar:

```css
background-color: rgba(0, 0, 0, 0.2);
background-image: linear-gradient(
  transparent 0%,
  transparent 5%,
  rgba(0, 0, 0, 0.08) 45%,
  rgba(0, 0, 0, 0.5) 90%,
  rgba(0, 0, 0, 0.7) 100%
);
```

### RF-004 — Cabeçalho automático

- Desktop: 78 px de altura.
- Mobile: identidade compacta e ações essenciais.
- Ao rolar para baixo, o cabeçalho sai pelo topo.
- Ao rolar para cima, reaparece.
- Deve permanecer visível quando o usuário está no topo da grade.
- A transição deve durar 200 ms com `ease-in-out`.
- Ocultar após 24 px acumulados de scroll descendente.
- Reexibir após 12 px acumulados de scroll ascendente.
- Ignorar oscilações menores que 4 px para evitar tremulação.

### RF-005 — Grade masonry

- Desktop a partir de 900 px: quatro colunas.
- Tablet entre 600 e 899 px: três colunas.
- Mobile abaixo de 600 px: duas colunas.
- A proporção original da fotografia deve ser preservada.
- O grid não deve recortar imagens para forçar altura uniforme.
- Fotos horizontais e verticais devem ocupar a mesma largura de coluna.
- Cada foto é inserida na coluna com menor altura acumulada; empates escolhem a coluna mais à esquerda.
- A ordem do DOM permanece igual à ordenação da API, mesmo quando a posição visual é calculada por coluna.

Paridade de referência:

| Viewport | Colunas | Margem | Gap | Largura observada |
|---|---:|---:|---:|---:|
| 1154 px | 4 | 20 px | 6 px | 274 px |
| 390 px | 2 | 4 px | 4 px | 189 px |

### RF-006 — Carregamento progressivo

- Primeiro lote obrigatório: 16 itens, salvo quando a coleção tiver menos itens.
- Próximos lotes obrigatórios: até 8 itens.
- O próximo lote deve ser solicitado antes que o usuário alcance o final visível.
- Um lote não pode alterar a posição visual das fotos já renderizadas.
- A busca termina quando `loadedItems === totalItems`.
- A falha de um lote deve permitir nova tentativa sem duplicar itens.

### RF-007 — Ações da foto

- Desktop: ações aparecem no hover e no foco por teclado.
- Touch: ações aparecem por toque ou permanecem disponíveis na lightbox.
- Ações: favoritar, baixar e compartilhar.
- Cada alvo interativo deve medir pelo menos 44 × 44 px no touch.
- O gradiente inferior deve garantir contraste dos ícones.
- A imagem inteira é o primeiro elemento focalizável; as ações aparecem em seguida na ordem favorito, download e compartilhar.

### RF-008 — Lightbox

- Deve ocupar toda a viewport, com `z-index` reservado para overlays globais.
- Deve bloquear o scroll da página.
- A imagem deve usar contenção, sem corte.
- Deve aceitar fechar, anterior, próxima, favorito, download, compartilhar e slideshow.
- Deve suportar `Escape`, setas esquerda/direita e gestos horizontais.
- Deve manter foco preso dentro do overlay.
- Ao fechar, devolve o foco à foto de origem.

### RF-009 — Slideshow

- Inicia pela foto atualmente aberta.
- Fundo preto.
- Intervalo inicial: 4 segundos.
- Pausa ao perder visibilidade da aba.
- Pausa com interação manual e permite retomada.
- Controles desaparecem após 2 segundos de inatividade e reaparecem com movimento, toque ou tecla.
- Deve respeitar `prefers-reduced-motion`.

### RF-010 — Favoritos

- Favoritar deve ser otimista e reversível.
- Visitante anônimo recebe identificador persistido localmente.
- Quando autenticação por e-mail for exigida, o favorito pendente é preservado durante o fluxo.
- O cabeçalho deve indicar quando existem favoritos.
- O estado deve persistir após reload e funcionar offline de forma otimista, com fila de sincronização.
- Conflitos usam união por `photoId` e `updatedAt`; remoção explícita mais recente vence para o mesmo item.

### RF-011 — Download

- Download individual parte da foto selecionada.
- Download completo abre fluxo específico da coleção.
- Quando exigido, o visitante informa e-mail e PIN.
- O sistema deve informar que a preparação pode continuar em segundo plano.
- Estados: `idle`, `validating`, `preparing`, `ready`, `failed`, `expired`.
- O link final deve ter expiração e não expor caminho interno do arquivo.
- Tamanho indisponível deve ser desabilitado antes da submissão e explicado ao usuário.

### RF-012 — Compartilhamento

- Deve oferecer link curto, copiar link e compartilhamento nativo quando suportado.
- Fallback desktop: WhatsApp, Facebook, Messenger, e-mail, X, Pinterest e Threads.
- Copiar link deve confirmar sucesso por toast e região `aria-live`.
- Compartilhar foto inclui `photoId`; compartilhar coleção não inclui.
- Se `navigator.share` não existir ou for cancelado, o fluxo permanece aberto e oferece cópia ou destinos específicos.

## 9. Estados de interface

`PreviewBanner` só é renderizado em sessão autenticada de proprietário e nunca faz parte da galeria pública do cliente.

```ts
type GalleryScreenState =
  | { type: 'loading-collection' }
  | { type: 'password-required' }
  | { type: 'ready'; collection: GalleryCollection }
  | { type: 'loading-more'; loaded: number; total: number }
  | { type: 'partial-error'; retryCursor: string }
  | { type: 'empty' }
  | { type: 'not-found' }
  | { type: 'unavailable' };

type LightboxState =
  | { type: 'closed' }
  | { type: 'opening'; photoId: string }
  | { type: 'open'; photoId: string }
  | { type: 'slideshow'; photoId: string; paused: boolean }
  | { type: 'closing'; photoId: string };
```

## 10. Movimento

| Elemento | Duração | Curva |
|---|---:|---|
| Entrada da página | 200 ms | `ease-in` |
| Entrada do item da grade | 200 ms | `linear` |
| Ações sobre a foto | 200 ms | `ease-out` |
| Cabeçalho automático | 200 ms | `ease-in-out` |
| Botão da capa | 250 ms | `ease-out` |
| Abertura da lightbox | 180 ms | `ease-out` |
| Troca de foto | 160 ms | `ease-in-out` |

Com `prefers-reduced-motion: reduce`, transições espaciais devem ser removidas e fades limitados a 100 ms.

## 11. Responsividade

| Breakpoint | Comportamento |
|---|---|
| `< 600 px` | Duas colunas, gap 4 px, cabeçalho compacto, controles touch |
| `600–899 px` | Três colunas, margens de 12–16 px |
| `≥ 900 px` | Quatro colunas, margens de 20 px, ações por hover/foco |
| `≥ 1440 px` | Manter quatro colunas dentro de contêiner máximo de 1440 px, centralizado |

O layout deve usar `dvh` para a capa e considerar `safe-area-inset-*` em iOS.

## 12. Performance

### Metas

- RUM em produção, janela móvel de 28 dias e mínimo de 200 sessões elegíveis: LCP móvel até 2,5 s no percentil 75.
- RUM nas mesmas condições: CLS até 0,1 e INP até 200 ms no percentil 75.
- Laboratório de CI em perfil móvel intermediário: LCP até 3,0 s, CLS até 0,1 e TBT até 250 ms.
- O primeiro lote deve estar interativo antes de iniciar requisições de imagem dos lotes seguintes.
- Nenhuma imagem fora das duas próximas viewports deve ser carregada com prioridade alta.

### Contratos

- Todas as imagens devem declarar `width` e `height`.
- Usar `srcset` e `sizes`.
- Formatos preferenciais: AVIF, WebP e JPEG como fallback.
- Capa recebe `fetchpriority="high"`.
- Primeiras fotos recebem `loading="eager"` apenas quando visíveis inicialmente.
- Demais fotos usam `loading="lazy"` e `decoding="async"`.
- O masonry deve usar dimensões conhecidas antes do download para evitar reflow.
- O observador de paginação deve ter `rootMargin` suficiente para antecipar um lote.
- Padrão inicial de `rootMargin`: `150% 0px`; pode ser ajustado por telemetria sem alterar o contrato visual.

## 13. Acessibilidade

- O `alt` deve descrever o conteúdo visual ou ser vazio quando a foto for puramente decorativa.
- Nome de arquivo não pode ser usado como descrição final.
- Quando não houver descrição editorial, usar o fallback localizado `Fotografia {position} da coleção {title}`.
- Botões de ícone devem ter `aria-label` explícito.
- Modais usam `role="dialog"`, `aria-modal="true"` e título associado.
- A lightbox deve prender o foco e restaurá-lo ao fechar.
- Todas as funções devem operar por teclado.
- O contraste mínimo segue WCAG 2.2 AA.
- A auditoria de contraste deve cobrir capa, CTA, cabeçalho, hover, foco, lightbox, modais, estados de erro e toasts.
- Estado de favorito deve usar `aria-pressed`.
- Mudanças de download e cópia devem ser anunciadas em `aria-live="polite"`.
- O slideshow nunca deve iniciar automaticamente ao abrir a coleção.

## 14. Segurança e privacidade

- URLs de originais e pacotes devem ser assinadas e expirar.
- PIN e senha nunca entram em logs de analytics.
- E-mail de download deve ser armazenado apenas segundo a política declarada.
- Compartilhamento não pode incluir tokens administrativos.
- Acesso `client-only` deve ser validado no servidor.
- O frontend não deve considerar uma coleção pública apenas por possuir o JSON local.

## 15. Telemetria

Eventos mínimos:

```text
gallery_viewed
gallery_entered
gallery_batch_loaded
photo_opened
photo_navigated
photo_favorited
photo_unfavorited
photo_download_started
collection_download_started
share_opened
share_completed
slideshow_started
slideshow_paused
gallery_error
```

Cada evento deve incluir somente identificadores técnicos, origem da ação e tipo de dispositivo. E-mail, PIN, senha e nome do arquivo não devem ser enviados.

Campos comuns: `eventName`, `schemaVersion`, `collectionId`, `photoId?`, `visitorIdHash`, `deviceClass`, `inputMethod`, `source`, `timestamp`. A coleta respeita consentimento aplicável e deve poder ser desativada sem quebrar o produto.

Textos de interface usam catálogo de mensagens. O locale padrão é `pt-BR`, definido por `GalleryCollection.locale`, com fallback para `pt-BR`; textos operacionais não ficam embutidos nos componentes.

## 16. Critérios globais de aceite

### CA-001 — Paridade desktop

Em viewport de 1154 × 875:

- Capa ocupa 853 px abaixo da barra de proprietário.
- Grade exibe quatro colunas de 274 px.
- Colunas iniciam aproximadamente em `x = 20, 300, 580, 860`.
- Cabeçalho mede 78 px.
- Ações aparecem no hover e foco.
- Tolerância geométrica: ±2 px nas medidas principais.
- Comparação de screenshot: diferença máxima de 1% dos pixels após mascarar fotografias dinâmicas e cursores.

### CA-002 — Paridade mobile

Em viewport de 390 × 844:

- Capa ocupa 822 px abaixo da barra superior.
- Grade exibe duas colunas de aproximadamente 189 px.
- Margem externa de 4 px e gap de 4 px.
- Nenhum scroll horizontal.
- Controles têm área tocável mínima de 44 px.
- Os limites 599, 600, 899, 900 e 1440 px não podem produzir scroll horizontal ou sobreposição.

### CA-003 — Integridade dos dados

- Após `nextCursor === null`, `renderedPhotoIds` deve ser idêntico ao conjunto retornado pela API.
- A ordem deve respeitar `position`.
- Empates devem respeitar `positionTieBreaker`.
- Não pode haver IDs duplicados.
- A contagem final deve coincidir com `totalItems`.

### CA-004 — Navegação

- Atualizar uma URL com foto aberta restaura a mesma foto.
- Voltar fecha a lightbox antes de sair da coleção.
- Fechar restaura scroll e foco.
- Setas e swipe respeitam início e fim da coleção.

### CA-005 — Falhas

- Falha de lote não remove fotos carregadas.
- Retry não duplica itens.
- Falha de download apresenta nova tentativa.
- Imagem quebrada apresenta placeholder com proporção preservada.
- Requisições pendentes são canceladas ao trocar de coleção ou fechar a página.

### CA-006 — Acesso e identidade

- Senha correta cria sessão; incorreta informa erro sem revelar existência de contatos.
- Bloqueio temporário é aplicado após cinco falhas no intervalo definido.
- Acesso `client-only` só libera a coleção após verificação do contato.
- Favoritos persistem após reload e são unidos após autenticação.

### CA-007 — Download e compartilhamento

- Download percorre `validating → queued/preparing → ready`, ou termina em `failed/expired` com recuperação explícita.
- PIN inválido e tamanho indisponível produzem erros específicos.
- Link de coleção não contém `photo`; link de foto contém `photo` válido.
- Falha no encurtador copia a URL canônica.

## 17. Cenários de teste de aceitação

```gherkin
Feature: Exploração da coleção

  Scenario: Carregar uma coleção completa progressivamente
    Given uma coleção pública com 127 fotografias
    When o visitante abre a coleção
    Then o primeiro lote deve conter 16 fotografias
    When o visitante percorre a página até o final
    Then todas as 127 fotografias devem estar disponíveis
    And nenhuma fotografia deve estar duplicada

  Scenario: Abrir e fechar uma fotografia
    Given o visitante está na grade
    When abre a fotografia de posição 12
    Then a lightbox deve mostrar a fotografia 12
    And a URL deve identificar essa fotografia
    When fecha a lightbox
    Then a URL deve voltar para a coleção
    And a grade deve manter a posição anterior

  Scenario: Usar a galeria pelo teclado
    Given a lightbox está aberta
    When o visitante pressiona ArrowRight
    Then a próxima fotografia deve ser exibida
    When pressiona Escape
    Then a lightbox deve fechar
    And o foco deve voltar para a fotografia de origem

  Scenario: Recuperar falha no carregamento progressivo
    Given dois lotes foram carregados
    And o próximo lote falhou
    When o visitante seleciona tentar novamente
    Then o carregamento deve continuar do cursor anterior
    And os itens existentes não devem mudar de ordem

  Scenario: Fechar uma URL profunda sem sair do produto
    Given o visitante entrou diretamente por uma URL com photo
    When fecha a lightbox
    Then photo e mode devem ser removidos com replaceState
    And o navegador não deve voltar para um site externo

Feature: Acesso e identidade

  Scenario: Desbloquear coleção protegida
    Given uma coleção protegida por senha
    When o visitante envia a senha correta
    Then uma sessão segura deve ser criada
    And a coleção deve ser exibida

  Scenario: Limitar tentativas de senha
    Given quatro tentativas inválidas nos últimos 15 minutos
    When o visitante envia uma quinta senha inválida
    Then novas tentativas devem ficar bloqueadas por 15 minutos
    And a resposta não deve revelar dados de contato

  Scenario: Unir favoritos após autenticação
    Given o visitante marcou fotos anonimamente
    And possui outros favoritos salvos no servidor
    When conclui a verificação de contato
    Then a seleção final deve ser a união dos dois conjuntos

Feature: Ações do cliente

  Scenario: Preparar download da coleção
    Given o download da coleção está habilitado
    When o visitante solicita um tamanho permitido
    Then o job deve evoluir até ready ou failed
    And uma URL assinada pronta deve expirar em 15 minutos

  Scenario: Recuperar download expirado
    Given o job ou a URL assinada expirou
    When o visitante tenta baixar
    Then deve receber a ação Preparar novamente

  Scenario: Compartilhar uma foto
    Given uma foto está aberta
    When o visitante copia o link da foto
    Then a URL canônica deve conter o photo correto
    And uma falha no encurtador não deve impedir a cópia

  Scenario: Favoritar offline
    Given o visitante está temporariamente offline
    When marca uma fotografia como favorita
    Then a interface deve atualizar de forma otimista
    And a alteração deve entrar na fila de sincronização

Feature: Estados e responsividade

  Scenario Outline: Preservar layout nos limites responsivos
    Given a viewport possui <largura> px
    When a coleção é renderizada
    Then não deve existir scroll horizontal
    And os controles não devem se sobrepor

    Examples:
      | largura |
      | 599     |
      | 600     |
      | 899     |
      | 900     |
      | 1440    |

  Scenario: Exibir coleção vazia
    Given uma coleção acessível sem fotografias
    When a página termina de carregar
    Then deve exibir um estado vazio localizado
    And não deve iniciar paginação

  Scenario: Negar coleção oculta
    Given uma coleção hidden sem sessão administrativa
    When o visitante tenta acessá-la
    Then o servidor não deve entregar metadados nem fotos

Feature: Acessibilidade e movimento

  Scenario: Operar modal somente pelo teclado
    Given um diálogo está aberto
    When o visitante navega com Tab e Shift+Tab
    Then o foco deve permanecer dentro do diálogo
    When pressiona Escape
    Then o diálogo deve fechar e restaurar o foco

  Scenario: Respeitar redução de movimento
    Given o sistema prefere movimento reduzido
    When o visitante abre a lightbox e inicia o slideshow
    Then transições espaciais devem ser removidas
    And fades não devem ultrapassar 100 ms

Feature: Operação e privacidade

  Scenario: Cancelar requisições ao sair da coleção
    Given há paginação e preparação de download em andamento
    When o visitante troca de coleção
    Then requisições de leitura pendentes devem ser canceladas
    And a interface anterior não deve receber atualizações tardias

  Scenario: Registrar telemetria sem dados sensíveis
    Given o visitante concedeu o consentimento aplicável
    When conclui um compartilhamento
    Then share_completed deve conter os campos comuns do schema
    And não deve conter email, senha, PIN ou nome de arquivo
```

## 18. Estratégia de implementação

### Abordagem escolhida

Aplicação React cliente com API desacoplada, estado de URL explícito e layout masonry orientado por dimensões conhecidas. Essa abordagem mantém a experiência observada e evita herdar a dependência antiga de jQuery e Bootstrap.

### Alternativas consideradas

1. **Clonar o comportamento legado com jQuery:** maior proximidade estrutural com a referência, porém pior manutenção, acessibilidade e tipagem.
2. **Usar somente CSS Columns:** implementação simples, mas a ordem visual por coluna diverge da ordem de leitura e dificulta restauração precisa.
3. **React com masonry calculado:** maior controle de ordem, paginação, URL, acessibilidade e dimensões. Escolhida como padrão da especificação.

## 19. Sequência recomendada

1. Contratos de dados e fixtures integrais.
2. Capa e cabeçalho responsivo.
3. Masonry com dimensões conhecidas.
4. Paginação progressiva e recuperação de erro.
5. Lightbox e sincronização da URL.
6. Favoritos, compartilhamento e download.
7. Slideshow.
8. Acessibilidade e teclado.
9. Instrumentação.
10. Validação visual nos dois viewports canônicos.

## 20. Definition of Done

- Todos os requisitos funcionais possuem teste de aceitação.
- Os 127 itens da fixture de paridade carregam integralmente.
- Desktop e mobile passam por comparação visual.
- Fluxos de teclado, toque e mouse estão validados.
- Não existem erros de console nos fluxos principais.
- Core Web Vitals atendem às metas definidas.
- Auditoria WCAG 2.2 AA não apresenta bloqueadores.
- Downloads e URLs temporárias expiram conforme contrato.
- Nenhum dado sensível aparece na telemetria.

---

## Registro de origem

Os valores de paridade visual, comportamento do masonry, carregamento progressivo, lightbox, slideshow e compartilhamento foram observados diretamente na galeria de referência em 26/10/2026. Melhorias de semântica, imagens responsivas, acessibilidade, segurança e performance são decisões propostas para a nova implementação.
