# AIA Learning Platform

Uma plataforma completa de aprendizado com IA integrada, módulos interativos e sistema de quizzes.

## 🚀 Funcionalidades

- **Sistema de Autenticação** - Login/registro de usuários
- **Painel Administrativo** - Gerenciamento completo de conteúdo
- **Módulos de Aprendizado** - Cursos organizados por níveis
- **Lições Interativas** - Conteúdo rico com imagens, vídeos e código
- **Sistema de Quizzes** - Perguntas com pontuação personalizada
- **Chat com IA** - Assistente inteligente integrado
- **Ranking e Gamificação** - Sistema de pontos e níveis
- **Interface Responsiva** - Funciona em desktop e mobile

## 🛠️ Tecnologias

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Banco de Dados**: SQLite (desenvolvimento) / PostgreSQL (produção)
- **Autenticação**: JWT com bcrypt
- **Deploy**: Docker, Nginx

## 📦 Instalação Local

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Passos

1. **Clone o repositório**
```bash
git clone https://github.com/vitorduarteebb/AIAA.git
cd AIAA
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env.local
# Edite o arquivo .env.local com suas configurações
```

4. **Configure o banco de dados**
```bash
npx prisma generate
npx prisma db push
```

5. **Execute o projeto**
```bash
npm run dev
```

6. **Acesse a aplicação**
- Frontend: http://localhost:3000
- Admin: http://localhost:3000/admin/login

## 🚀 Deploy em Produção

### VPS Ubuntu 24.04

1. **Conecte-se à VPS**
```bash
ssh root@31.97.250.28
```

2. **Clone o projeto**
```bash
cd /opt
git clone https://github.com/vitorduarteebb/AIAA.git aia-platform
cd aia-platform
```

3. **Execute o script de deploy**
```bash
chmod +x deploy.sh
./deploy.sh
```

4. **Configure o domínio (opcional)**
```bash
# Edite o arquivo nginx.conf com seu domínio
# Configure SSL com Let's Encrypt
```

### Docker Compose

```bash
# Construir e iniciar
docker-compose -f docker-compose.prod.yml up -d --build

# Verificar logs
docker-compose -f docker-compose.prod.yml logs -f

# Parar
docker-compose -f docker-compose.prod.yml down
```

## 📁 Estrutura do Projeto

```
aia-platform/
├── app/                    # Next.js App Router
│   ├── admin/             # Painel administrativo
│   ├── api/               # API Routes
│   ├── dashboard/         # Dashboard do usuário
│   ├── modules/           # Páginas de módulos
│   └── lessons/           # Páginas de lições
├── components/            # Componentes React
├── lib/                   # Utilitários e configurações
├── prisma/               # Schema e migrações do banco
├── public/               # Arquivos estáticos
└── types/                # Definições TypeScript
```

## 🔧 Configuração do Admin

1. Acesse `/setup-admin` para criar o primeiro administrador
2. Use as credenciais para acessar o painel admin
3. Configure cursos, módulos, lições e quizzes

## 📊 Monitoramento

- **Health Check**: `/api/health`
- **Logs**: `docker-compose logs -f app`
- **Backup**: Automático do banco de dados

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

Para suporte, envie um email para suporte@aia.com ou abra uma issue no GitHub.

---

**AIA Learning Platform** - Transformando a educação com tecnologia e IA 🤖✨ 