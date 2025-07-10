#!/bin/bash

echo "🚀 Iniciando deploy da AIA Learning Platform..."

# Atualizar o sistema
echo "📦 Atualizando sistema..."
apt update && apt upgrade -y

# Instalar Docker se não estiver instalado
if ! command -v docker &> /dev/null; then
    echo "🐳 Instalando Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    usermod -aG docker $USER
fi

# Instalar Docker Compose se não estiver instalado
if ! command -v docker-compose &> /dev/null; then
    echo "📦 Instalando Docker Compose..."
    curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
fi

# Criar diretório do projeto
echo "📁 Criando diretório do projeto..."
mkdir -p /opt/aia-platform
cd /opt/aia-platform

# Parar containers existentes
echo "🛑 Parando containers existentes..."
docker-compose -f docker-compose.prod.yml down

# Fazer backup do banco se existir
if [ -f "prisma/prod.db" ]; then
    echo "💾 Fazendo backup do banco..."
    cp prisma/prod.db prisma/prod.db.backup.$(date +%Y%m%d_%H%M%S)
fi

# Construir e iniciar containers
echo "🔨 Construindo e iniciando containers..."
docker-compose -f docker-compose.prod.yml up -d --build

# Aguardar aplicação inicializar
echo "⏳ Aguardando aplicação inicializar..."
sleep 30

# Verificar status
echo "🔍 Verificando status da aplicação..."
curl -f http://localhost/health || echo "❌ Aplicação não está respondendo"

echo "✅ Deploy concluído!"
echo "🌐 Acesse: http://31.97.250.28" 