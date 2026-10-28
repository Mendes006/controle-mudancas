import { describe, expect, it } from 'vitest';
import {
  alterarStatus,
  criarSolicitacao,
  filtrarPorStatus,
  proximoIdentificador,
  transicoesPermitidas,
  validarSolicitacao,
} from '../src/mudancas.js';

const AGORA = new Date('2026-10-28T12:00:00.000Z');

const dadosValidos = {
  solicitante: '  Ana Souza ',
  sistema: 'Módulo de cadastro',
  classificacao: 'melhoria',
  prioridade: 'alta',
  descricao: 'Permitir busca por CPF na tela de cadastro.',
};

describe('proximoIdentificador', () => {
  it('começa em SM-0001 quando não há solicitações', () => {
    expect(proximoIdentificador()).toBe('SM-0001');
    expect(proximoIdentificador([])).toBe('SM-0001');
  });

  it('incrementa a partir do maior identificador existente', () => {
    const existentes = [{ id: 'SM-0002' }, { id: 'SM-0010' }, { id: 'SM-0003' }];
    expect(proximoIdentificador(existentes)).toBe('SM-0011');
  });

  it('ignora identificadores fora do padrão', () => {
    expect(proximoIdentificador([{ id: 'X-99' }, {}])).toBe('SM-0001');
  });
});

describe('validarSolicitacao', () => {
  it('aceita dados completos', () => {
    expect(validarSolicitacao(dadosValidos)).toEqual([]);
  });

  it('aponta todos os campos obrigatórios ausentes', () => {
    const erros = validarSolicitacao({});
    expect(erros).toHaveLength(5);
    expect(erros).toContain('Informe o solicitante.');
    expect(erros).toContain('Classificação inválida.');
  });

  it('recusa classificação e prioridade fora da lista', () => {
    const erros = validarSolicitacao({
      ...dadosValidos,
      classificacao: 'refatoracao',
      prioridade: 'urgentissima',
    });
    expect(erros).toEqual(['Classificação inválida.', 'Prioridade inválida.']);
  });

  it('exige descrição com pelo menos 10 caracteres', () => {
    expect(validarSolicitacao({ ...dadosValidos, descricao: 'curta' })).toEqual([
      'A descrição deve ter pelo menos 10 caracteres.',
    ]);
  });
});

describe('criarSolicitacao', () => {
  it('cria SM nova, com identificador, dados normalizados e histórico', () => {
    const sm = criarSolicitacao(dadosValidos, [{ id: 'SM-0001' }], AGORA);
    expect(sm).toEqual({
      id: 'SM-0002',
      solicitante: 'Ana Souza',
      sistema: 'Módulo de cadastro',
      classificacao: 'melhoria',
      prioridade: 'alta',
      descricao: 'Permitir busca por CPF na tela de cadastro.',
      status: 'nova',
      criadaEm: AGORA.toISOString(),
      historico: [{ status: 'nova', em: AGORA.toISOString() }],
    });
  });

  it('lança erro com a lista de problemas quando os dados são inválidos', () => {
    let capturado;
    try {
      criarSolicitacao({ ...dadosValidos, solicitante: ' ' });
    } catch (erro) {
      capturado = erro;
    }
    expect(capturado).toBeInstanceOf(Error);
    expect(capturado.erros).toEqual(['Informe o solicitante.']);
  });
});

describe('transicoesPermitidas', () => {
  it.each([
    ['nova', ['em-analise']],
    ['em-analise', ['aprovada', 'rejeitada']],
    ['aprovada', ['implementada']],
    ['implementada', ['verificada']],
    ['verificada', ['fechada']],
    ['rejeitada', []],
    ['fechada', []],
    ['inexistente', []],
  ])('de "%s" permite %j', (status, esperado) => {
    expect(transicoesPermitidas(status)).toEqual(esperado);
  });

  it('devolve cópia, sem expor a tabela interna', () => {
    transicoesPermitidas('nova').push('fechada');
    expect(transicoesPermitidas('nova')).toEqual(['em-analise']);
  });
});

describe('alterarStatus', () => {
  const nova = criarSolicitacao(dadosValidos, [], AGORA);

  it('percorre o fluxo completo até o novo baseline', () => {
    const fluxo = ['em-analise', 'aprovada', 'implementada', 'verificada', 'fechada'];
    const final = fluxo.reduce((sm, status) => alterarStatus(sm, status, AGORA), nova);
    expect(final.status).toBe('fechada');
    expect(final.historico.map((h) => h.status)).toEqual(['nova', ...fluxo]);
  });

  it('não altera a solicitação original', () => {
    const analisada = alterarStatus(nova, 'em-analise', AGORA);
    expect(nova.status).toBe('nova');
    expect(nova.historico).toHaveLength(1);
    expect(analisada.historico).toHaveLength(2);
  });

  it('permite ao CCB rejeitar uma SM em análise', () => {
    const analisada = alterarStatus(nova, 'em-analise', AGORA);
    expect(alterarStatus(analisada, 'rejeitada', AGORA).status).toBe('rejeitada');
  });

  it.each([
    ['nova', 'aprovada'],
    ['nova', 'fechada'],
    ['em-analise', 'implementada'],
    ['aprovada', 'fechada'],
    ['rejeitada', 'aprovada'],
    ['fechada', 'nova'],
  ])('recusa a transição de "%s" para "%s"', (de, para) => {
    expect(() => alterarStatus({ ...nova, status: de }, para)).toThrow(
      `Transição inválida de "${de}" para "${para}".`,
    );
  });
});

describe('filtrarPorStatus', () => {
  const lista = [
    { id: 'SM-0001', status: 'nova' },
    { id: 'SM-0002', status: 'aprovada' },
    { id: 'SM-0003', status: 'nova' },
  ];

  it('devolve todas quando não há filtro', () => {
    expect(filtrarPorStatus(lista, '')).toBe(lista);
  });

  it('devolve apenas as do status escolhido', () => {
    expect(filtrarPorStatus(lista, 'nova').map((sm) => sm.id)).toEqual(['SM-0001', 'SM-0003']);
  });
});
