# Proposal: Photo Editor & Culling Workspace

## Why

Com a consolidação do Hub do Estúdio, da Biblioteca de Fotos e do Assistente de Criação de Coleções, a última fronteira de paridade com os 3 alvos investigados na auditoria Pixieset é o aplicativo dedicado **Photo Editor** (`editor.pixieset.com`). Fotógrafos profissionais precisam de um fluxo de trabalho ultra-rápido de culling (triagem e seleção fotográfica) com atalhos de teclado de latência zero (Picks/Rejects, 1-5 estrelas, rótulos de cor), filmstrip responsivo, canvas de inspeção individual e presets de estilo editorial.

## What Changes

- **Módulo SPA `/editor` (`?view=editor`)**:
  - Workspace integrado com painel de ferramentas lateral, área de inspeção canvas e filmstrip inferior navegável.
- **Motor de Culling & Atalhos de Teclado (Latência Zero)**:
  - Atalhos numéricos `1` a `5` para classificação por estrelas; `0` para limpar.
  - Teclas `P` (Pick/Aprovada), `X` (Reject/Rejeitada), `U` (Unflag/Neutro).
  - Teclas de navegação: `ArrowLeft` / `ArrowRight` para anterior/próxima foto.
  - Alternância de filtro rápido (Todas, Apenas Picks, Classificadas com >= 3 estrelas, Rejeitadas).
- **Painel de Estilos Editoriais Versa Visual**:
  - Seletor de estilos fotográficos (`Versa Editorial Teal`, `B&W Noir 35mm`, `Warm Golden Hour`, `Clean Natural Light`) com filtros visuais instantâneos em CSS/Canvas.
- **Ações de Seleção & Exportação**:
  - Contador de fotos selecionadas e botão de exportação da lista de aprovadas (formato TXT/JSON ou geração direta de coleção no catálogo).
- **Integração SPA**:
  - Nova rota `/editor` e botão de acesso direto a partir do `ProductHubGrid` no Dashboard e barra superior.

## Capabilities

### New Capabilities
- `photo-editor-culling`: Workspace de edição e triagem rápida de fotografias com atalhos de teclado para estrelas/flags, filmstrip interativo e aplicação de estilos editoriais.

### Modified Capabilities

## Impact

- Novas rotas SPA: `/editor`, `?view=editor`.
- Novos componentes: `PhotoEditorPage.tsx`, `CullingCanvas.tsx`, `FilmstripBar.tsx`, `CullingToolbar.tsx`, `StylePresetPanel.tsx`.
- Atalhos de teclado globais no canvas protegidos contra disparos acidentais quando inputs de texto estiverem focados.
