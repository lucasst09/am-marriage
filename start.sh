#!/bin/sh

# Configurar variável de ambiente
export NODE_ENV=production

# Criar diretório de dados se não existir
mkdir -p /app/data

# Iniciar o servidor Express em background
echo "Iniciando servidor Express na porta 3001..."
node server.js &

# Aguardar o Express inicializar
echo "Aguardando Express inicializar..."
sleep 5

# Verificar se o Express está rodando
if ! curl -f http://localhost:3001/api/confirmations/stats > /dev/null 2>&1; then
    echo "ERRO: Express não está respondendo na porta 3001"
    exit 1
fi

echo "Express rodando com sucesso!"

# Iniciar o nginx em primeiro plano
echo "Iniciando nginx..."
nginx -g "daemon off;"
