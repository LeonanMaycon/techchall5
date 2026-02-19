# POS FIAP — Planejador de Aulas (techchall5)

Aplicação React + TypeScript criada como desafio técnico. Permite gerar planejamentos de aula semanais usando integração com um modelo de linguagem (Groq / Llama), armazenar localmente e exportar em PDF.

**Principais funcionalidades**
- Geração de planejamentos por AI a partir de um prompt e metadados da turma
- CRUD de planejamentos (persistência em `localStorage`)
- Exportação de planejamentos para PDF
- Autenticação simples (armazenada localmente com persistência)

**Stack principal**
- Vite + React + TypeScript
- Zustand (state management)
- @tanstack/react-router (roteamento)
- TailwindCSS
- Groq / Llama (via API) para geração de conteúdo
- jsPDF + jspdf-autotable para exportação de PDF

## Começando (rápido)

Pré-requisitos: Node (18+ recomendado) e `pnpm`.

Instalar dependências:

```bash
pnpm install
```

Rodar em desenvolvimento:

```bash
pnpm dev
```

Build de produção:

```bash
pnpm build
pnpm preview
```

Lint:

```bash
pnpm lint
```

## Estrutura importante do projeto
- `src/app/router.tsx` — rotas públicas e protegidas da aplicação
- `src/features/auth` — store e componentes de login
- `src/features/planning` — lógica de planejamento, serviços e componentes
- `src/features/planning/services/ai.service.ts` — integração com API de AI
- `src/features/planning/planning.repository.ts` — persistência em `localStorage`
- `src/shared/functions/pdf-utils.ts` — exportação para PDF

## Variáveis de ambiente
- `VITE_GROQ_API_KEY` — chave da API Groq (necessária para geração via AI). Nunca commit a chave; use um arquivo `.env.local` no seu ambiente de desenvolvimento:

```
VITE_GROQ_API_KEY=suachaveaqui
```

Se a variável não estiver configurada, a geração com AI falhará e apresentará um erro informando a falta da chave.

## Observações de implementação
- State management: `zustand` é usado para `auth` e `planning`. `auth` usa `persist` para gravar no `localStorage`.
- Repositório: `planning.repository` grava e recupera dados de `localStorage` sob a chave `plannings-db`.
- Geração AI: `ai.service.ts` monta um prompt em português e injeta no endpoint Groq. A resposta é parseada como JSON e validada antes de ser usada.

## Como contribuir
- Abra uma issue descrevendo o objetivo.
- Faça um fork, crie branch e envie PR com mudanças pequenas e testáveis.

## Licença
Projeto possui `LICENSE` na raiz.

## Documentação técnica
Veja `docs/TECHNICAL.md` para detalhes de arquitetura, fluxos e decisões de implementação.
