export const CHAVE = 'controle-mudancas:solicitacoes';

function armazenamentoPadrao() {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

export function carregarSolicitacoes(storage = armazenamentoPadrao()) {
  if (!storage) return [];
  try {
    const dados = JSON.parse(storage.getItem(CHAVE) ?? '[]');
    return Array.isArray(dados) ? dados : [];
  } catch {
    return [];
  }
}

export function salvarSolicitacoes(solicitacoes, storage = armazenamentoPadrao()) {
  if (!storage) return false;
  try {
    storage.setItem(CHAVE, JSON.stringify(solicitacoes));
    return true;
  } catch {
    return false;
  }
}
