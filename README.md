# Conexão Hospitalar - Frontend (Next.js)

## 🌐 Pré-requisitos
- Node.js 22.14+ ([Download](https://nodejs.org/pt-br/))
- npm 10+ (vem com Node.js)
- Git instalado

## 🛠️ Configuração do Frontend

1. **Clonar e acessar pasta**:
```cmd
git clone https://github.com/eligado/Conexao-Hospitalar---Frontend.git
cd Conexao-Hospitalar---Frontend
```
2. **Instalar dependências:**
```cmd
npm install
```
3. **Rodar aplicação:**
```cmd
npm run dev
```
Acesse: http://localhost:3000

## 🔄 Integração com Backend
- Certifique-se que o backend Django está rodando em http://localhost:8000
- A API será acessada via proxy configurado em `next.config.js`

## Problemas Comuns
- Porta 3000 ocupada: Use `npm run dev -- -p 3001`
- Erros de API: Verifique se o backend está rodando
- Dependências faltando: Delete `node_modules` e rode `npm install`

## ⚡ Dicas Rápidas
- Sempre teste em modo produção: npm run build && npm start
- Use `eslint` para verificar erros: `npm run lint`

## 🛠️ Contribuição (Importante!)

⚠️ **Aviso para Desenvolvedores:**
```diff
- NUNCA TRABALHE DIRETAMENTE NA BRANCH MAIN!
+ Sempre crie e utilize uma nova branch para suas alterações!
```

**Passos Seguros:**
1. Crie uma nova branch a partir da `main`:
```cmd
git checkout main
git pull origin main
git checkout -b feature/nome-da-sua-feature
```

2. Trabalhe APENAS na sua branch:
```cmd
git add .
git commit -m "Descrição clara das mudanças"
git push origin feature/nome-da-sua-feature
```

3. Abra um **Pull Request** para revisão antes de mesclar com a `main`

🔒 A branch `main` está protegida - mudanças só serão aceitas via Pull Request aprovado!

