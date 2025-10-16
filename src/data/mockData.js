// Mock de dados para simular um banco local
export const mockData = {
  "andre": {
    nome: "André Ricardo",
    dependentes: [
      { id: 1, nome: "Marilene", tipo: "dependente" }
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
  "lucas torres": {
    nome: "Lucas Torres",
    dependentes: [
      { id: 1, nome: "Maria Eduarda", tipo: "dependente" },
      { id: 2, nome: "João Pedro", tipo: "dependente" }
    ]
  },
  "wellington": {
    nome: "Wellington",
    dependentes: [
      { id: 1, nome: "Andresina", tipo: "dependente" },
      { id: 2, nome: "Gabriela", tipo: "dependente" }
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
    nome: "Riccardo",
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
      { id: 1, nome: "Claudia", tipo: "dependente" },
      { id: 2, nome: "Sérgio Guilherme", tipo: "dependente" }
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
  "sebastião oliveira": {
    nome: "Sebastião",
    dependentes: [
      { id: 1, nome: "Maurina", tipo: "dependente" }
    
    ]
  },
  "jose guilherme": {
    nome: "José Guilherme",
    dependentes: [
    ]
  },
  "wilson ribeiro": {
    nome: "Wilson Ribeiro",
    dependentes: [
      { id: 1, nome: "Maria Abadia", tipo: "dependente" }
    ]
  },
  "alex": {
    nome: "Alex",
    dependentes: [
      { id: 1, nome: "Ione", tipo: "dependente" },
      { id: 2, nome: "Marcos", tipo: "dependente" },
      { id: 3, nome: "Luria", tipo: "dependente" },
      { id: 4, nome: "Pietro", tipo: "dependente" }
    ]
  },
  "lucas rosette": {
    nome: "Lucas Rosette",
    dependentes: [
      { id: 1, nome: "Tamires", tipo: "dependente" },
      { id: 2, nome: "Ana Luiza", tipo: "dependente" },
      { id: 3, nome: "Alice", tipo: "dependente" },
      { id: 4, nome: "Miguel", tipo: "dependente" }
    ]
  },
  "alessandra martins": {
    nome: "Alessandra Martins",
    dependentes: [
      { id: 1, nome: "Karen", tipo: "dependente" }
    ]
  },
  "osório": {
    nome: "Osório",
    dependentes: [
      { id: 1, nome: "Vania", tipo: "dependente" }
    ]
  },
  "divino": {
    nome: "Divino",
    dependentes: [
      { id: 1, nome: "Walquíria", tipo: "dependente" }
    ]
  },
  "sebastião ramos": {
    nome: "Sebastião Ramos",
    dependentes: [
    ]
  },
};

// Chave para armazenar no localStorage
const CONFIRMACOES_KEY = 'amMarriage_confirmacoes';

// Função para remover acentos
const removerAcentos = (texto) => {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};

// Função para buscar sugestões de nomes
export const buscarSugestoes = (termo) => {
  if (!termo || termo.length < 2) {
    return [];
  }
  
  const termoNormalizado = removerAcentos(termo);
  const sugestoes = [];
  
  for (const [chave, dados] of Object.entries(mockData)) {
    const chaveNormalizada = removerAcentos(chave);
    const nomeNormalizado = removerAcentos(dados.nome);
    
    // Verifica se o termo está contido na chave ou no nome
    if (chaveNormalizada.includes(termoNormalizado) || nomeNormalizado.includes(termoNormalizado)) {
      sugestoes.push({
        chave: chave,
        nome: dados.nome,
        display: dados.nome // Nome que será exibido na sugestão
      });
    }
  }
  
  // Remove duplicatas e limita a 5 sugestões
  const sugestoesUnicas = sugestoes.filter((sugestao, index, self) => 
    index === self.findIndex(s => s.chave === sugestao.chave)
  ).slice(0, 5);
  
  return sugestoesUnicas;
};

// Função para obter confirmações do localStorage
export const obterConfirmacoesDoStorage = () => {
  try {
    const confirmacoes = localStorage.getItem(CONFIRMACOES_KEY);
    return confirmacoes ? JSON.parse(confirmacoes) : {};
  } catch (error) {
    console.error('Erro ao ler confirmações do localStorage:', error);
    return {};
  }
};

// Função para salvar confirmações no localStorage
export const salvarConfirmacoesNoStorage = (confirmacoes) => {
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
