#!/bin/bash

# Script para verificar configuração do domínio
DOMAIN="aulaai.com.br"

echo "🔍 Verificando configuração do domínio $DOMAIN..."

# 1. Verificar DNS
echo "📡 Verificando DNS..."
nslookup $DOMAIN
echo ""

# 2. Verificar conectividade
echo "🌐 Testando conectividade..."
curl -I http://$DOMAIN 2>/dev/null | head -5
echo ""

# 3. Verificar HTTPS
echo "🔒 Testando HTTPS..."
curl -I https://$DOMAIN 2>/dev/null | head -5
echo ""

# 4. Verificar certificado SSL
echo "📜 Verificando certificado SSL..."
if command -v openssl &> /dev/null; then
    echo | openssl s_client -servername $DOMAIN -connect $DOMAIN:443 2>/dev/null | openssl x509 -noout -dates
else
    echo "OpenSSL não encontrado"
fi
echo ""

# 5. Verificar Nginx
echo "⚙️ Verificando Nginx..."
systemctl status nginx --no-pager -l | head -10
echo ""

# 6. Verificar containers
echo "🐳 Verificando containers..."
docker-compose ps
echo ""

# 7. Verificar logs da aplicação
echo "📋 Últimos logs da aplicação:"
docker-compose logs --tail=5 app
echo ""

# 8. Teste de API
echo "🧪 Testando API..."
curl -s http://localhost:3000/api/health || echo "❌ API não responde"
echo ""

echo "✅ Verificação concluída!" 