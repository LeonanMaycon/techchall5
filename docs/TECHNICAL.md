# Documentação Técnica — POS FIAP (techchall5)

Este documento descreve a arquitetura, decisões de implementação, fluxos de dados e instruções operacionais da aplicação.

**Visão Geral**
- Aplicação SPA em React + TypeScript para criação e gerenciamento de planejamentos de aulas.
- Geração de conteúdo de planejamento por modelo de linguagem (via Groq / Llama).
- Persistência local com `localStorage` e exportação em PDF.

**Arquitetura**
- Frontend: Vite + React + TypeScript.
- Roteamento: `@tanstack/react-router` com rotas públicas (`/login`) e protegidas (`/plannings`).
- Estado: `zustand` (stores em `src/features/*/*.store.ts`).
- Persistência: `localStorage` via repositórios (ex.: `planning.repository`).

**Principais módulos e responsabilidades**
- `src/app/router.tsx`: define `rootRoute`, rota de índice, rota de login e grupo de rotas protegidas (`protectedRoute`). Redireciona automaticamente baseado no estado de autenticação persistido em `localStorage`.
- `src/features/auth`:
  - `auth.store.ts`: store `zustand` com middleware `persist` para gravar credenciais mínimas no `localStorage` (chave `auth-storage`). Implementa `login` e `logout`.
  - `components/login-form.tsx` e `pages/login-page.tsx`: formulários/UX de autenticação.
- `src/features/planning`:
  - `planning.types.ts`: tipos (`Planning`, `PlanningRow`, etc.).
  - `planning.repository.ts`: API simples de persistência em `localStorage` sob `plannings-db`.
  - `planning.store.ts`: `zustand` store que mantém lista de planejamentos e expõe operações `loadPlannings`, `addPlanning`, `updatePlanning`, `removePlanning`.
  - `services/ai.service.ts`: constrói prompt em português e chama a API Groq (`https://api.groq.com/openai/v1/chat/completions`) usando `VITE_GROQ_API_KEY`. Retorna um array de `PlanningRow` após validação.
  - `services/planning.service.ts`: funções `createPlanning` e `updatePlanning` que orquestram geração (AI) e atualização do store/repositório.
- `src/shared/functions/pdf-utils.ts`: utilitário para exportar um `Planning` em PDF usando `jspdf` e `jspdf-autotable`.

**Fluxo de dados (exemplo: criar planejamento)**
1. Usuário preenche formulário em `NewPlanningForm` e envia.
2. `createPlanning(payload)` é chamado (em `planning.service.ts`).
3. `createPlanning` chama `generatePlanningWithAI(payload)` (em `ai.service.ts`).
4. `ai.service.ts` envia o prompt para a API Groq, parseia e valida a resposta JSON.
5. `createPlanning` monta o objeto `Planning` (com `uuid()`), persiste no `usePlanningStore` (que chama `planning.repository.add`) e retorna o objeto criado.

**Persistência e responsabilidade**
- `planning.repository` é responsável apenas por ler/gravar a lista completa em `localStorage`.
- `planning.store` mantém o estado em memória para a UI e usa o repositório para operações permanentes.

**Tratamento de erros e validações**
- `ai.service.ts` valida o conteúdo retornado da API (espera um objeto com `rows: []`) e lança erros claros quando:
  - `VITE_GROQ_API_KEY` não está definido
  - Resposta da API não é OK
  - JSON retornado não tem a estrutura esperada

**Variáveis de ambiente e segurança**
- `VITE_GROQ_API_KEY` — obrigatório para chamadas à API Groq. Use `.env.local` para desenvolvimento e não commite este arquivo.

Exemplo de `.env.local`:

```
VITE_GROQ_API_KEY=seu_token_aqui
```

Observação: Variáveis com prefixo `VITE_` são expostas ao bundle cliente. Para aplicações de produção, utilize um backend para mediar chamadas à API de AI caso precise esconder chaves sensíveis.

**Execução local e testes rápidos**
- Instalar dependências: `pnpm install`
- Dev: `pnpm dev`
- Build: `pnpm build` / `pnpm preview`

Para testar geração sem chave, você pode:
- usar o mock presente em `src/features/planning/data/mock-plannings.json` carregando manualmente com `usePlanningStore.getState().loadPlannings()` (ou adaptando o repositório temporariamente).

**Decisões de design relevantes**
- Persistência em `localStorage` simplifica o desafio e remove necessidade de backend; trade-off: os dados ficam restritos ao navegador.
- Uso de `zustand` mantém stores leves e fáceis de testar.
- Repositório separado (`planning.repository`) isola leitura/gravação e facilita futura alteração para backend remoto.

**Possíveis melhorias / próximos passos**
- Migrar persistência para backend (API REST/GraphQL) com autenticação real.
- Implementar paginação e filtros para listas de planejamentos.
- Mover chamadas à AI para um backend para não expor a chave em produção.
- Adicionar testes unitários/integração para `ai.service`, `planning.service` e stores.

---

Arquivo de referência:
- `src/app/router.tsx`
- `src/features/planning/services/ai.service.ts`
- `src/features/planning/planning.repository.ts`
- `src/features/planning/planning.store.ts`
- `src/shared/functions/pdf-utils.ts`
