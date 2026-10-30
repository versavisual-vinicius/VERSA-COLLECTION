# collection-creation Specification

## Purpose

Permite aos fotógrafos criar e configurar novas coleções de clientes de forma guiada em 3 etapas com validação atômica, personalização de capa e suporte a acervo demonstrativo instantâneo.

## Requirements

### Requirement: Event Details Step Validation

O sistema SHALL validar e sanitizar os dados cadastrais básicos da coleção (título, slug único, data do evento e e-mail de contato do cliente) na primeira etapa do assistente.

#### Scenario: Preenchimento válido dos dados do evento

- **WHEN** o fotógrafo informa título válido ("Casamento Marina e Lucas"), data do evento e e-mail do cliente
- **THEN** o slug URL-friendly é autogerado em tempo real e o botão de avançar para a etapa 2 é habilitado

#### Scenario: Bloqueio de avanço com campos obrigatórios vazios

- **WHEN** o título da coleção estiver em branco ou contiver apenas espaços
- **THEN** o sistema exibe aviso inline de campo obrigatório e bloqueia o avanço para a etapa 2

### Requirement: Cover and Focal Point Configuration

O sistema SHALL permitir a escolha ou upload da foto de capa e a definição interativa do ponto focal x/y com pré-visualização em tempo real da sobreposição editorial.

#### Scenario: Ajuste do ponto focal da capa

- **WHEN** o fotógrafo clica na área da imagem de capa no seletor de ponto focal
- **THEN** as coordenadas x e y são gravadas e refletidas dinamicamente na pré-visualização do Hero

#### Scenario: Cobertura padrão quando nenhuma capa for enviada

- **WHEN** o fotógrafo avança sem fazer upload de imagem personalizada
- **THEN** o sistema aplica uma imagem de capa neutra padrão do catálogo editorial Versa Visual

### Requirement: Layout Preset and Demo Collection Seeding

O sistema SHALL oferecer a escolha do preset de grade visual e permitir a injeção instantânea de fotografias de exemplo para testes imediatos da galeria.

#### Scenario: Criação com injeção de acervo demonstrativo

- **WHEN** o fotógrafo marca a opção "Criar com fotos de exemplo" e conclui a criação
- **THEN** a nova coleção é registrada no backend já populada com as fotos de demonstração e o usuário é redirecionado para a galeria recém-criada

#### Scenario: Criação de coleção em branco

- **WHEN** o fotógrafo desmarca a opção demonstrativa e conclui a criação
- **THEN** a nova coleção é persistida com 0 fotos e redirecionada para a página da coleção em modo de upload
