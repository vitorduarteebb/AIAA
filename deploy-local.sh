#!/bin/bash

echo "🚀 Deploy Local - AIA Learning Platform"
echo "======================================="

# Parar containers existentes
echo "🛑 Parando containers existentes..."
docker-compose down

# Limpar imagens antigas
echo "🧹 Limpando imagens antigas..."
docker system prune -f

# Construir e iniciar
echo "🔨 Construindo e iniciando containers..."
docker-compose up -d --build

# Aguardar inicialização
echo "⏳ Aguardando aplicação inicializar..."
sleep 30

# Verificar status
echo "🔍 Verificando status..."
docker-compose ps

# Testar health check
echo "🏥 Testando health check..."
curl -f http://localhost/health || echo "❌ Health check falhou"

echo ""
echo "✅ Deploy local concluído!"
echo "🌐 Acesse: http://localhost"
echo "📊 Status: docker-compose ps"
echo "📋 Logs: docker-compose logs -f" 