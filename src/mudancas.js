export const STATUS = {
  nova: 'Nova',
  'em-analise': 'Em análise (CCB)',
  aprovada: 'Aprovada',
  rejeitada: 'Rejeitada',
  implementada: 'Implementada',
  verificada: 'Verificada',
  fechada: 'Fechada (novo baseline)',
};

export const CLASSIFICACOES = {
  adicao: 'Adição',
  melhoria: 'Melhoria',
  correcao: 'Correção de defeito',
};

export const PRIORIDADES = {
  baixa: 'Baixa',
  media: 'Média',
  alta: 'Alta',
};

const TRANSICOES = {
  nova: ['em-analise'],
  'em-analise': ['aprovada', 'rejeitada'],
  aprovada: ['implementada'],
  rejeitada: [],
  implementada: ['verificada'],
  verificada: ['fechada'],
  fechada: [],
};

const PADRAO_ID = /^SM-(\d+)$/;

export function proximoIdentificador(solicitacoes = []) {
  const maior = solicitacoes.reduce((max, { id }) => {
    const numero = Number(PADRAO_ID.exec(id ?? '')?.[1] ?? 0);
    return Math.max(max, numero);
  }, 0);
  return `SM-${String(maior + 1).padStart(4, '0')}`;
}

export function validarSolicitacao(dados = {}) {
  const erros = [];
  const texto = (campo) => String(dados[campo] ?? '').trim();

  if (!texto('solicitante')) erros.push('Informe o solicitante.');
  if (!texto('sistema')) erros.push('Informe o sistema/módulo afetado.');
  if (!(dados.classificacao in CLASSIFICACOES)) erros.push('Classificação inválida.');
  if (!(dados.prioridade in PRIORIDADES)) erros.push('Prioridade inválida.');
  if (texto('descricao').length < 10) {
    erros.push('A descrição deve ter pelo menos 10 caracteres.');
  }
  return erros;
}

export function criarSolicitacao(dados, existentes = [], agora = new Date()) {
  const erros = validarSolicitacao(dados);
  if (erros.length > 0) {
    const erro = new Error(erros.join(' '));
    erro.erros = erros;
    throw erro;
  }
  const data = agora.toISOString();
  return {
    id: proximoIdentificador(existentes),
    solicitante: dados.solicitante.trim(),
    sistema: dados.sistema.trim(),
    classificacao: dados.classificacao,
    prioridade: dados.prioridade,
    descricao: dados.descricao.trim(),
    status: 'nova',
    criadaEm: data,
    historico: [{ status: 'nova', em: data }],
  };
}

export function transicoesPermitidas(status) {
  return [...(TRANSICOES[status] ?? [])];
}

export function alterarStatus(solicitacao, novoStatus, agora = new Date()) {
  if (!transicoesPermitidas(solicitacao.status).includes(novoStatus)) {
    throw new Error(
      `Transição inválida de "${solicitacao.status}" para "${novoStatus}".`,
    );
  }
  const em = agora.toISOString();
  return {
    ...solicitacao,
    status: novoStatus,
    historico: [...solicitacao.historico, { status: novoStatus, em }],
  };
}

export function filtrarPorStatus(solicitacoes, status) {
  if (!status) return solicitacoes;
  return solicitacoes.filter((sm) => sm.status === status);
}
