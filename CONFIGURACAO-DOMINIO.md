# 🌐 Configuração do Domínio aulaai.com.br e HTTPS

## 📋 Pré-requisitos

1. **Domínio configurado**: aulaai.com.br deve apontar para o IP da sua VPS
2. **Acesso SSH** à VPS
3. **IP da VPS** (substitua `SEU_IP_VPS` nos comandos)

## 🚀 Passo a Passo

### 1. Configurar DNS do Domínio

No seu provedor de domínio (GoDaddy, Namecheap, etc.), configure os registros DNS:

```
Tipo: A
Nome: @
Valor: SEU_IP_VPS
TTL: 300

Tipo: A
Nome: www
Valor: SEU_IP_VPS
TTL: 300
```

### 2. Conectar na VPS e Executar Script

```bash
# Conectar na VPS
ssh root@SEU_IP_VPS

# Navegar para o diretório do projeto
cd /root/aia-learning-platform

# Dar permissão de execução aos scripts
chmod +x setup-domain.sh
chmod +x deploy-domain.sh

# Executar configuração do domínio
./setup-domain.sh
```

### 3. Verificar Configuração

```bash
# Verificar se o Nginx está rodando
systemctl status nginx

# Verificar certificado SSL
certbot certificates

# Testar configuração
curl -I https://aulaai.com.br
```

### 4. Fazer Deploy da Aplicação

```bash
# Executar deploy
./deploy-domain.sh
```

## 🔧 Configurações Importantes

### Variáveis de Ambiente

Crie/atualize o arquivo `.env` na VPS:

```env
NODE_ENV=production
DATABASE_URL=file:./dev.db
NEXTAUTH_URL=https://aulaai.com.br
NEXTAUTH_SECRET=sua-chave-secreta-aqui
OPENAI_API_KEY=sua-chave-openai-aqui
```

### Firewall

O script já configura automaticamente:
- Porta 80 (HTTP)
- Porta 443 (HTTPS)
- Porta 22 (SSH)

## 🧪 Testes

Após a configuração, teste:

1. **HTTPS**: https://aulaai.com.br
2. **Redirecionamento**: http://aulaai.com.br (deve redirecionar para HTTPS)
3. **WWW**: https://www.aulaai.com.br
4. **API**: https://aulaai.com.br/api/health

## 🔄 Renovação Automática

O certificado SSL será renovado automaticamente a cada 90 dias.

## 🚨 Troubleshooting

### Erro de Certificado
```bash
# Renovar manualmente
certbot renew --force-renewal
```

### Nginx não inicia
```bash
# Verificar configuração
nginx -t

# Ver logs
tail -f /var/log/nginx/error.log
```

### Aplicação não responde
```bash
# Verificar containers
docker-compose ps

# Ver logs
docker-compose logs app
```

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs: `docker-compose logs app`
2. Teste conectividade: `curl -I https://aulaai.com.br`
3. Verifique DNS: `nslookup aulaai.com.br`

## ✅ Checklist Final

- [ ] DNS configurado corretamente
- [ ] Script de domínio executado
- [ ] Certificado SSL obtido
- [ ] Aplicação respondendo em HTTPS
- [ ] Redirecionamento HTTP → HTTPS funcionando
- [ ] Firewall configurado
- [ ] Renovação automática ativa 