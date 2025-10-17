@echo off
echo ========================================
echo    CRM Mais de Nos - Setup GitHub
echo ========================================
echo.

echo 1. Criando repositorio no GitHub...
echo    - Acesse: https://github.com
echo    - Clique em "New repository"
echo    - Nome: crm-maisdenos
echo    - Descricao: Sistema de gerenciamento administrativo
echo    - Publico ou Privado
echo    - NAO marque README, .gitignore ou license
echo.

echo 2. Apos criar o repositorio, execute:
echo    git remote add origin https://github.com/SEU_USUARIO/crm-maisdenos.git
echo    git branch -M main
echo    git push -u origin main
echo.

echo 3. Deploy no Vercel:
echo    - Acesse: https://vercel.com
echo    - Importe o repositorio crm-maisdenos
echo    - Deploy automatico!
echo.

echo ========================================
echo    Projeto pronto para deploy!
echo ========================================
pause
