#!/bin/bash

echo "🚀 Iniciando AIA Learning Platform..."

# Gerar cliente Prisma
echo "📦 Gerando cliente Prisma..."
npx prisma generate

# Sincronizar banco de dados
echo "🗄️ Sincronizando banco de dados..."
npx prisma db push

# Iniciar aplicação em modo produção
echo "🌐 Iniciando aplicação..."
npm start 