#!/bin/bash

echo "🚀 Configurando VPS para aulaai.com.br..."

# 1. Navegar para o diretório
cd /root/aia-learning-platform

# 2. Instalar Certbot
echo "📦 Instalando Certbot..."
apt update
apt install -y certbot python3-certbot-nginx

# 3. Configurar Nginx
echo "🌐 Configurando Nginx..."
cat > /etc/nginx/sites-available/aia-learning-platform << 'EOF'
server {
    listen 80;
    server_name aulaai.com.br www.aulaai.com.br;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name aulaai.com.br www.aulaai.com.br;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# 4. Ativar site
ln -sf /etc/nginx/sites-available/aia-learning-platform /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

# 5. Obter SSL
echo "🔐 Obtendo certificado SSL..."
certbot --nginx -d aulaai.com.br -d www.aulaai.com.br --email admin@aulaai.com.br --agree-tos --non-interactive

# 6. Configurar ambiente
cat > .env << 'EOF'
NODE_ENV=production
DATABASE_URL=file:./dev.db
NEXTAUTH_URL=https://aulaai.com.br
NEXTAUTH_SECRET=aia-secret-key-2024
OPENAI_API_KEY=sk-proj-1234567890
EOF

# 7. Iniciar aplicação
echo "🔨 Iniciando aplicação..."
docker-compose up -d --build

echo "✅ Configuração concluída!"
echo "🌐 Acesse: https://aulaai.com.br" 