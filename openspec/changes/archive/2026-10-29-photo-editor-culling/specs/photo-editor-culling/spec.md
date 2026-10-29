# Spec Delta

## Purpose

Permite aos fotógrafos realizar a triagem rápida (culling) e visualização de fotografias em tela cheia com atalhos de teclado de alta velocidade para classificação por estrelas, status de aprovação/rejeição e aplicação de estilos visuais editoriais.

## ADDED Requirements

### Requirement: Keyboard Driven Culling Actions
O sistema SHALL processar atalhos de teclado imediatos para atribuir estrelas (0 a 5), status de seleção (P para Pick, X para Reject, U para Unflag) e navegação direcional entre fotos.

#### Scenario: Atribuição de status Pick e estrelas via teclado
- **WHEN** o fotógrafo pressiona a tecla 'P' ou um número entre '1' e '5' com uma foto selecionada no canvas
- **THEN** a foto recebe imediatamente o status de aprovação ou o número correspondente de estrelas e a interface atualiza o selo visual

#### Scenario: Navegação direcional entre fotografias
- **WHEN** o fotógrafo pressiona as teclas 'ArrowRight' ou 'ArrowLeft'
- **THEN** o foco transiciona para a próxima ou anterior fotografia na ordem da grade sem recarregar a tela

### Requirement: Filmstrip and Canvas Synchronization
O sistema SHALL sincronizar bidirecionalmente a foto em destaque no canvas principal com a barra de miniaturas (filmstrip) inferior, garantindo visibilidade do item ativo com auto-scroll.

#### Scenario: Seleção de foto na barra de miniaturas
- **WHEN** o fotógrafo clica em uma miniatura no filmstrip inferior
- **THEN** a foto é imediatamente carregada em alta resolução no canvas central e a miniatura recebe contorno de destaque ativo

#### Scenario: Filtragem por status de triagem
- **WHEN** o fotógrafo ativa o filtro "Apenas Escolhidas" (Picks)
- **THEN** o canvas e o filmstrip passam a exibir exclusivamente as fotos marcadas com status Pick

### Requirement: Editorial Style Preset Preview
O sistema SHALL disponibilizar presets de estilo editorial com ajustes visuais em tempo real aplicados diretamente sobre o canvas de visualização.

#### Scenario: Aplicação de estilo editorial
- **WHEN** o fotógrafo seleciona o preset "B&W Noir 35mm" no painel lateral
- **THEN** o canvas aplica o tratamento visual correspondente sobre a imagem ativa sem alterar o arquivo original no servidor
