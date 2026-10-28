# CM — Controle de Mudanças

## Plano de Gerenciamento de Configuração — Enfoque DevOps

**Integração e Entrega Contínuas (CI/CD) — Versão 1.0**

| Campo | Descrição |
|---|---|
| Projeto | CM — Controle de Mudanças |
| Gerente de Projeto | Maicon Mendes |
| Gerente/Responsável de GCS-DevOps | Maicon Mendes (`@Mendes006`) |
| Fábrica de Software / Squad | Equipe individual (1 desenvolvedor) + par de revisão da disciplina |
| Repositório principal | <https://github.com/Mendes006/controle-mudancas> |
| Disciplina | Gerência de Configuração e Processos de Software — prof. Luiz C. Camargo |

### Histórico de Revisões

| Data | Versão | Descrição | Autor |
|---|---|---|---|
| 28/10/2026 | 1.0 | Criação do documento, adaptado do template do professor ao projeto Controle de Mudanças (Aula 1). | Maicon Mendes |

> **Como ler este plano.** Cada prática está marcada com a situação atual:
> **[Implementado — Aula 1]** já está no repositório ou nas configurações do GitHub;
> **[Planejado — Aula N]** será implementado na aula indicada e este plano será revisado
> (nova versão no histórico acima) quando isso acontecer.

### Sumário

1. [Introdução](#1-introdução)
2. [Cultura DevOps e Papéis na Gerência de Configuração](#2-cultura-devops-e-papéis-na-gerência-de-configuração)
3. [Ferramentas, Ambientes e Infraestrutura](#3-ferramentas-ambientes-e-infraestrutura)
4. [Identificação da Configuração](#4-identificação-da-configuração)
5. [Integração Contínua (CI)](#5-integração-contínua-ci)
6. [Entrega e Implantação Contínua (CD)](#6-entrega-e-implantação-contínua-cd)
7. [Infraestrutura como Código (IaC)](#7-infraestrutura-como-código-iac)
8. [Controle de Configuração e Mudança](#8-controle-de-configuração-e-mudança)
9. [Baselines e Releases](#9-baselines-e-releases)
10. [Estimativa do Status de Configuração](#10-estimativa-do-status-de-configuração)
11. [Marcos](#11-marcos)
12. [Treinamento e Recursos](#12-treinamento-e-recursos)
13. [Controle de Software de Subcontratados, Fornecedores e Dependências de Terceiros](#13-controle-de-software-de-subcontratados-fornecedores-e-dependências-de-terceiros)
14. [Quadro-Resumo do Pipeline CI/CD](#14-quadro-resumo-do-pipeline-cicd)

---

## 1. Introdução

Este Plano de Gerenciamento de Configuração (PGC) descreve as atividades de Gestão de
Configuração de Software (GCS) executadas ao longo do ciclo de vida do **Controle de
Mudanças (CM)**, com ênfase em práticas DevOps: Integração Contínua (CI), Entrega
Contínua (CD), configuração de ambientes como código e automação de pipelines. As
atividades envolvem identificar os itens de configuração, manter sua integridade e
controlar sistematicamente as mudanças, com o mínimo de burocracia e o máximo de automação.

O próprio produto trata do tema da disciplina: o CM é uma aplicação web de página única
(SPA) para registrar **Solicitações de Mudança (SM)** e acompanhar a decisão do **CCB**
(*Change Control Board*), conforme visto na Aula 03 da disciplina.

### 1.1 Finalidade

Estabelecer o padrão seguido no projeto para garantir rastreabilidade, versionamento e
controle de mudanças do CM, apoiado por pipelines automatizados de build, teste,
integração e implantação no GitHub.

### 1.2 Escopo

Este PGC se aplica ao repositório `Mendes006/controle-mudancas` e a tudo o que ele
contém: código da aplicação, testes, configuração de build, modelos de colaboração,
workflows (a partir da Aula 2) e este próprio plano. A equipe é formada por um
desenvolvedor (Maicon Mendes), que acumula os papéis de gestão, e por um colega da
disciplina que atua como **par de revisão**.

**Sistema abrangido.** SPA em JavaScript (Vite) que permite:

- registrar uma SM com identificador, solicitante, sistema/módulo, classificação
  (adição, melhoria, correção de defeito), prioridade, descrição e status;
- validar os campos obrigatórios da SM;
- mover a SM pelo fluxo de status do CCB:

```
nova ──► em-analise (CCB) ──► aprovada ──► implementada ──► verificada ──► fechada
                         └──► rejeitada                     (promovida a novo baseline)
```

- persistir as SMs no `localStorage` do navegador (não há servidor nem banco de dados).

### 1.3 Definições, Acrônimos e Abreviações

| Termo | Significado |
|---|---|
| GCS | Gestão de Configuração de Software |
| PGC / PGCS | Plano de Gerenciamento de Configuração (de Software) — este documento |
| IC | Item de Configuração |
| CI | Integração Contínua (*Continuous Integration*) |
| CD | Entrega/Implantação Contínua (*Continuous Delivery / Deployment*) |
| IaC | Infraestrutura como Código (*Infrastructure as Code*) |
| CCM | Comitê de Controle de Mudanças (do projeto CM — seção 8.2) |
| CCB | *Change Control Board*; no app, a instância que analisa cada SM |
| SM | Solicitação de Mudança — registro principal do app |
| Baseline | Conjunto de ICs que atingiram um estado comprovado de estabilidade; aqui, uma tag `vX.Y.Z` |
| Pipeline | Sequência automatizada de etapas de build, teste, análise e implantação |
| Trunk-based Development | Estratégia de branching em que se integra na branch principal com alta frequência |
| SemVer | Versionamento Semântico (MAJOR.MINOR.PATCH), ex.: 1.0.0 |
| Conventional Commits | Padrão de mensagem `<tipo>(<escopo>): <descrição>` |
| DORA Metrics | Métricas de desempenho DevOps (Lead Time, Deployment Frequency, MTTR, Change Failure Rate) |
| Environment | Recurso do GitHub que representa um ambiente de implantação com regras de proteção |
| PR | Pull Request |

### 1.4 Referências

- Documento base: *Processos de Desenvolvimento de Software e a Integração com GCS*.
- Template do Plano de Gerenciamento de Configuração — Enfoque DevOps (prof. Luiz Camargo,
  adaptado do RUP 7.0, IBM).
- Repositório de referência da disciplina: **ONGConecta** (roteiros em `docs/aulas/`, ADRs,
  modelos em `.github/`).
- Roteiro *Aula 1 — Preparar o repositório do seu projeto*.
- Aula 03 da disciplina — Controle de mudanças, SM e CCB.
- [README.md](../../README.md) deste repositório (instalação, execução e testes).

### 1.5 Visão Geral

A GCS é tratada como parte do fluxo de entrega, e não como uma atividade manual em marcos
formais: cada mudança entra por Pull Request revisado, cada PR integrado gera um commit
rastreável na `main` e, a partir da Aula 3, cada implantação em produção gera uma tag de
versão e uma Release. O histórico do Git, dos PRs e das execuções do GitHub Actions é a
evidência de rastreabilidade, o que reduz o esforço manual e o tempo entre a mudança e
sua entrega.

---

## 2. Cultura DevOps e Papéis na Gerência de Configuração

A GCS é responsabilidade compartilhada entre desenvolvimento e operação ("você constrói,
você executa"). Como a equipe tem uma pessoa e um par de revisão, vários papéis do
template são acumulados. A separação de funções que importa é preservada: **quem escreve
o código não aprova o próprio PR**.

| Papel | Responsável | Responsabilidades no projeto CM |
|---|---|---|
| Gerente de Projeto / Product Owner | Maicon Mendes (`@Mendes006`) | Prioriza as Issues, decide o que entra em cada versão e acompanha as métricas DORA (10.2). |
| **Desenvolvedor Líder / Gerente de Configuração** | Maicon Mendes (`@Mendes006`) | Mantém este PGCS e os ICs; configura a proteção da `main`, os Environments e as regras de merge; é *code owner* de todo o repositório (`.github/CODEOWNERS`); **é o revisor obrigatório do Environment `production` e aprova cada deploy em produção**. |
| Engenheiro DevOps / Release Engineer | Maicon Mendes | Escreve e mantém os workflows de CI/CD (Aulas 2 e 3), a estratégia de branching e o versionamento SemVer. |
| Desenvolvedor(a) | Maicon Mendes | Integra mudanças pequenas e frequentes via PR, escreve testes automatizados e mantém a `main` sempre implantável. |
| **Revisor (par de revisão)** | `@cauepereira` — colaborador com permissão **Write** | Revisa e aprova (ou pede alterações em) todo PR para a `main` — é a "segunda pessoa" exigida pela regra de 1 aprovação (5.2); participa do CCM (8.2). |
| SRE / Operações | Maicon Mendes | Acompanha staging e produção depois de cada deploy (smoke test) e executa o rollback (6.4) quando necessário. |
| QA / Automação de Testes | Maicon Mendes (autor) e par de revisão (conferência) | Mantém a suíte Vitest em `tests/`; o revisor confere, no PR, se há teste para o caso principal (checklist do template de PR). |
| Segurança (DevSecOps) | Maicon Mendes | Garante que não há segredos no repositório (`.env.example` só com nomes; `.env` no `.gitignore`); habilita Dependabot e `npm audit` no CI (Aulas 2 e 4). |
| Comitê de Controle de Mudanças (CCM) | Maicon Mendes + par de revisão | Atua só nas mudanças de alto risco definidas em 8.2; decisão registrada na Issue do template *Mudança de alto risco (CCM)*. |

### 2.1 Comunicação e prazos

- Pedido de revisão: o autor solicita o par de revisão no PR; o *code owner* é chamado
  automaticamente pelo `CODEOWNERS`.
- Prazo de resposta a Pull Requests: até 3 dias úteis.
- Reciprocidade: Maicon Mendes também é par de revisão no repositório do colega, com
  permissão *Write*.

---

## 3. Ferramentas, Ambientes e Infraestrutura

### 3.1 Ferramentas do Pipeline

| Categoria | Ferramenta adotada | Finalidade no CM | Situação |
|---|---|---|---|
| Controle de versão | Git + GitHub (repositório público) | Versionamento do código, testes, configuração, modelos de colaboração e deste PGCS | **Implementado — Aula 1** |
| Rastreamento de tarefas | GitHub Issues (templates em `.github/ISSUE_TEMPLATE/`) | Registro das solicitações de mudança do projeto e vínculo com PRs (`Closes #n`) | **Implementado — Aula 1** |
| Revisão de código | Pull Requests + `CODEOWNERS` + template de PR | Revisão por pares ("quatro olhos") antes do merge | **Implementado — Aula 1** |
| Ambiente de execução | Node.js 22 (`.nvmrc`) + npm | Mesma versão local e no pipeline; `npm ci` instala exatamente o `package-lock.json` | **Implementado — Aula 1** |
| Build | Vite (`vite.config.js`, `base: './'`) | Gera o pacote estático em `dist/`; caminhos relativos permitem o mesmo artefato em `/staging/` e na raiz | **Implementado — Aula 1** |
| Testes | Vitest | Testes unitários das regras de SM e do armazenamento, com medição de cobertura | **Implementado — Aula 1** (gate de cobertura no CI: Aula 2) |
| Análise estática | ESLint (`eslint.config.js`) | Padrões de codificação e erros comuns | **Implementado — Aula 1** (bloqueante no CI: Aula 2) |
| Orquestração de CI/CD | GitHub Actions | CI em todo PR; CD na `main` | **Planejado — Aulas 2 e 3** |
| Hospedagem | GitHub Pages (branch `gh-pages`) | Staging em `/staging/` e produção na raiz | **Planejado — Aula 3** |
| Ambientes e aprovação | GitHub Environments (`staging`, `production`) | Regras de implantação e gate de aprovação manual | **Implementado — Aula 1** (criados vazios, usados na Aula 3) |
| Gestão de segredos | GitHub Secrets / Variables | Credenciais e variáveis do pipeline; nunca no código | Planejado — Aula 3 (hoje o app não usa segredos) |
| Dependências / SCA | Dependabot + `npm audit` | Atualização e análise de vulnerabilidades de bibliotecas de terceiros | **Planejado — Aulas 2 e 4** |

Não se aplicam ao CM, por ser uma SPA estática sem servidor: empacotamento em containers
(Docker), registro de imagens, orquestração (Kubernetes) e ferramentas de IaC como
Terraform/Ansible (ver seção 7).

### 3.2 Ambientes e Infraestrutura

Os ambientes são definidos como configuração do GitHub (Environments, Pages e regras de
proteção), e não como servidores próprios. Todos recebem **o mesmo artefato** gerado pelo
build, o que garante paridade entre eles.

| Ambiente | Finalidade | Onde | Gatilho de promoção | Situação |
|---|---|---|---|---|
| Local (desenvolvimento) | Desenvolver e rodar testes antes do PR | `npm run dev` → `http://localhost:5173`; dados no `localStorage` do navegador local | Trabalho na branch de vida curta | **Implementado — Aula 1** |
| Revisão de PR | Validar o build do PR isoladamente | Artefato `dist-pr-<n>` anexado à execução do CI (aba *Actions*), retenção de 7 dias | Abertura/atualização de PR | Planejado — Aula 2 |
| Staging (homologação) | Validação funcional da versão integrada antes da produção | <https://mendes006.github.io/controle-mudancas/staging/> | **Automático** a cada merge na `main` (CI verde + 1 aprovação) | Environment criado — **Aula 1**; deploy — Aula 3 |
| Produção | Versão usada pelos usuários finais | <https://mendes006.github.io/controle-mudancas/> | **Aprovação manual** do Desenvolvedor Líder no Environment `production`, após staging | Environment criado — **Aula 1**; deploy — Aula 3 |

**Configuração dos Environments** (*Settings → Environments*) — **[Implementado — Aula 1]**:

| Environment | Regras |
|---|---|
| `staging` | *Deployment branches and tags* → **Protected branches only** (só a `main` protegida implanta). Sem aprovação manual: o deploy é automático. |
| `production` | **Required reviewers** → `@Mendes006` (Desenvolvedor Líder); **Prevent self-review desmarcado** (o líder também dispara o pipeline pelo merge e precisa poder aprovar); *Deployment branches and tags* → **Protected branches only**. |

Os dois Environments foram criados **antes** de existir o workflow de CD: se o pipeline
rodasse antes, o GitHub criaria o `production` automaticamente, sem aprovação.

Dados: cada ambiente roda no navegador de quem o acessa, e as SMs ficam no `localStorage`
daquela origem/caminho. Não há banco de dados, servidor nem credenciais por ambiente.

### 3.3 Estratégia de Branching e Versionamento

**Estratégia: Trunk-Based Development** com branches de vida curta (idealmente menos de
1–2 dias) — **[Implementado — Aula 1]**.

- **`main`** — tronco, sempre implantável. Protegida por regra clássica de proteção de
  branch (*Settings → Branches*, padrão `main`):
  - **Require a pull request before merging**, com **1 aprovação** obrigatória;
  - **Dismiss stale pull request approvals when new commits are pushed**;
  - **Require linear history**;
  - **Do not allow bypassing the above settings** (nem o dono do repositório faz push direto);
  - *Require status checks to pass* → `ci-ok` (e `titulo-pr`) obrigatórios a partir da
    **Aula 2**, quando os checks passam a existir;
  - *Require review from Code Owners* **não** é marcado: o único *code owner* é o próprio
    autor, que não pode aprovar o próprio PR; a aprovação vem do par de revisão.
- Evidência: um `git push` direto na `main` é recusado pelo GitHub com
  *protected branch hook declined* (print entregue na atividade da Aula 1).

**Branches de trabalho** (criadas a partir da `main` atualizada e apagadas após o merge):

| Prefixo | Uso | Exemplo |
|---|---|---|
| `feature/<desc>` | Nova funcionalidade ou melhoria | `feature/12-filtro-por-status` |
| `fix/<desc>` | Correção de defeito | `fix/18-validacao-prioridade` |
| `docs/<desc>` | Documentação, inclusive este PGCS | `docs/pgcs-secao-ci` |
| `chore/<desc>` | Manutenção, configuração, dependências | `chore/atualiza-vitest` |
| `hotfix/<desc>` | Correção emergencial de produção (passa pelo CCM — 8.2) | `hotfix/perda-de-dados-localstorage` |

`<desc>` é curta, em minúsculas, separada por hífens e começa pelo número da Issue quando
houver. Não há `release/x.y`: com um único produto e deploy contínuo, a estabilização
acontece em staging.

**Regras de merge** (*Settings → General → Pull Requests*) — **[Implementado — Aula 1]**:

- somente **Allow squash merging** (merge commit e rebase merging desmarcados);
- mensagem padrão do squash: **Pull request title and description** — cada PR vira **um**
  commit na `main` cuja mensagem é o título do PR;
- **Automatically delete head branches**.

**Versionamento**:

- O **título do PR** segue **Conventional Commits** — `<tipo>(<escopo>): <descrição>`,
  com tipos `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`,
  `chore`, `revert`. Validação automática pelo check `titulo-pr`: **Planejado — Aula 2**.
- **SemVer derivado do título** (cálculo automático no CD — **Planejado — Aula 3**):

| Título do commit na `main` | Incremento | Exemplo (a partir de 1.2.0) |
|---|---|---|
| `feat!: ...`, `fix!: ...` (com `!`) ou `BREAKING CHANGE:` no corpo | MAJOR | 2.0.0 |
| `feat: ...` / `feat(escopo): ...` | MINOR | 1.3.0 |
| `fix: ...` / `perf: ...` | PATCH | 1.2.1 |
| `docs`, `chore`, `ci`, `test`, `refactor`, `style`, `build` | sem nova versão | 1.2.0 |

---

## 4. Identificação da Configuração

### 4.1 Itens de Configuração

Todos os ICs ficam no mesmo repositório Git e só mudam na `main` por Pull Request
revisado (3.3). Responsável = quem responde pelo conteúdo; a aprovação de cada mudança é
sempre do par de revisão.

| IC | Tipo | Responsável | Como é versionado / controlado | Situação |
|---|---|---|---|---|
| `src/main.js` | Código-fonte — interface e eventos da SPA | Desenvolvedor | Git; PR + revisão; área "Interface" nas Issues | **Aula 1** |
| `src/mudancas.js` | Código-fonte — regras puras: criar SM, validar, transições de status | Desenvolvedor | Git; PR + revisão; coberto por `tests/mudancas.test.js` | **Aula 1** |
| `src/armazenamento.js` | Código-fonte — persistência no `localStorage` | Desenvolvedor | Git; PR + revisão; mudança de formato dos dados é alto risco (8.2) | **Aula 1** |
| `src/estilo.css` | Código-fonte — estilos | Desenvolvedor | Git; PR + revisão | **Aula 1** |
| `index.html` | Código-fonte — página de entrada do Vite | Desenvolvedor | Git; PR + revisão | **Aula 1** |
| `tests/mudancas.test.js` | Teste automatizado (Vitest) | QA / Desenvolvedor | Git; executado no CI a partir da Aula 2 | **Aula 1** |
| `tests/armazenamento.test.js` | Teste automatizado (Vitest) | QA / Desenvolvedor | Git; executado no CI a partir da Aula 2 | **Aula 1** |
| `package.json` | Configuração de build e manifesto de dependências | Release Engineer | Git; PR + revisão; atualizações propostas pelo Dependabot (Aula 4) | **Aula 1** |
| `package-lock.json` | Lockfile — versões exatas das dependências | Release Engineer | Git; gerado pelo npm, nunca editado à mão; `npm ci` no pipeline | **Aula 1** |
| `vite.config.js` | Configuração de build (`base: './'`) | Release Engineer | Git; PR + revisão | **Aula 1** |
| `eslint.config.js` | Configuração de análise estática | Desenvolvedor Líder | Git; PR + revisão | **Aula 1** |
| `.nvmrc` | Versão do Node (22) — paridade local × pipeline | Release Engineer | Git; PR + revisão | **Aula 1** |
| `.gitignore` | Exclusões do versionamento (`node_modules/`, `dist/`, `coverage/`, `.env`) | Gerente de Configuração | Git; PR + revisão | **Aula 1** |
| `.gitattributes` | Normalização de fim de linha (`* text=auto eol=lf`) | Gerente de Configuração | Git; PR + revisão | **Aula 1** |
| `.env.example` | Nomes das variáveis de ambiente, **sem valores reais** | DevSecOps | Git; o `.env` real nunca é versionado | **Aula 1** |
| `README.md` | Documentação — o que é o app, stack, instalar, rodar e testar | Desenvolvedor Líder | Git; PR + revisão | **Aula 1** |
| `docs/pgcs/PGCS.md` | **Este plano** — documentação de GCS | Gerente de Configuração | Git; PR `docs(pgcs): ...` + revisão; versão e histórico no cabeçalho | **Aula 1** |
| `.github/CODEOWNERS` | Configuração de colaboração — revisores automáticos por área | Gerente de Configuração | Git; PR + revisão | **Aula 1** |
| `.github/pull_request_template.md` | Modelo de colaboração — template de PR | Gerente de Configuração | Git; PR + revisão | **Aula 1** |
| `.github/ISSUE_TEMPLATE/funcionalidade.yml` | Modelo de colaboração — solicitação de funcionalidade | Gerente de Configuração | Git; PR + revisão | **Aula 1** |
| `.github/ISSUE_TEMPLATE/defeito.yml` | Modelo de colaboração — relato de defeito | Gerente de Configuração | Git; PR + revisão | **Aula 1** |
| `.github/ISSUE_TEMPLATE/mudanca-alto-risco.yml` | Modelo de colaboração — mudança de alto risco (CCM) | Gerente de Configuração | Git; PR + revisão | **Aula 1** |
| `.github/workflows/ci.yml`, `pr-titulo.yml` | Pipeline de CI como código | Release Engineer | Git; PR + revisão; mudança aqui é de maior risco (CODEOWNERS) | Planejado — Aula 2 |
| `.github/workflows/cd.yml`, `rollback.yml` | Pipeline de CD como código | Release Engineer | Git; PR + revisão | Planejado — Aula 3 |
| `.github/dependabot.yml` | Configuração de atualização de dependências | DevSecOps | Git; PR + revisão | Planejado — Aula 4 |
| Configurações do repositório no GitHub (proteção da `main`, regras de merge, Environments, colaboradores) | Configuração de ambiente (fora dos arquivos) | Gerente de Configuração | Descritas e versionadas neste PGCS (3.2, 3.3, 7); toda alteração atualiza o plano | **Aula 1** |
| Tags `vX.Y.Z` e Releases | Baselines | Release Engineer | Criadas pelo CD após aprovação em produção | Planejado — Aula 3 |

Não são ICs (ignorados pelo `.gitignore`): `node_modules/`, `dist/`, `coverage/` e `.env`.
São gerados a partir dos ICs ou contêm dados locais.

### 4.2 Convenção de Nomenclatura

| Item | Convenção | Exemplo |
|---|---|---|
| Branch de trabalho | `<tipo>/<desc>` com tipo `feature`, `fix`, `docs`, `chore` ou `hotfix` (3.3) | `feature/12-filtro-por-status` |
| Commit na `main` / título do PR | Conventional Commits: `<tipo>(<escopo>): <descrição>` em português, no imperativo/presente | `feat(mudancas): adiciona transição para verificada` |
| Escopos usuais | `ui`, `mudancas`, `armazenamento`, `pgcs`, `ci`, `deps` | `fix(armazenamento): trata localStorage vazio` |
| Tag de release (baseline) | SemVer com prefixo `v` | `v1.3.0` |
| Release no GitHub | Mesmo nome da tag, notas geradas dos commits | `v1.3.0` |
| Artefato de PR | `dist-pr-<número do PR>` | `dist-pr-7` |
| Artefato do CD | `dist` + rótulo de versão exibido no app | `v1.3.0` ou `v1.3.0+a1b2c3d` |
| Issue | Título com o prefixo do template | `feat: exportar SMs em CSV`, `[Alto risco] mudar formato dos dados` |
| Identificador de SM (dado do app) | `SM-` + número sequencial com 4 dígitos, gerado por `proximoIdentificador` em `src/mudancas.js` | `SM-0001`, `SM-0002` |
| Arquivos de código | minúsculas, em português, sem acento | `armazenamento.js` |
| Testes | `<módulo>.test.js` em `tests/` | `tests/mudancas.test.js` |
| ADR (se adotado) | `docs/adr/NNNN-titulo-curto.md` | `docs/adr/0001-github-pages.md` |

### 4.3 Estrutura do Repositório

```
controle-mudancas/
├── .github/
│   ├── CODEOWNERS                    # revisores automáticos por área (PGC 2, 5.2)
│   ├── pull_request_template.md      # Contexto / Decisão / Como testar / Checklist
│   ├── ISSUE_TEMPLATE/
│   │   ├── funcionalidade.yml        # feat: ...
│   │   ├── defeito.yml               # fix: ...
│   │   └── mudanca-alto-risco.yml    # [Alto risco] ... (CCM — 8.2)
│   ├── workflows/                    # (Aula 2) ci.yml, pr-titulo.yml · (Aula 3) cd.yml, rollback.yml
│   └── dependabot.yml                # (Aula 4)
├── docs/
│   └── pgcs/
│       └── PGCS.md                   # este plano
├── src/
│   ├── main.js                       # interface da SPA
│   ├── mudancas.js                   # regras puras de SM e transições de status
│   ├── armazenamento.js              # persistência no localStorage
│   └── estilo.css
├── tests/
│   ├── mudancas.test.js
│   └── armazenamento.test.js
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js                    # base: './'
├── eslint.config.js
├── .nvmrc                            # 22
├── .gitignore
├── .gitattributes                    # * text=auto eol=lf
├── .env.example
└── README.md
```

---

## 5. Integração Contínua (CI)

**[Planejado — Aula 2]** Todo Pull Request para a `main` dispara automaticamente o
workflow `.github/workflows/ci.yml`. Nenhuma mudança é integrada sem o pipeline concluído
com sucesso.

### 5.1 Etapas do Pipeline de CI

1. Checkout do código e instalação com `npm ci` (versões exatas do `package-lock.json`),
   com cache do npm e Node 22.
2. Análise estática: `npm run lint` (ESLint).
3. Testes unitários com cobertura: `npm run test:coverage` (Vitest; falha se a cobertura
   de linhas ficar abaixo de 80% — 5.3).
4. Análise de dependências (SCA): `npm audit --omit=dev --audit-level=critical`.
5. Build: `npm run build` (Vite).
6. Publicação do `dist/` como artefato do PR (ambiente de revisão — 3.2).
7. Job agregador **`ci-ok`**: roda sempre (`if: always()`) e só fica verde se nenhum job
   anterior falhou. É o único check de CI marcado como obrigatório na proteção da `main`,
   junto com `titulo-pr` (workflow `pr-titulo.yml`, que valida o título em Conventional
   Commits).

Testes de integração entre serviços não se aplicam (não há backend); os testes de
`armazenamento` cobrem a integração com o `localStorage` (simulado no ambiente de teste).

### 5.2 Política de Pull Request e Revisão de Código

**[Implementado — Aula 1]**, exceto o item do CI verde (Aula 2):

- Todo PR para a `main` exige **1 aprovação** de outra pessoa — o par de revisão
  `@cauepereira` (permissão *Write*). O GitHub não permite aprovar o próprio PR.
- Novos commits no PR **descartam aprovações anteriores** (*dismiss stale approvals*).
- O autor preenche o template de PR (Contexto, Decisão tomada, Como testar, Checklist) e
  vincula a Issue com `Closes #n`.
- PRs pequenos, de um único assunto e vida curta.
- Merge somente por *squash*, com o título do PR em Conventional Commits.
- Merge somente com **CI verde** (`ci-ok` e `titulo-pr`) — **Aula 2**.

### 5.3 Critérios de Qualidade (Quality Gate)

**[Planejado — Aula 2]** O PR só pode ser mesclado se:

| Critério | Limite | Verificação |
|---|---|---|
| Erros de lint | zero | `npm run lint` |
| Testes | 100% passando | `npm test` |
| Cobertura de linhas (`src/`, exceto `src/main.js`, que é só interface) | **≥ 80%** | `npm run test:coverage` — *threshold* já definido em `vite.config.js` (**Aula 1**); bloqueante no CI na Aula 2 |
| Vulnerabilidades críticas em dependências de produção | zero | `npm audit --audit-level=critical` |
| Build | conclui sem erro | `npm run build` |
| Título do PR | Conventional Commits | check `titulo-pr` |
| Revisão | 1 aprovação do par | proteção da `main` |

---

## 6. Entrega e Implantação Contínua (CD)

**[Planejado — Aula 3]** Após o merge na `main`, o workflow `.github/workflows/cd.yml`
promove **o mesmo artefato**, sem recompilar, de staging para produção.

### 6.1 Etapas do Pipeline de CD

1. **Versão e build** (uma única vez): calcula a próxima versão SemVer a partir dos
   Conventional Commits desde a última tag (3.3), gera as notas de release e executa o
   build com o rótulo da versão exibido no app.
2. **Deploy automático em staging** (Environment `staging`): publica o `dist/` na branch
   `gh-pages`, pasta `/staging/` → <https://mendes006.github.io/controle-mudancas/staging/>.
3. **Smoke test em staging**: confirma que a versão nova está no ar.
4. **Gate de aprovação para produção**: o job de produção usa o Environment `production`
   e **aguarda a aprovação do Desenvolvedor Líder** (`@Mendes006`) na aba *Actions*,
   depois de conferir a versão em staging.
5. **Deploy em produção**: publica o mesmo artefato na raiz do GitHub Pages
   → <https://mendes006.github.io/controle-mudancas/>, preservando a pasta `/staging/`.
6. **Smoke test em produção**.
7. **Baseline**: cria a tag anotada `vX.Y.Z` e a Release no GitHub com as notas (seção 9).

Mudanças só de documentação (`docs/**`, `*.md`) não disparam o CD.

### 6.2 Estratégias de Implantação

| Estratégia | Uso no CM |
|---|---|
| Rolling update | Não se aplica — site estático sem instâncias. |
| **Blue-Green (simplificado)** | **Adotada.** Staging e produção coexistem no mesmo Pages; a produção só recebe a versão já validada em staging, e a troca é atômica (um commit na `gh-pages`). |
| Canary Release | Não se aplica — o GitHub Pages não divide tráfego. |
| Feature Flags | Não adotada nesta versão; pode ser introduzida por variável de build (`.env.example`) se uma funcionalidade precisar ir desligada para produção. |

### 6.3 Rollback e Recuperação

Toda implantação é reversível. Cada baseline de produção tem uma tag `vX.Y.Z`, e o
artefato de cada execução do CD fica guardado por 30 dias. Os dados das SMs ficam no
navegador do usuário, então um rollback de código não apaga dados; por isso, mudanças no
formato dos dados do `localStorage` exigem compatibilidade com a versão anterior ou
passam pelo CCM (8.2).

### 6.4 Procedimento de rollback

1. **Rollback rápido**: aba *Actions* → execução do CD da versão anterior → *Re-run jobs*
   apenas do job de produção (reutiliza o artefato guardado).
2. **Rollback por tag**: workflow manual `rollback.yml` (*Run workflow*, informando
   `vX.Y.Z`): reconstrói a partir da tag e publica em produção, passando pelo **mesmo gate
   de aprovação** do Environment `production`.
3. Depois de estabilizar a produção, corrigir a `main` com um PR `revert: ...` ou
   `fix: ...`, que segue o fluxo normal.

---

## 7. Infraestrutura como Código (IaC)

O CM não tem servidores, banco de dados nem rede para provisionar: a "infraestrutura" é
o GitHub Pages e a configuração do repositório. Ferramentas como Terraform ou Ansible não
se aplicam. O princípio da IaC é atendido assim:

### 7.1 Versionamento de Infraestrutura

- **Pipelines como código**: `.github/workflows/*.yml` são ICs e passam por PR + revisão
  (Aulas 2 e 3); o `CODEOWNERS` chama o Desenvolvedor Líder para qualquer mudança em `.github/`.
- **Ambientes como configuração do GitHub**: as regras dos Environments `staging` e
  `production`, a proteção da `main` e as regras de merge estão descritas de forma
  verificável nas seções 3.2 e 3.3. Toda alteração nessas configurações é tratada como
  mudança de alto risco (8.2): Issue no template de CCM, ajuste aqui no PGCS por PR e
  só então a mudança no GitHub.
- **Ambiente de execução**: `.nvmrc` (Node 22) e `package-lock.json` garantem o mesmo
  ambiente na máquina local e no pipeline.
- Não há *state file*: o estado da "infraestrutura" é a própria branch `gh-pages`,
  versionada no Git.

### 7.2 Ambientes Efêmeros

Não há *review app* publicado por PR (o GitHub Pages publica um site por repositório).
O ambiente efêmero de revisão é o **artefato `dist-pr-<n>`** gerado pelo CI (Aula 2):
o revisor baixa e abre localmente; ele expira em 7 dias.

---

## 8. Controle de Configuração e Mudança

### 8.1 Processo de Solicitação de Mudança

**[Implementado — Aula 1]** O projeto usa no próprio desenvolvimento o mesmo conceito que
o app implementa. Uma mudança no CM é uma Issue, e seu ciclo de vida segue o fluxo de SM:

| Fluxo do projeto (GitHub) | Status equivalente da SM |
|---|---|
| Issue aberta pelo template *Funcionalidade* ou *Defeito* | `nova` |
| Triagem: o Desenvolvedor Líder analisa prioridade e impacto | `em-analise` |
| Issue aceita e atribuída / fechada como "não planejada" | `aprovada` / `rejeitada` |
| Branch `feature/`/`fix/` + PR com `Closes #n` | `implementada` |
| CI verde + aprovação do par + verificação em staging | `verificada` |
| Deploy aprovado em produção → tag `vX.Y.Z` | `fechada` (novo baseline) |

Classificação da mudança (Aula 03) ↔ tipo de commit: **adição** e **melhoria** → `feat`;
**correção de defeito** → `fix`. O fluxo (Issue → branch → PR → revisão → CI → merge →
CD) já é o registro formal e rastreável da mudança.

### 8.2 Comitê de Controle de Mudanças (CCM)

**Composição:** Desenvolvedor Líder (Maicon Mendes) + par de revisão (`@cauepereira`).
A decisão exige os dois; em caso de discordância, a mudança não é feita até haver acordo.

**Quando é acionado** (critérios objetivos — template *Mudança de alto risco (CCM)*):

1. Alteração do **formato dos dados** salvos no `localStorage` que exija migração ou
   possa tornar ilegíveis as SMs já registradas pelos usuários.
2. Mudança que passe a coletar, exibir ou enviar para fora do navegador **dados pessoais
   dos solicitantes** (LGPD).
3. Alteração do **pipeline, dos Environments ou da proteção da `main`** (ex.: remover a
   aprovação obrigatória, mudar o revisor de produção).
4. **Exceção ao fluxo padrão**, como um `hotfix/` que precise ir para produção antes da
   revisão completa.

**Como funciona:** abre-se a Issue de alto risco com descrição e **plano de rollback**;
o CCM registra a decisão nos comentários (*Aprovada / Aprovada com ressalvas /
Rejeitada*, com justificativa); o PR da mudança referencia a Issue e marca o item de
alto risco no checklist do template. Mudanças de rotina não passam pelo CCM: a aprovação
do PR pelo par de revisão basta.

---

## 9. Baselines e Releases

### 9.1 Geração Automática de Baseline

**[Planejado — Aula 3]** Cada implantação aprovada em produção gera automaticamente uma
baseline: a **tag anotada `vX.Y.Z`** no commit implantado e uma **Release** no GitHub.
A tag identifica de forma única o conjunto de ICs (código, testes, configuração, PGCS)
daquela versão. Se não houver `feat`/`fix` desde a última tag, não há nova baseline e o
app exibe a versão com o commit (`vX.Y.Z+sha`).

Até a Aula 3, a baseline de referência é o estado da `main` após o primeiro PR mesclado
com a estrutura deste plano.

### 9.2 Notas de Versão (Release Notes)

As notas são geradas pelo pipeline a partir dos títulos dos commits na `main` desde a
última tag, agrupadas em **Funcionalidades** (`feat`), **Correções** (`fix`/`perf`) e
**Outros**, e publicadas na Release.

---

## 10. Estimativa do Status de Configuração

### 10.1 Monitoramento e Observabilidade

O app é estático e não tem servidor para monitorar. O acompanhamento é feito por:

- smoke test após cada deploy em staging e produção (Aula 3);
- ambiente exibido no rodapé da tela (`VITE_AMBIENTE`, já implementado) e, a partir da
  Aula 3, a versão `vX.Y.Z`, que permite conferir o que está em cada ambiente e
  relatar defeitos com a versão correta (template *Defeito*);
- aba *Actions* (estado dos pipelines) e aba *Environments* (o que está implantado onde).

### 10.2 Métricas DORA

**[Planejado — Aula 4]** Coletadas a partir dos dados do GitHub (PRs, execuções do
Actions e Releases):

| Métrica | Como é medida no CM | Meta inicial |
|---|---|---|
| Deployment Frequency | Releases `vX.Y.Z` publicadas por semana | ≥ 1 por semana durante as aulas |
| Lead Time for Changes | Tempo entre o primeiro commit do PR e a aprovação do deploy em produção | < 3 dias úteis |
| Change Failure Rate | % de deploys em produção que geraram rollback ou `hotfix/` | < 15% |
| Mean Time to Restore (MTTR) | Tempo entre a Issue de defeito em produção e o rollback/correção publicada | < 1 dia |

### 10.3 Relatórios e Auditorias

O histórico de PRs (com revisões), de execuções do Actions, de deployments por
Environment e de tags/Releases é o principal insumo de auditoria. Auditoria de
configuração ao fim de cada aula: conferir se as configurações do GitHub batem com as
seções 3.2 e 3.3 e se a tabela de ICs (4.1) está atualizada.

---

## 11. Marcos

Datas aproximadas, conforme a liberação das aulas.

| Marco | Data | Entregas | Situação |
|---|---|---|---|
| Aula 1 — Repositório preparado | 28/10/2026 | Estrutura e ICs básicos, este PGCS, modelos de colaboração, par de revisão com *Write*, apenas *squash merge*, Environments `staging`/`production`, `main` protegida e evidência da recusa de push direto | **Em entrega** (prazo 28/10/2026) |
| Aula 2 — Integração Contínua | ~04/11/2026 | `ci.yml` (lint, testes, cobertura ≥ 80%, `npm audit`, build, `ci-ok`), `pr-titulo.yml`, checks obrigatórios na `main` | Planejado |
| Aula 3 — Entrega Contínua | ~11/11/2026 | `cd.yml` (staging automático, aprovação de produção, tag + Release), `rollback.yml`, primeira baseline `vX.Y.Z` | Planejado |
| Aula 4 — Governança | ~18/11/2026 | `dependabot.yml`, uso do CCM em uma mudança real, métricas DORA, revisão deste PGCS (versão 2.0) | Planejado |

---

## 12. Treinamento e Recursos

- **Pessoal:** 1 desenvolvedor e 1 par de revisão da disciplina.
- **Ferramentas:** conta GitHub com 2FA, Git, Node.js 22 e um editor de código. Sem
  custos: repositório público no plano gratuito (necessário para *Required reviewers* e
  análise de dependências).
- **Rede do laboratório:** usar HTTPS (porta 22 bloqueada); todas as etapas podem ser
  feitas pelo site do GitHub, pois o pipeline roda nos servidores do GitHub.
- **Material de treinamento:** roteiros das aulas e ADRs do repositório de referência
  ONGConecta, o [README.md](../../README.md) deste projeto (instalar, rodar e testar) e
  este PGCS. Um novo colaborador consegue abrir o primeiro PR seguindo README + seção 3.3.

---

## 13. Controle de Software de Subcontratados, Fornecedores e Dependências de Terceiros

- Não há software de subcontratados ou fornecedores externos.
- As bibliotecas de terceiros (Vite, Vitest, ESLint e suas dependências) são ICs: versões
  declaradas no `package.json` e travadas no **`package-lock.json`**, instaladas com
  `npm ci`. **[Implementado — Aula 1]**
- **Análise de vulnerabilidades (SCA)**: `npm audit` no CI, bloqueando vulnerabilidade
  crítica em dependência de produção. **[Planejado — Aula 2]**
- **Atualizações automáticas**: Dependabot (`.github/dependabot.yml`) abre PRs semanais
  `chore(deps): ...` para o npm e mensais `ci: ...` para as GitHub Actions; esses PRs
  passam pelo mesmo CI e pela mesma revisão. **[Planejado — Aula 4]**
- As GitHub Actions usadas nos workflows também são dependências e são fixadas por versão.

---

## 14. Quadro-Resumo do Pipeline CI/CD

```
Issue ─► branch feature/fix ─► PR ─► CI: titulo-pr · lint · testes · audit · build ─► ci-ok
                                                                                      │
                                                    1 aprovação do par de revisão ◄───┘
                                                                  │ squash merge
                                                                  ▼
main ─► CD: versão SemVer + build ─► staging (automático) ─► produção (aprovação do líder)
                                                                  └─► tag vX.Y.Z + Release
```

| Etapa | Descrição | Gatilho | Situação |
|---|---|---|---|
| CI | `npm ci`, lint, testes com cobertura ≥ 80%, `npm audit`, build, artefato do PR, `ci-ok` | Abertura/atualização de Pull Request | Planejado — Aula 2 |
| Revisão | 1 aprovação do par de revisão; aprovações antigas descartadas a cada push | PR aberto | **Implementado — Aula 1** |
| Merge | *Squash merge* na `main` com o título do PR como mensagem; branch apagada | Aprovação de PR + CI verde | **Implementado — Aula 1** (CI verde a partir da Aula 2) |
| CD — Staging | Cálculo da versão, build único, deploy em `/staging/`, smoke test | Merge na `main` | Planejado — Aula 3 |
| Gate de Release | Aprovação do Desenvolvedor Líder no Environment `production` | Sucesso em staging | Environment **configurado — Aula 1**; uso — Aula 3 |
| CD — Produção | Deploy do mesmo artefato na raiz do Pages, smoke test, tag `vX.Y.Z` + Release | Aprovação do gate | Planejado — Aula 3 |
| Rollback | *Re-run* do job de produção ou `rollback.yml` com a tag anterior | Manual, com o mesmo gate de aprovação | Planejado — Aula 3 |

---

*Este plano é um item de configuração: qualquer alteração é feita por Pull Request
(`docs(pgcs): ...`), revisada pelo par de revisão e registrada no Histórico de Revisões.*
