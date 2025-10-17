# 🚀 Configuração do Repositório GitHub

## 📋 Passos para Criar o Repositório

### 1. Acesse o GitHub
- Vá para: [github.com](https://github.com)
- Faça login ou crie uma conta

### 2. Crie Novo Repositório
- Clique em **"New repository"** (botão verde)
- **Nome do repositório:** `crm-maisdenos`
- **Descrição:** `Sistema de gerenciamento administrativo para a organização Mais de Nós`
- **Visibilidade:** Público (recomendado) ou Privado
- **NÃO marque** "Add a README file" (já temos um)
- **NÃO marque** "Add .gitignore" (já temos um)
- **NÃO marque** "Choose a license" (opcional)

### 3. Conecte o Repositório Local
Após criar o repositório no GitHub, execute estes comandos:

```bash
# Adicione o repositório remoto (substitua SEU_USUARIO pelo seu username do GitHub)
git remote add origin https://github.com/SEU_USUARIO/crm-maisdenos.git

# Renomeie a branch principal para main (se necessário)
git branch -M main

# Faça o push do código
git push -u origin main
```

### 4. Deploy no Vercel
Após o push para o GitHub:

1. **Acesse:** [vercel.com](https://vercel.com)
2. **Faça login** com sua conta GitHub
3. **Clique em "New Project"**
4. **Importe o repositório** `crm-maisdenos`
5. **Configure o projeto:**
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
6. **Clique em "Deploy"**

## 🔐 Credenciais de Acesso

### Emails de Administrador:
- `admin@maisdenos.online`
- `contato@maisdenos.online`
- `gestao@maisdenos.online`

### Senhas:
Configure as senhas no painel do Supabase para estes emails.

## 🛠️ Funcionalidades

- ✅ **Dashboard** - Estatísticas em tempo real
- ✅ **Usuários** - Gerenciamento completo
- ✅ **Doações** - Histórico e relatórios
- ✅ **Eventos** - Criação e gestão
- ✅ **Voluntários** - Cadastro e controle
- ✅ **Autenticação** - Login seguro
- ✅ **Design Responsivo** - Funciona em todos os dispositivos

## 📱 URLs de Acesso

Após o deploy:
- **Produção:** `https://crm-maisdenos.vercel.app`
- **Preview:** `https://crm-maisdenos-git-main.vercel.app`

## 🔧 Tecnologias

- React 18
- Vite
- Supabase
- React Router
- Material Icons
- CSS3

## 📞 Suporte

Para suporte técnico, entre em contato com a equipe de desenvolvimento.

---

**Boa sorte com o deploy!** 🚀
