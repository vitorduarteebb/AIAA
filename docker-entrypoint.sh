#!/bin/bash
set -e

echo "🚀 Iniciando AIA Learning Platform..."

# Gerar cliente Prisma
echo "📦 Gerando cliente Prisma..."
npx prisma generate

# Sincronizar banco se necessário
echo "🗄️ Sincronizando banco de dados..."
npx prisma db push --accept-data-loss || true

# Iniciar aplicação em modo desenvolvimento
echo "🌐 Iniciando aplicação..."
exec npm run dev 