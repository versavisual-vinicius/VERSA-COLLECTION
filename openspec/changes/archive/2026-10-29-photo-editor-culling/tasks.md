# Tasks

## 1. Fundação de Culling & Hook de Atalhos de Teclado

- [x] 1.1 Criar tipos de triagem e hook `src/hooks/useCullingHotkeys.ts` com suporte a atalhos de latência zero (`1`-`5`, `0`, `P`, `X`, `U`, setas de navegação).
- [x] 1.2 Implementar módulo de persistência `src/lib/cullingStorage.ts` com suporte a carregamento e salvamento reativo no `localStorage`.

## 2. Componentes do Workspace (Editor & Culling)

- [x] 2.1 Criar componente `src/components/PhotoEditor/CullingCanvas.tsx` com renderização em alta resolução, badges visuais de status e suporte a filtros de estilo.
- [x] 2.2 Criar componente `src/components/PhotoEditor/FilmstripBar.tsx` com miniaturas horizontais, selos de estrelas/flag e scroll suave sincronizado.
- [x] 2.3 Criar componente `src/components/PhotoEditor/CullingToolbar.tsx` com filtros rápidos (Todas, Picks, Não Rejeitadas, Estrelas) e contadores de seleção.
- [x] 2.4 Criar componente `src/components/PhotoEditor/StylePresetPanel.tsx` com os 4 presets editoriais Versa Visual.
- [x] 2.5 Criar página principal `src/components/PhotoEditor/PhotoEditorPage.tsx` orquestrando o fluxo completo de triagem e diálogo de exportação.

## 3. Integração SPA & Roteamento

- [x] 3.1 Registrar rota `/editor` e parâmetro `?view=editor` em `src/App.tsx`.
- [x] 3.2 Conectar atalhos no `ProductHubGrid.tsx` e `DashboardPage.tsx` para abrir o Photo Editor.

## 4. Testes Automatizados & Verificação Completa

- [x] 4.1 Criar suíte de testes `src/test/Fase17_PhotoEditorCulling.test.tsx` validando comandos de teclado, filtragem, filmstrip e estilos.
- [x] 4.2 Executar suíte completa `pnpm check` garantindo zero warnings, zero erros de tipo, 100% dos testes verdes e build de produção válido.
