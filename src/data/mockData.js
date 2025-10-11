// Mock de dados para simular um banco local
export const mockData = {
  "andre": {
    nome: "André Ricardo",
    dependentes: [
      { id: 2, nome: "Marilene", tipo: "dependente" }
    ]
  },
  "victor": {
    nome: "Victor Hugo",
    dependentes: [
      { id: 1, nome: "Mirian", tipo: "dependente" },
      { id: 2, nome: "Sophia", tipo: "dependente" },
      { id: 3, nome: "Laura", tipo: "dependente" }
    ]
  },
  "lucas": {
    nome: "Lucas Torres",
    dependentes: [
      { id: 1, nome: "Maria Eduarda", tipo: "dependente" },
      { id: 1, nome: "João Pedro", tipo: "dependente" }
    ]
  },
  "wellington": {
    nome: "Wellington",
    dependentes: [
      { id: 1, nome: "Andresina", tipo: "dependente" },
      { id: 2, nome: "Gabriela", tipo: "dependente" }
    ] 
  },
  "ana": {
    nome: "Ana",
    dependentes: [
      { id: 1, nome: "Lucas", tipo: "dependente" },
      { id: 2, nome: "Julia", tipo: "dependente" }
    ]
  },
  "rafael": {
    nome: "Rafael",
    dependentes: [
      { id: 1, nome: "Aline", tipo: "dependente" },  
      { id: 2, nome: "Lucas Teles", tipo: "dependente" },
      { id: 3, nome: "Gabriel", tipo: "dependente" }
    ]
  },
  "riccardo": {
    nome: "Sofia",
    dependentes: [
      { id: 1, nome: "Andréia", tipo: "dependente" },  
      { id: 2, nome: "Pietro", tipo: "dependente" }
    ]
  },
  "vicente": {
    nome: "Vicente",
    dependentes: [
      { id: 1, nome: "Marli", tipo: "dependente" },  
      { id: 2, nome: "Arthur", tipo: "dependente" }
    ]
  },
  "pedro": {
    nome: "Pedro",
    dependentes: [
      { id: 1, nome: "Fernanda", tipo: "dependente" }
    ]
  },
  "sérgio": {
    nome: "Sérgio",
    dependentes: [
      { id: 1, nome: "Claudia", tipo: "dependente" }
    ]
  },
  "félix": {
    nome: "Félix",
    dependentes: [
      { id: 1, nome: "Elidiani", tipo: "dependente" },
      { id: 2, nome: "Beatriz", tipo: "dependente" }
    ]
  },
  "reginaldo": {
    nome: "Reginaldo",
    dependentes: [
      { id: 1, nome: "Kezinha", tipo: "dependente" },
      { id: 2, nome: "Luan", tipo: "dependente" }, 
      { id: 3, nome: "Ana Clara", tipo: "dependente" },
      { id: 4, nome: "Cida", tipo: "dependente" }
    ]
  },
  "edis": {
    nome: "Edis",
    dependentes: [
      { id: 1, nome: "Claudia", tipo: "dependente" },
      { id: 2, nome: "Ana Júlia", tipo: "dependente" }
    ]
  },
  "luan": {
    nome: "Luan",
    dependentes: [
      { id: 1, nome: "Natalia", tipo: "dependente" }
    ]
  },
  "wolingston": {
    nome: "Wolingston",
    dependentes: [
      { id: 1, nome: "Sandrelle", tipo: "dependente" }, 
      { id: 2, nome: "Angélica", tipo: "dependente" },
      { id: 3, nome: "Yasmin", tipo: "dependente" }
    ]
  },
  "sebastião": {
    nome: "Sebastião",
    dependentes: [
      { id: 1, nome: "Maurina", tipo: "dependente" }
    
    ]
  },
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
