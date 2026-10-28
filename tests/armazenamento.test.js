// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import { CHAVE, carregarSolicitacoes, salvarSolicitacoes } from '../src/armazenamento.js';

const lista = [{ id: 'SM-0001', status: 'nova' }];

describe('armazenamento em localStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('devolve lista vazia quando nada foi salvo', () => {
    expect(carregarSolicitacoes()).toEqual([]);
  });

  it('salva e carrega as solicitações', () => {
    expect(salvarSolicitacoes(lista)).toBe(true);
    expect(localStorage.getItem(CHAVE)).toBe(JSON.stringify(lista));
    expect(carregarSolicitacoes()).toEqual(lista);
  });

  it('ignora JSON inválido', () => {
    localStorage.setItem(CHAVE, '{quebrado');
    expect(carregarSolicitacoes()).toEqual([]);
  });

  it('ignora conteúdo que não é uma lista', () => {
    localStorage.setItem(CHAVE, '{"id":"SM-0001"}');
    expect(carregarSolicitacoes()).toEqual([]);
  });

  it('não falha quando o armazenamento está indisponível', () => {
    expect(carregarSolicitacoes(null)).toEqual([]);
    expect(salvarSolicitacoes(lista, null)).toBe(false);
  });

  it('informa falha quando o armazenamento recusa a gravação', () => {
    const cheio = {
      setItem() {
        throw new Error('QuotaExceededError');
      },
    };
    expect(salvarSolicitacoes(lista, cheio)).toBe(false);
  });
});
