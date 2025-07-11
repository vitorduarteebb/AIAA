#!/bin/bash

# Script de Deploy Final para VPS Ubuntu 24.04
# AIA Learning Platform

set -e

echo "🚀 DEPLOY FINAL - AIA Learning Platform"
echo "======================================="

# Configurações
VPS_IP="31.97.250.28"
VPS_USER="root"
DOMAIN="aia.31.97.250.28.nip.io"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
    exit 1
}

info() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] INFO: $1${NC}"
}

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    error "Execute este script no diretório raiz do projeto"
fi

# 1. Preparar arquivos para deploy
log "📦 Preparando arquivos para deploy..."

# Criar arquivo .env para produção
cat > .env.production << EOF
DATABASE_URL="file:./prod.db"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
NEXTAUTH_URL="https://$DOMAIN"
OPENAI_API_KEY="sua-chave-openai-aqui"
EOF

# 2. Fazer backup do banco atual (se existir)
if [ -f "dev.db" ]; then
    log "💾 Fazendo backup do banco de dados..."
    cp dev.db backup-$(date +%Y%m%d-%H%M%S).db
fi

# 3. Deploy via SSH
log "🌐 Conectando à VPS e fazendo deploy..."

ssh $VPS_USER@$VPS_IP << 'ENDSSH'
set -e

echo "🔧 Atualizando sistema..."
apt update && apt upgrade -y

echo "🐳 Instalando Docker e Docker Compose..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    usermod -aG docker $USER
    systemctl enable docker
    systemctl start docker
fi

if ! command -v docker-compose &> /dev/null; then
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
fi

echo "📁 Criando diretório do projeto..."
mkdir -p /opt/aia-platform
cd /opt/aia-platform

echo "🔄 Parando containers existentes..."
docker-compose down || true

echo "🧹 Limpando imagens antigas..."
docker system prune -f

echo "📥 Baixando código atualizado..."
rm -rf app
git clone https://github.com/vitorduarteebb/AIAA.git temp-repo
cp -r temp-repo/* .
rm -rf temp-repo

echo "🔐 Configurando variáveis de ambiente..."
cat > .env << 'EOF'
DATABASE_URL="file:./prod.db"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
NEXTAUTH_URL="https://aia.31.97.250.28.nip.io"
OPENAI_API_KEY="sua-chave-openai-aqui"
EOF

echo "🐳 Construindo e iniciando containers..."
docker-compose up -d --build

echo "⏳ Aguardando aplicação inicializar..."
sleep 45

echo "🔍 Verificando status dos containers..."
docker-compose ps

echo "🏥 Testando health check..."
if curl -f http://localhost:3000/api/health; then
    echo "✅ Health check passou!"
else
    echo "❌ Health check falhou, verificando logs..."
    docker-compose logs app
fi

echo "🌐 Configurando Nginx..."
apt install -y nginx

cat > /etc/nginx/sites-available/aia-platform << 'EOF'
server {
    listen 80;
    server_name aia.31.97.250.28.nip.io;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }
    
    location /health {
        proxy_pass http://localhost:3000/api/health;
        access_log off;
    }
}
EOF

ln -sf /etc/nginx/sites-available/aia-platform /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

echo "🔧 Testando configuração do Nginx..."
nginx -t

echo "🔄 Reiniciando Nginx..."
systemctl restart nginx

echo "✅ Deploy concluído com sucesso!"
echo "🌐 Acesse: https://aia.31.97.250.28.nip.io"
echo "🔧 Admin: https://aia.31.97.250.28.nip.io/admin/login"
echo "📊 Status: docker-compose ps"
echo "📋 Logs: docker-compose logs -f"

ENDSSH

if [ $? -eq 0 ]; then
    log "✅ Deploy concluído com sucesso!"
    log "🌐 Acesse: https://$DOMAIN"
    log "🔧 Admin: https://$DOMAIN/admin/login"
    log "📊 Para verificar status: ssh $VPS_USER@$VPS_IP 'cd /opt/aia-platform && docker-compose ps'"
    log "📋 Para ver logs: ssh $VPS_USER@$VPS_IP 'cd /opt/aia-platform && docker-compose logs -f'"
else
    error "❌ Falha no deploy. Verifique os logs acima."
fi 