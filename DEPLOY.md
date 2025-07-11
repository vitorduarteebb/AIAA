# 🚀 Deploy da AIA Learning Platform

## Status Atual
✅ **Sistema funcionando localmente na porta 3000**
✅ **Health check funcionando**
✅ **Admin panel acessível**
✅ **Docker configurado**
✅ **Scripts de deploy prontos**

## 🌐 URLs de Acesso

### Local (Desenvolvimento)
- **Frontend**: http://localhost:3000
- **Admin**: http://localhost:3000/admin/login
- **Health Check**: http://localhost:3000/api/health
- **Setup Admin**: http://localhost:3000/setup-admin

### VPS (Produção)
- **Frontend**: https://aia.31.97.250.28.nip.io
- **Admin**: https://aia.31.97.250.28.nip.io/admin/login
- **Health Check**: https://aia.31.97.250.28.nip.io/api/health

## 🔧 Comandos Úteis

### Desenvolvimento Local
```bash
# Instalar dependências
npm install

# Gerar cliente Prisma
npx prisma generate

# Sincronizar banco
npx prisma db push

# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar produção local
npm start
```

### Docker Local
```bash
# Deploy local com Docker
./deploy-local.sh

# Ou manualmente:
docker-compose up -d --build
docker-compose ps
docker-compose logs -f
```

### VPS (Produção)
```bash
# Deploy na VPS
./deploy-vps-final.sh

# Verificar status na VPS
ssh root@31.97.250.28 'cd /opt/aia-platform && docker-compose ps'

# Ver logs na VPS
ssh root@31.97.250.28 'cd /opt/aia-platform && docker-compose logs -f'

# Reiniciar na VPS
ssh root@31.97.250.28 'cd /opt/aia-platform && docker-compose restart'
```

## 🐳 Configuração Docker

### Dockerfile
- Base: Node.js 18 Alpine
- OpenSSL configurado para Prisma
- Multi-stage build otimizado
- Health check implementado

### Docker Compose
- App na porta 3000
- Nginx como proxy reverso
- Volumes para persistência
- Restart automático

## 🔐 Configuração de Ambiente

### Variáveis Necessárias
```env
DATABASE_URL="file:./prod.db"
NEXTAUTH_SECRET="sua-chave-secreta"
NEXTAUTH_URL="https://aia.31.97.250.28.nip.io"
OPENAI_API_KEY="sua-chave-openai"
```

## 📊 Monitoramento

### Health Check
- Endpoint: `/api/health`
- Verifica conexão com banco
- Retorna status da aplicação

### Logs
```bash
# Logs da aplicação
docker-compose logs app

# Logs do Nginx
docker-compose logs nginx

# Todos os logs
docker-compose logs -f
```

## 🚨 Troubleshooting

### Problemas Comuns

1. **Erro de OpenSSL no Docker**
   - ✅ Resolvido: Instalando `openssl` e `openssl-dev` no Alpine

2. **Erro de "use client" no layout**
   - ✅ Resolvido: Criando ChatWrapper separado

3. **Erro de cache do Next.js**
   - ✅ Resolvido: Limpando pasta `.next`

4. **Erro de build do Prisma**
   - ✅ Resolvido: Configurando DATABASE_URL para build

### Comandos de Recuperação
```bash
# Limpar cache
rm -rf .next
npm run dev

# Reconstruir Docker
docker-compose down
docker system prune -f
docker-compose up -d --build

# Resetar banco
rm dev.db
npx prisma db push
```

## 📝 Próximos Passos

1. **Configurar domínio real** (opcional)
2. **Configurar SSL/HTTPS**
3. **Configurar backup automático**
4. **Configurar monitoramento**
5. **Otimizar performance**

## 🎯 Deploy Rápido

Para fazer deploy na VPS rapidamente:

```bash
# 1. Commit das mudanças
git add .
git commit -m "Deploy final"
git push

# 2. Executar deploy
./deploy-vps-final.sh

# 3. Verificar status
curl https://aia.31.97.250.28.nip.io/api/health
```

## 📞 Suporte

Se houver problemas:
1. Verificar logs: `docker-compose logs -f`
2. Verificar health check: `curl /api/health`
3. Verificar status dos containers: `docker-compose ps`
4. Reiniciar se necessário: `docker-compose restart` 