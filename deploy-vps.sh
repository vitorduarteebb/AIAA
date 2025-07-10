#!/bin/bash

echo "🚀 INICIANDO DEPLOY DA AIA LEARNING PLATFORM NA VPS"
echo "=================================================="

# Atualizar o sistema
echo "📦 Atualizando sistema..."
apt update && apt upgrade -y

# Instalar dependências necessárias
echo "🔧 Instalando dependências..."
apt install -y curl wget git unzip

# Instalar Docker se não estiver instalado
if ! command -v docker &> /dev/null; then
    echo "🐳 Instalando Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    usermod -aG docker $USER
    systemctl enable docker
    systemctl start docker
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

# Remover projeto existente se houver
if [ -d "AIAA" ]; then
    echo "🗑️ Removendo projeto existente..."
    rm -rf AIAA
fi

# Clonar o projeto do GitHub
echo "📥 Clonando projeto do GitHub..."
git clone https://github.com/vitorduarteebb/AIAA.git
cd AIAA

# Parar containers existentes se houver
echo "🛑 Parando containers existentes..."
docker-compose -f docker-compose.prod.yml down 2>/dev/null || true

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
if curl -f http://localhost/health; then
    echo "✅ Aplicação está respondendo!"
else
    echo "❌ Aplicação não está respondendo, verificando logs..."
    docker-compose -f docker-compose.prod.yml logs app
fi

# Mostrar status dos containers
echo "📊 Status dos containers:"
docker-compose -f docker-compose.prod.yml ps

echo ""
echo "🎉 DEPLOY CONCLUÍDO!"
echo "===================="
echo "🌐 Frontend: http://31.97.250.28"
echo "🔧 Admin: http://31.97.250.28/admin/login"
echo "❤️ Health Check: http://31.97.250.28/health"
echo ""
echo "📋 Comandos úteis:"
echo "  - Ver logs: docker-compose -f docker-compose.prod.yml logs -f"
echo "  - Parar: docker-compose -f docker-compose.prod.yml down"
echo "  - Reiniciar: docker-compose -f docker-compose.prod.yml restart"
echo ""
echo "🔐 Para criar admin: acesse http://31.97.250.28/setup-admin" 