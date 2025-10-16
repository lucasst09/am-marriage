# Sistema de Confirmações com Servidor

## ✅ Problema Resolvido

O sistema agora salva as confirmações em um arquivo JSON no servidor, permitindo que:
- ✅ Pessoas confirmem de qualquer navegador/dispositivo
- ✅ O painel admin veja todas as confirmações de todos os usuários
- ✅ Os dados sejam persistidos entre sessões

## 🚀 Como Executar

### Desenvolvimento Local

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Executar servidor + frontend:**
   ```bash
   npm run dev:full
   ```
   - Frontend: http://localhost:5173
   - API: http://localhost:3001

3. **Ou executar separadamente:**
   ```bash
   # Terminal 1 - Servidor
   npm run server
   
   # Terminal 2 - Frontend
   npm run dev
   ```

### Docker (Desenvolvimento)

```bash
docker-compose up --build
```
- Frontend: http://localhost:5173
- API: http://localhost:3001

### Docker (Produção)

```bash
docker-compose -f docker-compose.prod.yml up --build
```
- Aplicação completa: http://localhost:80

## 📁 Estrutura dos Dados

### Arquivo de Confirmações
- **Desenvolvimento:** `confirmations.json` (na raiz do projeto)
- **Produção:** `data/confirmations.json` (dentro do container)

### Formato do Arquivo JSON
```json
{
  "nome_do_convidado": {
    "principal": 1,
    "dependentes": {
      "1": 1,
      "2": 0
    },
    "telefone": "(61) 99999-9999",
    "observacoes": "Restrições alimentares",
    "dataConfirmacao": "2024-01-15T10:30:00.000Z"
  }
}
```

## 🔧 API Endpoints

### GET `/api/confirmations`
- Obtém todas as confirmações
- Usado pelo painel admin

### GET `/api/confirmations/:guestName`
- Obtém confirmação específica
- Usado para verificar se já existe confirmação

### POST `/api/confirmations`
- Salva nova confirmação
- Usado pelo formulário de confirmação

### GET `/api/confirmations/:guestName/exists`
- Verifica se existe confirmação
- Usado para validação

### GET `/api/confirmations/stats`
- Obtém estatísticas
- Usado pelo painel admin

### DELETE `/api/confirmations`
- Limpa todas as confirmações
- Usado pelo painel admin

## 🛡️ Segurança

- ✅ Validação de dados no servidor
- ✅ Prevenção de duplicatas
- ✅ Tratamento de erros
- ✅ CORS configurado

## 📊 Funcionalidades

### Para Convidados
- ✅ Buscar nome na lista
- ✅ Confirmar presença individual
- ✅ Confirmar presença de acompanhantes
- ✅ Adicionar telefone e observações
- ✅ Ver confirmação existente (somente leitura)

### Para Admin
- ✅ Ver todas as confirmações
- ✅ Exportar para PDF
- ✅ Estatísticas em tempo real
- ✅ Limpar todas as confirmações
- ✅ Atualizar lista

## 🔄 Migração dos Dados

Se você tinha confirmações no localStorage anteriormente, elas não serão migradas automaticamente. O sistema agora usa o servidor como fonte única da verdade.

## 🐛 Troubleshooting

### Erro de Conexão
- Verifique se o servidor está rodando na porta 3001
- Em produção, verifique se a API está acessível

### Dados Não Aparecem
- Verifique se o arquivo `confirmations.json` existe
- Verifique as permissões do arquivo
- Verifique os logs do servidor

### Docker Issues
- Verifique se as portas 5173 e 3001 estão livres
- Em produção, verifique se a porta 80 está livre
- Verifique os logs: `docker-compose logs`

