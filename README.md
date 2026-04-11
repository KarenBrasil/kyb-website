# 🚀 KyB - Landing Page

Landing page profissional para KyB - Estratégia, Conteúdo e Tráfego para Marcas.

## 📋 Estrutura

- **index.html** - Página principal com todas as seções
- **styles.css** - Estilos e animações (Boaz-inspired)
- **script.js** - Funcionalidades interativas
- **vercel.json** - Configuração para deploy no Vercel
- **package.json** - Metadados do projeto

## 🎨 Características

✅ Design responsivo (Desktop, Tablet, Mobile)  
✅ Animações suaves (Scroll reveals, hover effects)  
✅ Loader animado  
✅ FAQ com accordion  
✅ Marquee infinito (social proof)  
✅ CTA para WhatsApp integrado  
✅ Performance otimizada  

## 🚀 Deploy no Vercel

### Opção 1: Via GitHub (Recomendado)

1. **Crie um repositório no GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: KyB landing page"
   git branch -M main
   git remote add origin https://github.com/[seu-usuario]/kyb-website.git
   git push -u origin main
   ```

2. **Conecte ao Vercel**
   - Vá para https://vercel.com/
   - Clique em "New Project"
   - Selecione o repositório `kyb-website`
   - Clique em "Deploy"

### Opção 2: Vercel CLI (Rápido)

```bash
npm i -g vercel
cd kyb-website
vercel
```

Siga as instruções na tela.

## 🔗 URLs

Após deploy, sua página estará disponível em:
- `https://kyb-website.vercel.app`
- Ou com domínio customizado (adicionar depois)

## 📝 Configurações

### WhatsApp
Número atual: `85 998370928`

Para mudar, edite em `index.html`:
```html
href="https://wa.me/5585998370928"
```

### Domínio Customizado
Após ter um domínio:
1. Acesse Dashboard do Vercel
2. Vá para "Settings" > "Domains"
3. Adicione seu domínio

## 🛠️ Desenvolvimento Local

```bash
# Teste localmente
python -m http.server 3000

# Abra no navegador
# http://localhost:3000
```

## 📊 SEO & Metadata

Otimizar título, descrição e keywords em `index.html`:

```html
<title>KyB - Estratégia, Conteúdo e Tráfego para Marcas</title>
<meta name="description" content="...">
```

## 🎯 Próximas Melhorias

- [ ] Adicionar Google Analytics
- [ ] Otimizar imagens
- [ ] Implementar formulário de contato
- [ ] Adicionar blog/casos
- [ ] Dark mode toggle

## 📞 Contato

WhatsApp: 85 998370928

---

**Criado em:** 11/04/2026  
**Status:** Pronto para produção
