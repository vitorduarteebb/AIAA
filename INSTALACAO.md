# 🚀 Guia de Instalação Rápida - AIA

## Pré-requisitos

- Node.js 18+ instalado
- PostgreSQL instalado e rodando
- npm ou yarn

## Passos para Executar

### 1. Instalar Dependências
```bash
npm install
```

### 2. Configurar Banco de Dados
```bash
# Copiar arquivo de exemplo
cp env.example .env.local

# Editar .env.local com suas configurações
# DATABASE_URL="postgresql://user:password@localhost:5432/aia_db"
```

### 3. Configurar Prisma
```bash
# Gerar cliente Prisma
npx prisma generate

# Criar banco de dados
npx prisma db push
```

### 4. Executar Projeto
```bash
npm run dev
```

### 5. Acessar Aplicação
```
http://localhost:3000
```

## 🐳 Usando Docker (Alternativa)

### Opção 1: Docker Compose (Recomendado)
```bash
# Iniciar todos os serviços
docker-compose up -d

# Acessar aplicação
http://localhost:3000
```

### Opção 2: Docker Individual
```bash
# Construir imagem
docker build -t aia-platform .

# Executar container
docker run -p 3000:3000 aia-platform
```

## 📱 Testando PWA

1. Abra o projeto no Chrome/Edge
2. Clique no botão "Instalar App" na página inicial
3. Ou use o menu do navegador (ícone de instalação)
4. O app será instalado como aplicativo nativo

## 🔧 Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Executar produção
npm start

# Verificar tipos TypeScript
npm run type-check

# Linting
npm run lint

# Resetar banco de dados
npx prisma db push --force-reset

# Abrir Prisma Studio
npx prisma studio
```

## 🚨 Solução de Problemas

### Erro de Dependências
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Erro de Banco de Dados
```bash
# Verificar conexão
npx prisma db pull

# Resetar schema
npx prisma db push --force-reset
```

### Erro de Build
```bash
# Limpar cache do Next.js
rm -rf .next
npm run build
```

## 📞 Suporte

Se encontrar problemas:
1. Verifique se todas as dependências estão instaladas
2. Confirme se o PostgreSQL está rodando
3. Verifique as variáveis de ambiente no `.env.local`
4. Consulte o README.md completo para mais detalhes

---

**AIA - Transformando o aprendizado com IA** 🚀 