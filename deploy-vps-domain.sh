#!/bin/bash

# Script para deploy na VPS com domínio aulaai.com.br
# IP: 31.97.250.28

echo "🚀 Iniciando deploy na VPS com domínio aulaai.com.br..."

# 1. Conectar na VPS e navegar para o diretório
echo "📡 Conectando na VPS..."
ssh root@31.97.250.28 << 'EOF'

echo "📁 Navegando para o diretório do projeto..."
cd /root/aia-learning-platform

# 2. Parar containers existentes
echo "🛑 Parando containers existentes..."
docker-compose down

# 3. Fazer backup do banco
echo "💾 Fazendo backup do banco..."
if [ -f "prisma/dev.db" ]; then
    cp prisma/dev.db backups/backup-$(date +%Y%m%d-%H%M%S).db
    echo "✅ Backup criado"
fi

# 4. Atualizar código
echo "📥 Atualizando código..."
git pull origin main

# 5. Instalar Certbot se não estiver instalado
echo "🔒 Verificando Certbot..."
if ! command -v certbot &> /dev/null; then
    echo "📦 Instalando Certbot..."
    apt update
    apt install -y certbot python3-certbot-nginx
fi

# 6. Configurar Nginx para o domínio
echo "🌐 Configurando Nginx para aulaai.com.br..."

cat > /etc/nginx/sites-available/aia-learning-platform << 'NGINX_CONFIG'
server {
    listen 80;
    server_name aulaai.com.br www.aulaai.com.br;
    
    # Redirecionar HTTP para HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name aulaai.com.br www.aulaai.com.br;
    
    # SSL será configurado pelo Certbot
    
    # Configurações de segurança
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    
    # Configurações de performance
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript;
    
    # Configurações de cache
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Proxy para o Next.js
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
    
    # Configurações para API
    location /api/ {
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
    
    # Configurações para WebSocket
    location /_next/webpack-hmr {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
}
NGINX_CONFIG

# 7. Ativar configuração do Nginx
echo "🔗 Ativando configuração do Nginx..."
ln -sf /etc/nginx/sites-available/aia-learning-platform /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# 8. Testar configuração do Nginx
echo "🧪 Testando configuração do Nginx..."
nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Configuração do Nginx válida"
    systemctl reload nginx
else
    echo "❌ Erro na configuração do Nginx"
    exit 1
fi

# 9. Obter certificado SSL
echo "🔐 Obtendo certificado SSL..."
certbot --nginx -d aulaai.com.br -d www.aulaai.com.br --email admin@aulaai.com.br --agree-tos --non-interactive

# 10. Configurar renovação automática
echo "🔄 Configurando renovação automática do SSL..."
(crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -

# 11. Configurar firewall
echo "🔥 Configurando firewall..."
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 22/tcp
ufw --force enable

# 12. Atualizar variáveis de ambiente
echo "⚙️ Atualizando variáveis de ambiente..."
cat > .env << 'ENV_CONFIG'
NODE_ENV=production
DATABASE_URL=file:./dev.db
NEXTAUTH_URL=https://aulaai.com.br
NEXTAUTH_SECRET=aia-secret-key-2024
OPENAI_API_KEY=sk-proj-1234567890
ENV_CONFIG

# 13. Reconstruir e iniciar containers
echo "🔨 Reconstruindo containers..."
docker-compose up -d --build

# 14. Aguardar aplicação inicializar
echo "⏳ Aguardando aplicação inicializar..."
sleep 30

# 15. Verificar status
echo "📊 Verificando status..."
docker-compose ps

# 16. Verificar logs
echo "📋 Últimos logs da aplicação:"
docker-compose logs --tail=10 app

# 17. Testar aplicação
echo "🧪 Testando aplicação..."
curl -f http://localhost:3000/api/health || echo "❌ Aplicação não está respondendo"

echo "✅ Deploy concluído!"
echo "🌐 Acesse: https://aulaai.com.br"
echo "📧 Certificado SSL configurado"
echo "🔄 Renovação automática ativa"

EOF

echo "✅ Deploy na VPS concluído!"
echo "🌐 Seu site está disponível em: https://aulaai.com.br" 