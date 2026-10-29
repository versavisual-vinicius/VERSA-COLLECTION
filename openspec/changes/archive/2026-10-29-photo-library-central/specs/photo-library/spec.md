# Spec Delta: photo-library

## Purpose

Define a biblioteca central de fotografias do fotógrafo, permitindo navegação consolidada do acervo, busca em tempo real entre coleções e cancelamento resiliente de requisições concorrentes.

## ADDED Requirements

### Requirement: Global Photo Catalog
O sistema MUST (DEVE) disponibilizar uma visão agregada e paginada de todas as fotografias pertencentes a todas as coleções cadastradas.

#### Scenario: Visualização inicial da biblioteca
- **WHEN** o fotógrafo acessa a rota /photos
- **THEN** o sistema exibe a contagem total de fotos do acervo e renderiza a grade inicial de fotografias com metadados e coleção de origem

#### Scenario: Acervo vazio
- **WHEN** o fotógrafo acessa a rota /photos e não há fotografias cadastradas
- **THEN** o sistema exibe o estado vazio editorial orientando o fotógrafo a criar sua primeira coleção

### Requirement: Debounced Search with Abort Controller
O sistema MUST (DEVE) cancelar requisições de busca pendentes anteriores quando o usuário insere novos termos na caixa de pesquisa.

#### Scenario: Digitação rápida de termos de busca
- **WHEN** o fotógrafo digita caracteres subsequentes na barra de pesquisa antes da resposta anterior finalizar
- **THEN** o sistema aborta a requisição HTTP em andamento via AbortController e dispara nova consulta para o termo mais recente

#### Scenario: Busca sem resultados
- **WHEN** o termo pesquisado não corresponder a nenhuma fotografia
- **THEN** o sistema exibe mensagem informativa indicando que nenhuma foto foi encontrada para o filtro informado

### Requirement: Orientation and Collection Filtering
O sistema MUST (DEVE) permitir filtrar fotografias por coleção de origem e por orientação de imagem (todas, retrato, paisagem).

#### Scenario: Filtragem por orientação
- **WHEN** o fotógrafo seleciona o filtro "Retrato"
- **THEN** a grade atualiza imediatamente exibindo apenas fotografias cuja altura seja superior à largura
