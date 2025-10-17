# 🚀 Instruções de Deploy - CRM Mais de Nós

## 📋 Pré-requisitos

- ✅ Conta no Vercel (gratuita)
- ✅ Projeto CRM compilado
- ✅ Build realizado com sucesso

## 🎯 Passo a Passo para Deploy

### 1. Acesse o Vercel
- Vá para: [vercel.com](https://vercel.com)
- Faça login ou crie uma conta gratuita

### 2. Crie Novo Projeto
- Clique em **"New Project"**
- Escolha **"Import Git Repository"** ou **"Upload Files"**

### 3. Configure o Projeto

#### Se usando Git:
- Conecte seu repositório GitHub/GitLab
- Selecione o repositório `crm-maisdenos`

#### Se fazendo upload:
- Faça upload da pasta `crm-maisdenos` completa
- Ou crie um arquivo ZIP com todos os arquivos

### 4. Configurações de Build

O Vercel deve detectar automaticamente:
- **Framework:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### 5. Variáveis de Ambiente (Opcional)

Se precisar configurar variáveis:
- **NODE_ENV:** `production`
- **VITE_SUPABASE_URL:** `https://sdgdcmejzthicgwinuze.supabase.co`
- **VITE_SUPABASE_ANON_KEY:** `sua_chave_aqui`

### 6. Deploy

- Clique em **"Deploy"**
- Aguarde o processo (2-3 minutos)
- O Vercel criará uma URL automática

## 🔐 Acesso ao CRM

### URLs de Acesso:
- **Produção:** `https://seu-projeto.vercel.app`
- **Preview:** `https://seu-projeto-git-branch.vercel.app`

### Credenciais de Login:
```
Email: admin@maisdenos.online
Senha: [sua senha configurada no Supabase]

Email: contato@maisdenos.online
Senha: [sua senha configurada no Supabase]

Email: gestao@maisdenos.online
Senha: [sua senha configurada no Supabase]
```

## 🛠️ Funcionalidades Disponíveis

### Dashboard
- ✅ Estatísticas em tempo real
- ✅ Gráficos de doações
- ✅ Usuários recentes
- ✅ Resumo geral

### Gestão de Usuários
- ✅ Lista de todos os usuários
- ✅ Busca e filtros
- ✅ Visualizar detalhes
- ✅ Editar informações

### Gestão de Doações
- ✅ Histórico completo
- ✅ Filtros por data/valor
- ✅ Exportar dados
- ✅ Status das doações

### Gestão de Eventos
- ✅ Criar novos eventos
- ✅ Editar eventos existentes
- ✅ Gerenciar participantes
- ✅ Calendário de eventos

### Gestão de Voluntários
- ✅ Cadastro de voluntários
- ✅ Lista completa
- ✅ Contato direto
- ✅ Histórico de participação

## 📱 Design Responsivo

O CRM funciona perfeitamente em:
- ✅ **Desktop** - Interface completa
- ✅ **Tablet** - Layout adaptado
- ✅ **Mobile** - Menu lateral responsivo

## 🔧 Troubleshooting

### Problemas Comuns:

#### 1. Erro de Build
```
Solução: Verifique se todas as dependências estão no package.json
```

#### 2. Erro de Login
```
Solução: Verifique as credenciais no Supabase
```

#### 3. Página em Branco
```
Solução: Verifique o console do navegador para erros
```

#### 4. Erro 404
```
Solução: Verifique se o vercel.json está configurado corretamente
```

## 📞 Suporte

Para suporte técnico:
- 📧 Email: contato@maisdenos.online
- 💬 Discord: [Link do servidor]
- 📱 WhatsApp: [Número de contato]

## 🎉 Pronto!

Após o deploy, seu CRM estará disponível 24/7 com:
- ✅ **Alta disponibilidade**
- ✅ **Backup automático**
- ✅ **SSL gratuito**
- ✅ **CDN global**
- ✅ **Deploy automático** (se conectado ao Git)

**Boa sorte com o deploy!** 🚀
