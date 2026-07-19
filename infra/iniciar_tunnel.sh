#!/bin/bash
echo "Iniciando túnel para a porta 8080..."
cloudflared tunnel --url http://localhost:8080
