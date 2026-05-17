# KyB CRM — Guia de Instalação e Setup

## Pré-requisitos

Antes de começar, instale na sua máquina:

- **Node.js** versão 18 ou superior → https://nodejs.org
- **Git** (opcional, mas recomendado) → https://git-scm.com

---

## 1. Local de instalação recomendado

Coloque a pasta `kyb` diretamente na Área de Trabalho, **fora do OneDrive**:

```
C:\Users\Karen\Desktop\kyb\
```

> ⚠️ Não coloque dentro do OneDrive — o SQLite pode ter conflito com a sincronização automática.

---

## 2. Instalação das dependências

Abra o terminal dentro da pasta `kyb` e execute:

```bash
# Instalar dependências raiz
npm install

# Instalar dependências do backend
cd backend
npm install
cd ..

# Instalar dependências do frontend
cd frontend
npm install
cd ..
```

---

## 3. Configurar o banco de dados

Dentro da pasta `backend`:

```bash
cd backend

# Criar o banco SQLite e rodar as migrações
npx prisma migrate dev --name init

# Popular com os dados iniciais da KyB
node prisma/seed.js

cd ..
```

Isso vai criar o arquivo `backend/kyb.db` com todos os dados iniciais já preenchidos.

---

## 4. Rodar o sistema

Na pasta raiz `kyb`, execute:

```bash
npm run dev
```

Isso inicia **backend e frontend ao mesmo tempo**.

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3001

---

## 5. Login

Acesse http://localhost:5173 no navegador.

```
Email: karen@kyb.com
Senha: kyb2025
```

> Troque a senha depois do primeiro acesso editando o arquivo `backend/.env` e rodando `node prisma/seed.js` novamente.

---

## 6. Estrutura de pastas

```
kyb/
├── package.json              ← Scripts para rodar tudo junto
├── README.md                 ← Este arquivo
│
├── backend/
│   ├── .env                  ← Configurações do banco e JWT
│   ├── prisma/
│   │   ├── schema.prisma     ← Estrutura do banco de dados
│   │   └── seed.js           ← Dados iniciais da KyB
│   └── src/
│       ├── server.js         ← Servidor Express principal
│       ├── middleware/
│       │   └── auth.js       ← Autenticação JWT
│       └── routes/           ← Endpoints de cada módulo
│           ├── auth.js
│           ├── dashboard.js
│           ├── references.js
│           ├── ideas.js
│           ├── assets.js
│           ├── scripts.js
│           ├── prompts.js
│           ├── checklists.js
│           ├── ugc.js
│           ├── library.js
│           ├── acervo.js
│           ├── tools.js
│           ├── subniches.js
│           └── metadata.js
│
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── src/
        ├── main.jsx          ← Entrada do React
        ├── App.jsx           ← Rotas e layout principal
        ├── index.css         ← Design system KyB (dark mode)
        ├── lib/
        │   └── api.js        ← Cliente HTTP (axios)
        ├── stores/
        │   └── useStore.js   ← Estado global (Zustand)
        ├── components/
        │   ├── ui/           ← Componentes reutilizáveis
        │   └── layout/
        │       └── Sidebar.jsx
        └── pages/
            ├── Login.jsx
            └── Modules.jsx   ← Todos os 11 módulos
```

---

## 7. Módulos disponíveis

| # | Módulo | Rota |
|---|--------|------|
| 01 | Dashboard | / |
| 02 | Referências | /references |
| 03 | Banco de Ideias | /ideas |
| 04 | Ativos Criativos | /assets |
| 05 | Roteiros | /scripts |
| 06 | Prompts | /prompts |
| 07 | Checklists | /checklists |
| 08 | UGC & Portfólio | /ugc |
| 09 | Biblioteca de Ideias | /library |
| 10 | Acervo | /acervo |
| 11 | Ferramentas | /tools |

---

## 8. Solução de problemas comuns

**Erro: "Cannot find module @prisma/client"**
```bash
cd backend && npx prisma generate
```

**Porta 3001 ou 5173 já em uso**
```bash
# Encontrar o processo e fechar
netstat -ano | findstr :3001
taskkill /PID [número] /F
```

**Banco de dados corrompido**
```bash
cd backend
del kyb.db
npx prisma migrate dev --name init
node prisma/seed.js
```

**Frontend não conecta com o backend**
Verifique se o arquivo `backend/.env` tem:
```
DATABASE_URL="file:./kyb.db"
PORT=3001
FRONTEND_URL="http://localhost:5173"
```

---

## 9. Deploy público (quando quiser acessar de qualquer lugar)

Para deixar o sistema acessível publicamente, as opções recomendadas são:

- **Railway.app** — deploy automático do backend + banco PostgreSQL gratuito
- **Vercel** — deploy do frontend com variável `VITE_API_URL` apontando para o backend
- **Render.com** — alternativa gratuita para backend Node.js

Ao fazer deploy, troque no `.env`:
- `DATABASE_URL` → string de conexão do PostgreSQL
- `JWT_SECRET` → uma chave secreta forte e única
- `FRONTEND_URL` → URL pública do frontend

---

*KyB CRM v1.0 — Sistema interno KyB*
