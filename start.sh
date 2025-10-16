#!/bin/sh

# Iniciar o servidor Express em background
node server.js &

# Aguardar um pouco para o Express inicializar
sleep 2

# Iniciar o nginx em primeiro plano
nginx -g "daemon off;"
