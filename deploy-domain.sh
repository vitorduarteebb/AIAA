#!/bin/bash

# Script de deploy com configuração de domínio
# Execute este script na sua VPS

echo "🚀 Iniciando deploy com configuração de domínio..."

# 1. Parar containers existentes
echo "🛑 Parando containers existentes..."
docker-compose down

# 2. Fazer backup do banco atual
echo "💾 Fazendo backup do banco..."
if [ -f "prisma/dev.db" ]; then
    cp prisma/dev.db backups/backup-$(date +%Y%m%d-%H%M%S).db
    echo "✅ Backup criado"
else
    echo "⚠️ Nenhum banco encontrado para backup"
fi

# 3. Atualizar código (se necessário)
echo "📥 Atualizando código..."
git pull origin main

# 4. Reconstruir e iniciar containers
echo "🔨 Reconstruindo containers..."
docker-compose -f docker-compose.prod.yml up -d --build

# 5. Aguardar aplicação inicializar
echo "⏳ Aguardando aplicação inicializar..."
sleep 30

# 6. Verificar status
echo "📊 Verificando status..."
docker-compose -f docker-compose.prod.yml ps

# 7. Verificar logs
echo "📋 Últimos logs da aplicação:"
docker-compose -f docker-compose.prod.yml logs --tail=20 app

# 8. Testar aplicação
echo "🧪 Testando aplicação..."
curl -f http://localhost:3000/api/health || echo "❌ Aplicação não está respondendo"

echo "✅ Deploy concluído!"
echo "🌐 Acesse: https://aulaai.com.br" 