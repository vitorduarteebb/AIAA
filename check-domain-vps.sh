#!/bin/bash

# Script para verificar se o domínio aulaai.com.br está funcionando
# IP: 31.97.250.28

echo "🔍 Verificando configuração do domínio aulaai.com.br..."

# 1. Verificar DNS
echo "📡 Verificando DNS..."
nslookup aulaai.com.br
echo ""

# 2. Verificar conectividade HTTP
echo "🌐 Testando conectividade HTTP..."
curl -I http://aulaai.com.br 2>/dev/null | head -5
echo ""

# 3. Verificar HTTPS
echo "🔒 Testando HTTPS..."
curl -I https://aulaai.com.br 2>/dev/null | head -5
echo ""

# 4. Verificar certificado SSL
echo "📜 Verificando certificado SSL..."
if command -v openssl &> /dev/null; then
    echo | openssl s_client -servername aulaai.com.br -connect aulaai.com.br:443 2>/dev/null | openssl x509 -noout -dates
else
    echo "OpenSSL não encontrado"
fi
echo ""

# 5. Verificar conectividade direta na VPS
echo "🖥️ Verificando conectividade direta na VPS..."
ssh root@31.97.250.28 << 'EOF'
echo "📊 Status dos serviços na VPS:"
echo ""

echo "⚙️ Status do Nginx:"
systemctl status nginx --no-pager -l | head -5
echo ""

echo "🐳 Status dos containers:"
docker-compose ps
echo ""

echo "📋 Últimos logs da aplicação:"
docker-compose logs --tail=5 app
echo ""

echo "🧪 Teste da API local:"
curl -s http://localhost:3000/api/health || echo "❌ API não responde"
echo ""

echo "🔐 Certificados SSL:"
certbot certificates
echo ""

echo "🌐 Teste do domínio local:"
curl -I https://aulaai.com.br 2>/dev/null | head -3
echo ""
EOF

echo "✅ Verificação concluída!"
echo "🌐 Se tudo estiver OK, acesse: https://aulaai.com.br" 