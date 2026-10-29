# Roadmap de Implementação (ROADMAP.md)

## Fase 1: Fundação e Galeria Pública
- [x] Engenharia reversa e levantamento de contratos da aplicação Pixieset.
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

## Fase 13: Endurecimento de Contratos & Transações (Padrão REA 6.8.0)
- [x] Validação estrita de contratos de entrada e saída com Zod (política fail-closed sem fallbacks silenciosos).
- [x] Transações atômicas com `rollback()` determinístico em migrações e persistência de dados no PostgreSQL/AlloyDB.
- [x] Expurgo de mutações DDL (`CREATE TABLE`) de handlers HTTP para migrations versionadas.

## Fase 14: Studio Dashboard & Hub Federado (Paridade Pixieset Dashboard)
- [x] Painel `/dashboard` federado com navegação entre Client Gallery, Photo Library, Studio Manager e Configurações.
- [x] Storage Gauge em tempo real com monitoramento de cotas de armazenamento e tokens de design editorial.
- [x] Healthcheck unificado de infraestrutura (Cloud Run, AlloyDB, Google Drive CDN) e ações rápidas de criação.

## Fase 15: Biblioteca Central de Fotos & Busca Resiliente (Paridade Pixieset Photo Library)
- [x] Catálogo global de mídia `/photos` com agregação de todas as coleções do fotógrafo.
- [x] Cancelamento de concorrência com AbortController (`useAbortRequest`) na barra de busca.
- [x] Filtros por termo, coleção e proporção geométrica com inspeção em tela cheia via Lightbox.

## Fase 16: Criação de Coleções & Onboarding (Paridade Pixieset collections/create)
- [x] Assistente modal e de rotas (`/collections/create`) em 3 passos com stepper visual e validações reativas.
- [x] Normalização de identificadores (slugs URL-friendly) e calibração de ponto focal de capa com preview editorial do Hero.
- [x] Suporte à criação com acervo demonstrativo instantâneo ("Comece com fotos de exemplo") e transação atômica no PostgreSQL.




