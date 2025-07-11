#!/bin/bash

echo "🚀 DEPLOY DIRETO - AIA Learning Platform"
echo "======================================="

# Configurações
VPS_IP="31.97.250.28"
VPS_USER="root"

echo "🌐 Conectando à VPS..."

# Comandos para executar na VPS
ssh $VPS_USER@$VPS_IP << 'ENDSSH'

echo "🔧 Atualizando sistema..."
apt update -y

echo "🐳 Instalando Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    usermod -aG docker $USER
    systemctl enable docker
    systemctl start docker
fi

echo "📦 Instalando Docker Compose..."
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
rm -rf *
git clone https://github.com/vitorduarteebb/AIAA.git .
rm -rf .git

echo "🔐 Configurando variáveis de ambiente..."
cat > .env << 'EOF'
DATABASE_URL="file:./prod.db"
NEXTAUTH_SECRET="aia-secret-key-2024"
NEXTAUTH_URL="http://31.97.250.28"
OPENAI_API_KEY="sk-proj-1234567890"
EOF

echo "🐳 Construindo e iniciando containers..."
docker-compose up -d --build

echo "⏳ Aguardando aplicação inicializar..."
sleep 60

echo "🔍 Verificando status dos containers..."
docker-compose ps

echo "🏥 Testando health check..."
curl -f http://localhost:3000/api/health || echo "❌ Health check falhou"

echo "🌐 Configurando Nginx..."
apt install -y nginx

cat > /etc/nginx/sites-available/aia-platform << 'EOF'
server {
    listen 80;
    server_name 31.97.250.28;
    
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
    }
}
EOF

ln -sf /etc/nginx/sites-available/aia-platform /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

echo "🔄 Reiniciando Nginx..."
systemctl restart nginx

echo "✅ Deploy concluído!"
echo "🌐 Acesse: http://31.97.250.28"
echo "🔧 Admin: http://31.97.250.28/admin/login"

ENDSSH

echo "✅ Deploy concluído com sucesso!"
echo "🌐 Acesse: http://31.97.250.28"
echo "🔧 Admin: http://31.97.250.28/admin/login" 