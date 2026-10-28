# Controle de Mudanças

Aplicação web (SPA) para registrar **Solicitações de Mudança (SM)** e acompanhar o fluxo
de decisão do **CCB** (Comitê de Controle de Configuração) até a promoção a um novo
baseline. Projeto da disciplina de Gerência de Configuração e Processos de Software,
organizado como item de configuração conforme o [Plano de Gerência de Configuração](docs/pgcs/PGCS.md).

Cada SM registra:

- identificador sequencial (`SM-0001`, `SM-0002`, …);
- solicitante e sistema/módulo afetado;
- classificação: **adição**, **melhoria** ou **correção de defeito**;
- prioridade (baixa, média, alta) e descrição;
- status e histórico de mudanças de status.

Fluxo de status (as transições fora deste fluxo são recusadas):

```
nova ──► em-analise (CCB) ──► aprovada ──► implementada ──► verificada ──► fechada (novo baseline)
                         └──► rejeitada
```

Os dados ficam no `localStorage` do navegador; não há servidor.

## Stack

| Item | Tecnologia |
|---|---|
| Linguagem | JavaScript (ES modules), HTML e CSS, sem framework |
| Build e servidor de desenvolvimento | Vite |
| Testes e cobertura | Vitest + jsdom, cobertura com V8 |
| Análise estática | ESLint (flat config) |
| Runtime | Node.js 22 (`.nvmrc`) |
| Hospedagem | GitHub Pages (staging e production) |

## Pré-requisitos

- Node.js 22 ou superior (com `nvm`: `nvm use`).
- npm 10 ou superior (vem com o Node).
- Git configurado com acesso HTTPS ao GitHub.

## Instalar

```bash
git clone https://github.com/Mendes006/controle-mudancas.git
cd controle-mudancas
npm ci
```

`npm ci` instala exatamente as versões do `package-lock.json`, que está versionado.

Variáveis de ambiente são opcionais. Para usá-las, copie `.env.example` para `.env.local`
(ignorado pelo Git) e preencha:

| Variável | Uso | Padrão |
|---|---|---|
| `VITE_AMBIENTE` | nome do ambiente exibido no rodapé | `local` |
| `VITE_TITULO` | título exibido no cabeçalho | `Controle de Mudanças` |

## Rodar

```bash
npm run dev
```

Abra o endereço mostrado no terminal (normalmente `http://localhost:5173`).

## Testes

```bash
npm test               # executa os testes uma vez
npm run test:coverage  # testes com relatório de cobertura (mínimo de 80% de linhas)
```

## Lint

```bash
npm run lint
```

## Build

```bash
npm run build    # gera dist/
npm run preview  # serve dist/ localmente
```

O build usa `base: './'` (caminhos relativos), então o **mesmo** artefato pode ser
publicado em `/controle-mudancas/staging/` e depois em `/controle-mudancas/` sem recompilar.

## Estrutura de pastas

| Caminho | Conteúdo |
|---|---|
| `src/mudancas.js` | regras puras: criar e validar SM, identificador, transições de status |
| `src/armazenamento.js` | leitura e gravação no `localStorage`, tolerante a JSON inválido |
| `src/main.js` | interface: formulário, lista, filtro por status e botões de transição |
| `src/estilo.css` | estilos (tema claro e escuro) |
| `tests/` | testes Vitest das regras e do armazenamento |
| `docs/pgcs/PGCS.md` | Plano de Gerência de Configuração de Software |
| `.github/` | CODEOWNERS, modelo de Pull Request e modelos de Issue |
| `index.html` | página da aplicação |
| `vite.config.js`, `eslint.config.js` | configuração de build, testes e lint |
| `.nvmrc`, `.gitattributes`, `.gitignore`, `.env.example` | padronização do ambiente e do repositório |

## Gerência de Configuração

As regras completas estão no [PGCS](docs/pgcs/PGCS.md). Resumo do que vale no dia a dia:

### Branch `main` protegida

- Ninguém faz push direto na `main`, nem o Desenvolvedor Líder: toda mudança entra por
  **Pull Request** com **1 aprovação** do par de revisão.
- Merge somente por **squash**, mantendo **histórico linear** (um commit por PR).
- Branches de trabalho são apagadas automaticamente após o merge.

### Convenção de branches

| Prefixo | Uso | Exemplo |
|---|---|---|
| `feature/` | nova funcionalidade | `feature/filtro-prioridade` |
| `fix/` | correção de defeito | `fix/id-duplicado` |
| `docs/` | documentação | `docs/atualiza-pgcs` |
| `chore/` | manutenção, dependências, configuração | `chore/atualiza-vite` |
| `hotfix/` | correção urgente em produção | `hotfix/lista-vazia` |

### Títulos de Pull Request

Seguem [Conventional Commits](https://www.conventionalcommits.org/pt-br/), pois viram a
mensagem do commit de squash na `main`:

```
feat: adiciona filtro por prioridade
fix: corrige identificador duplicado ao importar dados
docs: descreve o fluxo do CCB no PGCS
chore: atualiza dependências de desenvolvimento
```

### Ambientes

| Ambiente | Onde | Promoção |
|---|---|---|
| `local` | máquina do desenvolvedor (`npm run dev`) | livre |
| `staging` | `https://mendes006.github.io/controle-mudancas/staging/` | automática após merge na `main` |
| `production` | `https://mendes006.github.io/controle-mudancas/` | aprovação obrigatória do Desenvolvedor Líder no Environment `production` |

### Par de revisão

- Par de revisão: [@cauepereira](https://github.com/cauepereira), com permissão de escrita
  (*Write*) no repositório; revisa todos os Pull Requests, e o autor não aprova o próprio PR.
- Prazo de resposta a Pull Requests: **até 3 dias úteis**.

## Autor

Maicon Mendes ([@Mendes006](https://github.com/Mendes006)) — Desenvolvedor Líder.
