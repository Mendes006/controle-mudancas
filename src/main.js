import './estilo.css';
import {
  CLASSIFICACOES,
  PRIORIDADES,
  STATUS,
  alterarStatus,
  criarSolicitacao,
  filtrarPorStatus,
  transicoesPermitidas,
} from './mudancas.js';
import { carregarSolicitacoes, salvarSolicitacoes } from './armazenamento.js';

const ROTULOS_ACAO = {
  'em-analise': 'Enviar ao CCB',
  aprovada: 'Aprovar',
  rejeitada: 'Rejeitar',
  implementada: 'Marcar implementada',
  verificada: 'Marcar verificada',
  fechada: 'Fechar (novo baseline)',
};

const elementos = {
  titulo: document.getElementById('titulo'),
  form: document.getElementById('form-sm'),
  classificacao: document.getElementById('classificacao'),
  prioridade: document.getElementById('prioridade'),
  erros: document.getElementById('erros'),
  filtro: document.getElementById('filtro'),
  lista: document.getElementById('lista'),
  vazio: document.getElementById('vazio'),
  ambiente: document.getElementById('ambiente'),
};

let solicitacoes = carregarSolicitacoes();

function preencherOpcoes(select, opcoes, primeira) {
  const itens = primeira ? [['', primeira], ...Object.entries(opcoes)] : Object.entries(opcoes);
  select.replaceChildren(
    ...itens.map(([valor, rotulo]) => new Option(rotulo, valor)),
  );
}

function criar(tag, classe, texto) {
  const el = document.createElement(tag);
  if (classe) el.className = classe;
  if (texto !== undefined) el.textContent = texto;
  return el;
}

function itemSolicitacao(sm) {
  const item = criar('li', 'item');
  const topo = criar('div', 'item-topo');
  topo.append(
    criar('strong', 'item-id', sm.id),
    criar('span', `selo selo-${sm.status}`, STATUS[sm.status]),
  );

  const meta = criar(
    'p',
    'item-meta',
    `${CLASSIFICACOES[sm.classificacao]} · prioridade ${PRIORIDADES[sm.prioridade].toLowerCase()} · ${sm.sistema} · por ${sm.solicitante}`,
  );

  const acoes = criar('div', 'item-acoes');
  for (const destino of transicoesPermitidas(sm.status)) {
    const botao = criar('button', 'secundario', ROTULOS_ACAO[destino]);
    botao.type = 'button';
    botao.setAttribute('aria-label', `${ROTULOS_ACAO[destino]}: ${sm.id}`);
    botao.addEventListener('click', () => mover(sm.id, destino));
    acoes.append(botao);
  }

  item.append(topo, meta, criar('p', 'item-descricao', sm.descricao), acoes);
  return item;
}

function renderizar() {
  const visiveis = filtrarPorStatus(solicitacoes, elementos.filtro.value);
  elementos.lista.replaceChildren(...[...visiveis].reverse().map(itemSolicitacao));
  elementos.vazio.hidden = visiveis.length > 0;
}

function persistir() {
  salvarSolicitacoes(solicitacoes);
  renderizar();
}

function mover(id, destino) {
  solicitacoes = solicitacoes.map((sm) => (sm.id === id ? alterarStatus(sm, destino) : sm));
  persistir();
}

function mostrarErros(erros) {
  elementos.erros.replaceChildren(...erros.map((texto) => criar('li', '', texto)));
}

elementos.form.addEventListener('submit', (evento) => {
  evento.preventDefault();
  const dados = Object.fromEntries(new FormData(elementos.form));
  try {
    solicitacoes = [...solicitacoes, criarSolicitacao(dados, solicitacoes)];
  } catch (erro) {
    mostrarErros(erro.erros ?? [erro.message]);
    return;
  }
  mostrarErros([]);
  elementos.form.reset();
  elementos.prioridade.value = 'media';
  persistir();
});

elementos.filtro.addEventListener('change', renderizar);

const titulo = import.meta.env.VITE_TITULO;
if (titulo) {
  elementos.titulo.textContent = titulo;
  document.title = titulo;
}
elementos.ambiente.textContent = import.meta.env.VITE_AMBIENTE || 'local';

preencherOpcoes(elementos.classificacao, CLASSIFICACOES);
preencherOpcoes(elementos.prioridade, PRIORIDADES);
preencherOpcoes(elementos.filtro, STATUS, 'Todos');
elementos.prioridade.value = 'media';
renderizar();
