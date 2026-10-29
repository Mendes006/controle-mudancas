# Evidências — Aula 1: repositório preparado

Registro das configurações aplicadas em 28/10/2026, conforme as seções 2, 3.2, 3.3 e 4.1
do [PGCS](../pgcs/PGCS.md). Todas foram conferidas pela API do GitHub após a configuração.

## 1. Recusa do push direto na `main`

Commit de teste feito diretamente na `main` local e enviado com `git push`:

```text
$ git push origin main
remote: error: GH006: Protected branch update failed for refs/heads/main.
remote:
remote: - Changes must be made through a pull request.
To https://github.com/Mendes006/controle-mudancas.git
 ! [remote rejected] main -> main (protected branch hook declined)
error: failed to push some refs to 'https://github.com/Mendes006/controle-mudancas.git'
```

O commit de teste foi descartado localmente; esta própria evidência entrou na `main` por
Pull Request com aprovação do par de revisão.

## 2. Proteção da `main` (PGCS 3.3 e 5.2)

| Regra | Valor |
|---|---|
| Require a pull request before merging | sim, **1** aprovação |
| Dismiss stale pull request approvals | sim |
| Require linear history | sim |
| Do not allow bypassing (inclui administradores) | sim |
| Force push / exclusão da branch | bloqueados |
| Required status checks | Aula 2 (os checks `ci-ok` e `titulo-pr` ainda não existem) |

## 3. Par de revisão (PGCS 2)

| Usuário | Permissão |
|---|---|
| [@cauepereira](https://github.com/cauepereira) | *Write* |

## 4. Merge (PGCS 3.3)

Somente **squash merge**, com título e descrição do PR como mensagem do commit; merge commit
e rebase merge desabilitados; branches apagadas automaticamente após o merge.

## 5. Environments (PGCS 3.2 e 6.1)

| Environment | Regras |
|---|---|
| `staging` | *Deployment branches*: somente branches protegidas |
| `production` | *Required reviewers*: [@Mendes006](https://github.com/Mendes006) (Desenvolvedor Líder); *Prevent self-review* desmarcado; somente branches protegidas |

## 6. Prints de cada etapa (28/10/2026)

### 6.1 Repositório público e estrutura (item 1 e 2)

![Repositório público com a estrutura de pastas](img/01-repositorio-publico-estrutura.jpg)

### 6.2 Proteção da `main` (item 3)

![Regra de proteção cadastrada para a main](img/02-regra-protecao-main.jpg)

![PR obrigatório, 1 aprovação e descarte de aprovações antigas](img/03-protecao-main-pr-aprovacoes.jpg)

![Histórico linear e sem bypass, inclusive para administradores](img/04-protecao-main-historico-linear-sem-bypass.jpg)

### 6.3 Recusa do push direto na `main` (item 3)

Nova tentativa feita em 28/10/2026 às 21:15:09; o commit de teste foi descartado localmente.

![git push direto na main recusado com GH006](img/05-push-direto-main-recusado.jpg)

### 6.4 Par de revisão com acesso de escrita (item 4)

![cauepereira como colaborador do repositório](img/06-par-de-revisao-colaborador.jpg)

### 6.5 Merge somente por squash (PGCS 3.3)

![Somente squash merge, título e descrição do PR como mensagem, branches apagadas após o merge](img/07-merge-somente-squash.jpg)

### 6.6 Environments (item 5)

![Environments staging e production](img/08-environments-staging-production.jpg)

![production com Mendes006 como revisor obrigatório](img/09-production-revisor-obrigatorio.jpg)

### 6.7 Fluxo de Pull Request com revisão do par

![PR 1 mergeado na main por squash](img/10-pr1-mergeado.jpg)

![cauepereira aprovou o PR antes do merge](img/11-pr1-aprovado-pelo-par.jpg)

### 6.8 Aplicação em execução (ambiente local)

![Controle de Mudanças com a SM-0001 registrada](img/12-app-rodando-sm-registrada.jpg)
