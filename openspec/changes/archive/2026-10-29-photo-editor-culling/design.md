# Design: Photo Editor & Culling Workspace

## Context

A auditoria cirúrgica REA identificou o Alvo 3 (`editor.pixieset.com`) como uma aplicação React desacoplada com workspace de culling, atalhos de teclado para triagem massiva de fotografias e catálogo de estilos visuais. O projeto VERSA-COLLECTION já possui acervos fotográficos, metadados de orientação e integração SPA no mesmo ecossistema.

## Goals / Non-Goals

**Goals:**
- Implementar workspace SPA `/editor` (`?view=editor`) com alternância entre visualização Loupe (Canvas) e Filmstrip inferior.
- Implementar motor de triagem com atalhos de teclado de latência zero: `1`-`5` (estrelas), `0` (remover estrelas), `P` (Pick/Aprovada), `X` (Reject/Rejeitada), `U` (Unflag), `ArrowLeft`/`ArrowRight` (navegação).
- Persistência reativa das decisões de triagem no `localStorage` sob a chave `versa_culling_<collectionSlug>`.
- Barra de filtros de culling: Todas, Apenas Escolhidas (Picks), Não Rejeitadas, Classificadas (>= 3 estrelas).
- Catálogo de Estilos Editoriais Versa Visual com filtros instantâneos em tempo real (Versa Editorial Teal, B&W Noir 35mm, Warm Golden Hour, Clean Natural Light).
- Ação de exportação da lista de aprovadas (formato TXT/JSON ou geração de lista para o cliente).

**Non-Goals:**
- Renderização pesada de RAW de 45 megapixels via WebAssembly nesta etapa (o frontend consome WebP/JPEG otimizados de alta fidelidade).
- Ajustes finos de curvas RGB por canais individuais.

## Decisions

### 1. Hook de Teclado com Proteção Anti-Conflito (`useCullingHotkeys`)
- **Decisão**: Criar um hook dedicado que escuta eventos `keydown` globais no `window`, verificando se `event.target` é um elemento de formulário (`INPUT`, `TEXTAREA`, `SELECT`) antes de acionar comandos de culling.
- **Alternativas consideradas**: Escutar apenas no contêiner do Canvas com `tabIndex`: causaria perda de atalhos sempre que o usuário clicasse fora da imagem.

### 2. Sincronização Bidirecional com Filmstrip Virtualizado/Scroll Suave
- **Decisão**: O filmstrip inferior monitora a foto ativa e executa `scrollIntoView({ behavior: 'smooth', inline: 'center' })` na miniatura correspondente sempre que a seleção muda (seja por clique ou por seta do teclado).

### 3. Filtros de Estilos Editoriais via CSS Shaders/Filters
- **Decisão**: Aplicar os estilos editoriais através de filtros CSS compostos (`contrast`, `brightness`, `saturate`, `sepia`, `hue-rotate`), garantindo renderização instantânea a 60 FPS sem latência de decodificação.

## Risks / Trade-offs

- **[Conflito de atalhos de navegação do browser]** → Suprimir apenas teclas de interesse com `e.preventDefault()` (`ArrowLeft`, `ArrowRight`, `Space`) quando o workspace estiver em primeiro plano.
- **[Acervos grandes com centenas de fotos]** → Filtragem rápida em memória utilizando referências estáveis de índice.
