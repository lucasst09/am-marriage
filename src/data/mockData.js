// Mock de dados para simular um banco local
export const mockData = {
  "andre": {
    nome: "André",
    dependentes: [
      { id: 1, nome: "Maria", tipo: "dependente" },
      { id: 2, nome: "Marilene", tipo: "dependente" }
    ]
  },
  "joao": {
    nome: "João",
    dependentes: [
      { id: 1, nome: "Ana", tipo: "dependente" },
      { id: 2, nome: "Carlos", tipo: "dependente" },
      { id: 3, nome: "Sofia", tipo: "dependente" }
    ]
  },
  "maria": {
    nome: "Maria",
    dependentes: [
      { id: 1, nome: "Pedro", tipo: "dependente" }
    ]
  },
  "carlos": {
    nome: "Carlos",
    dependentes: []
  },
  "ana": {
    nome: "Ana",
    dependentes: [
      { id: 1, nome: "Lucas", tipo: "dependente" },
      { id: 2, nome: "Julia", tipo: "dependente" }
    ]
  },
  "pedro": {
    nome: "Pedro",
    dependentes: [
      { id: 1, nome: "Fernanda", tipo: "dependente" }
    ]
  },
  "sofia": {
    nome: "Sofia",
    dependentes: []
  }
};

// Chave para armazenar no localStorage
const CONFIRMACOES_KEY = 'amMarriage_confirmacoes';

// Função para obter confirmações do localStorage
const obterConfirmacoesDoStorage = () => {
  try {
    const confirmacoes = localStorage.getItem(CONFIRMACOES_KEY);
    return confirmacoes ? JSON.parse(confirmacoes) : {};
  } catch (error) {
    console.error('Erro ao ler confirmações do localStorage:', error);
    return {};
  }
};

// Função para salvar confirmações no localStorage
const salvarConfirmacoesNoStorage = (confirmacoes) => {
  try {
    localStorage.setItem(CONFIRMACOES_KEY, JSON.stringify(confirmacoes));
    return true;
  } catch (error) {
    console.error('Erro ao salvar confirmações no localStorage:', error);
    return false;
  }
};

export const buscarDadosPorNome = (nome) => {
  const nomeLower = nome.toLowerCase();
  return mockData[nomeLower] || null;
};

export const obterPessoasDisponiveis = (nome) => {
  const dados = buscarDadosPorNome(nome);
  if (!dados) return [];
  
  const pessoas = [
    { id: 0, nome: dados.nome, tipo: "convidado" }
  ];
  
  dados.dependentes.forEach(dependente => {
    pessoas.push(dependente);
  });
  
  return pessoas;
};

// Função para verificar se já existe confirmação
export const verificarConfirmacaoExistente = (nome) => {
  const nomeLower = nome.toLowerCase();
  const confirmacoes = obterConfirmacoesDoStorage();
  return confirmacoes[nomeLower] || null;
};

// Função para salvar confirmação
export const salvarConfirmacao = (nome, dadosConfirmacao) => {
  const nomeLower = nome.toLowerCase();
  const confirmacoes = obterConfirmacoesDoStorage();
  
  confirmacoes[nomeLower] = {
    ...dadosConfirmacao,
    dataConfirmacao: new Date().toISOString()
  };
  
  return salvarConfirmacoesNoStorage(confirmacoes);
};

// Função para obter todas as confirmações (útil para administração)
export const obterTodasConfirmacoes = () => {
  return obterConfirmacoesDoStorage();
};

// Função para limpar todas as confirmações (útil para testes)
export const limparTodasConfirmacoes = () => {
  try {
    localStorage.removeItem(CONFIRMACOES_KEY);
    return true;
  } catch (error) {
    console.error('Erro ao limpar confirmações:', error);
    return false;
  }
};
