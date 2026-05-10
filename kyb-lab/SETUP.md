# Setup: KyB LAB Dashboard + Supabase + Vercel

## 🚀 Próximos Passos

Você agora tem um projeto Vite + React pronto para o Supabase. Siga estes passos para colocar o dashboard online:

---

## 1️⃣ Criar Projeto no Supabase (3 min)

1. Acesse [supabase.com](https://supabase.com)
2. Clique em **"New Project"**
3. Escolha:
   - **Organization**: Sua organização pessoal
   - **Name**: `kyb-lab-briefing` (ou outro nome)
   - **Database Password**: Salve em local seguro
   - **Region**: Deixe o padrão
4. Clique **"Create new project"** e aguarde ~2 minutos

---

## 2️⃣ Rodar SQL para Criar as Tabelas (2 min)

Após o projeto ser criado:

1. No painel do Supabase, abra **SQL Editor** (lado esquerdo)
2. Clique em **"New Query"**
3. Cole o SQL abaixo completo:

```sql
-- Clientes (draft atual de cada cliente)
create table clients (
  id uuid default gen_random_uuid() primary key,
  client_id text unique not null,
  client_name text not null,
  answers jsonb default '{}'::jsonb,
  updated_at timestamptz default now()
);

-- Snapshots (briefings salvos/finalizados)
create table briefing_snapshots (
  id uuid default gen_random_uuid() primary key,
  client_id text not null,
  client_name text not null,
  answers jsonb default '{}'::jsonb,
  saved_at timestamptz default now()
);

-- Metadata admin (checklist, links, playlist por cliente)
create table client_meta (
  id uuid default gen_random_uuid() primary key,
  client_id text unique not null,
  checklist jsonb default '{}'::jsonb,
  links jsonb default '[]'::jsonb,
  playlist text default '',
  updated_at timestamptz default now()
);

-- RLS: anon key pode ler e escrever (auth é pelo app)
alter table clients enable row level security;
alter table briefing_snapshots enable row level security;
alter table client_meta enable row level security;

create policy "public_all" on clients for all using (true) with check (true);
create policy "public_all" on briefing_snapshots for all using (true) with check (true);
create policy "public_all" on client_meta for all using (true) with check (true);
```

4. Clique em **"Run"** (botão verde)
5. Aguarde até ver ✅ "Success"

---

## 3️⃣ Copiar Credenciais Supabase (1 min)

1. No painel do Supabase, abra **Settings** (engrenagem inferior esquerdo)
2. Clique em **"API"**
3. Copie:
   - **Project URL** (algo como `https://xxxx.supabase.co`)
   - **anon public** key (a chave longa que começa com `eyJ...`)

---

## 4️⃣ Criar Arquivo `.env` Local (2 min)

Na pasta `kyb-lab/`, crie um arquivo chamado `.env` (sem extensão):

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_aqui
VITE_ADMIN_PASSWORD=kyblab2025
VITE_ADMIN_PHONE=55859999999
```

**Substitua:**
- `https://seu-projeto.supabase.co` → URL do seu projeto
- `sua_chave_aqui` → anon key
- `55859999999` → Seu número WhatsApp (com código país + DDD, sem espaços ou hífens)

---

## 5️⃣ Testar Localmente (5 min)

Na pasta `kyb-lab/`:

```bash
npm install
npm run dev
```

Abra [http://localhost:5173](http://localhost:5173) no navegador.

**Teste:**
1. Clique em **"Sou cliente"**
2. Digite seu nome
3. Preencha algumas respostas
4. Clique **"Salvar Briefing"**
5. Volte ao Supabase → **SQL Editor** → crie uma nova query:

```sql
select * from briefing_snapshots limit 10;
```

Se vir os dados, está funcionando! ✅

---

## 6️⃣ Deploy no Vercel (5 min)

### Opção A: CLI (Recomendado)

```bash
cd kyb-lab
npm install -g vercel  # Se ainda não tem
vercel
```

Responda as perguntas e siga o fluxo.

### Opção B: Painel do Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Clique em **"Add New"** → **"Project"**
3. Conecte seu repositório Git (GitHub, GitLab, etc.)
4. Clique em **"kyb-lab"**
5. Em **Environment Variables**, adicione os 4 valores do `.env`
6. Clique **"Deploy"**

---

## 7️⃣ Adicionar Variáveis ao Vercel (3 min)

Após o deploy, adicione as variáveis de ambiente:

1. No painel do Vercel, clique no projeto `kyb-lab`
2. Abra **Settings** → **Environment Variables**
3. Adicione os 4 valores:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_ADMIN_PASSWORD`
   - `VITE_ADMIN_PHONE`
4. Clique em **"Save"**
5. Redeploy (na aba **Deployments**, clique os 3 pontinhos → **Redeploy**)

---

## ✅ Pronto!

Seu dashboard está live! 

**URL do seu site:** `https://kyb-lab.vercel.app` (ou outro domínio configurado)

**Login:**
- **Admin**: Senha = seu `VITE_ADMIN_PASSWORD`
- **Cliente**: Qualquer nome

---

## 📝 Troubleshooting

| Problema | Solução |
|---|---|
| "Faltam variáveis VITE_SUPABASE_URL" | Verifique se o `.env` está na pasta raiz (`kyb-lab/`) |
| "Erro ao conectar Supabase" | Confirme URL e chave estão corretos (sem espaços extras) |
| "Dados não salvam" | Verifique as tabelas no Supabase (SQL Editor) estão criadas |
| "Vercel mostra erro de build" | Rode `npm install` local e tente de novo |

---

## 🔐 Notas de Segurança

- **`.env` nunca comita**: Já está no `.gitignore`
- **Supabase RLS**: Configurado como público (anon key)
- **Senha admin**: Mude de `kyblab2025` em produção
- **Dados sensíveis**: Nunca coloque em código-fonte

---

## 📞 Suporte

Qualquer dúvida sobre Supabase: [docs.supabase.com](https://docs.supabase.com)
Dúvidas sobre Vercel: [vercel.com/docs](https://vercel.com/docs)
