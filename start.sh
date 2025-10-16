#!/bin/sh

# Iniciar o servidor Express em background
node server.js &

# Iniciar o nginx em primeiro plano
nginx -g "daemon off;"
