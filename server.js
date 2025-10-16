import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const CONFIRMATIONS_FILE = process.env.NODE_ENV === 'production' 
  ? path.join(__dirname, 'data', 'confirmations.json')
  : path.join(__dirname, 'confirmations.json');

// Middleware
app.use(cors());
app.use(express.json());

// Servir arquivos estáticos do frontend em produção
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
}

// Função para ler confirmações do arquivo JSON
function readConfirmations() {
  try {
    if (fs.existsSync(CONFIRMATIONS_FILE)) {
      const data = fs.readFileSync(CONFIRMATIONS_FILE, 'utf8');
      return JSON.parse(data);
    }
    return {};
  } catch (error) {
    console.error('Erro ao ler confirmações:', error);
    return {};
  }
}

// Função para salvar confirmações no arquivo JSON
function saveConfirmations(confirmations) {
  try {
    fs.writeFileSync(CONFIRMATIONS_FILE, JSON.stringify(confirmations, null, 2));
    return true;
  } catch (error) {
    console.error('Erro ao salvar confirmações:', error);
    return false;
  }
}

// Rota para obter uma confirmação específica
app.get('/api/confirmations/:guestName', (req, res) => {
  try {
    const { guestName } = req.params;
    const normalizedName = guestName.toLowerCase().trim();
    const confirmations = readConfirmations();
    const confirmation = confirmations[normalizedName];
    
    if (confirmation) {
      res.json({
        success: true,
        data: {
          guestName: normalizedName,
          ...confirmation
        }
      });
    } else {
      res.json({
        success: false,
        error: 'Confirmação não encontrada'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// Rota para obter todas as confirmações
app.get('/api/confirmations', (req, res) => {
  try {
    const confirmations = readConfirmations();
    res.json({
      success: true,
      data: confirmations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// Rota para salvar uma confirmação
app.post('/api/confirmations', (req, res) => {
  try {
    const { guestName, principal, dependentes, telefone, observacoes } = req.body;
    
    // Validações
    if (!guestName || typeof guestName !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Nome do convidado é obrigatório'
      });
    }

    if (typeof principal !== 'number') {
      return res.status(400).json({
        success: false,
        error: 'Confirmação do convidado principal é obrigatória'
      });
    }

    const normalizedName = guestName.toLowerCase().trim();
    const confirmations = readConfirmations();
    
    // Verifica se já existe confirmação
    if (confirmations[normalizedName]) {
      return res.status(400).json({
        success: false,
        error: 'Já existe uma confirmação para este convidado'
      });
    }

    // Cria a confirmação
    const confirmation = {
      principal,
      dependentes: dependentes || {},
      telefone: telefone || '',
      observacoes: observacoes || '',
      dataConfirmacao: new Date().toISOString()
    };

    // Salva a confirmação
    confirmations[normalizedName] = confirmation;
    
    if (saveConfirmations(confirmations)) {
      res.json({
        success: true,
        data: {
          guestName: normalizedName,
          ...confirmation
        }
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Erro ao salvar confirmação'
      });
    }
  } catch (error) {
    console.error('Erro ao salvar confirmação:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// Rota para verificar se existe confirmação
app.get('/api/confirmations/:guestName/exists', (req, res) => {
  try {
    const { guestName } = req.params;
    const normalizedName = guestName.toLowerCase().trim();
    const confirmations = readConfirmations();
    
    res.json({
      success: true,
      exists: !!confirmations[normalizedName]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// Rota para obter estatísticas
app.get('/api/confirmations/stats', (req, res) => {
  try {
    const confirmations = readConfirmations();
    
    const stats = {
      totalConfirmations: Object.keys(confirmations).length,
      totalAttending: 0,
      totalNotAttending: 0,
      mainGuestsAttending: 0,
      mainGuestsNotAttending: 0,
      dependentsAttending: 0,
      dependentsNotAttending: 0,
      confirmationsWithPhone: 0,
      confirmationsWithObservations: 0
    };

    Object.values(confirmations).forEach(confirmation => {
      // Contar principal
      if (confirmation.principal === 1) {
        stats.mainGuestsAttending++;
        stats.totalAttending++;
      } else {
        stats.mainGuestsNotAttending++;
        stats.totalNotAttending++;
      }
      
      // Contar dependentes
      if (confirmation.dependentes) {
        Object.values(confirmation.dependentes).forEach(depStatus => {
          if (depStatus === 1) {
            stats.dependentsAttending++;
            stats.totalAttending++;
          } else {
            stats.dependentsNotAttending++;
            stats.totalNotAttending++;
          }
        });
      }
      
      // Contar telefone e observações
      if (confirmation.telefone && confirmation.telefone.trim()) {
        stats.confirmationsWithPhone++;
      }
      
      if (confirmation.observacoes && confirmation.observacoes.trim()) {
        stats.confirmationsWithObservations++;
      }
    });

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// Rota para limpar todas as confirmações (apenas para admin)
app.delete('/api/confirmations', (req, res) => {
  try {
    if (saveConfirmations({})) {
      res.json({
        success: true,
        message: 'Todas as confirmações foram removidas'
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Erro ao limpar confirmações'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// Em produção, o nginx serve os arquivos estáticos
// O Express só serve as rotas da API

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Arquivo de confirmações: ${CONFIRMATIONS_FILE}`);
  if (process.env.NODE_ENV === 'production') {
    console.log('Modo de produção: servindo arquivos estáticos');
  }
});
