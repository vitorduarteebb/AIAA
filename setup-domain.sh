#!/bin/bash

# Script para configurar domínio aulaai.com.br e HTTPS
# Execute este script na sua VPS

DOMAIN="aulaai.com.br"
EMAIL="admin@aulaai.com.br"

echo "🚀 Configurando domínio $DOMAIN e HTTPS..."

# 1. Atualizar sistema
echo "📦 Atualizando sistema..."
apt update && apt upgrade -y

# 2. Instalar Certbot para SSL
echo "🔒 Instalando Certbot..."
apt install -y certbot python3-certbot-nginx

# 3. Configurar Nginx para o domínio
echo "🌐 Configurando Nginx para $DOMAIN..."

cat > /etc/nginx/sites-available/aia-learning-platform << 'EOF'
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
    
    # Configurações para WebSocket (se necessário)
    location /_next/webpack-hmr {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
}
EOF

# 4. Ativar o site
echo "🔗 Ativando configuração do site..."
ln -sf /etc/nginx/sites-available/aia-learning-platform /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# 5. Testar configuração do Nginx
echo "🧪 Testando configuração do Nginx..."
nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Configuração do Nginx válida"
    systemctl reload nginx
else
    echo "❌ Erro na configuração do Nginx"
    exit 1
fi

# 6. Obter certificado SSL
echo "🔐 Obtendo certificado SSL..."
certbot --nginx -d aulaai.com.br -d www.aulaai.com.br --email $EMAIL --agree-tos --non-interactive

# 7. Configurar renovação automática
echo "🔄 Configurando renovação automática do SSL..."
(crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -

# 8. Configurar firewall
echo "🔥 Configurando firewall..."
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 22/tcp
ufw --force enable

# 9. Verificar status
echo "📊 Verificando status dos serviços..."
systemctl status nginx --no-pager -l
systemctl status docker --no-pager -l

echo "✅ Configuração concluída!"
echo "🌐 Seu site estará disponível em: https://aulaai.com.br"
echo "📧 Certificado SSL configurado para: $EMAIL"
echo "🔄 Renovação automática configurada" 