# 🚀 Instruções para Deploy na VPS

## 📋 Passos para Deploy

### 1. **Conectar na VPS**
```bash
ssh root@31.97.250.28
```

### 2. **Executar o Script de Deploy**
```bash
# Criar e executar o script
cat > /tmp/deploy.sh << 'EOF'
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
EOF

# Dar permissão e executar
chmod +x /tmp/deploy.sh
/tmp/deploy.sh
```

### 3. **Verificar se Deu Certo**
```bash
# Verificar se os containers estão rodando
docker ps

# Verificar se a aplicação está respondendo
curl http://localhost/health

# Ver logs se necessário
docker-compose -f /opt/aia-platform/AIAA/docker-compose.prod.yml logs -f
```

## 🌐 URLs de Acesso

Após o deploy bem-sucedido:

- **Frontend**: http://31.97.250.28
- **Admin**: http://31.97.250.28/admin/login
- **Setup Admin**: http://31.97.250.28/setup-admin
- **Health Check**: http://31.97.250.28/health

## 🔐 Configuração do Admin

1. Acesse: http://31.97.250.28/setup-admin
2. Crie o primeiro administrador
3. Use as credenciais para acessar o painel admin

## 📊 Comandos de Monitoramento

```bash
# Ver status dos containers
docker-compose -f /opt/aia-platform/AIAA/docker-compose.prod.yml ps

# Ver logs da aplicação
docker-compose -f /opt/aia-platform/AIAA/docker-compose.prod.yml logs -f app

# Ver logs do Nginx
docker-compose -f /opt/aia-platform/AIAA/docker-compose.prod.yml logs -f nginx

# Reiniciar aplicação
docker-compose -f /opt/aia-platform/AIAA/docker-compose.prod.yml restart

# Parar aplicação
docker-compose -f /opt/aia-platform/AIAA/docker-compose.prod.yml down

# Iniciar aplicação
docker-compose -f /opt/aia-platform/AIAA/docker-compose.prod.yml up -d
```

## 🛠️ Solução de Problemas

### Se a aplicação não subir:
```bash
# Verificar logs
docker-compose -f /opt/aia-platform/AIAA/docker-compose.prod.yml logs app

# Verificar se as portas estão livres
netstat -tulpn | grep :80
netstat -tulpn | grep :3000

# Reiniciar Docker se necessário
systemctl restart docker
```

### Se precisar fazer backup:
```bash
cd /opt/aia-platform/AIAA
cp prisma/prod.db prisma/prod.db.backup.$(date +%Y%m%d_%H%M%S)
```

## ✅ Checklist Final

- [ ] SSH conectado na VPS
- [ ] Script de deploy executado
- [ ] Containers rodando (docker ps)
- [ ] Aplicação respondendo (curl localhost/health)
- [ ] Frontend acessível (http://31.97.250.28)
- [ ] Admin configurado (http://31.97.250.28/setup-admin)

---

**Status**: 🟢 **PRONTO PARA EXECUÇÃO** 